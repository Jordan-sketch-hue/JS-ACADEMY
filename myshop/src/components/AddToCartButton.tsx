'use client'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types/shop'

export default function AddToCartButton({ product: p }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <button
      onClick={() => addItem({ product_id: p.id, name: p.name, price_jmd: p.price_jmd, image_url: p.image_url })}
      className="px-8 py-3 font-bold tracking-wider text-sm rounded transition-opacity hover:opacity-90"
      style={{ background: 'var(--navy)', color: '#fff' }}
    >
      Add to Cart
    </button>
  )
}
