"use client";
import { useState } from "react";

const inp: React.CSSProperties = {
  width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 4, padding: "12px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif",
};
const lbl: React.CSSProperties = { display: "block", fontSize: 10, fontWeight: 700, color: "rgba(200,168,74,0.75)", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" };

const PARISHES = ["Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary", "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland", "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"];

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    event_date: "", occasion: "", quantity: "",
    delivery_parish: "", delivery_address: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "rgba(200,168,74,0.5)"; };
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/submit-lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, source: "corporate_page" }) });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", backgroundColor: "#0D1933", borderRadius: 4, border: "1px solid rgba(200,168,74,0.25)" }}>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 36, color: "#C8A84A", marginBottom: 16 }}>Thank you.</div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>Your quote request has been received. We will respond within 24 business hours with a custom proposal.</p>
        <a href="https://wa.me/18769999999?text=Hi!%20I%20just%20submitted%20a%20quote%20request%20on%20the%20website." target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#25D366", color: "#fff", padding: "10px 22px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.08em" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          Follow up on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Contact */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><label style={lbl}>Contact Name *</label><input required style={inp} value={form.name} onChange={e => set("name", e.target.value)} placeholder="Jane Smith" onFocus={focus} onBlur={blur} /></div>
        <div><label style={lbl}>Company / Organisation *</label><input required style={inp} value={form.company} onChange={e => set("company", e.target.value)} placeholder="ABC Limited" onFocus={focus} onBlur={blur} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><label style={lbl}>Email *</label><input required type="email" style={inp} value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@company.com" onFocus={focus} onBlur={blur} /></div>
        <div><label style={lbl}>WhatsApp / Phone *</label><input required style={inp} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="876-000-0000" onFocus={focus} onBlur={blur} /></div>
      </div>

      {/* Order details */}
      <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><label style={lbl}>Occasion / Event Type</label>
          <select style={{ ...inp, cursor: "pointer" }} value={form.occasion} onChange={e => set("occasion", e.target.value)} onFocus={focus} onBlur={blur}>
            <option value="">Select occasion</option>
            {["Employee Recognition", "Holiday Gift Kits", "Conference / Gala", "Client Appreciation", "Product Launch", "Wedding / Social Event", "Wholesale / Retail", "Other"].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div><label style={lbl}>Event / Delivery Date</label><input type="date" style={inp} value={form.event_date} onChange={e => set("event_date", e.target.value)} onFocus={focus} onBlur={blur} /></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div><label style={lbl}>Quantity Needed *</label>
          <select required style={{ ...inp, cursor: "pointer" }} value={form.quantity} onChange={e => set("quantity", e.target.value)} onFocus={focus} onBlur={blur}>
            <option value="">Select quantity</option>
            <option value="12">12 units — J$9,600 (J$800/head)</option>
            <option value="24">24 units — J$18,000 (J$750/head)</option>
            <option value="48">48 units — J$33,600 (J$700/head)</option>
            <option value="100">100 units — J$65,000 (J$650/head)</option>
            <option value="250">250 units — custom quote</option>
            <option value="500+">500+ units — custom quote</option>
          </select>
        </div>
        <div><label style={lbl}>Delivery Parish</label>
          <select style={{ ...inp, cursor: "pointer" }} value={form.delivery_parish} onChange={e => set("delivery_parish", e.target.value)} onFocus={focus} onBlur={blur}>
            <option value="">Select parish</option>
            {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div><label style={lbl}>Delivery Address</label><input style={inp} value={form.delivery_address} onChange={e => set("delivery_address", e.target.value)} placeholder="Office address or event venue" onFocus={focus} onBlur={blur} /></div>
      <div><label style={lbl}>Additional Notes</label>
        <textarea style={{ ...inp, resize: "vertical", minHeight: 80 }} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Custom branding, logo upload, special packaging, dietary notes..." onFocus={focus} onBlur={blur} />
      </div>

      {status === "error" && <p style={{ color: "#C87060", fontSize: 13 }}>Submission failed. WhatsApp us directly instead.</p>}

      <button type="submit" disabled={status === "loading"}
        style={{ backgroundColor: "#C8A84A", color: "#060C1A", border: "none", borderRadius: 4, padding: "16px", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", opacity: status === "loading" ? 0.7 : 1 }}>
        {status === "loading" ? "SUBMITTING..." : "REQUEST A CORPORATE QUOTE"}
      </button>
      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 11, margin: 0 }}>Response within 24 business hours · or WhatsApp us for instant reply</p>
    </form>
  );
}
