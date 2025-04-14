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
      
      <main >
        <div className="overflow-hidden">
          <HeroSection />
          <BouncingWatermelonDivider/>
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading solutions...</div>}>
            <PainPointSolution/>
          </Suspense>
          <BouncingWatermelonDivider/>
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading gallery...</div>}>
            <FeaturedDrawings/>
          </Suspense>
          <BouncingWatermelonDivider/>
          <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center">Loading testimonials...</div>}>
            <Testimonial/>
          </Suspense>
          <BouncingWatermelonDivider/>
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center">Loading pricing...</div>}>
            <Pricing/>
          </Suspense>
          <BouncingWatermelonDivider/>
          <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center">Loading FAQ...</div>}>
            <Faq/>
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}

