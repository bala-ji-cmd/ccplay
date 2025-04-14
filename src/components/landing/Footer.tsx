"use client"

import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { memo, useCallback, useEffect } from "react"

// Memoized navigation items
const navigationItems = [
  {
    name: "Draw with AI",
    href: "/draw",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#58CC02"
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
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#58CC02"
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
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#58CC02"
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
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#58CC02"
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
]

const companyLinks = [
  { name: "About Us", href: "/company/about" },
  { name: "Careers", href: "/company/careers" },
  { name: "Press", href: "/company/press" },
  { name: "Blog", href: "/company/blog" },
]

const supportLinks = [
  { name: "Help Center", href: "/support/help-center" },
  { name: "Safety Tips", href: "/support/safety-tips" },
  { name: "Contact Us", href: "/support/contact" },
  { name: "Community", href: "/support/community" },
]

const legalLinks = [
  { name: "Terms of Service", href: "/legal/terms" },
  { name: "Privacy Policy", href: "/legal/privacy" },
  { name: "Cookie Policy", href: "/legal/cookies" },
  { name: "COPPA Compliance", href: "/legal/coppa" },
]

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF4D79"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-facebook"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF4D79"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-twitter"
      >
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF4D79"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-instagram"
      >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF4D79"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-youtube"
      >
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <path d="m10 15 5-3-5-3z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "#",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF4D79"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-tiktok"
      >
        <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
        <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M15 8v8a4 4 0 0 1-4 4" />
        <line x1="15" x2="15" y1="4" y2="12" />
      </svg>
    ),
  },
]

// Memoized components
const FooterLink = memo(({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <Link 
    href={href} 
    prefetch={true}
    className={`text-[#4B4B4B] hover:text-[#FF4D79] transition-colors ${className}`}
    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
  >
    {children}
  </Link>
))

FooterLink.displayName = 'FooterLink'

const FooterSection = memo(({ title, links }: { title: string; links: { name: string; href: string }[] }) => (
  <div>
    <h3
      className="text-[#58CC02] font-bold text-lg mb-4"
      style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
    >
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <FooterLink href={link.href} className="font-bold">
            {link.name}
          </FooterLink>
        </li>
      ))}
    </ul>
  </div>
))

FooterSection.displayName = 'FooterSection'

const SocialLink = memo(({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a
    href={href}
    className="bg-[#FFF9E5] hover:bg-[#FFD900] p-2 rounded-full transition-colors border-2 border-[#FFD900]"
  >
    {icon}
  </a>
))

SocialLink.displayName = 'SocialLink'

export const Footer = memo(function Footer() {
  const { user } = useAuth()

  // Prefetch all navigation routes
  const prefetchRoutes = useCallback(() => {
    navigationItems.forEach(item => {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = item.href
      document.head.appendChild(link)
    })
  }, [])

  useEffect(() => {
    prefetchRoutes()
  }, [prefetchRoutes])

  return (
    <footer className="relative overflow-hidden bg-[#FFF4E5] py-12 text-[#4B4B4B]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Musical notes */}
        <div className="absolute top-10 left-[10%] opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="#58CC02"
            stroke="#58CC02"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-music"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <div className="absolute top-20 right-[15%] opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#58CC02"
            stroke="#58CC02"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-music"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>

        {/* Stars */}
        <div className="absolute bottom-10 left-[25%] opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="#FFD900"
            stroke="#FFD900"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <div className="absolute top-16 left-[65%] opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="#FFD900"
            stroke="#FFD900"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        {/* Watermelons */}
        <div className="absolute bottom-5 right-[10%] opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
            fill="#FF4D79"
            stroke="#FF4D79"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 10 10" />
            <path d="M12 12 2.5 9.5" />
            <path d="m12 12 4.5 7.5" />
            <path d="M12 12 22 8" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top section with logo and tagline */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b-4 border-dashed border-[#FFD900] pb-8">
          <Link href="/" prefetch={true}>
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-white p-2 rounded-full border-4 border-[#FFD900] shadow-md">
                <Image
                  src="/logo.png"
                  alt="Cocomelon Play Logo"
                  width={60}
                  height={60}
                  quality={100}
                  className="hover:scale-110 transition-transform duration-300 ease-in-out hover:filter hover:drop-shadow-xl"
                  style={{ backgroundColor: "transparent" }}
                  unoptimized
                />
              </div>
              <div>
                <span
                  className="text-2xl md:text-3xl font-extrabold text-[#FF4D79]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Cocomelon Play
                </span>
                <p className="text-sm text-[#8549BA]" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  Draw, Learn & Animate with Cocomelon! ✨
                </p>
              </div>
            </div>
          </Link>

          <div className="flex gap-4">
            {!user && (
              <Link
                href="/auth/signup"
                prefetch={true}
                className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-2xl px-6 py-3 font-bold transition-all hover:scale-105 text-sm md:text-base border-b-4 border-[#46A302] shadow-md"
                style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
              >
                Sign Up Free ✨
              </Link>
            )}
          </div>
        </div>

        {/* Middle section with navigation links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <FooterSection title="Explore" links={navigationItems.map(item => ({ name: item.name, href: item.href }))} />
          <FooterSection title="Company" links={companyLinks} />
          <FooterSection title="Support" links={supportLinks} />
          <FooterSection title="Legal" links={legalLinks} />
        </div>

        {/* Bottom section with social links and copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t-4 border-dashed border-[#FFD900]">
          <p
            className="text-sm text-[#8549BA] mb-4 md:mb-0 font-bold"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            © 2024 Cocomelon Play. All rights reserved. ✨
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <SocialLink key={social.name} href={social.href} icon={social.icon} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
})

Footer.displayName = 'Footer'
