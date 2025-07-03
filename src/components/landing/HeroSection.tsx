"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function HeroSection() {
  const { user } = useAuth()
  const router = useRouter()
  const [bounce, setBounce] = useState(false)

  useEffect(() => {
    // Create bouncing effect for characters
    const interval = setInterval(() => {
      setBounce((prev) => !prev)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleDrawClick = async () => {
    if (user) {
      // User is logged in, redirect to drawing app
      await router.push("/draw")
    } else {
      // User is not logged in, redirect to login page with return URL
      await router.push("/auth/login?redirectTo=/draw")
    }
  }

  return (
    <section className="bg-[#FFF4E5] pt-16 pb-16 flex items-center" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" } }>
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden border-[8px] border-[#58CC02]">
          {/* Floating bubbles animation */}
          {/* <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full opacity-30"
                style={{
                  backgroundColor: ["#FFC800", "#FF4B4B", "#1CB0F6", "#58CC02"][i % 4],
                  width: `${Math.random() * 30 + 20}px`,
                  height: `${Math.random() * 30 + 20}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div> */}

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1 space-y-5 text-center md:text-left">


              <div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight text-center">
                  <div className="inline-block text-[#1CB0F6] transform -rotate-2">
                    <span
                      className="text-5xl md:text-7xl font-black text-[#1CB0F6]"
                      style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                    >
                      Draw, 
                    </span>
                    <span
                      className="text-5xl md:text-7xl font-black text-[#FF4B4B]"
                      style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                    >
                      Learn,
                    </span>
                    <span
                      className="text-5xl md:text-7xl font-black text-[#58CC02]"
                      style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                    >
                      Story
                    </span>
                  </div>

                  <div className="flex justify-center mt-4">
                    <span className="text-[#78510D] text-4xl md:text-5xl font-bold">
                      with
                    </span>
                  </div>
                 
                  <div className="flex justify-center mt-4">
                    <span
                      className="text-[#78510D] bg-[#FFC800] inline-block px-8 py-4 rounded-xl 
                      transform -rotate-2 shadow-md border-b-4 border-[#E6AC00] text-center text-3xl md:text-4xl font-black"
                    >
                      Cocomelon Friends!
                    </span>
                  </div>
                </h1>
              </div>

              <p className="text-xl md:text-2xl text-[#4B4B4B] font-extrabold text-center mx-auto max-w-xl mt-6">
                AI-powered magic for little artists! ✨
              </p>

              <div className="flex justify-center mt-6">
                <div className="bg-white rounded-full py-3 px-6 flex items-center justify-center gap-2 shadow-md border-2 border-[#FFC800] transform hover:scale-105 transition-all">
                  <div className="text-2xl md:text-3xl">🔥</div>
                  <p className="text-[#1CB0F6] font-extrabold text-lg md:text-xl">
                    <span className="text-[#FF4B4B]">10,000+</span> drawings created this week!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
                <Button
                  onClick={handleDrawClick}
                  className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-2xl px-6 py-6 text-lg font-bold shadow-md 
                  transition-all hover:scale-105 border-b-4 border-[#3F9200] flex items-center gap-2 relative overflow-hidden group"
                >
                  <span className="relative z-10">✏️ Start Drawing Now!</span>
                  <span className="absolute inset-0 bg-yellow-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-20"></span>
                </Button>

                <Button
                  variant="outline"
                  className="bg-white border-2 border-[#1CB0F6] text-[#1CB0F6] hover:bg-[#1CB0F6] 
                  hover:text-white rounded-2xl px-6 py-6 text-lg font-bold shadow-md 
                  transition-all hover:scale-105 flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Watch Demo
                </Button>
              </div>

             
            </div>

            <div className="flex-1 relative">
              {/* Layered image effect */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-[#FFC800] rounded-3xl transform rotate-2"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-[#FF4B4B] rounded-3xl transform -rotate-2"></div>

              <div className="relative z-10 bg-white rounded-3xl p-3 border-4 border-[#58CC02] shadow-xl">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#FFC800] text-[#78510D] text-sm font-bold px-4 py-1 rounded-full border-2 border-white z-20">
                  Kids drawing with JJ and Cocomelon friends
                </div>

                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="/hero/hero2.png"
                    alt="Kids drawing with JJ and Cocomelon friends"
                    width={500}
                    height={400}
                    className="rounded-2xl"
                  />

                  {/* Character animations */}
                  {/* <div
                    className={`absolute bottom-4 left-4 transition-transform duration-300 ${bounce ? "transform translate-y-1" : ""}`}
                  >
                    <Image src="/jj-happy.png" alt="JJ" width={60} height={60} className="filter drop-shadow-lg" />
                  </div>

                  <div
                    className={`absolute bottom-4 right-4 transition-transform duration-300 ${bounce ? "transform translate-y-1" : ""}`}
                  >
                    <Image src="/yoyo-happy.png" alt="YoYo" width={50} height={50} className="filter drop-shadow-lg" />
                  </div>

                  <div
                    className={`absolute top-4 right-4 transition-transform duration-300 ${bounce ? "transform translate-y-1" : ""}`}
                  >
                    <Image
                      src="/tomtom-happy.png"
                      alt="TomTom"
                      width={45}
                      height={45}
                      className="filter drop-shadow-lg"
                    />
                  </div> */}
                </div>
              </div>

              {/* Owl mascot */}
              {/* <div
                className={`absolute -bottom-6 -right-6 z-20 w-24 h-24 bg-white rounded-full border-4 border-[#58CC02] flex items-center justify-center transition-transform duration-300 ${bounce ? "transform translate-y-1" : ""}`}
              >
                <div className="text-4xl">🦉</div>
              </div> */}

              {/* Confetti effect */}
              {/* <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-2xl">🎨 🎭 🎪 🎯 🎮</div> */}
            </div>
          </div>

         
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-40px) rotate(180deg);
          }
          100% {
            transform: translateY(0) rotate(360deg);
          }
        }
      `}</style>
    </section>
  )
}
