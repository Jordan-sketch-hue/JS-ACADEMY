"use client";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import Link from "next/link";

// TODO: Replace with real WhatsApp number when live
const WA_NUMBER = "18769999999";

type CheckoutStep = "cart" | "details" | "wipay";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQty, total, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [details, setDetails] = useState({ name: "", phone: "", email: "", address: "", parish: "" });

  const gold = "#C8A84A";
  const set = (k: string, v: string) => setDetails(f => ({ ...f, [k]: v }));

  const inp: React.CSSProperties = {
    width: "100%", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4, padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "Inter, sans-serif",
  };

  const buildWAMessage = () => {
    const lines = items.map(i => `• ${i.name} ×${i.quantity} — J$${(i.price * i.quantity).toLocaleString()}`).join("\n");
    return encodeURIComponent(`Hi! I'd like to place an order.\n\n${lines}\n\nTotal: J$${total.toLocaleString()}\n\nName: ${details.name}\nPhone: ${details.phone}\nDelivery: ${details.address}, ${details.parish}`);
  };

  const close = () => { setIsOpen(false); setTimeout(() => setStep("cart"), 300); };

  const PARISHES = ["Kingston", "St. Andrew", "St. Thomas", "Portland", "St. Mary", "St. Ann", "Trelawny", "St. James", "Hanover", "Westmoreland", "St. Elizabeth", "Manchester", "Clarendon", "St. Catherine"];

  return (
    <>
      {isOpen && <div onClick={close} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 200, backdropFilter: "blur(2px)" }} />}

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 400, maxWidth: "100vw",
        backgroundColor: "#0A1428", zIndex: 201, boxShadow: "-4px 0 40px rgba(0,0,0,0.6)",
        borderLeft: "1px solid rgba(255,255,255,0.07)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, color: "#fff", margin: 0, letterSpacing: "0.06em" }}>
              {step === "cart" ? "YOUR ORDER" : step === "details" ? "DELIVERY DETAILS" : "CHECKOUT"}
            </h2>
            {step === "cart" && <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, margin: 0, marginTop: 2 }}>{items.length} item{items.length !== 1 ? "s" : ""}</p>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {step !== "cart" && (
              <button onClick={() => setStep(step === "wipay" ? "details" : "cart")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 11, padding: "5px 10px", borderRadius: 3, fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>← BACK</button>
            )}
            <button onClick={close} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 20, lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* ── CART STEP ── */}
        {step === "cart" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                  <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 32, color: "rgba(200,168,74,0.3)", marginBottom: 12 }}>Empty</div>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13 }}>No items in your order yet.</p>
                  <Link href="/shop" onClick={close} style={{ display: "inline-block", marginTop: 16, backgroundColor: gold, color: "#060C1A", padding: "10px 22px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em" }}>
                    BROWSE PRODUCTS
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {items.map((item) => (
                    <div key={item.id} style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: "#fff", margin: 0 }}>{item.name}</h4>
                        <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", fontSize: 14 }}>✕</button>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 0, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                          <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{ width: 28, height: 28, background: "none", border: "none", color: gold, cursor: "pointer", fontSize: 16 }}>−</button>
                          <span style={{ width: 28, textAlign: "center", fontSize: 13, color: "#fff", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{ width: 28, height: 28, background: "none", border: "none", color: gold, cursor: "pointer", fontSize: 16 }}>+</button>
                        </div>
                        <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, color: gold, fontSize: 15 }}>J${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: "18px 22px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Subtotal</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 22, color: gold }}>J${total.toLocaleString()}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginBottom: 14 }}>~US${Math.round(total / 155).toLocaleString()} · Delivery calculated at next step</p>

                <button onClick={() => setStep("details")} style={{ display: "block", width: "100%", backgroundColor: gold, color: "#060C1A", padding: "14px", borderRadius: 4, border: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", marginBottom: 10 }}>
                  PROCEED TO CHECKOUT
                </button>
                <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Hi! I'd like to order:\n${items.map(i => `• ${i.name} ×${i.quantity} — J$${(i.price * i.quantity).toLocaleString()}`).join("\n")}\n\nTotal: J$${total.toLocaleString()}`)}`} target="_blank" rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", backgroundColor: "#25D366", color: "#fff", padding: "12px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", marginBottom: 10, boxSizing: "border-box" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  ORDER ON WHATSAPP INSTEAD
                </a>
                <button onClick={clearCart} style={{ width: "100%", background: "none", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", padding: "9px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "Montserrat, sans-serif" }}>
                  Clear Cart
                </button>
              </div>
            )}
          </>
        )}

        {/* ── DETAILS STEP ── */}
        {step === "details" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px" }}>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>Your delivery details. Order total: <strong style={{ color: gold }}>J${total.toLocaleString()}</strong></p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>Full Name *</label><input required style={inp} value={details.name} onChange={e => set("name", e.target.value)} placeholder="Jane Smith" /></div>
                <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>WhatsApp / Phone *</label><input required style={inp} value={details.phone} onChange={e => set("phone", e.target.value)} placeholder="876-000-0000" /></div>
                <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>Email</label><input type="email" style={inp} value={details.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" /></div>
                <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>Parish</label>
                  <select style={{ ...inp, cursor: "pointer" }} value={details.parish} onChange={e => set("parish", e.target.value)}>
                    <option value="">Select parish</option>
                    {PARISHES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div><label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "rgba(200,168,74,0.7)", marginBottom: 5, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat, sans-serif" }}>Delivery Address *</label><input required style={inp} value={details.address} onChange={e => set("address", e.target.value)} placeholder="Street address or office" /></div>
              </div>

              {/* Delivery info */}
              <div style={{ marginTop: 20, backgroundColor: "#0D1933", borderRadius: 4, padding: 16, border: "1px solid rgba(200,168,74,0.12)" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 10, color: "rgba(200,168,74,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Delivery Info</p>
                {[["Kingston & St. Andrew", "Same-day if ordered before 12pm"], ["All 14 Parishes", "Next-day delivery available"], ["Corporate / Events", "Coordinated delivery to venue"], ["No refrigeration required", "Shelf-stable · Sealed at origin"]].map(([t, d]) => (
                  <div key={t} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: gold, flexShrink: 0, marginTop: 5 }} />
                    <div><span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>{t}</span><span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}> — {d}</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px 22px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <button onClick={() => { if (details.name && details.phone && details.address) setStep("wipay"); }}
                style={{ display: "block", width: "100%", backgroundColor: gold, color: "#060C1A", padding: "14px", borderRadius: 4, border: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", marginBottom: 10 }}>
                CONTINUE TO PAYMENT
              </button>
              <a href={`https://wa.me/${WA_NUMBER}?text=${buildWAMessage()}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", backgroundColor: "#25D366", color: "#fff", padding: "12px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", boxSizing: "border-box" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                SEND ORDER ON WHATSAPP
              </a>
            </div>
          </>
        )}

        {/* ── WIPAY STEP ── */}
        {step === "wipay" && (
          <>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 22px", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Order summary */}
              <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 10, color: "rgba(200,168,74,0.6)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Order Summary</p>
                {items.map(i => (
                  <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{i.name} ×{i.quantity}</span>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>J${(i.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, marginTop: 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Total</span>
                  <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 20, color: gold }}>J${total.toLocaleString()}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 4 }}>~US${Math.round(total / 155).toLocaleString()} at current rate</p>
              </div>

              {/* WiPay placeholder */}
              <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 24, border: "1px solid rgba(200,168,74,0.2)", textAlign: "center" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(200,168,74,0.1)", border: "1px solid rgba(200,168,74,0.25)", borderRadius: 4, padding: "6px 14px", marginBottom: 16 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C8A84A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span style={{ color: gold, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "Montserrat, sans-serif" }}>WIPAY ONLINE PAYMENT — COMING SOON</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.65, marginBottom: 0 }}>Online card payment via WiPay Jamaica is being set up. In the meantime, complete your order on WhatsApp — fastest option — or pay by bank transfer.</p>
              </div>

              {/* WhatsApp order */}
              <a href={`https://wa.me/${WA_NUMBER}?text=${buildWAMessage()}`} target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#25D366", color: "#fff", padding: "16px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.08em" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                COMPLETE ORDER ON WHATSAPP
              </a>

              {/* Bank transfer fallback */}
              <div style={{ backgroundColor: "#060C1A", borderRadius: 4, padding: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Bank Transfer Option</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.65, margin: 0 }}>NCB Jamaica · Big Island Traders<br/>Account # provided on WhatsApp confirmation.<br/>Send proof of payment to confirm your order.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
