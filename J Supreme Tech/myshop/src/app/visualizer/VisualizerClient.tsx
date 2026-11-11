"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

interface Props {
  products: Product[]
  categories: string[]
}

export default function VisualizerClient({ products, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const allCategories = ["All", ...categories]

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .vz-hero{background:var(--dark);padding:72px 24px 56px;text-align:center}
        .vz-filters{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:36px}
        .vz-filter-btn{padding:8px 20px;font-family:var(--font-sans);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border:1px solid rgba(255,255,255,0.15);background:transparent;color:rgba(255,255,255,0.45);cursor:pointer;transition:all 0.2s;border-radius:2px}
        .vz-filter-btn:hover{border-color:rgba(200,168,75,0.5);color:rgba(200,168,75,0.8)}
        .vz-filter-btn.active{border-color:var(--gold);background:rgba(200,168,75,0.12);color:var(--gold)}
        .vz-body{max-width:1280px;margin:0 auto;padding:48px 24px 80px}
        .vz-count{font-family:var(--font-sans);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);margin-bottom:28px}
        .vz-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:20px}
        .vz-card{background:var(--surface);border:1px solid var(--border);overflow:hidden;transition:all 0.3s;text-decoration:none;display:block;position:relative}
        .vz-card:hover{border-color:rgba(200,168,75,0.4);box-shadow:0 8px 32px rgba(0,0,0,0.08);transform:translateY(-2px)}
        .vz-card-img{position:relative;aspect-ratio:1;overflow:hidden;background:#F5F4F0}
        .vz-card-img img{object-fit:cover;transition:transform 0.6s ease}
        .vz-card:hover .vz-card-img img{transform:scale(1.05)}
        .vz-card-body{padding:14px 16px 16px}
        .vz-card-cat{font-family:var(--font-stamp);font-size:9px;letter-spacing:.2em;color:var(--gold);margin-bottom:6px;display:block;text-transform:uppercase}
        .vz-card-name{font-family:var(--font-serif);font-size:14px;font-weight:700;line-height:1.3;color:var(--ink);margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .vz-card-price{font-family:var(--font-serif);font-size:16px;font-weight:900;color:var(--ink)}
        .vz-card-promo{font-family:var(--font-sans);font-size:9px;font-weight:700;letter-spacing:.08em;background:var(--gold);color:var(--ink);padding:3px 8px;border-radius:2px;margin-left:8px;vertical-align:middle}
        .vz-empty{text-align:center;padding:80px 24px;color:var(--ink-muted)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .vz-card{animation:fadeUp 0.4s ease both}
        @media(max-width:640px){.vz-grid{grid-template-columns:repeat(2,1fr);gap:12px}}
      ` }} />

      {/* Hero */}
      <section className="vz-hero">
        <span className="stamp">Visualize Your Space</span>
        <h1 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(28px,4vw,52px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginTop:16,marginBottom:16 }}>
          Shop <em style={{ fontStyle:"italic",color:"var(--gold)" }}>What Fits.</em>
        </h1>
        <p style={{ color:"rgba(255,255,255,0.45)",fontSize:15,maxWidth:520,margin:"0 auto" }}>
          Browse our full catalog of home, furniture, and lifestyle finds. Every item delivers across Jamaica.
        </p>
        <div className="vz-filters">
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`vz-filter-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <div className="vz-body">
        <p className="vz-count">
          {filtered.length} {filtered.length === 1 ? "product" : "products"}
          {activeCategory !== "All" ? ` in ${activeCategory}` : " across all categories"}
        </p>

        {filtered.length === 0 ? (
          <div className="vz-empty">
            <p style={{ fontSize:18,fontWeight:600,marginBottom:8 }}>No products yet in this category.</p>
            <p style={{ fontSize:14 }}>Check back soon — we&apos;re restocking daily.</p>
          </div>
        ) : (
          <div className="vz-grid">
            {filtered.map((product, i) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="vz-card"
                style={{ animationDelay: `${(i % 20) * 40}ms` }}
                onMouseEnter={() => setHoveredSlug(product.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
              >
                <div className="vz-card-img">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
                    />
                  ) : (
                    <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,color:"var(--border)" }}>
                      🛋
                    </div>
                  )}
                </div>
                <div className="vz-card-body">
                  <span className="vz-card-cat">{product.category}</span>
                  <h3 className="vz-card-name">{product.name}</h3>
                  <p className="vz-card-price">
                    J${Number(product.is_promo && product.promo_price_jmd ? product.promo_price_jmd : product.price_jmd).toLocaleString()}
                    {product.is_promo && <span className="vz-card-promo">SALE</span>}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div style={{ textAlign:"center",marginTop:48 }}>
          <Link href="/shop" className="btn-outline">View All Products</Link>
        </div>
      </div>
    </>
  )
}
