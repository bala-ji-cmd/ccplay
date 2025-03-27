import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | Cocomelon Play",
  description: "Get in touch with the Cocomelon Play support team for assistance and inquiries.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Contact Us
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            We're here to help with any questions or concerns
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              Should users encounter difficulties in locating specific information within our Help Center, we encourage them to contact our dedicated customer support personnel without hesitation. This section provides various modalities through which users may initiate communication with our support team, who are committed to providing timely and comprehensive assistance with any inquiries or concerns that may arise.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Support Hours
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Monday - Friday: 9am - 6pm EST</li>
              <li>• Saturday: 10am - 4pm EST</li>
              <li>• Sunday: Closed</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Contact Methods
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Email: support@cocomelonplay.com</li>
              <li>• Live Chat: Available during support hours</li>
              <li>• Help Center: 24/7 access to resources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 