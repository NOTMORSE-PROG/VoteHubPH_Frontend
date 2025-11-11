import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import { Providers } from "./providers"
import { ScrollToTop } from "@/components/scroll-to-top"

export const metadata: Metadata = {
  title: "VoteHubPH - Empowering Filipino Voters",
  description: "A secure digital election awareness and engagement platform for the Filipino community",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          <ThemeProvider>
            <LanguageProvider>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              <ScrollToTop />
              <Analytics />
            </LanguageProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
