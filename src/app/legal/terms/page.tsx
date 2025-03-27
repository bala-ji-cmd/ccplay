import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Cocomelon Play",
  description: "Read the terms and conditions for using Cocomelon Play's creative platform.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Terms of Service
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Please read these terms carefully before using Cocomelon Play
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              Please peruse these Terms of Service with thorough attention, as they delineate the contractual framework governing your utilization of the Cocomelon Play application. By accessing and subsequently using our application, you formally agree to adhere to these stipulated terms, which articulate the respective rights and responsibilities incumbent upon each user of the platform.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Key Points
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Account responsibilities</li>
              <li>• Content guidelines</li>
              <li>• Usage restrictions</li>
              <li>• Intellectual property</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Updates
            </h2>
            <p className="text-[#5D5D5D]">
              We may update these terms from time to time. Users will be notified of any significant changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 