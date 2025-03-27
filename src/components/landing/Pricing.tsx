import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Pricing() {
  return (
    <section id="pricing" className="container mx-auto py-16 px-4">
        <h2
          className="text-3xl md:text-5xl font-extrabold text-center mb-6"
          style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
        >
          <span className="bg-[#4A66E0] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2">
            Unlock a World of
          </span>
          <span className="text-[#FF4D79] px-2">Cocomelon</span>
          <span className="bg-[#FFD747] text-[#4A66E0] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2">
            Creativity!
          </span>
        </h2>

        <p className="text-xl text-center text-[#5D5D5D] mb-12 max-w-3xl mx-auto">
          Choose the perfect plan with AI credits for your little artist and start creating Cocomelon masterpieces
          today!
        </p>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#FFD747] rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF4D79] rounded-full opacity-20"></div>

          {/* JJ's Fun Pack (Entry-Level) */}
          <div className="bg-gradient-to-br from-[#E9F7FF] to-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-[#E9F7FF] transform transition-all hover:scale-105 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24">
              <Image src="/jj-happy.png" alt="JJ" width={80} height={80} className="drop-shadow-lg" />
            </div>
            <div className="bg-[#E9F7FF] p-6 text-center pt-12">
              <h3
                className="text-2xl font-bold text-[#4A66E0]"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                JJ's Fun Pack
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#4A66E0]">$9.99</span>
                <span className="text-[#5D5D5D]">/month</span>
              </div>
              <div className="mt-2 bg-[#4A66E0]/10 rounded-full py-1 px-3 inline-block">
                <span className="text-[#4A66E0] font-bold">50 AI Credits/Month</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-[#E9F7FF] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#5D5D5D]">Basic Edits & Adds</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E9F7FF] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <span className="font-medium line-through text-[#5D5D5D]">Learn with AI</span>
                    <p className="text-sm text-[#5D5D5D]">Not Available</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E9F7FF] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <span className="font-medium line-through text-[#5D5D5D] ">Animate with AI</span>
                    <p className="text-sm text-[#5D5D5D]">Not Available</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E9F7FF] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#5D5D5D]">Standard Challenges</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E9F7FF] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#5D5D5D]">Standard Resolution</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#E9F7FF] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#5D5D5D]">Queued Support</p>
                  </div>
                </li>
              </ul>
              <Button className="w-full bg-[#E9F7FF] hover:bg-[#D9E7FF] text-[#4A66E0] rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-white flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-rocket"
                >
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
                Start Your Adventure!
              </Button>
            </div>
          </div>

          {/* YoYo's Adventure Pass (Mid-Tier) */}
          <div className="bg-gradient-to-br from-[#FFF8E0] to-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-[#FFD747] transform scale-110 z-10 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24">
              <Image src="/yoyo-happy.png" alt="YoYo" width={80} height={80} className="drop-shadow-lg" />
            </div>
            <div className="absolute -top-3 -right-3 bg-[#FF4D79] text-white text-base md:text-lg font-extrabold px-6 py-2 rounded-bl-lg rounded-tr-lg transform rotate-3 shadow-lg border-2 border-white">
              MOST POPULAR
            </div>
            <div className="bg-[#FFD747] p-6 text-center pt-12">
              <h3
                className="text-2xl font-bold text-[#4A66E0]"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                YoYo's Adventure Pass
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-[#4A66E0]">$19.99</span>
                <span className="text-[#5D5D5D]">/month</span>
              </div>
              <div className="mt-2 bg-[#4A66E0]/10 rounded-full py-1 px-3 inline-block">
                <span className="text-[#4A66E0] font-bold">150 AI Credits/Month</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF8E0] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#4A66E0]">Full Access (Edits, Adds, Removes)</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF8E0] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#4A66E0]">All Standard Guides</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF8E0] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <span className="font-medium line-through text-[#5D5D5D]">Animate with AI</span>
                    <p className="text-sm text-[#5D5D5D]">Not Available</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF8E0] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#4A66E0]">All Standard Challenges</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF8E0] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#4A66E0]">High Resolution</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFF8E0] rounded-full p-2 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#4A66E0"
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
                    <p className="text-sm text-[#4A66E0]">Standard Support</p>
                  </div>
                </li>
              </ul>
              <Button className="w-full bg-[#FFD747] hover:bg-[#FFDF6B] text-[#4A66E0] rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-white flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-party-popper"
                >
                  <path d="M5.8 11.3 2 22l10.7-3.79" />
                  <path d="M4 3h.01" />
                  <path d="M22 8h.01" />
                  <path d="M15 2h.01" />
                  <path d="M22 20h.01" />
                  <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                  <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
                  <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
                  <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
                </svg>
                Join the Adventure!
              </Button>
            </div>
          </div>

          {/* Cocomelon Creative Galaxy (Premium) */}
          <div className="bg-gradient-to-br from-[#FFECF2] to-white rounded-[2rem] shadow-xl overflow-hidden border-4 border-[#FF4D79] transform transition-all hover:scale-105 relative">
            <div className="absolute -top-6 -left-6 w-24 h-24">
              <Image src="/tomtom-happy.png" alt="TomTom" width={80} height={80} className="drop-shadow-lg" />
            </div>
            <div className="bg-[#FF4D79] p-6 text-center pt-12">
              <h3
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Cocomelon Creative Galaxy
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">$49.99</span>
                <span className="text-white opacity-80">/month</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full py-1 px-3 inline-block">
                <span className="text-white font-bold">Unlimited AI Fun!</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECF2] rounded-full p-2 flex-shrink-0">
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
                      className="lucide lucide-pencil"
                    >
                      <path d="M17 3a2.85 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Draw with AI</span>
                    <p className="text-sm text-[#FF4D79]">Full Access (All Features)</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECF2] rounded-full p-2 flex-shrink-0">
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
                      className="lucide lucide-book-open"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Learn with AI</span>
                    <p className="text-sm text-[#FF4D79]">All Guides + Exclusive Content</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECF2] rounded-full p-2 flex-shrink-0">
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
                    <p className="text-sm text-[#FF4D79]">Full Animation Access</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECF2] rounded-full p-2 flex-shrink-0">
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
                    <p className="text-sm text-[#FF4D79]">All Challenges + Premium</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECF2] rounded-full p-2 flex-shrink-0">
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
                      className="lucide lucide-download"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Download & Share</span>
                    <p className="text-sm text-[#FF4D79]">High Resolution + GIF</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-[#FFECF2] rounded-full p-2 flex-shrink-0">
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
                      className="lucide lucide-headphones"
                    >
                      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Customer Support</span>
                    <p className="text-sm text-[#FF4D79]">Priority Support</p>
                  </div>
                </li>
              </ul>
              <Button className="w-full bg-[#FF4D79] hover:bg-[#FF6B8E] text-white rounded-full py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-white flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-crown"
                >
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                </svg>
                Unlock Galaxy of Fun!
              </Button>
            </div>
          </div>
        </div>
      </section>
  )
} 