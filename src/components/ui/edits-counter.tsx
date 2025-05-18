"use client"

import { useEffect, useState } from "react"
import { Star } from "lucide-react"

export default function EditsCounter({ count }: { count: number }) {
  const [prevCount, setPrevCount] = useState(count)
  const [animatingStar, setAnimatingStar] = useState<number | null>(null)
  const [animationDirection, setAnimationDirection] = useState<"fill" | "empty">("empty")
  const totalStars = 5

  // Track previous count to determine which star is changing
  useEffect(() => {
    if (count !== prevCount) {
      // Determine which star is changing and in which direction
      const changingStarIndex = count > prevCount ? count - 1 : count
      setAnimatingStar(changingStarIndex)
      setAnimationDirection(count > prevCount ? "fill" : "empty")

      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setAnimatingStar(null)
      }, 600)

      setPrevCount(count)
      return () => clearTimeout(timer)
    }
  }, [count, prevCount])

  return (
    <div className="bg-[#FFF9E5] px-3 py-2 rounded-xl border-4 border-[#FFD900] shadow-md flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[...Array(totalStars)].map((_, i) => (
          <div key={i} className={`transition-all duration-300 ${animatingStar === i ? "scale-125" : ""}`}>
            {i < count ? (
              <AnimatedStar
                filled={true}
                size={20}
                isAnimating={animatingStar === i && animationDirection === "fill"}
              />
            ) : (
              <AnimatedStar
                filled={false}
                size={20}
                isAnimating={animatingStar === i && animationDirection === "empty"}
              />
            )}
          </div>
        ))}
      </div>
      <span className="text-sm font-bold text-[#4B4B4B]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
        {count}/{totalStars}
      </span>
    </div>
  )
}

// Animated star component that transitions between filled and empty states
function AnimatedStar({
  filled,
  size = 24,
  isAnimating = false,
}: { filled: boolean; size?: number; isAnimating?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Base star (always present) */}
      <div
        className="absolute inset-0 text-[#4B4B4B] drop-shadow-md"
        style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.2))" }}
      >
        <Star fill="white" stroke="#4B4B4B" size={size} strokeWidth={2} />
      </div>

      {/* Filled star with animation */}
      {(filled || isAnimating) && (
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isAnimating && filled
              ? "opacity-100"
              : isAnimating && !filled
                ? "opacity-0"
                : filled
                  ? "opacity-100"
                  : "opacity-0"
          }`}
        >
          <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="url(#starGradient)"
              stroke="#4B4B4B"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="starGradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD900" />
                <stop offset="1" stopColor="#FFC800" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}

      {/* Sparkle animation when star fills */}
      {isAnimating && filled && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="star-sparkle"></div>
            <div className="star-sparkle" style={{ animationDelay: "0.1s" }}></div>
            <div className="star-sparkle" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      )}
    </div>
  )
} 