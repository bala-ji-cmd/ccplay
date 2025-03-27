import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#FDFCF5]">
      <Header />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
    </div>
  )
} 