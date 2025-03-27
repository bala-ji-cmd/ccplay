import Image from "next/image"

export function PainPointSolution() {
    return (
        <section id="features" className="container mx-auto py-12 px-4">
        <h2
          className="text-3xl md:text-5xl font-extrabold text-center mb-6"
          style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
        >
          <span className="bg-[#FFD747] text-[#4A66E0] px-4 py-2 rounded-xl inline-block transform -rotate-2">
            Turn Drawing
          </span>
          <span className="text-[#FF4D79] px-2">Challenges</span> into
          <span className="bg-[#4A66E0] text-white px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2">
            Fun!
          </span>
        </h2>

        <p className="text-xl text-center text-[#5D5D5D] mb-12 max-w-3xl mx-auto">
          Just like JJ and friends overcome challenges in Cocomelon, we help kids overcome drawing difficulties!
        </p>

        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-[#FFD747] rounded-full opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#FF4D79] rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#4A66E0] rounded-full opacity-10"></div>

          {/* Dotted line connector for desktop */}
          <div className="hidden md:block absolute top-1/4 left-1/2 h-3/4 border-l-4 border-dashed border-[#FFD747] transform -translate-x-1/2"></div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-16 relative z-10">
            {/* Problem 1 */}
            <div className="bg-gradient-to-br from-[#FFECF2] to-white rounded-[2rem] shadow-xl overflow-hidden transform transition-all hover:scale-105 border-4 border-[#FF4D79] relative">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#FF4D79] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Uh Oh!
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="min-w-[80px] h-[80px] rounded-full bg-white border-4 border-[#FF4D79] flex items-center justify-center overflow-hidden">
                    <Image src="/jj-sad.png" alt="JJ is sad" width={70} height={70} />
                  </div>
                  <div>
                    <p className="text-xl font-medium">
                      "My child loves Cocomelon but gets frustrated when trying to draw the characters"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E9F7FF] to-white rounded-[2rem] shadow-xl overflow-hidden transform transition-all hover:scale-105 border-4 border-[#4A66E0] relative">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#4A66E0] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Yay!
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="min-w-[80px] h-[80px] rounded-full bg-white border-4 border-[#4A66E0] flex items-center justify-center overflow-hidden">
                    <Image src="/cody-happy.png" alt="Cody is happy" width={70} height={70} />
                  </div>
                  <div>
                    <p className="text-xl font-medium">
                      "Cocomelon Play's AI buddy Cody gives step-by-step guidance to draw any Cocomelon character!"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="bg-gradient-to-br from-[#FFECF2] to-white rounded-[2rem] shadow-xl overflow-hidden transform transition-all hover:scale-105 border-4 border-[#FF4D79] relative">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#FF4D79] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Uh Oh!
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="min-w-[80px] h-[80px] rounded-full bg-white border-4 border-[#FF4D79] flex items-center justify-center overflow-hidden">
                    <Image src="/yoyo-sad.png" alt="YoYo is sad" width={70} height={70} />
                  </div>
                  <div>
                    <p className="text-xl font-medium">"My drawings don't look like the real Cocomelon characters"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E9F7FF] to-white rounded-[2rem] shadow-xl overflow-hidden transform transition-all hover:scale-105 border-4 border-[#4A66E0] relative">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#4A66E0] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Yay!
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="min-w-[80px] h-[80px] rounded-full bg-white border-4 border-[#4A66E0] flex items-center justify-center overflow-hidden">
                    <Image src="/jj-happy.png" alt="JJ is happy" width={70} height={70} />
                  </div>
                  <div>
                    <p className="text-xl font-medium">
                      "JJ the AI helper can improve your drawings with simple voice commands!"
                    </p>
                    <div className="mt-2">
                      <span className="inline-block bg-[#FFD747] text-[#4A66E0] text-sm font-bold px-3 py-1 rounded-full mr-2 mt-2">
                        Magic Touch!
                      </span>
                      <span className="inline-block bg-[#FFD747] text-[#4A66E0] text-sm font-bold px-3 py-1 rounded-full mr-2 mt-2">
                        Color Fix!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="bg-gradient-to-br from-[#FFECF2] to-white rounded-[2rem] shadow-xl overflow-hidden transform transition-all hover:scale-105 border-4 border-[#FF4D79] relative">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#FF4D79] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Uh Oh!
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="min-w-[80px] h-[80px] rounded-full bg-white border-4 border-[#FF4D79] flex items-center justify-center overflow-hidden">
                    <Image src="/tomtom-sad.png" alt="TomTom is sad" width={70} height={70} />
                  </div>
                  <div>
                    <p className="text-xl font-medium">"Static drawings don't keep my child engaged for long"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E9F7FF] to-white rounded-[2rem] shadow-xl overflow-hidden transform transition-all hover:scale-105 border-4 border-[#4A66E0] relative">
              <div className="absolute -top-5 -right-5 w-16 h-16 bg-[#4A66E0] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
                <h3
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                >
                  Yay!
                </h3>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-6">
                  <div className="min-w-[80px] h-[80px] rounded-full bg-white border-4 border-[#4A66E0] flex items-center justify-center overflow-hidden">
                    <Image src="/astor-happy.png" alt="Astor is happy" width={70} height={70} />
                  </div>
                  <div>
                    <p className="text-xl font-medium">
                      "Astor brings drawings to life with animation - watch JJ dance and sing!"
                    </p>
                    <div className="mt-2 relative">
                      <span
                        className="inline-block bg-[#FFD747] text-[#4A66E0] text-sm font-bold px-3 py-1 rounded-full mr-2 mt-2 animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      >
                        Dance!
                      </span>
                      <span
                        className="inline-block bg-[#FFD747] text-[#4A66E0] text-sm font-bold px-3 py-1 rounded-full mr-2 mt-2 animate-bounce"
                        style={{ animationDelay: "0.3s" }}
                      >
                        Sing!
                      </span>
                      <span
                        className="inline-block bg-[#FFD747] text-[#4A66E0] text-sm font-bold px-3 py-1 rounded-full mr-2 mt-2 animate-bounce"
                        style={{ animationDelay: "0.5s" }}
                      >
                        Move!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}