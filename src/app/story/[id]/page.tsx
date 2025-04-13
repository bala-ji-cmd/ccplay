"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { BedtimeStory } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { BookOpen, ChevronLeft, Sparkles } from "lucide-react"

export default function StoryDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const [story, setStory] = useState<BedtimeStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStory() {
      try {
        const { data, error } = await supabase.from("bedtime_stories").select("*").eq("id", params.id).single()

        if (error) throw error
        setStory(data)
      } catch (err) {
        setError("Failed to load story")
        console.error("Error fetching story:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStory()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E5] p-6 flex flex-col items-center justify-center">
        <div className="w-24 h-24 relative">
          <div className="absolute w-full h-full animate-bounce">
            <img src="/logo.png?height=66&width=66" alt="CCPlay the master" className="w-full h-full" />
          </div>
        </div>
        {/* <p className="mt-6 text-xl font-bold text-[#58CC02] font-comic-sans">Loading your story...</p> */}
      </div>
    )
  }

  if (error || !story) {
    return (
      <div className="min-h-screen bg-[#FFF4E5] p-6 flex flex-col items-center justify-center">
        <div className="w-24 h-24 mb-4">
          <img src="/placeholder.svg?height=96&width=96" alt="Sad owl" className="w-full h-full" />
        </div>
        <h1 className="text-2xl font-bold text-[#FF4B4B] mb-4">{error || "Story not found"}</h1>
        <Link href="/story">
          <Button className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-8 rounded-2xl text-lg border-b-4 border-[#46A302] hover:border-[#378700] transition-all">
            Back to Stories
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF4E5] p-6 flex items-center justify-center">
      <div className="w-[1080px] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/story">
            <Button
              variant="outline"
              className="bg-white border-4 border-[#E5E5E5] rounded-2xl px-6 py-3 hover:bg-[#F7F7F7] transition-all duration-200 font-bold text-[#1CB0F6] flex items-center gap-2 shadow-md"
            >
              <ChevronLeft className="w-5 h-5" /> Back to Stories
            </Button>
          </Link>
          <Button
            onClick={() => router.push("/story")}
            className="bg-[#58CC02] hover:bg-[#46A302] text-white font-bold py-3 px-8 rounded-2xl text-lg border-b-4 border-[#46A302] hover:border-[#378700] transition-all flex items-center gap-2 shadow-md"
          >
            <BookOpen className="w-5 h-5" /> Create a new story
          </Button>
        </div>

        <div className="bg-white rounded-3xl border-8 border-[#FFD900] overflow-hidden h-[820px] flex shadow-xl relative">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-[#8549BA] rounded-full z-10 flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="absolute top-4 right-4 w-12 h-12 bg-[#FF9600] rounded-full z-10 flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>

          {/* Banner Image Section */}
          <div className="w-[524px] relative border-r-8 border-[#FFD900]">
            {story.banner_image ? (
              <img
                src={`data:image/png;base64,${story.banner_image}`}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#1CB0F6] to-[#8549BA] flex items-center justify-center">
                <img src="/placeholder.svg?height=200&width=200" alt="Story character" className="w-48 h-48" />
              </div>
            )}
          </div>

          {/* Story Content Section */}
          <div className="w-[556px] h-full overflow-y-auto bg-white p-12">
            <article className="prose max-w-none">
              <Badge
                variant="outline"
                className="mb-6 px-6 py-2 text-base font-bold bg-[#FFC800] text-[#78510D] rounded-full border-4 border-[#FFD900] shadow-sm"
              >
                {story.genre}
              </Badge>

              <h1
                className="text-4xl font-extrabold mb-8 text-[#4B4B4B] leading-tight"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                {story.title}
              </h1>

              <div
                className="text-[18px] leading-[1.8] text-[#3C3C3C] space-y-6"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                {story.story.split("\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:leading-[0.8] first-letter:text-[#FF9600]"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Moral Box */}
              <div className="mt-8 p-6 rounded-2xl bg-[#E5FFC2] border-4 border-[#58CC02] shadow-md">
                <h3
                  className="text-xl mb-2 text-[#58CC02] flex items-center gap-3 font-bold"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  <span className="text-2xl">✨</span>
                  The Moral of the Story
                </h3>
                <p
                  className="text-[17px] text-[#3C3C3C] italic"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  {story.moral}
                </p>
              </div>

              <div className="mt-8 text-sm text-[#777777]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                Created on {new Date(story.created_at).toLocaleDateString()}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
