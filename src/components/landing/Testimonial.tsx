import { Button } from "@/components/ui/button"
export function Testimonial() {
  return (
    <section id="testimonials" className="py-16 px-4 bg-[#FFF4E5]">
      <div className="container mx-auto">
        <h2
          className="text-3xl md:text-5xl font-extrabold text-center mb-6"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          <span className="bg-[#58CC02] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2 border-4 border-[#46A302]">
            Happy Parents,
          </span>
          <span className="text-[#FF4B4B] px-2">Happy</span>
          <span className="bg-[#FFC800] text-[#78510D] px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2 border-4 border-[#E5B800]">
            Kids!
          </span>
        </h2>

        <p
          className="text-xl text-center text-[#4B4B4B] mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          See what families are saying about their Cocomelon Play experience! ✨
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#E5FFC2] rounded-[2rem] transform rotate-1 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-[2rem] p-6 shadow-lg relative border-4 border-[#58CC02] overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#58CC02] rounded-full opacity-10"></div>
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#1CB0F6] rounded-full opacity-10"></div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#58CC02] rounded-full flex items-center justify-center border-4 border-[#E5FFC2] overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-[#FF4B4B] rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-heart"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-[#58CC02]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Priya Sharma
                  </h3>
                  <p className="text-[#4B4B4B] text-sm" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                    Mom of Aarav, 4
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FFC800"
                    stroke="#FFC800"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-star"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <p className="text-[#4B4B4B] mb-4" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                "My son was always trying to draw his favorite Cocomelon characters but would get frustrated. With Cocomelon
                Play, he can now <span className="text-[#FF4B4B] font-bold">create beautiful artwork</span> all by
                himself! The AI guidance is so simple that even my 4-year-old can use it without any help."
              </p>

              <div className="flex items-center gap-2 bg-[#E5FFC2] p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#58CC02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-sparkles"
                >
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  <path d="M5 3v4" />
                  <path d="M19 17v4" />
                  <path d="M3 5h4" />
                  <path d="M17 19h4" />
                </svg>
                <span
                  className="text-sm font-medium text-[#58CC02]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Favorite feature: AI Drawing Assistant
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#E2F4FF] rounded-[2rem] transform -rotate-1 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-[2rem] p-6 shadow-lg relative border-4 border-[#1CB0F6] overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#1CB0F6] rounded-full opacity-10"></div>
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#FF4B4B] rounded-full opacity-10"></div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#1CB0F6] rounded-full flex items-center justify-center border-4 border-[#E2F4FF] overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-[#FFC800] rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#78510D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-thumbs-up"
                    >
                      <path d="M7 10v12" />
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-[#1CB0F6]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Rajesh Patel
                  </h3>
                  <p className="text-[#4B4B4B] text-sm" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                    Dad of Vihaan, 5
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FFC800"
                    stroke="#FFC800"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-star"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <p className="text-[#4B4B4B] mb-4" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                "The story generation feature is amazing! My son spends hours creating and then{" "}
                <span className="text-[#1CB0F6] font-bold">listening to personalized bedtime stories</span>. It's both educational
                and entertaining - perfect for keeping him engaged during summer vacations. The moral values in each story make it worth every rupee!"
              </p>

              <div className="flex items-center gap-2 bg-[#E2F4FF] p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1CB0F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span
                  className="text-sm font-medium text-[#1CB0F6]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Favorite feature: Story with AI
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-[#FFF9E5] rounded-[2rem] transform rotate-1 group-hover:rotate-0 transition-transform"></div>

            <div className="bg-white rounded-[2rem] p-6 shadow-lg relative border-4 border-[#FFC800] overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#FFC800] rounded-full opacity-10"></div>
              <div className="absolute -top-8 -left-8 w-16 h-16 bg-[#FF4B4B] rounded-full opacity-10"></div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-[#FFC800] rounded-full flex items-center justify-center border-4 border-[#FFF9E5] overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#78510D"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-user"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 bg-[#8549BA] rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-star"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-bold text-[#78510D]"
                    style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                  >
                    Ananya Reddy
                  </h3>
                  <p className="text-[#4B4B4B] text-sm" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                    Mom of Diya, 3
                  </p>
                </div>
              </div>

              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="#FFC800"
                    stroke="#FFC800"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-star"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <p className="text-[#4B4B4B] mb-4" style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}>
                "My 3-year-old was too young to draw properly, but with Cocomelon Play's{" "}
                <span className="text-[#FFC800] font-bold">step-by-step guides</span> and{" "}
                <span className="text-[#8549BA] font-bold">voice commands</span>, she's creating beautiful Cocomelon
                art! The daily challenges keep her engaged and away from too much screen time. Perfect for our Indian family!"
              </p>

              <div className="flex items-center gap-2 bg-[#FFF9E5] p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#78510D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <span
                  className="text-sm font-medium text-[#78510D]"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  Favorite feature: Step-by-Step Guides
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button
            className="bg-[#58CC02] hover:bg-[#46A302] text-white rounded-full px-8 py-6 text-xl font-bold shadow-lg transition-transform hover:scale-105 border-b-4 border-[#46A302] flex items-center justify-center gap-2"
            style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
          >
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
              className="lucide lucide-message-square-quote"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16l4-4h12.5a2 2 0 0 0 2-2V8" />
              <path d="M14.5 2v6h6" />
              <path d="M10 10H6v4h4v-4Z" />
              <path d="M18 10h-4v4h4v-4Z" />
            </svg>
            Read More Reviews
          </Button>
        </div>
      </div>
    </section>
  )
}
