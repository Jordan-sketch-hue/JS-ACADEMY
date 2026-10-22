'use client'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'

export default function CartPage() {
  const { cart, totalJmd, removeItem, updateQty } = useCart()

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-lg mb-6" style={{ color: 'var(--muted)' }}>Your cart is empty.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 rounded font-semibold text-sm"
          style={{ background: 'var(--navy)', color: '#fff' }}
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-black tracking-widest uppercase mb-8" style={{ color: 'var(--navy)', letterSpacing: '0.1em' }}>
        Your Cart
      </h1>

      <div className="space-y-4 mb-10">
        {cart.map(item => (
          <div key={item.product_id} className="flex gap-4 items-center border-b pb-4" style={{ borderColor: 'rgba(26,39,68,0.08)' }}>
            {item.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{item.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>J${item.price_jmd.toLocaleString()} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQty(item.product_id, item.quantity - 1)} className="w-7 h-7 rounded border text-sm font-bold" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>−</button>
              <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
              <button onClick={() => updateQty(item.product_id, item.quantity + 1)} className="w-7 h-7 rounded border text-sm font-bold" style={{ borderColor: 'var(--navy)', color: 'var(--navy)' }}>+</button>
            </div>
            <p className="w-24 text-right text-sm font-bold" style={{ color: 'var(--navy)' }}>
              J${(item.price_jmd * item.quantity).toLocaleString()}
            </p>
            <button onClick={() => removeItem(item.product_id)} className="text-xs" style={{ color: 'var(--muted)' }}>✕</button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <span className="font-semibold" style={{ color: 'var(--navy)' }}>Total</span>
        <span className="text-xl font-black" style={{ color: 'var(--navy)' }}>
          J${totalJmd.toLocaleString()}
        </span>
      </div>

      <Link
        href="/checkout"
        className="block w-full text-center py-4 rounded font-bold tracking-wider text-sm transition-opacity hover:opacity-90"
        style={{ background: 'var(--navy)', color: '#fff' }}
      >
        Proceed to Checkout
      </Link>
    </div>
  )
}
