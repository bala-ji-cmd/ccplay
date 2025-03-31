'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSubscription } from "@/hooks/useSubscription"

const navigationItems = [
  {
    name: 'Draw with AI',
    href: '/draw',
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
    name: 'Learn with AI',
    href: '/learn',
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
    name: 'Animate with AI',
    href: '/animate',
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
    name: 'Daily Challenge',
    href: '/daily-challenge',
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
  {
    name: 'Pricing',
    href: '/pricing',
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
        <path d="M2.5 19.5L22 19.5" />
        <path d="M3.5 5.5L7.5 9.5" />
        <path d="M8.5 4.5L6.5 10.5" />
        <path d="M11.5 4.5L9.5 10.5" />
        <path d="M14.5 4.5L12.5 10.5" />
        <path d="M17.5 4.5L15.5 10.5" />
        <path d="M20.5 4.5L18.5 10.5" />
      </svg>
    ),
  },
];

export function Header() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [showDropdown, setShowDropdown] = useState(false)
    const { subscriptionStatus } = useSubscription();

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <header className="container mx-auto py-2 px-4 flex items-center justify-between">
            <Link href="/">
            <div className="flex items-center gap-2">
                <div className="transform -rotate-6 hover:rotate-0 transition-all duration-300">
                    <Image
                        src="/logo.png"
                        alt="Cocomelon Play Logo"
                        width={70}
                        height={70}
                        quality={100}
                        className="w-[32px] h-[32px] hover:scale-110 transition-transform duration-300 ease-in-out 
                                   hover:filter hover:drop-shadow-xl"
                        priority
                        style={{ backgroundColor: 'transparent' }}
                        unoptimized
                    />
                </div>
                <span
                    className="text-xl font-extrabold text-[#FF4D79]"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
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
                        className="text-sm font-bold text-[#4A66E0] hover:text-[#FF4D79] transition-colors 
                                   rounded-full px-3 py-1.5 hover:bg-[#FFD747]/20 
                                   flex items-center gap-1.5 whitespace-nowrap"
                    >
                        {item.icon}
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-white border border-[#FF4D79] text-[#FF4D79] hover:bg-[#FF4D79] 
                             hover:text-white rounded-full px-4 py-2 text-lg font-medium text-sm shadow-lg 
                             transition-transform hover:scale-105 flex items-center gap-2">
                    {subscriptionStatus?.creditsLeft} Credits
                </Button>
            </div>
            <div className="flex items-center gap-2">
                {user ? (
                    <div className="relative">
                        
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 bg-white hover:bg-gray-50 text-[#4A66E0] 
                                       px-2 py-1.5 rounded-full font-medium transition-all duration-300 
                                       shadow-sm"
                        >
                            <div className="w-6 h-6 bg-[#4A66E0] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">
                                    {user.email?.[0].toUpperCase()}
                                </span>
                            </div>
                            <span className="hidden md:inline text-sm">Welcome!</span>
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
                                className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                            >
                                <path d="m6 9 6 6 6-6"/>
                            </svg>
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm text-gray-600">Signed in as</p>
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.email}
                                    </p>
                                </div>
                                <Link
                                    href="/app"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Go to App
                                </Link>
                                <Link
                                    href="/app/profile"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Profile Settings
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link 
                            href="/auth/login"
                            className="px-4 py-2 rounded-full font-medium text-sm 
                                     transition-all duration-300 hover:scale-105 border border-[#4A66E0] 
                                     text-[#4A66E0] hover:bg-[#4A66E0] hover:text-white whitespace-nowrap"
                        >
                            Sign in
                        </Link>
                        <Link 
                            href="/auth/signup"
                            className="px-4 py-2 rounded-full font-medium text-sm
                                     transition-all duration-300 hover:scale-105 bg-[#FF4D79] 
                                     hover:bg-[#ff3366] text-white shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            Sign up for credits
                        </Link>
                    </>
                )}
                <button className="md:hidden ml-1 text-[#4A66E0]">
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
        </header>
    )
}