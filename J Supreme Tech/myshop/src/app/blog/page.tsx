export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Journal — Style, Home & Life | Mine & Yours Shop",
  description: "Editorial stories, style guides, home inspiration and curated picks from the Mine & Yours team. Updated weekly.",
  openGraph: {
    title: "Journal | Mine & Yours Shop",
    description: "Editorial stories, style guides, and curated picks.",
    type: "website",
  },
}

async function getPosts() {
  const { data } = await supabase
    .from("myshop_blog_posts")
    .select("id, slug, title, excerpt, cover_image, tags, author, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(40)
  return data ?? []
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <style>{`
        .blog-wrap{max-width:1280px;margin:0 auto;padding:60px 24px 80px}
        .blog-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:12px}
        .blog-title{font-family:var(--font-serif);font-size:clamp(32px,5vw,56px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:8px}
        .blog-sub{font-size:15px;color:var(--ink-muted);margin-bottom:48px;max-width:560px;line-height:1.7}
        .blog-divider{width:40px;height:3px;background:var(--gold);margin-bottom:48px}
        .blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
        @media(max-width:900px){.blog-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:580px){.blog-grid{grid-template-columns:1fr}}
        .blog-card{display:block;text-decoration:none;color:inherit}
        .blog-card:hover .bc-title{color:var(--gold)}
        .bc-img{aspect-ratio:16/9;overflow:hidden;background:#F5F4F0;margin-bottom:20px}
        .bc-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease}
        .blog-card:hover .bc-img img{transform:scale(1.04)}
        .bc-tags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
        .bc-tag{font-family:var(--font-stamp);font-size:9px;letter-spacing:.18em;color:var(--gold)}
        .bc-title{font-family:var(--font-serif);font-size:20px;font-weight:800;color:var(--ink);line-height:1.25;margin-bottom:10px;transition:color .2s}
        .bc-excerpt{font-size:13px;color:var(--ink-muted);line-height:1.7;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
        .bc-meta{margin-top:12px;font-size:11px;color:var(--ink-faint);display:flex;gap:12px}
        .blog-empty{text-align:center;padding:80px 24px;color:var(--ink-muted)}
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context":"https://schema.org","@type":"Blog",
        "name":"Mine & Yours Journal",
        "description":"Editorial stories, style guides and curated picks from Mine & Yours Shop.",
        "url":"https://mineandyoursshop.online/blog",
        "publisher":{"@type":"Organization","name":"Mine & Yours Shop","url":"https://mineandyoursshop.online"}
      })}} />

      <div className="blog-wrap">
        <p className="blog-eyebrow">The Journal</p>
        <h1 className="blog-title">Stories Worth Reading</h1>
        <p className="blog-sub">Style guides, home inspiration, and curated editorial from the Mine & Yours team.</p>
        <div className="blog-divider" />

        {posts.length === 0 ? (
          <div className="blog-empty">
            <p style={{ fontFamily: "var(--font-serif)", fontSize: 24, marginBottom: 8 }}>Coming Soon</p>
            <p style={{ fontSize: 14 }}>The first editorial drops shortly. Check back soon.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card">
                <div className="bc-img">
                  {post.cover_image
                    ? <img src={post.cover_image} alt={post.title} loading="lazy" />
                    : <div style={{ width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,color:"var(--border)" }}>&#128214;</div>
                  }
                </div>
                {post.tags?.length > 0 && (
                  <div className="bc-tags">
                    {post.tags.slice(0,3).map((t: string) => <span key={t} className="bc-tag">{t}</span>)}
                  </div>
                )}
                <h2 className="bc-title">{post.title}</h2>
                {post.excerpt && <p className="bc-excerpt">{post.excerpt}</p>}
                <div className="bc-meta">
                  {post.author && <span>{post.author}</span>}
                  {post.published_at && <span>{new Date(post.published_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}