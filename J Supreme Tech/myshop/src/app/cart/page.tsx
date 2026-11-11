'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

export default function CartPage() {
  const { items, cartTotal, removeFromCart, updateQuantity, loading } = useCart()

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#c8a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-6">🛒</p>
        <h1 className="text-2xl font-black mb-3">Your cart is empty</h1>
        <p className="text-neutral-500 mb-8">Add some items to get started.</p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-[#0a0f1e] text-white font-bold px-6 py-3 rounded-full hover:bg-[#c8a84b] transition-colors">
          Browse Shop
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-8">Your Cart</h1>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <div className="divide-y divide-neutral-100">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              {item.image_url ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-50">
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-neutral-50 flex items-center justify-center text-2xl shrink-0">🛍️</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-neutral-900 line-clamp-2">{item.name}</p>
                <p className="text-[#c8a84b] font-bold text-sm mt-0.5">
                  J${(item.price_jmd / 100).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 font-bold text-lg"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 font-bold text-lg"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 ml-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-neutral-50 flex items-center justify-between">
          <span className="font-bold">Total</span>
          <span className="text-xl font-black">J${(cartTotal / 100).toLocaleString()}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full text-center bg-[#c8a84b] hover:bg-[#d4b455] text-[#0a0f1e] font-black py-4 rounded-2xl text-lg transition-all hover:shadow-lg hover:shadow-[#c8a84b]/30 hover:scale-[1.02]"
      >
        Proceed to Checkout
      </Link>
      <Link href="/shop" className="block text-center text-sm text-neutral-500 hover:text-neutral-700 mt-4">
        Continue Shopping
      </Link>
    </div>
  )
}