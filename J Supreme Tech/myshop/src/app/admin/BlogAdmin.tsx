// Blog Posts admin tab
"use client"
import { useEffect, useState, useCallback } from "react"

const emptyBlog = { title: "", slug: "", excerpt: "", cover_image: "", content: "", tags: "", author: "Mine & Yours Editorial", published: false }

function slugify(s: string) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }

export function BlogAdmin({ css, adminKey }: { css: string; adminKey: string }) {
  const [posts, setPosts] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Record<string, string | boolean>>(emptyBlog)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState({ text: "", err: false })

  function ah() { return { "Content-Type": "application/json", "x-admin-key": adminKey } }

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch("/api/admin/blog", { headers: { "x-admin-key": adminKey } })
    const d = await res.json()
    setPosts(Array.isArray(d) ? d : [])
    setLoading(false)
  }, [adminKey])

  useEffect(() => { load() }, [load])

  function flash(text: string, err = false) {
    setMsg({ text, err })
    setTimeout(() => setMsg({ text: "", err: false }), 3000)
  }

  function startEdit(p: Record<string, unknown>) {
    setEditing(p.id as string)
    setForm({
      title: String(p.title ?? ""), slug: String(p.slug ?? ""),
      excerpt: String(p.excerpt ?? ""), cover_image: String(p.cover_image ?? ""),
      content: String(p.content ?? ""), tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
      author: String(p.author ?? "Mine & Yours Editorial"), published: Boolean(p.published),
    })
  }

  function resetForm() { setEditing(null); setForm(emptyBlog) }

  async function handleSave() {
    setSaving(true)
    try {
      const payload = {
        title: form.title, slug: form.slug || slugify(String(form.title)),
        excerpt: form.excerpt || null, cover_image: form.cover_image || null,
        content: form.content || null,
        tags: String(form.tags).split(",").map((t: string) => t.trim()).filter(Boolean),
        author: form.author || null, published: form.published,
        ...(editing ? { id: editing } : {}),
      }
      const res = await fetch("/api/admin/blog", {
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

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch("/api/admin/blog", { method: "DELETE", headers: ah(), body: JSON.stringify({ id }) })
    flash("Deleted"); load()
  }

  return (
    <>
      <style>{css}</style>
      <div className="adm-card">
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
          {editing ? "Edit Post" : "New Blog Post"}
        </h2>
        {msg.text && <div className={`adm-flash ${msg.err ? "adm-flash-err" : "adm-flash-ok"}`}>{msg.text}</div>}
        <div className="adm-row">
          <div>
            <label className="adm-label">Title *</label>
            <input className="adm-input" value={String(form.title)} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))} placeholder="Post title" />
          </div>
          <div>
            <label className="adm-label">Slug</label>
            <input className="adm-input" value={String(form.slug)} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto" />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="adm-label">Excerpt</label>
          <textarea className="adm-input" rows={2} value={String(form.excerpt)} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Short summary shown in feed" style={{ resize: "vertical" }} />
        </div>
        <div className="adm-row">
          <div>
            <label className="adm-label">Cover Image URL</label>
            <input className="adm-input" value={String(form.cover_image)} onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))} placeholder="https://..." />
          </div>
          <div>
            <label className="adm-label">Author</label>
            <input className="adm-input" value={String(form.author)} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label className="adm-label">Tags (comma-separated)</label>
          <input className="adm-input" value={String(form.tags)} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="style, home, editorial" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label className="adm-label">Content (plain text / markdown)</label>
          <textarea className="adm-input" rows={8} value={String(form.content)} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your article here..." style={{ resize: "vertical", fontFamily: "monospace", fontSize: 13 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <label className="adm-toggle">
            <input type="checkbox" checked={Boolean(form.published)} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            <span className="adm-toggle-track" /><span className="adm-toggle-thumb" />
          </label>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Published (visible on site)</span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="adm-btn adm-btn-gold" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Create Post"}</button>
          {editing && <button className="adm-btn adm-btn-outline" onClick={resetForm}>Cancel</button>}
        </div>
      </div>

      <div className="adm-card">
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Blog Posts ({posts.length})</h2>
        {loading ? <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Loading…</p> : posts.length === 0 ? (
          <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>No posts yet.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="adm-table">
              <thead><tr><th>Title</th><th>Slug</th><th>Author</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {posts.map(p => (
                  <tr key={String(p.id)}>
                    <td style={{ fontWeight: 600, maxWidth: 260 }}>{String(p.title)}</td>
                    <td style={{ color: "var(--ink-muted)", fontSize: 12 }}>{String(p.slug)}</td>
                    <td style={{ color: "var(--ink-muted)" }}>{String(p.author ?? "—")}</td>
                    <td><span className={`adm-badge ${p.published ? "adm-badge-green" : "adm-badge-grey"}`}>{p.published ? "Live" : "Draft"}</span></td>
                    <td>
                      <div className="adm-actions">
                        <button className="adm-btn adm-btn-outline" style={{ padding: "6px 14px" }} onClick={() => startEdit(p)}>Edit</button>
                        <a href={`/blog/${p.slug}`} target="_blank" className="adm-btn adm-btn-outline" style={{ padding: "6px 14px", textDecoration: "none" }}>View</a>
                        <button className="adm-btn adm-btn-danger" style={{ padding: "6px 14px" }} onClick={() => handleDelete(String(p.id), String(p.title))}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
