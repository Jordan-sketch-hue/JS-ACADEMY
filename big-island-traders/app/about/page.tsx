import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import ChatBot from "@/components/ChatBot";

export const metadata = {
  title: "About — Big Island Traders",
  description: "Big Island Traders imports WIAG — premium Australian wine sealed in a real stemless glass. Corporate gifting, events, and retail across Jamaica.",
};

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: "#060C1A", color: "#fff", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <Navbar />
      <CartDrawer />
      <ChatBot />

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "72vh", minHeight: 520, overflow: "hidden" }}>
        <img
          src="/images/wiag-hero-girls.jpg"
          alt="Wine In A Glass"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "brightness(0.28) saturate(1.1)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(6,12,26,0.3) 0%, rgba(6,12,26,0.95) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px", paddingTop: 68 }}>
          <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(200,168,74,0.7)", marginBottom: 16 }}>Big Island Traders</p>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 68px)", fontWeight: 400, lineHeight: 1.08, margin: 0, letterSpacing: "-0.01em" }}>
            The wine and the glass<br />
            <span style={{ fontStyle: "italic", color: "#C8A84A" }}>arrived as one.</span>
          </h1>
        </div>
      </section>

      {/* ── ORIGIN STATEMENT ── */}
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "80px 24px 72px" }}>
        <p style={{ fontSize: "clamp(17px, 2vw, 22px)", lineHeight: 1.85, color: "rgba(255,255,255,0.72)", margin: 0 }}>
          Big Island Traders sources WIAG — Wine In A Glass — from Australia's leading RTD wine producers and brings it to Jamaica as a category of its own. A 187ml pour of premium varietal wine, sealed inside a real stemless glass. Pre-chilled. Pre-served. Ready the moment you need it.
        </p>
        <div style={{ marginTop: 40, width: 48, height: 1, backgroundColor: "#C8A84A", opacity: 0.5 }} />
      </section>

      {/* ── PRODUCT GALLERY ── */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
          {[
            { src: "/images/wiag-merlot.jpg", label: "Merlot" },
            { src: "/images/wiag-rose-cooler.jpg", label: "Rose Cooler" },
            { src: "/images/wiag-cabernat.jpg", label: "Cabernet" },
            { src: "/images/wiag-moscato-sunset.jpg", label: "Moscato Sunset" },
          ].map(({ src, label }) => (
            <div key={label} style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
              <img src={src} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.82) saturate(1.1)", transition: "transform 0.5s ease", display: "block" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 16px 16px", background: "linear-gradient(to top, rgba(6,12,26,0.85) 0%, transparent 100%)" }}>
                <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(200,168,74,0.8)", margin: 0 }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT MAKES IT DIFFERENT ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "96px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,168,74,0.7)", marginBottom: 24 }}>The Innovation</p>
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 46px)", fontWeight: 400, lineHeight: 1.15, margin: "0 0 32px" }}>
              No bottle.<br />No separate glass.<br />
              <span style={{ fontStyle: "italic", color: "#C8A84A" }}>No compromise.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.62)", margin: "0 0 24px" }}>
              WIAG eliminates the gap between pouring and drinking. The 187ml sealed glass is both the vessel and the serving — bringing 100% of the premium wine experience without any of the logistics.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.62)", margin: 0 }}>
              For corporate events, this means no hired glassware, no bar setup, no waste. Each guest receives their pour — already inside their glass — ready when they are.
            </p>
          </div>
          <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden" }}>
            <img src="/images/wiag-moscato-sunset.jpg" alt="WIAG 187ml glass" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
      </section>

      {/* ── QUOTE BREAK ── */}
      <section style={{ backgroundColor: "#0D1933", padding: "80px 24px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontStyle: "italic", fontSize: "clamp(18px, 2.5vw, 28px)", lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: "0 0 32px" }}>
            "187ml is a single perfect pour. Not a bottle. Not a box. A glass — the way wine was always meant to arrive."
          </p>
          <div style={{ width: 40, height: 1, backgroundColor: "#C8A84A", margin: "0 auto", opacity: 0.5 }} />
        </div>
      </section>

      {/* ── PROVENANCE ── */}
      <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
            <img src="/images/wiag-rose-cooler.jpg" alt="Australian provenance" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div>
            <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,168,74,0.7)", marginBottom: 24 }}>Provenance</p>
            <h2 style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 28px" }}>
              Sourced from<br />
              <span style={{ fontStyle: "italic", color: "#C8A84A" }}>Australia.</span>
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.62)", margin: "0 0 20px" }}>
              Australia's wine regions produce varietals consistently ranked among the world's finest. WIAG sources from established RTD wine producers in these regions, bringing that standard directly to the Jamaican market.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.62)", margin: 0 }}>
              Currently available in Jamaica through General Foods Kingston and Master Mac Food Store, 108–110 Constant Spring Road. Corporate and wholesale orders ship island-wide.
            </p>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ backgroundColor: "#0D1933", padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
            <div>
              <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(200,168,74,0.7)", marginBottom: 24 }}>Get In Touch</p>
              <h2 style={{ fontSize: "clamp(28px, 3vw, 42px)", fontWeight: 400, lineHeight: 1.15, margin: "0 0 28px" }}>
                Corporate orders.<br />
                <span style={{ fontStyle: "italic", color: "#C8A84A" }}>Let's talk.</span>
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: "rgba(255,255,255,0.58)", margin: "0 0 40px" }}>
                Whether you're planning 12 gift packs or 1,200 event glasses, our team handles sourcing, delivery logistics, and custom branding across all 14 parishes.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                <div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,168,74,0.5)", margin: "0 0 10px" }}>WhatsApp</p>
                  <a href="https://wa.me/18769999999" target="_blank" rel="noopener noreferrer" style={{ fontSize: 20, color: "#fff", textDecoration: "none", fontStyle: "italic" }}>876-999-9999</a>
                </div>
                <div>
                  <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(200,168,74,0.5)", margin: "0 0 10px" }}>Corporate Quotes</p>
                  <a href="/book" style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Book a consultation</a>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                <img src="/images/wiag-hero-girls.jpg" alt="WIAG corporate gifting" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72) saturate(1.05)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                  <img src="/images/wiag-merlot.jpg" alt="WIAG Merlot" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72)" }} />
                </div>
                <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                  <img src="/images/wiag-cabernat.jpg" alt="WIAG Cabernet" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.72)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
