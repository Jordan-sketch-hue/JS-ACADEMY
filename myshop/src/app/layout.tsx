import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MYSHOP — Everything. Delivered.',
  description: 'One destination, everything you need.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
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
