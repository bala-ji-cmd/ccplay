import { useState, useCallback, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { BedtimeStory } from "@/types"

// Global cache for community stories
const storiesCache = {
  data: [] as BedtimeStory[],
  timestamp: 0,
  isLoading: false
};

const STORIES_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

export const useCommunityStories = () => {
  const [communityStories, setCommunityStories] = useState<BedtimeStory[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const fetchCommunityStories = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Return cached data if fresh and not forcing refresh
    if (!forceRefresh && 
        storiesCache.data.length > 0 && 
        now - storiesCache.timestamp < STORIES_CACHE_DURATION) {
      setCommunityStories(storiesCache.data);
      return storiesCache.data;
    }

    // Don't fetch if already fetching (prevent duplicate requests)
    if (storiesCache.isLoading) {
      return storiesCache.data;
    }

    storiesCache.isLoading = true;
    setIsFetching(true);
    
    try {
      const { data, error } = await supabase
        .from("bedtime_stories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)

      if (error) throw error
      
      const stories = data || [];
      
      // Update cache
      storiesCache.data = stories;
      storiesCache.timestamp = now;
      
      setCommunityStories(stories);
      return stories;
    } catch (err) {
      console.error("Error fetching community stories:", err)
      toast.error("Failed to load community stories")
      // Return cached data if available, even if stale
      if (storiesCache.data.length > 0) {
        setCommunityStories(storiesCache.data);
        return storiesCache.data;
      }
      return []
    } finally {
      storiesCache.isLoading = false;
      setIsFetching(false);
    }
  }, [])

  const refreshStories = useCallback(() => {
    fetchCommunityStories(true);
  }, [fetchCommunityStories]);

  const addStoryToCache = useCallback((newStory: BedtimeStory) => {
    const updatedStories = [newStory, ...communityStories.slice(0, 7)];
    setCommunityStories(updatedStories);
    
    // Update global cache
    storiesCache.data = updatedStories;
    storiesCache.timestamp = Date.now();
  }, [communityStories]);

  // Load community stories on mount with cache check
  useEffect(() => {
    // Check if we have cached data first
    if (storiesCache.data.length > 0 && 
        Date.now() - storiesCache.timestamp < STORIES_CACHE_DURATION) {
      setCommunityStories(storiesCache.data);
    } else {
      // Fetch fresh data
      fetchCommunityStories(false);
    }
  }, [fetchCommunityStories])

  return {
    communityStories,
    isFetching,
    refreshStories,
    addStoryToCache
  }
} 