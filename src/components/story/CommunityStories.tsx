import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import type { BedtimeStory } from "@/types"

interface CommunityStoriesProps {
  stories: BedtimeStory[]
  isFetching: boolean
  onRefresh: () => void
}

export const CommunityStories = ({
  stories,
  isFetching,
  onRefresh
}: CommunityStoriesProps) => {
  const router = useRouter()

  return (
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
          onClick={onRefresh}
          className="bg-white border-4 border-[#E5E5E5] rounded-xl px-4 py-2 hover:bg-[#F7F7F7] transition-all font-bold text-[#1CB0F6] flex items-center gap-2"
          disabled={isFetching}
        >
          <RefreshCw className={`h-5 w-5 ${isFetching ? 'animate-spin' : ''}`} /> 
          {isFetching ? 'Loading...' : 'Refresh stories'}
        </Button>
      </div>

      {isFetching && stories.length === 0 && (
        <div className="flex justify-center items-center h-40 flex-col">
          <div className="w-12 h-12 relative">
            <div className="absolute w-full h-full animate-bounce">
              <img src="/logo.png?height=66&width=66" alt="CCPlay the master" className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
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
            </div>
            <CardContent className="p-1">
              <p
                className="font-bold text-[#4B4B4B] line-clamp-2"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                {story.title}
              </p>
              <div className="mt-2 flex justify-between items-center">
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
  )
} 