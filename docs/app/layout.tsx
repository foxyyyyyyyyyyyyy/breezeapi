import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BreezeAPI - TypeScript API Framework for Bun",
  description:
    "Build APIs faster",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <script defer src="https://analytics.esportsapp.gg/script.js" data-website-id="610ea969-63c1-40f3-9157-450d2c1a91e0"></script>
      </head>
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
