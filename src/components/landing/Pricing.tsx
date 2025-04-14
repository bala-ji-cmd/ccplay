"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export function Pricing() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { session } = useAuth()

  const handleSubscribe = async (planId: string) => {
    try {
      console.log("handleSubscribe", planId)
      setIsLoading(true)

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          isAnnual: false,
          session: session,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Redirect to Stripe checkout
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error("Subscription error:", error)
      // Add your error handling/notification here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section id="pricing" className="w-full bg-[#FFF4E5] py-16 px-4">
      <div className="container mx-auto">
        <h2
          className="text-3xl md:text-5xl font-extrabold text-center mb-8"
          style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
        >
          <span className="bg-[#58CC02] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2 border-4 border-[#58A700]">
            Choose Your
          </span>
          <span className="text-[#FF4B4B] px-2">Learning</span>
          <span className="bg-[#FFC800] text-[#58CC02] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2 border-4 border-[#E5B800]">
            Adventure!
          </span>
        </h2>

        <p
          className="text-xl text-center text-[#4B4B4B] mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
        >
          Pick the perfect plan with AI credits for your little artist and start creating Cocomelon masterpieces today!
          ✨
        </p>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#FFC800] rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF4B4B] rounded-full opacity-20"></div>

          {/* JJ's Fun Pack (Entry-Level) */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#58CC02] transform transition-all hover:scale-105 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24">
              <Image src="/jj-happy.png" alt="JJ" width={80} height={80} className="drop-shadow-lg" />
            </div>
            <div className="bg-[#E5F8D4] p-6 text-center pt-12 border-b-4 border-[#58A700]">
              <h3
                className="text-2xl font-bold text-[#58CC02]"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                JJ's Fun Pack
              </h3>
              <div className="mt-4">
                <span
                  className="text-4xl font-bold text-[#58CC02]"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  $9.99
                </span>
                <span className="text-[#4B4B4B]">/month</span>
              </div>
              <div className="mt-2 bg-[#58CC02]/10 rounded-full py-1 px-3 inline-block border-2 border-[#58A700]">
                <span
                  className="text-[#58CC02] font-bold"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  50 AI Credits/Month
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-4" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E5F8D4] rounded-full p-2 flex-shrink-0 border-2 border-[#58A700]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Draw with AI</span>
                    <p className="text-sm text-[#4B4B4B]">Basic Edits & Adds ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E5F8D4] rounded-full p-2 flex-shrink-0 border-2 border-[#58A700]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-open"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium line-through text-[#4B4B4B]">Learn with AI</span>
                    <p className="text-sm text-[#4B4B4B]">Not Available</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E5F8D4] rounded-full p-2 flex-shrink-0 border-2 border-[#58A700]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clapperboard"
                    >
                      <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
                      <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.33l.87 2.87L4 11.01Z" />
                      <path d="m6.6 4.99 3.38 4.2" />
                      <path d="m11.86 3.38 3.38 4.2" />
                      <path d="m17.13 1.77 3.38 4.2" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium line-through text-[#4B4B4B]">Animate with AI</span>
                    <p className="text-sm text-[#4B4B4B]">Not Available</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E5F8D4] rounded-full p-2 flex-shrink-0 border-2 border-[#58A700]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar-check"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                      <path d="m9 16 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Daily Challenge</span>
                    <p className="text-sm text-[#4B4B4B]">Standard Challenges ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E5F8D4] rounded-full p-2 flex-shrink-0 border-2 border-[#58A700]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-download"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Download & Share</span>
                    <p className="text-sm text-[#4B4B4B]">Standard Resolution ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E5F8D4] rounded-full p-2 flex-shrink-0 border-2 border-[#58A700]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-headphones"
                    >
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Customer Support</span>
                    <p className="text-sm text-[#4B4B4B]">Queued Support</p>
                  </div>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe("jj-fun-pack")}
                disabled={isLoading}
                className="w-full bg-[#58CC02] hover:bg-[#76D639] text-white rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-[#58A700] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                {isLoading ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
          </div>

          {/* YoYo's Adventure Pass (Mid-Tier) */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#FFC800] transform scale-105 z-10 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24">
              <Image src="/yoyo-happy.png" alt="YoYo" width={80} height={80} className="drop-shadow-lg" />
            </div>
            <div
              className="absolute -top-3 -right-3 bg-[#FF4B4B] text-white text-base md:text-lg font-extrabold px-6 py-2 rounded-bl-lg rounded-tr-lg transform rotate-3 shadow-lg border-2 border-white"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              MOST POPULAR
            </div>
            <div className="bg-[#FFF5D2] p-6 text-center pt-12 border-b-4 border-[#E5B800]">
              <h3
                className="text-2xl font-bold text-[#E5B800]"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                YoYo's Adventure Pass
              </h3>
              <div className="mt-4">
                <span
                  className="text-4xl font-bold text-[#E5B800]"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  $19.99
                </span>
                <span className="text-[#4B4B4B]">/month</span>
              </div>
              <div className="mt-2 bg-[#FFC800]/10 rounded-full py-1 px-3 inline-block border-2 border-[#E5B800]">
                <span
                  className="text-[#E5B800] font-bold"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  150 AI Credits/Month
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-4" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF5D2] rounded-full p-2 flex-shrink-0 border-2 border-[#E5B800]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Draw with AI</span>
                    <p className="text-sm text-[#E5B800]">Full Access (Edits, Adds, Removes) ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF5D2] rounded-full p-2 flex-shrink-0 border-2 border-[#E5B800]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-open"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Learn with AI</span>
                    <p className="text-sm text-[#E5B800]">All Standard Guides ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF5D2] rounded-full p-2 flex-shrink-0 border-2 border-[#E5B800]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clapperboard"
                    >
                      <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
                      <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.33l.87 2.87L4 11.01Z" />
                      <path d="m6.6 4.99 3.38 4.2" />
                      <path d="m11.86 3.38 3.38 4.2" />
                      <path d="m17.13 1.77 3.38 4.2" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium line-through text-[#4B4B4B]">Animate with AI</span>
                    <p className="text-sm text-[#4B4B4B]">Not Available</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF5D2] rounded-full p-2 flex-shrink-0 border-2 border-[#E5B800]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar-check"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                      <path d="m9 16 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Daily Challenge</span>
                    <p className="text-sm text-[#E5B800]">All Standard Challenges ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF5D2] rounded-full p-2 flex-shrink-0 border-2 border-[#E5B800]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-download"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Download & Share</span>
                    <p className="text-sm text-[#E5B800]">High Resolution ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF5D2] rounded-full p-2 flex-shrink-0 border-2 border-[#E5B800]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#E5B800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-headphones"
                    >
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Customer Support</span>
                    <p className="text-sm text-[#E5B800]">Standard Support ✨</p>
                  </div>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe("yoyo-adventure-pack")}
                disabled={isLoading}
                className="w-full bg-[#FFC800] hover:bg-[#FFD333] text-[#4B4B4B] rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-[#E5B800] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                {isLoading ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
          </div>

          {/* Cocomelon Creative Galaxy (Premium) */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-[#FF4B4B] transform transition-all hover:scale-105 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24">
              <Image src="/tomtom-happy.png" alt="TomTom" width={80} height={80} className="drop-shadow-lg" />
            </div>
            <div className="bg-[#FFECEC] p-6 text-center pt-12 border-b-4 border-[#FF4B4B]">
              <h3
                className="text-2xl font-bold text-[#FF4B4B]"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Cocomelon Creative Galaxy
              </h3>
              <div className="mt-4">
                <span
                  className="text-4xl font-bold text-[#FF4B4B]"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  $49.99
                </span>
                <span className="text-[#4B4B4B]">/month</span>
              </div>
              <div className="mt-2 bg-[#FF4B4B]/10 rounded-full py-1 px-3 inline-block border-2 border-[#FF4B4B]">
                <span
                  className="text-[#FF4B4B] font-bold"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Unlimited AI Fun!
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-4" style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECEC] rounded-full p-2 flex-shrink-0 border-2 border-[#FF4B4B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF4B4B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.85 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Draw with AI</span>
                    <p className="text-sm text-[#FF4B4B]">Full Access (All Features) ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECEC] rounded-full p-2 flex-shrink-0 border-2 border-[#FF4B4B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF4B4B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-book-open"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Learn with AI</span>
                    <p className="text-sm text-[#FF4B4B]">All Guides + Exclusive Content ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECEC] rounded-full p-2 flex-shrink-0 border-2 border-[#FF4B4B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF4B4B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-clapperboard"
                    >
                      <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
                      <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.33l.87 2.87L4 11.01Z" />
                      <path d="m6.6 4.99 3.38 4.2" />
                      <path d="m11.86 3.38 3.38 4.2" />
                      <path d="m17.13 1.77 3.38 4.2" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Animate with AI</span>
                    <p className="text-sm text-[#FF4B4B]">Full Animation Access ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECEC] rounded-full p-2 flex-shrink-0 border-2 border-[#FF4B4B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF4B4B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-calendar-check"
                    >
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                      <path d="m9 16 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Daily Challenge</span>
                    <p className="text-sm text-[#FF4B4B]">All Challenges + Premium ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECEC] rounded-full p-2 flex-shrink-0 border-2 border-[#FF4B4B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF4B4B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-download"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Download & Share</span>
                    <p className="text-sm text-[#FF4B4B]">High Resolution + GIF ✨</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECEC] rounded-full p-2 flex-shrink-0 border-2 border-[#FF4B4B]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF4B4B"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-headphones"
                    >
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Customer Support</span>
                    <p className="text-sm text-[#FF4B4B]">Priority Support ✨</p>
                  </div>
                </li>
              </ul>
              <Button
                onClick={() => handleSubscribe("creative-galaxy-pack")}
                disabled={isLoading}
                className="w-full bg-[#FF4B4B] hover:bg-[#FF6B6B] text-white rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-[#FF4B4B] flex items-center justify-center gap-2"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                {isLoading ? "Processing..." : "Subscribe Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
