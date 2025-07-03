import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { SubscriptionStatus } from '@/types';

// Global cache to persist across component unmounts
const subscriptionCache = new Map<string, {
  data: SubscriptionStatus;
  timestamp: number;
  expiresAt: number;
}>();

// Global event emitter for real-time updates across all components
type SubscriptionListener = (status: SubscriptionStatus) => void;
const subscriptionListeners = new Set<SubscriptionListener>();

const emitSubscriptionUpdate = (status: SubscriptionStatus) => {
  subscriptionListeners.forEach(listener => listener(status));
};

// Debounce mechanism to prevent excessive API calls
let refreshTimeout: NodeJS.Timeout | null = null;
const pendingRefreshes = new Set<string>();

const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes (shorter for more frequent updates)
const STALE_WHILE_REVALIDATE_DURATION = 8 * 60 * 1000; // 8 minutes
const DEBOUNCE_DELAY = 500; // 500ms debounce for API calls

export function useSubscription() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasInitialized = useRef(false);
  const currentUserId = useRef<string | null>(null);
  const listenerRef = useRef<SubscriptionListener | null>(null);
  const isComponentMounted = useRef(true);

  const getCacheKey = (userId: string) => `subscription_${userId}`;

  // Create a stable listener function that only updates relevant components
  const createListener = useCallback((userId: string) => {
    return (status: SubscriptionStatus) => {
      // Only update if this is for the current user and component is still mounted
      if (user?.id === userId && isComponentMounted.current) {
        setSubscriptionStatus(status);
      }
    };
  }, [user?.id]);

  // Debounced refresh function to prevent multiple simultaneous API calls
  const debouncedRefresh = useCallback((userId: string, forceRefresh = false) => {
    const cacheKey = getCacheKey(userId);
    
    // If there's already a pending refresh for this user, don't create another
    if (pendingRefreshes.has(cacheKey) && !forceRefresh) {
      return;
    }

    pendingRefreshes.add(cacheKey);

    if (refreshTimeout) {
      clearTimeout(refreshTimeout);
    }

    refreshTimeout = setTimeout(async () => {
      try {
        await checkSubscription(forceRefresh);
      } finally {
        pendingRefreshes.delete(cacheKey);
      }
    }, forceRefresh ? 0 : DEBOUNCE_DELAY);
  }, []);

  const checkSubscription = useCallback(async (forceRefresh = false): Promise<SubscriptionStatus | null> => {
    if (!user || !isComponentMounted.current) return null;
    
    const cacheKey = getCacheKey(user.id);
    const now = Date.now();
    const cached = subscriptionCache.get(cacheKey);

    // Return fresh cache if available and not forcing refresh
    if (!forceRefresh && cached && now < cached.expiresAt) {
      if (!subscriptionStatus || subscriptionStatus.id !== cached.data.id || 
          subscriptionStatus.creditsLeft !== cached.data.creditsLeft) {
        setSubscriptionStatus(cached.data);
      }
      return cached.data;
    }

    // Return stale cache immediately while revalidating in background
    if (!forceRefresh && cached && now < cached.timestamp + STALE_WHILE_REVALIDATE_DURATION) {
      if (!subscriptionStatus || subscriptionStatus.id !== cached.data.id || 
          subscriptionStatus.creditsLeft !== cached.data.creditsLeft) {
        setSubscriptionStatus(cached.data);
      }
      
      // Revalidate in background without blocking
      debouncedRefresh(user.id, true);
      return cached.data;
    }

    // Prevent multiple simultaneous API calls for the same user
    if (pendingRefreshes.has(cacheKey)) {
      return cached?.data || null;
    }

    setIsLoading(true);
    pendingRefreshes.add(cacheKey);

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        // Return cached data if available, even if stale
        if (cached && isComponentMounted.current) {
          setSubscriptionStatus(cached.data);
          return cached.data;
        }
        return null;
      }

      const status: SubscriptionStatus = {
        id: data.id,
        isActive: data.plan_end_date >= new Date().toISOString() && 
                 data.sub_status === 'active' && 
                 data.credits_left > 0,
        creditsLeft: data.credits_left,
        planType: data.plan_type,
        planEndDate: data.plan_end_date
      };
      
      // Update cache
      subscriptionCache.set(cacheKey, {
        data: status,
        timestamp: now,
        expiresAt: now + CACHE_DURATION
      });
      
      if (isComponentMounted.current) {
        setSubscriptionStatus(status);
        
        // Emit update to all listeners for real-time sync
        emitSubscriptionUpdate(status);
      }
      
      return status;
    } catch (error) {
      console.error('Error checking subscription:', error);
      // Return cached data if available
      if (cached && isComponentMounted.current) {
        setSubscriptionStatus(cached.data);
        return cached.data;
      }
      return null;
    } finally {
      setIsLoading(false);
      pendingRefreshes.delete(cacheKey);
    }
  }, [user, subscriptionStatus, debouncedRefresh]);

  const useCredits = useCallback(async (amount: number, usageType: 'draw' | 'learn' | 'story'): Promise<boolean> => {
    if (!user || !subscriptionStatus || !isComponentMounted.current) return false;

    const cacheKey = getCacheKey(user.id);

    // Check if sufficient credits available
    if (subscriptionStatus.creditsLeft < amount) {
      try {
        // Suspend subscription if credits are exhausted
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({ sub_status: 'suspended' })
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error suspending subscription:', updateError);
          return false;
        }

        // Update local state and cache
        const updatedStatus = {
          ...subscriptionStatus,
          isActive: false,
          creditsLeft: 0
        };
        
        // Update cache
        subscriptionCache.set(cacheKey, {
          data: updatedStatus,
          timestamp: Date.now(),
          expiresAt: Date.now() + CACHE_DURATION
        });

        // Emit real-time update to all components
        emitSubscriptionUpdate(updatedStatus);

        return false;
      } catch (error) {
        console.error('Error suspending subscription:', error);
        return false;
      }
    }

    // Calculate new credits optimistically for immediate UI feedback
    const newCreditsLeft = Math.max(0, subscriptionStatus.creditsLeft - amount);
    const isStillActive = newCreditsLeft > 0 && subscriptionStatus.isActive;
    
    const optimisticStatus = {
      ...subscriptionStatus,
      creditsLeft: newCreditsLeft,
      isActive: isStillActive
    };

    // Update cache optimistically for instant feedback
    subscriptionCache.set(cacheKey, {
      data: optimisticStatus,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    });

    // Emit optimistic update immediately for real-time UI across all components
    emitSubscriptionUpdate(optimisticStatus);

    try {
      // Use RPC function for atomic credit deduction.
      // The function now returns a TEXT message indicating success or failure.
      const { data: resultMessage, error: updateError } = await supabase.rpc('deduct_credits_and_log', {
        p_user_id: user.id,
        p_subscription_id: subscriptionStatus.id,
        p_credits_to_deduct: amount,
        p_usage_type: usageType
      });

      // A successful call returns a message starting with "Success:".
      // We must check for both RPC errors and business logic failures reported in the message.
      if (updateError || typeof resultMessage !== 'string' || !resultMessage.startsWith('Success:')) {
        // If there's an RPC error OR the returned message indicates failure, we log and revert.
        const errorMessage = updateError ? updateError.message : resultMessage || 'Unknown error during credit deduction.';
        console.error('Error updating credits:', errorMessage);

        // Revert optimistic update on error
        const revertedStatus = { ...subscriptionStatus };
        subscriptionCache.set(cacheKey, {
          data: revertedStatus,
          timestamp: Date.now(),
          expiresAt: Date.now() + CACHE_DURATION
        });

        emitSubscriptionUpdate(revertedStatus);
        return false;
      }

      // Success - the optimistic update was correct. Log the detailed success message.
      console.log(resultMessage);

      // Refresh subscription from DB to ensure UI is in sync with the backend.
      setTimeout(() => {
        if (isComponentMounted.current) {
          debouncedRefresh(user.id, true);
        }
      }, 1000); // Small delay to allow DB to fully commit

      return true;
    } catch (error) {
      console.error('Error in credit transaction:', error);
      
      // Revert optimistic update on error
      const revertedStatus = { ...subscriptionStatus };
      subscriptionCache.set(cacheKey, {
        data: revertedStatus,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_DURATION
      });
      
      emitSubscriptionUpdate(revertedStatus);
      return false;
    }
  }, [user, subscriptionStatus, debouncedRefresh]);

  // Set up real-time listener for cross-component updates
  useEffect(() => {
    if (!user?.id) return;

    // Remove previous listener if exists
    if (listenerRef.current) {
      subscriptionListeners.delete(listenerRef.current);
    }

    // Create and add new listener
    listenerRef.current = createListener(user.id);
    subscriptionListeners.add(listenerRef.current);

    return () => {
      if (listenerRef.current) {
        subscriptionListeners.delete(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, [user?.id, createListener]);

  // Initialize subscription data only once per user
  useEffect(() => {
    if (user?.id && (!hasInitialized.current || currentUserId.current !== user.id)) {
      hasInitialized.current = true;
      currentUserId.current = user.id;
      
      // Check if we have fresh cached data first
      const cacheKey = getCacheKey(user.id);
      const cached = subscriptionCache.get(cacheKey);
      
      if (cached && Date.now() < cached.expiresAt) {
        // Use cached data immediately
        setSubscriptionStatus(cached.data);
        // Still refresh in background to ensure accuracy
        debouncedRefresh(user.id, false);
      } else {
        // Fetch fresh data
        checkSubscription();
      }
    } else if (!user) {
      // Clear state when user logs out
      setSubscriptionStatus(null);
      hasInitialized.current = false;
      currentUserId.current = null;
    }
  }, [user, checkSubscription, debouncedRefresh]);

  // Cleanup on unmount
  useEffect(() => {
    isComponentMounted.current = true;
    
    return () => {
      isComponentMounted.current = false;
      if (refreshTimeout) {
        clearTimeout(refreshTimeout);
      }
    };
  }, []);

  // Auto-refresh subscription periodically for long-running sessions
  useEffect(() => {
    if (!user?.id || !subscriptionStatus) return;

    const interval = setInterval(() => {
      if (isComponentMounted.current && user?.id) {
        debouncedRefresh(user.id, false);
      }
    }, CACHE_DURATION); // Refresh every cache duration

    return () => clearInterval(interval);
  }, [user?.id, subscriptionStatus, debouncedRefresh]);

  return {
    subscriptionStatus,
    useCredits,
    refreshSubscription: useCallback(() => {
      if (user?.id) {
        return checkSubscription(true);
      }
      return Promise.resolve(null);
    }, [user?.id, checkSubscription]),
    isLoading
  };
}