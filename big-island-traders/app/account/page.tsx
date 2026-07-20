"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Order = { id: string; created_at: string; product_name: string; quantity: number; amount_jmd: number; status: string };
type Session = { name: string; email: string };

const DEMO_SESSION: Session = { name: "Tracey-Ann Morris", email: "t.morris@islandrealty.com" };
const DEMO_ORDERS: Order[] = [
  { id: "ord-001", created_at: "2026-07-10T14:22:00Z", product_name: "Gift Box — 24 Pack", quantity: 1, amount_jmd: 18000, status: "delivered" },
  { id: "ord-002", created_at: "2026-07-03T09:11:00Z", product_name: "WIAG Merlot", quantity: 12, amount_jmd: 10200, status: "delivered" },
  { id: "ord-003", created_at: "2026-06-18T16:45:00Z", product_name: "Gift Box — 48 Pack", quantity: 1, amount_jmd: 33600, status: "delivered" },
  { id: "ord-004", created_at: "2026-07-18T11:00:00Z", product_name: "WIAG Rosé", quantity: 6, amount_jmd: 5100, status: "confirmed" },
];

const DEMO_PROFILE = { name: "Tracey-Ann Morris", email: "t.morris@islandrealty.com", phone: "+1 (876) 555-0182", company: "Island Realty Group", address: "14 Kingsway Ave, Kingston 10", notes: "" };

const statusColor: Record<string, string> = {
  pending: "#C8A84A", confirmed: "#8AB4C8", processing: "#5B7FA8", delivered: "#6BAF8A", cancelled: "#C87060",
};

export default function AccountPage() {
  const [session, setSession] = useState<Session>(DEMO_SESSION);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [isDemo, setIsDemo] = useState(true);
  const [tab, setTab] = useState<"orders" | "profile" | "support">("orders");
  const [profile, setProfile] = useState(DEMO_PROFILE);
  const [saved, setSaved] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: "", message: "" });
  const [supportSent, setSupportSent] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("bit_session");
    if (raw) {
      try {
        const s = JSON.parse(raw) as Session;
        setSession(s);
        setIsDemo(false);
        setProfile(p => ({ ...p, name: s.name, email: s.email }));
        fetch(`/api/orders?email=${encodeURIComponent(s.email)}`)
          .then(r => r.ok ? r.json() : [])
          .then(d => { if (Array.isArray(d) && d.length > 0) setOrders(d); })
          .catch(() => {});
      } catch { /**/ }
    }
  }, []);

  const signOut = () => { localStorage.removeItem("bit_session"); window.location.href = "/"; };
  const saveProfile = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const submitSupport = () => { if (!supportForm.subject || !supportForm.message) return; setSupportSent(true); setSupportForm({ subject: "", message: "" }); };
  const reorder = (o: Order) => { window.location.href = `/shop`; };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-JM", { month: "short", day: "numeric", year: "numeric" });
  const totalSpent = orders.reduce((s, o) => s + (o.amount_jmd || 0), 0);
  const initials = session.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const tabStyle = (t: typeof tab): React.CSSProperties => ({
    padding: "10px 22px", border: "none", cursor: "pointer", fontFamily: "Montserrat,sans-serif",
    fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", borderBottom: tab === t ? "2px solid var(--accent)" : "2px solid transparent",
    backgroundColor: "transparent", color: tab === t ? "var(--accent)" : "var(--text-muted)", transition: "all 0.2s",
  });

  const inp: React.CSSProperties = { backgroundColor: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 4, padding: "10px 14px", color: "var(--text-primary)", fontSize: 13, outline: "none", width: "100%", fontFamily: "Inter,sans-serif" };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)", paddingTop: 88 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

          {isDemo && (
            <div style={{ backgroundColor: "rgba(200,168,74,0.08)", border: "1px solid rgba(200,168,74,0.25)", borderRadius: 4, padding: "9px 16px", marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ color: "#C8A84A", fontSize: 10, fontFamily: "Montserrat,sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}>DEMO</span>
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>Showing sample data. Sign in to see your real orders and profile.</span>
            </div>
          )}

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#0A0906", fontFamily: "Montserrat,sans-serif", flexShrink: 0 }}>
                {initials}
              </div>
              <div>
                <p style={{ color: "var(--accent)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "Montserrat,sans-serif", fontWeight: 700, margin: "0 0 4px" }}>My Account</p>
                <h1 style={{ fontFamily: "Georgia,serif", fontWeight: 400, fontSize: 26, color: "var(--text-primary)", fontStyle: "italic", margin: "0 0 3px" }}>Welcome back, {session.name.split(" ")[0]}.</h1>
                <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0 }}>{session.email}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/shop" style={{ padding: "9px 18px", backgroundColor: "var(--accent-alt)", color: "var(--bg-primary)", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em" }}>SHOP</Link>
              <Link href="/book" style={{ padding: "9px 14px", backgroundColor: "transparent", border: "1px solid var(--border-accent)", color: "var(--accent)", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12 }}>BOOK</Link>
              {!isDemo && <button onClick={signOut} style={{ padding: "9px 12px", background: "none", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text-muted)", cursor: "pointer", fontSize: 12 }}>SIGN OUT</button>}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 32 }}>
            {[
              { label: "Total Orders", value: orders.length, c: "var(--accent-alt)" },
              { label: "Total Spent", value: `J$${totalSpent.toLocaleString()}`, c: "var(--accent)" },
              { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, c: "#6BAF8A" },
              { label: "In Progress", value: orders.filter(o => ["pending", "confirmed", "processing"].includes(o.status)).length, c: "#C8A84A" },
            ].map(c => (
              <div key={c.label} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 18px" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 900, fontSize: 22, color: c.c }}>{c.value}</div>
                <div style={{ color: "var(--text-muted)", fontSize: 10, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Montserrat,sans-serif" }}>{c.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 28, display: "flex" }}>
            <button style={tabStyle("orders")} onClick={() => setTab("orders")}>ORDERS</button>
            <button style={tabStyle("profile")} onClick={() => setTab("profile")}>PROFILE</button>
            <button style={tabStyle("support")} onClick={() => setTab("support")}>SUPPORT</button>
          </div>

          {/* ── ORDERS TAB ── */}
          {tab === "orders" && (
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 13, color: "var(--text-primary)", letterSpacing: "0.08em", margin: 0 }}>ORDER HISTORY</h2>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{orders.length} orders</span>
              </div>
              {orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", marginBottom: 14 }}>No orders yet.</p>
                  <Link href="/shop" style={{ color: "var(--accent)", fontSize: 13, textDecoration: "none", fontFamily: "Montserrat,sans-serif", fontWeight: 700 }}>BROWSE THE COLLECTION →</Link>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr>
                        {["Date", "Product", "Qty", "Amount", "Status", ""].map(h => (
                          <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "var(--accent)", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "Montserrat,sans-serif" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id} style={{ borderTop: "1px solid var(--border)" }}>
                          <td style={{ padding: "12px 16px", color: "var(--text-sec)" }}>{fmtDate(o.created_at)}</td>
                          <td style={{ padding: "12px 16px", color: "var(--text-primary)", fontWeight: 500 }}>{o.product_name}</td>
                          <td style={{ padding: "12px 16px", color: "var(--text-sec)" }}>{o.quantity}</td>
                          <td style={{ padding: "12px 16px", color: "var(--accent)", fontWeight: 700 }}>J${o.amount_jmd?.toLocaleString()}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, backgroundColor: `${statusColor[o.status] || "#fff"}22`, color: statusColor[o.status] || "var(--text-muted)", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "Montserrat,sans-serif" }}>
                              {o.status?.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <button onClick={() => reorder(o)} style={{ background: "none", border: "1px solid var(--border-accent)", color: "var(--accent)", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "Montserrat,sans-serif", fontWeight: 700 }}>REORDER</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {tab === "profile" && (
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: 28 }}>
              <h2 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 14, color: "var(--text-primary)", letterSpacing: "0.08em", margin: "0 0 24px" }}>PROFILE DETAILS</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
                {[
                  { label: "Full Name", key: "name" as const },
                  { label: "Email Address", key: "email" as const },
                  { label: "Phone Number", key: "phone" as const },
                  { label: "Company / Organisation", key: "company" as const },
                  { label: "Delivery Address", key: "address" as const },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.06em", fontFamily: "Montserrat,sans-serif", display: "block", marginBottom: 6 }}>{f.label.toUpperCase()}</label>
                    <input style={inp} value={(profile as Record<string, string>)[f.key]} onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.06em", fontFamily: "Montserrat,sans-serif", display: "block", marginBottom: 6 }}>ADDITIONAL NOTES</label>
                  <textarea style={{ ...inp, resize: "vertical", minHeight: 80 }} value={profile.notes} onChange={e => setProfile(p => ({ ...p, notes: e.target.value }))} placeholder="Delivery preferences, branding notes, etc." />
                </div>
              </div>
              <div style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center" }}>
                <button onClick={saveProfile} style={{ backgroundColor: "var(--accent)", color: "#0A0906", border: "none", borderRadius: 4, padding: "10px 24px", fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", cursor: "pointer" }}>SAVE CHANGES</button>
                {saved && <span style={{ color: "#6BAF8A", fontSize: 13, fontFamily: "Montserrat,sans-serif", fontWeight: 600 }}>✓ Saved</span>}
              </div>

              <div style={{ marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                <h3 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: "var(--text-muted)", letterSpacing: "0.1em", margin: "0 0 16px" }}>PREFERENCES</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {["Email me when my order ships", "Send me exclusive offers and new variety announcements", "Monthly gifting inspiration newsletter"].map(pref => (
                    <label key={pref} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)", width: 14, height: 14 }} />
                      <span style={{ color: "var(--text-sec)", fontSize: 13 }}>{pref}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SUPPORT TAB ── */}
          {tab === "support" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14, marginBottom: 28 }}>
                {[
                  { label: "Call Us", value: "876-885-3250", sub: "Mon – Sat, 8AM – 6PM", icon: "📞" },
                  { label: "WhatsApp", value: "@bigislandtraderz", sub: "Usually replies within 1 hour", icon: "💬" },
                  { label: "Email", value: "bigislandtraderz@gmail.com", sub: "Response within 24 hours", icon: "✉" },
                ].map(c => (
                  <div key={c.label} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "18px 20px" }}>
                    <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
                    <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: "var(--accent)", letterSpacing: "0.06em", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ color: "var(--text-primary)", fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{c.value}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: 11 }}>{c.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: 28 }}>
                {supportSent ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{ fontSize: 36, marginBottom: 16 }}>✓</div>
                    <h3 style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontWeight: 400, fontSize: 22, color: "var(--text-primary)", margin: "0 0 8px" }}>Message sent.</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: 14 }}>We will get back to you within 24 hours.</p>
                    <button onClick={() => setSupportSent(false)} style={{ marginTop: 20, background: "none", border: "1px solid var(--border-accent)", color: "var(--accent)", padding: "9px 20px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontFamily: "Montserrat,sans-serif", fontWeight: 700 }}>SEND ANOTHER</button>
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 14, color: "var(--text-primary)", letterSpacing: "0.08em", margin: "0 0 20px" }}>SEND A MESSAGE</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <label style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.06em", fontFamily: "Montserrat,sans-serif", display: "block", marginBottom: 6 }}>SUBJECT</label>
                        <select style={{ ...inp, cursor: "pointer" }} value={supportForm.subject} onChange={e => setSupportForm(f => ({ ...f, subject: e.target.value }))}>
                          <option value="">Select a topic...</option>
                          <option>Order Status</option>
                          <option>Change or Cancel Order</option>
                          <option>Delivery Issue</option>
                          <option>Product Question</option>
                          <option>Corporate Pricing</option>
                          <option>Branding / Custom Packaging</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.06em", fontFamily: "Montserrat,sans-serif", display: "block", marginBottom: 6 }}>MESSAGE</label>
                        <textarea style={{ ...inp, resize: "vertical", minHeight: 120 }} value={supportForm.message} onChange={e => setSupportForm(f => ({ ...f, message: e.target.value }))} placeholder="Describe your issue or question..." />
                      </div>
                      <button onClick={submitSupport} style={{ backgroundColor: "var(--accent-alt)", color: "var(--bg-primary)", border: "none", borderRadius: 4, padding: "12px 24px", fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.06em", cursor: "pointer", alignSelf: "flex-start" }}>
                        SEND MESSAGE
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Reorder CTA */}
          <div style={{ marginTop: 28, padding: "22px 26px", backgroundColor: "var(--bg-secondary)", borderRadius: 6, border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 17, color: "var(--text-primary)", margin: "0 0 4px" }}>Ready for another order?</p>
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>Mix varieties, branded packaging, scheduled delivery.</p>
            </div>
            <Link href="/shop" style={{ backgroundColor: "var(--accent)", color: "#0A0906", padding: "11px 22px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", flexShrink: 0 }}>REORDER NOW</Link>
          </div>

        </div>
      </div>
    </>
  );
}
