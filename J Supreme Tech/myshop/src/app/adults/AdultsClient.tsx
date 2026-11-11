"use client"

import { useState, useEffect } from "react"
import AgeGate from "@/components/AgeGate"
import { ProductCard } from "@/components/ProductCard"
import Link from "next/link"
import type { Product } from "@/lib/types"

const CSS = `
  .adults-hero{background:var(--dark);padding:80px 24px 64px;text-align:center;border-bottom:1px solid rgba(200,168,75,0.15)}
  .adults-grid{max-width:1280px;margin:0 auto;padding:60px 24px 100px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px}
  .adults-banner{background:rgba(200,168,75,0.08);border:1px solid rgba(200,168,75,0.2);padding:16px 24px;max-width:1280px;margin:32px auto 0;display:flex;align-items:center;gap:12px}
  @media(max-width:900px){.adults-grid{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:500px){.adults-grid{grid-template-columns:1fr}}
`

export default function AdultsClient({ products }: { products: Product[] }) {
  const [verified, setVerified] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    try {
      setVerified(localStorage.getItem("myshop_age_verified") === "yes")
    } catch {}
    setChecked(true)
  }, [])

  if (!checked) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {!verified && <AgeGate onVerified={() => setVerified(true)} />}

      {verified && (
        <>
          <section className="adults-hero">
            <span className="stamp" style={{ display:"block", marginBottom:16 }}>Adults Only · 18+</span>
            <h1 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(28px,4vw,52px)", fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:16 }}>
              Premium <em style={{ fontStyle:"italic", color:"var(--gold)" }}>Adult Collection</em>
            </h1>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:15, maxWidth:520, margin:"0 auto 32px" }}>
              Curated wellness and intimacy products. Discreet packaging. Fast delivery across Jamaica.
            </p>
            <Link href="/shop" style={{ color:"rgba(255,255,255,0.3)", fontSize:11, letterSpacing:".1em", textTransform:"uppercase", textDecoration:"none" }}>
              ← Back to Main Store
            </Link>
          </section>

          <div style={{ background:"var(--dark)", padding:"0 24px" }}>
            <div className="adults-banner">
              <span style={{ color:"var(--gold)", fontSize:16 }}>🔒</span>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
                <strong style={{ color:"rgba(255,255,255,0.75)" }}>Discreet delivery guaranteed.</strong> All orders ship in plain packaging with no product descriptions on the label.
              </p>
            </div>
          </div>

          <section style={{ background:"#F5F4F0", padding:"64px 0" }}>
            <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
              <div style={{ marginBottom:40 }}>
                <span className="stamp" style={{ display:"block", marginBottom:8 }}>All Products</span>
                <h2 style={{ fontFamily:"var(--font-serif)", fontSize:"clamp(22px,3vw,36px)", fontWeight:900, color:"var(--ink)" }}>
                  Adult Collection
                </h2>
                {products.length > 0 && (
                  <p style={{ fontSize:13, color:"var(--ink-muted)", marginTop:8 }}>
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {products.length === 0 ? (
                <div style={{ textAlign:"center", padding:"80px 24px", border:"1px dashed var(--border)", background:"var(--surface)" }}>
                  <span className="stamp" style={{ display:"block", marginBottom:12 }}>Coming Soon</span>
                  <p style={{ fontFamily:"var(--font-serif)", fontSize:20, fontWeight:700, color:"var(--ink)", marginBottom:8 }}>
                    Products Loading
                  </p>
                  <p style={{ fontSize:14, color:"var(--ink-muted)", maxWidth:400, margin:"0 auto" }}>
                    Check back soon — new arrivals are on their way.
                  </p>
                </div>
              ) : (
                <div className="adults-grid">
                  {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </>
  )
}
