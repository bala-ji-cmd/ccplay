import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Community | Cocomelon Play",
  description: "Join the Cocomelon Play community to share artwork, tips, and connect with other creative families.",
}

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Community
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Share, learn, and grow with other Cocomelon Play families
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              We extend an invitation to parents and young artistic enthusiasts to engage with the Cocomelon Play Community. This interactive forum provides a platform for sharing children's artistic creations, exchanging valuable tips and innovative ideas, and participating in constructive discussions pertaining to the application.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              It serves as a supportive and convivial environment wherein the creative endeavors inspired by the world of JJ and his esteemed companions can be celebrated and appreciated.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Community Features
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Share artwork gallery</li>
              <li>• Creative tips & tricks</li>
              <li>• Parent discussions</li>
              <li>• Monthly challenges</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Join the Fun
            </h2>
            <p className="text-[#5D5D5D]">
              Create an account to start sharing your child's creations and connecting with other families in our safe, moderated community.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 