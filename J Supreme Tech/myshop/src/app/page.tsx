export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

export const metadata: Metadata = {
  title: "Mine & Yours Shop — Premium Curated Store | Shop Online Jamaica",
  description: "Discover curated collections of premium products. Jewelry, home decor, electronics, beauty and more. Fast delivery across Jamaica.",
}

const CATEGORIES = [
  { name: "Baby & Toddler",        slug: "baby" },
  { name: "Beauty & Wellness",     slug: "beauty" },
  { name: "Cellphone Accessories", slug: "cellphone" },
  { name: "Electronics & Tech",    slug: "electronics" },
  { name: "Fitness & Outdoor",     slug: "fitness" },
  { name: "Furniture",             slug: "furniture" },
  { name: "Patio & Garden",        slug: "garden" },
  { name: "Home Improvement",      slug: "home-improvement" },
  { name: "Home & Living",         slug: "home-living" },
  { name: "Jewelry & Accessories", slug: "jewelry" },
  { name: "Lifestyle Finds",       slug: "lifestyle" },
  { name: "Office Products",       slug: "office" },
  { name: "Pet Supplies",          slug: "pets" },
  { name: "Adults Only · 18+",     slug: "adults", href: "/adults" },
] as const

type Category = (typeof CATEGORIES)[number]

const STATIC_STORIES = [
  { label: "Beauty & Wellness",     title: "Your Glow-Up Starts Here", catSlug: "beauty",      staticImg: "/hero/story-beauty.jpg" },
  { label: "Home & Living",         title: "Curated for Your Space",   catSlug: "home-living", staticImg: "/hero/story-home.jpg" },
  { label: "Jewelry & Accessories", title: "Wear What Speaks",         catSlug: "jewelry",     staticImg: "/hero/story-jewelry.jpg" },
]

const STATIC_ARRIVALS = [
  { category: "Electronics & Tech",    name: "Smart Home Essentials",       price: "J$12,500+", href: "/shop?category=electronics", gradient: "linear-gradient(135deg,#0d1a2b,#0a1520)" },
  { category: "Jewelry & Accessories", name: "Gold-Tone Statement Pieces",  price: "J$3,800+",  href: "/shop?category=jewelry",     gradient: "linear-gradient(135deg,#1a1200,#2b2200)" },
  { category: "Beauty & Wellness",     name: "Wellness Collection",         price: "J$2,200+",  href: "/shop?category=beauty",      gradient: "linear-gradient(135deg,#1a0a1a,#2b0d2b)" },
]

async function getFeatured(limit = 6): Promise<Product[]> {
  try {
    const { data } = await supabase
      .from("myshop_products").select("*")
      .eq("active", true).not("image_url", "is", null)
      .order("created_at", { ascending: false }).limit(limit)
    return (data ?? []) as Product[]
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeatured(6)
  const heroProduct = featured[0]
  const stories = featured.slice(0, 3)
  const newArrivals = featured.slice(0, 3)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .hero{position:relative;height:92vh;min-height:560px;overflow:hidden;background:var(--dark)}
        .hero-img{object-fit:cover;object-position:center}
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,0.78) 45%,rgba(0,0,0,0.15))}
        .hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 clamp(24px,6vw,120px);max-width:720px}
        .hero-eyebrow{font-family:var(--font-stamp);font-size:11px;letter-spacing:.22em;color:var(--gold);margin-bottom:20px}
        .hero-title{font-family:var(--font-serif);font-size:clamp(38px,5.5vw,72px);font-weight:900;line-height:1.05;color:#fff;margin-bottom:16px}
        .hero-title em{font-style:italic;color:var(--gold)}
        .hero-sub{color:rgba(255,255,255,0.5);font-size:15px;line-height:1.8;margin-bottom:28px;max-width:460px}
        .hero-actions{display:flex;gap:16px;flex-wrap:wrap}
        .stories-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px 0}
        .story-card{position:relative;aspect-ratio:3/4;overflow:hidden;cursor:pointer;text-decoration:none;display:block}
        .story-card-bg{position:absolute;inset:0;transition:transform 0.6s ease}
        .story-card:hover .story-card-bg{transform:scale(1.04)}
        .story-card:hover .story-img{transform:scale(1.04)}
        .story-img{object-fit:cover;transition:transform 0.6s ease}
        .story-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.78) 50%,rgba(0,0,0,0.1) 100%)}
        .story-text{position:absolute;bottom:0;left:0;right:0;padding:28px 24px}
        .arrivals-section{background:#F5F4F0;padding:72px 24px}
        .arrivals-inner{max-width:1280px;margin:0 auto}
        .section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px}
        .arrivals-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
        .arrival-card{background:var(--surface);border:1px solid var(--border);overflow:hidden;transition:all 0.3s;text-decoration:none;display:block}
        .arrival-card:hover{border-color:rgba(200,168,75,0.4);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.08)}
        .arrival-img{position:relative;aspect-ratio:1;overflow:hidden}
        .arrival-img img{object-fit:cover;transition:transform 0.6s}
        .arrival-card:hover .arrival-img img{transform:scale(1.04)}
        .arrival-ph{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}
        .arrival-body{padding:16px 18px 20px}
        .cats-section{padding:64px 24px;max-width:1280px;margin:0 auto}
        .cats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .cat-card{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--dark);text-decoration:none;display:block}
        .cat-img-static{position:absolute;inset:0;object-fit:cover;transition:opacity 0.55s ease;width:100%;height:100%}
        .cat-img-kinetic{position:absolute;inset:0;object-fit:cover;opacity:0;transition:opacity 0.55s ease;width:100%;height:100%}
        .cat-card:hover .cat-img-kinetic{opacity:1}
        .cat-card:hover .cat-img-static{opacity:0}
        .cat-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;background:linear-gradient(to top,rgba(0,0,0,0.75),transparent)}
        .trust-bar{background:var(--dark);padding:48px 24px}
        .trust-bar-inner{max-width:1280px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center}
        .visualizer-cta{background:#111;padding:80px 24px;text-align:center;border-top:1px solid rgba(200,168,75,0.15)}
        .visualizer-cta-inner{max-width:640px;margin:0 auto}
        @media(max-width:900px){
          .stories-grid,.arrivals-grid{grid-template-columns:repeat(2,1fr)}
          .cats-grid{grid-template-columns:repeat(2,1fr)}
          .trust-bar-inner{grid-template-columns:repeat(2,1fr)}
          .arrivals-section{padding:48px 20px}
          .cats-section{padding:48px 20px}
        }
        @media(max-width:600px){
          .hero-actions{flex-direction:column;gap:12px}
          .hero-actions a{text-align:center;width:100%;max-width:280px}
          .stories-grid{grid-template-columns:1fr;gap:3px}
          .story-card{aspect-ratio:4/3}
          .arrivals-grid{grid-template-columns:1fr}
          .trust-bar-inner{grid-template-columns:repeat(2,1fr);gap:24px}
          .cats-grid{grid-template-columns:repeat(2,1fr)}
          .section-header{flex-direction:column;align-items:flex-start;gap:16px}
          .arrivals-section{padding:40px 16px}
          .cats-section{padding:40px 16px}
          .trust-bar{padding:36px 16px}
        }
      ` }} />

      {/* HERO */}
      <section className="hero">
        <Image
          src={heroProduct?.image_url ?? "/hero/hero-1.jpg"}
          alt={heroProduct?.name ?? "Premium curated products"}
          fill
          className="hero-img"
          priority
          sizes="100vw"
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Premium Curated Store · Jamaica</p>
          <h1 className="hero-title">Find the Things<br /><em>Worth Having.</em></h1>
          <p className="hero-sub">Handpicked products across beauty, tech, home, jewelry and more — delivered across Jamaica.</p>
          <div className="hero-actions">
            <Link href="/shop" className="btn-primary">Shop All Products</Link>
            <Link href="/shop?category=jewelry" className="btn-outline-white">Explore Jewelry</Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL STORIES */}
      <section className="stories-grid">
        {(stories.length > 0 ? stories.map(p => ({
          label: p.category ?? "", title: p.name, catSlug: p.slug, staticImg: "", imageUrl: p.image_url, productSlug: p.slug
        })) : STATIC_STORIES.map(s => ({ ...s, imageUrl: null, productSlug: null }))).map((item, i) => (
          <Link key={i} href={item.productSlug ? "/shop/" + item.productSlug : "/shop?category=" + item.catSlug} className="story-card">
            <Image
              src={item.imageUrl ?? (item.staticImg || "/hero/story-beauty.jpg")}
              alt={item.title}
              fill
              className="story-img"
              sizes="(max-width:600px) 100vw, 1080px"
              quality={95}
              style={{ objectFit: "cover" }}
            />
            <div className="story-overlay" />
            <div className="story-text">
              <span className="stamp" style={{ display:"block",marginBottom:8 }}>{item.label}</span>
              <p style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(15px,2vw,20px)",fontWeight:800,color:"#fff",lineHeight:1.2 }}>{item.title}</p>
              <p style={{ fontFamily:"var(--font-sans)",fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:10,letterSpacing:".1em",textTransform:"uppercase" }}>Shop Now →</p>
            </div>
          </Link>
        ))}
      </section>

      {/* NEW ARRIVALS */}
      <section className="arrivals-section">
        <div className="arrivals-inner">
          <div className="section-header">
            <div>
              <span className="stamp" style={{ display:"block",marginBottom:8 }}>Just In</span>
              <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(24px,3vw,38px)",fontWeight:900,color:"var(--ink)" }}>New Arrivals</h2>
            </div>
            <Link href="/shop" className="btn-outline">View All</Link>
          </div>
          <div className="arrivals-grid">
            {(newArrivals.length > 0 ? newArrivals.map(p => ({
              category: p.category ?? "", name: p.name, price: "J$" + (p.price_jmd/100).toLocaleString(), href: "/shop/" + p.slug, imageUrl: p.image_url, gradient: ""
            })) : STATIC_ARRIVALS).map((item, i) => (
              <Link key={i} href={item.href} className="arrival-card">
                <div className="arrival-img">
                  {"imageUrl" in item && item.imageUrl ? (
                    <Image
                      src={item.imageUrl as string}
                      alt={item.name}
                      fill
                      sizes="(max-width:600px) 100vw, 1080px"
                      quality={90}
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="arrival-ph" style={{ background: ("gradient" in item ? item.gradient : "") || "linear-gradient(135deg,#111,#1a1a1a)" }}>
                      <span className="stamp" style={{ fontSize:10 }}>{item.category}</span>
                      <span style={{ fontFamily:"var(--font-serif)",fontSize:11,color:"rgba(255,255,255,0.3)" }}>Shop Collection</span>
                    </div>
                  )}
                </div>
                <div className="arrival-body">
                  <span className="stamp" style={{ display:"block",marginBottom:6 }}>{item.category}</span>
                  <p style={{ fontFamily:"var(--font-serif)",fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:8,lineHeight:1.3 }}>{item.name}</p>
                  <p style={{ fontFamily:"var(--font-serif)",fontSize:18,fontWeight:900,color:"var(--ink)" }}>{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="trust-bar-inner">
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:"rgba(200,168,75,0.85)", marginBottom:14 }}>
              <rect x="1" y="8" width="18" height="13" rx="1.5"/>
              <path d="M19 11h5l4 5v5h-9V11z"/>
              <circle cx="7" cy="23" r="2.5"/>
              <circle cx="24" cy="23" r="2.5"/>
            </svg>
            <p style={{ fontFamily:"var(--font-serif)",fontWeight:700,color:"#fff",fontSize:14,marginBottom:4 }}>Island-Wide Delivery</p>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.4)" }}>Fast shipping across Jamaica</p>
          </div>
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:"rgba(200,168,75,0.85)", marginBottom:14 }}>
              <rect x="6" y="14" width="20" height="14" rx="2"/>
              <path d="M10 14v-4a6 6 0 0112 0v4"/>
              <circle cx="16" cy="21" r="1.5" fill="currentColor" stroke="none"/>
            </svg>
            <p style={{ fontFamily:"var(--font-serif)",fontWeight:700,color:"#fff",fontSize:14,marginBottom:4 }}>Secure Checkout</p>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.4)" }}>Payments via HandyPay</p>
          </div>
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:"rgba(200,168,75,0.85)", marginBottom:14 }}>
              <path d="M16 2l3 5h5l-4 4 1.5 5.5L16 14l-5.5 2.5L12 11 8 7h5z"/>
              <path d="M11 18l3 3 7-7" strokeWidth="2"/>
            </svg>
            <p style={{ fontFamily:"var(--font-serif)",fontWeight:700,color:"#fff",fontSize:14,marginBottom:4 }}>Curated Quality</p>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.4)" }}>Every product hand-selected</p>
          </div>
          <div>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color:"rgba(200,168,75,0.85)", marginBottom:14 }}>
              <path d="M4 6h24a2 2 0 012 2v13a2 2 0 01-2 2H10l-6 4V8a2 2 0 012-2z"/>
              <line x1="10" y1="13" x2="22" y2="13"/>
              <line x1="10" y1="18" x2="17" y2="18"/>
            </svg>
            <p style={{ fontFamily:"var(--font-serif)",fontWeight:700,color:"#fff",fontSize:14,marginBottom:4 }}>Customer First</p>
            <p style={{ fontSize:12,color:"rgba(255,255,255,0.4)" }}>Support when you need it</p>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="cats-section">
        <div style={{ marginBottom:40 }}>
          <span className="stamp" style={{ display:"block",marginBottom:8 }}>Browse by Category</span>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(24px,3vw,38px)",fontWeight:900,color:"var(--ink)" }}>Shop the Collections</h2>
        </div>
        <div className="cats-grid">
          {CATEGORIES.map((cat) => {
            const c = cat as Category & { href?: string }
            return (
              <Link key={cat.slug} href={c.href ?? "/shop?category=" + cat.slug} className="cat-card">
                <Image
                  src={`/categories/${cat.slug}-static.jpg`}
                  alt={cat.name}
                  fill
                  className="cat-img-static"
                  sizes="(max-width:600px) 50vw, 1080px"
                  quality={90}
                  style={{ objectFit: "cover" }}
                />
                <Image
                  src={`/categories/${cat.slug}-kinetic.jpg`}
                  alt={cat.name + " in action"}
                  fill
                  className="cat-img-kinetic"
                  sizes="(max-width:600px) 50vw, 1080px"
                  quality={90}
                  style={{ objectFit: "cover" }}
                />
                <div className="cat-overlay">
                  <span className="stamp">{cat.name}{c.href ? " 🔒" : ""}</span>
                  <p style={{ fontFamily:"var(--font-serif)",fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:4 }}>Shop Now</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* VISUALIZE YOUR SPACE CTA */}
      <section className="visualizer-cta">
        <div className="visualizer-cta-inner">
          <span className="stamp" style={{ display:"block",marginBottom:16 }}>Visualize Your Space</span>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(28px,4vw,48px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:16 }}>
            Shop <em style={{ fontStyle:"italic",color:"var(--gold)" }}>What Fits Your Space</em>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.5)",fontSize:15,lineHeight:1.8,marginBottom:12 }}>
            Browse our full home &amp; lifestyle catalog — furniture, décor, office, patio, and more. Every piece delivers across Jamaica.
          </p>
          <p style={{ color:"rgba(200,168,75,0.6)",fontSize:13,marginBottom:32 }}>
            Filter by room type · Shop directly · Fast island-wide delivery
          </p>
          <Link href="/visualizer" className="btn-gold">Browse the Catalog</Link>
        </div>
      </section>
    </>
  )
}
