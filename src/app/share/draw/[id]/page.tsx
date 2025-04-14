"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { Copy, Twitter, MessageCircle, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SharePage({ params }: { params: { id: string } }) {
  const [imageData, setImageData] = useState<{
    image_data: string
    drawing_name: string
    created_at: string
  } | null>(null)
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
    const fetchImage = async () => {
      try {
        const { data, error } = await supabase
          .from("user_images")
          .select("image_data, drawing_name, created_at")
          .eq("id", params.id)
          .single()

        if (error) throw error
        setImageData(data)
      } catch (err) {
        console.error("Error fetching image:", err)
        setError("Failed to load image")
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF4E5] flex items-center justify-center">
        <div className="w-24 h-24 relative">
          <div className="absolute w-full h-full animate-bounce">
            <img src="/logo.png?height=96&width=96" alt="CCPlay the master" className="w-full h-full" />
          </div>
        </div>
        <p
          className="mt-6 text-xl font-bold text-[#58CC02]"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Loading masterpiece...
        </p>
      </div>
    )
  }

  if (error || !imageData) {
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
            {error || "This masterpiece seems to be playing hide and seek!"}
          </p>
          <button
            onClick={() => router.push("/draw")}
            className="px-6 py-3 bg-[#58CC02] hover:bg-[#46A302] text-white font-bold rounded-2xl border-b-4 border-[#46A302] hover:border-[#378700] transition-all"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            Let's Make Your Own Magic! ✨
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFF4E5] py-8 px-4">
      <div className="max-w-3xl mx-auto">
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
              {imageData.drawing_name}
            </h1>

            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#E5FFC2] rounded-2xl transform -rotate-1"></div>
              <img
                src={imageData.image_data || "/placeholder.svg"}
                alt={imageData.drawing_name}
                className="relative w-full h-full object-contain rounded-xl transform rotate-1 hover:rotate-0 transition-transform duration-300 border-4 border-[#58CC02]"
              />
            </div>

            <div className="text-center mb-6 bg-[#FFF9E5] p-4 rounded-xl border-4 border-[#FFD900]">
              <p
                className="text-lg text-[#4B4B4B] font-medium"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Pinky promise, your friend made this masterpiece! 🎨
              </p>
              <p
                className="text-[#8549BA] text-xl font-bold mt-2"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                And guess what? You can create magic too! ✨
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mt-6">
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
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "Check out my drawing! 🎨",
                )}&url=${encodeURIComponent(`${window.location.origin}/share/draw/${params.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1CB0F6] text-white rounded-xl px-5 py-2 flex items-center gap-2 hover:bg-[#1BA0E1] font-bold border-b-3 border-[#1BA0E1]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <Twitter className="w-5 h-5" />
                Share on Twitter
              </motion.a>
              <motion.a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Check out my drawing! 🎨 ${window.location.origin}/share/draw/${params.id}`,
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

            <div className="flex justify-center mt-8">
              <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <div className="absolute inset-0 bg-[#46A302] rounded-2xl translate-y-2"></div>
                <button
                  onClick={() => router.push("/draw")}
                  className="relative px-8 py-4 bg-[#58CC02] text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  ✨ Start Your Magical Drawing! ✨
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
      </div>
    </div>
  )
}
