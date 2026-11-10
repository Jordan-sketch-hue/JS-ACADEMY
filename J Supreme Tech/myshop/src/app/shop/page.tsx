export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { CategoryDropdown } from "@/components/CategoryDropdown"

export const metadata: Metadata = {
  title: "Shop All Products — Premium Curated Store",
  description: "Browse our full collection of premium curated products — jewelry, home decor, beauty, electronics, fitness gear and more. Best prices, fast Jamaica delivery.",
  keywords: ["shop online jamaica", "buy online", "premium products", "jewelry shop", "home decor store", "electronics store jamaica"],
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
]

async function getProducts(category?: string): Promise<Product[]> {
  try {
    let query = supabase.from("myshop_products").select("*").eq("active", true).order("created_at", { ascending: false })
    if (category) query = query.eq("category", category)
    const { data } = await query
    return (data ?? []) as Product[]
  } catch {
    return []
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const products = await getProducts(category)
  const activeCat = CATEGORIES.find(c => c.slug === category)
  const bannerImg = activeCat ? `/categories/${activeCat.slug}-static.jpg` : "/hero/hero-1.jpg"

  return (
    <>
      <style>{`
        .shop-layout {
          max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 220px 1fr; gap: 48px;
          padding-top: 56px; padding-bottom: 80px;
        }
        .shop-sidebar { position: sticky; top: 80px; height: fit-content; }
        .shop-sidebar-title {
          font-family: var(--font-stamp); font-size: 10px; letter-spacing: 0.22em;
          color: var(--gold); margin-bottom: 20px; display: block;
        }
        .shop-cat-list { list-style: none; margin: 0; padding: 0; }
        .shop-cat-item a {
          display: block; padding: 10px 0;
          font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
          color: var(--ink-muted); text-decoration: none;
          border-bottom: 1px solid var(--border); transition: all 0.2s;
        }
        .shop-cat-item a:hover, .shop-cat-item a.active {
          color: var(--gold); border-bottom-color: var(--gold); padding-left: 8px;
        }
        .shop-cat-item a.active { font-weight: 700; color: var(--ink); }
        .shop-main {}
        .shop-header {
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 36px; padding-bottom: 20px; border-bottom: 1px solid var(--border);
        }
        .shop-count { font-size: 12px; color: var(--ink-muted); letter-spacing: 0.06em; }
        .shop-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        /* category dropdown: desktop hidden, mobile visible */
        .shop-cat-dropdown-wrap {
          display: none; padding: 16px 20px 0;
        }
        .shop-cat-select {
          width: 100%; padding: 12px 16px;
          font-family: var(--font-sans); font-size: 12px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          background: var(--surface); color: var(--ink);
          border: 1px solid var(--border); border-radius: 0;
          appearance: none; -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 14px center;
          cursor: pointer;
        }
        .shop-cat-select:focus { outline: none; border-color: var(--gold); }
        /* banner */
        .shop-hero-banner {
          position: relative; height: 300px; overflow: hidden;
          background: var(--dark);
        }
        .shop-hero-img { object-fit: cover; object-position: center; }
        .shop-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.25));
        }
        .shop-hero-inner {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          justify-content: center; padding: 0 clamp(24px,5vw,80px);
        }
        @media (max-width: 900px) {
          .shop-layout { grid-template-columns: 1fr; padding-top: 32px; }
          .shop-sidebar { position: static; display: none; }
          .shop-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .shop-cat-dropdown-wrap { display: block; }
          .shop-hero-banner { height: 220px; }
        }
        @media (max-width: 500px) {
          .shop-grid { grid-template-columns: 1fr; }
          .shop-hero-banner { height: 180px; }
        }
      `}</style>

      {/* Full-bleed category banner */}
      <div className="shop-hero-banner">
        <Image
          src={bannerImg}
          alt={activeCat ? activeCat.name : "Shop All"}
          fill
          className="shop-hero-img"
          priority
          sizes="100vw"
        />
        <div className="shop-hero-overlay" />
        <div className="shop-hero-inner">
          <span className="stamp" style={{ display: "block", marginBottom: 10 }}>
            {activeCat ? "Now browsing" : "All Categories"}
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(26px,4vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1 }}>
            {activeCat ? activeCat.name : "Shop Everything"}
          </h1>
          {!activeCat && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 10, maxWidth: 380 }}>
              {CATEGORIES.length} curated categories · Fast Jamaica delivery
            </p>
          )}
        </div>
      </div>

      {/* Mobile-only category dropdown (desktop uses sidebar) */}
      <div className="shop-cat-dropdown-wrap">
        <CategoryDropdown categories={CATEGORIES} current={category} />
      </div>

      <div className="shop-layout">
        {/* Amazon-style sticky sidebar — desktop only */}
        <aside className="shop-sidebar">
          <span className="shop-sidebar-title">Browse Categories</span>
          <ul className="shop-cat-list">
            <li className="shop-cat-item">
              <Link href="/shop" className={!category ? "active" : ""}>All Products</Link>
            </li>
            {CATEGORIES.map(c => (
              <li key={c.slug} className="shop-cat-item">
                <Link href={`/shop?category=${c.slug}`} className={category === c.slug ? "active" : ""}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product grid */}
        <div className="shop-main">
          <div className="shop-header">
            <div>
              <span className="label">Showing</span>
              <p className="shop-count" style={{ marginTop: 4 }}>{products.length} product{products.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="shop-grid">{Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}</div>
          ) : (
            <div className="shop-grid">{products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}</div>
          )}
        </div>
      </div>
    </>
  )
}
