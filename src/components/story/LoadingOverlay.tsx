import { motion } from "framer-motion"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export const LoadingOverlay = ({ 
  isVisible, 
  message = "Creating your magical story..." 
}: LoadingOverlayProps) => {
  if (!isVisible) return null

  return (
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
        {message}
      </p>
    </motion.div>
  )
} 