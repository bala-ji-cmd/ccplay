import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="container mx-auto py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Image
              src="/logo.webp"
              alt="Cocomelon Play Logo"
              width={70}
              height={70}
              quality={100}
              className="rounded-full border-4 border-[#FF4D79]"
              priority
            />
          </div>
          <span
            className="text-3xl md:text-4xl font-extrabold text-[#FF4D79]"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Cocomelon Play
          </span>
        </div>
        <nav className="hidden md:flex gap-4">
          <Link
            href="#draw"
            className="text-lg font-bold text-[#4A66E0] hover:text-[#FF4D79] transition-colors rounded-full px-3 py-2 hover:bg-[#FFD747]/20 flex items-center gap-1"
          >
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
              className="lucide lucide-pencil"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
            Draw with AI
          </Link>
          <Link
            href="#learn"
            className="text-lg font-bold text-[#4A66E0] hover:text-[#FF4D79] transition-colors rounded-full px-3 py-2 hover:bg-[#FFD747]/20 flex items-center gap-1"
          >
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
              className="lucide lucide-book-open"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            Learn with AI
          </Link>
          <Link
            href="#animate"
            className="text-lg font-bold text-[#4A66E0] hover:text-[#FF4D79] transition-colors rounded-full px-3 py-2 hover:bg-[#FFD747]/20 flex items-center gap-1"
          >
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
              className="lucide lucide-clapperboard"
            >
              <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4Z" />
              <path d="m4 11-.88-2.87a2 2 0 0 1 1.33-2.5l11.48-3.5a2 2 0 0 1 2.5 1.33l.87 2.87L4 11.01Z" />
              <path d="m6.6 4.99 3.38 4.2" />
              <path d="m11.86 3.38 3.38 4.2" />
              <path d="m17.13 1.77 3.38 4.2" />
            </svg>
            Animate with AI
          </Link>
          <Link
            href="#challenge"
            className="text-lg font-bold text-[#4A66E0] hover:text-[#FF4D79] transition-colors rounded-full px-3 py-2 hover:bg-[#FFD747]/20 flex items-center gap-1"
          >
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
              className="lucide lucide-calendar-check"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
              <path d="m9 16 2 2 4-4" />
            </svg>
            Daily Challenge
          </Link>
          {/* <Link
            href="#pricing"
            className="text-lg font-bold bg-[#FFD747] text-[#4A66E0] hover:bg-[#FFDF6B] transition-colors rounded-full px-4 py-2 flex items-center gap-1"
          >
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
              className="lucide lucide-tag"
            >
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
              <circle cx="7.5" cy="7.5" r="1.5" />
            </svg>
            Pricing
          </Link> */}
        </nav>
        <div className="flex items-center gap-2">
          <Button className="bg-[#FF4D79] hover:bg-[#FF6B8E] text-white rounded-full px-6 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-110 border-4 border-white">
            Try Now!
          </Button>
          <button className="md:hidden text-[#4A66E0]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
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