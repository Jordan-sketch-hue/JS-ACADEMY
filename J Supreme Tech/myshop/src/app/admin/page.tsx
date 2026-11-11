"use client"

import { useEffect, useState, useCallback } from "react"
import type { Product } from "@/lib/types"
import { BlogAdmin } from "./BlogAdmin"
import { InspireAdmin } from "./InspireAdmin"

const CATEGORIES = [
  "Clothing", "Accessories", "Shoes", "Bags", "Jewellery",
  "Skincare", "Fragrance", "Home", "Electronics",
  "Adult & Intimate", "Other",
]

const empty = {
  name: "", slug: "", description: "", price_jmd: "", category: "",
  image_url: "", stock: "0", active: true,
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const CSS = `
  .adm{max-width:1100px;margin:0 auto;padding:40px 24px 80px}
  .adm-h{font-family:var(--font-serif);font-size:28px;font-weight:900;color:var(--ink);margin-bottom:8px}
  .adm-tabs{display:flex;gap:0;border-bottom:2px solid var(--border);margin-bottom:32px;flex-wrap:wrap}
  .adm-tab{padding:12px 24px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:none;background:none;color:var(--ink-muted);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
  .adm-tab.active{color:var(--ink);border-bottom-color:var(--gold)}
  .adm-tab:hover{color:var(--ink)}
  .adm-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:28px;margin-bottom:32px}
  .adm-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
  .adm-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:16px}
  .adm-label{display:block;font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--ink-muted);margin-bottom:6px;text-transform:uppercase}
  .adm-input{width:100%;padding:10px 14px;border:1.5px solid var(--border);border-radius:10px;font-size:14px;color:var(--ink);background:#fff;outline:none;box-sizing:border-box}
  .adm-input:focus{border-color:var(--gold)}
  .adm-btn{padding:10px 22px;border-radius:10px;font-weight:700;font-size:13px;cursor:pointer;border:none;transition:all .15s}
  .adm-btn-gold{background:var(--gold);color:var(--dark)}
  .adm-btn-gold:hover{opacity:.9}
  .adm-btn-outline{background:#fff;color:var(--ink);border:1.5px solid var(--border)}
  .adm-btn-outline:hover{border-color:var(--ink)}
  .adm-btn-danger{background:#fff0f0;color:#c0392b;border:1.5px solid #fcc}
  .adm-btn-danger:hover{background:#fcc}
  .adm-table{width:100%;border-collapse:collapse}
  .adm-table th{text-align:left;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-muted);padding:8px 12px;border-bottom:1px solid var(--border)}
  .adm-table td{padding:12px 12px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle}
  .adm-table tr:last-child td{border-bottom:none}
  .adm-badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.06em}
  .adm-badge-green{background:#e6f7ec;color:#27ae60}
  .adm-badge-gold{background:#fef9e7;color:#b7950b}
  .adm-badge-grey{background:#f0f0f0;color:#888}
  .adm-badge-blue{background:#ebf5fb;color:#2471a3}
  .adm-actions{display:flex;gap:8px;align-items:center}
  .adm-flash{padding:10px 16px;border-radius:10px;font-size:13px;font-weight:600;margin-bottom:16px}
  .adm-flash-ok{background:#e6f7ec;color:#27ae60}
  .adm-flash-err{background:#fff0f0;color:#c0392b}
  .adm-toggle{position:relative;display:inline-flex;align-items:center;cursor:pointer}
  .adm-toggle input{opacity:0;width:0;height:0;position:absolute}
  .adm-toggle-track{width:36px;height:20px;background:#ddd;border-radius:20px;transition:.2s;display:block}
  .adm-toggle input:checked+.adm-toggle-track{background:var(--gold)}
  .adm-toggle-thumb{position:absolute;left:3px;top:3px;width:14px;height:14px;background:#fff;border-radius:50%;transition:.2s;pointer-events:none}
  .adm-toggle input:checked~.adm-toggle-thumb{left:19px}
  .adm-lock{max-width:420px;margin:80px auto;text-align:center}
  .adm-lock-icon{font-size:48px;margin-bottom:24px}
  @media(max-width:640px){.adm-row,.adm-row3{grid-template-columns:1fr}}
`

interface Order {
  id: string
  status: string
  amount_usd_cents: number
  currency: string
  customer_name: string | null
  customer_email: string | null
  created_at: string
  items: Array<{ name: string; qty: number; price_usd: number }>
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("")
  const [keyInput, setKeyInput] = useState("")
  const [authError, setAuthError] = useState("")

  const [tab, setTab] = useState<"products" | "blog" | "inspire" | "orders">("products")
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Record<string, string | boolean>>(empty)
  const [editing, setEditing] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  function authHeaders() {
    return { "Content-Type": "application/json", "x-admin-key": adminKey }
  }

  const load = useCallback(async () => {
    if (!adminKey) return
    setLoading(true)
    const res = await fetch("/api/admin/products", { headers: { "x-admin-key": adminKey } })
    if (res.status === 401) { setAdminKey(""); setAuthError("Incorrect admin key."); setLoading(false); return }
    const data = await res.json()
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [adminKey])

  const loadOrders = useCallback(async () => {
    if (!adminKey) return
    setLoading(true)
    const res = await fetch("/api/admin/orders", { headers: { "x-admin-key": adminKey } })
    if (res.status === 401) { setAdminKey(""); setAuthError("Incorrect admin key."); setLoading(false); return }
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [adminKey])

  useEffect(() => {
    if (!adminKey) return
    if (tab === "products") load()
    if (tab === "orders") loadOrders()
  }, [load, loadOrders, tab, adminKey])

  function flash(msg: string, isError = false) {
    if (isError) { setError(msg); setSuccess("") }
    else { setSuccess(msg); setError("") }
    setTimeout(() => { setError(""); setSuccess("") }, 3000)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthError("")
    setAdminKey(keyInput)
  }

  function startEdit(p: Product) {
    setEditing(p.id)
    setForm({
      name: p.name, slug: p.slug, description: p.description ?? "",
      price_jmd: String(p.price_jmd), category: p.category ?? "",
      image_url: p.image_url ?? "", stock: String(p.stock), active: p.active,
    })
  }

  function resetForm() { setEditing(null); setForm(empty) }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(String(form.name)),
        description: form.description || null,
        price_jmd: parseInt(String(form.price_jmd)) || 0,
        category: form.category || null,
        image_url: form.image_url || null,
        stock: parseInt(String(form.stock)) || 0,
        active: form.active,
        ...(editing ? { id: editing } : {}),
      }
      const method = editing ? "PATCH" : "POST"
      const res = await fetch("/api/admin/products", { method, headers: authHeaders(), body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Save failed")
      flash(editing ? "Product updated" : "Product created")
      resetForm(); load()
    } catch (e) { flash(e instanceof Error ? e.message : "Error", true) }
    finally { setSaving(false) }
  }

  async function toggleActive(p: Product) {
    await fetch("/api/admin/products", { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ id: p.id, active: !p.active }) })
    load()
  }

  async function handleDelete(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return
    await fetch("/api/admin/products", { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ id: p.id }) })
    flash("Product deleted"); load()
  }

  if (!adminKey) {
    return (
      <>
        <style>{CSS}</style>
        <div className="adm">
          <div className="adm-lock">
            <div className="adm-lock-icon">🔑</div>
            <h1 className="adm-h" style={{ marginBottom: 8 }}>Admin Access</h1>
            <p style={{ fontSize: 14, color: "var(--ink-muted)", marginBottom: 28 }}>Enter your admin key to continue.</p>
            {authError && <div className="adm-flash adm-flash-err" style={{ marginBottom: 16 }}>{authError}</div>}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input
                className="adm-input"
                type="password"
                placeholder="Admin key"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                autoFocus
              />
              <button className="adm-btn adm-btn-gold" type="submit">Unlock</button>
            </form>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="adm">
        <h1 className="adm-h">Admin</h1>
        <p style={{ fontSize: 13, color: "var(--ink-muted)", marginBottom: 24 }}>Mine &amp; Yours Shop</p>

        <div className="adm-tabs">
          {(["products", "blog", "inspire", "orders"] as const).map(t => (
            <button key={t} className={`adm-tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t === "products" ? "Products" : t === "blog" ? "Blog Posts" : t === "inspire" ? "Inspire" : "Orders"}
            </button>
          ))}
          <button
            className="adm-btn adm-btn-outline"
            style={{ marginLeft: "auto", padding: "6px 14px", fontSize: 11, alignSelf: "center" }}
            onClick={() => { setAdminKey(""); setKeyInput("") }}
          >Lock</button>
        </div>

        {tab === "products" && (
          <>
            <div className="adm-card">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              {error && <div className="adm-flash adm-flash-err">{error}</div>}
              {success && <div className="adm-flash adm-flash-ok">{success}</div>}
              <div className="adm-row">
                <div>
                  <label className="adm-label">Name *</label>
                  <input className="adm-input" value={String(form.name)} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : slugify(e.target.value) }))} placeholder="Product name" />
                </div>
                <div>
                  <label className="adm-label">Slug *</label>
                  <input className="adm-input" value={String(form.slug)} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated" />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="adm-label">Description</label>
                <textarea className="adm-input" rows={2} value={String(form.description)} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" style={{ resize: "vertical" }} />
              </div>
              <div className="adm-row3">
                <div>
                  <label className="adm-label">Price (JMD cents) *</label>
                  <input className="adm-input" type="number" value={String(form.price_jmd)} onChange={e => setForm(f => ({ ...f, price_jmd: e.target.value }))} placeholder="300000 = J$3,000" />
                </div>
                <div>
                  <label className="adm-label">Category</label>
                  <select className="adm-input" value={String(form.category)} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">— Select —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="adm-label">Stock</label>
                  <input className="adm-input" type="number" value={String(form.stock)} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="adm-label">Image URL</label>
                <input className="adm-input" value={String(form.image_url)} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <label className="adm-toggle">
                  <input type="checkbox" checked={Boolean(form.active)} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                  <span className="adm-toggle-track" /><span className="adm-toggle-thumb" />
                </label>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Active (visible in shop)</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="adm-btn adm-btn-gold" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : editing ? "Save Changes" : "Add Product"}</button>
                {editing && <button className="adm-btn adm-btn-outline" onClick={resetForm}>Cancel</button>}
              </div>
            </div>

            <div className="adm-card">
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Products ({products.length})</h2>
              {loading ? <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Loading…</p> : products.length === 0 ? (
                <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>No products yet. Add one above.</p>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="adm-table">
                    <thead><tr><th>Name</th><th>ID</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600 }}>{p.name}</td>
                          <td style={{ fontSize: 10, color: "var(--ink-faint)", fontFamily: "monospace" }}>{p.id.slice(0,8)}…</td>
                          <td style={{ color: "var(--ink-muted)" }}>{p.category ?? "—"}</td>
                          <td>J${(p.price_jmd / 100).toLocaleString()}</td>
                          <td>{p.stock}</td>
                          <td><span className={`adm-badge ${p.active ? "adm-badge-green" : "adm-badge-grey"}`}>{p.active ? "Active" : "Hidden"}</span></td>
                          <td>
                            <div className="adm-actions">
                              <button className="adm-btn adm-btn-outline" style={{ padding: "6px 14px" }} onClick={() => startEdit(p)}>Edit</button>
                              <button className="adm-btn adm-btn-outline" style={{ padding: "6px 14px" }} onClick={() => toggleActive(p)}>{p.active ? "Hide" : "Show"}</button>
                              <button className="adm-btn adm-btn-danger" style={{ padding: "6px 14px" }} onClick={() => handleDelete(p)}>Delete</button>
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
        )}

        {tab === "blog" && <BlogAdmin css="" adminKey={adminKey} />}
        {tab === "inspire" && <InspireAdmin css="" adminKey={adminKey} />}

        {tab === "orders" && (
          <div className="adm-card">
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Orders ({orders.length})</h2>
            {loading ? <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>Loading…</p> : orders.length === 0 ? (
              <p style={{ color: "var(--ink-muted)", fontSize: 14 }}>No orders yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="adm-table">
                  <thead><tr><th>Ref</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--ink-muted)" }}>#{o.id.slice(0,8).toUpperCase()}</td>
                        <td>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{o.customer_name ?? "Guest"}</div>
                          {o.customer_email && <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{o.customer_email}</div>}
                        </td>
                        <td style={{ fontSize: 12, color: "var(--ink-muted)", maxWidth: 180 }}>
                          {Array.isArray(o.items) ? o.items.map((i, idx) => (
                            <span key={idx}>{i.name} ×{i.qty}{idx < o.items.length - 1 ? ", " : ""}</span>
                          )) : "—"}
                        </td>
                        <td style={{ fontWeight: 700 }}>${(o.amount_usd_cents / 100).toFixed(2)}</td>
                        <td>
                          <span className={`adm-badge ${o.status === "paid" ? "adm-badge-green" : o.status === "pending" ? "adm-badge-gold" : "adm-badge-grey"}`}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ fontSize: 11, color: "var(--ink-muted)" }}>
                          {new Date(o.created_at).toLocaleDateString("en-JM", { day: "numeric", month: "short", year: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
