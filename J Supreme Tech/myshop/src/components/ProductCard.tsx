"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "@/context/CartContext"
import type { Product } from "@/lib/types"

interface Props { product: Product; index?: number }

export function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [flash, setFlash] = useState(false)

  const priceDisplay = "J$" + Number(product.price_jmd).toLocaleString()
  const variantCount = product.variants?.reduce((n, v) => n + v.options.length, 0) ?? 0
  const dMin = product.delivery_days_min ?? 5
  const dMax = product.delivery_days_max ?? 9
  const deliveryLabel = product.free_delivery !== false
    ? `Free Delivery · ${dMin}–${dMax} days`
    : `Ships in ${dMin}–${dMax} days`

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (adding) return
    setAdding(true)
    setFlash(true)
    await addToCart(product)
    setTimeout(() => setFlash(false), 700)
    setAdding(false)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .ms-card{background:var(--surface);border:1px solid var(--border);overflow:hidden;transition:all 0.3s ease}
        .ms-card:hover{border-color:rgba(200,168,75,0.35);box-shadow:0 8px 32px rgba(0,0,0,0.08);transform:translateY(-2px)}
        .ms-card-img{position:relative;aspect-ratio:1;overflow:hidden;background:#F5F4F0}
        .ms-card-img img{object-fit:cover;transition:transform 0.6s ease}
        .ms-card:hover .ms-card-img img{transform:scale(1.04)}
        .ms-card-body{padding:16px 18px 18px}
        .ms-card-cat{font-family:var(--font-stamp);font-size:9px;letter-spacing:.2em;color:var(--gold);margin-bottom:6px;display:block}
        .ms-card-name{font-family:var(--font-serif);font-size:15px;font-weight:700;line-height:1.3;color:var(--ink);margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .ms-card-price{font-family:var(--font-serif);font-size:17px;font-weight:900;color:var(--ink);margin-bottom:14px}
        .ms-card-btn{width:100%;padding:11px 0;font-family:var(--font-sans);font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;border:1px solid var(--ink);background:transparent;color:var(--ink);cursor:pointer;transition:all 0.2s}
        .ms-card-btn:hover{background:var(--ink);color:#fff}
        .ms-card-btn.added{background:var(--gold);border-color:var(--gold);color:var(--ink)}
        .ms-card-badges{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px}
        .ms-card-badge{font-family:var(--font-sans);font-size:9px;font-weight:700;letter-spacing:.08em;padding:3px 7px;border-radius:2px}
        .ms-card-badge-free{background:#e8f5e9;color:#2e7d32}
        .ms-card-badge-days{background:#f5f5f5;color:#555}
        .ms-card-badge-vars{background:#fdf8ee;color:#8b6914}
        .ms-card-skeleton{background:var(--surface);border:1px solid var(--border);overflow:hidden;animation:pulse 1.6s ease-in-out infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.55}}
        .ms-card-skel-img{aspect-ratio:1;background:#F0EEE9}
        .ms-card-skel-body{padding:16px 18px 18px}
        .ms-card-skel-line{height:12px;background:#F0EEE9;margin-bottom:8px;border-radius:2px}
      ` }} />

      <div className="ms-card animate-fade-up" style={{ animationDelay: `${index * 60}ms` }}>
        <Link href={`/shop/${product.slug}`} className="ms-card-img" style={{ display: "block" }}>
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw" />
          ) : (
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,color:"var(--border)" }}>&#128717;</div>
          )}
        </Link>
        <div className="ms-card-body">
          {product.category && <span className="ms-card-cat">{product.category}</span>}
          <Link href={`/shop/${product.slug}`} style={{ textDecoration:"none" }}>
            <h3 className="ms-card-name">{product.name}</h3>
          </Link>
          <p className="ms-card-price">{priceDisplay}</p>
          <div className="ms-card-badges">
            <span className={`ms-card-badge ${product.free_delivery !== false ? "ms-card-badge-free" : "ms-card-badge-days"}`}>
              {deliveryLabel}
            </span>
            {variantCount > 0 && (
              <span className="ms-card-badge ms-card-badge-vars">{variantCount} options</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`ms-card-btn${flash ? " added" : ""}`}
          >
            {flash ? "Added to Cart" : adding ? "..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="ms-card-skeleton">
      <div className="ms-card-skel-img" />
      <div className="ms-card-skel-body">
        <div className="ms-card-skel-line" style={{ width:"40%",height:8 }} />
        <div className="ms-card-skel-line" style={{ width:"80%" }} />
        <div className="ms-card-skel-line" style={{ width:"55%",height:16 }} />
        <div className="ms-card-skel-line" style={{ width:"100%",height:38,marginTop:8 }} />
      </div>
    </div>
  )
}
