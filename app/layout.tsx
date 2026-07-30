import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://iipecphc.org'),
  title: 'IIPEC Potters House Command - Equipping Chaplains to Serve with Excellence',
  description: 'Be part of a growing movement equipping chaplains to serve with excellence and compassion. Join Pottershouse Command today.',
  keywords: 'chaplaincy, IIPEC, chaplain training, pastoral care, spiritual guidance, chaplain, potters house command',
  openGraph: {
    title: 'IIPEC Potters House Command',
    description: 'Equipping chaplains to serve with excellence and compassion.',
    url: 'https://iipecphc.org',
    siteName: 'IIPEC Potters House Command',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
