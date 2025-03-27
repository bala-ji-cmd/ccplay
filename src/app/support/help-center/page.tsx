import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Help Center | Cocomelon Play",
  description: "Get assistance with Cocomelon Play features, account management, and technical support.",
}

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Help Center
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Find answers to your questions about Cocomelon Play
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              For users seeking assistance or clarification regarding the functionalities of Cocomelon Play, our meticulously curated Help Center represents the primary point of reference. This comprehensive resource addresses frequently encountered inquiries pertaining to account administration, the utilization of AI credits, navigation within the application's interface, and the resolution of common technical challenges.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              Users are encouraged to consult our detailed articles to efficiently locate the requisite information.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Popular Topics
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Getting Started Guide</li>
              <li>• AI Credits & Usage</li>
              <li>• Account Management</li>
              <li>• Technical Support</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Need More Help?
            </h2>
            <p className="text-[#5D5D5D]">
              Can't find what you're looking for? Our support team is here to help. Contact us for personalized assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 