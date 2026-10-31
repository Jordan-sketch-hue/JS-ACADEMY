"use client";
import { useState, useMemo } from "react";
import type { Database } from "@shared/types/supabase";

type Row = Database["public"]["Tables"]["ct_appointments"]["Row"];

interface Props { appointments: Row[]; clientId?: string; businessWhatsapp?: string | null; }

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  confirmed: "#10B981",
  cancelled: "#EF4444",
  completed: "#6B7280",
};

export function AppointmentsModule({ appointments: initial, clientId, businessWhatsapp }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerName: "", service: "", phone: "", scheduledAt: "", notes: "" });

  const filtered = useMemo(() => appointments.filter((a) => {
    const matchSearch = !search || a.customer_name?.toLowerCase().includes(search.toLowerCase()) || a.service?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  }), [appointments, search, statusFilter]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId, customerName: form.customerName, service: form.service, phone: form.phone || null, scheduledAt: form.scheduledAt || null, notes: form.notes || null }) });
    const json = await res.json();
    if (json.ok && json.data) { setAppointments(prev => [json.data, ...prev]); setForm({ customerName: "", service: "", phone: "", scheduledAt: "", notes: "" }); setShowAdd(false); }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/ct/status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "ct_appointments", id, status }) });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  function confirmViaWA(a: Row) {
    if (!businessWhatsapp) return;
    const date = a.scheduled_at ? new Date(a.scheduled_at).toLocaleDateString() : "TBC";
    const time = a.scheduled_at ? new Date(a.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
    const msg = `Hi ${a.customer_name}, your booking for *${a.service}* on *${date}${time ? " at " + time : ""}* is confirmed. See you soon!`;
    window.open(`https://wa.me/${a.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  const inputStyle = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };

  return (
    <section style={{ paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flex: 1, flexWrap: "wrap" }}>
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 240 }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ marginLeft: 12, background: "var(--accent)", color: "var(--accent-fg,#fff)", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>+ Add</button>}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Customer name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} style={inputStyle} />
          <input required placeholder="Service" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} style={inputStyle} />
          <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} style={inputStyle} />
          <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} style={inputStyle} />
          <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: "var(--accent)", color: "var(--accent-fg,#fff)", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: "48px 0" }}>No appointments yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                {["Customer","Phone","Service","Date","Status","Action"].map(h => <th key={h} style={{ padding: "10px 12px", color: "#6b7280", fontWeight: 600 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", fontWeight: 500 }}>{a.customer_name ?? "—"}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{a.phone ?? "—"}</td>
                  <td style={{ padding: "12px" }}>{a.service ?? "—"}</td>
                  <td style={{ padding: "12px" }}>{a.scheduled_at ? new Date(a.scheduled_at).toLocaleDateString() : "—"}</td>
                  <td style={{ padding: "12px" }}>
                    <select value={a.status ?? "pending"} onChange={e => updateStatus(a.id, e.target.value)} style={{ border: "none", background: `${STATUS_COLORS[a.status ?? "pending"]}22`, color: STATUS_COLORS[a.status ?? "pending"], borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {businessWhatsapp && a.phone ? (
                      <button onClick={() => confirmViaWA(a)} style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>WA</button>
                    ) : "—"}
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