'use client'
import Link from 'next/link'
import type { Product } from '@/types/shop'
import { useCart } from '@/context/CartContext'

const catColors: Record<string, string> = {
  jewelry:     '#C9A84C',
  electronics: '#3B82F6',
  'home-living': '#10B981',
  beauty:      '#EC4899',
  lifestyle:   '#8B5CF6',
}

export default function ProductCard({ product: p }: { product: Product }) {
  const { addItem } = useCart()
  const accent = catColors[p.category ?? ''] ?? 'var(--gold)'

  return (
    <div
      className="group relative flex flex-col overflow-hidden transition-all"
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = 'var(--shadow-lg)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'var(--shadow-sm)'
      }}
    >
      {/* Image area */}
      <Link href={`/shop/${p.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image_url}
            alt={p.name}
            className="w-full h-full object-cover transition-transform"
            style={{ transition: 'transform 0.5s var(--ease-out)' }}
            onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.06)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)' }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accent}15 0%, ${accent}30 100%)`,
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${accent}25` }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21,15 16,10 5,21"/>
              </svg>
            </div>
            <span
              className="absolute bottom-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: accent, color: '#fff', fontSize: 'var(--text-xs)' }}
            >
              Image coming soon
            </span>
          </div>
        )}

        {/* Category badge */}
        {p.category && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full capitalize"
            style={{
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}40`,
              backdropFilter: 'blur(8px)',
              fontSize: 'var(--text-xs)',
              letterSpacing: '0.04em',
            }}
          >
            {p.category.replace('-', ' ')}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-col gap-3 p-4" style={{ flex: 1 }}>
        <div style={{ flex: 1 }}>
          <Link href={`/shop/${p.slug}`}>
            <h3
              className="font-bold leading-snug hover:opacity-70 transition-opacity line-clamp-2"
              style={{ color: 'var(--fg)', fontSize: 'var(--text-sm)' }}
            >
              {p.name}
            </h3>
          </Link>
          <p
            className="mt-1.5 font-black"
            style={{ color: 'var(--navy)', fontSize: 'var(--text-lg)' }}
          >
            J${(p.price_jmd / 100).toLocaleString()}
          </p>
        </div>

        <button
          onClick={() => addItem({ product_id: p.id, name: p.name, price_jmd: p.price_jmd, image_url: p.image_url })}
          className="w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all"
          style={{
            background: 'var(--navy)',
            color: '#fff',
            fontSize: 'var(--text-sm)',
            letterSpacing: '0.03em',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = 'var(--navy-mid)' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'var(--navy)' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
