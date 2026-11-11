"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

type Post = { id: string; media_url: string; media_type: string; caption: string | null; theme: string | null; mood: string | null; tags: string[]; product_ids: string[]; likes: number; saves: number; type: string }
type Product = { id: string; name: string; slug: string; price_jmd: number; image_url: string | null }

const SHARE_PLATFORMS = [
  { label: "WhatsApp", color: "#25D366", icon: "W", href: (u: string, t: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(t + " " + u)}` },
  { label: "X / Twitter", color: "#000", icon: "𝕏", href: (u: string, t: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}` },
  { label: "Facebook", color: "#1877F2", icon: "f", href: (u: string) => `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { label: "Pinterest", color: "#E60023", icon: "P", href: (u: string, t: string, img: string) => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(u)}&media=${encodeURIComponent(img)}&description=${encodeURIComponent(t)}` },
]

export default function PostClient({ post, products }: { post: Post; products: Product[] }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [saved, setSaved] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://mineandyoursshop.online/inspire/${post.id}`
  const shareText = post.caption ?? "Check out this editorial drop from Mine & Yours Shop!"

  async function handleLike() {
    if (liked) return
    setLiked(true); setLikes(l => l + 1)
    await fetch(`/api/inspire/${post.id}`, { method: "POST", body: JSON.stringify({ action: "like" }), headers: { "Content-Type": "application/json" } })
  }

  async function handleSave() {
    setSaved(s => !s)
    await fetch(`/api/inspire/${post.id}`, { method: "POST", body: JSON.stringify({ action: "save" }), headers: { "Content-Type": "application/json" } })
  }

  function nativeShare() {
    if (navigator.share) { navigator.share({ title: shareText, url: pageUrl }); return }
    setShareOpen(true)
  }

  return (
    <>
      <style>{`
        .pst-wrap{max-width:1180px;margin:0 auto;padding:40px 24px 80px;display:grid;grid-template-columns:1fr 420px;gap:56px;align-items:start}
        .pst-media{position:sticky;top:84px}
        .pst-media img,.pst-media video{width:100%;display:block;background:var(--border)}
        .pst-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:12px}
        .pst-caption{font-family:var(--font-serif);font-size:clamp(22px,3vw,32px);font-weight:900;color:var(--ink);line-height:1.2;margin-bottom:16px}
        .pst-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
        .pst-tag{font-size:11px;font-weight:600;color:var(--ink-muted);border:1px solid var(--border);padding:5px 12px;text-decoration:none;transition:all .2s}
        .pst-tag:hover{border-color:var(--gold);color:var(--gold)}
        .pst-actions{display:flex;align-items:center;gap:12px;margin-bottom:36px}
        .pst-action-btn{display:flex;align-items:center;gap:6px;padding:11px 18px;border:1.5px solid var(--border);background:none;cursor:pointer;font-family:var(--font-sans);font-size:12px;font-weight:600;color:var(--ink);transition:all .2s}
        .pst-action-btn:hover{border-color:var(--gold);color:var(--gold)}
        .pst-action-btn.liked{background:var(--ink);color:#fff;border-color:var(--ink)}
        .pst-action-btn.saved{background:var(--gold);color:var(--ink);border-color:var(--gold)}
        .pst-divider{height:1px;background:var(--border);margin:28px 0}
        .pst-products-title{font-family:var(--font-stamp);font-size:10px;letter-spacing:.2em;color:var(--ink-muted);margin-bottom:16px}
        .pst-products{display:flex;flex-direction:column;gap:12px}
        .pst-product{display:flex;align-items:center;gap:14px;text-decoration:none;color:var(--ink);border:1.5px solid var(--border);padding:12px;transition:border-color .2s}
        .pst-product:hover{border-color:var(--gold)}
        .pst-product-img{width:60px;height:60px;object-fit:cover;background:var(--border);flex-shrink:0}
        .pst-product-name{font-family:var(--font-serif);font-size:14px;font-weight:700;line-height:1.3;margin-bottom:4px}
        .pst-product-price{font-size:12px;color:var(--gold);font-weight:700}
        .pst-product-cta{margin-left:auto;font-family:var(--font-stamp);font-size:9px;letter-spacing:.14em;color:var(--gold)}
        .shr-panel{background:#fff;border:1.5px solid var(--border);padding:24px;margin-top:24px}
        .shr-title{font-family:var(--font-stamp);font-size:10px;letter-spacing:.18em;margin-bottom:16px;color:var(--ink-muted)}
        .shr-btns{display:flex;gap:10px;flex-wrap:wrap}
        .shr-btn{padding:10px 16px;border:none;cursor:pointer;font-family:var(--font-sans);font-size:12px;font-weight:600;color:#fff;text-decoration:none;display:inline-block;transition:opacity .2s}
        .shr-btn:hover{opacity:.85}
        @media(max-width:768px){.pst-wrap{grid-template-columns:1fr;gap:28px}.pst-media{position:static}}
      `}</style>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px 0" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--ink-muted)" }}>
          <Link href="/" style={{ color: "var(--ink-muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/inspire" style={{ color: "var(--ink-muted)", textDecoration: "none" }}>Inspire</Link>
          <span>/</span>
          <span style={{ color: "var(--ink)" }}>{post.caption?.slice(0, 30) ?? "Post"}</span>
        </nav>
      </div>

      <div className="pst-wrap">
        <div className="pst-media">
          {post.media_type === "video" ? (
            <video src={post.media_url} controls muted autoPlay loop playsInline />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.media_url} alt={post.caption ?? "Inspire"} />
          )}
        </div>

        <div>
          <p className="pst-eyebrow">{post.type === "editorial" ? "Editorial Drop" : "Community Share"}{post.mood ? ` · ${post.mood}` : ""}</p>
          {post.caption && <h1 className="pst-caption">{post.caption}</h1>}

          {post.tags.length > 0 && (
            <div className="pst-tags">
              {post.tags.map(t => (
                <Link key={t} href={`/inspire?tag=${encodeURIComponent(t)}`} className="pst-tag">#{t}</Link>
              ))}
            </div>
          )}

          <div className="pst-actions">
            <button className={`pst-action-btn${liked ? " liked" : ""}`} onClick={handleLike}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              {likes}
            </button>
            <button className={`pst-action-btn${saved ? " saved" : ""}`} onClick={handleSave}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
              {saved ? "Saved" : "Save"}
            </button>
            <button className="pst-action-btn" onClick={nativeShare}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>

          {shareOpen && (
            <div className="shr-panel">
              <p className="shr-title">Share to</p>
              <div className="shr-btns">
                {SHARE_PLATFORMS.map(p => (
                  <a key={p.label} href={p.href(pageUrl, shareText, post.media_url)} target="_blank" rel="noopener noreferrer" className="shr-btn" style={{ background: p.color }}>{p.label}</a>
                ))}
              </div>
            </div>
          )}

          {products.length > 0 && (
            <>
              <div className="pst-divider" />
              <p className="pst-products-title">Shop This Look</p>
              <div className="pst-products">
                {products.map(p => (
                  <Link key={p.id} href={`/shop/${p.slug}`} className="pst-product">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} className="pst-product-img" />
                    ) : <div className="pst-product-img" />}
                    <div>
                      <p className="pst-product-name">{p.name}</p>
                      <p className="pst-product-price">J${(p.price_jmd / 100).toLocaleString()}</p>
                    </div>
                    <span className="pst-product-cta">Shop →</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          <div className="pst-divider" />
          <Link href="/inspire" style={{ fontFamily: "var(--font-stamp)", fontSize: 11, letterSpacing: ".14em", color: "var(--gold)", textDecoration: "none" }}>← Back to Feed</Link>
        </div>
      </div>
    </>
  )
}