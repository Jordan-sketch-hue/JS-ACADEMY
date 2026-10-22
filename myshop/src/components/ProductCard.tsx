'use client'
import Link from 'next/link'
import type { Product } from '@/types/shop'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product: p }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <div className="rounded-xl overflow-hidden border transition-shadow hover:shadow-md" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
      <Link href={`/shop/${p.slug}`}>
        {p.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image_url} alt={p.name} className="w-full aspect-square object-cover" />
        ) : (
          <div className="w-full aspect-square" style={{ background: 'var(--surface)' }} />
        )}
      </Link>
      <div className="p-3">
        <Link href={`/shop/${p.slug}`}>
          <p className="font-semibold text-sm leading-tight mb-1 hover:underline" style={{ color: 'var(--navy)' }}>
            {p.name}
          </p>
        </Link>
        <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
          J${p.price_jmd.toLocaleString()}
        </p>
        <button
          onClick={() => addItem({ product_id: p.id, name: p.name, price_jmd: p.price_jmd, image_url: p.image_url })}
          className="w-full py-2 text-xs font-bold tracking-wider rounded transition-opacity hover:opacity-90"
          style={{ background: 'var(--navy)', color: '#fff' }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
