import { Metadata } from 'next'
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: 'Daily Challenge - Cocomelon Play',
}

export default function DailyChallengeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-1">{children}</main>
      <Footer />
    </>
  )
} 