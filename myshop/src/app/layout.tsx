import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['400','500','600','700','800'] })

export const metadata: Metadata = {
  title: 'MYSHOP — Everything. Delivered.',
  description: 'One destination, everything you need.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <CartProvider>
          <Nav />
          <main className="flex-1">{children}</main>
        </CartProvider>
        <footer className="py-6 text-center text-sm" style={{ color: '#666' }}>
          © {new Date().getFullYear()} MYSHOP. Everything. Delivered.
        </footer>
      </body>
    </html>
  )
}
