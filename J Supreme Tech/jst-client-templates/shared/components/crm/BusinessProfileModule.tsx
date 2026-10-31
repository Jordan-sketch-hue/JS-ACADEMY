"use client";
import { useState } from "react";

type BusinessHours = Record<string, { open: string; close: string; closed: boolean }>;
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const defaultHours = (): BusinessHours => Object.fromEntries(DAYS.map(d => [d, { open: "09:00", close: "17:00", closed: d === "Sunday" }]));

interface ClientProfile {
  id: string;
  name: string;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  headline: string | null;
  subline: string | null;
  tagline: string | null;
  currency: string | null;
  business_hours: BusinessHours | null;
}

interface Props { client: ClientProfile; accentColor?: string; }

export function BusinessProfileModule({ client, accentColor = "#111" }: Props) {
  const [tab, setTab] = useState<"profile" | "hours" | "content">("profile");
  const [form, setForm] = useState({
    phone: client.phone ?? "",
    whatsapp: client.whatsapp ?? "",
    address: client.address ?? "",
    headline: client.headline ?? "",
    subline: client.subline ?? "",
    tagline: client.tagline ?? "",
    currency: client.currency ?? "JMD",
  });
  const [hours, setHours] = useState<BusinessHours>(client.business_hours ?? defaultHours());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const inp = { padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, width: "100%", boxSizing: "border-box" as const };
  const label = { fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4, display: "block", textTransform: "uppercase" as const, letterSpacing: "0.06em" };

  async function save(payload: Record<string, unknown>) {
    setSaving(true); setError(""); setSaved(false);
    const res = await fetch("/api/ct/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId: client.id, ...payload }) });
    const json = await res.json();
    if (json.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    else setError(json.error ?? "Save failed");
    setSaving(false);
  }

  const tabBtn = (key: typeof tab, label: string) => (
    <button onClick={() => setTab(key)} style={{ padding: "8px 18px", borderRadius: 6, border: "none", background: tab === key ? accentColor : "transparent", color: tab === key ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{label}</button>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 24, background: "#f3f4f6", borderRadius: 8, padding: 4, width: "fit-content" }}>
        {tabBtn("profile", "Contact & Info")}
        {tabBtn("hours", "Business Hours")}
        {tabBtn("content", "Page Content")}
      </div>

      {saved && <div style={{ background: "#dcfce7", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, color: "#166534", fontWeight: 600, fontSize: 14 }}>Changes saved.</div>}
      {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 16px", marginBottom: 16, color: "#991b1b", fontSize: 14 }}>{error}</div>}

      {tab === "profile" && (
        <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
          <div><label style={label}>Business Phone</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. (876) 555-0123" style={inp} /></div>
          <div><label style={label}>WhatsApp Number</label><input value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} placeholder="e.g. +18765550123" style={inp} /></div>
          <div><label style={label}>Business Address</label><textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Full business address" rows={3} style={{ ...inp, resize: "vertical" }} /></div>
          <div><label style={label}>Currency</label>
            <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} style={inp}>
              <option value="JMD">JMD — Jamaican Dollar</option>
              <option value="USD">USD — US Dollar</option>
              <option value="TTD">TTD — Trinidad Dollar</option>
              <option value="BBD">BBD — Barbados Dollar</option>
            </select>
          </div>
          <button onClick={() => save({ phone: form.phone || null, whatsapp: form.whatsapp || null, address: form.address || null, currency: form.currency })} disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontWeight: 700, cursor: "pointer", width: "fit-content" }}>{saving ? "Saving..." : "Save Contact Info"}</button>
        </div>
      )}

      {tab === "hours" && (
        <div style={{ maxWidth: 520 }}>
          <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Set your operating hours. These show on your storefront and booking page.</p>
          <div style={{ display: "grid", gap: 10 }}>
            {DAYS.map(day => (
              <div key={day} style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr auto", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{day}</span>
                <input type="time" value={hours[day]?.open ?? "09:00"} disabled={hours[day]?.closed} onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], open: e.target.value } }))} style={{ ...inp, opacity: hours[day]?.closed ? 0.4 : 1 }} />
                <input type="time" value={hours[day]?.close ?? "17:00"} disabled={hours[day]?.closed} onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], close: e.target.value } }))} style={{ ...inp, opacity: hours[day]?.closed ? 0.4 : 1 }} />
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={hours[day]?.closed ?? false} onChange={e => setHours(h => ({ ...h, [day]: { ...h[day], closed: e.target.checked } }))} />
                  Closed
                </label>
              </div>
            ))}
          </div>
          <button onClick={() => save({ business_hours: hours })} disabled={saving} style={{ marginTop: 20, background: accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontWeight: 700, cursor: "pointer" }}>{saving ? "Saving..." : "Save Hours"}</button>
        </div>
      )}

      {tab === "content" && (
        <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>These fields appear on your public storefront page.</p>
          <div><label style={label}>Headline (Hero title)</label><input value={form.headline} onChange={e => setForm(f => ({ ...f, headline: e.target.value }))} placeholder="e.g. Premium Nail Art in Kingston" style={inp} /></div>
          <div><label style={label}>Subline (Hero subtitle)</label><input value={form.subline} onChange={e => setForm(f => ({ ...f, subline: e.target.value }))} placeholder="e.g. Book your next look with us" style={inp} /></div>
          <div><label style={label}>Tagline</label><input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="Short tagline" style={inp} /></div>
          <button onClick={() => save({ headline: form.headline || null, subline: form.subline || null, tagline: form.tagline || null })} disabled={saving} style={{ background: accentColor, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontWeight: 700, cursor: "pointer", width: "fit-content" }}>{saving ? "Saving..." : "Save Content"}</button>
        </div>
      )}
    </div>
  );
}