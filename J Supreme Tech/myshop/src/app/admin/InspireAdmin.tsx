"use client"
import { useEffect, useState, useCallback } from "react"

const MOODS = ["", "Minimal", "Earthy", "Luxe", "Bold", "Soft", "Dark", "Coastal"]

const emptyInspire = { media_url: "", media_type: "image", caption: "", mood: "", tags: "", product_ids: "", published: true }

export function InspireAdmin({ css, adminKey }: { css: string; adminKey: string }) {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Record<string, string | boolean>>(emptyInspire)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", err: false })

  function ah() { return { "Content-Type": "application/json", "x-admin-key": adminKey } }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/inspire?type=editorial&limit=80")
    const d = await res.json()
    setPosts(Array.isArray(d) ? d : [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function flash(text: string, err = false) {
    setMsg({ text, err })
    setTimeout(() => setMsg({ text: "", err: false }), 3000)
  }

  function startEdit(p: Record<string, unknown>) {
    setEditing(p.id as string)
    setForm({
      media_url: String(p.media_url ?? ""), media_type: String(p.media_type ?? "image"),
      caption: String(p.caption ?? ""), mood: String(p.mood ?? ""),
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
      product_ids: Array.isArray(p.product_ids) ? p.product_ids.join(", ") : "",
      published: Boolean(p.published),
    })
  }

  function resetForm() { setEditing(null); setForm(emptyInspire) }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        type: "editorial",
        media_url: form.media_url, media_type: form.media_type,
        caption: form.caption || null, mood: form.mood || null,
        tags: String(form.tags).split(",").map((t: string) => t.trim()).filter(Boolean),
        product_ids: String(form.product_ids).split(",").map((t: string) => t.trim()).filter(Boolean),
        published: form.published,
      }
      const url = editing ? `/api/inspire/${editing}` : "/api/inspire"
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: ah(),
        body: JSON.stringify(payload),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error ?? "Save failed")
      flash(editing ? "Post updated" : "Post created")
      resetForm(); load()
    } catch (e) { flash(e instanceof Error ? e.message : "Error", true) }
    finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this inspire post?")) return
    await fetch(`/api/inspire/${id}`, { method: "DELETE", headers: ah() })
    flash("Deleted"); load()
  }

  return (
    <>
      <style>{css}</style>
      <div className="adm-card">
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
          {editing ? "Edit Inspire Post" : "New Editorial Post"}
        </h2>
        {msg.text && <div className={`adm-flash ${msg.err ? "adm-flash-err" : "adm-flash-ok"}`}>{msg.text}</div>}

        <div className="adm-row">
          <div>
            <label className="adm-label">Media URL *</label>
            <input className="adm-input" value={String(form.media_url)} onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <label className="adm-label">Media Type</label>
            <select className="adm-input" value={String(form.media_type)} onChange={e => setForm(f => ({ ...f, media_type: e.target.value }))}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
        </div>

        {form.media_url && form.media_type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={String(form.media_url)} alt="" style={{ width: "100%", maxHeight: 200, objectFit: "cover", marginBottom: 16, border: "1px solid var(--border)" }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
        )}

        <div style={{ marginBottom: 16 }}>
          <label className="adm-label">Caption</label>
          <textarea className="adm-input" rows={2} value={String(form.caption)} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} placeholder="Describe the vibe..." style={{ resize: "vertical" }} />
        </div>

        <div className="adm-row">
          <div>
            <label className="adm-label">Mood</label>
            <select className="adm-input" value={String(form.mood)} onChange={e => setForm(f => ({ ...f, mood: e.target.value }))}>
              {MOODS.map(m => <option key={m} value={m}>{m || "— None —"}</option>)}
            </select>
          </div>
          <div>
            <label className="adm-label">Tags (comma-separated)</label>
            <input className="adm-input" value={String(form.tags)} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="jewelry, minimal, gold" />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="adm-label">Linked Product IDs (comma-separated UUIDs)</label>
          <input className="adm-input" value={String(form.product_ids)} onChange={e => setForm(f => ({ ...f, product_ids: e.target.value }))} placeholder="uuid1, uuid2" />
          <p style={{ fontSize: 11, color: "var(--ink-muted)", marginTop: 4 }}>Find product IDs in the Products tab.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <label className="adm-toggle">
            <input type="checkbox" checked={Boolean(form.published)} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            <span className="adm-toggle-track" /><span className="adm-toggle-thumb" />
          </label>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Published</span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="adm-btn adm-btn-gold" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Create Post"}</button>
          {editing && <button className="adm-btn adm-btn-outline" onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      <div className="adm-card">
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
          Editorial Posts ({posts.length})
        </h2>
        {loading ? <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Loading…</p> : posts.length === 0 ? (
          <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>No editorial posts yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 16 }}>
            {posts.map(p => (
              <div key={String(p.id)} style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                {Boolean(p.media_url) && p.media_type === "image" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(p.media_url)} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }} />
                )}
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 11, color: "var(--gold)", fontWeight: 700, marginBottom: 4 }}>{String(p.mood ?? "")}</p>
                  <p style={{ fontSize: 12, color: "var(--ink-muted)", marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {String(p.caption ?? "No caption")}
                  </p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="adm-btn adm-btn-outline" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => startEdit(p)}>Edit</button>
                    <button className="adm-btn adm-btn-danger" style={{ padding: "4px 10px", fontSize: 11 }} onClick={() => handleDelete(String(p.id))}>Del</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
