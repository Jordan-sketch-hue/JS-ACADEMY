import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import ChatBot from "@/components/ChatBot";
import { products } from "@/lib/products";

const singleProducts = products.filter((p) => p.category === "single");

const testimonials = [
  { name: "Michelle T.", role: "HR Manager, Kingston Corp", text: "We gifted WIAG to our entire team of 85 for the year-end party. Every single person loved it. The presentation was premium and the ordering process was seamless." },
  { name: "Omar B.", role: "Events Director, Grand Palladium", text: "Our conference guests were blown away. WIAG as a welcome gift set the tone perfectly. Big Island Traders delivered on every promise." },
  { name: "Tracey-Ann M.", role: "CEO, Island Realty Group", text: "We use WIAG for all our client appreciation packages now. The branding option is perfect — our logo on every glass. Clients call it unforgettable." },
];

const useCases = [
  {
    title: "Employee Recognition",
    desc: "Reward top performers with a gift they will actually remember. Premium, personal, and professional.",
    svg: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 2L17.09 9.26L25 10.27L19.5 15.64L20.9 23.5L14 19.77L7.1 23.5L8.5 15.64L3 10.27L10.91 9.26L14 2Z" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  },
  {
    title: "Holiday Gift Kits",
    desc: "Make your team's holiday unforgettable. Custom branded WIAG boxes — unwrapped, not just given.",
    svg: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="12" width="22" height="13" rx="1.5" stroke="var(--accent-alt)" strokeWidth="1.6"/><path d="M3 12H25V15H3V12Z" stroke="var(--accent-alt)" strokeWidth="1.6"/><path d="M14 12V25" stroke="var(--accent-alt)" strokeWidth="1.6"/><path d="M14 12C14 12 10 8 10 6C10 4.9 10.9 4 12 4C13.1 4 14 5 14 6" stroke="var(--accent-alt)" strokeWidth="1.6" strokeLinecap="round"/><path d="M14 12C14 12 18 8 18 6C18 4.9 17.1 4 16 4C14.9 4 14 5 14 6" stroke="var(--accent-alt)" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    title: "Events & Galas",
    desc: "Conferences, launches, and galas. WIAG turns every attendee into a brand ambassador from the first sip.",
    svg: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M9 3H19L17 14C17 16.2 15.7 18 14 18C12.3 18 11 16.2 11 14L9 3Z" stroke="var(--accent-alt)" strokeWidth="1.6" strokeLinejoin="round"/><path d="M14 18V24" stroke="var(--accent-alt)" strokeWidth="1.6" strokeLinecap="round"/><path d="M10 24H18" stroke="var(--accent-alt)" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  },
  {
    title: "Client Appreciation",
    desc: "Close deals and strengthen partnerships with a gift that signals taste, not obligation.",
    svg: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 15L10.5 20.5L23 8" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="14" cy="14" r="11" stroke="var(--accent)" strokeWidth="1.4" strokeDasharray="2 2"/></svg>,
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <CartDrawer />

      {/* ── HERO ── */}
      <section style={{ height: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", backgroundColor: "#060C1A" }}>
        <img
          src="/images/wiag-hero-girls.jpg"
          alt="WIAG — Wine In A Glass"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 25%", filter: "contrast(1.08) saturate(1.1) brightness(0.32)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(6,12,26,0.97) 0%, rgba(6,12,26,0.82) 45%, rgba(6,12,26,0.12) 100%)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1, width: "100%", paddingTop: 68 }}>
          <div style={{ maxWidth: 580 }}>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(38px, 5.5vw, 74px)", lineHeight: 1.06, color: "#ffffff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
              The wine.<br />The glass.
            </h1>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(38px, 5.5vw, 74px)", lineHeight: 1.06, color: "var(--accent)", margin: "0 0 28px", letterSpacing: "-0.01em", fontStyle: "italic" }}>
              One.
            </h1>
            <p style={{ fontSize: "clamp(14px, 1.6vw, 17px)", color: "rgba(255,255,255,0.65)", lineHeight: 1.85, marginBottom: 44, maxWidth: 460, fontFamily: "Georgia, serif" }}>
              WIAG is 187ml of premium Australian wine sealed inside its own real stemless glass. No bottle. No corkscrew. No separate vessel. Just open and savour.
            </p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/shop" style={{ backgroundColor: "var(--accent)", color: "#060C1A", padding: "15px 36px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
                SHOP WIAG
              </Link>
              <a href="https://wa.me/18769999999?text=Hi!%20I%27d%20like%20to%20order%20WIAG." target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "transparent", color: "#fff", padding: "14px 28px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", border: "1px solid rgba(255,255,255,0.2)", display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <section className="t-trust" style={{ padding: "28px 24px", borderTop: "1px solid var(--border-accent)", borderBottom: "1px solid var(--border-accent)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { value: "187ml", label: "Per Glass — Exact Serve" },
            { value: "100%", label: "Imported Australian Wine" },
            { value: "4", label: "Varieties — Merlot, Cab, Rosé, Moscato" },
            { value: "JA + INT'L", label: "Jamaica & Diaspora Delivery" },
          ].map((s) => (
            <div key={s.value} style={{ padding: "8px 0" }}>
              <div className="t-accent-alt" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: "clamp(20px, 3vw, 32px)", letterSpacing: "-0.01em" }}>{s.value}</div>
              <div className="t-muted-text" style={{ fontSize: 11, marginTop: 5, letterSpacing: "0.04em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ── */}
      <section className="t-sec" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p className="t-accent-alt" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Montserrat, sans-serif" }}>The Collection</p>
            <h2 className="t-primary-text" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(28px, 4vw, 46px)", margin: "0 0 10px", fontStyle: "italic" }}>Four expressions. Every occasion.</h2>
            <p className="t-muted-text" style={{ fontSize: 14, maxWidth: 480, lineHeight: 1.7, margin: 0 }}>Merlot, Cabernet Sauvignon, Rosé, Moscato. 187ml each. Sealed, premium, ready to gift.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {singleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div style={{ marginTop: 44 }}>
            <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--accent-alt)", textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em", borderBottom: "1px solid var(--border-cyan)", paddingBottom: 2 }}>
              VIEW ALL PRODUCTS & GIFT BUNDLES
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="var(--accent-alt)" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="t-alt" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Montserrat, sans-serif" }}>The Process</p>
            <h2 className="t-primary-text" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(26px, 4vw, 44px)", margin: 0, fontStyle: "italic" }}>Three steps. Zero friction.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 0 }}>
            {[
              { step: "01", title: "Select", desc: "Choose from Merlot, Cabernet Sauvignon, Rosé, or Moscato. Single units to 500+ packs." },
              { step: "02", title: "Customise", desc: "Mix varieties. Add branded packaging. Set your delivery date." },
              { step: "03", title: "Delivered", desc: "Your WIAG gift arrives beautifully packaged, ready to hand out." },
            ].map((s, i) => (
              <div key={s.step} style={{ padding: "40px 32px", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div className="t-accent" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, marginBottom: 20, letterSpacing: "0.04em" }}>{s.step}</div>
                <div style={{ width: 32, height: 1, backgroundColor: "var(--accent)", marginBottom: 20, opacity: 0.5 }} />
                <h3 className="t-primary-text" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 12, margin: "0 0 12px" }}>{s.title}</h3>
                <p className="t-muted-text" style={{ fontSize: 14, lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="t-sec" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p className="t-accent-alt" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Montserrat, sans-serif" }}>Use Cases</p>
            <h2 className="t-primary-text" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(26px, 4vw, 44px)", margin: 0, fontStyle: "italic" }}>Perfect for every occasion.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 1, backgroundColor: "var(--border)" }}>
            {useCases.map((u) => (
              <div key={u.title} className="t-sec" style={{ padding: "36px 28px" }}>
                <div style={{ marginBottom: 20 }}>{u.svg}</div>
                <h3 className="t-primary-text" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 10, margin: "0 0 10px", letterSpacing: "0.01em" }}>{u.title}</h3>
                <p className="t-muted-text" style={{ fontSize: 13, lineHeight: 1.75, margin: 0 }}>{u.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL FULL-BLEED ── */}
      <section style={{ position: "relative", height: 480, overflow: "hidden" }}>
        <img
          src="/images/wiag-rose-cooler.jpg"
          alt="WIAG Rosé — ready anywhere"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", filter: "contrast(1.1) saturate(1.2) brightness(0.55)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(6,12,26,0.92) 0%, rgba(6,12,26,0.4) 60%, transparent 100%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 10vw" }}>
          <div style={{ maxWidth: 500 }}>
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(22px, 3.5vw, 38px)", color: "#fff", lineHeight: 1.35, margin: "0 0 24px" }}>
              &ldquo;Some people bring wine. You bring WIAG.&rdquo;
            </p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0, fontFamily: "Montserrat, sans-serif" }}>WIAG Rosé · 13% ABV · Premium Australian</p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="t-alt" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 56 }}>
            <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Montserrat, sans-serif" }}>Client Testimonials</p>
            <h2 className="t-primary-text" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(26px, 4vw, 44px)", margin: 0, fontStyle: "italic" }}>Trusted by companies across Jamaica.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1, backgroundColor: "var(--border)" }}>
            {testimonials.map((t, i) => (
              <div key={i} className="t-alt" style={{ padding: "36px 32px" }}>
                <div className="t-quote-mark" style={{ fontFamily: "Georgia, serif", fontSize: 48, lineHeight: 1, marginBottom: 16, color: "var(--quote-mark)", userSelect: "none" }}>&ldquo;</div>
                <p className="t-sec-text" style={{ fontSize: 14, lineHeight: 1.85, margin: "0 0 28px", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{t.text}</p>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
                  <div className="t-accent-alt" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                  <div className="t-muted-text" style={{ fontSize: 11, marginTop: 3, letterSpacing: "0.04em" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIND IN STORE ── */}
      <section className="t-alt" style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 44 }}>
            <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Montserrat, sans-serif" }}>Available Now</p>
            <h2 className="t-primary-text" style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "clamp(24px, 3.5vw, 40px)", margin: 0, fontStyle: "italic" }}>Find WIAG in Jamaica.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 1, backgroundColor: "var(--border)" }}>
            {[
              {
                name: "General Foods Kingston",
                type: "Retail Stockist",
                detail: "Kingston, Jamaica",
                note: "WIAG available in-store — all 4 varieties",
                cta: null,
              },
              {
                name: "Master Mac Food Store",
                type: "Retail Stockist",
                detail: "108-110 Constant Spring Road, Kingston",
                note: "Walk in and pick up your glass",
                cta: "Get directions",
                href: "https://maps.google.com/?q=108+Constant+Spring+Road+Kingston+Jamaica",
              },
              {
                name: "Order Online",
                type: "Delivery — All Parishes",
                detail: "Delivered to your door across Jamaica",
                note: "Kingston same-day before 12pm · All parishes next-day",
                cta: "Shop now",
                href: "/shop",
              },
              {
                name: "Order on WhatsApp",
                type: "Fastest Option",
                detail: "Message us your order directly",
                note: "No account needed · Instant confirmation",
                cta: "WhatsApp us",
                href: `https://wa.me/18769999999?text=Hi!%20I%27d%20like%20to%20order%20WIAG.`,
              },
            ].map((s) => (
              <div key={s.name} className="t-alt" style={{ padding: "32px 28px" }}>
                <p className="t-accent" style={{ fontFamily: "Montserrat, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{s.type}</p>
                <h3 className="t-primary-text" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 6, margin: "0 0 6px" }}>{s.name}</h3>
                <p className="t-muted-text" style={{ fontSize: 12, marginBottom: 6, lineHeight: 1.5 }}>{s.detail}</p>
                <p className="t-muted-text" style={{ fontSize: 12, marginBottom: s.cta ? 16 : 0, opacity: 0.6, lineHeight: 1.5 }}>{s.note}</p>
                {s.cta && s.href && (
                  <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent)", textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em" }}>
                    {s.cta} →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY INFO ── */}
      <section className="t-trust" style={{ padding: "56px 24px", borderTop: "1px solid var(--border-accent)", borderBottom: "1px solid var(--border-accent)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12, fontFamily: "Montserrat, sans-serif" }}>Delivery Coverage</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                {[
                  { area: "Kingston & St. Andrew", time: "Same-day — order before 12pm" },
                  { area: "St. Catherine, Portmore", time: "Same-day or next-day" },
                  { area: "All 14 Parishes", time: "Next-day delivery" },
                  { area: "Corporate / Events", time: "Scheduled delivery to venue" },
                ].map(d => (
                  <div key={d.area} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span className="t-primary-text" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12 }}>{d.area}</span>
                    <span className="t-muted-text" style={{ fontSize: 11 }}>{d.time}</span>
                  </div>
                ))}
              </div>
            </div>
            <a href={`https://wa.me/18769999999?text=Hi!%20I%27d%20like%20to%20check%20delivery%20to%20my%20area.`} target="_blank" rel="noopener noreferrer"
              style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "#25D366", color: "#fff", padding: "13px 22px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              CHECK DELIVERY
            </a>
          </div>
        </div>
      </section>

      {/* ── WHOLESALER STRIP ── */}
      <section className="t-trust" style={{ padding: "64px 24px", borderTop: "1px solid var(--border-accent)", borderBottom: "1px solid var(--border-accent)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, margin: "0 0 8px", fontFamily: "Montserrat, sans-serif" }}>For Retailers · Hotels · Venues</p>
            <h3 className="t-primary-text" style={{ fontFamily: "Georgia, serif", fontWeight: 400, fontSize: "clamp(20px, 3vw, 28px)", margin: 0, fontStyle: "italic" }}>WIAG belongs on your shelf.</h3>
            <p className="t-muted-text" style={{ fontSize: 13, margin: "10px 0 0", maxWidth: 480, lineHeight: 1.7 }}>Single-serve premium RTD wine drives impulse purchase. Fast-moving, front-shelf worthy, with a loyal base of corporate buyers. Wholesale pricing available.</p>
          </div>
          <Link href="/book" style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 10, backgroundColor: "var(--accent)", color: "#060C1A", padding: "14px 28px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>
            ENQUIRE WHOLESALE
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="#060C1A" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </Link>
        </div>
      </section>

      {/* ── AUS PROVENANCE ── */}
      <section className="t-sec" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="aus-grid">
          <style>{`.aus-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }`}</style>
          <div>
            <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16, fontFamily: "Montserrat, sans-serif" }}>Why Australian?</p>
            <h2 className="t-primary-text" style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 3.5vw, 42px)", margin: "0 0 20px", lineHeight: 1.2 }}>The world's most awarded wine-growing regions.</h2>
            <p className="t-sec-text" style={{ fontSize: 14, lineHeight: 1.85, marginBottom: 20 }}>Australia's wine industry produces some of the most consistent, internationally recognised wines on the planet — Barossa Valley Shiraz, Clare Valley Riesling, Margaret River Cabernet. WIAG sources from these same regions, sealed and delivered to Jamaica at 187ml perfection.</p>
            <p className="t-sec-text" style={{ fontSize: 14, lineHeight: 1.85, marginBottom: 28 }}>No compromise on quality. Every glass is sealed at origin, preserving flavour from vineyard to first sip.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {["Consistent vintage quality", "Internationally certified", "Sealed at Australian winery", "Full-flavour preservation"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--accent)", flexShrink: 0 }} />
                  <span className="t-muted-text" style={{ fontSize: 12 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: "relative", height: 380, overflow: "hidden", borderRadius: 4 }}>
            <img src="/images/wiag-cabernat.jpg" alt="WIAG Cabernet Sauvignon — Australian Premium" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "contrast(1.08) saturate(1.12) brightness(0.8)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px", background: "linear-gradient(to top, rgba(6,12,26,0.95) 0%, transparent 100%)" }}>
              <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 13, color: "rgba(237,228,204,0.9)", margin: 0 }}>Imported from Australia's premium wine country</p>
              <p style={{ color: "var(--accent)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", margin: "4px 0 0", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>Cabernet Sauvignon · 13.5% ABV</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIASPORA / INTERNATIONAL ── */}
      <section style={{ padding: "80px 24px", backgroundColor: "#080F1F", borderTop: "1px solid rgba(200,168,74,0.12)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }} className="diaspora-grid">
            <style>{`.diaspora-grid { @media (max-width: 768px) { grid-template-columns: 1fr !important; } }`}</style>
            <div>
              <p style={{ color: "var(--accent-alt)", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16, fontFamily: "Montserrat, sans-serif" }}>For the Jamaican Diaspora</p>
              <h2 style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(26px, 3.5vw, 40px)", color: "#fff", margin: "0 0 18px", lineHeight: 1.2 }}>Send WIAG home.</h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.85, marginBottom: 24 }}>Based in the US, UK, or Canada? Order WIAG as a gift for family, friends, or business partners back in Jamaica. Premium Australian wine, delivered to any address across the island.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                {[
                  ["Send a 12-pack to your family for Christmas — J$9,600"],
                  ["Gift a colleague at their Kingston office — from J$850"],
                  ["Corporate gifting for your JA-based team — custom bundles"],
                ].map(([t]) => (
                  <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "var(--accent-alt)", flexShrink: 0, marginTop: 6 }} />
                    <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, lineHeight: 1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="https://wa.me/18769999999?text=Hi!%20I%27m%20in%20the%20diaspora%20and%20want%20to%20send%20WIAG%20to%20Jamaica." target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#25D366", color: "#fff", padding: "13px 24px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  SEND WIAG HOME
                </a>
                <a href="mailto:bigislandtraderz@gmail.com" style={{ backgroundColor: "transparent", color: "rgba(255,255,255,0.7)", padding: "13px 24px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", border: "1px solid rgba(255,255,255,0.2)" }}>
                  EMAIL US
                </a>
              </div>
            </div>
            <div style={{ backgroundColor: "#0D1933", borderRadius: 4, padding: 36, border: "1px solid rgba(200,168,74,0.15)" }}>
              <p style={{ color: "var(--accent)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Montserrat, sans-serif" }}>Diaspora Pricing Guide</p>
              {[
                { label: "Single Glass", jmd: "J$850", usd: "~US$5.50" },
                { label: "12-Pack Gift Box", jmd: "J$9,600", usd: "~US$62" },
                { label: "24-Pack Gift Box", jmd: "J$18,000", usd: "~US$116" },
                { label: "48-Pack Box", jmd: "J$33,600", usd: "~US$216" },
              ].map(p => (
                <div key={p.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{p.label}</span>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Montserrat, sans-serif" }}>{p.jmd}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>{p.usd}</div>
                  </div>
                </div>
              ))}
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, marginTop: 14, lineHeight: 1.6 }}>USD conversions approximate at current JMD rate. Payment via WiPay or bank transfer. Delivery within Jamaica.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="t-sec" style={{ padding: "96px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,200,232,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <p className="t-accent" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 20, fontFamily: "Montserrat, sans-serif" }}>Ready to Gift?</p>
          <h2 className="t-primary-text" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: "clamp(30px, 5vw, 54px)", marginBottom: 16, fontStyle: "italic", lineHeight: 1.15 }}>The gift that opens itself.</h2>
          <p className="t-sec-text" style={{ fontSize: 16, lineHeight: 1.75, marginBottom: 44, fontFamily: "Georgia, serif" }}>Join the companies across Jamaica that trust Big Island Traders for their most important gifting moments.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/shop" style={{ backgroundColor: "var(--accent)", color: "#060C1A", padding: "16px 40px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: "0.08em" }}>
              START YOUR ORDER
            </Link>
            <Link href="/book" style={{ backgroundColor: "transparent", color: "var(--text-primary)", padding: "16px 40px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 600, fontSize: 13, letterSpacing: "0.06em", border: "1px solid var(--border-accent)" }}>
              BOOK A CALL
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <ChatBot />
    </>
  );
}
