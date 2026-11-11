"use client"
import Link from "next/link"

interface Post {
  id: string; slug: string; title: string; excerpt: string | null
  cover_image: string | null; content: string | null; tags: string[] | null
  author: string | null; published_at: string | null
}

function sharePost(post: Post) {
  const url = typeof window !== "undefined" ? window.location.href : ""
  if (navigator.share) {
    navigator.share({ title: post.title, text: post.excerpt ?? post.title, url })
  } else {
    navigator.clipboard.writeText(url)
    alert("Link copied!")
  }
}

export default function BlogPostClient({ post }: { post: Post }) {
  const dateStr = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})
    : null

  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://mineandyoursshop.online/blog/${post.slug}`
  const waShare = `https://wa.me/?text=${encodeURIComponent(post.title + " " + shareUrl)}`
  const twShare = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const pinShare = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(post.title)}${post.cover_image ? `&media=${encodeURIComponent(post.cover_image)}` : ""}`

  return (
    <>
      <style>{`
        .bp-bc{max-width:800px;margin:0 auto;padding:24px 24px 0;display:flex;align-items:center;gap:8px;font-size:11px;color:var(--ink-faint)}
        .bp-bc a{color:var(--ink-muted);text-decoration:none}.bp-bc a:hover{color:var(--gold)}
        .bp-wrap{max-width:800px;margin:0 auto;padding:40px 24px 80px}
        .bp-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
        .bp-tag{font-family:var(--font-stamp);font-size:9px;letter-spacing:.18em;color:var(--gold)}
        .bp-title{font-family:var(--font-serif);font-size:clamp(28px,4vw,46px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:16px}
        .bp-meta{font-size:12px;color:var(--ink-faint);margin-bottom:32px;display:flex;gap:16px}
        .bp-cover{width:100%;aspect-ratio:16/9;object-fit:cover;margin-bottom:40px;display:block}
        .bp-body{font-size:16px;line-height:1.9;color:var(--ink-muted);white-space:pre-wrap}
        .bp-body h2{font-family:var(--font-serif);font-size:24px;font-weight:800;color:var(--ink);margin:40px 0 16px}
        .bp-body h3{font-family:var(--font-serif);font-size:19px;font-weight:700;color:var(--ink);margin:28px 0 10px}
        .bp-share{margin-top:48px;padding-top:32px;border-top:1px solid var(--border)}
        .bp-share-title{font-family:var(--font-stamp);font-size:11px;letter-spacing:.18em;color:var(--ink-muted);margin-bottom:16px}
        .bp-share-btns{display:flex;gap:12px;flex-wrap:wrap}
        .bp-share-btn{padding:10px 18px;border:1.5px solid var(--border);font-size:12px;font-weight:600;text-decoration:none;color:var(--ink);transition:all .2s;cursor:pointer;background:none}
        .bp-share-btn:hover{background:var(--ink);color:#fff;border-color:var(--ink)}
        .bp-back{margin-top:48px}
        .bp-back a{font-size:13px;color:var(--gold);text-decoration:none;font-weight:600}
      `}</style>

      <nav className="bp-bc">
        <Link href="/">Home</Link><span>/</span>
        <Link href="/blog">Journal</Link><span>/</span>
        <span style={{color:"var(--ink)"}}>{post.title}</span>
      </nav>

      <div className="bp-wrap">
        {post.tags?.length ? (
          <div className="bp-tags">{post.tags.map(t => <span key={t} className="bp-tag">{t}</span>)}</div>
        ) : null}
        <h1 className="bp-title">{post.title}</h1>
        <div className="bp-meta">
          {post.author && <span>By {post.author}</span>}
          {dateStr && <span>{dateStr}</span>}
        </div>
        {post.cover_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_image} alt={post.title} className="bp-cover" />
        )}
        {post.content && <div className="bp-body">{post.content}</div>}

        <div className="bp-share">
          <p className="bp-share-title">Share This Story</p>
          <div className="bp-share-btns">
            <a href={waShare} target="_blank" rel="noopener" className="bp-share-btn">WhatsApp</a>
            <a href={twShare} target="_blank" rel="noopener" className="bp-share-btn">X / Twitter</a>
            <a href={fbShare} target="_blank" rel="noopener" className="bp-share-btn">Facebook</a>
            <a href={pinShare} target="_blank" rel="noopener" className="bp-share-btn">Pinterest</a>
            <button className="bp-share-btn" onClick={() => sharePost(post)}>Copy Link</button>
          </div>
        </div>
        <div className="bp-back"><Link href="/blog">&larr; Back to Journal</Link></div>
      </div>
    </>
  )
}