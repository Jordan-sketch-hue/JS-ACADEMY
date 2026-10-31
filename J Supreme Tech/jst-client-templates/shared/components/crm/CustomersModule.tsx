"use client";
import { useState } from "react";

export interface Customer { id: string; name: string; phone: string | null; email: string | null; notes: string | null; created_at: string; }
interface Props { customers: Customer[]; clientId?: string; accentColor?: string; }

export function CustomersModule({ customers: initial, clientId, accentColor = "#111" }: Props) {
  const [customers, setCustomers] = useState(initial);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "", notes: "" });

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone ?? "").includes(search) || (c.email ?? "").toLowerCase().includes(search.toLowerCase()));

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, name: form.name, phone: form.phone || null, email: form.email || null, notes: form.notes || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setCustomers(prev => [json.data, ...prev]); setForm({ name: "", phone: "", email: "", notes: "" }); setShowAdd(false); }
    setSaving(false);
  }

  function startEdit(c: Customer) {
    setEditingId(c.id);
    setEditForm({ name: c.name, phone: c.phone ?? "", email: c.email ?? "", notes: c.notes ?? "" });
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    const res = await fetch("/api/ct/customers", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingId, name: editForm.name, phone: editForm.phone || null, email: editForm.email || null, notes: editForm.notes || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setCustomers(prev => prev.map(c => c.id === editingId ? json.data : c)); setEditingId(null); }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this customer?")) return;
    const res = await fetch("/api/ct/customers", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    const json = await res.json();
    if (json.ok) setCustomers(prev => prev.filter(c => c.id !== id));
  }

  const inp = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." style={{ ...inp, flex: 1 }} />
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>+ Add</button>}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inp} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inp} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inp, gridColumn: "1/-1" }} />
          <div style={{ gridColumn: "1/-1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}

      {editingId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <form onSubmit={handleEdit} style={{ background: "#fff", borderRadius: 12, padding: 28, width: "min(480px,100%)", display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Edit Customer</h3>
              <button type="button" onClick={() => setEditingId(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>&#215;</button>
            </div>
            <input required placeholder="Full name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inp} />
            <input placeholder="Phone" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} style={inp} />
            <input type="email" placeholder="Email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={inp} />
            <textarea placeholder="Notes" value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inp, resize: "vertical" }} />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Changes"}</button>
              <button type="button" onClick={() => setEditingId(null)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {filtered.length === 0 ? <p style={{ color: "#9ca3af", textAlign: "center", padding: 32 }}>No customers yet.</p> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead><tr style={{ borderBottom: "2px solid #f3f4f6" }}>
              {["Name","Phone","Email","Added",""].map((h,i) => <th key={i} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "10px 12px", fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{c.phone ?? "—"}</td>
                <td style={{ padding: "10px 12px", color: "#6b7280" }}>{c.email ?? "—"}</td>
                <td style={{ padding: "10px 12px", color: "#9ca3af" }}>{new Date(c.created_at).toLocaleDateString()}</td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => startEdit(c)} style={{ background: "none", border: "1px solid #e5e7eb", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(c.id)} style={{ background: "none", border: "1px solid #fee2e2", borderRadius: 6, padding: "4px 12px", fontSize: 12, cursor: "pointer", color: "#dc2626", fontWeight: 600 }}>Del</button>
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