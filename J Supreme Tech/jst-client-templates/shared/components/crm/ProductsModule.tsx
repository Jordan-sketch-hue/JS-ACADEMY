"use client";
import { useState } from "react";

export interface Product { id: string; name: string; category: string | null; subcategory: string | null; sku: string | null; price: number; currency: string; active: boolean; created_at: string; description?: string | null; }
interface Props { products: Product[]; clientId?: string; accentColor?: string; currency?: string; }

export function ProductsModule({ products: initial, clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [products, setProducts] = useState(initial);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", subcategory: "", price: "", sku: "", description: "" });
  const [editForm, setEditForm] = useState({ name: "", category: "", subcategory: "", price: "", sku: "", description: "" });

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku ?? "").toLowerCase().includes(search.toLowerCase()));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, name: form.name, category: form.category || null, subcategory: form.subcategory || null, price: form.price, currency, sku: form.sku || null, description: form.description || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setProducts(prev => [json.data, ...prev]); setForm({ name: "", category: "", subcategory: "", price: "", sku: "", description: "" }); setShowAdd(false); }
    setSaving(false);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditForm({ name: p.name, category: p.category ?? "", subcategory: p.subcategory ?? "", price: String(p.price), sku: p.sku ?? "", description: (p as any).description ?? "" });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    const res = await fetch("/api/ct/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, name: editForm.name, category: editForm.category || null, subcategory: editForm.subcategory || null, price: editForm.price, sku: editForm.sku || null, description: editForm.description || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setProducts(prev => prev.map(p => p.id === editingId ? json.data : p)); setEditingId(null); }
    setSaving(false);
  }

  async function toggleActive(p: Product) {
    const res = await fetch("/api/ct/products", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, active: !p.active }) });
    const json = await res.json();
    if (json.ok && json.data) setProducts(prev => prev.map(x => x.id === p.id ? json.data : x));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    const res = await fetch("/api/ct/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const json = await res.json();
    if (json.ok) setProducts(prev => prev.filter(p => p.id !== id));
  }

  const inp = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ ...inp, flex: 1 }} />
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>+ Add</button>}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Product / service name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
          <input required type="number" placeholder={`Price (${currency})`} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inp} />
          <input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp} />
          <input placeholder="Subcategory" value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} style={inp} />
          <input placeholder="SKU (optional)" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} style={inp} />
          <input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inp, gridColumn: "1/-1" }} />
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}

      {editingId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <form onSubmit={handleEdit} style={{ background: "#fff", borderRadius: 12, padding: 28, width: "min(520px,100%)", display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Edit Product</h3>
              <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>&#215;</button>
            </div>
            <input required placeholder="Name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inp} />
            <input required type="number" placeholder="Price" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} style={inp} />
            <input placeholder="Category" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} style={inp} />
            <input placeholder="SKU" value={editForm.sku} onChange={e => setEditForm(f => ({ ...f, sku: e.target.value }))} style={inp} />
            <input placeholder="Description" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} style={inp} />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
              <button type="button" onClick={() => setEditingId(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No products yet.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ borderBottom: "2px solid #f3f4f6" }}>
              {["Name","SKU","Category","Price","Status",""].map((h,i) => <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{filtered.map(p => (
              <tr key={p.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>{p.name}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{p.sku ?? "—"}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{p.category ?? "—"}</td>
                <td style={{ padding: "10px 12px" }}>{p.currency} {p.price.toLocaleString()}</td>
                <td style={{ padding: "10px 12px" }}>
                  <button onClick={() => toggleActive(p)} style={{ background: p.active ? "#dcfce7" : "#f3f4f6", color: p.active ? "#166534" : "#6b7280", border: "none", borderRadius: 999, padding: "3px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p.active ? "Active" : "Archived"}</button>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(p)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{ background: "none", border: "1px solid #fee2e2", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", color: "#dc2626", fontWeight: 600 }}>Del</button>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}