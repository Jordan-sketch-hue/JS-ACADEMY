"use client";
import { useState } from "react";

interface Props {
  businessName: string;
  slug: string;
  whatsapp?: string;
  accent?: string;
  accentFg?: string;
}

const CAKE_FLAVORS = ["Vanilla", "Chocolate", "Red Velvet", "Carrot", "Lemon", "Marble", "Funfetti", "Strawberry"];
const CAKE_SIZES = ["6\" (feeds 8–10)", "8\" (feeds 12–16)", "10\" (feeds 20–25)", "Sheet (feeds 30–40)", "Cupcakes (dozen)"];
const OCCASIONS = ["Birthday", "Wedding", "Anniversary", "Graduation", "Baby Shower", "Corporate Event", "Just Because", "Other"];
const FROSTING = ["Buttercream", "Fondant", "Cream Cheese", "Ganache", "Whipped Cream"];

export default function CakeOrderForm({ businessName, slug, whatsapp, accent = "#1A1A1A", accentFg = "#FFFFFF" }: Props) {
  const [form, setForm] = useState({
    flavor: "", size: "", occasion: "", frosting: "", date: "", time: "", name: "", phone: "", email: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const orderMsg = [
      `CAKE ORDER: ${form.flavor} | ${form.size} | ${form.frosting}`,
      `Occasion: ${form.occasion}`,
      `Date Needed: ${form.date}${form.time ? " at " + form.time : ""}`,
      form.message ? `Notes: ${form.message}` : "",
    ].filter(Boolean).join(" | ");

    try {
      await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: form.name, phone: form.phone, email: form.email, message: orderMsg }),
      });
      setSuccess(true);
    } catch {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #d1d5db",
    fontSize: 14, background: "#fff", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#374151", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6, display: "block" };

  if (success) {
    return (
      <section id="order" style={{ padding: "80px 24px", background: "#f9fafb", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎂</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Order Received!</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>We'll confirm your custom cake order within 24 hours.</p>
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
            style={{ display: "inline-block", padding: "14px 28px", borderRadius: 10, background: "#25D366", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 15 }}>
            Message Us on WhatsApp
          </a>
        )}
      </section>
    );
  }

  return (
    <section id="order" style={{ padding: "80px 24px", background: "#f9fafb" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Custom Orders</p>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Order Your Custom Cake</h2>
          <p style={{ color: "#6b7280", fontSize: 16 }}>Tell us what you're dreaming of — we'll make it happen.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 32, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Cake details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Flavor *</label>
              <select required value={form.flavor} onChange={set("flavor")} style={inputStyle}>
                <option value="">Select flavor</option>
                {CAKE_FLAVORS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Size *</label>
              <select required value={form.size} onChange={set("size")} style={inputStyle}>
                <option value="">Select size</option>
                {CAKE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Frosting *</label>
              <select required value={form.frosting} onChange={set("frosting")} style={inputStyle}>
                <option value="">Select frosting</option>
                {FROSTING.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Occasion *</label>
              <select required value={form.occasion} onChange={set("occasion")} style={inputStyle}>
                <option value="">Select occasion</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Date Needed *</label>
              <input required type="date" value={form.date} onChange={set("date")} style={inputStyle}
                min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]} />
            </div>
            <div>
              <label style={labelStyle}>Preferred Time</label>
              <input type="time" value={form.time} onChange={set("time")} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Special Instructions / Design Details</label>
            <textarea value={form.message} onChange={set("message")} rows={3}
              placeholder="Colors, writing, theme, dietary requirements..."
              style={{ ...inputStyle, resize: "vertical" }} />
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #e5e7eb" }} />

          {/* Contact */}
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input required type="text" value={form.name} onChange={set("name")} placeholder="Full name" style={inputStyle} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input required type="tel" value={form.phone} onChange={set("phone")} placeholder="876-XXX-XXXX" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="Optional" style={inputStyle} />
            </div>
          </div>

          <button type="submit" disabled={submitting}
            style={{ padding: "16px", borderRadius: 12, background: accent, color: accentFg, fontWeight: 800, fontSize: 16, border: "none", cursor: submitting ? "wait" : "pointer", letterSpacing: 0.3 }}>
            {submitting ? "Sending Order..." : `Place Order with ${businessName}`}
          </button>

          <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center" }}>We'll contact you within 24 hours to confirm pricing and details. Minimum 3 days notice required.</p>
        </form>
      </div>
    </section>
  );
}
