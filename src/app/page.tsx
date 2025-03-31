import { Suspense } from 'react'
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { HeroSection } from "@/components/landing/HeroSection"
import { BouncingWatermelonDivider } from "@/components/landing/BouncingWatermelonDivider"
import { PainPointSolution } from "@/components/landing/PainPointSolution"
import { FeaturedDrawings } from "@/components/landing/FeaturedDrawings"
import { Testimonial } from "@/components/landing/Testimonial"
import { Pricing } from "@/components/landing/Pricing"
import { Faq } from "@/components/landing/Faq"

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-1">
        <div className="overflow-hidden">
          <Suspense fallback={<div>Loading...</div>}>
            <HeroSection />
          </Suspense>
          <BouncingWatermelonDivider/>
          <PainPointSolution/>
          <FeaturedDrawings/>
          <Testimonial/>
          <Pricing/>
          <Faq/>
        </div>
      </main>
      <Footer />
    </>
  )
}

