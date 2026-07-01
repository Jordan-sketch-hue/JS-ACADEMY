import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JST Academy',
  description: 'Daily learning in tech, marketing & trading — J Supreme Tech',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
