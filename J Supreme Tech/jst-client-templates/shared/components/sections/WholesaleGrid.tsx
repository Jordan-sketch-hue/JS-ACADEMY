"use client";
import { useState } from "react";
import { ProductImage } from "@shared/components/ui/ProductImage";

export type WholesaleProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  moq?: number;
};

interface Tier { minQty: number; label: string; discount: number; }

const DEFAULT_TIERS: Tier[] = [
  { minQty: 10, label: "10–24 units", discount: 0 },
  { minQty: 25, label: "25–49 units", discount: 0.08 },
  { minQty: 50, label: "50–99 units", discount: 0.15 },
  { minQty: 100, label: "100+ units", discount: 0.22 },
];

interface Props {
  slug: string;
  products: WholesaleProduct[];
  heading?: string;
  whatsapp?: string | null;
  businessName?: string;
}

interface QuoteItem { product: WholesaleProduct; qty: number; }

export function WholesaleGrid({ slug, products, heading = "Wholesale Catalogue", whatsapp, businessName }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  const setItemQty = (product: WholesaleProduct, qty: number) => {
    if (qty < 1) { setQuoteItems((p) => p.filter((i) => i.product.id !== product.id)); return; }
    setQuoteItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) return prev.map((i, j) => j === idx ? { ...i, qty } : i);
      return [...prev, { product, qty }];
    });
  };

  const getQty = (id: string) => quoteItems.find((i) => i.product.id === id)?.qty ?? 0;

  const getTierPrice = (basePrice: number, qty: number) => {
    const tier = [...DEFAULT_TIERS].reverse().find((t) => qty >= t.minQty) ?? DEFAULT_TIERS[0];
    return basePrice * (1 - tier.discount);
  };

  const totalItems = quoteItems.reduce((s, i) => s + i.qty, 0);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const lines = quoteItems.map((i) => {
      const unitPrice = getTierPrice(i.product.price, i.qty);
      return `${i.product.name} × ${i.qty} @ ${i.product.currency} ${unitPrice.toLocaleString()} = ${i.product.currency} ${(unitPrice * i.qty).toLocaleString()}`;
    });
    const message = `WHOLESALE QUOTE REQUEST:\n${lines.join("\n")}\nTotal units: ${totalItems}\nNotes: ${form.notes || "none"}`;

    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name: form.name, phone: form.phone, email: form.email, message }),
      });
      if (res.ok) setStatus("sent");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const currency = products[0]?.currency ?? "JMD";

  return (
    <section id="wholesale" style={{ padding: "64px 24px", background: "var(--bg-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, margin: "0 0 8px" }}>{heading}</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", margin: 0 }}>Minimum order quantity: 10 units per item. Bulk discounts applied automatically.</p>
        </div>

        {/* Tier badges */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
          {DEFAULT_TIERS.map((t) => (
            <div key={t.minQty} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "var(--bg-card)", fontSize: 13 }}>
              <span style={{ fontWeight: 700 }}>{t.label}</span>
              {t.discount > 0 && <span style={{ fontWeight: 800, color: "var(--accent)" }}>-{(t.discount * 100).toFixed(0)}%</span>}
              {t.discount === 0 && <span style={{ color: "var(--text-muted)" }}>Base price</span>}
            </div>
          ))}
        </div>

        {/* Category filter */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{ padding: "8px 18px", borderRadius: 100, border: activeCategory === cat ? "none" : "1px solid var(--border)", background: activeCategory === cat ? "var(--accent)" : "var(--bg-card)", color: activeCategory === cat ? "var(--accent-fg)" : "var(--text-primary)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {filtered.map((product) => {
            const qty = getQty(product.id);
            const moq = product.moq ?? 10;
            const unitPrice = qty >= moq ? getTierPrice(product.price, qty) : product.price;
            const saving = product.price - unitPrice;
            return (
              <div key={product.id} style={{ background: "var(--bg-card)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                <ProductImage name={product.name} category={product.category} imageUrl={product.image_url} height={180} />
                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {product.category && <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</span>}
                  <p style={{ fontWeight: 700, fontSize: 15, margin: 0 }}>{product.name}</p>
                  {product.description && <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>{product.description}</p>}
                  <div style={{ marginTop: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 17, color: "var(--accent)" }}>{currency} {unitPrice.toLocaleString()}</span>
                    {saving > 0 && <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginLeft: 6 }}>saving {currency} {saving.toLocaleString()}/unit</span>}
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>MOQ: {moq} units</p>

                  {/* Qty stepper */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
                    <button type="button" onClick={() => setItemQty(product, qty === moq ? 0 : Math.max(moq, qty - 1))} disabled={qty <= 0}
                      style={{ width: 32, height: 32, borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg-surface)", cursor: qty > 0 ? "pointer" : "not-allowed", fontSize: 18, opacity: qty > 0 ? 1 : 0.4 }}>-</button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center", fontSize: 15 }}>{qty}</span>
                    <button type="button" onClick={() => setItemQty(product, Math.max(moq, qty + 1))}
                      style={{ width: 32, height: 32, borderRadius: 6, border: "none", background: "var(--accent)", color: "var(--accent-fg)", cursor: "pointer", fontSize: 18, fontWeight: 700 }}>+</button>
                    {qty === 0 && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>min {moq}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating quote basket */}
        {totalItems > 0 && !quoteOpen && (
          <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 50 }}>
            <button onClick={() => setQuoteOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 12, padding: "14px 24px", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              📋 Quote Basket ({totalItems} units)
            </button>
          </div>
        )}

        {/* Quote modal */}
        {quoteOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "min(520px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Wholesale Quote Request</h3>
                <button onClick={() => setQuoteOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
              </div>

              {status === "sent" ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <p style={{ fontSize: 18, fontWeight: 700 }}>Quote request sent!</p>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>We will contact you with pricing and availability within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitQuote} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: 12, fontSize: 13, lineHeight: 1.8 }}>
                    {quoteItems.map((i) => (
                      <div key={i.product.id} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>{i.product.name} × {i.qty}</span>
                        <span style={{ fontWeight: 700 }}>{currency} {(getTierPrice(i.product.price, i.qty) * i.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 8, paddingTop: 8, fontWeight: 800 }}>
                      Total: {totalItems} units
                    </div>
                  </div>
                  <input placeholder="Your Name *" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
                  <input placeholder="Phone / WhatsApp *" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
                  <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14 }} />
                  <textarea placeholder="Delivery address or notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 14, resize: "vertical" }} />
                  {status === "error" && <p style={{ color: "#ef4444", fontSize: 13 }}>Something went wrong. Try again.</p>}
                  {whatsapp && (
                    <button type="button"
                      onClick={() => {
                        const lines = quoteItems.map((i) => `${i.product.name} × ${i.qty}`).join(", ");
                        const msg = `Hi, I would like a wholesale quote.\n\nItems: ${lines}\nTotal: ${totalItems} units\nName: ${form.name}\nPhone: ${form.phone}`;
                        window.open(`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`, "_blank");
                      }}
                      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      💬 Send via WhatsApp
                    </button>
                  )}
                  <button type="submit" disabled={status === "sending"}
                    style={{ background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 10, padding: "12px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    {status === "sending" ? "Sending..." : "Submit Quote Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
