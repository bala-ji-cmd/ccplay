'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function HeroSection() {
    const { user } = useAuth()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleDrawClick = async () => {
        if (user) {
            // User is logged in, redirect to drawing app
            await router.push('/draw')
        } else {
            // User is not logged in, redirect to login page with return URL
            await router.push('/auth/login?redirectTo=/draw')
        }
    }

    if (!mounted) {
        return null // or a loading skeleton
    }

    return (
        <section className="container mx-auto py-8 md:py-12 px-4">
        <div className="relative bg-[#E9F7FF] rounded-3xl p-8 md:p-12 overflow-hidden border-8 border-[#FFD747]">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div
              className="absolute top-10 left-10 w-20 h-20 bg-[#FFD747] rounded-full opacity-30 animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="absolute bottom-20 left-20 w-16 h-16 bg-[#FF4D79] rounded-full opacity-30 animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></div>
            <div
              className="absolute top-20 right-20 w-24 h-24 bg-[#4A66E0] rounded-full opacity-30 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h1
                  className="text-4xl md:text-6xl font-extrabold leading-tight"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  <span className="text-[#4A66E0] block">Draw, Learn &</span>
                  <span className="text-[#FF4D79] block">Animate with</span>
                  <div className="flex justify-center md:justify-start">
                    <span className="text-[#FFD747] bg-[#4A66E0] inline-block px-4 py-2 rounded-xl 
                                     transform -rotate-2 mt-2 shadow-lg text-center">
                      Cocomelon Friends!
                    </span>
                  </div>
                </h1>
                <div className="w-24 h-1 bg-[#FF4D79] mx-auto md:mx-0 my-4 rounded-full"></div>
              </div>
              <p className="text-xl md:text-2xl text-[#5D5D5D] font-bold">
                Join JJ, YoYo, and TomTom on a super fun creative adventure! Make amazing drawings with AI help!
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pt-4 justify-center md:justify-start">
                <Button 
                  onClick={handleDrawClick}
                  className="bg-[#FFD747] hover:bg-[#FFDF6B] text-[#4A66E0] rounded-full px-8 py-8 text-xl font-bold shadow-lg transition-transform hover:scale-105 
                  border-4 border-white flex items-center gap-2"

                >
                  Start Drawing Now
                </Button>
                <Button
                  variant="outline"
                  className="bg-white border-4 border-[#FF4D79] text-[#FF4D79] hover:bg-[#FF4D79] 
                             hover:text-white rounded-full px-8 py-8 text-xl font-bold shadow-lg 
                             transition-transform hover:scale-105 flex items-center gap-2"
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
              <div className="absolute -top-6 -left-6 w-full h-full bg-[#FFD747] rounded-3xl transform rotate-3"></div>
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#FF4D79] rounded-3xl transform -rotate-3"></div>
              <Image
                src="/hero-image-new.png"
                alt="Kids drawing with JJ and Cocomelon friends"
                width={600}
                height={500}
                className="relative z-10 rounded-3xl shadow-2xl border-8 border-white"
              />
            </div>
          </div>
        </div>
      </section>
    )
}