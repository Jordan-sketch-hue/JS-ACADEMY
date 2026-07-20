"use client";
export default function CreativesPage() {
  const bg = "#030810";
  const card = "#0A0906";
  const navy = "#0D1933";
  const gold = "#C8A84A";
  const cream = "#EDE4CC";
  const blue = "#5BC8E8";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: bg, fontFamily: "'Montserrat',sans-serif", padding: "48px 32px 80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800;900&display=swap');
        @media print { .no-print { display:none!important } }
        .grain { position:absolute; inset:0; pointer-events:none; z-index:50; opacity:.065;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat:repeat; }
      `}</style>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 52, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <img src="/images/logobigisland.jpg" alt="Big Island Traders" style={{ height: 36, objectFit: "contain", marginBottom: 18, display: "block" }} />
            <h1 style={{ fontWeight: 900, fontSize: 28, color: "#fff", margin: "0 0 6px" }}>Ad Creative Suite</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 400 }}>WIAG Corporate Gifting · Social Media Creatives · 14 Formats · 2026</p>
          </div>
          <button onClick={() => window.print()} className="no-print" style={{ backgroundColor: gold, color: card, border: "none", borderRadius: 4, padding: "10px 22px", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", flexShrink: 0 }}>
            DOWNLOAD PDF
          </button>
        </div>

        {/* ── SECTION A: ORIGINAL 7 ── */}
        <SectionDivider label="CAMPAIGN SET A — ORIGINAL" />

        {/* A1 — The Moment (Story) */}
        <CreativeBlock label="A1 — THE MOMENT" size="9:16 Story · 405×720" color={gold} note="Hero story frame. Serif title 'The glass IS the gift.' centred top-to-bottom. Vignette darkens edges, drawing eye to glass. Grain texture adds film quality.">
          <div style={{ width: 405, height: 720, position: "relative", background: card, overflow: "hidden", flexShrink: 0, borderRadius: 6 }}>
            <img src="/images/wiag-moscato-sunset.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%", filter: "contrast(1.12) saturate(1.3) brightness(0.38)" }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 10%, rgba(0,0,0,0.85) 100%)", zIndex: 10 }} />
            <div className="grain" />
            <div style={{ position: "absolute", inset: 0, zIndex: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "36px 32px 40px" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 28, objectFit: "contain", objectPosition: "left" }} />
              <div>
                <div style={{ color: "#fff", fontSize: 56, fontWeight: 400, lineHeight: 1.0, fontFamily: "Georgia,serif" }}>The<br />glass<br />IS<br />the gift.</div>
                <div style={{ color: cream, fontSize: 18, fontStyle: "italic", fontWeight: 300, opacity: 0.85, lineHeight: 1.35, marginTop: 16, fontFamily: "Georgia,serif" }}>WIAG Moscato · 7.5% ABV<br />Australian Premium Wine</div>
              </div>
              <div>
                <div style={{ color: cream, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.65 }}>187ml · Sealed · Ready to drink</div>
                <div style={{ color: blue, fontSize: 11, letterSpacing: "0.15em", marginTop: 4 }}>@bigislandtraderz</div>
              </div>
            </div>
            <DTag label="9:16 Story" />
          </div>
        </CreativeBlock>

        {/* A2 — Bottle Problem */}
        <CreativeBlock label="A2 — THE BOTTLE PROBLEM" size="4:5 Feed · 405×540" color={gold} note="Hard 2-col CSS Grid. Text left column with gradient fade into product image right. Copy subverts expectation: frames the 17th-century bottle as the problem, WIAG as the solution.">
          <div style={{ width: 405, height: 540, position: "relative", background: card, overflow: "hidden", flexShrink: 0, borderRadius: 6, display: "grid", gridTemplateColumns: "190px 1fr" }}>
            <div style={{ position: "relative", zIndex: 20, background: `linear-gradient(to right, ${card} 80%, transparent 100%)`, padding: "32px 0 28px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 20, objectFit: "contain", objectPosition: "left" }} />
              <div>
                <div style={{ color: cream, fontSize: 20, fontWeight: 400, lineHeight: 1.3, fontFamily: "Georgia,serif" }}>The bottle was invented in the 17th century.</div>
                <div style={{ color: gold, fontSize: 16, fontStyle: "italic", fontWeight: 300, lineHeight: 1.5, marginTop: 10, fontFamily: "Georgia,serif" }}>So was<br />the problem.</div>
                <div style={{ borderTop: `1px solid rgba(200,168,74,0.35)`, paddingTop: 10, marginTop: 14 }}>
                  <div style={{ color: cream, fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, lineHeight: 2 }}>WIAG MERLOT<br />13.5% ABV<br />@BIGISLANDTRADERZ</div>
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <img src="/images/wiag-merlot.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "center", filter: "drop-shadow(-20px 0 40px rgba(0,0,0,0.8)) contrast(1.12) saturate(1.15)" }} />
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* A3 — Bring WIAG */}
        <CreativeBlock label="A3 — BRING WIAG" size="4:5 Feed · 405×540" color={gold} note="Lifestyle overlay. Bottom-heavy copy with serif headline and supporting body. Gradient pushes from bottom to protect text legibility. Rosé variety.">
          <div style={{ width: 405, height: 540, position: "relative", background: card, overflow: "hidden", flexShrink: 0, borderRadius: 6 }}>
            <img src="/images/wiag-rose-cooler.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "contrast(1.1) saturate(1.25) brightness(0.5)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 55%, rgba(0,0,0,0.05) 100%)", zIndex: 10 }} />
            <div className="grain" />
            <div style={{ position: "absolute", inset: 0, zIndex: 20, padding: "28px 28px 32px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
              <div style={{ color: "#fff", fontSize: 28, fontWeight: 400, lineHeight: 1.15, fontFamily: "Georgia,serif" }}>Don't bring wine.</div>
              <div style={{ color: gold, fontSize: 32, fontWeight: 700, lineHeight: 1.1, fontFamily: "Georgia,serif" }}>Bring WIAG.</div>
              <div style={{ color: cream, fontSize: 12, fontWeight: 300, opacity: 0.78, lineHeight: 1.6, maxWidth: 300, fontFamily: "Georgia,serif" }}>The only wine that arrives ready. No glasses, no corkscrew, no awkward pour. Seal-pop and savour.</div>
              <div style={{ color: cream, fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.5, marginTop: 14 }}>WIAG Rosé · 13% · @bigislandtraderz</div>
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* A4 — Discerning */}
        <CreativeBlock label="A4 — DISCERNING" size="4:5 Feed · 405×540" color={gold} note="Radial spotlight on product. Typographic architecture: 4 lines, mixed weight/size creating rhythm. Sophisticated upper-income tone. Cab Sauv variety.">
          <div style={{ width: 405, height: 540, position: "relative", background: card, overflow: "hidden", flexShrink: 0, borderRadius: 6 }}>
            <img src="/images/wiag-cabernat.jpg" alt="" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", height: "115%", width: "auto", filter: "contrast(1.2) saturate(0.9) brightness(0.75)", zIndex: 2 }} />
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 280px 380px at center, transparent 0%, rgba(0,0,0,0.92) 100%)", zIndex: 5 }} />
            <div className="grain" />
            <div style={{ position: "absolute", inset: 0, zIndex: 20, padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 20, objectFit: "contain", objectPosition: "left" }} />
              <div>
                <div style={{ color: cream, fontSize: 24, fontWeight: 300, lineHeight: 1.2, fontFamily: "Georgia,serif", opacity: 0.9 }}>For those who notice</div>
                <div style={{ color: cream, fontSize: 26, fontWeight: 700, lineHeight: 1.2, fontFamily: "Georgia,serif" }}>when ordinary</div>
                <div style={{ color: cream, fontSize: 22, fontWeight: 300, fontFamily: "Georgia,serif", opacity: 0.85, marginTop: 4 }}>becomes</div>
                <div style={{ color: gold, fontSize: 24, fontWeight: 700, fontFamily: "Georgia,serif" }}>exceptional.</div>
              </div>
              <div>
                <div style={{ color: gold, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase" }}>WIAG Cabernet Sauvignon · 13.5% ABV</div>
                <div style={{ width: 32, height: 1, background: gold, marginTop: 6, opacity: 0.5 }} />
              </div>
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* A5 — Celebration / Corporate */}
        <CreativeBlock label="A5 — THE GIFT THEY REMEMBER" size="4:5 Feed · 405×540" color={gold} note="Corporate gifting CTA. Gold border tag frames the category. Strong serif headline with sub. Bottom bar separates brand from CTA — clean B2B credibility signal.">
          <div style={{ width: 405, height: 540, position: "relative", background: card, overflow: "hidden", flexShrink: 0, borderRadius: 6 }}>
            <img src="/images/wiag-hero-girls.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.1) saturate(1.2) brightness(0.42)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(145deg, rgba(13,25,51,0.92) 0%, rgba(10,9,6,0.5) 100%)", zIndex: 10 }} />
            <div className="grain" />
            <div style={{ position: "absolute", inset: 0, zIndex: 20, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "inline-block", border: `1px solid rgba(200,168,74,0.5)`, color: gold, fontSize: 9, letterSpacing: "0.25em", textTransform: "uppercase", padding: "5px 12px", marginBottom: 20 }}>Corporate Gifting</div>
                <div style={{ color: cream, fontSize: 34, fontWeight: 400, lineHeight: 1.1, fontFamily: "Georgia,serif" }}>The gift they<br />actually remember.</div>
                <div style={{ color: gold, fontSize: 18, fontStyle: "italic", fontWeight: 300, lineHeight: 1.35, marginTop: 8, fontFamily: "Georgia,serif" }}>Not another bottle.<br />Wine as the glass.</div>
              </div>
              <div style={{ borderTop: `1px solid rgba(237,228,204,0.12)`, paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ color: cream, fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5 }}>bigislandtraderz.com</div>
                <div style={{ color: blue, fontSize: 10, letterSpacing: "0.12em" }}>@bigislandtraderz</div>
              </div>
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* A6 — Stock It */}
        <CreativeBlock label="A6 — STOCK IT (WHOLESALE)" size="4:5 Feed · 405×540" color={blue} note="B2B retailer/venue format. Left gradient fade over product image. Bullet point list of trade benefits. Subtle 'For Retailers · Hotels · Bars · Venues' eyebrow line signals the audience.">
          <div style={{ width: 405, height: 540, position: "relative", background: navy, overflow: "hidden", flexShrink: 0, borderRadius: 6 }}>
            <img src="/images/wiag-cabernat.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.08) saturate(0.8) brightness(0.28)" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to right, rgba(13,25,51,0.97) 0%, rgba(13,25,51,0.75) 60%, transparent 100%)`, zIndex: 10 }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 20, padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 20, objectFit: "contain", objectPosition: "left" }} />
              <div>
                <div style={{ color: blue, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>For Retailers · Hotels · Bars · Venues</div>
                <div style={{ color: "#fff", fontSize: 26, fontWeight: 400, lineHeight: 1.2, maxWidth: 270, fontFamily: "Georgia,serif" }}>Your customers already want single-serve premium wine.</div>
                <div style={{ color: gold, fontSize: 15, fontStyle: "italic", marginTop: 8, maxWidth: 250, lineHeight: 1.4, fontFamily: "Georgia,serif" }}>WIAG belongs on your shelf.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18 }}>
                  {["Fast-moving impulse SKU — front-shelf proven", "Premium Australian RTD — a genuine talking point", "No refrigeration required · Long shelf life"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 10, color: cream, fontSize: 12, opacity: 0.8, lineHeight: 1.5, fontWeight: 300 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: gold, marginTop: 6, flexShrink: 0 }} />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderTop: `1px solid rgba(200,168,74,0.25)`, paddingTop: 12 }}>
                <div style={{ color: gold, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700 }}>Enquire for wholesale pricing</div>
                <div style={{ color: cream, fontSize: 9, opacity: 0.45, letterSpacing: "0.1em", marginTop: 4 }}>bigislandtraderz@gmail.com · @bigislandtraderz</div>
              </div>
            </div>
            <DTag label="Wholesale" />
          </div>
        </CreativeBlock>

        {/* A7 — Reseller */}
        <CreativeBlock label="A7 — RESELLER / PARTNER" size="4:5 Feed · 405×540" color={blue} note="Corporate supplier / reseller pitch. Bottom-weighted layout. CTA row with bordered button and handle side-by-side. Sub-headline in gold italic for brand recall.">
          <div style={{ width: 405, height: 540, position: "relative", background: navy, overflow: "hidden", flexShrink: 0, borderRadius: 6 }}>
            <img src="/images/wiag-moscato-sunset.jpg" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", filter: "contrast(1.1) saturate(1.1) brightness(0.28)" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, rgba(13,25,51,0.98) 0%, rgba(13,25,51,0.6) 55%, rgba(13,25,51,0.28) 100%)`, zIndex: 10 }} />
            <div style={{ position: "absolute", inset: 0, zIndex: 20, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ color: blue, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>For Corporate Gift Suppliers · Event Vendors</div>
              <div style={{ color: cream, fontSize: 28, fontWeight: 400, lineHeight: 1.15, fontFamily: "Georgia,serif" }}>Add a product</div>
              <div style={{ color: gold, fontSize: 32, fontWeight: 700, lineHeight: 1.1, marginTop: 4, fontFamily: "Georgia,serif" }}>clients ask for by name.</div>
              <div style={{ width: 36, height: 1, background: gold, margin: "14px 0", opacity: 0.5 }} />
              <div style={{ color: cream, fontSize: 12, fontWeight: 300, opacity: 0.7, lineHeight: 1.65, maxWidth: 310, marginBottom: 20 }}>White-label and reseller arrangements available. WIAG — 187ml premium Australian RTD wine in a real glass. The gift that sells itself.</div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ border: `1px solid ${gold}`, color: gold, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "9px 18px", fontWeight: 700 }}>Partner with us</div>
                <div style={{ color: blue, fontSize: 10, letterSpacing: "0.12em" }}>@bigislandtraderz</div>
              </div>
            </div>
            <DTag label="Reseller" />
          </div>
        </CreativeBlock>

        {/* ── SECTION B: NEW SUITE ── */}
        <SectionDivider label="CAMPAIGN SET B — EXTENDED SUITE" />

        {/* B1 — Hero Lifestyle */}
        <CreativeBlock label="B1 — HERO LIFESTYLE" size="4:5 Feed · 405×540" color={gold} note="New hero image (Girls like me). Strong serif headline with gold CTA button. Deep overlay preserves type at all image brightness levels.">
          <div style={{ width: 405, height: 540, borderRadius: 6, overflow: "hidden", position: "relative", flexShrink: 0, backgroundColor: card }}>
            <img src="/images/wiag-hero-girls.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", filter: "brightness(0.38) saturate(1.1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,12,26,0.97) 0%, rgba(6,12,26,0.3) 60%, transparent 100%)" }} />
            <div style={{ position: "absolute", top: 24, left: 0, right: 0, textAlign: "center" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 26, objectFit: "contain" }} />
            </div>
            <div style={{ position: "absolute", bottom: 30, left: 28, right: 28 }}>
              <p style={{ fontWeight: 900, fontSize: 10, color: blue, letterSpacing: "0.2em", marginBottom: 8 }}>PREMIUM CORPORATE GIFTING</p>
              <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 26, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>The gift they'll<br />talk about.</p>
              <div style={{ backgroundColor: gold, color: card, padding: "9px 20px", borderRadius: 3, display: "inline-block", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em" }}>ORDER NOW →</div>
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* B2 — Four Varieties Grid */}
        <CreativeBlock label="B2 — FOUR VARIETIES" size="Square · 400×400" color={gold} note="2×2 product grid, each quadrant using the variety's colour story. Centred logo medallion ties it together. Instantly communicates range breadth.">
          <div style={{ width: 400, height: 400, borderRadius: 6, overflow: "hidden", backgroundColor: card, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", flexShrink: 0, position: "relative" }}>
            {[
              { src: "/images/wiag-merlot.jpg", name: "Merlot", color: "#8B2020", abv: "13.5%" },
              { src: "/images/wiag-cabernat.jpg", name: "Cabernet", color: "#4A1040", abv: "13.5%" },
              { src: "/images/wiag-rose-cooler.jpg", name: "Rosé", color: "#D46070", abv: "13%" },
              { src: "/images/wiag-moscato-sunset.jpg", name: "Moscato", color: "#C8A84A", abv: "7.5%" },
            ].map(p => (
              <div key={p.name} style={{ position: "relative", overflow: "hidden" }}>
                <img src={p.src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) saturate(1.1)" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${p.color}88 0%, transparent 60%)` }} />
                <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                  <p style={{ fontWeight: 700, fontSize: 9, color: "#fff", margin: 0, letterSpacing: "0.06em" }}>{p.name.toUpperCase()}</p>
                  <p style={{ fontWeight: 500, fontSize: 8, color: "rgba(255,255,255,0.5)", margin: 0 }}>{p.abv} ABV</p>
                </div>
              </div>
            ))}
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <div style={{ backgroundColor: "rgba(6,12,26,0.9)", borderRadius: "50%", width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${gold}44` }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 900, fontSize: 8, color: gold, margin: 0, letterSpacing: "0.12em" }}>WIAG</p>
                  <p style={{ fontWeight: 600, fontSize: 6, color: "rgba(255,255,255,0.4)", margin: 0 }}>4 VARIETIES</p>
                </div>
              </div>
            </div>
            <DTag label="Square" />
          </div>
        </CreativeBlock>

        {/* B3 — Gift Box */}
        <CreativeBlock label="B3 — GIFT BOX OFFER" size="4:5 Feed · 405×540" color={gold} note="Bundle promotion. Image top, dark card bottom. Price anchoring with volume callout. Best Value badge top-right. Designed for conversion.">
          <div style={{ width: 405, height: 540, borderRadius: 6, overflow: "hidden", backgroundColor: "#111E3A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <img src="/images/wiag-moscato-sunset.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.4) saturate(1.15)" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #111E3A 100%)" }} />
              <div style={{ position: "absolute", top: 16, right: 16, backgroundColor: gold, color: card, padding: "5px 12px", borderRadius: 2, fontWeight: 900, fontSize: 8, letterSpacing: "0.1em" }}>BEST VALUE</div>
            </div>
            <div style={{ padding: "20px 24px 22px", backgroundColor: "#111E3A" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 16, objectFit: "contain", objectPosition: "left", marginBottom: 8, display: "block" }} />
              <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 19, color: "#fff", margin: "0 0 5px", lineHeight: 1.2 }}>Gift Box — 48 Pack</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, marginBottom: 12 }}>Conference scale. Mix any 4 varieties. Branded packaging available.</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 900, fontSize: 20, color: gold }}>J$33,600</span>
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginLeft: 8 }}>/ box of 48</span>
                </div>
                <div style={{ backgroundColor: blue, color: card, padding: "8px 14px", borderRadius: 3, fontWeight: 800, fontSize: 10, letterSpacing: "0.06em" }}>ORDER NOW</div>
              </div>
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* B4 — Social Proof */}
        <CreativeBlock label="B4 — SOCIAL PROOF" size="Square · 400×400" color={blue} note="Testimonial quote card. Dark navy, large serif quote mark in gold. Clean attribution with rule divider. Link CTA badge at bottom for conversion.">
          <div style={{ width: 400, height: 400, borderRadius: 6, overflow: "hidden", backgroundColor: "#080F1F", flexShrink: 0, padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: `1px solid ${blue}22` }}>
            <div>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 20, objectFit: "contain", objectPosition: "left", marginBottom: 20, display: "block" }} />
              <p style={{ fontSize: 44, color: `${gold}28`, fontFamily: "Georgia,serif", margin: "0 0 10px", lineHeight: 0.8 }}>&ldquo;</p>
              <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 16, color: "#fff", lineHeight: 1.65, margin: 0 }}>
                We gifted WIAG to our entire team for the year-end party. Every single person loved it. The presentation was premium.
              </p>
            </div>
            <div>
              <div style={{ width: 32, height: 1, backgroundColor: gold, marginBottom: 10 }} />
              <p style={{ fontWeight: 700, fontSize: 11, color: gold, margin: "0 0 2px" }}>Michelle T.</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>HR Manager · Kingston Corp</p>
              <div style={{ marginTop: 12, backgroundColor: `${blue}15`, border: `1px solid ${blue}30`, borderRadius: 3, padding: "5px 10px", display: "inline-block" }}>
                <span style={{ fontWeight: 700, fontSize: 9, color: blue, letterSpacing: "0.1em" }}>BIGISLANDTRADERS.COM</span>
              </div>
            </div>
            <DTag label="Square" />
          </div>
        </CreativeBlock>

        {/* B5 — Corporate Story */}
        <CreativeBlock label="B5 — CORPORATE STORY" size="9:16 Story · 304×540" color={blue} note="Story format with dual CTA — consultation booking + social follow. Full-bleed lifestyle, copy bottom-weighted. Designed for high-reach story placement.">
          <div style={{ width: 304, height: 540, borderRadius: 6, overflow: "hidden", position: "relative", backgroundColor: card, flexShrink: 0 }}>
            <img src="/images/wiag-rose-cooler.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.35) saturate(1.2)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(6,12,26,0.98) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, padding: "24px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 20, objectFit: "contain", objectPosition: "left" }} />
              <div>
                <p style={{ fontWeight: 900, fontSize: 9, color: blue, letterSpacing: "0.2em", marginBottom: 8 }}>CORPORATE GIFTING · JAMAICA</p>
                <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 20, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>Your team deserves more than a gift card.</p>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, marginBottom: 18, lineHeight: 1.6 }}>187ml premium Australian wine, sealed in real glass. From J$9,600 for 12.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ backgroundColor: blue, color: card, padding: "9px 14px", borderRadius: 3, textAlign: "center", fontWeight: 800, fontSize: 10, letterSpacing: "0.08em" }}>BOOK A CONSULTATION →</div>
                  <div style={{ border: "1px solid rgba(255,255,255,0.2)", padding: "8px 14px", borderRadius: 3, textAlign: "center", fontWeight: 600, fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>@bigislandtraderz</div>
                </div>
              </div>
            </div>
            <DTag label="9:16 Story" />
          </div>
        </CreativeBlock>

        {/* B6 — Reels Hook */}
        <CreativeBlock label="B6 — REELS HOOK FRAME" size="9:16 Reels · 304×540" color="#E8561A" note="Curiosity-led Reels hook. Minimal branding lets the hook copy carry the attention. Designed for 0-3 second retention. 'WAIT FOR IT' drives view-through.">
          <div style={{ width: 304, height: 540, borderRadius: 6, overflow: "hidden", position: "relative", backgroundColor: card, flexShrink: 0 }}>
            <img src="/images/wiag-hero-girls.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 15%", filter: "brightness(0.3) saturate(1.2)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
              <p style={{ fontWeight: 900, fontSize: 9, color: blue, letterSpacing: "0.24em", marginBottom: 10 }}>WAIT FOR IT →</p>
              <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 22, color: "#fff", margin: "0 0 10px", lineHeight: 1.2 }}>You've never seen wine gifting done like this.</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, lineHeight: 1.6, marginBottom: 20 }}>187ml. Real glass. Ready to drink.<br />Corporate gifting for Jamaica.</p>
              <div style={{ backgroundColor: gold, color: card, padding: "9px 18px", borderRadius: 3, fontWeight: 900, fontSize: 10, letterSpacing: "0.1em" }}>WIAG — WINE IN A GLASS</div>
            </div>
            <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, textAlign: "center" }}>
              <p style={{ fontWeight: 600, fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}>@bigislandtraderz</p>
            </div>
            <DTag label="Reels" />
          </div>
        </CreativeBlock>

        {/* B7 — Product Split */}
        <CreativeBlock label="B7 — PRODUCT SPOTLIGHT" size="4:5 Feed · 405×540" color={gold} note="CSS Grid 2-column split with brand copy left, clean product image right. Variety list with dot bullets. Positions WIAG as a considered premium choice.">
          <div style={{ width: 405, height: 540, borderRadius: 6, overflow: "hidden", backgroundColor: card, display: "grid", gridTemplateColumns: "190px 1fr", flexShrink: 0 }}>
            <div style={{ padding: "28px 0 24px 24px", background: `linear-gradient(to right, ${card} 80%, transparent 100%)`, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <img src="/images/logobigisland.jpg" alt="" style={{ height: 20, objectFit: "contain", objectPosition: "left" }} />
              <div>
                <p style={{ fontWeight: 900, fontSize: 8, color: blue, letterSpacing: "0.18em", marginBottom: 8 }}>WINE IN A GLASS</p>
                <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 22, color: "#fff", margin: "0 0 5px", lineHeight: 1.2 }}>Four<br />expressions.</p>
                <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 22, color: gold, margin: "0 0 14px", lineHeight: 1.2 }}>Every<br />occasion.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {["Merlot 13.5%", "Cab Sauv 13.5%", "Rosé 13%", "Moscato 7.5%"].map(v => (
                    <div key={v} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: gold }} />
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, backgroundColor: gold, color: card, padding: "6px 10px", borderRadius: 2, display: "inline-block", fontWeight: 800, fontSize: 9, letterSpacing: "0.08em" }}>J$850 PER GLASS</div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <img src="/images/wiag-merlot.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <DTag label="4:5 Feed" />
          </div>
        </CreativeBlock>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>© 2026 Big Island Traders · Ad Creative Suite · 14 Formats</p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11 }}>Built by J Supreme Tech</p>
        </div>
      </div>
    </div>
  );
}

function DTag({ label }: { label: string }) {
  return (
    <div style={{ position: "absolute", top: 10, right: 10, background: "#C8A84A", color: "#0A0906", fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", padding: "4px 10px", zIndex: 100, fontFamily: "'Montserrat',sans-serif", fontWeight: 700 }}>
      {label}
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "16px 0 40px" }}>
      <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontWeight: 800, fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em" }}>{label}</span>
      <div style={{ flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

function CreativeBlock({ label, size, color, note, children }: { label: string; size: string; color: string; note: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <div style={{ width: 3, height: 14, backgroundColor: color, borderRadius: 2 }} />
        <span style={{ fontWeight: 800, fontSize: 11, color: color, letterSpacing: "0.1em" }}>{label}</span>
        <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 400 }}>· {size}</span>
      </div>
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
        {children}
        <div style={{ maxWidth: 280, paddingTop: 6 }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, lineHeight: 1.8, fontWeight: 400 }}>{note}</p>
        </div>
      </div>
    </div>
  );
}
