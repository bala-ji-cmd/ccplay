import { Metadata } from "next"

export const metadata: Metadata = {
  title: "COPPA Compliance | Cocomelon Play",
  description: "Learn about Cocomelon Play's commitment to protecting children's privacy under COPPA regulations.",
}

export default function CoppaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            COPPA Compliance
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Our commitment to protecting children's privacy
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              Cocomelon Play maintains an unwavering commitment to full compliance with the Children's Online Privacy Protection Act (COPPA). This dedicated section outlines the specific operational practices and procedural safeguards implemented by our organization to ensure the rigorous protection of the privacy and online safety of children while they engage in creative activities utilizing our application.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              COPPA Requirements
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Parental consent</li>
              <li>• Data collection limits</li>
              <li>• Parental access rights</li>
              <li>• Data security measures</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Our Implementation
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Verified parental consent</li>
              <li>• Limited data collection</li>
              <li>• Secure data handling</li>
              <li>• Regular compliance audits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 