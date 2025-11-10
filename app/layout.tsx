import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fenomen - Yapay Zeka Destekli İçerik Üretim Platformu",
  description: "Fenomen ile sosyal medya içeriklerinizi kolayca oluşturun ve yönetin",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="dark font-sans">{children}</body>
    </html>
  )
}
