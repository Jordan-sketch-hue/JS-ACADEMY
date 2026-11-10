'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

const USD_TO_JMD = 158

function fmt(jmdCents: number, currency: 'usd' | 'jmd'): string {
  if (currency === 'usd') {
    const usd = (jmdCents / 100) / USD_TO_JMD
    return `$${usd.toFixed(2)}`
  }
  return `J$${(jmdCents / 100).toLocaleString()}`
}

const CSS = `
  .ck{max-width:1100px;margin:0 auto;padding:40px 24px 80px;display:grid;grid-template-columns:1fr 440px;gap:48px;align-items:start}
  @media(max-width:860px){.ck{grid-template-columns:1fr;gap:32px}}
  .ck-left{}
  .ck-right{position:sticky;top:88px}
  .ck-eyebrow{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);margin-bottom:12px}
  .ck-h{font-family:var(--font-serif);font-size:36px;font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:32px}
  .ck-section{margin-bottom:28px}
  .ck-section-title{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid var(--border)}
  .ck-label{display:block;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:6px}
  .ck-input{width:100%;padding:12px 16px;border:1.5px solid var(--border);border-radius:12px;font-size:14px;color:var(--ink);background:#fff;outline:none;box-sizing:border-box;transition:border-color .2s}
  .ck-input:focus{border-color:var(--gold)}
  .ck-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
  .ck-row-1{margin-bottom:14px}
  .ck-opt-in{display:flex;align-items:flex-start;gap:12px;background:var(--surface);border:1.5px solid var(--border);border-radius:14px;padding:16px;cursor:pointer;transition:border-color .2s}
  .ck-opt-in:hover{border-color:var(--gold)}
  .ck-opt-in input[type=checkbox]{width:18px;height:18px;accent-color:var(--gold);cursor:pointer;flex-shrink:0;margin-top:1px}
  .ck-opt-in-text{font-size:13px;color:var(--ink)}
  .ck-opt-in-text strong{display:block;font-weight:700;margin-bottom:2px}
  .ck-opt-in-text span{color:var(--ink-muted);font-size:12px}
  .ck-panel{background:#fff;border:1px solid var(--border);border-radius:20px;overflow:hidden}
  .ck-panel-head{padding:20px 24px;border-bottom:1px solid var(--border);font-family:var(--font-serif);font-size:17px;font-weight:800}
  .ck-items{padding:0 24px}
  .ck-item{display:flex;align-items:center;gap:14px;padding:16px 0;border-bottom:1px solid var(--border)}
  .ck-item:last-child{border-bottom:none}
  .ck-item-img{width:52px;height:52px;border-radius:10px;overflow:hidden;background:var(--surface);flex-shrink:0;position:relative}
  .ck-item-name{font-size:13px;font-weight:600;flex:1;min-width:0}
  .ck-item-qty{font-size:11px;color:var(--ink-muted);margin-top:2px}
  .ck-item-price{font-size:14px;font-weight:700;flex-shrink:0}
  .ck-totals{padding:16px 24px;background:var(--surface)}
  .ck-total-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--ink-muted);margin-bottom:6px}
  .ck-total-final{display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:900;color:var(--ink);margin-top:4px;padding-top:10px;border-top:1px solid var(--border)}
  .ck-cta{margin-top:20px;padding:0 24px 24px}
  .ck-pay-btn{width:100%;background:var(--gold);color:var(--dark);font-family:var(--font-serif);font-size:17px;font-weight:900;padding:18px 24px;border-radius:14px;border:none;cursor:pointer;transition:all .2s;letter-spacing:-.01em}
  .ck-pay-btn:hover{opacity:.92;transform:translateY(-1px);box-shadow:0 8px 24px rgba(200,168,75,.35)}
  .ck-pay-btn:disabled{opacity:.55;cursor:not-allowed;transform:none}
  .ck-trust{display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;color:var(--ink-muted);margin-top:12px;letter-spacing:.04em}
  .ck-err{background:#fff0f0;color:#c0392b;border:1px solid #fcc;border-radius:12px;padding:12px 16px;font-size:13px;font-weight:600;margin-bottom:16px}
  .ck-currency-note{font-size:11px;color:var(--ink-muted);text-align:center;margin-top:8px}
`

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const currency = 'usd' as const
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [optIn, setOptIn] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const total = fmt(cartTotal, currency)
  const totalRaw = (cartTotal / 100) / USD_TO_JMD

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const amount = Math.round(totalRaw * 100)
      const res = await fetch('/api/payments/handypay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency,
          description: `Mine & Yours order (${items.length} item${items.length > 1 ? 's' : ''})`,
          orderId: crypto.randomUUID(),
          customerEmail: email || undefined,
          customerName: name || undefined,
          optIn,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment failed')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 900, marginBottom: 12 }}>Your bag is empty</p>
          <p style={{ color: 'var(--ink-muted)', marginBottom: 28, fontSize: 14 }}>Add some curated pieces and come back.</p>
          <a href="/shop" style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--dark)', fontWeight: 800, padding: '14px 32px', borderRadius: 12, textDecoration: 'none', fontSize: 14 }}>Browse Shop</a>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ck">
        {/* LEFT: Contact + opt-in */}
        <div className="ck-left">
          <p className="ck-eyebrow">Secure Checkout</p>
          <h1 className="ck-h">Complete Your<br/>Order</h1>

          <div className="ck-section">
            <p className="ck-section-title">Contact</p>
            <div className="ck-row-1">
              <label className="ck-label">Full Name</label>
              <input className="ck-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="ck-row-1">
              <label className="ck-label">Email Address</label>
              <input className="ck-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="ck-section">
            <p className="ck-section-title">Preferences</p>
            <label className="ck-opt-in" onClick={() => setOptIn(v => !v)}>
              <input type="checkbox" checked={optIn} onChange={() => setOptIn(v => !v)} />
              <div className="ck-opt-in-text">
                <strong>Newsletter & exclusive drops</strong>
                <span>Get early access, coupons and curated picks — no spam, unsubscribe anytime.</span>
              </div>
            </label>
          </div>

          {error && <div className="ck-err">{error}</div>}
        </div>

        {/* RIGHT: Order panel */}
        <div className="ck-right">
          <div className="ck-panel">
            <div className="ck-panel-head">Your Bag ({items.length})</div>
            <div className="ck-items">
              {items.map(item => (
                <div key={item.id} className="ck-item">
                  <div className="ck-item-img">
                    {item.image_url
                      ? <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🛍️</div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ck-item-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                    <p className="ck-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="ck-item-price">{fmt(item.price_jmd * item.quantity, currency)}</p>
                </div>
              ))}
            </div>
            <div className="ck-totals">
              <div className="ck-total-row"><span>Subtotal</span><span>{total}</span></div>
              <div className="ck-total-row"><span>Shipping</span><span>Calculated at payment</span></div>
              <div className="ck-total-final"><span>Total</span><span>{total} USD</span></div>
            </div>
            <div className="ck-cta">
              <button className="ck-pay-btn" onClick={handleCheckout} disabled={loading}>
                {loading ? 'Redirecting…' : `Pay ${total} USD`}
              </button>
              <div className="ck-trust">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Secured by HandyPay · SSL encrypted
              </div>
              <p className="ck-currency-note">Prices in USD · <a href="/shop" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Continue shopping</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}