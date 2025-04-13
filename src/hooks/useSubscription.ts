import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionStatus = {
  id: string;
  isActive: boolean;
  creditsLeft: number;
  planType: string;
  planEndDate: string;
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);

  const checkSubscription = async () => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }

    
    return {
      id: data.id,
      isActive: data.plan_end_date >= new Date().toISOString() && data.sub_status === 'active' && data.credits_left > 0,
      creditsLeft: data.credits_left,
      planType: data.plan_type,
      planEndDate: data.plan_end_date
    };
  };

  const useCredits = async (amount: number, usageType: 'draw' | 'learn' | 'active' | 'story') => {
    if (!user || !subscriptionStatus) return false;

    if (subscriptionStatus.creditsLeft < amount) {
      // Suspend subscription if credits are exhausted
      const { error: updateError } = await supabase
        .from('subscriptions')
        .update({ sub_status: 'suspended' })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error suspending subscription:', updateError);
        return false;
      }

      // Update local state immediately
      setSubscriptionStatus(prev => prev ? {
        ...prev,
        isActive: false,
        creditsLeft: 0
      } : null);

      return false;
    }

    // Update local state immediately before the API call
    const newCreditsLeft = subscriptionStatus.creditsLeft - amount;
    setSubscriptionStatus(prev => prev ? {
      ...prev,
      creditsLeft: newCreditsLeft
    } : null);

    // Deduct credits and log usage
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ 
        credits_left: newCreditsLeft
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
      // Revert local state on error
      setSubscriptionStatus(prev => prev ? {
        ...prev,
        creditsLeft: subscriptionStatus.creditsLeft
      } : null);
      return false;
    }

    // Log credit usage
    const { error: usageError } = await supabase
      .from('credit_usage')
      .insert({
        user_id: user.id,
        subscription_id: subscriptionStatus.id,
        credits_used: amount,
        usage_type: usageType
      });

    if (usageError) {
      console.error('Error logging credit usage:', usageError);
    }

    return true;
  };

  useEffect(() => {
    if (user) {
      checkSubscription().then(status => setSubscriptionStatus(status));
    }
  }, [user]);

  return {
    subscriptionStatus,
    useCredits,
    refreshSubscription: checkSubscription
  };
} 