import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BookOpen, ChevronLeft, Loader2 } from "lucide-react"

interface StoryFormData {
  storyIdea: string
  childAge: string
  language: string
}

interface StoryFormProps {
  formData: StoryFormData
  onFormDataChange: (field: keyof StoryFormData, value: string) => void
  onBack: () => void
  onSubmit: () => void
  isGenerating: boolean
  canGenerate: boolean
}

export const StoryForm = ({
  formData,
  onFormDataChange,
  onBack,
  onSubmit,
  isGenerating,
  canGenerate
}: StoryFormProps) => {
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
              onClick={onBack}
              className="text-[#1CB0F6] font-bold flex items-center gap-2 hover:bg-[#1CB0F6]/10 rounded-xl px-3 py-2"
            >
              <ChevronLeft className="w-5 h-5" /> Back to options
            </Button>
          </div>
          
          <div className="bg-gradient-to-br from-[#FFF9E5] to-[#FFF4E5] p-6 rounded-2xl border-2 border-[#FFD900] shadow-lg">
            <Input
              placeholder="A bear that is in search for the best honey"
              value={formData.storyIdea}
              onChange={(e) => onFormDataChange("storyIdea", e.target.value)}
              className="w-full border-4 border-[#E5E5E5] rounded-xl p-4 text-lg bg-white text-[#4B4B4B] placeholder:text-[#999999] focus:border-[#1CB0F6] focus:ring-2 focus:ring-[#1CB0F6]/20 transition-all"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            />

            <div className="flex gap-4 mt-6">
              <div className="w-1/2">
                <label
                  className="block mb-3 font-bold text-[#4B4B4B] text-sm"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Child's Age
                </label>
                <Select value={formData.childAge} onValueChange={(value) => onFormDataChange("childAge", value)}>
                  <SelectTrigger className="border-4 border-[#E5E5E5] rounded-xl p-4 h-auto bg-white text-[#4B4B4B] focus:border-[#1CB0F6] focus:ring-2 focus:ring-[#1CB0F6]/20 transition-all">
                    <SelectValue placeholder="Child's Age" />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-[#E5E5E5] rounded-xl bg-white">
                    <SelectItem value="3-4" className="text-[#4B4B4B] hover:bg-[#1CB0F6]/10">3 - 4</SelectItem>
                    <SelectItem value="4-6" className="text-[#4B4B4B] hover:bg-[#1CB0F6]/10">4 - 6</SelectItem>
                    <SelectItem value="6-8" className="text-[#4B4B4B] hover:bg-[#1CB0F6]/10">6 - 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-1/2">
                <label
                  className="block mb-3 font-bold text-[#4B4B4B] text-sm"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Language
                </label>
                <Select value={formData.language} onValueChange={(value) => onFormDataChange("language", value)}>
                  <SelectTrigger className="border-4 border-[#E5E5E5] rounded-xl p-4 h-auto bg-white text-[#4B4B4B] focus:border-[#1CB0F6] focus:ring-2 focus:ring-[#1CB0F6]/20 transition-all">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-[#E5E5E5] rounded-xl bg-white">
                    <SelectItem value="English" className="text-[#4B4B4B] hover:bg-[#1CB0F6]/10">English</SelectItem>
                    <SelectItem value="Spanish" className="text-[#4B4B4B] hover:bg-[#1CB0F6]/10">Spanish</SelectItem>
                    <SelectItem value="French" className="text-[#4B4B4B] hover:bg-[#1CB0F6]/10">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={onSubmit}
              className="bg-gradient-to-r from-[#58CC02] to-[#46A302] hover:from-[#46A302] hover:to-[#378700] text-white font-bold py-3 px-6 rounded-2xl text-base border-b-4 border-[#46A302] hover:border-[#378700] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
              disabled={isGenerating || !canGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating your story...
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  Generate your bedtime story with AI
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 