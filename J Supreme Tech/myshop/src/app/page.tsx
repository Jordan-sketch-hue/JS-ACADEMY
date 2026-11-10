export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"

export const metadata: Metadata = {
  title: "MyShop — Premium Curated Store | Shop Online Jamaica",
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
  { name: "Adults Only · 18+",      slug: "adults", href: "/adults" },
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
        .hero-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,0.72) 40%,rgba(0,0,0,0.2))}
        .hero-content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:0 clamp(24px,6vw,120px);max-width:720px}
        .hero-eyebrow{font-family:var(--font-stamp);font-size:11px;letter-spacing:.22em;color:var(--gold);margin-bottom:20px}
        .hero-title{font-family:var(--font-serif);font-size:clamp(38px,5.5vw,72px);font-weight:900;line-height:1.05;color:#fff;margin-bottom:28px}
        .hero-title em{font-style:italic;color:var(--gold)}
        .hero-actions{display:flex;gap:16px;flex-wrap:wrap}
        .stories-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px 0}
        .story-card{position:relative;aspect-ratio:3/4;overflow:hidden;cursor:pointer;text-decoration:none}
        .story-card img{object-fit:cover;transition:transform 0.6s ease}
        .story-card:hover img{transform:scale(1.04)}
        .story-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.65) 40%,transparent)}
        .story-text{position:absolute;bottom:0;left:0;right:0;padding:28px 24px}
        .arrivals-section{background:#F5F4F0;padding:72px 24px}
        .arrivals-inner{max-width:1280px;margin:0 auto}
        .section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px}
        .arrivals-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
        .arrival-card{background:var(--surface);border:1px solid var(--border);overflow:hidden;transition:all 0.3s;text-decoration:none}
        .arrival-card:hover{border-color:rgba(200,168,75,0.4);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.08)}
        .arrival-img{position:relative;aspect-ratio:1;overflow:hidden;background:#F5F4F0}
        .arrival-img img{object-fit:cover;transition:transform 0.6s}
        .arrival-card:hover .arrival-img img{transform:scale(1.04)}
        .arrival-body{padding:16px 18px 20px}
        .cats-section{padding:64px 24px;max-width:1280px;margin:0 auto}
        .cats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        .cat-card{position:relative;aspect-ratio:3/4;overflow:hidden;background:var(--dark);text-decoration:none}
        .cat-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:20px;background:linear-gradient(to top,rgba(0,0,0,0.7),transparent)}
        .visualizer-cta{background:var(--dark);padding:80px 24px;text-align:center}
        .visualizer-cta-inner{max-width:640px;margin:0 auto}
        @media(max-width:900px){.stories-grid,.arrivals-grid{grid-template-columns:repeat(2,1fr)}.cats-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:500px){.stories-grid{grid-template-columns:1fr}.arrivals-grid{grid-template-columns:1fr}}
      ` }} />

      {/* HERO */}
      <section className="hero">
        {heroProduct?.image_url ? (
          <Image src={heroProduct.image_url} alt="Featured product" fill className="hero-img" priority sizes="100vw" />
        ) : (
          <div style={{ position:"absolute",inset:0,background:"linear-gradient(135deg,#0D0D0D,#1a1a1a)" }} />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">Premium Curated Store</p>
          <h1 className="hero-title">Find the Things<br /><em>Worth Having.</em></h1>
          <div className="hero-actions">
            <Link href="/shop" className="btn-primary">Shop All Products</Link>
            <Link href="/shop?category=jewelry" className="btn-outline-white">Explore Jewelry</Link>
          </div>
        </div>
      </section>

      {/* EDITORIAL STORIES */}
      {stories.length > 0 && (
        <section className="stories-grid">
          {stories.map(p => (
            <Link key={p.id} href={"/shop/" + p.slug} className="story-card">
              {p.image_url && (
                <Image src={p.image_url} alt={p.name} fill sizes="33vw" />
              )}
              <div className="story-overlay" />
              <div className="story-text">
                {p.category && <span className="stamp" style={{ display:"block",marginBottom:8 }}>{p.category}</span>}
                <p style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(15px,2vw,20px)",fontWeight:800,color:"#fff",lineHeight:1.2 }}>{p.name}</p>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
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
              {newArrivals.map(p => (
                <Link key={p.id} href={"/shop/" + p.slug} className="arrival-card">
                  <div className="arrival-img">
                    {p.image_url && <Image src={p.image_url} alt={p.name} fill sizes="(max-width:900px) 50vw,33vw" />}
                  </div>
                  <div className="arrival-body">
                    {p.category && <span className="stamp" style={{ display:"block",marginBottom:6 }}>{p.category}</span>}
                    <p style={{ fontFamily:"var(--font-serif)",fontSize:16,fontWeight:700,color:"var(--ink)",marginBottom:8,lineHeight:1.3 }}>{p.name}</p>
                    <p style={{ fontFamily:"var(--font-serif)",fontSize:18,fontWeight:900,color:"var(--ink)" }}>{"J$" + (p.price_jmd/100).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CATEGORY GRID */}
      <section className="cats-section">
        <div style={{ marginBottom:40 }}>
          <span className="stamp" style={{ display:"block",marginBottom:8 }}>Browse by Category</span>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(24px,3vw,38px)",fontWeight:900,color:"var(--ink)" }}>Shop the Collections</h2>
        </div>
        <div className="cats-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={(cat as {slug:string;href?:string}).href ?? "/shop?category=" + cat.slug} className="cat-card">
              <div className="cat-overlay">
                <span className="stamp">{cat.name}{(cat as {slug:string;href?:string}).href ? " 🔒" : ""}</span>
                <p style={{ fontFamily:"var(--font-serif)",fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4 }}>Shop Now</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI VISUALIZER CTA */}
      <section className="visualizer-cta">
        <div className="visualizer-cta-inner">
          <span className="stamp" style={{ display:"block",marginBottom:16 }}>AI Room Visualizer</span>
          <h2 style={{ fontFamily:"var(--font-serif)",fontSize:"clamp(28px,4vw,48px)",fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:16 }}>
            See It In <em style={{ fontStyle:"italic",color:"var(--gold)" }}>Your Space</em>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.5)",fontSize:15,lineHeight:1.8,marginBottom:32 }}>
            Generate a room scene with our AI — every item you see is purchasable directly from the store.
          </p>
          <Link href="/visualizer" className="btn-gold">Try the Visualizer</Link>
        </div>
      </section>
    </>
  )
}