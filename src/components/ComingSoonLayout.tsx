'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { memo } from "react"

interface ComingSoonProps {
  title: string
  subtitle: string
  description: string
  features: string[]
  icon: React.ReactNode
}

const FeatureItem = memo(({ feature }: { feature: string }) => (
  <li className="flex items-center gap-3 text-[#5D5D5D] bg-blue-50 p-4 rounded-xl">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#FF4D79"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
    {feature}
  </li>
))

FeatureItem.displayName = 'FeatureItem'

export const ComingSoonLayout = memo(function ComingSoonLayout({ 
  title, 
  subtitle, 
  description, 
  features, 
  icon 
}: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-[#FFD747]">
                {icon}
              </div>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "'Comic Sans MS', 'Bubblegum Sans', cursive" }}
            >
              <span className="bg-[#FF4D79] text-white px-4 py-2 rounded-xl inline-block transform -rotate-2">
                {title}
              </span>
            </h1>
            <span className="text-2xl text-[#4A66E0] block mt-4 mb-2">{subtitle}</span>
            <p className="text-xl text-[#5D5D5D]">{description}</p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-4 border-[#FFD747]">
            <h2 className="text-2xl font-bold text-[#4A66E0] mb-6 text-center">
              Coming Features
            </h2>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}
            </ul>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Link href="/" prefetch={true}>
              <Button className="bg-[#4A66E0] hover:bg-[#3A56D0] text-white rounded-full px-6 py-2 font-bold">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
})

ComingSoonLayout.displayName = 'ComingSoonLayout' 