import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Press | Cocomelon Play",
  description: "Access press resources, media kits, and contact information for Cocomelon Play media inquiries.",
}

export default function PressPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Press Resources
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Media information and resources for Cocomelon Play
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              This section serves as the official repository for Cocomelon Play press resources. Herein, members of the media will find pertinent information pertaining to our application, including official press releases, comprehensive media kits, and designated contact information for all media-related inquiries.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              We express our enthusiasm in disseminating our organizational mission, which centers upon the empowerment of young creators through the universally recognized world of Cocomelon and the transformative potential of artificial intelligence. We cordially invite members of the press to contact us for further detailed information.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Media Kit
            </h2>
            <p className="text-[#5D5D5D]">
              Download our comprehensive media kit including logos, screenshots, and brand guidelines.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Press Contact
            </h2>
            <p className="text-[#5D5D5D]">
              For media inquiries, please contact our press team at press@cocomelonplay.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 