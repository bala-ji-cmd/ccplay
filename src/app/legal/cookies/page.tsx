import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Cocomelon Play",
  description: "Learn about how Cocomelon Play uses cookies to enhance your experience.",
}

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Cookie Policy
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Understanding how we use cookies to improve your experience
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              This comprehensive Cookie Policy elucidates the manner in which Cocomelon Play employs cookies and analogous tracking technologies to optimize and personalize the user experience within the application. It provides a detailed exposition of the specific categories of cookies utilized, their respective operational purposes, and the options available to users regarding the management of their cookie preferences.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Cookie Types
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Essential cookies</li>
              <li>• Performance cookies</li>
              <li>• Functionality cookies</li>
              <li>• Analytics cookies</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Cookie Management
            </h2>
            <p className="text-[#5D5D5D]">
              Learn how to manage your cookie preferences and understand their impact on your experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 