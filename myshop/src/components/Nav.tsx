'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function Nav() {
  const { itemCount } = useCart()
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: 'var(--navy)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo mark + wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
            <polygon points="4,4 96,4 4,96" fill="#1A2744" />
            <polygon points="96,4 96,96 4,96" fill="#C9A84C" />
            <polygon points="52,0 100,0 100,4 96,4 48,100 4,100 4,96 56,4" fill="white" />
          </svg>
          <span
            className="font-black tracking-widest text-white text-sm"
            style={{ letterSpacing: '0.14em' }}
          >
            MYSHOP
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/shop" className="text-white/70 hover:text-white text-sm transition-colors">
            Shop
          </Link>
          <Link href="/cart" className="relative text-white/70 hover:text-white text-sm transition-colors">
            Cart
            {itemCount > 0 && (
              <span
                className="absolute -top-2 -right-3 w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold text-[var(--navy)]"
                style={{ background: 'var(--gold)' }}
              >
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
