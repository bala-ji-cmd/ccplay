import type { Metadata } from "next"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "Cocomelon Play - Draw, Learn & Animate with Cocomelon!",
  description: "Join JJ and friends in a world of creativity! Draw, learn, and animate with Cocomelon's fun educational platform for kids.",
  openGraph: {
    title: "Cocomelon Play - Draw, Learn & Animate with Cocomelon!",
    description: "Join JJ and friends in a world of creativity! Draw, learn, and animate with Cocomelon's fun educational platform for kids.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Cocomelon Play - Draw, Learn & Animate with Cocomelon!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cocomelon Play - Draw, Learn & Animate with Cocomelon!",
    description: "Join JJ and friends in a world of creativity! Draw, learn, and animate with Cocomelon's fun educational platform for kids.",
    images: ["/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <div className="min-h-screen bg-[#FDFCF5]">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

