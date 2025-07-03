import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSubscription } from "@/hooks/useSubscription"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import type { BedtimeStory } from "@/types"

interface StoryFormData {
  storyIdea: string
  childAge: string
  language: string
}

export const useStoryCreation = (addStoryToCache: (story: BedtimeStory) => void) => {
  const router = useRouter()
  const { user, session } = useAuth()
  const { subscriptionStatus, useCredits } = useSubscription()
  
  const [formData, setFormData] = useState<StoryFormData>({
    storyIdea: "",
    childAge: "4-6",
    language: "English"
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)

  // Memoize the can generate check to avoid recalculation
  const canGenerate = useMemo(() => {
    if (!subscriptionStatus) return false;
    return subscriptionStatus.isActive && subscriptionStatus.creditsLeft >= 25;
  }, [subscriptionStatus?.isActive, subscriptionStatus?.creditsLeft]);

  const updateFormData = useCallback((field: keyof StoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCreateStory = useCallback(async (isRandom = false) => {
    if (!session?.user?.id) {
      router.push("/auth/login?redirectTo=/story")
      return
    }

    // Check subscription status without making additional DB calls
    if (!subscriptionStatus || (!subscriptionStatus.isActive && subscriptionStatus.planType !== "tier2")) {
      console.log("subscriptionStatus", subscriptionStatus)
      return { needsUpgrade: true }
    }

    // Check credits before proceeding
    if (!canGenerate) {
      console.log("canGenerate", canGenerate)
      return { needsUpgrade: true }
    }

    if (!isRandom && !formData.storyIdea.trim()) {
      toast.error("Please enter a story idea")
      return { success: false }
    }

    setIsGenerating(true)

    try {
      // Use credits first (this updates the subscription state)
      const creditsUsed = await useCredits(25, "story");
      if (!creditsUsed) {
        return { needsUpgrade: true }
      }

      console.log("Credits used for story generation")

      // Generate story using AI
      const response = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyIdea: formData.storyIdea.trim(),
          childAge: formData.childAge,
          language: formData.language,
          user_id: session.user.id,
          isRandomStory: isRandom,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate story")
      const storyData = await response.json()

      // Store story in Supabase
      const { data: story, error } = await supabase
        .from("bedtime_stories")
        .insert([
          {
            user_id: session.user.id,
            genre: storyData.genre,
            title: storyData.title,
            story: storyData.story,
            moral: storyData.moral,
            banner_image_description: storyData.banner_image_description,
            banner_image: storyData.banner_image,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Add to cache
      addStoryToCache(story)

      // Navigate to the new story
      router.push(`/story/${story.id}`)
      toast.success("Story created successfully!")
      
      return { success: true, story }
    } catch (err) {
      console.error("Error creating story:", err)
      toast.error("Failed to create story")
      return { success: false }
    } finally {
      setIsGenerating(false)
      setShowCustomForm(false)
    }
  }, [session?.user?.id, subscriptionStatus, canGenerate, formData, useCredits, addStoryToCache, router])

  return {
    formData,
    updateFormData,
    isGenerating,
    showCustomForm,
    setShowCustomForm,
    canGenerate,
    handleCreateStory
  }
} 