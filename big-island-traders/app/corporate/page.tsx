"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatBot from "@/components/ChatBot";
import LeadForm from "@/components/LeadForm";
import Link from "next/link";

const gold = "#C8A84A";
const slate = "#8AB4C8";

export default function CorporatePage() {
  const [teamSize, setTeamSize] = useState(50);

  const giftCost = teamSize * 850;
  const turnoverCost = teamSize * 0.15 * 2500000;
  const roi = Math.round((turnoverCost / giftCost) * 10) / 10;

  return (
    <>
      <Navbar />
      <CartDrawer />
      <ChatBot />

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: "linear-gradient(160deg, #060C1A 0%, #0D1933 100%)", textAlign: "center", padding: "140px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 60%, rgba(200,168,74,0.06) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
          <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 16, fontFamily: "Montserrat, sans-serif", textTransform: "uppercase" }}>Corporate Solutions</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(32px, 5vw, 60px)", color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
            Gift with purpose.<br />
            <span style={{ color: gold }}>Recognise with impact.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.75, marginBottom: 40, maxWidth: 560, margin: "0 auto 40px", fontFamily: "Georgia, serif" }}>WIAG corporate gifting programs — from team recognition to conference-scale events. Trusted by leading Jamaican companies.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#quote" style={{ backgroundColor: gold, color: "#060C1A", padding: "15px 36px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em" }}>REQUEST A QUOTE</a>
            <a href="https://wa.me/18769999999?text=Hi!%20I%27d%20like%20to%20discuss%20a%20corporate%20WIAG%20gifting%20order." target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#25D366", color: "#fff", padding: "15px 36px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WHATSAPP US
            </a>
            <Link href="/book" style={{ backgroundColor: "transparent", color: "rgba(255,255,255,0.7)", padding: "15px 36px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, border: "1px solid rgba(255,255,255,0.2)" }}>BOOK A CALL</Link>
          </div>
        </div>
      </section>

      {/* Per-person pricing strip */}
      <section style={{ padding: "28px 24px", backgroundColor: "#0A1428", borderTop: `1px solid rgba(200,168,74,0.15)`, borderBottom: `1px solid rgba(200,168,74,0.15)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, textAlign: "center" }}>
          {[
            { label: "Per glass (single)", price: "J$850", note: "~US$5.50" },
            { label: "Per guest — 12-pack", price: "J$800", note: "Save J$50/head" },
            { label: "Per guest — 24-pack", price: "J$750", note: "Save J$100/head" },
            { label: "Per guest — 48-pack", price: "J$700", note: "Best event value" },
          ].map(p => (
            <div key={p.label} style={{ padding: "8px 0" }}>
              <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 22, color: gold }}>{p.price}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{p.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, letterSpacing: "0.04em" }}>{p.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Use case sections */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0D1933" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>
          {[
            {
              badge: "01", title: "Employee Recognition Programs", color: gold,
              desc: "Recognising your team should feel as premium as their contribution. WIAG employee gifting programs are tailored to your headcount, occasion, and brand. Whether it's a quarterly award or annual milestone recognition — we deliver a gift that resonates.",
              points: ["Custom branded WIAG glasses with your logo", "Scalable from 12 to 500+ employees", "Delivery coordinated to your office or event venue", "Dedicated account manager for repeat programs"],
            },
            {
              badge: "02", title: "Event & Conference Gifting", color: slate,
              desc: "Transform your events into experiences. WIAG as a welcome gift, table favour, or closing ceremony gift creates a moment guests remember — and talk about. Every glass becomes a conversation starter.",
              points: ["Welcome packs for conferences and galas", "Branded gift sets for product launches", "VIP lounge and hospitality packages", "Same-day event delivery available"],
            },
            {
              badge: "03", title: "Client Appreciation Packages", color: gold,
              desc: "The right gift builds the right relationships. WIAG client appreciation packages are curated to impress — from quarterly touchpoints to deal-close celebrations. Show clients you value the finer things.",
              points: ["Personalised client gift boxes", "Recurring gifting programs for key accounts", "Executive gift sets with premium packaging", "International delivery coordination available"],
            },
          ].map((item, idx) => (
            <div key={item.badge} style={{ display: "grid", gridTemplateColumns: idx % 2 === 0 ? "1fr 1fr" : "1fr 1fr", gap: 56, alignItems: "center" }} className="corp-section">
              <style>{`@media (max-width: 768px) { .corp-section { grid-template-columns: 1fr !important; } }`}</style>
              <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, color: item.color, letterSpacing: "0.04em" }}>Program {item.badge}</span>
                </div>
                <h2 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3vw, 32px)", color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>{item.title}</h2>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.85, marginBottom: 24 }}>{item.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {item.points.map((p) => (
                    <div key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: item.color, marginTop: 6, flexShrink: 0 }} />
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.6 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ order: idx % 2 === 1 ? 1 : 2, minHeight: 300, background: "linear-gradient(135deg, #0A1428, #060C1A)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${item.color}22`, overflow: "visible" }}>
                <div style={{ textAlign: "center", padding: 32 }}>
                  <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 40, fontWeight: 400, color: item.color, opacity: 0.25, lineHeight: 1, marginBottom: 12 }}>{item.badge}</div>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, color: item.color, letterSpacing: "0.08em" }}>{item.title.split(" ").slice(0, 2).join(" ").toUpperCase()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ROI Calculator */}
      <section style={{ padding: "80px 24px", backgroundColor: "#080F1F" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12, fontFamily: "Montserrat, sans-serif", textTransform: "uppercase" }}>ROI Calculator</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 4vw, 44px)", color: "#fff", margin: 0 }}>The real cost of not gifting.</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 12 }}>Employee turnover costs ~150% of annual salary. Recognition reduces turnover significantly.</p>
          </div>
          <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 40, border: `1px solid rgba(200,168,74,0.2)` }}>
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 500 }}>Team Size</span>
                <span style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20, color: gold }}>{teamSize} employees</span>
              </label>
              <input type="range" min={10} max={500} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))}
                style={{ width: "100%", accentColor: gold, cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>
                <span>10</span><span>500</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {[
                { label: "Annual WIAG Gift Cost", value: `J$${giftCost.toLocaleString()}`, sub: "J$850/person", color: gold },
                { label: "Est. Turnover Cost", value: `J$${(turnoverCost / 1000000).toFixed(1)}M`, sub: "15% annual turnover rate", color: "#C87060" },
                { label: "ROI of Gifting", value: `${roi}x`, sub: "cost saved vs. turnover", color: "#6BAF8A" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center", backgroundColor: "#060C1A", borderRadius: 4, padding: 20, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(18px, 3vw, 28px)", color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: "80px 24px", backgroundColor: "#0D1933" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: slate, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12, fontFamily: "Montserrat, sans-serif", textTransform: "uppercase" }}>How It Works</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 4vw, 44px)", color: "#fff", margin: 0 }}>Corporate order process.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 1, backgroundColor: "rgba(255,255,255,0.04)" }}>
            {[
              { n: "01", t: "Enquire", d: "Submit your quote request or WhatsApp us directly." },
              { n: "02", t: "Consult", d: "We discuss your occasion, team size, and branding needs." },
              { n: "03", t: "Customise", d: "Tailored gifting proposal with samples provided." },
              { n: "04", t: "Deliver", d: "Branded WIAG gifts delivered to your doorstep." },
            ].map((s) => (
              <div key={s.n} style={{ backgroundColor: "#0D1933", padding: 28 }}>
                <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 28, color: gold, opacity: 0.3, marginBottom: 12, lineHeight: 1 }}>{s.n}</div>
                <div style={{ width: 24, height: 1, backgroundColor: gold, marginBottom: 16, opacity: 0.4 }} />
                <h4 style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 15, color: "#fff", marginBottom: 8, margin: "0 0 8px" }}>{s.t}</h4>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section id="quote" style={{ padding: "80px 24px", backgroundColor: "#080F1F" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: gold, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12, fontFamily: "Montserrat, sans-serif", textTransform: "uppercase" }}>Get Started</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 4vw, 44px)", color: "#fff", margin: 0 }}>Request a corporate quote.</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginTop: 12 }}>We respond within 24 business hours with a custom proposal.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Prefer to talk?</span>
              <a href="https://wa.me/18769999999?text=Hi!%20I%27d%20like%20a%20corporate%20WIAG%20quote." target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp us instead
              </a>
            </div>
          </div>
          <LeadForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
