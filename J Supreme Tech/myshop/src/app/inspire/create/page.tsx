"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const MOODS = ["Minimal", "Earthy", "Luxe", "Bold", "Soft", "Dark", "Coastal"]

export default function CreatePostPage() {
  const router = useRouter()
  const [form, setForm] = useState({ media_url: "", media_type: "image", caption: "", mood: "", tags: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.media_url) { setError("Please add an image or video URL."); return }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const res = await fetch("/api/inspire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "user_share",
        user_id: user?.id ?? null,
        media_url: form.media_url,
        media_type: form.media_type,
        caption: form.caption || null,
        mood: form.mood || null,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        published: false,
      }),
    })
    setLoading(false)
    if (!res.ok) { setError("Something went wrong. Try again."); return }
    router.push("/inspire?tab=user_share&submitted=1")
  }

  return (
    <>
      <style>{`
        .crt-wrap{max-width:640px;margin:0 auto;padding:60px 24px 80px}
        .crt-eyebrow{font-family:var(--font-stamp);font-size:10px;letter-spacing:.22em;color:var(--gold);margin-bottom:12px}
        .crt-title{font-family:var(--font-serif);font-size:clamp(28px,4vw,38px);font-weight:900;color:var(--ink);line-height:1.1;margin-bottom:8px}
        .crt-sub{font-size:14px;color:var(--ink-muted);margin-bottom:40px;line-height:1.6}
        .crt-field{margin-bottom:24px}
        .crt-label{display:block;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--ink);margin-bottom:8px}
        .crt-hint{font-size:11px;color:var(--ink-muted);margin-top:5px}
        .crt-input{width:100%;padding:14px 16px;border:1.5px solid var(--border);font-size:14px;font-family:var(--font-sans);color:var(--ink);background:#fff;outline:none;transition:border-color .2s;box-sizing:border-box}
        .crt-input:focus{border-color:var(--gold)}
        .crt-textarea{width:100%;padding:14px 16px;border:1.5px solid var(--border);font-size:14px;font-family:var(--font-sans);color:var(--ink);background:#fff;outline:none;resize:vertical;min-height:100px;transition:border-color .2s;box-sizing:border-box}
        .crt-textarea:focus{border-color:var(--gold)}
        .crt-moods{display:flex;gap:8px;flex-wrap:wrap}
        .crt-mood{padding:8px 16px;border:1.5px solid var(--border);font-size:11px;font-weight:600;cursor:pointer;background:none;color:var(--ink-muted);transition:all .2s}
        .crt-mood.sel{background:var(--ink);color:#fff;border-color:var(--ink)}
        .crt-radios{display:flex;gap:16px}
        .crt-radio{display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer}
        .crt-btn{width:100%;padding:16px;background:var(--ink);color:#fff;border:none;font-family:var(--font-stamp);font-size:14px;letter-spacing:.18em;cursor:pointer;transition:background .2s;margin-top:8px}
        .crt-btn:hover{background:var(--gold);color:var(--ink)}
        .crt-btn:disabled{opacity:.5;cursor:not-allowed}
        .crt-error{background:#fff0f0;border:1px solid #f5c6c6;color:#c0392b;padding:12px 16px;font-size:13px;margin-bottom:20px}
        .crt-preview{width:100%;max-height:320px;object-fit:cover;margin-top:12px;border:1.5px solid var(--border);display:block}
        .crt-note{background:#fafaf8;border:1.5px solid var(--border);padding:16px;font-size:12px;color:var(--ink-muted);line-height:1.6;margin-bottom:28px}
      `}</style>

      <div className="crt-wrap">
        <p className="crt-eyebrow">Community Share</p>
        <h1 className="crt-title">Share Your Inspo</h1>
        <p className="crt-sub">Post an image or video that speaks to your style. Yours may appear in the Community feed and inspire others.</p>

        <div className="crt-note">
          Posts are reviewed before appearing publicly in the Community Share tab. Editorial team selects standout content to feature.
        </div>

        <form onSubmit={submit}>
          {error && <div className="crt-error">{error}</div>}

          <div className="crt-field">
            <label className="crt-label">Media Type</label>
            <div className="crt-radios">
              <label className="crt-radio"><input type="radio" name="media_type" value="image" checked={form.media_type === "image"} onChange={e => setForm(p => ({ ...p, media_type: e.target.value }))} /> Image</label>
              <label className="crt-radio"><input type="radio" name="media_type" value="video" checked={form.media_type === "video"} onChange={e => setForm(p => ({ ...p, media_type: e.target.value }))} /> Video</label>
            </div>
          </div>

          <div className="crt-field">
            <label className="crt-label" htmlFor="media_url">Media URL</label>
            <input id="media_url" className="crt-input" type="url" placeholder="https://..." required value={form.media_url} onChange={e => setForm(p => ({ ...p, media_url: e.target.value }))} />
            <p className="crt-hint">Link to a hosted image or video (Cloudinary, Imgur, etc.)</p>
            {form.media_url && form.media_type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.media_url} alt="Preview" className="crt-preview" onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
            )}
          </div>

          <div className="crt-field">
            <label className="crt-label" htmlFor="caption">Caption</label>
            <textarea id="caption" className="crt-textarea" placeholder="Tell us about this vibe..." value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} />
          </div>

          <div className="crt-field">
            <label className="crt-label">Mood</label>
            <div className="crt-moods">
              {MOODS.map(m => (
                <button key={m} type="button" className={`crt-mood${form.mood === m ? " sel" : ""}`} onClick={() => setForm(p => ({ ...p, mood: p.mood === m ? "" : m }))}>{m}</button>
              ))}
            </div>
          </div>

          <div className="crt-field">
            <label className="crt-label" htmlFor="tags">Tags</label>
            <input id="tags" className="crt-input" type="text" placeholder="jewelry, home, minimal" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
            <p className="crt-hint">Comma-separated tags</p>
          </div>

          <button className="crt-btn" type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit for Review"}</button>
        </form>
      </div>
    </>
  )
}