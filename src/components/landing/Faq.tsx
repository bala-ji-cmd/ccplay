"use client"

import { useState } from "react"

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqItems = [
    {
      question: "What is Cocomelon Play?",
      answer: "Cocomelon Play is a creative space for kids to play with AI, inspired by the wonderful world of Cocomelon! From creating drawings of JJ and his friends to bringing your Cocomelon scenes to life with animation, the possibilities are endless. It's all about making drawing fun and imaginative for young Cocomelon fans.",
      icon: "help-circle"
    },
    {
      question: "What are AI Credits in Cocomelon Play?",
      answer: "Credits are what Cocomelon Play uses to help you create amazing drawings and animations with JJ, Cody, and Astor. It takes credits when you ask them to add things to your drawings, change colors, or make your characters move. Think of them as magic sparks that power the fun! ✨",
      icon: "coins"
    },
    {
      question: "How do Cocomelon Play credits refill?",
      answer: "At the beginning of your billing cycle (usually once a month), your Cocomelon Play account will automatically get a fresh set of credits, ready for more creative adventures!",
      icon: "refresh-cw"
    },
    {
      question: "When will I get charged for Cocomelon Play?",
      answer: "If you sign up for a monthly plan, you'll be charged every month on the date you started your subscription. If you choose an annual plan, you'll be charged every year on that same date.",
      icon: "calendar"
    },
    {
      question: "What if I run out of credits before the month ends in Cocomelon Play?",
      answer: "If you use up all your credits before your next refill date, you might need to wait until your credits are renewed at the start of your next billing cycle. Depending on your subscription, there might also be options to purchase more credits if you want to keep creating without waiting.",
      icon: "alert-circle"
    },
    {
      question: "What if I want to cancel my Cocomelon Play subscription?",
      answer: "We'd be sad to see you go! But we want to make it easy. You can usually manage your subscription and find the cancellation options within your account settings in the Cocomelon Play platform. If you have trouble, you can also reach out to our support team for help.",
      icon: "x-circle"
    },
    {
      question: "What is your refund policy for Cocomelon Play?",
      answer: "Generally, subscription purchases are non-refundable. However, if you have any specific issues or concerns, please contact our customer support team, and they will be happy to assist you.",
      icon: "undo"
    },
    {
      question: "Is Cocomelon Play safe for my child?",
      answer: "Yes, child safety is our top priority! Cocomelon Play adheres to strict child privacy regulations (COPPA). There are no direct communication features. Sharing will require parental consent or device-level options. We are committed to a safe and fun creative environment. ✨",
      icon: "shield-check"
    }
  ]

  return (
    <section className="w-full bg-[#FFF4E5] py-16 mt-20">
      <div className="container mx-auto px-4">
        <h2
          className="text-3xl md:text-5xl font-extrabold text-center mb-8"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          <span className="bg-[#FFD900] text-[#58CC02] px-4 py-2 rounded-xl inline-block transform -rotate-2 border-4 border-[#58CC02] shadow-md">
            Got Questions?
          </span>
          <span className="text-[#FF4D79] px-2">We've Got</span>
          <span className="bg-[#58CC02] text-white px-4 py-2 rounded-xl inline-block transform rotate-2 ml-2 border-b-4 border-[#46A302] shadow-md">
            Answers!
          </span>
        </h2>

        <p
          className="text-xl text-center text-[#4B4B4B] mb-12 max-w-3xl mx-auto"
          style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
        >
          Here are some frequently asked questions about our AI-powered Cocomelon Play platform! ✨
        </p>

        {/* FAQ Items */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-md p-6 border-4 border-[#FFD900] hover:bg-[#FFF9E5] transition-colors cursor-pointer"
              onClick={() => toggleFaq(index)}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="text-xl font-bold text-[#58CC02] flex items-center gap-3"
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  <div className="bg-[#E5FFC2] p-2 rounded-full border-2 border-[#58CC02]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#58CC02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`lucide lucide-${item.icon}`}
                    >
                      {item.icon === "help-circle" && (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </>
                      )}
                      {item.icon === "coins" && (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83m13.79-4-5.74 9.94" />
                        </>
                      )}
                      {item.icon === "refresh-cw" && (
                        <>
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </>
                      )}
                      {item.icon === "calendar" && (
                        <>
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </>
                      )}
                      {item.icon === "alert-circle" && (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="12" />
                          <line x1="12" x2="12.01" y1="16" y2="16" />
                        </>
                      )}
                      {item.icon === "x-circle" && (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <path d="m15 9-6 6" />
                          <path d="m9 9 6 6" />
                        </>
                      )}
                      {item.icon === "undo" && (
                        <>
                          <path d="M3 7v6h6" />
                          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                        </>
                      )}
                      {item.icon === "shield-check" && (
                        <>
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </>
                      )}
                    </svg>
                  </div>
                  {item.question}
                </h3>
                <div className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#58CC02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 mt-3' : 'max-h-0'
                }`}
              >
                <p 
                  className="text-[#4B4B4B] ml-11" 
                  style={{ fontFamily: "Comic Sans MS, cursive, sans-serif" }}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
