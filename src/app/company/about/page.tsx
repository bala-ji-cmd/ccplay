import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Us | Cocomelon Play",
  description: "Learn about Cocomelon Play's mission to cultivate creativity and imagination in young Cocomelon fans through AI-powered art creation.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            About Cocomelon Play
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Empowering young artists through AI-powered creativity
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              Cocomelon Play represents a dedicated endeavor to cultivate creativity and imaginative faculties within young adherents of the esteemed Cocomelon intellectual property. We operate under the conviction that the principles of interactive engagement, coupled with the innovative capabilities of artificial intelligence, can render artistic pursuits more accessible and engaging for individuals of all developmental stages.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              Our fundamental mission is to furnish a secure and stimulating digital milieu wherein children can explore their incipient artistic talents, engage in learning alongside the familiar personae of the Cocomelon universe, and actualize their imaginative concepts. We remain committed to the development of high-caliber, age-appropriate experiences that engender a sense of joy and foster the essential skill of self-expression.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              Further elucidation regarding our organizational ethos and the dedicated team responsible for the creation of Cocomelon Play is available herein.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Our Mission
            </h2>
            <p className="text-[#5D5D5D]">
              To create a safe, engaging, and educational platform where children can express their creativity through AI-powered art creation.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Our Vision
            </h2>
            <p className="text-[#5D5D5D]">
              To become the leading platform for creative expression and learning in the children's digital space.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 