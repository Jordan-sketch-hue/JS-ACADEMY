"use client";
import { useState } from "react";

export type QuoteItem = {
  id: string;
  name: string;
  price?: number;
  currency?: string;
  description?: string;
  image_url?: string;
  category?: string;
};

type Props = {
  items: QuoteItem[];
  clientSlug: string;
  phone?: string;
  whatsapp?: string;
  accent?: string;
  accentFg?: string;
};

export default function QuoteForm({ items, clientSlug, phone, whatsapp, accent = "#111", accentFg = "#fff" }: Props) {
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[]];
  const [activeCategory, setActiveCategory] = useState("All");
  const [selected, setSelected] = useState<QuoteItem | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "", budget: "", timeline: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const visible = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    setError("");

    const selectedLabel = selected ? `\nRe: ${selected.name}` : "";
    const budgetLine = form.budget ? `\nBudget: ${form.budget}` : "";
    const timelineLine = form.timeline ? `\nTimeline: ${form.timeline}` : "";
    const message = `QUOTE REQUEST${selectedLabel}${budgetLine}${timelineLine}\n\n${form.message || "Please send a quote."}`;

    const res = await fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: clientSlug, name: form.name, phone: form.phone, email: form.email, message, source: "quote-form" }),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db",
    fontSize: 14, fontFamily: "inherit", background: "#fff", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4 };

  return (
    <section id="quote" style={{ padding: "64px 0", background: "#f9fafb" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, textAlign: "center" }}>Request a Quote</h2>
        <p style={{ textAlign: "center", color: "#6b7280", marginBottom: 40, fontSize: 15 }}>
          Browse our portfolio, select a piece for reference, and fill in your details.
        </p>

        {/* Category filter */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28, justifyContent: "center" }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: "8px 20px", borderRadius: 100, border: activeCategory === cat ? "none" : "1px solid #d1d5db", background: activeCategory === cat ? accent : "#fff", color: activeCategory === cat ? accentFg : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }}>
          {/* Portfolio grid */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Portfolio ({visible.length})
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 }}>
              {visible.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <div key={item.id} onClick={() => setSelected(isSelected ? null : item)} style={{ borderRadius: 12, overflow: "hidden", border: isSelected ? `2px solid ${accent}` : "2px solid transparent", background: "#fff", cursor: "pointer", boxShadow: isSelected ? `0 0 0 3px ${accent}30` : "0 1px 4px rgba(0,0,0,.06)", transition: "all .15s" }}>
                    <div style={{ aspectRatio: "1", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span>🖼️</span>
                      )}
                    </div>
                    <div style={{ padding: "10px 12px" }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{item.name}</p>
                      {item.category && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#9ca3af" }}>{item.category}</p>}
                      {item.price ? (
                        <p style={{ margin: "4px 0 0", fontSize: 13, fontWeight: 700, color: accent }}>{item.currency ?? "JMD"} {item.price.toLocaleString()}</p>
                      ) : (
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#9ca3af" }}>Quote on request</p>
                      )}
                      {isSelected && <p style={{ margin: "6px 0 0", fontSize: 11, fontWeight: 700, color: accent }}>✓ Selected</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quote form */}
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,.06)", position: "sticky", top: 24 }}>
            {selected && (
              <div style={{ background: `${accent}10`, border: `1px solid ${accent}30`, borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Referencing:</p>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{selected.name}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#9ca3af" }}>×</button>
              </div>
            )}

            {submitted ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800 }}>Request Received!</h3>
                <p style={{ color: "#6b7280", margin: "0 0 24px", fontSize: 14 }}>We'll be in touch with your custom quote shortly.</p>
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", padding: "12px 24px", borderRadius: 10, background: "#25d366", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    Chat on WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Get a Custom Quote</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Your Name *</label>
                    <input style={inputStyle} required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone *</label>
                    <input style={inputStyle} required value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="876-XXX-XXXX" />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Email</label>
                  <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder="jane@example.com" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Budget Range</label>
                    <input style={inputStyle} value={form.budget} onChange={(e) => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. JMD 50,000" />
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline</label>
                    <input style={inputStyle} value={form.timeline} onChange={(e) => setForm(f => ({ ...f, timeline: e.target.value }))} placeholder="e.g. 2 weeks" />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Project Details</label>
                  <textarea style={{ ...inputStyle, resize: "vertical" }} rows={4} value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe what you need — dimensions, materials, quantity, style..." />
                </div>

                {error && <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>}

                <button type="submit" disabled={submitting}
                  style={{ padding: "14px", borderRadius: 10, background: accent, color: accentFg, fontWeight: 700, fontSize: 15, border: "none", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Sending..." : "Request Quote →"}
                </button>

                {(phone || whatsapp) && (
                  <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0 }}>
                    Or reach us directly:{" "}
                    {phone && <a href={`tel:${phone}`} style={{ color: accent, fontWeight: 600 }}>{phone}</a>}
                    {phone && whatsapp && " · "}
                    {whatsapp && <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#25d366", fontWeight: 600 }}>WhatsApp</a>}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: stack grid above form */}
      <style>{`
        @media (max-width: 768px) {
          #quote > div > div:last-child {
            display: grid !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
