"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Post = {
  id: string
  type: "editorial" | "user_share"
  media_url: string
  media_type: "image" | "video"
  caption: string | null
  theme: string | null
  mood: string | null
  tags: string[]
  product_ids: string[]
  likes: number
  saves?: number
  created_at: string
}

type ViewMode = "tiktok" | "grid"
const MOODS = ["All", "Minimal", "Earthy", "Luxe", "Bold", "Soft", "Dark", "Coastal"]

function getInitialView(): ViewMode {
  if (typeof window === "undefined") return "tiktok"
  try { return (localStorage.getItem("inspire_view") as ViewMode) ?? "tiktok" } catch { return "tiktok" }
}

function saveView(v: ViewMode) {
  try { localStorage.setItem("inspire_view", v) } catch { /* ignore */ }
}

export default function InspireFeed() {
  const [tab, setTab] = useState<"editorial" | "user_share">("editorial")
  const [mood, setMood] = useState("All")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<ViewMode>("tiktok")
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [inviteOpen, setInviteOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setView(getInitialView()) }, [])

  const load = useCallback(async () => {
    setLoading(true)
    const qs = new URLSearchParams({ type: tab, ...(mood !== "All" && { mood }) })
    const res = await fetch(`/api/inspire?${qs}`)
    const data = await res.json()
    setPosts(data.posts ?? [])
    setLoading(false)
    setActiveIdx(0)
  }, [tab, mood])

  useEffect(() => { load() }, [load])

  function switchView(v: ViewMode) { setView(v); saveView(v) }

  async function toggleLike(post: Post) {
    const isLiked = likedIds.has(post.id)
    setLikedIds(prev => { const s = new Set(prev); isLiked ? s.delete(post.id) : s.add(post.id); return s })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: p.likes + (isLiked ? -1 : 1) } : p))
    if (!isLiked) await fetch(`/api/inspire/${post.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "like" }) })
  }

  async function toggleSave(post: Post) {
    const isSaved = savedIds.has(post.id)
    setSavedIds(prev => { const s = new Set(prev); isSaved ? s.delete(post.id) : s.add(post.id); return s })
    if (!isSaved) await fetch(`/api/inspire/${post.id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save" }) })
  }

  function sharePost(post: Post) {
    const url = `${window.location.origin}/inspire/${post.id}`
    if (navigator.share) { navigator.share({ title: post.caption ?? "Inspo", url }) }
    else { navigator.clipboard.writeText(url) }
  }

  /* Track active post in TikTok scroll via IntersectionObserver */
  useEffect(() => {
    if (view !== "tiktok" || !containerRef.current) return
    const cards = containerRef.current.querySelectorAll(".tk-card")
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveIdx(Number((e.target as HTMLElement).dataset.idx)) })
    }, { root: containerRef.current, threshold: 0.6 })
    cards.forEach(c => obs.observe(c))
    return () => obs.disconnect()
  }, [view, posts])

  return (
    <>
      <style>{`
        /* ── SHARED ── */
        .ins-wrap{max-width:1400px;margin:0 auto;padding:0 20px 80px}
        .ins-hero{text-align:center;padding:64px 24px 40px}
        .ins-hero-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:12px}
        .ins-hero-title{font-family:var(--font-serif);font-size:clamp(36px,5vw,64px);font-weight:900;color:var(--ink);line-height:1;margin-bottom:16px}
        .ins-hero-title em{color:var(--gold);font-style:italic}
        .ins-hero-sub{font-size:15px;color:var(--ink-muted);max-width:480px;margin:0 auto 32px;line-height:1.7}
        .ins-invite-btn{display:inline-flex;align-items:center;gap:8px;background:var(--ink);color:#fff;border:none;padding:12px 24px;font-family:var(--font-stamp);font-size:12px;letter-spacing:.16em;cursor:pointer;transition:background .2s}
        .ins-invite-btn:hover{background:var(--gold);color:var(--ink)}
        .ins-toolbar{display:flex;align-items:center;gap:0;border-bottom:1.5px solid var(--border);margin-bottom:28px;position:sticky;top:64px;background:rgba(250,250,248,.97);backdrop-filter:blur(10px);z-index:20;padding:0}
        .ins-tab{padding:14px 20px;font-family:var(--font-stamp);font-size:11px;letter-spacing:.16em;color:var(--ink-muted);cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;background:none;border-top:none;border-left:none;border-right:none;white-space:nowrap}
        .ins-tab.active{color:var(--ink);border-bottom-color:var(--gold)}
        .ins-spacer{flex:1}
        .ins-view-toggle{display:flex;gap:2px;padding:8px 12px;align-items:center}
        .ins-view-btn{padding:7px 10px;border:1.5px solid var(--border);background:none;cursor:pointer;color:var(--ink-muted);border-radius:8px;transition:all .2s;display:flex;align-items:center}
        .ins-view-btn.active{background:var(--ink);border-color:var(--ink);color:#fff}
        .ins-view-btn:hover:not(.active){border-color:var(--gold);color:var(--gold)}
        .ins-moods{display:flex;gap:8px;flex-wrap:nowrap;margin-bottom:28px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
        .ins-moods::-webkit-scrollbar{display:none}
        .ins-mood-pill{padding:7px 16px;border:1.5px solid var(--border);font-size:11px;font-weight:600;letter-spacing:.08em;cursor:pointer;background:none;color:var(--ink-muted);transition:all .2s;white-space:nowrap;flex-shrink:0}
        .ins-mood-pill.active{background:var(--ink);color:#fff;border-color:var(--ink)}
        .ins-mood-pill:hover{border-color:var(--gold);color:var(--gold)}
        .ins-loading{display:flex;justify-content:center;padding:80px 0}
        .ins-spinner{width:28px;height:28px;border:2px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .6s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .ins-empty{text-align:center;padding:80px 24px;color:var(--ink-muted)}
        .ins-empty-title{font-family:var(--font-serif);font-size:24px;font-weight:700;margin-bottom:8px}

        /* ── GRID VIEW ── */
        .ins-grid{columns:2;column-gap:12px}
        @media(min-width:640px){.ins-grid{columns:3}}
        @media(min-width:960px){.ins-grid{columns:4}}
        @media(min-width:1280px){.ins-grid{columns:5}}
        .ins-card{break-inside:avoid;margin-bottom:12px;position:relative;display:block;text-decoration:none;overflow:hidden;background:var(--border);cursor:pointer}
        .ins-card:hover .ins-card-overlay{opacity:1}
        .ins-card-media{width:100%;display:block;object-fit:cover}
        .ins-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,10,.85) 0%,transparent 50%);opacity:0;transition:opacity .25s;display:flex;flex-direction:column;justify-content:flex-end;padding:16px}
        .ins-card-tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}
        .ins-card-tag{font-family:var(--font-stamp);font-size:9px;letter-spacing:.14em;color:rgba(255,255,255,.7);background:rgba(255,255,255,.12);padding:3px 8px}
        .ins-card-caption{font-family:var(--font-serif);font-size:13px;font-weight:700;color:#fff;line-height:1.3}
        .ins-card-actions{display:flex;align-items:center;gap:10px;margin-top:6px}
        .ins-card-ub{position:absolute;top:10px;left:10px;background:var(--gold);color:var(--ink);font-family:var(--font-stamp);font-size:8px;letter-spacing:.12em;padding:3px 8px}

        /* ── TIKTOK VIEW ── */
        .tk-container{height:calc(100dvh - 64px);overflow-y:scroll;scroll-snap-type:y mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;position:relative}
        .tk-container::-webkit-scrollbar{display:none}
        .tk-card{height:100dvh;scroll-snap-align:start;position:relative;overflow:hidden;background:#000;display:flex;align-items:center;justify-content:center}
        .tk-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
        .tk-gradient{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.85) 0%,rgba(0,0,0,.2) 40%,transparent 70%)}
        .tk-content{position:absolute;bottom:0;left:0;right:72px;padding:24px 20px 36px}
        .tk-mood{font-family:var(--font-stamp);font-size:9px;letter-spacing:.18em;color:var(--gold);margin-bottom:6px}
        .tk-caption{font-family:var(--font-serif);font-size:clamp(16px,4vw,22px);font-weight:800;color:#fff;line-height:1.3;margin-bottom:12px}
        .tk-tags{display:flex;gap:6px;flex-wrap:wrap}
        .tk-tag{font-family:var(--font-stamp);font-size:9px;letter-spacing:.12em;color:rgba(255,255,255,.65);background:rgba(255,255,255,.12);padding:3px 10px}
        .tk-actions{position:absolute;right:12px;bottom:36px;display:flex;flex-direction:column;align-items:center;gap:20px}
        .tk-action-btn{background:none;border:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;color:#fff;padding:0}
        .tk-action-btn span{font-size:11px;font-weight:700}
        .tk-action-btn svg{filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}
        .tk-action-btn.liked svg{color:var(--gold)}
        .tk-action-btn.saved svg{color:var(--gold)}
        .tk-shop-btn{position:absolute;bottom:36px;left:20px;background:var(--gold);color:var(--dark);border:none;padding:10px 20px;font-family:var(--font-stamp);font-size:11px;letter-spacing:.14em;cursor:pointer;text-decoration:none;display:inline-block}
        .tk-progress{position:absolute;top:0;left:0;right:0;display:flex;gap:3px;padding:12px 12px 0;z-index:5}
        .tk-prog-seg{height:2px;flex:1;background:rgba(255,255,255,.25);border-radius:2px;overflow:hidden}
        .tk-prog-fill{height:100%;background:#fff;width:0%;transition:width .3s}
        .tk-prog-seg.done .tk-prog-fill{width:100%}

        /* ── INVITE MODAL ── */
        .inv-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:flex;align-items:center;justify-content:center;padding:24px}
        .inv-modal{background:#fff;width:100%;max-width:480px;padding:48px 40px;position:relative}
        .inv-modal-title{font-family:var(--font-serif);font-size:28px;font-weight:900;color:var(--ink);margin-bottom:8px}
        .inv-modal-sub{font-size:14px;color:var(--ink-muted);margin-bottom:28px;line-height:1.6}
        .inv-code{background:var(--ink);color:var(--gold);font-family:var(--font-stamp);font-size:28px;letter-spacing:.2em;text-align:center;padding:20px;margin-bottom:20px}
        .inv-modal-note{font-size:12px;color:var(--ink-muted);text-align:center;line-height:1.6}
        .inv-close{position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;font-size:20px;color:var(--ink-muted)}

        /* ── MOBILE: always tiktok on sm ── */
        @media(max-width:640px){
          .ins-view-toggle{display:none}
          .ins-wrap{padding:0}
          .ins-hero{padding:40px 20px 28px}
          .ins-toolbar{top:56px}
        }
      `}</style>

      {view === "tiktok" ? (
        /* ── TIKTOK MODE ── */
        <>
          {/* Thin sticky toolbar above the scroll */}
          <div className="ins-toolbar" style={{ padding: "0 16px" }}>
            <button className={`ins-tab${tab === "editorial" ? " active" : ""}`} onClick={() => setTab("editorial")}>Editorial</button>
            <button className={`ins-tab${tab === "user_share" ? " active" : ""}`} onClick={() => setTab("user_share")}>Community</button>
            <div className="ins-spacer" />
            <div className="ins-view-toggle">
              <button className="ins-view-btn active" title="TikTok scroll" aria-label="Scroll view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
              </button>
              <button className="ins-view-btn" title="Grid view" aria-label="Grid view" onClick={() => switchView("grid")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="ins-loading"><div className="ins-spinner" /></div>
          ) : posts.length === 0 ? (
            <div className="ins-empty" style={{ padding: "80px 24px" }}>
              <p className="ins-empty-title">Nothing here yet.</p>
              <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Editorial content coming soon.</p>
            </div>
          ) : (
            <div className="tk-container" ref={containerRef}>
              {/* Progress bar */}
              <div className="tk-progress" style={{ position: "fixed", top: 128, left: 0, right: 0, zIndex: 30, pointerEvents: "none", padding: "0 12px" }}>
                {posts.map((_, i) => (
                  <div key={i} className={`tk-prog-seg${i < activeIdx ? " done" : ""}`}>
                    <div className="tk-prog-fill" style={i === activeIdx ? { width: "50%" } : {}} />
                  </div>
                ))}
              </div>

              {posts.map((post, idx) => (
                <div key={post.id} className="tk-card" data-idx={idx}>
                  {post.media_type === "video" ? (
                    <video src={post.media_url} className="tk-media" muted loop autoPlay playsInline />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.media_url} alt={post.caption ?? "Inspire"} className="tk-media" />
                  )}
                  <div className="tk-gradient" />

                  {/* Text content */}
                  <div className="tk-content">
                    {post.mood && <p className="tk-mood">{post.mood.toUpperCase()}</p>}
                    {post.caption && <p className="tk-caption">{post.caption.slice(0, 90)}{post.caption.length > 90 ? "…" : ""}</p>}
                    {post.tags.length > 0 && (
                      <div className="tk-tags">{post.tags.slice(0, 3).map(t => <span key={t} className="tk-tag">#{t}</span>)}</div>
                    )}
                  </div>

                  {/* Right-side action bar */}
                  <div className="tk-actions">
                    <button className={`tk-action-btn${likedIds.has(post.id) ? " liked" : ""}`} onClick={() => toggleLike(post)} aria-label="Like">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill={likedIds.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                      <span>{post.likes + (likedIds.has(post.id) ? 1 : 0)}</span>
                    </button>
                    <button className={`tk-action-btn${savedIds.has(post.id) ? " saved" : ""}`} onClick={() => toggleSave(post)} aria-label="Save">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={savedIds.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                      <span>Save</span>
                    </button>
                    <button className="tk-action-btn" onClick={() => sharePost(post)} aria-label="Share">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                      <span>Share</span>
                    </button>
                    <Link href={`/inspire/${post.id}`} className="tk-action-btn" aria-label="View post">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <span>More</span>
                    </Link>
                  </div>

                  {/* Shop CTA if has products */}
                  {post.product_ids.length > 0 && (
                    <Link href={`/inspire/${post.id}`} className="tk-shop-btn">Shop This Look →</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ── GRID MODE ── */
        <div className="ins-wrap">
          <div className="ins-hero">
            <p className="ins-hero-eyebrow">Discover · Shop · Share</p>
            <h1 className="ins-hero-title">The <em>Feed.</em></h1>
            <p className="ins-hero-sub">Curated editorial drops and community inspo — all shoppable.</p>
            <button className="ins-invite-btn" onClick={() => setInviteOpen(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              Invite Friends · Get 10% Off
            </button>
          </div>

          <div className="ins-toolbar">
            <button className={`ins-tab${tab === "editorial" ? " active" : ""}`} onClick={() => setTab("editorial")}>Editorial</button>
            <button className={`ins-tab${tab === "user_share" ? " active" : ""}`} onClick={() => setTab("user_share")}>Community Share</button>
            <div className="ins-spacer" />
            <div className="ins-view-toggle">
              <button className="ins-view-btn" title="Scroll view" aria-label="Scroll view" onClick={() => switchView("tiktok")}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/></svg>
              </button>
              <button className="ins-view-btn active" title="Grid view" aria-label="Grid view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
              </button>
            </div>
            <Link href="/inspire/create" style={{ padding: "14px 16px", fontFamily: "var(--font-stamp)", fontSize: 11, letterSpacing: ".14em", color: "var(--gold)", textDecoration: "none", whiteSpace: "nowrap" }}>+ Share Yours</Link>
          </div>

          <div className="ins-moods">
            {MOODS.map(m => (
              <button key={m} className={`ins-mood-pill${mood === m ? " active" : ""}`} onClick={() => setMood(m)}>{m}</button>
            ))}
          </div>

          {loading ? (
            <div className="ins-loading"><div className="ins-spinner" /></div>
          ) : posts.length === 0 ? (
            <div className="ins-empty">
              <p className="ins-empty-title">Nothing here yet.</p>
              <p>{tab === "user_share" ? "Be the first to share your inspo." : "Editorial content coming soon."}</p>
            </div>
          ) : (
            <div className="ins-grid">
              {posts.map(post => (
                <Link key={post.id} href={`/inspire/${post.id}`} className="ins-card">
                  {post.media_type === "video" ? (
                    <video src={post.media_url} className="ins-card-media" muted loop autoPlay playsInline style={{ maxHeight: 600 }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.media_url} alt={post.caption ?? "Inspire"} className="ins-card-media" loading="lazy" />
                  )}
                  {post.type === "user_share" && <span className="ins-card-ub">Community</span>}
                  <div className="ins-card-overlay">
                    {post.tags.length > 0 && (
                      <div className="ins-card-tags">{post.tags.slice(0, 2).map(t => <span key={t} className="ins-card-tag">{t}</span>)}</div>
                    )}
                    {post.caption && <p className="ins-card-caption">{post.caption.slice(0, 60)}{post.caption.length > 60 ? "…" : ""}</p>}
                    <div className="ins-card-actions">
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,.8)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                        {post.likes}
                      </span>
                      {post.product_ids.length > 0 && <span style={{ fontFamily: "var(--font-stamp)", fontSize: 9, letterSpacing: ".14em", color: "var(--gold)", marginLeft: "auto" }}>Shop →</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite modal */}
      {inviteOpen && (
        <div className="inv-backdrop" onClick={() => setInviteOpen(false)}>
          <div className="inv-modal" onClick={e => e.stopPropagation()}>
            <button className="inv-close" onClick={() => setInviteOpen(false)}>&#x2715;</button>
            <p style={{ fontFamily: "var(--font-stamp)", fontSize: 10, letterSpacing: ".2em", color: "var(--gold)", marginBottom: 10 }}>SHARE THE VIBE</p>
            <h2 className="inv-modal-title">Give 10% Off.<br />Get 10% Off.</h2>
            <p className="inv-modal-sub">Share your invite code with friends. When they sign up and place their first order, you both get 10% off.</p>
            <div className="inv-code">MYJOIN10</div>
            <button onClick={() => { navigator.share?.({ title: "Shop Mine & Yours Shop", text: "Use my code MYJOIN10 for 10% off!", url: "https://mineandyoursshop.online/account/signup?ref=MYJOIN10" }) ?? navigator.clipboard.writeText("MYJOIN10") }} style={{ width: "100%", padding: 14, background: "var(--ink)", color: "#fff", border: "none", fontFamily: "var(--font-stamp)", fontSize: 12, letterSpacing: ".16em", cursor: "pointer", marginBottom: 16 }}>
              Share Code
            </button>
            <p className="inv-modal-note">New members: use code at checkout for 10% off your first order.</p>
          </div>
        </div>
      )}
    </>
  )
}