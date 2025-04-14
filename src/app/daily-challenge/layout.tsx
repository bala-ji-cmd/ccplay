import { Metadata } from 'next'
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: 'Daily Challenge - Cocomelon Play',
  description: 'Complete fun daily challenges with JJ and earn special rewards!',
  openGraph: {
    title: 'Daily Challenge - Cocomelon Play',
    description: 'Complete fun daily challenges with JJ and earn special rewards!',
  },
}

export default function DailyChallengeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-1 min-h-[calc(100vh-160px)]">{children}</main>
      <Footer />
    </>
  )
} 