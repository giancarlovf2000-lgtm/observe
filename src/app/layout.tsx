import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'OBSERVE — Global Intelligence Platform',
    template: '%s | OBSERVE',
  },
  description:
    'Advanced global situational awareness platform. Monitor conflicts, weather events, shipping, flights, markets, and breaking news in real time on an interactive world map.',
  keywords: [
    'global intelligence', 'world map', 'situational awareness',
    'geopolitical monitoring', 'conflict tracking', 'weather monitoring',
  ],
  openGraph: {
    type: 'website',
    title: 'OBSERVE — Global Intelligence Platform',
    description: 'Monitor the world in real time. Intelligence-grade situational awareness for every domain.',
    siteName: 'OBSERVE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OBSERVE — Global Intelligence Platform',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
