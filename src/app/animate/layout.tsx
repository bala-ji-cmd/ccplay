import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata = {
  title: 'Pricing - Cocomelon Play',
  description: 'Choose the perfect plan for your little artist and start creating Cocomelon masterpieces today!',
}

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
} 