'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { cart, totalJmd, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
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
      // Show branded redirect screen before navigation
      setRedirecting(true)
      // Small delay so the overlay renders before browser navigates
      setTimeout(() => {
        window.location.href = data.url
      }, 600)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <>
      {/* ── Full-screen redirect overlay ── */}
      {redirecting && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'var(--navy)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
          }}
        >
          {/* Spinner */}
          <svg
            width="52"
            height="52"
            viewBox="0 0 52 52"
            fill="none"
            style={{ animation: 'spin 0.9s linear infinite' }}
            aria-hidden="true"
          >
            <circle
              cx="26"
              cy="26"
              r="22"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="4"
            />
            <path
              d="M26 4a22 22 0 0 1 22 22"
              stroke="var(--gold)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <div style={{ textAlign: 'center' }}>
            <p
              style={{
                color: '#fff',
                fontWeight: 800,
                fontSize: '1rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Redirecting to secure checkout
            </p>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.75rem',
                marginTop: '0.4rem',
                letterSpacing: '0.04em',
              }}
            >
              Please wait — do not close this page
            </p>
          </div>

          <div
            style={{
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zM6 4v4l3 1.5"
                stroke="var(--gold)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                color: 'var(--gold)',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Powered by HandyPay
            </span>
          </div>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* ── Checkout form ── */}
      <div
        className="max-w-xl mx-auto px-4 py-16"
        style={{ pointerEvents: redirecting ? 'none' : 'auto', opacity: redirecting ? 0 : 1 }}
      >
        <h1
          className="text-2xl font-black tracking-widest uppercase mb-6"
          style={{ color: 'var(--navy)', letterSpacing: '0.1em' }}
        >
          Checkout
        </h1>

        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--surface)' }}>
          {cart.map(item => (
            <div
              key={item.product.id}
              className="flex justify-between text-sm py-2"
              style={{ color: 'var(--navy)' }}
            >
              <span>{item.product.name} × {item.qty}</span>
              <span>J${(item.product.price_jmd * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div
            className="border-t mt-3 pt-3 flex justify-between font-black"
            style={{ borderColor: 'var(--gold)', color: 'var(--navy)' }}
          >
            <span>Subtotal</span>
            <span>J${totalJmd.toLocaleString()}</span>
          </div>
        </div>

        {/* Fee notice */}
        <div
          className="rounded-lg px-4 py-3 mb-6 text-xs"
          style={{
            background: 'rgba(0,0,0,0.04)',
            color: 'var(--muted)',
            lineHeight: '1.5',
            borderLeft: '3px solid var(--gold)',
          }}
        >
          A small processing fee may be added at checkout by HandyPay. The final amount will
          be shown before you confirm payment.
        </div>

        {error && (
          <p className="text-sm mb-4" style={{ color: '#c0392b' }}>{error}</p>
        )}

        <button
          onClick={handlePay}
          disabled={loading || redirecting}
          className="w-full py-4 rounded-lg font-black text-sm tracking-widest uppercase transition-opacity"
          style={{
            background: loading ? 'var(--muted)' : 'var(--navy)',
            color: '#fff',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Preparing checkout…' : `Pay Now — J$${totalJmd.toLocaleString()}`}
        </button>

        <p className="text-xs mt-4 text-center" style={{ color: 'var(--muted)' }}>
          Secure checkout powered by HandyPay
        </p>
      </div>
    </>
  )
}
