"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Copy, Twitter, MessageCircle, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { StepGallery } from "@/components/drawing/StepGallery"

interface LearningData {
  images: string[]
  drawing_name: string
  created_at: string
}

export default function ShareLearnPage({ params }: { params: { id: string } }) {
  const [learningData, setLearningData] = useState<LearningData | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  useEffect(() => {
    const fetchLearning = async () => {
      try {
        const { data, error } = await supabase
          .from("user_learnings")
          .select("images, drawing_name, created_at")
          .eq("id", params.id)
          .single()

        if (error) throw error

        // Add back the data URL prefix to each image
        const processedData = {
          ...data,
          images: data.images,
        }

        setLearningData(processedData)
      } catch (err) {
        console.error("Error fetching learning:", err)
        setError("Failed to load drawing steps")
      } finally {
        setLoading(false)
      }
    }

    fetchLearning()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E5] flex items-center justify-center">
        <div className="w-24 h-24 relative">
          <div className="absolute w-full h-full animate-bounce">
            <img src="/logo.png?height=96&width=96" alt="Duo the owl" className="w-full h-full" />
          </div>
        </div>
        <p
          className="mt-6 text-xl font-bold text-[#58CC02]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Loading drawing steps...
        </p>
      </div>
    )
  }

  if (error || !learningData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF4E5]">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/placeholder.svg?height=96&width=96" alt="Sad owl" className="w-full h-full" />
          </div>
          <h1
            className="text-3xl font-bold text-[#FF4B4B] mb-2"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Oops! Magic Gone Wrong!
          </h1>
          <p className="text-[#4B4B4B] mb-6" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            {error || "These drawing steps seem to be playing hide and seek!"}
          </p>
          <button
            onClick={() => router.push("/learn")}
            className="px-6 py-3 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-2xl border-b-4 border-[#46A302] hover:border-[#378700] transition-all"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Let's Learn to Draw! ✨
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF4E5] py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border-8 border-[#FFD900]"
        >
          <div className="relative p-6">
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <span className="text-3xl">✨</span>
              </motion.div>
            </div>

            <h1
              className="text-3xl font-bold mb-6 text-center text-[#58CC02]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              {learningData.drawing_name}
            </h1>

            {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {learningData.images.map((image, index) => (
                <motion.div
                  key={index}
                  className={`relative aspect-video cursor-pointer rounded-xl border-4 ${
                    currentStep === index ? "border-[#58CC02] bg-[#E5FFC2]" : "border-[#FFD900] bg-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setCurrentStep(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Step ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <div
                    className="absolute bottom-1 right-1 bg-[#8549BA] text-white rounded-full px-2 py-0.5 text-sm font-bold"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div> */}

            <StepGallery
              steps={learningData.images.map((image, index) => ({
                image: image,
                step: index,
              }))}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />

            <div className="relative mb-6 max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-[#E5FFC2] rounded-2xl transform -rotate-1"></div>
              <div className="relative border-4 border-[#58CC02] rounded-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 p-2 bg-white">
                <img
                  src={`data:image/png;base64,${learningData.images[currentStep]}`}
                  alt={`Step ${currentStep + 1}`}
                  className="w-full h-full object-contain"
                />
                <div
                  className="absolute top-2 right-2 bg-[#8549BA] text-white rounded-full px-3 py-1 text-lg font-bold"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Step {currentStep + 1}
                </div>
              </div>
            </div>

            <div className="text-center mb-6 bg-[#FFF9E5] p-4 rounded-xl border-4 border-[#FFD900]">
              <p
                className="text-lg text-[#4B4B4B] font-medium"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                ✨ Watch this {learningData.drawing_name} go from doodles to WOW! 🎨
              </p>
              <p
                className="text-[#8549BA] text-xl font-bold mt-2"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Want to make your own masterpiece? Let's have some fun! 🎉 ✨
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-6">
              <motion.button
                onClick={handleCopyLink}
                className="bg-[#1CB0F6] text-white rounded-xl px-5 py-2 flex items-center gap-2 hover:bg-[#1BA0E1] font-bold border-b-3 border-[#1BA0E1]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <Copy className="w-5 h-5" />
                {copied ? "Copied!" : "Copy Link"}
              </motion.button>
              <motion.a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  window.location.href,
                )}&text=${encodeURIComponent("Check out these magical drawing steps! ✨")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1CB0F6] text-white rounded-xl px-5 py-2 flex items-center gap-2 hover:bg-[#1BA0E1] font-bold border-b-3 border-[#1BA0E1]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <Twitter className="w-5 h-5" />
                Tweet the Magic
              </motion.a>
              <motion.a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `✨ Look at these magical drawing steps! ${window.location.href}`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#58CC02] text-white rounded-xl px-5 py-2 flex items-center gap-2 hover:bg-[#46A302] font-bold border-b-3 border-[#46A302]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <MessageCircle className="w-5 h-5" />
                Share on WhatsApp
              </motion.a>
            </div>

            <div className="flex justify-center">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="absolute inset-0 bg-[#46A302] rounded-2xl translate-y-2"></div>
                <button
                  onClick={() => router.push("/learn")}
                  className="relative px-8 py-4 bg-[#58CC02] text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  ✨ Start Learning to Draw! ✨
                </button>
              </motion.div>
            </div>

            <div className="flex justify-center mt-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-[#8549BA] hover:text-[#7038A8] font-bold"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
