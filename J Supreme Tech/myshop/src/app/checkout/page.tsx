'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'

const USD_TO_JMD = 158

function fmt(jmdCents: number): string {
  const usd = (jmdCents / 100) / USD_TO_JMD
  return `$${usd.toFixed(2)}`
}

const CSS = `
  .ck{max-width:1100px;margin:0 auto;padding:48px 24px 80px;display:grid;grid-template-columns:1fr 440px;gap:52px;align-items:start}
  @media(max-width:860px){.ck{grid-template-columns:1fr;gap:32px}}
  .ck-right{position:sticky;top:88px}
  .ck-eyebrow{font-family:var(--font-stamp);font-size:10px;font-weight:700;letter-spacing:.22em;color:var(--gold);margin-bottom:10px}
  .ck-h{font-family:var(--font-serif);font-size:clamp(32px,4vw,44px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:36px}
  .ck-section{margin-bottom:28px}
  .ck-section-title{font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--border)}
  .ck-label{display:block;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:6px}
  .ck-label-opt{font-weight:400;color:var(--ink-muted);font-size:10px;margin-left:4px;letter-spacing:.04em}
  .ck-input{width:100%;padding:13px 16px;border:1.5px solid var(--border);font-size:14px;color:var(--ink);background:#fff;outline:none;box-sizing:border-box;transition:border-color .2s;border-radius:0}
  .ck-input:focus{border-color:var(--gold)}
  .ck-row-1{margin-bottom:14px}
  .ck-hint{font-size:11px;color:var(--ink-muted);margin-top:5px;line-height:1.5}
  .ck-opt-wrap{background:var(--surface);border:1.5px solid var(--border);padding:16px;cursor:pointer;transition:border-color .2s;display:flex;align-items:flex-start;gap:12px}
  .ck-opt-wrap:hover{border-color:var(--gold)}
  .ck-opt-wrap input[type=checkbox]{width:17px;height:17px;accent-color:var(--gold);cursor:pointer;flex-shrink:0;margin-top:1px}
  .ck-opt-text strong{display:block;font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px}
  .ck-opt-text span{font-size:12px;color:var(--ink-muted);line-height:1.5}
  .ck-panel{background:#fff;border:1px solid var(--border)}
  .ck-panel-head{padding:18px 24px;border-bottom:1px solid var(--border);font-family:var(--font-serif);font-size:17px;font-weight:800;color:var(--ink)}
  .ck-items{padding:0 24px}
  .ck-item{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border)}
  .ck-item:last-child{border-bottom:none}
  .ck-item-img{width:50px;height:50px;overflow:hidden;background:var(--surface);flex-shrink:0;position:relative}
  .ck-item-name{font-size:13px;font-weight:600;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .ck-item-qty{font-size:11px;color:var(--ink-muted);margin-top:2px}
  .ck-item-price{font-size:14px;font-weight:800;flex-shrink:0}
  .ck-totals{padding:16px 24px;background:var(--surface)}
  .ck-total-row{display:flex;justify-content:space-between;font-size:13px;color:var(--ink-muted);margin-bottom:6px}
  .ck-total-final{display:flex;justify-content:space-between;font-size:18px;font-weight:900;color:var(--ink);margin-top:6px;padding-top:12px;border-top:1px solid var(--border)}
  .ck-cta{padding:20px 24px 24px}
  .ck-pay-btn{width:100%;background:var(--gold);color:var(--dark);font-family:var(--font-serif);font-size:17px;font-weight:900;padding:18px 24px;border:none;cursor:pointer;transition:all .2s;letter-spacing:-.01em;border-radius:0}
  .ck-pay-btn:hover{opacity:.92;transform:translateY(-1px)}
  .ck-pay-btn:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .ck-trust{display:flex;align-items:center;justify-content:center;gap:7px;font-size:11px;color:var(--ink-muted);margin-top:12px;letter-spacing:.04em}
  .ck-err{background:#fff0f0;color:#c0392b;border:1px solid #fcc;padding:12px 16px;font-size:13px;font-weight:600;margin-bottom:16px}
  .ck-currency-note{font-size:11px;color:var(--ink-muted);text-align:center;margin-top:8px}
  @media(max-width:640px){.ck{padding:32px 16px 60px}}
`

export default function CheckoutPage() {
  const { items, cartTotal, clearCart } = useCart()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [optInMarketing, setOptInMarketing] = useState(false)
  const [optInEmail, setOptInEmail] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalRaw = (cartTotal / 100) / USD_TO_JMD
  const totalDisplay = fmt(cartTotal)
  const amount = Math.round(totalRaw * 100)

  async function handleCheckout() {
    if (items.length === 0) return
    setLoading(true)
    setError('')
    try {
      const orderId = crypto.randomUUID()
      const res = await fetch('/api/payments/handypay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          description: `Mine & Yours order (${items.length} item${items.length > 1 ? 's' : ''})`,
          orderId,
          customerEmail: email.trim() || undefined,
          customerName: name.trim() || undefined,
          optIn: optInMarketing,
          items: items.map(i => ({ id: i.id, name: i.name, qty: i.quantity, price_usd: (i.price_jmd / 100) / USD_TO_JMD })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Payment failed')
      clearCart()
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 900, marginBottom: 12 }}>Your bag is empty.</p>
          <p style={{ color: 'var(--ink-muted)', marginBottom: 28, fontSize: 14, lineHeight: 1.7 }}>Add some curated pieces and come back.</p>
          <a href="/shop" style={{ display: 'inline-block', background: 'var(--gold)', color: 'var(--dark)', fontWeight: 800, padding: '14px 32px', textDecoration: 'none', fontSize: 13, fontFamily: 'var(--font-stamp)', letterSpacing: '.14em' }}>Browse Shop</a>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ck">
        {/* LEFT */}
        <div>
          <p className="ck-eyebrow">Secure Checkout</p>
          <h1 className="ck-h">Complete Your Order</h1>

          <div className="ck-section">
            <p className="ck-section-title">Contact</p>
            <div className="ck-row-1">
              <label className="ck-label">Full Name <span className="ck-label-opt">(optional)</span></label>
              <input className="ck-input" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </div>
            <div className="ck-row-1">
              <label className="ck-label">Email Address <span className="ck-label-opt">(optional — for order confirmation)</span></label>
              <input className="ck-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              <p className="ck-hint">We&apos;ll send your order confirmation here if provided. No account required.</p>
            </div>
          </div>

          <div className="ck-section">
            <p className="ck-section-title">Email Preferences</p>
            <label className="ck-opt-wrap" onClick={() => setOptInEmail(v => !v)}>
              <input type="checkbox" checked={optInEmail} onChange={() => setOptInEmail(v => !v)} />
              <div className="ck-opt-text">
                <strong>Send me my order confirmation</strong>
                <span>Receive a receipt and order status updates to your email above.</span>
              </div>
            </label>
            <div style={{ height: 10 }} />
            <label className="ck-opt-wrap" onClick={() => setOptInMarketing(v => !v)}>
              <input type="checkbox" checked={optInMarketing} onChange={() => setOptInMarketing(v => !v)} />
              <div className="ck-opt-text">
                <strong>Newsletter & exclusive drops</strong>
                <span>Early access, coupons and curated picks — no spam, unsubscribe anytime.</span>
              </div>
            </label>
          </div>

          {error && <div className="ck-err">{error}</div>}
        </div>

        {/* RIGHT: Order summary (sticky) */}
        <div className="ck-right">
          <div className="ck-panel">
            <div className="ck-panel-head">Your Bag ({items.length})</div>
            <div className="ck-items">
              {items.map(item => (
                <div key={item.id} className="ck-item">
                  <div className="ck-item-img">
                    {item.image_url
                      ? <Image src={item.image_url} alt={item.name} fill className="object-cover" />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🛍️</div>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="ck-item-name">{item.name}</p>
                    <p className="ck-item-qty">Qty {item.quantity}</p>
                  </div>
                  <p className="ck-item-price">{fmt(item.price_jmd * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="ck-totals">
              <div className="ck-total-row"><span>Subtotal</span><span>{totalDisplay}</span></div>
              <div className="ck-total-row"><span>Shipping</span><span>At payment</span></div>
              <div className="ck-total-final"><span>Total</span><span>{totalDisplay} USD</span></div>
            </div>
            <div className="ck-cta">
              <button className="ck-pay-btn" onClick={handleCheckout} disabled={loading}>
                {loading ? 'Redirecting to payment…' : `Pay ${totalDisplay} USD`}
              </button>
              <div className="ck-trust">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Secured by HandyPay · SSL encrypted
              </div>
              <p className="ck-currency-note">Prices in USD · <a href="/cart" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Edit bag</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}