"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      style={{ backgroundColor: "#132240", borderRadius: 12, overflow: "hidden", border: "1px solid rgba(91,200,232,0.15)", transition: "transform 0.2s, border-color 0.2s", display: "flex", flexDirection: "column" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(91,200,232,0.4)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(91,200,232,0.15)"; }}
    >
      {/* Product image */}
      <div style={{ height: 220, position: "relative", overflow: "hidden" }}>
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "contrast(1.08) saturate(1.15) brightness(0.92)",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        ) : (
          <div style={{ height: "100%", background: `linear-gradient(135deg, #1B4FBD, #0D1933)` }} className={`bg-gradient-to-br ${product.color}`} />
        )}
        {/* Dark overlay gradient at bottom for text legibility */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(13,25,51,0.85) 0%, transparent 100%)" }} />
        {/* ABV badge */}
        {product.abv && (
          <div style={{ position: "absolute", top: 12, left: 12, backgroundColor: "rgba(13,25,51,0.75)", backdropFilter: "blur(8px)", border: "1px solid rgba(91,200,232,0.3)", color: "#5BC8E8", padding: "3px 9px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>
            {product.abv} ABV
          </div>
        )}
        {product.badge && (
          <div style={{ position: "absolute", top: 12, right: 12, backgroundColor: "#F5C800", color: "#0D1933", padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>
            {product.badge}
          </div>
        )}
        {/* WIAG wordmark bottom of image */}
        <div style={{ position: "absolute", bottom: 10, left: 14 }}>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 11, color: "#fff", letterSpacing: 2, opacity: 0.7 }}>WIAG</span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", marginLeft: 5 }}>WINE IN A GLASS</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 20px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", margin: 0 }}>{product.name}</h3>
        <p style={{ color: "#ffffff70", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{product.description}</p>

        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20, color: "#F5C800" }}>J${product.price.toLocaleString()}</span>
            <span style={{ fontSize: 11, color: "#ffffff50" }}>{product.unit}</span>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 32, height: 36, background: "none", border: "none", color: "#5BC8E8", cursor: "pointer", fontSize: 18 }}>−</button>
              <span style={{ width: 32, textAlign: "center", fontSize: 14, color: "#fff", fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ width: 32, height: 36, background: "none", border: "none", color: "#5BC8E8", cursor: "pointer", fontSize: 18 }}>+</button>
            </div>
            <button
              onClick={handleAdd}
              style={{ flex: 1, backgroundColor: added ? "#22c55e" : "#5BC8E8", color: "#0D1933", border: "none", borderRadius: 6, height: 36, fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer", transition: "background 0.2s", letterSpacing: 0.5 }}
            >
              {added ? "ADDED ✓" : "ADD TO CART"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
