import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"

interface StoryCreationOptionsProps {
  onCustomStory: () => void
  onRandomStory: () => void
  isGenerating: boolean
  canGenerate: boolean
}

export const StoryCreationOptions = ({
  onCustomStory,
  onRandomStory,
  isGenerating,
  canGenerate
}: StoryCreationOptionsProps) => {
  return (
    <div className="bg-white rounded-3xl border-0 border-[#FFD900] overflow-hidden shadow-xl">
      <div className="bg-[#FF4D79] p-6">
        <h2 
          className="text-center text-2xl font-bold text-white" 
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Choose how you want to create your magical story!
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Button
            onClick={onCustomStory}
            className="h-40 text-lg font-bold bg-[#4A66E0] hover:bg-[#5A76F0] text-white rounded-xl border-b-4 border-[#7038A8] hover:border-[#5D2E8C] transition-all"
            disabled={isGenerating || !canGenerate}
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
            onClick={onRandomStory}
            className="h-40 text-lg font-bold bg-[#FFD747] hover:bg-[#FFDF6B] text-[#4A66E0] rounded-2xl border-b-4 border-[#E68600] hover:border-[#CC7700] transition-all"
            disabled={isGenerating || !canGenerate}
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
      </div>
    </div>
  )
} 