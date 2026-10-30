"use client";
import { useState, useCallback } from "react";
import { Button } from "@shared/components/ui/Button";
import { ProductImage } from "@shared/components/ui/ProductImage";
import type { ClientConfig } from "@shared/types/config";

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
};

type CartItem = ShopProduct & { qty: number };

interface Props {
  config: ClientConfig;
  products: ShopProduct[];
  heading?: string;
  whatsapp?: string;
  slug?: string;
}

export function ShopGrid({ config, products, heading = "Shop", whatsapp, slug }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [checkoutMethod, setCheckoutMethod] = useState<"whatsapp" | null>(null);

  // Build unique category list from products
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  const addToCart = useCallback((product: ShopProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return removeFromCart(id);
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const currency = cart[0]?.currency ?? (config as { currency?: string }).currency ?? "JMD";
  const cartCount = cart.reduce((n, i) => n + i.qty, 0);

  const buildWaMessage = () => {
    const lines = cart.map((i) => `${i.name} x${i.qty} — ${currency} ${(i.price * i.qty).toLocaleString()}`);
    return [
      `ORDER from ${form.name || "Customer"}`,
      "──────────────",
      ...lines,
      "──────────────",
      `TOTAL: ${currency} ${total.toLocaleString()}`,
      form.phone ? `Phone: ${form.phone}` : "",
      form.notes ? `Notes: ${form.notes}` : "",
    ].filter(Boolean).join("\n");
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const orderSummary = cart.map((i) => `${i.qty}x ${i.name} (${currency} ${(i.price * i.qty).toLocaleString()})`).join(", ");
    const message = `ORDER: ${orderSummary}. Total: ${currency} ${total.toLocaleString()}. Notes: ${form.notes || "none"}`;
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slug ?? (config as { slug?: string }).slug ?? config.name, name: form.name, phone: form.phone, email: form.email, message }),
      });
      if (res.ok) { setStatus("sent"); setCart([]); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const waText = buildWaMessage();
    const orderSummary = cart.map((i) => `${i.qty}x ${i.name} (${currency} ${(i.price * i.qty).toLocaleString()})`).join(", ");
    const dbMessage = `ORDER: ${orderSummary}. Total: ${currency} ${total.toLocaleString()}. Notes: ${form.notes || "none"}`;
    // Post to DB silently — don't block WhatsApp on this
    fetch("/api/submit-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: slug ?? (config as { slug?: string }).slug ?? config.name, name: form.name, phone: form.phone, email: form.email, message: dbMessage }),
    }).catch(() => {});
    const waNum = whatsapp ? whatsapp.replace(/\D/g, "") : "";
    const waUrl = waNum
      ? `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`
      : `https://wa.me/?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");
    setStatus("sent");
    setCart([]);
  };

  return (
    <section id="shop" style={{ padding: "64px 24px", background: "var(--bg-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, margin: 0 }}>{heading}</h2>
          {cartCount > 0 && (
            <button onClick={() => setCartOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              Cart ({cartCount})
            </button>
          )}
        </div>

        {/* Category filter tabs */}
        {categories.length > 1 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 100,
                  border: activeCategory === cat ? "none" : "1px solid var(--border)",
                  background: activeCategory === cat ? "var(--accent)" : "var(--bg-card)",
                  color: activeCategory === cat ? "var(--accent-fg)" : "var(--text-primary)",
                  fontWeight: activeCategory === cat ? 700 : 500,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products grid or Coming Soon */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "var(--text-secondary)" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🛍️</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>
              {activeCategory === "All" ? "Shop Coming Soon" : `No items in ${activeCategory} yet`}
            </p>
            <p style={{ fontSize: 14 }}>
              {activeCategory === "All"
                ? "We're stocking up — check back shortly or contact us to place an order."
                : "Try another category or view all items."}
            </p>
            {activeCategory !== "All" && (
              <button onClick={() => setActiveCategory("All")}
                style={{ marginTop: 16, padding: "10px 24px", borderRadius: 8, background: "var(--accent)", color: "var(--accent-fg)", border: "none", fontWeight: 700, cursor: "pointer" }}>
                View All
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {filtered.map((product) => {
              const inCart = cart.find((i) => i.id === product.id);
              return (
                <div key={product.id} style={{ background: "var(--bg-card)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                  <ProductImage name={product.name} category={product.category} imageUrl={product.image_url} height={200} />
                  <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {product.category && (
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: 1 }}>{product.category}</span>
                    )}
                    <p style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>{product.name}</p>
                    {product.description && <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0, lineHeight: 1.4 }}>{product.description}</p>}
                    <p style={{ fontWeight: 800, fontSize: 18, color: "var(--accent)", margin: 0 }}>{currency} {product.price.toLocaleString()}</p>
                    <button onClick={() => addToCart(product)}
                      style={{ marginTop: "auto", background: inCart ? "#e5e7eb" : "var(--accent)", color: inCart ? "#111" : "var(--accent-fg)", border: "none", borderRadius: 8, padding: "10px 0", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                      {inCart ? `In cart (${inCart.qty}) — Add more` : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart drawer */}
      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "relative", zIndex: 101, background: "#fff", width: "min(400px,100vw)", height: "100vh", overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Your Cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            {cart.length === 0 ? <p style={{ color: "#6b7280" }}>Your cart is empty.</p> : (
              <>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #e5e7eb", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{item.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>{currency} {item.price.toLocaleString()} each</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 16 }}>-</button>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer", fontSize: 16 }}>+</button>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14, minWidth: 70, textAlign: "right" }}>{currency} {(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 18, padding: "12px 0" }}>
                  <span>Total</span><span>{currency} {total.toLocaleString()}</span>
                </div>
                <Button variant="primary" size="lg" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} style={{ background: "var(--accent)", color: "var(--accent-fg)", width: "100%" }}>
                  Checkout
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Checkout modal */}
      {checkoutOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "min(500px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Checkout</h3>
              <button onClick={() => { setCheckoutOpen(false); setCheckoutMethod(null); setStatus("idle"); }} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>×</button>
            </div>

            {/* Order summary */}
            <div style={{ background: "#f9fafb", borderRadius: 8, padding: 12, fontSize: 14, color: "#374151", lineHeight: 1.8, marginBottom: 20 }}>
              {cart.map((i) => <div key={i.id}>{i.qty}x {i.name} — {currency} {(i.price * i.qty).toLocaleString()}</div>)}
              <div style={{ fontWeight: 800, marginTop: 8, borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>Total: {currency} {total.toLocaleString()}</div>
            </div>

            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Order Sent!</p>
                <p style={{ color: "#6b7280", fontSize: 14 }}>
                  {checkoutMethod === "whatsapp"
                    ? "WhatsApp opened with your order. The business will confirm shortly."
                    : "Your order has been received. We will contact you to confirm."}
                </p>
              </div>
            ) : !checkoutMethod ? (
              <>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 14 }}>Choose how to place your order:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* WhatsApp — ACTIVE */}
                  <button onClick={() => setCheckoutMethod("whatsapp")}
                    style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, border: "2px solid #25d366", background: "#f0fdf4", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: 28 }}>💬</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#15803d" }}>Order via WhatsApp</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Send your order directly to the business</p>
                    </div>
                  </button>

                  {/* WiPay — Coming Soon */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", opacity: 0.65, cursor: "not-allowed", position: "relative" }}>
                    <span style={{ fontSize: 28 }}>💳</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Pay with WiPay</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Credit / debit card (JMD)</p>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#fff", background: "#9ca3af", borderRadius: 100, padding: "3px 10px" }}>Coming Soon</span>
                  </div>

                  {/* HandyPay — Coming Soon */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", opacity: 0.65, cursor: "not-allowed", position: "relative" }}>
                    <span style={{ fontSize: 28 }}>📱</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Pay with HandyPay</p>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Mobile money / local payment</p>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, color: "#fff", background: "#9ca3af", borderRadius: 100, padding: "3px 10px" }}>Coming Soon</span>
                  </div>
                </div>
              </>
            ) : (
              /* WhatsApp order form */
              <form onSubmit={handleWhatsAppOrder} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <button type="button" onClick={() => setCheckoutMethod(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 13, padding: 0 }}>← Back</button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>Order via WhatsApp</span>
                </div>
                <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="text" placeholder="Phone / WhatsApp *" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <textarea placeholder="Delivery address or notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, resize: "vertical" }} />
                {status === "error" && <p style={{ color: "#ef4444", fontSize: 14 }}>Something went wrong. Try again.</p>}
                <button type="submit" disabled={status === "sending"}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#25d366", color: "#fff", border: "none", borderRadius: 10, padding: "14px 0", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  💬 {status === "sending" ? "Opening WhatsApp..." : `Send Order via WhatsApp · ${currency} ${total.toLocaleString()}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
