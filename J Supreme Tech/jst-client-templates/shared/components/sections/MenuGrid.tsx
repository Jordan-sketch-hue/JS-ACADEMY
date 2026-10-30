"use client";
import { useState } from "react";
import type { ClientConfig } from "@shared/types/config";

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
};

type OrderItem = MenuItem & { qty: number };

interface Props {
  config: ClientConfig;
  items: MenuItem[];
  slug: string;
  heading?: string;
  whatsapp?: string;
}

export function MenuGrid({ config, items, slug, heading = "Our Menu", whatsapp }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? items : items.filter((i) => i.category === activeCategory);

  const addItem = (item: MenuItem) => {
    setOrder((prev) => {
      const existing = prev.find((o) => o.id === item.id);
      if (existing) return prev.map((o) => o.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeItem = (id: string) => setOrder((prev) => prev.filter((o) => o.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeItem(id);
    setOrder((prev) => prev.map((o) => o.id === id ? { ...o, qty } : o));
  };

  const currency = order[0]?.currency ?? items[0]?.currency ?? "JMD";
  const total = order.reduce((sum, o) => sum + o.price * o.qty, 0);
  const orderCount = order.reduce((n, o) => n + o.qty, 0);

  const sendViaWhatsApp = () => {
    const wa = whatsapp || config.contact?.whatsapp || config.contact?.phone || "";
    const lines = order.map((o) => `${o.qty}x ${o.name} (${currency} ${(o.price * o.qty).toLocaleString()})`);
    lines.push(`Total: ${currency} ${total.toLocaleString()}`);
    if (form.notes) lines.push(`Notes: ${form.notes}`);
    lines.push(`Name: ${form.name}`, `Phone: ${form.phone}`);
    const text = encodeURIComponent(lines.join("\n"));
    const num = wa.replace(/[^0-9]/g, "");
    window.open(`https://wa.me/${num}?text=${text}`, "_blank");
    setStatus("sent");
    setOrder([]);
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const message = order.map((o) => `${o.qty}x ${o.name}`).join(", ") + ` | Total: ${currency} ${total.toLocaleString()}${form.notes ? " | Notes: " + form.notes : ""}`;
    try {
      await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: form.name, phone: form.phone, message }),
      });
    } catch {/* order still goes via WhatsApp below */}
    sendViaWhatsApp();
  };

  return (
    <section id="menu" style={{ padding: "64px 24px", background: "var(--bg-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, margin: 0 }}>{heading}</h2>
          {orderCount > 0 && (
            <button onClick={() => setOrderOpen(true)}
              style={{ background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              Order ({orderCount}) · {currency} {total.toLocaleString()}
            </button>
          )}
        </div>

        {/* Category tabs */}
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

        {/* Menu items grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>Menu Coming Soon</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Contact us directly to place an order.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {filtered.map((item) => {
              const inOrder = order.find((o) => o.id === item.id);
              return (
                <div key={item.id} style={{ background: "var(--bg-card)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                  {item.image_url
                    ? <img src={item.image_url} alt={item.name} style={{ width: "100%", height: 180, objectFit: "cover" }} loading="lazy" />
                    : <div style={{ width: "100%", height: 180, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "var(--text-muted)", fontStyle: "italic" }}>Image coming soon</div>
                  }
                  <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
                    {item.category && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>{item.category}</span>
                    )}
                    <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{item.name}</p>
                    {item.description && <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>{item.description}</p>}
                    <p style={{ fontWeight: 800, fontSize: 17, color: "var(--accent)", margin: 0 }}>{currency} {item.price.toLocaleString()}</p>
                    {inOrder ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                        <button onClick={() => updateQty(item.id, inOrder.qty - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontSize: 18 }}>-</button>
                        <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{inOrder.qty}</span>
                        <button onClick={() => updateQty(item.id, inOrder.qty + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontSize: 18 }}>+</button>
                        <span style={{ fontSize: 13, color: "var(--text-secondary)", marginLeft: 4 }}>{currency} {(inOrder.price * inOrder.qty).toLocaleString()}</span>
                      </div>
                    ) : (
                      <button onClick={() => addItem(item)}
                        style={{ marginTop: "auto", background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                        Add to Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order review panel */}
      {orderOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={() => setOrderOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "relative", zIndex: 101, background: "#fff", width: "min(420px,100vw)", height: "100vh", overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Your Order</h3>
              <button onClick={() => setOrderOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            {order.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #e5e7eb", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>-</button>
                  <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" }}>+</button>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, minWidth: 80, textAlign: "right" }}>{currency} {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
            <div style={{ fontWeight: 800, fontSize: 18, display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
              <span>Total</span><span>{currency} {total.toLocaleString()}</span>
            </div>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: 24 }}>
                <p style={{ fontWeight: 700, fontSize: 18 }}>Order sent via WhatsApp!</p>
                <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>We will confirm your order shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleOrder} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="text" placeholder="Phone Number *" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <textarea placeholder="Special instructions or delivery address" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, resize: "vertical" }} />
                <button type="submit" style={{ background: "#25D366", color: "#fff", border: "none", borderRadius: 8, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  📲 Send Order via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
