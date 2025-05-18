"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useSubscription } from "@/hooks/useSubscription"
import { motion } from "framer-motion"

const navigationItems = [
  {
    name: "Draw with AI",
    href: "/draw",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      </svg>
    ),
  },
  {
    name: "Learn with AI",
    href: "/learn",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    name: "Story with AI",
    href: "/story",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
        <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.33l.87 2.87L4 11.01Z" />
      </svg>
    ),
  },
  {
    name: "Daily Challenge",
    href: "/daily-challenge",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    ),
  },
  //   {
  //     name: 'Pricing',
  //     href: '/pricing',
  //     icon: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="20"
  //         height="20"
  //         viewBox="0 0 24 24"
  //         fill="none"
  //         stroke="currentColor"
  //         strokeWidth="2"
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //       >
  //         <path d="M2.5 19.5L22 19.5" />
  //         <path d="M3.5 5.5L7.5 9.5" />
  //         <path d="M8.5 4.5L6.5 10.5" />
  //         <path d="M11.5 4.5L9.5 10.5" />
  //         <path d="M14.5 4.5L12.5 10.5" />
  //         <path d="M17.5 4.5L15.5 10.5" />
  //         <path d="M20.5 4.5L18.5 10.5" />
  //       </svg>
  //     ),
  //   },
]

export function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [showDropdown, setShowDropdown] = useState(false)
  const { subscriptionStatus, refreshSubscription } = useSubscription()
  const [prevCredits, setPrevCredits] = useState(subscriptionStatus?.creditsLeft || -1)
  const [isAnimating, setIsAnimating] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Effect to setup real-time subscription updates
  useEffect(() => {
    if (!user?.id) return

    // Initial fetch
    refreshSubscription()

    console.log("refreshed subscription", subscriptionStatus?.creditsLeft)

    // // Subscribe to real-time changes
    // const subscription = supabase
    //     .channel('credits_changes')
    //     .on('postgres_changes', {
    //         event: '*',
    //         schema: 'public',
    //         table: 'subscriptions',
    //         filter: `user_id=eq.${user.id}`
    //     }, () => {
    //         refreshSubscription();
    //     })
    //     .subscribe();

    // return () => {
    //     subscription.unsubscribe();
    // };
  }, [user?.id, refreshSubscription])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="w-full bg-[#FFF4E5] py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -6 }}
              animate={{
                rotate: [-6, 0, -6],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Image
                src="/logo.png"
                alt="Cocomelon Play Logo"
                width={70}
                height={70}
                quality={100}
                className="w-[32px] h-[32px] hover:scale-110 transition-transform duration-300 ease-in-out 
                           hover:filter hover:drop-shadow-xl"
                priority
                style={{ backgroundColor: "transparent" }}
                unoptimized
              />
            </motion.div>
            <span
              className="text-xl font-extrabold text-[#FF4D79]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              Cocomelon Play
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-bold text-[#58CC02] hover:text-[#FF4D79] transition-colors 
                           rounded-full px-3 py-1.5 hover:bg-[#E5FFC2] 
                           flex items-center gap-1.5 whitespace-nowrap border-2 border-transparent hover:border-[#58CC02]"
              style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
        {user && (
          <div className="flex items-center gap-2">
            {subscriptionStatus?.creditsLeft && (
              <motion.div
                animate={
                  isAnimating
                    ? {
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        rotate: [0, 10, -10, 5, 0],
                      }
                    : { scale: 1, rotate: 0 }
                }
                transition={{ duration: 0.5 }}
                className="bg-white border-4 border-[#FFD900] text-[#8549BA] hover:bg-[#FFF9E5] 
         hover:text-[#FF4D79] rounded-full px-4 py-2 text-sm font-bold shadow-lg 
         transition-all hover:scale-105 flex items-center gap-2"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <span className="text-[#FF4D79]">✨</span> {subscriptionStatus?.creditsLeft || -1} Credits
              </motion.div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-white hover:bg-[#FFF9E5] text-[#58CC02] 
                                 px-2 py-1.5 rounded-full font-bold transition-all duration-300 
                                 shadow-sm hover:shadow-md border-2 border-[#FFD900]"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF4D79] to-[#8549BA] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.user_metadata.childName?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:inline text-sm">Welcome!</span>
                <motion.div animate={{ rotate: showDropdown ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </motion.div>
              </button>

              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-3 z-50 border-4 border-[#FFD900]"
                >
                  <div className="px-4 py-2 border-b-2 border-dashed border-[#FFD900]">
                    <p className="text-sm text-[#8549BA]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                      Playing as
                    </p>
                    <p
                      className="text-sm font-bold text-[#4B4B4B] truncate"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      {user.user_metadata.childName}
                    </p>
                  </div>
                  <div className="py-2 space-y-1">
                    <Link
                      href="/app/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4B4B4B] hover:bg-[#E5FFC2] transition-colors"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M20 21a8 8 0 1 0-16 0" />
                      </svg>
                      Profile
                    </Link>
                    <Link
                      href="/app/settings"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4B4B4B] hover:bg-[#E5FFC2] transition-colors"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Settings
                    </Link>
                    <Link
                      href="/app/notifications"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4B4B4B] hover:bg-[#E5FFC2] transition-colors"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                      Notifications
                    </Link>
                    <div className="px-3 pt-2 pb-1">
                      <div className="border-t-2 border-dashed border-[#FFD900]"></div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#FF4B4B] hover:bg-[#FFEBEB] w-full text-left transition-colors"
                      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full font-bold text-sm 
                               transition-all duration-300 hover:scale-105 border-2 border-[#58CC02] 
                               text-[#58CC02] hover:bg-[#E5FFC2] whitespace-nowrap"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-full font-bold text-sm
                               transition-all duration-300 hover:scale-105 bg-[#FF4D79] 
                               hover:bg-[#ff3366] text-white shadow-md hover:shadow-lg whitespace-nowrap border-b-4 border-[#e63e69]"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Sign up for credits
              </Link>
            </>
          )}
          <button className="md:hidden ml-1 text-[#58CC02] bg-white p-2 rounded-full border-2 border-[#FFD900]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="w-full border-b-4 border-dashed border-[#FFD900] mt-5"></div>
    </header>
  )
}
