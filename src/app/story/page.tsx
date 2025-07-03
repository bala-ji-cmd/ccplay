"use client"

import { useState } from "react"
import { SubscriptionModal } from "@/components/ui/subscriptionmodal"
import { useCommunityStories } from "@/hooks/useCommunityStories"
import { useStoryCreation } from "@/hooks/useStoryCreation"
import { 
  StoryCreationOptions, 
  StoryForm, 
  CommunityStories, 
  LoadingOverlay 
} from "@/components/story"

export default function StoryPage() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  
  const { communityStories, isFetching, refreshStories, addStoryToCache } = useCommunityStories()
  const { 
    formData, 
    updateFormData, 
    isGenerating, 
    showCustomForm, 
    setShowCustomForm, 
    canGenerate, 
    handleCreateStory 
  } = useStoryCreation(addStoryToCache)

  const handleCustomStory = () => {
    setShowCustomForm(true)
  }

  const handleRandomStory = async () => {
    const result = await handleCreateStory(true)
    if (result?.needsUpgrade) {
      setShowSubscriptionModal(true)
    }
  }

  const handleFormSubmit = async () => {
    const result = await handleCreateStory(false)
    if (result?.needsUpgrade) {
      setShowSubscriptionModal(true)
    }
  }

  const handleBackToOptions = () => {
    setShowCustomForm(false)
  }

  return (
    <div className="min-h-screen bg-[#FFF4E5] p-6">
      {showSubscriptionModal && (
        <SubscriptionModal 
          message="This feature is not available for your plan. Please upgrade to a higher plan to use this feature." 
          onClose={() => setShowSubscriptionModal(false)}
        />
      )}

      <LoadingOverlay isVisible={isGenerating} />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Story Creation Section */}
        {!showCustomForm ? (
          <StoryCreationOptions
            onCustomStory={handleCustomStory}
            onRandomStory={handleRandomStory}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
          />
        ) : (
          <StoryForm
            formData={formData}
            onFormDataChange={updateFormData}
            onBack={handleBackToOptions}
            onSubmit={handleFormSubmit}
            isGenerating={isGenerating}
            canGenerate={canGenerate}
          />
        )}

        {/* Community Stories Section */}
        <CommunityStories
          stories={communityStories}
          isFetching={isFetching}
          onRefresh={refreshStories}
        />
      </div>
    </div>
  )
}