"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@shared/components/ui/Button";
import type { ClientConfig } from "@shared/types/config";

export type ShopProduct = {
  id: string;
  name: string;
  price: number;
  currency: string;
  description?: string | null;
  image_url?: string | null;
};

type CartItem = ShopProduct & { qty: number };

interface Props {
  config: ClientConfig;
  products: ShopProduct[];
  heading?: string;
}

export function ShopGrid({ config, products, heading = "Shop" }: Props) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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

  // Sync cart count to SiteNav badge + listen for open-cart from bottom nav
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cart-update", { detail: { count: cartCount } }));
  }, [cartCount]);

  useEffect(() => {
    const handler = () => setCartOpen(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const orderSummary = cart.map((i) => `${i.qty}x ${i.name} (${currency} ${(i.price * i.qty).toLocaleString()})`).join(", ");
    const message = `ORDER: ${orderSummary}. Total: ${currency} ${total.toLocaleString()}. Notes: ${form.notes || "none"}`;
    try {
      const res = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: config.name, name: form.name, phone: form.phone, email: form.email, message }),
      });
      if (res.ok) { setStatus("sent"); setCart([]); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (!products.length) return null;

  return (
    <section id="shop" style={{ padding: "64px 24px", background: "var(--bg-surface)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, margin: 0 }}>{heading}</h2>
          {cartCount > 0 && (
            <button onClick={() => setCartOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
              Cart ({cartCount})
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))", gap: 20 }}>
          {products.map((product) => {
            const inCart = cart.find((i) => i.id === product.id);
            return (
              <div key={product.id} style={{ background: "var(--bg-card)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
                {product.image_url
                  ? <img src={product.image_url} alt={product.name} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", flexShrink: 0 }} loading="lazy" />
                  : <div style={{ width: "100%", height: 200, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>
                      {product.name.toLowerCase().includes("cake") || product.name.toLowerCase().includes("pastry") ? "🎂" : "🛍️"}
                    </div>
                }
                <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
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
      </div>

      {cartOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end" }}>
          <div onClick={() => setCartOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "relative", zIndex: 101, background: "#fff", width: "min(400px,100vw)", height: "100vh", overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>Your Cart</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>x</button>
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

      {checkoutOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "min(480px,100%)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Complete Order</h3>
              <button onClick={() => setCheckoutOpen(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer" }}>x</button>
            </div>
            {status === "sent" ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Order Received!</p>
                <p style={{ color: "#6b7280" }}>We will contact you shortly to confirm and arrange delivery.</p>
              </div>
            ) : (
              <form onSubmit={handleCheckout} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "#f9fafb", borderRadius: 8, padding: 12, fontSize: 14, color: "#374151", lineHeight: 1.8 }}>
                  {cart.map((i) => <div key={i.id}>{i.qty}x {i.name} — {currency} {(i.price * i.qty).toLocaleString()}</div>)}
                  <div style={{ fontWeight: 800, marginTop: 8, borderTop: "1px solid #e5e7eb", paddingTop: 8 }}>Total: {currency} {total.toLocaleString()}</div>
                </div>
                <input type="text" placeholder="Your Name *" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="text" placeholder="Phone Number *" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <input type="email" placeholder="Email (optional)" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
                <textarea placeholder="Delivery address or notes" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3}
                  style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15, resize: "vertical" }} />
                {status === "error" && <p style={{ color: "#ef4444", fontSize: 14 }}>Something went wrong. Try again.</p>}
                <Button variant="primary" size="lg" style={{ background: "var(--accent)", color: "var(--accent-fg)" }}>
                  {status === "sending" ? "Placing Order..." : `Place Order · ${currency} ${total.toLocaleString()}`}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
