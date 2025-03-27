import Image from "next/image"
import { Button } from "@/components/ui/button"

export function FeaturedDrawings() {
    return (
        <section id="drawings" className="py-16 bg-[#E9F7FF]">
        <div className="container mx-auto px-4">
          <h2
            className="text-3xl md:text-5xl font-extrabold text-center mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            <span className="bg-[#FF4D79] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2">
              Look What Our
            </span>
            <span className="text-[#4A66E0] px-2">Little Artists</span>
            <span className="bg-[#FFD747] text-[#4A66E0] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2">
              Created!
            </span>
          </h2>
          <p className="text-xl text-center text-[#5D5D5D] mb-8 max-w-3xl mx-auto">
            These amazing Cocomelon-inspired masterpieces were all made using Cocomelon Play's AI drawing tools!
          </p>

          {/* App context banner */}
          <div className="bg-white rounded-full py-3 px-6 flex items-center justify-center gap-3 max-w-md mx-auto mb-10 shadow-md border-2 border-[#FFD747]">
            <Image src="/logo.png" alt="Cocomelon Play Logo" width={40} height={40} className="rounded-full" />
            <p className="text-[#4A66E0] font-bold">Created with Cocomelon Play!</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Drawing 1 */}
            <div className="group relative">
              {/* Decorative background */}
              <div className="absolute -inset-2 bg-[#FF4D79] rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform"></div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-white transform transition-all group-hover:scale-105">
                <div className="relative h-64">
                  <Image src="/drawing-1.png" alt="JJ's Adventure" fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#FFD747] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                      <Image src="/jj-happy.png" alt="JJ" width={30} height={30} />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-white to-[#E9F7FF]/30">
                  <h3 className="text-xl font-bold text-[#4A66E0]">JJ's Adventure</h3>
                  <p className="text-[#5D5D5D] mb-2">"Emma drew JJ exploring the Cocomelon world!"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-[#E9F7FF] text-[#4A66E0] px-3 py-1 rounded-full">
                      By Emma, age 4
                    </span>
                    <span className="text-sm font-medium bg-[#FFECF2] text-[#FF4D79] px-3 py-1 rounded-full">
                      AI Assisted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawing 2 */}
            <div className="group relative">
              {/* Decorative background */}
              <div className="absolute -inset-2 bg-[#4A66E0] rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform"></div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-white transform transition-all group-hover:scale-105">
                <div className="relative h-64">
                  <Image src="/drawing-2.png" alt="Wheels on the Bus" fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#FF4D79] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
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
                <div className="p-4 bg-gradient-to-b from-white to-[#E9F7FF]/30">
                  <h3 className="text-xl font-bold text-[#4A66E0]">Wheels on the Bus</h3>
                  <p className="text-[#5D5D5D] mb-2">"Liam brought the Cocomelon bus to life!"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-[#E9F7FF] text-[#4A66E0] px-3 py-1 rounded-full">
                      By Liam, age 5
                    </span>
                    <span className="text-sm font-medium bg-[#FFECF2] text-[#FF4D79] px-3 py-1 rounded-full">
                      AI Animated
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawing 3 */}
            <div className="group relative">
              {/* Decorative background */}
              <div className="absolute -inset-2 bg-[#FFD747] rounded-3xl transform rotate-1 group-hover:rotate-0 transition-transform"></div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-white transform transition-all group-hover:scale-105">
                <div className="relative h-64">
                  <Image src="/drawing-3.png" alt="Bath Time Fun" fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#4A66E0] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
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
                <div className="p-4 bg-gradient-to-b from-white to-[#E9F7FF]/30">
                  <h3 className="text-xl font-bold text-[#4A66E0]">Bath Time Fun</h3>
                  <p className="text-[#5D5D5D] mb-2">"Sophia drew JJ and friends splashing in the tub!"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-[#E9F7FF] text-[#4A66E0] px-3 py-1 rounded-full">
                      By Sophia, age 3
                    </span>
                    <span className="text-sm font-medium bg-[#FFECF2] text-[#FF4D79] px-3 py-1 rounded-full">
                      Step-by-Step
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawing 4 */}
            <div className="group relative">
              {/* Decorative background */}
              <div className="absolute -inset-2 bg-[#FF4D79] rounded-3xl transform -rotate-2 group-hover:rotate-0 transition-transform"></div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-white transform transition-all group-hover:scale-105">
                <div className="relative h-64">
                  <Image src="/drawing-4.png" alt="Farm Animals" fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#FFD747] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4A66E0"
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
                <div className="p-4 bg-gradient-to-b from-white to-[#E9F7FF]/30">
                  <h3 className="text-xl font-bold text-[#4A66E0]">Farm Animals</h3>
                  <p className="text-[#5D5D5D] mb-2">"Noah drew Old MacDonald's farm with all the animals!"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-[#E9F7FF] text-[#4A66E0] px-3 py-1 rounded-full">
                      By Noah, age 6
                    </span>
                    <span className="text-sm font-medium bg-[#FFECF2] text-[#FF4D79] px-3 py-1 rounded-full">
                      AI Colored
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawing 5 */}
            <div className="group relative">
              {/* Decorative background */}
              <div className="absolute -inset-2 bg-[#4A66E0] rounded-3xl transform rotate-2 group-hover:rotate-0 transition-transform"></div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-white transform transition-all group-hover:scale-105">
                <div className="relative h-64">
                  <Image src="/drawing-5.png" alt="Playdate with Friends" fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#FF4D79] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
                      <Image src="/yoyo-happy.png" alt="YoYo" width={30} height={30} />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-white to-[#E9F7FF]/30">
                  <h3 className="text-xl font-bold text-[#4A66E0]">Playdate with Friends</h3>
                  <p className="text-[#5D5D5D] mb-2">"Olivia drew YoYo playing with all her friends!"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-[#E9F7FF] text-[#4A66E0] px-3 py-1 rounded-full">
                      By Olivia, age 4
                    </span>
                    <span className="text-sm font-medium bg-[#FFECF2] text-[#FF4D79] px-3 py-1 rounded-full">
                      Daily Challenge
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawing 6 */}
            <div className="group relative">
              {/* Decorative background */}
              <div className="absolute -inset-2 bg-[#FFD747] rounded-3xl transform -rotate-1 group-hover:rotate-0 transition-transform"></div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-xl relative z-10 border-4 border-white transform transition-all group-hover:scale-105">
                <div className="relative h-64">
                  <Image src="/drawing-6.png" alt="Watermelon Party" fill className="object-cover" />
                  <div className="absolute top-3 right-3">
                    <div className="bg-[#4A66E0] rounded-full h-10 w-10 flex items-center justify-center border-2 border-white">
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
                <div className="p-4 bg-gradient-to-b from-white to-[#E9F7FF]/30">
                  <h3 className="text-xl font-bold text-[#4A66E0]">Watermelon Party</h3>
                  <p className="text-[#5D5D5D] mb-2">"Jackson drew a Cocomelon birthday celebration!"</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium bg-[#E9F7FF] text-[#4A66E0] px-3 py-1 rounded-full">
                      By Jackson, age 5
                    </span>
                    <span className="text-sm font-medium bg-[#FFECF2] text-[#FF4D79] px-3 py-1 rounded-full">
                      AI Enhanced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-[#FFD747] hover:bg-[#FFDF6B] text-[#4A66E0] rounded-full px-8 py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-4 border-white">
              See More Amazing Drawings!
            </Button>
          </div>
        </div>
      </section>
    )
}