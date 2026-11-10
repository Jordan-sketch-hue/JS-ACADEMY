"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/context/CartContext"

export default function SuccessContent() {
  const params = useSearchParams()
  const orderId = params.get("order")
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared) { clearCart(); setCleared(true) }
  }, [clearCart, cleared])

  const short = orderId ? orderId.slice(0, 8).toUpperCase() : "—"

  return (
    <>
      <style>{`
        .sc-wrap{max-width:560px;margin:80px auto;padding:0 24px 100px;text-align:center}
        .sc-icon{width:72px;height:72px;background:var(--gold);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 28px}
        .sc-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:10px}
        .sc-h{font-family:var(--font-serif);font-size:clamp(32px,5vw,48px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:16px}
        .sc-sub{font-size:15px;color:var(--ink-muted);line-height:1.7;margin-bottom:36px;max-width:420px;margin-left:auto;margin-right:auto}
        .sc-order-box{background:var(--surface);border:1.5px solid var(--border);border-radius:16px;padding:24px;margin-bottom:36px;text-align:left}
        .sc-order-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:6px 0;border-bottom:1px solid var(--border)}
        .sc-order-row:last-child{border-bottom:none;font-weight:800;font-size:15px;padding-top:12px;color:var(--ink)}
        .sc-steps{display:flex;flex-direction:column;gap:12px;margin-bottom:40px;text-align:left}
        .sc-step{display:flex;align-items:flex-start;gap:14px;background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px}
        .sc-step-num{width:28px;height:28px;border-radius:50%;background:var(--ink);color:#fff;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sc-step-text strong{display:block;font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px}
        .sc-step-text span{font-size:12px;color:var(--ink-muted);line-height:1.5}
        .sc-btn-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
        .sc-btn-primary{background:var(--gold);color:var(--dark);font-family:var(--font-stamp);font-size:12px;letter-spacing:.14em;padding:14px 28px;border:none;cursor:pointer;text-decoration:none;display:inline-block;font-weight:800}
        .sc-btn-secondary{background:transparent;color:var(--ink);font-family:var(--font-stamp);font-size:12px;letter-spacing:.14em;padding:14px 28px;border:1.5px solid var(--border);text-decoration:none;display:inline-block;font-weight:700}
        .sc-btn-secondary:hover{border-color:var(--ink)}
      `}</style>
      <div className="sc-wrap">
        <div className="sc-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <p className="sc-eyebrow">Order Confirmed</p>
        <h1 className="sc-h">You&apos;re all set.</h1>
        <p className="sc-sub">
          Your payment was received. We&apos;re getting your order ready now.
          {orderId && <> A confirmation has been sent if you provided your email.</>}
        </p>
        <div className="sc-order-box">
          <div className="sc-order-row">
            <span style={{ color: "var(--ink-muted)" }}>Order reference</span>
            <span style={{ fontFamily: "monospace", fontWeight: 700 }}>#{short}</span>
          </div>
          <div className="sc-order-row">
            <span style={{ color: "var(--ink-muted)" }}>Payment</span>
            <span style={{ color: "#27ae60", fontWeight: 700 }}>Confirmed</span>
          </div>
          <div className="sc-order-row">
            <span style={{ color: "var(--ink-muted)" }}>Delivery</span>
            <span>Processing</span>
          </div>
        </div>
        <div className="sc-steps">
          <div className="sc-step">
            <div className="sc-step-num">1</div>
            <div className="sc-step-text">
              <strong>Payment received</strong>
              <span>Your payment has been processed successfully via HandyPay.</span>
            </div>
          </div>
          <div className="sc-step">
            <div className="sc-step-num">2</div>
            <div className="sc-step-text">
              <strong>Order being prepared</strong>
              <span>We&apos;re packing your items. You&apos;ll be contacted when ready for dispatch.</span>
            </div>
          </div>
          <div className="sc-step">
            <div className="sc-step-num">3</div>
            <div className="sc-step-text">
              <strong>Delivery to your door</strong>
              <span>Fast delivery across Jamaica. Contact us at (658) 218-2282 for updates.</span>
            </div>
          </div>
        </div>
        <div className="sc-btn-row">
          <Link href="/shop" className="sc-btn-primary">Continue Shopping</Link>
          <Link href="/inspire" className="sc-btn-secondary">Browse Inspire</Link>
        </div>
        <p style={{ marginTop: 32, fontSize: 12, color: "var(--ink-muted)" }}>
          Questions? Call or WhatsApp{" "}
          <a href="tel:+16582182282" style={{ color: "var(--gold)", fontWeight: 700, textDecoration: "none" }}>(658) 218-2282</a>
        </p>
      </div>
    </>
  )
}