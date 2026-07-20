"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatBot from "@/components/ChatBot";
import ProductCard from "@/components/ProductCard";
import { products, tiers } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

const wineTypes = ["Mixed", "Red", "White", "Sparkling"];
const qtyTiers = [
  { label: "12-pack", qty: 12, price: 9600, per: 800 },
  { label: "24-pack", qty: 24, price: 18000, per: 750 },
  { label: "48-pack", qty: 48, price: 33600, per: 700 },
  { label: "100-pack", qty: 100, price: 65000, per: 650 },
];

export default function ShopPage() {
  const [category, setCategory] = useState<"all" | "single" | "bundle">("all");
  const [wineType, setWineType] = useState("Mixed");
  const [bundleQty, setBundleQty] = useState(qtyTiers[0]);
  const [branding, setBranding] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(false);
  const { addItem } = useCart();

  const filtered = products.filter((p) => category === "all" || p.category === category);

  const bundleTotal = bundleQty.price + (branding ? 100 * bundleQty.qty : 0);

  const addBundle = () => {
    addItem({
      id: `bundle-custom-${bundleQty.qty}`,
      name: `WIAG ${wineType} Bundle — ${bundleQty.label}${branding ? " + Branding" : ""}`,
      price: bundleTotal,
    });
    setBundleAdded(true);
    setTimeout(() => setBundleAdded(false), 1500);
  };

  return (
    <>
      <Navbar />
      <CartDrawer />
      <ChatBot />

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 60, backgroundColor: "#0A1428", padding: "120px 24px 60px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <p style={{ color: "#5BC8E8", fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>SHOP</p>
          <h1 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(32px, 5vw, 56px)", color: "#fff", margin: "0 0 16px" }}>WIAG Products & Bundles</h1>
          <p style={{ color: "#ffffff70", fontSize: 16, maxWidth: 500 }}>Premium 187ml RTD wine — single glasses to corporate 500+ packs. All Jamaican.</p>
        </div>
      </section>

      <div style={{ backgroundColor: "#0D1933", padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr", gap: 40 }} className="shop-grid">
          <style>{`@media (max-width: 900px) { .shop-grid { grid-template-columns: 1fr !important; } }`}</style>

          {/* Sidebar */}
          <div>
            <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 24, border: "1px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 11, color: "rgba(200,168,74,0.7)", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>Category</h3>
              {[["all", "All Products"], ["single", "Single Glasses"], ["bundle", "Gift Bundles"]].map(([val, label]) => (
                <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                  <input type="radio" name="cat" checked={category === val} onChange={() => setCategory(val as "all" | "single" | "bundle")} style={{ accentColor: "#C8A84A" }} />
                  <span style={{ color: category === val ? "#C8A84A" : "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: category === val ? 700 : 400 }}>{label}</span>
                </label>
              ))}
            </div>

            {/* Pricing table */}
            <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 24, border: "1px solid rgba(255,255,255,0.07)" }}>
              <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 11, color: "rgba(200,168,74,0.7)", letterSpacing: "0.1em", marginBottom: 16, textTransform: "uppercase" }}>Per-Guest Pricing</h3>
              {tiers.map((t) => (
                <div key={t.qty} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: t.highlight ? "#C8A84A" : "rgba(255,255,255,0.55)", fontWeight: t.highlight ? 700 : 400 }}>{t.qty}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: t.highlight ? "#C8A84A" : "rgba(255,255,255,0.75)", fontWeight: 600 }}>{t.price}</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{t.per}</div>
                  </div>
                </div>
              ))}
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 12, lineHeight: 1.6 }}>Larger orders = lower cost per guest. Perfect for events.</p>
            </div>
          </div>

          {/* Product grid */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24, marginBottom: 56 }}>
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>

            {/* Bundle builder */}
            <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 36, border: "1px solid rgba(200,168,74,0.2)" }}>
              <div style={{ marginBottom: 28 }}>
                <p style={{ color: "#C8A84A", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", marginBottom: 8, fontFamily: "Montserrat, sans-serif", textTransform: "uppercase" }}>Bundle Builder</p>
                <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: 28, color: "#fff", margin: 0 }}>Build Your Corporate Bundle</h2>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 8 }}>Customise your order — select wine type, quantity, and branding options.</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>Wine Type</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {wineTypes.map((w) => (
                      <button key={w} onClick={() => setWineType(w)}
                        style={{ padding: "8px 16px", borderRadius: 4, border: `1px solid ${wineType === w ? "#C8A84A" : "rgba(255,255,255,0.1)"}`, backgroundColor: wineType === w ? "rgba(200,168,74,0.12)" : "transparent", color: wineType === w ? "#C8A84A" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 8, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>Quantity Tier</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {qtyTiers.map((q) => (
                      <button key={q.label} onClick={() => setBundleQty(q)}
                        style={{ padding: "8px 16px", borderRadius: 4, border: `1px solid ${bundleQty.label === q.label ? "#C8A84A" : "rgba(255,255,255,0.1)"}`, backgroundColor: bundleQty.label === q.label ? "rgba(200,168,74,0.12)" : "transparent", color: bundleQty.label === q.label ? "#C8A84A" : "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "Montserrat, sans-serif" }}>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", marginBottom: 24 }}>
                <input type="checkbox" checked={branding} onChange={(e) => setBranding(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#C8A84A" }} />
                <div>
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 600 }}>Add custom branding</span>
                  <span style={{ color: "#C8A84A", fontSize: 13, marginLeft: 8 }}>+J$100/unit</span>
                </div>
              </label>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.07)", marginBottom: 20 }}>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{bundleQty.qty} units × J${bundleQty.per}{branding ? ` + J$100 branding` : ""}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 28, color: "#C8A84A", marginTop: 4 }}>J${bundleTotal.toLocaleString()}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 3 }}>= J${bundleQty.per}/guest at your event</div>
                </div>
                <button onClick={addBundle}
                  style={{ backgroundColor: bundleAdded ? "#22c55e" : "#5BC8E8", color: "#0D1933", border: "none", borderRadius: 8, padding: "14px 28px", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "background 0.2s" }}>
                  {bundleAdded ? "ADDED ✓" : "ADD TO CART"}
                </button>
              </div>
              <p style={{ color: "#ffffff50", fontSize: 12 }}>For 500+ unit orders, <a href="/book" style={{ color: "#5BC8E8", textDecoration: "none" }}>book a consultation</a> for custom pricing and white-glove delivery.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
