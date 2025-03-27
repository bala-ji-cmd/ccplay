import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Careers | Cocomelon Play",
  description: "Join our team at Cocomelon Play and help shape the future of creative play experiences for children.",
}

export default function CareersPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Careers at Cocomelon Play
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Join us in creating magical experiences for children
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              While our present focus remains concentrated on the successful initial deployment and subsequent growth trajectory of the Cocomelon Play application, we maintain a vigilant posture with regard to the identification of exceptionally talented professionals who resonate with our profound commitment to the domains of education, technological innovation, and the realm of children's entertainment.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              Interested parties are encouraged to periodically consult this section for prospective career opportunities to integrate with our dynamic team and contribute to the ongoing evolution of creative play experiences.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Why Join Us?
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Work on innovative AI technology</li>
              <li>• Make a difference in children's education</li>
              <li>• Join a passionate, creative team</li>
              <li>• Competitive benefits package</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Open Positions
            </h2>
            <p className="text-[#5D5D5D]">
              We're currently focused on our initial launch. Check back soon for exciting career opportunities!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 