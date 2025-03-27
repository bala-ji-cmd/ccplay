
import { Header } from "@/components/landing/Header"
import { HeroSection } from "@/components/landing/HeroSection"
import { BouncingWatermelonDivider } from "@/components/landing/BouncingWatermelonDivider"
import { PainPointSolution } from "@/components/landing/PainPointSolution"
import { FeaturedDrawings } from "@/components/landing/FeaturedDrawings"
import { Testimonial } from "@/components/landing/Testimonial"
import { Pricing } from "@/components/landing/Pricing"
import { Faq } from "@/components/landing/Faq"
import { Footer } from "@/components/landing/Footer"
export default function Home() {
  return (
    <div className="min-h-screen bg-[#FDFCF5] overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Bouncing Watermelon Divider */}
      <BouncingWatermelonDivider/>

      {/* Pain Points vs Solutions */}
      <PainPointSolution/>

      {/* Featured Drawings */}
      <FeaturedDrawings/>

      {/* Testimonials Section */}
      <Testimonial/>

      {/* Pricing & FAQ */}
      <Pricing/>

      {/* FAQ Section */}
      <Faq/>

      {/* Footer */}
      <Footer/>
    </div>
  )
}

