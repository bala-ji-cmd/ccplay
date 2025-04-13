import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata = {
  title: 'Story with AI - Cocomelon Play',
  description: 'Create personalized bedtime stories with AI!',
}

export default function StoryLayout({
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