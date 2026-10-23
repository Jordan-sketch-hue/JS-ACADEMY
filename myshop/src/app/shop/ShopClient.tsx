'use client'
import { useState } from 'react'
import type { Product, Category } from '@/types/shop'
import ProductCard from '@/components/ProductCard'
import Link from 'next/link'

const catEmoji: Record<string, string> = {
  jewelry:       '✦',
  electronics:   '◈',
  'home-living': '◉',
  beauty:        '◆',
  lifestyle:     '◐',
}

export default function ShopClient({
  categories,
  products,
}: {
  categories: Category[]
  products: Product[]
}) {
  const [activeSlug, setActiveSlug] = useState<string>('all')

  const filtered = activeSlug === 'all'
    ? products
    : products.filter(p => p.category === activeSlug)

  const activeCategory = categories.find(c => c.slug === activeSlug)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* ─── PAGE HEADER ────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 100%)',
          padding: '4rem max(1.5rem, env(safe-area-inset-left, 0px)) 3rem',
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(201,168,76,0.07) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="relative max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 mb-6" style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.45)' }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Shop</span>
            {activeCategory && (
              <>
                <span>›</span>
                <span style={{ color: 'var(--gold)' }}>{activeCategory.name}</span>
              </>
            )}
          </nav>
          <h1
            className="display-font font-black"
            style={{ color: '#fff', fontSize: 'var(--text-3xl)', letterSpacing: '-0.03em' }}
          >
            {activeCategory ? activeCategory.name : 'All Products'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {activeCategory?.description ? ` · ${activeCategory.description}` : ''}
          </p>
        </div>
      </div>

      {/* ─── CATEGORY TABS ──────────────────────────── */}
      <div
        className="sticky z-40"
        style={{
          top: 64, /* nav height */
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(26,39,68,0.05)',
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto"
          style={{
            padding: '0.75rem max(1.5rem, env(safe-area-inset-left, 0px))',
            scrollbarWidth: 'none',
          }}
        >
          {/* All tab */}
          <button
            onClick={() => setActiveSlug('all')}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all"
            style={{
              background: activeSlug === 'all' ? 'var(--navy)' : 'var(--surface-2)',
              color: activeSlug === 'all' ? '#fff' : 'var(--fg-2)',
              fontSize: 'var(--text-sm)',
              border: activeSlug === 'all' ? 'none' : '1px solid var(--border)',
            }}
          >
            All
            <span
              className="px-1.5 rounded-full"
              style={{
                background: activeSlug === 'all' ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                color: activeSlug === 'all' ? '#fff' : 'var(--muted)',
                fontSize: 'var(--text-xs)',
              }}
            >
              {products.length}
            </span>
          </button>

          {categories.map(cat => {
            const count = products.filter(p => p.category === cat.slug).length
            const active = activeSlug === cat.slug
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveSlug(cat.slug)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all"
                style={{
                  background: active ? cat.accent_color : 'var(--surface-2)',
                  color: active ? '#fff' : 'var(--fg-2)',
                  fontSize: 'var(--text-sm)',
                  border: active ? 'none' : '1px solid var(--border)',
                }}
              >
                <span>{catEmoji[cat.slug] ?? '◈'}</span>
                {cat.name}
                <span
                  className="px-1.5 rounded-full"
                  style={{
                    background: active ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                    color: active ? '#fff' : 'var(--muted)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ─── PRODUCTS GRID ──────────────────────────── */}
      <div
        className="max-w-7xl mx-auto"
        style={{ padding: '3rem max(1.5rem, env(safe-area-inset-left, 0px))' }}
      >
        {filtered.length > 0 ? (
          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))' }}
          >
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div
              className="text-5xl mb-4"
              style={{ opacity: 0.3 }}
            >
              {catEmoji[activeSlug] ?? '◈'}
            </div>
            <p
              className="display-font font-bold"
              style={{ color: 'var(--fg)', fontSize: 'var(--text-xl)' }}
            >
              No products yet
            </p>
            <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              Check back soon — new items dropping weekly.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
