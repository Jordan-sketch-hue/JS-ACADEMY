'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/lib/types'

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)

  async function handle() {
    if (adding) return
    setAdding(true)
    await addToCart(product)
    setAdding(false)
  }

  return (
    <button
      onClick={handle}
      disabled={adding}
      className="w-full bg-[#0a0f1e] hover:bg-[#c8a84b] disabled:opacity-60 text-white font-black py-4 rounded-2xl text-lg transition-all hover:shadow-lg hover:scale-[1.02]"
    >
      {adding ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}