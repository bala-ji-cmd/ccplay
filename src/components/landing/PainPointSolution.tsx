import Image from "next/image"

export function PainPointSolution() {
  return (
    <section id="features" className=" mx-auto py-10 px-20 w-full bg-[#FFF4E5] ">
      <h2
        className="text-2xl md:text-4xl font-extrabold text-center mb-4"
        style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
      >
        <span className="bg-[#FF4B4B] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2 border-b-4 border-[#E43B3B]">
          Turn Drawing
        </span>
        <span className="text-[#58CC02] px-2">Challenges</span> into
        <span className="bg-[#FFC800] text-[#78510D] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2 border-b-4 border-[#E6AC00]">
          Fun! ✨
        </span>
      </h2>

      <p
        className="text-lg text-center text-[#4B4B4B] mb-8 max-w-3xl mx-auto"
        style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
      >
        Just like JJ and friends overcome challenges in Cocomelon, we help kids overcome drawing difficulties! ✨
      </p>

      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#FFC800] rounded-full opacity-20"></div>
        <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-[#FF4B4B] rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#1CB0F6] rounded-full opacity-10"></div>

        {/* Dotted line connector for desktop */}
        <div className="hidden md:block absolute top-1/4 left-1/2 h-3/4 border-l-4 border-dashed border-[#FFC800] transform -translate-x-1/2"></div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 relative z-10">
          {/* Problem 1 */}
          <div className="bg-gradient-to-br from-[#FFF9E5] to-white rounded-[1.5rem] shadow-lg overflow-hidden transform transition-all hover:scale-102 border-4 border-[#FF4B4B] relative">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#FF4B4B] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Uh Oh!
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="min-w-[60px] h-[60px] rounded-full bg-white border-4 border-[#FF4B4B] flex items-center justify-center overflow-hidden">
                  <Image src="/jj-sad.png" alt="JJ is sad" width={50} height={50} />
                </div>
                <div>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                  >
                    "My child struggles to start drawing — Needs creative guidance."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#E2F4FF] to-white rounded-[1.5rem] shadow-lg overflow-hidden transform transition-all hover:scale-102 border-4 border-[#1CB0F6] relative">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#58CC02] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Yay! ✨
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="min-w-[60px] h-[60px] rounded-full bg-white border-4 border-[#1CB0F6] flex items-center justify-center overflow-hidden">
                  <Image src="/jj-happy.png" alt="YoYo is happy" width={50} height={50} />
                </div>
                <div>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                  >
                    "Our AI buddy YoYo — Builds confidence with step-by-step guidance! ✨"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Problem 2 */}
          <div className="bg-gradient-to-br from-[#FFF9E5] to-white rounded-[1.5rem] shadow-lg overflow-hidden transform transition-all hover:scale-102 border-4 border-[#FF4B4B] relative">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#FF4B4B] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Uh Oh!
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="min-w-[60px] h-[60px] rounded-full bg-white border-4 border-[#FF4B4B] flex items-center justify-center overflow-hidden">
                  <Image src="/yoyo-sad.png" alt="YoYo is sad" width={50} height={50} />
                </div>
                <div>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                  >
                    "My child is dissatisfied with drawing results — Seeks easy improvement methods."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#E2F4FF] to-white rounded-[1.5rem] shadow-lg overflow-hidden transform transition-all hover:scale-102 border-4 border-[#1CB0F6] relative">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#58CC02] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Yay! ✨
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="min-w-[60px] h-[60px] rounded-full bg-white border-4 border-[#1CB0F6] flex items-center justify-center overflow-hidden">
                  <Image src="/yoyo-happy.png" alt="JJ is happy" width={50} height={50} />
                </div>
                <div>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                  >
                    "Our AI helper can improve your drawings with simple voice commands! ✨"
                  </p>
                  <div className="mt-2">
                    <span className="inline-block bg-[#FFC800] text-[#78510D] text-xs font-bold px-3 py-1 rounded-full mr-2 mt-2 border-2 border-[#E6AC00]">
                      Magic Touch! ✨
                    </span>
                    <span className="inline-block bg-[#FFC800] text-[#78510D] text-xs font-bold px-3 py-1 rounded-full mr-2 mt-2 border-2 border-[#E6AC00]">
                      Color Fix! ✨
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Problem 3 */}
          <div className="bg-gradient-to-br from-[#FFF9E5] to-white rounded-[1.5rem] shadow-lg overflow-hidden transform transition-all hover:scale-102 border-4 border-[#FF4B4B] relative">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#FF4B4B] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Uh Oh!
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="min-w-[60px] h-[60px] rounded-full bg-white border-4 border-[#FF4B4B] flex items-center justify-center overflow-hidden">
                  <Image src="/tomtom-sad.png" alt="TomTom is sad" width={50} height={50} />
                </div>
                <div>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                  >
                    "My child loses interest post-drawing — Desires engaging experiences."
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#E2F4FF] to-white rounded-[1.5rem] shadow-lg overflow-hidden transform transition-all hover:scale-102 border-4 border-[#1CB0F6] relative">
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-[#58CC02] rounded-full flex items-center justify-center transform rotate-12 border-4 border-white">
              <h3
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
              >
                Yay! ✨
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4">
                <div className="min-w-[60px] h-[60px] rounded-full bg-white border-4 border-[#1CB0F6] flex items-center justify-center overflow-hidden">
                  <Image src="/tomtom-happy.png" alt="Astor is happy" width={50} height={50} />
                </div>
                <div>
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
                  >
                    "Our AI teacher TomTom brings drawings to life with animation! ✨"
                  </p>
                  <div className="mt-2 relative">
                    <span
                      className="inline-block bg-[#FFC800] text-[#78510D] text-xs font-bold px-3 py-1 rounded-full mr-2 mt-2 animate-bounce border-2 border-[#E6AC00]"
                      style={{ animationDelay: "0.1s" }}
                    >
                      Dance! ✨
                    </span>
                    <span
                      className="inline-block bg-[#FFC800] text-[#78510D] text-xs font-bold px-3 py-1 rounded-full mr-2 mt-2 animate-bounce border-2 border-[#E6AC00]"
                      style={{ animationDelay: "0.3s" }}
                    >
                      Sing! ✨
                    </span>
                    <span
                      className="inline-block bg-[#FFC800] text-[#78510D] text-xs font-bold px-3 py-1 rounded-full mr-2 mt-2 animate-bounce border-2 border-[#E6AC00]"
                      style={{ animationDelay: "0.5s" }}
                    >
                      Move! ✨
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
