'use client'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'

const categories = [
  { name: 'Jewelry', slug: 'jewelry' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Home & Living', slug: 'home-living' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Lifestyle', slug: 'lifestyle' },
]

export default function Nav() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 glass"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div
        className="max-w-7xl mx-auto flex items-center justify-between h-16"
        style={{ padding: '0 max(1.5rem, env(safe-area-inset-left, 0px)) 0 max(1.5rem, env(safe-area-inset-right, 0px))' }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--navy)' }}
          >
            <svg width="16" height="16" viewBox="0 0 100 100" fill="none">
              <polygon points="4,4 96,4 4,96" fill="#1A2744" />
              <polygon points="96,4 96,96 4,96" fill="#C9A84C" />
              <polygon points="52,0 100,0 100,4 96,4 48,100 4,100 4,96 56,4" fill="white" />
            </svg>
          </div>
          <span
            className="display-font font-black text-base tracking-wider"
            style={{ color: 'var(--navy)', letterSpacing: '0.12em' }}
          >
            MYSHOP
          </span>
        </Link>

        {/* Desktop category links */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              href={`/shop/category/${cat.slug}`}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                color: 'var(--fg-2)',
                fontSize: 'var(--text-sm)',
              }}
              onMouseEnter={e => {
                ;(e.target as HTMLElement).style.background = 'var(--surface-2)'
                ;(e.target as HTMLElement).style.color = 'var(--navy)'
              }}
              onMouseLeave={e => {
                ;(e.target as HTMLElement).style.background = 'transparent'
                ;(e.target as HTMLElement).style.color = 'var(--fg-2)'
              }}
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/shop"
            className="ml-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{ background: 'var(--surface-2)', color: 'var(--navy)' }}
          >
            All Products
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: 'var(--navy)', color: '#fff' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs flex items-center justify-center font-black"
                style={{ background: 'var(--gold)', color: 'var(--navy)' }}
              >
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--surface-2)', color: 'var(--navy)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden glass"
          style={{
            borderTop: '1px solid var(--border)',
            padding: '1rem max(1.5rem, env(safe-area-inset-left, 0px))',
          }}
        >
          <div className="flex flex-col gap-1">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/shop/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl font-medium"
                style={{ color: 'var(--fg)', fontSize: 'var(--text-sm)', background: 'transparent' }}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/shop"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 rounded-xl font-semibold mt-1"
              style={{ background: 'var(--surface-2)', color: 'var(--navy)', fontSize: 'var(--text-sm)' }}
            >
              All Products
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
