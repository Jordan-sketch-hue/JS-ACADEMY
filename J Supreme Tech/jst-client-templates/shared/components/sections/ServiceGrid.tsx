"use client";
import { useState } from "react";
import type { ClientConfig } from "@shared/types/config";

export type ServiceCard = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  duration?: string | null;
};

interface Props {
  config: ClientConfig;
  services: ServiceCard[];
  heading?: string;
  slug?: string;
  whatsapp?: string;
}

export function ServiceGrid({ config, services, heading = "Our Services", slug, whatsapp }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selected, setSelected] = useState<ServiceCard | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const categories = ["All", ...Array.from(new Set(services.map((s) => s.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? services : services.filter((s) => s.category === activeCategory);
  const currency = services[0]?.currency ?? "JMD";

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setStatus("sending");
    const message = `BOOKING REQUEST: ${selected.name}${form.date ? " on " + form.date : ""}. Notes: ${form.notes || "none"}`;
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: config.name, name: form.name, phone: form.phone, message }),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section id="services" style={{ padding: "64px 24px", background: "var(--bg-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, marginBottom: 24 }}>{heading}</h2>

        {/* Category filter tabs */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px", borderRadius: 100,
                  border: activeCategory === cat ? "none" : "1px solid var(--border)",
                  background: activeCategory === cat ? "var(--accent)" : "var(--bg-card)",
                  color: activeCategory === cat ? "var(--accent-fg)" : "var(--text-primary)",
                  fontWeight: activeCategory === cat ? 700 : 500, fontSize: 14, cursor: "pointer",
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Service cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Services Coming Soon</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Contact us to enquire about bookings.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filtered.map((service) => (
              <div key={service.id} style={{ background: "var(--bg-card)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                {service.image_url
                  ? <img src={service.image_url} alt={service.name} style={{ width: "100%", height: 180, objectFit: "cover" }} loading="lazy" />
                  : <div style={{ width: "100%", height: 180, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>Portfolio image coming soon</div>
                }
                <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {service.category && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>{service.category}</span>
                  )}
                  <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>{service.name}</p>
                  {service.description && <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>{service.description}</p>}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: "var(--accent)" }}>{currency} {service.price.toLocaleString()}</span>
                    {service.duration && <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--bg-surface)", padding: "3px 10px", borderRadius: 100 }}>{service.duration}</span>}
                  </div>
                  <button onClick={() => { setSelected(service); setStatus("idle"); setForm({ name: "", phone: "", date: "", notes: "" }); }}
                    style={{ marginTop: "auto", background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "min(480px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Book: {selected.name}</h3>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "#6b7280" }}>{currency} {selected.price.toLocaleString()}{selected.duration ? ` · ${selected.duration}` : ""}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", marginLeft: 16 }}>×</button>
            </div>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Booking Request Sent!</p>
                <p style={{ color: "#6b7280", fontSize: 14 }}>We will confirm your appointment shortly. Check your WhatsApp or phone for a response.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="text" placeholder="Phone / WhatsApp *" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="date" placeholder="Preferred Date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <textarea placeholder="Any notes or requests" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, resize: "vertical" }} />
                {status === "error" && <p style={{ color: "#ef4444", fontSize: 14 }}>Something went wrong. Please try again or call us.</p>}
                <button type="submit" style={{ background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  {status === "sending" ? "Sending..." : "Confirm Booking Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
