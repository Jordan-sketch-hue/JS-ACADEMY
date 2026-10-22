'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, totalJmd, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (cart.length === 0) {
    router.replace('/cart')
    return null
  }

  async function handlePay() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payments/handypay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountJmd: totalJmd,
          description: `MYSHOP order — ${cart.length} item(s)`,
          items: cart,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment failed')
      clearCart()
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1
        className="text-2xl font-black tracking-widest uppercase mb-6"
        style={{ color: 'var(--navy)', letterSpacing: '0.1em' }}
      >
        Checkout
      </h1>

      <div className="rounded-xl p-6 mb-8" style={{ background: 'var(--surface)' }}>
        {cart.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm py-2" style={{ color: 'var(--navy)' }}>
            <span>{item.product.name} × {item.qty}</span>
            <span>J${(item.product.price_jmd * item.qty).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-black" style={{ borderColor: 'var(--gold)', color: 'var(--navy)' }}>
          <span>Total</span>
          <span>J${totalJmd.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <p className="text-sm mb-4" style={{ color: '#c0392b' }}>{error}</p>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-4 rounded-lg font-black text-sm tracking-widest uppercase transition-opacity"
        style={{
          background: loading ? 'var(--muted)' : 'var(--navy)',
          color: '#fff',
          opacity: loading ? 0.7 : 1,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Redirecting to payment…' : 'Pay Now — J$' + totalJmd.toLocaleString()}
      </button>

      <p className="text-xs mt-4 text-center" style={{ color: 'var(--muted)' }}>
        Secure checkout powered by HandyPay
      </p>
    </div>
  )
}
