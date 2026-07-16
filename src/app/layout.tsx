import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JST Academy',
  description: 'Daily learning in tech, marketing & trading — J Supreme Tech',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JST Academy',
  },
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
