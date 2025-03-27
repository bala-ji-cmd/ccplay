import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Safety Tips | Cocomelon Play",
  description: "Learn about Cocomelon Play's commitment to child safety and best practices for a secure online experience.",
}

export default function SafetyTipsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
          >
            Safety Tips
          </h1>
          <p className="text-xl text-[#5D5D5D]">
            Ensuring a safe and secure experience for your child
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-[#5D5D5D] leading-relaxed">
              At Cocomelon Play, the security and well-being of our young users constitute a matter of paramount importance. We urge users to carefully review our essential Safety Tips, which provide comprehensive guidance on establishing a secure and positive interactive experience within the application.
            </p>
            <p className="text-[#5D5D5D] leading-relaxed">
              This section delineates recommended practices for parental engagement and underscores the robust safety mechanisms integrated into our platform to ensure the protection of our juvenile user base.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Parental Controls
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Set up account restrictions</li>
              <li>• Monitor activity history</li>
              <li>• Control AI credit usage</li>
              <li>• Manage sharing settings</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 
              className="text-2xl font-bold mb-4 text-[#4A66E0]"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              Safe Practices
            </h2>
            <ul className="space-y-3 text-[#5D5D5D]">
              <li>• Regular account monitoring</li>
              <li>• Safe browsing habits</li>
              <li>• Content sharing guidelines</li>
              <li>• Privacy protection tips</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 