import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FeaturedDrawings() {
  return (
    <section id="drawings" className="py-10 bg-[#FFF4E5]">
      <div className="container mx-auto px-4">
        <h2
          className="text-2xl md:text-4xl font-extrabold text-center mb-4"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          <span className="bg-[#FF4B4B] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2 border-4 border-[#E43B3B]">
            Look What Our
          </span>
          <span className="text-[#58CC02] px-2">Little Artists</span>
          <span className="bg-[#FFC800] text-[#78510D] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2 border-4 border-[#E5B800]">
            Created!
          </span>
        </h2>
        <p
          className="text-lg text-center text-[#4B4B4B] mb-8 max-w-3xl mx-auto"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          These amazing Cocomelon-inspired masterpieces were all made using Cocomelon Play's AI drawing tools! ✨
        </p>

        {/* App context banner */}
        <div className="bg-white rounded-full py-2 px-4 flex items-center justify-center gap-3 max-w-xs mx-auto mb-6 shadow-md border-4 border-[#FFC800]">
          <Image src="/logo.png" alt="Cocomelon Play Logo" width={40} height={40} className="rounded-full" />
          <p className="text-[#58CC02] font-bold" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
            Created with CCPlay! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Drawing 1 */}
          <div className="group relative">
            {/* Decorative background */}
            <div className="absolute -inset-1 bg-[#FF4B4B] rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-[#FF4B4B] transform transition-all group-hover:scale-105">
              <div className="relative h-48">
                <Image src="/drawings/alienship.png" alt="JJ's Adventure" fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#FFC800] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                    <Image src="/jj-happy.png" alt="JJ" width={30} height={30} />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FFF9E5]">
                <h3
                  className="text-lg font-bold text-[#58CC02]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  JJ's Adventure
                </h3>
                <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  "Emma drew JJ exploring the Cocomelon world!"
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium bg-[#E5FFC2] text-[#58CC02] px-2 py-0.5 rounded-full border-2 border-[#58CC02]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    By Emma, age 4
                  </span>
                  <span
                    className="text-xs font-medium bg-[#FFECEC] text-[#FF4B4B] px-2 py-0.5 rounded-full border-2 border-[#FF4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    AI Assisted
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing 2 */}
          <div className="group relative">
            {/* Decorative background */}
            <div className="absolute -inset-1 bg-[#1CB0F6] rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-[#1CB0F6] transform transition-all group-hover:scale-105">
              <div className="relative h-48">
                <Image src="/drawings/concert.png" alt="Wheels on the Bus" fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#FF4B4B] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bus"
                    >
                      <path d="M8 6v6" />
                      <path d="M16 6v6" />
                      <path d="M2 12h20" />
                      <path d="M18 18h2a2 2 0 0 0 2-2v-6a8 8 0 0 0-16 0v6a2 2 0 0 0 2 2h2" />
                      <path d="M9 18h6" />
                      <path d="M5 18v2" />
                      <path d="M19 18v2" />
                      <rect x="5" y="18" width="14" height="2" rx="1" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#E2F4FF]">
                <h3
                  className="text-lg font-bold text-[#1CB0F6]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Wheels on the Bus
                </h3>
                <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  "Liam brought the Cocomelon bus to life!"
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium bg-[#E2F4FF] text-[#1CB0F6] px-2 py-0.5 rounded-full border-2 border-[#1CB0F6]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    By Liam, age 5
                  </span>
                  <span
                    className="text-xs font-medium bg-[#FFECEC] text-[#FF4B4B] px-2 py-0.5 rounded-full border-2 border-[#FF4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    AI Animated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing 3 */}
          <div className="group relative">
            {/* Decorative background */}
            <div className="absolute -inset-1 bg-[#FFC800] rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-[#FFC800] transform transition-all group-hover:scale-105">
              <div className="relative h-48">
                <Image src="/drawings/f1race.png" alt="Bath Time Fun" fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#1CB0F6] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-bath"
                    >
                      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
                      <line x1="10" x2="8" y1="5" y2="7" />
                      <line x1="2" x2="22" y1="12" y2="12" />
                      <line x1="7" x2="7" y1="19" y2="21" />
                      <line x1="17" x2="17" y1="19" y2="21" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FFF9E5]">
                <h3
                  className="text-lg font-bold text-[#78510D]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Bath Time Fun
                </h3>
                <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  "Sophia drew JJ and friends splashing in the tub!"
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium bg-[#FFF9E5] text-[#78510D] px-2 py-0.5 rounded-full border-2 border-[#FFC800]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    By Sophia, age 3
                  </span>
                  <span
                    className="text-xs font-medium bg-[#FFECEC] text-[#FF4B4B] px-2 py-0.5 rounded-full border-2 border-[#FF4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Step-by-Step
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing 4 */}
          <div className="group relative">
            {/* Decorative background */}
            <div className="absolute -inset-1 bg-[#FF4B4B] rounded-3xl transform -rotate-2 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-[#FF4B4B] transform transition-all group-hover:scale-105">
              <div className="relative h-48">
                <Image src="/drawings/kidspark.png" alt="Farm Animals" fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#FFC800] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#78510D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-cow"
                    >
                      <path d="M12 15h2a6 6 0 0 0 6-6v-1a2 2 0 0 0-2-2h-2.5" />
                      <path d="M10 15h2" />
                      <path d="M12 15v4" />
                      <path d="M10 19h4" />
                      <path d="M12 9v.01" />
                      <path d="M6 15h2a6 6 0 0 1 6-6v-1a2 2 0 0 0-2-2h-2.5" />
                      <path d="M4 8v1" />
                      <path d="M20 8v1" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FFF9E5]">
                <h3
                  className="text-lg font-bold text-[#58CC02]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Farm Animals
                </h3>
                <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  "Noah drew Old MacDonald's farm with all the animals!"
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium bg-[#E5FFC2] text-[#58CC02] px-2 py-0.5 rounded-full border-2 border-[#58CC02]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    By Noah, age 6
                  </span>
                  <span
                    className="text-xs font-medium bg-[#FFECEC] text-[#FF4B4B] px-2 py-0.5 rounded-full border-2 border-[#FF4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    AI Colored
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing 5 */}
          <div className="group relative">
            {/* Decorative background */}
            <div className="absolute -inset-1 bg-[#1CB0F6] rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-[#1CB0F6] transform transition-all group-hover:scale-105">
              <div className="relative h-48">
                <Image src="/drawings/moons.png" alt="Playdate with Friends" fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#FF4B4B] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                    <Image src="/yoyo-happy.png" alt="YoYo" width={30} height={30} />
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#E2F4FF]">
                <h3
                  className="text-lg font-bold text-[#1CB0F6]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Playdate with Friends
                </h3>
                <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  "Olivia drew YoYo playing with all her friends!"
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium bg-[#E2F4FF] text-[#1CB0F6] px-2 py-0.5 rounded-full border-2 border-[#1CB0F6]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    By Olivia, age 4
                  </span>
                  <span
                    className="text-xs font-medium bg-[#FFECEC] text-[#FF4B4B] px-2 py-0.5 rounded-full border-2 border-[#FF4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Daily Challenge
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Drawing 6 */}
          <div className="group relative">
            {/* Decorative background */}
            <div className="absolute -inset-1 bg-[#FFC800] rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-[#FFC800] transform transition-all group-hover:scale-105">
              <div className="relative h-48">
                <Image src="/drawings/windmillmountain.png" alt="Watermelon Party" fill className="object-cover" />
                <div className="absolute top-3 right-3">
                  <div className="bg-[#8549BA] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
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
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#FFF9E5]">
                <h3
                  className="text-lg font-bold text-[#78510D]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Watermelon Party
                </h3>
                <p className="text-[#4B4B4B] mb-2" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                  "Jackson drew a Cocomelon birthday celebration!"
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className="text-xs font-medium bg-[#FFF9E5] text-[#78510D] px-2 py-0.5 rounded-full border-2 border-[#FFC800]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    By Jackson, age 5
                  </span>
                  <span
                    className="text-xs font-medium bg-[#FFECEC] text-[#FF4B4B] px-2 py-0.5 rounded-full border-2 border-[#FF4B4B]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    AI Enhanced
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-full px-6 py-4 text-lg font-bold shadow-lg transition-transform hover:scale-105 border-b-4 border-[#46A302]"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
            See More Amazing Drawings! ✨
          </Button>
        </div>
      </div>
    </section>
  )
}
