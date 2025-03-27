import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Cocomelon Play",
  description: "Read the latest updates, creative tips, and educational content from the Cocomelon Play team.",
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Cocomelon Play Blog
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Creative tips, updates, and inspiration for young artists
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              The Cocomelon Play official blog serves as a repository of insightful content, encompassing creative methodologies, comprehensive application updates, elucidations of developmental processes, and engaging activity suggestions tailored for our young artistic community.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              Within this resource, readers will discover inspiration for optimizing their utilization of the application, detailed announcements regarding newly implemented features, and opportunities to further immerse themselves in the imaginative landscape of Cocomelon through interactive play and AI-driven creative endeavors.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Latest Posts
            </h2>
            <p className="text-[#5D5D5D]">
              Coming soon! Check back for exciting blog posts about creativity, learning, and fun with Cocomelon Play.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Subscribe
            </h2>
            <p className="text-[#5D5D5D]">
              Stay updated with our latest posts and creative tips by subscribing to our newsletter.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 