"use client";
export default function PlatformPage() {
  const printPDF = () => window.print();
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060C1A", fontFamily: "Inter,sans-serif", color: "#fff", padding: "0 0 80px" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#0D1933 0%,#060C1A 100%)", borderBottom: "1px solid rgba(200,168,74,0.2)", padding: "40px 40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <img src="/images/logobigisland.jpg" alt="Big Island Traders" style={{ height: 44, objectFit: "contain", marginBottom: 20, display: "block" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 900, fontSize: 32, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.01em" }}>Digital Platform Overview</h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Big Island Traders · WIAG Corporate Gifting Platform · 2026</p>
            </div>
            <button onClick={printPDF} className="no-print" style={{ backgroundColor: "#C8A84A", color: "#060C1A", border: "none", borderRadius: 4, padding: "10px 22px", fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: "0.08em", cursor: "pointer", flexShrink: 0 }}>
              DOWNLOAD PDF
            </button>
          </div>
          <style>{`@media print{.no-print{display:none!important}body{background:#fff!important}}`}</style>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px 0" }}>

        {/* Live URLs */}
        <Section title="LIVE PLATFORM LINKS" accent="#5BC8E8">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
            {[
              { label: "Main Website", url: "https://big-island-traders.vercel.app", desc: "Customer-facing storefront" },
              { label: "Admin Back Office", url: "https://big-island-traders.vercel.app/admin", desc: "Password protected • BIT2026admin" },
              { label: "Customer Account Portal", url: "https://big-island-traders.vercel.app/account", desc: "Order history, profile, support" },
              { label: "Shop", url: "https://big-island-traders.vercel.app/shop", desc: "All WIAG products + bundles" },
              { label: "Corporate Page", url: "https://big-island-traders.vercel.app/corporate", desc: "B2B gifting solutions" },
              { label: "Book a Consultation", url: "https://big-island-traders.vercel.app/book", desc: "Lead capture form" },
            ].map(l => (
              <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", backgroundColor: "#0D1933", border: "1px solid rgba(91,200,232,0.15)", borderRadius: 6, padding: "16px 18px", textDecoration: "none", transition: "border-color 0.2s" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 13, color: "#5BC8E8", marginBottom: 4 }}>{l.label}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 8 }}>{l.desc}</div>
                <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "monospace", wordBreak: "break-all" }}>{l.url}</div>
              </a>
            ))}
          </div>
        </Section>

        {/* Tech Stack */}
        <Section title="TECHNOLOGY STACK" accent="#C8A84A">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
            {[
              { name: "Next.js 15", role: "Frontend Framework", note: "App Router · TypeScript · Turbopack" },
              { name: "Tailwind CSS 4", role: "Styling", note: "CSS variables · 60/30/10 theme system" },
              { name: "Vercel", role: "Hosting & CDN", note: "Global edge · Auto SSL · CI/CD" },
              { name: "Supabase", role: "Database & Auth", note: "PostgreSQL · Magic link auth · RLS" },
              { name: "WiPay Jamaica", role: "Payments", note: "JMD processing · Bank transfer flow" },
              { name: "AI Assistant", role: "Customer Support", note: "Conversational gifting advisor" },
              { name: "Resend", role: "Transactional Email", note: "Order confirmations · Magic links" },
            ].map(t => (
              <div key={t.name} style={{ backgroundColor: "#111E3A", borderRadius: 6, padding: "14px 16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 14, color: "#C8A84A", marginBottom: 3 }}>{t.name}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 6 }}>{t.role}</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{t.note}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Admin Features */}
        <Section title="ADMIN BACK OFFICE — FULL FEATURE SET" accent="#5BC8E8">
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 20 }}>Access at <span style={{ color: "#5BC8E8", fontFamily: "monospace" }}>/admin</span> · Password: <span style={{ color: "#C8A84A", fontFamily: "monospace" }}>BIT2026admin</span></p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
            {[
              { tab: "Dashboard", items: ["Revenue overview", "Order count summary", "Active leads count", "Recent orders feed", "Recent leads feed", "Live product count"] },
              { tab: "Products", items: ["List all WIAG products", "Add new product", "Edit name, price, description, ABV", "Set badge labels", "Upload image path", "Toggle live / hidden", "Delete product"] },
              { tab: "Orders", items: ["Full order table", "Customer name + email", "Product ordered + quantity", "JMD amount", "Status update dropdown", "Delete record"] },
              { tab: "Leads", items: ["Full leads CRM table", "Company + contact info", "Occasion type", "Status pipeline (new → closed)", "Expand row to read message", "Delete lead"] },
              { tab: "Analytics", items: ["Monthly revenue trend", "Order status breakdown", "Top-selling products", "New leads over time", "Conversion metrics"] },
              { tab: "Customers", items: ["All unique customers", "Total spend per customer", "Order count", "Last order date", "Email direct link"] },
              { tab: "Settings", items: ["Store contact details", "Social media handles", "Bank transfer info", "Admin password change", "WiPay configuration"] },
            ].map(g => (
              <div key={g.tab} style={{ backgroundColor: "#0D1933", borderRadius: 6, padding: "16px 18px", border: "1px solid rgba(91,200,232,0.1)" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: "#5BC8E8", letterSpacing: "0.08em", marginBottom: 12 }}>{g.tab.toUpperCase()}</div>
                <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                  {g.items.map(i => <li key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Customer Features */}
        <Section title="CUSTOMER PORTAL — FULL FEATURE SET" accent="#C8A84A">
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 20 }}>Customers access at <span style={{ color: "#5BC8E8", fontFamily: "monospace" }}>/account</span> after signing in</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 14 }}>
            {[
              { tab: "Overview", items: ["Personalised welcome header", "Account initials avatar", "Order count stats", "Total spend", "Delivered count", "In-progress count"] },
              { tab: "Orders Tab", items: ["Full order history table", "Order date, product, qty, amount", "Live status badges", "One-click REORDER button", "Empty state with Shop CTA"] },
              { tab: "Profile Tab", items: ["Edit full name", "Edit email & phone", "Company / organisation", "Delivery address", "Additional notes field", "Email notification preferences", "Newsletter opt-in"] },
              { tab: "Support Tab", items: ["Phone, WhatsApp, email contacts", "Support ticket form", "Categorised subject dropdown", "Message text area", "Submission confirmation", "24hr response promise"] },
            ].map(g => (
              <div key={g.tab} style={{ backgroundColor: "#0D1933", borderRadius: 6, padding: "16px 18px", border: "1px solid rgba(200,168,74,0.12)" }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: "#C8A84A", letterSpacing: "0.08em", marginBottom: 12 }}>{g.tab.toUpperCase()}</div>
                <ul style={{ margin: 0, padding: "0 0 0 14px" }}>
                  {g.items.map(i => <li key={i} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 5, lineHeight: 1.5 }}>{i}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* Auth Flow */}
        <Section title="AUTHENTICATION FLOW" accent="#5BC8E8">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ backgroundColor: "#0D1933", borderRadius: 6, padding: 20, border: "1px solid rgba(91,200,232,0.1)" }}>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: "#5BC8E8", marginBottom: 14 }}>CUSTOMER AUTH</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["1. Customer clicks SIGN IN in navbar", "2. Email entry modal appears", "3. Magic link sent via Supabase", "4. Customer clicks link → auto signed in", "5. Session stored in browser (localStorage)", "6. Navbar shows initials + name", "7. My Orders dropdown available"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(91,200,232,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#5BC8E8", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5 }}>{s.replace(/^\d+\.\s/, "")}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: "#0D1933", borderRadius: 6, padding: 20, border: "1px solid rgba(200,168,74,0.12)" }}>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: "#C8A84A", marginBottom: 14 }}>ADMIN AUTH</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["1. Navigate to /admin", "2. Password prompt screen", "3. Enter admin password", "4. Full back office unlocked", "5. Session persists for tab duration", "6. Sign Out button available in header"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", backgroundColor: "rgba(200,168,74,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#C8A84A", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5 }}>{s.replace(/^\d+\.\s/, "")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Product Catalogue */}
        <Section title="PRODUCT CATALOGUE" accent="#C8A84A">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            {[
              { name: "WIAG Merlot", abv: "13.5%", price: "J$850", badge: "Classic", color: "#8B1A1A" },
              { name: "WIAG Cabernet Sauvignon", abv: "13.5%", price: "J$850", badge: "Bold", color: "#4A0E2A" },
              { name: "WIAG Rosé", abv: "13%", price: "J$850", badge: "Fresh", color: "#D4607A" },
              { name: "WIAG Moscato", abv: "7.5%", price: "J$850", badge: "Lifestyle", color: "#C8A84A" },
              { name: "Gift Box — 12 Pack", abv: "—", price: "J$9,600", badge: "Save J$600", color: "#5BC8E8" },
              { name: "Gift Box — 24 Pack", abv: "—", price: "J$18,000", badge: "Save J$2,400", color: "#5BC8E8" },
              { name: "Gift Box — 48 Pack", abv: "—", price: "J$33,600", badge: "Best Value", color: "#5BC8E8" },
            ].map(p => (
              <div key={p.name} style={{ backgroundColor: "#0D1933", borderRadius: 6, padding: "14px 16px", border: `1px solid ${p.color}33` }}>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 700, fontSize: 12, color: p.color, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginBottom: 6 }}>{p.abv !== "—" ? `ABV: ${p.abv}` : "Corporate Bundle"}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#C8A84A", fontWeight: 700, fontSize: 14 }}>{p.price}</span>
                  <span style={{ backgroundColor: `${p.color}22`, color: p.color, fontSize: 9, padding: "2px 7px", borderRadius: 8, fontFamily: "Montserrat,sans-serif", fontWeight: 700 }}>{p.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Pending Setup */}
        <Section title="SETUP CHECKLIST — CONNECT YOUR SERVICES" accent="#E8561A">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { done: true, item: "Vercel deployment live", note: "big-island-traders.vercel.app" },
              { done: true, item: "Hero image + brand photography", note: "4 product images live" },
              { done: true, item: "Real logo sitewide", note: "logobigisland.jpg" },
              { done: true, item: "Admin back office", note: "Products, Orders, Leads, Dashboard" },
              { done: true, item: "Customer account portal", note: "Orders, Profile, Support tabs" },
              { done: true, item: "AI gifting assistant chatbot", note: "Live on homepage" },
              { done: false, item: "Supabase env vars on Vercel", note: "NEXT_PUBLIC_SUPABASE_URL · NEXT_PUBLIC_SUPABASE_ANON_KEY · SUPABASE_SERVICE_ROLE_KEY" },
              { done: false, item: "WiPay payment integration", note: "WIPAY_ACCOUNT_NUMBER · WIPAY_API_KEY" },
              { done: false, item: "Resend email API key", note: "RESEND_API_KEY — for order confirmations and magic links" },
              { done: false, item: "AI assistant API key", note: "ANTHROPIC_API_KEY — for chatbot responses" },
              { done: false, item: "Custom domain (optional)", note: "bigislandtraders.com → CNAME to big-island-traders.vercel.app" },
            ].map(c => (
              <div key={c.item} style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "10px 14px", backgroundColor: "#0D1933", borderRadius: 5, border: `1px solid ${c.done ? "rgba(34,197,94,0.15)" : "rgba(232,86,26,0.15)"}` }}>
                <div style={{ color: c.done ? "#22c55e" : "#E8561A", fontWeight: 700, fontSize: 16, flexShrink: 0, marginTop: -1 }}>{c.done ? "✓" : "○"}</div>
                <div>
                  <div style={{ color: c.done ? "#22c55e" : "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 500, marginBottom: 2 }}>{c.item}</div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "monospace" }}>{c.note}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, marginTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>© 2026 Big Island Traders · Platform Documentation</p>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>Built by J Supreme Tech · jsupremetech.online</p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 52 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <div style={{ width: 3, height: 18, backgroundColor: accent, borderRadius: 2, flexShrink: 0 }} />
        <h2 style={{ fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, color: accent, letterSpacing: "0.12em", margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}
