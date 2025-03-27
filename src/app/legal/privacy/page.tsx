import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Cocomelon Play",
  description: "Learn about how Cocomelon Play protects and manages your child's personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Privacy Policy
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Protecting your child's privacy is our top priority
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              The safeguarding of the personal information of our young users remains a fundamental principle at Cocomelon Play. Our comprehensive Privacy Policy meticulously details the protocols governing the collection, utilization, and rigorous protection of the personal data of our juvenile user demographic, adhering scrupulously to all pertinent child privacy regulations, including the Children's Online Privacy Protection Act (COPPA).
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              We are steadfastly committed to maintaining transparency and ensuring a consistently secure digital environment for our users.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Data Protection
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Secure data storage</li>
              <li>• Limited data collection</li>
              <li>• Parental controls</li>
              <li>• Data retention policies</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Your Rights
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Access your data</li>
              <li>• Request deletion</li>
              <li>• Opt-out options</li>
              <li>• Contact privacy team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 