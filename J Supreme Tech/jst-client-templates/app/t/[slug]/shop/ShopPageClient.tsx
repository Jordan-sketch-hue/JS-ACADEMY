"use client";
import { useState } from "react";
import type { ClientConfig } from "@shared/types/config";

interface Product { id: string; name: string; price: number; currency: string; description: string | null; image_url: string | null; category: string | null; }
interface CartItem extends Product { qty: number; }

function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem("ct_cart") ?? "[]"); } catch { return []; }
}
function saveCart(items: CartItem[]) {
  try { localStorage.setItem("ct_cart", JSON.stringify(items)); } catch {}
}

export default function ShopPageClient({ slug, config, products }: { slug: string; config: ClientConfig; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState("");

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category ?? "general")))];
  const visible = filter === "all" ? products : products.filter(p => (p.category ?? "general") === filter);

  const addToCart = (p: Product) => {
    const updated = [...cart];
    const idx = updated.findIndex(i => i.id === p.id);
    if (idx >= 0) updated[idx].qty += 1;
    else updated.push({ ...p, qty: 1 });
    setCart(updated);
    saveCart(updated);
    setToast(p.name + " added to cart");
    setTimeout(() => setToast(""), 2000);
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div style={{ maxWidth: 1152, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>Shop</h1>
        {cart.length > 0 && (
          <a href={"/t/" + slug + "/checkout"} style={{ background: "var(--accent)", color: "var(--accent-fg)", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            Cart ({cart.reduce((s, i) => s + i.qty, 0)}) — {cart[0]?.currency ?? "JMD"} {total.toLocaleString()}
          </a>
        )}
      </div>

      {categories.length > 2 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding: "6px 16px", borderRadius: 20, border: "1px solid var(--border)", background: filter === c ? "var(--accent)" : "var(--bg-card)", color: filter === c ? "var(--accent-fg)" : "var(--text-secondary)", cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
              {c}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "60px 0" }}>No products available yet. Check back soon.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {visible.map(p => (
            <div key={p.id} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", background: "var(--bg-card)" }}>
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image_url} alt={p.name} style={{ width: "100%", height: 200, objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: 200, background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: 13 }}>No image</div>
              )}
              <div style={{ padding: 16 }}>
                <a href={"/t/" + slug + "/product/" + p.id} style={{ fontWeight: 700, color: "var(--text-primary)", textDecoration: "none", fontSize: 15 }}>{p.name}</a>
                {p.description && <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{p.description}</p>}
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 16, color: "var(--accent)" }}>{p.currency} {p.price.toLocaleString()}</span>
                  <button onClick={() => addToCart(p)} style={{ background: "var(--accent)", color: "var(--accent-fg)", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, zIndex: 100 }}>{toast}</div>
      )}
    </div>
  );
}