"use client";
import { useState, useMemo } from "react";

interface JobRow {
  id: string;
  client_id?: string | null;
  customer_name?: string | null;
  description?: string | null;
  vehicle_device?: string | null;
  amount?: number | null;
  status?: string | null;
  notes?: string | null;
  created_at: string;
}

interface Props { jobs: JobRow[]; clientId?: string; }

const STATUS_COLORS: Record<string, string> = {
  received: "#F59E0B",
  in_progress: "#3B82F6",
  awaiting_parts: "#8B5CF6",
  ready: "#10B981",
  collected: "#6B7280",
};

const inputStyle = { padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 14, width: "100%" };

export function JobCardsModule({ jobs: initial, clientId }: Props) {
  const [jobs, setJobs] = useState(initial);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customerName: "", description: "", vehicleDevice: "", amount: "", notes: "" });

  const filtered = useMemo(() => jobs.filter((j) => {
    const ms = !search || j.customer_name?.toLowerCase().includes(search.toLowerCase()) || j.vehicle_device?.toLowerCase().includes(search.toLowerCase());
    const mf = statusFilter === "all" || j.status === statusFilter;
    return ms && mf;
  }), [jobs, search, statusFilter]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!clientId) return;
    setSaving(true);
    const res = await fetch("/api/ct/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, customerName: form.customerName, description: form.description, vehicleDevice: form.vehicleDevice || null, amount: form.amount ? parseFloat(form.amount) : null, notes: form.notes || null }),
    });
    const json = await res.json();
    if (json.ok && json.data) {
      setJobs(prev => [json.data, ...prev]);
      setForm({ customerName: "", description: "", vehicleDevice: "", amount: "", notes: "" });
      setShowAdd(false);
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch("/api/ct/status", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ table: "ct_jobs", id, status }) });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  }

  return (
    <section style={{ padding: "0 0 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10, flex: 1, flexWrap: "wrap" }}>
          <input type="text" placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, maxWidth: 240 }} />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
            <option value="all">All</option>
            <option value="received">Received</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_parts">Awaiting Parts</option>
            <option value="ready">Ready</option>
            <option value="collected">Collected</option>
          </select>
        </div>
        {clientId && <button onClick={() => setShowAdd(!showAdd)} style={{ marginLeft: 12, background: "var(--accent)", color: "var(--accent-fg,#fff)", border: "none", borderRadius: 6, padding: "8px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0 }}>+ Add Job</button>}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <input required placeholder="Customer name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} style={inputStyle} />
          <input required placeholder="Job description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} />
          <input placeholder="Vehicle / Device" value={form.vehicleDevice} onChange={e => setForm(f => ({ ...f, vehicleDevice: e.target.value }))} style={inputStyle} />
          <input type="number" placeholder="Est. amount (J$)" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} style={inputStyle} min="0" step="0.01" />
          <input placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} style={{ ...inputStyle, gridColumn: "1 / -1" }} />
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button type="submit" disabled={saving} style={{ background: "var(--accent)", color: "var(--accent-fg,#fff)", border: "none", borderRadius: 6, padding: "9px 22px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Job"}</button>
            <button type="button" onClick={() => setShowAdd(false)} style={{ background: "#f3f4f6", border: "none", borderRadius: 6, padding: "9px 16px", cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <p style={{ color: "#9ca3af", textAlign: "center", padding: "48px 0" }}>No jobs yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6", textAlign: "left" }}>
                {["Job #", "Customer", "Description", "Vehicle/Device", "Status", "Amount"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", color: "#6b7280", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(j => (
                <tr key={j.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px", fontWeight: 600 }}>#{j.id.toString().slice(-4).toUpperCase()}</td>
                  <td style={{ padding: "12px" }}>{j.customer_name ?? "—"}</td>
                  <td style={{ padding: "12px" }}>{j.description ?? "—"}</td>
                  <td style={{ padding: "12px", color: "#6b7280" }}>{j.vehicle_device ?? "—"}</td>
                  <td style={{ padding: "12px" }}>
                    <select value={j.status ?? "received"} onChange={e => updateStatus(j.id, e.target.value)} style={{ border: "none", background: `${STATUS_COLORS[j.status ?? "received"]}22`, color: STATUS_COLORS[j.status ?? "received"], borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {Object.keys(STATUS_COLORS).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: "12px" }}>{j.amount != null ? `J$${j.amount.toLocaleString()}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}