import { Metadata } from 'next'
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: 'Draw with AI - Cocomelon Play',
}

export default function DrawLayout({
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