"use client";
import { useState } from "react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: string;
  status: "new" | "contacted" | "converted" | "lost";
  createdAt: string;
}

interface Props { leads: Lead[]; clientId?: string; }

const STATUS_COLORS: Record<string, string> = {
  new:       "#2563EB",
  contacted: "#D97706",
  converted: "#16A34A",
  lost:      "#9CA3AF",
};

const inputStyle = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };

export function LeadsModule({ leads: initial, clientId }: Props) {
  const [leads, setLeads] = useState(initial);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", source: "website" });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, name: form.name, phone: form.phone || null, source: form.source }),
    });
    const json = await res.json();
    if (json.ok && json.data) {
      const d = json.data;
      setLeads(prev => [{ id: d.id, name: d.name, phone: d.phone ?? "", source: d.source ?? "website", status: d.status ?? "new", createdAt: d.created_at }, ...prev]);
      setForm({ name: "", phone: "", source: "website" });
      setShowAdd(false);
    }
    setSaving(false);
  }

  return (
    <section style={{ paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ background: "var(--accent)", color: "var(--accent-fg,#fff)", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Add Lead</button>}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
          <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} style={inputStyle}>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="walk-in">Walk-in</option>
            <option value="other">Other</option>
          </select>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: "var(--accent)", color: "var(--accent-fg,#fff)", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}

      {leads.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>No leads yet.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #E5E5E5" }}>
                {["Name","Phone","Source","Status","Added"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600, color: "#6B6B6B", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(l => (
                <tr key={l.id} style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 500 }}>{l.name}</td>
                  <td style={{ padding: "10px 12px", color: "#6B6B6B" }}>{l.phone || "-"}</td>
                  <td style={{ padding: "10px 12px", color: "#6B6B6B", textTransform: "capitalize" }}>{l.source}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, textTransform: "capitalize", background: STATUS_COLORS[l.status] + "18", color: STATUS_COLORS[l.status] }}>
                      {l.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 12px", color: "#6B6B6B", whiteSpace: "nowrap" }}>
                    {new Date(l.createdAt).toLocaleDateString("en-JM", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}