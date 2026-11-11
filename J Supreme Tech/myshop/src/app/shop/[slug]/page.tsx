export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { AddToCartButton } from "./AddToCartButton"

async function getProduct(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from("myshop_products").select("*")
    .eq("slug", slug).eq("active", true).single()
  return data as Product | null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Product Not Found" }
  const price = "J$" + (product.price_jmd / 100).toLocaleString()
  return {
    title: product.name + " - " + price,
    description: product.description ?? ("Shop " + product.name + " at MyShop. " + price),
    openGraph: {
      title: product.name + " - " + price + " | MyShop",
      description: product.description ?? ("Shop " + product.name + " at MyShop."),
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 800, alt: product.name }] : [],
      type: "website",
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const priceJmd = "J$" + (product.price_jmd / 100).toLocaleString()
  const priceUsd = "~$" + ((product.price_jmd / 100) / 158).toFixed(2) + " USD"
  const catHref = "/shop?category=" + (product.category ?? "")

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .pdp-layout{max-width:1280px;margin:0 auto;padding:56px 24px 80px;display:grid;grid-template-columns:1.1fr 1fr;gap:64px;align-items:start}
        .pdp-img-wrap{position:relative;aspect-ratio:1;overflow:hidden;background:#F5F4F0}
        .pdp-img{object-fit:cover}
        .pdp-cat{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:16px;display:block}
        .pdp-title{font-family:var(--font-serif);font-size:clamp(28px,3vw,42px);font-weight:800;line-height:1.1;color:var(--ink);margin-bottom:24px}
        .pdp-price-jmd{font-family:var(--font-serif);font-size:34px;font-weight:900;color:var(--ink);line-height:1;margin-bottom:4px}
        .pdp-price-usd{font-size:13px;color:var(--ink-faint)}
        .pdp-divider{width:100%;height:1px;background:var(--border);margin:24px 0}
        .pdp-desc{font-size:15px;color:var(--ink-muted);line-height:1.8;margin-bottom:32px}
        .pdp-stock{font-size:12px;font-weight:600;letter-spacing:.08em;color:#3A7D44;margin-top:16px}
        .pdp-meta{margin-top:32px;padding-top:24px;border-top:1px solid var(--border)}
        .pdp-meta-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border);font-size:12px}
        .pdp-meta-key{color:var(--ink-faint);letter-spacing:.08em;text-transform:uppercase;font-size:10px}
        .pdp-meta-val{color:var(--ink);font-weight:600}
        .pdp-bc{max-width:1280px;margin:0 auto;padding:20px 24px 0;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--ink-faint)}
        .pdp-bc a{color:var(--ink-muted);text-decoration:none}
        .pdp-bc a:hover{color:var(--gold)}
        @media(max-width:768px){.pdp-layout{grid-template-columns:1fr;gap:32px}}
      ` }} />

      <nav className="pdp-bc" aria-label="Breadcrumb">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/shop">Shop</Link><span>/</span>
        <span style={{ color: "var(--ink)" }}>{product.name}</span>
      </nav>

      <div className="pdp-layout">
        <div className="pdp-img-wrap">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="pdp-img" sizes="(max-width: 768px) 100vw, 55vw" priority />
          ) : (
            <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,color:"var(--border)" }}>&#128717;</div>
          )}
        </div>

        <div style={{ paddingTop: 8 }}>
          {product.category && <span className="pdp-cat">{product.category}</span>}
          <h1 className="pdp-title">{product.name}</h1>
          <div style={{ marginBottom: 24 }}>
            <p className="pdp-price-jmd">{priceJmd}</p>
            <p className="pdp-price-usd">{priceUsd}</p>
          </div>
          <div className="pdp-divider" />
          {product.description && <p className="pdp-desc">{product.description}</p>}
          <AddToCartButton product={product} />
          {product.stock > 0 && <p className="pdp-stock">In Stock ({product.stock} available)</p>}
          <div className="pdp-meta">
            <div className="pdp-meta-row"><span className="pdp-meta-key">Delivery</span><span className="pdp-meta-val">Worldwide</span></div>
            <div className="pdp-meta-row"><span className="pdp-meta-key">Returns</span><span className="pdp-meta-val">14-day hassle-free</span></div>
            {product.category && (
              <div className="pdp-meta-row">
                <span className="pdp-meta-key">Category</span>
                <Link href={catHref} style={{ color:"var(--gold)",textDecoration:"none",fontWeight:600,fontSize:12 }}>{product.category}</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"Product",
        "name":product.name,"description":product.description,"image":product.image_url,
        "sku":product.id,"category":product.category,
        "offers":{"@type":"Offer","priceCurrency":"JMD","price":product.price_jmd/100,
          "availability":product.stock>0?"https://schema.org/InStock":"https://schema.org/OutOfStock",
          "seller":{"@type":"Organization","name":"MyShop"}}
      })}} />
    </>
  )
}