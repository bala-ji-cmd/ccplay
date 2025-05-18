"use client"

import { useSubscription } from "@/hooks/useSubscription"
import { useEffect, useState, useCallback } from "react"
import { SubscriptionModal } from "@/components/ui/subscriptionmodal"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { motion } from "framer-motion"
import { BookOpen, Sparkles, ChevronLeft, RefreshCw, Loader2 } from "lucide-react"

// Define the BedtimeStory type
interface BedtimeStory {
  id: string
  created_at: string
  title: string
  genre: string
  story: string
  moral: string
  banner_image: string | null
  user_id: string
  banner_image_description?: string
}

export default function StoryPage() {
  const router = useRouter()
  const { user, session } = useAuth()
  const { subscriptionStatus, useCredits } = useSubscription()
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [storyIdea, setStoryIdea] = useState("")
  const [childAge, setChildAge] = useState("4-6")
  const [language, setLanguage] = useState("English")
  const [isGenerating, setIsGenerating] = useState(false)
  const [communityStories, setCommunityStories] = useState<BedtimeStory[]>([])
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [canGenerate, setCanGenerate] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  useEffect(() => {
    fetchCommunityStories()
  }, [])

  const fetchCommunityStories = async () => {
    setIsFetching(true)
    try {
      const { data, error } = await supabase
        .from("bedtime_stories")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8)

      if (error) throw error
      setCommunityStories(data || [])
    } catch (err) {
      console.error("Error fetching community stories:", err)
      toast.error("Failed to load community stories")
    } finally {
      setIsFetching(false)
    }
  }

  const checkCredits = useCallback(async () => {
    const hasCredits = await useCredits(25, "story")
    setCanGenerate(hasCredits)
    return hasCredits
  }, [useCredits])

  const handleCreateStory = async (isRandom = false) => {
    if (!session?.user?.id) {
      router.push("/auth/login?redirectTo=/story")
      return
    }

    if (subscriptionStatus && subscriptionStatus.planType !== "tier2" && !subscriptionStatus.isActive) {
      setShowSubscriptionModal(true)
      return
    }

    if (!(await checkCredits())) {
      setShowSubscriptionModal(true)
      return
    } else {
      console.log("used credits for story")
    }

    if (!isRandom && !storyIdea) {
      toast.error("Please enter a story idea")
      return
    }

    setIsGenerating(true)

    try {
      // Generate story using AI
      const response = await fetch("/api/story/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storyIdea,
          childAge,
          language,
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

      // Refresh community stories
      await fetchCommunityStories()

      // Navigate to the new story
      router.push(`/story/${story.id}`)
      toast.success("Story created successfully!")
    } catch (err) {
      console.error("Error creating story:", err)
      toast.error("Failed to create story")
    } finally {
      setIsGenerating(false)
      setShowCustomForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF4E5] p-6">
      {showSubscriptionModal && (
        <SubscriptionModal message="This feature is not available for your plan. Please upgrade to a higher plan to use this feature." />
      )}

      {/* Thinking Animation Overlay */}
      {isGenerating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
        >
          <div className="w-32 h-32 relative">
          <div className="absolute w-full h-full animate-bounce">
                    <img src="/logo.png?height=66&width=66" alt="CCPlay the master" className="w-full h-full" />
                  </div>
          </div>
          <p
            className="mt-6 text-xl font-bold text-[#58CC02]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Creating your magical story...
          </p>
        </motion.div>
      )}

      <div className="max-w-5xl mx-auto space-y-8">
      

        {/* Story Creation Options */}
        <div className="bg-white rounded-3xl border-0 border-[#FFD900] overflow-hidden shadow-xl">
          <div className="bg-[#FF4D79] p-6">
            <h2 className="text-center text-2xl font-bold text-white" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            Choose how you want to create your magical story!
            </h2>

          </div>
          <div className="p-6">
            {!showCustomForm ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button
                  onClick={() => setShowCustomForm(true)}
                  className="h-40 text-lg font-bold bg-[#4A66E0] hover:bg-[#5A76F0] text-white rounded-xl border-b-4 border-[#7038A8] hover:border-[#5D2E8C] transition-all"
                  disabled={isGenerating}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-[#8549BA]" />
                    </div>
                    <div className="text-center">
                      <span className="block text-xl">Create Your Own Story</span>
                      <span className="block text-sm opacity-90">Tell us your story idea!</span>
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => handleCreateStory(true)}
                  className="h-40 text-lg font-bold  bg-[#FFD747] hover:bg-[#FFDF6B] text-[#4A66E0] rounded-2xl border-b-4 border-[#E68600] hover:border-[#CC7700] transition-all"
                  disabled={isGenerating}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-[#FF9600]" />
                    </div>
                    <div className="text-center">
                      <span className="block text-xl">Surprise Me!</span>
                      <span className="block text-sm opacity-90">Generate a random magical story</span>
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3
                    className="text-xl font-bold text-[#4B4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    What's your story idea?
                  </h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCustomForm(false)}
                    className="text-[#1CB0F6] font-bold flex items-center gap-2"
                  >
                    <ChevronLeft className="w-5 h-5" /> Back to options
                  </Button>
                </div>
                <Input
                  placeholder="A bear that is in search for the best honey"
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  className="w-full border-4 border-[#E5E5E5] rounded-xl p-4 text-lg"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                />

                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label
                      className="block mb-2 font-bold text-[#4B4B4B]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Child's Age
                    </label>
                    <Select value={childAge} onValueChange={setChildAge}>
                      <SelectTrigger className="border-4 border-[#E5E5E5] rounded-xl p-4 h-auto">
                        <SelectValue placeholder="Child's Age" />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-[#E5E5E5] rounded-xl">
                        <SelectItem value="3-4">3 - 4</SelectItem>
                        <SelectItem value="4-6">4 - 6</SelectItem>
                        <SelectItem value="6-8">6 - 8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-1/2">
                    <label
                      className="block mb-2 font-bold text-[#4B4B4B]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Language
                    </label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-4 border-[#E5E5E5] rounded-xl p-4 h-auto">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent className="border-4 border-[#E5E5E5] rounded-xl">
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={() => handleCreateStory(false)}
                  className="w-auto min-w-[200px] bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-6 rounded-2xl text-base border-b-4 border-[#46A302] hover:border-[#378700] transition-all flex items-center justify-center gap-2 mx-auto"
                  disabled={isGenerating}
                >
                  <BookOpen className="w-5 h-5" />
                  {isGenerating ? "Creating your story..." : "Generate your bedtime story with AI"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Community Stories Section */}
            
        <div>

            

          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-2xl font-bold text-[#4B4B4B]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Stories from the community
            </h2>
            <Button
              variant="outline"
              onClick={fetchCommunityStories}
              className="bg-white border-4 border-[#E5E5E5] rounded-xl px-4 py-2 hover:bg-[#F7F7F7] transition-all font-bold text-[#1CB0F6] flex items-center gap-2"
            >
              <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} /> Refresh stories
            </Button>
          </div>


          {isFetching && (
                <div className="flex justify-center items-center h-40 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 relative">
                  <div className="absolute w-full h-full animate-bounce">
                    <img src="/logo.png?height=66&width=66" alt="CCPlay the master" className="w-full h-full" />
                  </div>
                  </div>
                  {/* <p className="mt-6 text-lg font-bold text-[#58CC02] font-comic-sans">Loading stories...</p> */}
                  
                </div>
            )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityStories.map((story) => (
              <Card
                key={story.id}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all rounded-2xl border-4 border-[#FFD900] bg-white"
                onClick={() => router.push(`/story/${story.id}`)}
              >
                <div className="relative">
                  {story.banner_image ? (
                    <img
                      src={`data:image/png;base64,${story.banner_image}`}
                      alt={story.title}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-[#1CB0F6] to-[#8549BA] flex items-center justify-center">
                      <img src="/placeholder.svg?height=96&width=96" alt="Story character" className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  {/* <div className="absolute top-2 right-2">
                  <span className="bg-[#FFC800] text-[#78510D] text-xs font-bold px-1 py-1 rounded-full border-2 border-[#FFD900]">
                      {story.genre}
                    </span>
                  </div> */}

                </div>
                <CardContent className="p-1">
                  <p
                    className="font-bold text-[#4B4B4B] line-clamp-2"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    {story.title}
                  </p>
                  <div className="mt-2 flex justify-between items-center ">
                    <span
                      className="text-xs text-[#777777]"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      Created on {new Date(story.created_at).toLocaleDateString()}
                    </span>

                    
                    
                  </div>

                  
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
