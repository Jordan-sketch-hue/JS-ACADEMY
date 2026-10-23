"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// ── Geo types ──────────────────────────────────────────────────────────────
type Region = "JM" | "US" | "UK" | "AFRICA" | "DEFAULT";

const AFRICA_ISO = new Set([
  "DZ","AO","BJ","BW","BF","BI","CV","CM","CF","TD","KM","CG","CD","DJ",
  "EG","GQ","ER","SZ","ET","GA","GM","GH","GN","GW","CI","KE","LS","LR",
  "LY","MG","MW","ML","MR","MU","MA","MZ","NA","NE","NG","RW","ST","SN",
  "SL","SO","ZA","SS","SD","TZ","TG","TN","UG","ZM","ZW"
]);

function detectRegion(cc: string): Region {
  if (cc === "JM") return "JM";
  if (cc === "US" || cc === "CA") return "US";
  if (cc === "GB") return "UK";
  if (AFRICA_ISO.has(cc)) return "AFRICA";
  return "DEFAULT";
}

// ── Region content ─────────────────────────────────────────────────────────
type RegionContent = {
  badge: string;
  heroImg: string;
  headline: ReactNode;
  sub: string;
  primaryCta: string;
  secondaryCta: string;
  pricing: string;
  city: string;
  waitlistRegions: string[];
};

const CONTENT: Record<Region, RegionContent> = {
  JM: {
    badge: "Launching Kingston + Portmore · 2025",
    heroImg: "/images/hero-bg.webp",
    headline: <>Basic needs.<br /><em>Subscribed.</em></>,
    sub: "The Mandate connects every Jamaican community to water, shelter, food, clothing, and rest — through recurring subscriptions, local providers who get paid directly, and an AI life coach for every subscriber.",
    primaryCta: "Get Early Access",
    secondaryCta: "Become a Provider",
    pricing: "From J$1,500 / mo",
    city: "Kingston · Portmore · Coming soon: Jamaica-wide",
    waitlistRegions: ["Kingston, Jamaica","Portmore, Jamaica","Montego Bay, Jamaica","Rest of Jamaica"],
  },
  US: {
    badge: "Coming to the United States · 2025",
    heroImg: "/images/us/hero-bg.webp",
    headline: <>Every person deserves<br /><em>stability.</em></>,
    sub: "The Mandate builds the infrastructure America has always needed — connecting people to water, shelter, food, clothing, and rest through subscriptions that work the way their needs do.",
    primaryCta: "Join the Waitlist",
    secondaryCta: "Become a Provider",
    pricing: "From US$25 / mo",
    city: "Launching in the US · Canada next",
    waitlistRegions: ["New York, NY","Atlanta, GA","Chicago, IL","Los Angeles, CA","Other US City","Canada"],
  },
  UK: {
    badge: "Coming to the United Kingdom · 2025",
    heroImg: "/images/uk/hero-bg.webp",
    headline: <>From Brixton to Birmingham.<br /><em>No one left behind.</em></>,
    sub: "The Mandate brings subscription-based access to basic human needs across the UK — with local providers, an AI life coach, and a job engine that creates real work in your community.",
    primaryCta: "Join the Waitlist",
    secondaryCta: "Become a Provider",
    pricing: "From £20 / mo",
    city: "Launching across the UK · 2025",
    waitlistRegions: ["London","Birmingham","Manchester","Leeds","Other UK City"],
  },
  AFRICA: {
    badge: "Coming to Africa · Lagos · Nairobi · Accra",
    heroImg: "/images/africa/hero-bg.webp",
    headline: <>From Lagos to Nairobi.<br /><em>Dignity, delivered.</em></>,
    sub: "The Mandate is building what Africa deserves — a continent-wide infrastructure for water, shelter, food, clothing, and rest, powered by local providers and an AI life coach available to every subscriber.",
    primaryCta: "Join the Waitlist",
    secondaryCta: "Become a Provider",
    pricing: "Locally priced · From US$15 / mo",
    city: "Lagos · Nairobi · Accra · Johannesburg · and beyond",
    waitlistRegions: ["Lagos, Nigeria","Nairobi, Kenya","Accra, Ghana","Johannesburg, South Africa","Other African City"],
  },
  DEFAULT: {
    badge: "Launching 2025 · Starting in Jamaica",
    heroImg: "/images/hero-bg.webp",
    headline: <>Basic needs.<br /><em>For every region.</em></>,
    sub: "The Mandate builds the infrastructure the world has been missing — connecting people everywhere to water, shelter, food, clothing, and rest through recurring subscriptions and local provider networks.",
    primaryCta: "Get Early Access",
    secondaryCta: "Become a Provider",
    pricing: "Locally priced per region",
    city: "Kingston · Portmore · Coming soon: worldwide",
    waitlistRegions: ["Kingston, Jamaica","United States","United Kingdom","Canada","Africa","Other Caribbean","Other"],
  },
};

// ── Component ──────────────────────────────────────────────────────────────
export default function Home() {
  const [region, setRegion] = useState<Region>("DEFAULT");
  const [geoLoaded, setGeoLoaded] = useState(false);
  const [waitlistTab, setWaitlistTab] = useState<"subscriber" | "provider">("subscriber");

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("r")?.toUpperCase();
    const paramMap: Record<string, Region> = { JA: "JM", JM: "JM", US: "US", UK: "UK", AF: "AFRICA", AFRICA: "AFRICA" };
    if (param && paramMap[param]) {
      setRegion(paramMap[param]);
      setGeoLoaded(true);
      return;
    }
    fetch("https://ip-api.com/json/?fields=countryCode")
      .then(r => r.json())
      .then((d: { countryCode?: string }) => {
        if (d.countryCode) setRegion(detectRegion(d.countryCode));
      })
      .catch(() => {/* keep DEFAULT on error */})
      .finally(() => setGeoLoaded(true));
  }, []);

  const c = CONTENT[region];

  return (
    <>
      <style>{`
        /* ── Nav ─────────────────────────────────── */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 32px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.3rem; color: var(--text-primary); letter-spacing: -0.03em;
        }
        .nav-logo span { color: var(--accent); }
        .nav-cta {
          background: var(--accent); color: #fff;
          padding: 9px 22px; border-radius: var(--radius-sm);
          font-weight: 600; font-size: 0.875rem; cursor: pointer;
          border: none; font-family: inherit;
          transition: background 0.2s, transform 0.15s;
        }
        .nav-cta:hover { background: var(--accent-dim); transform: translateY(-1px); }

        /* ── Hero ────────────────────────────────── */
        .hero {
          min-height: 100vh;
          display: flex; flex-direction: column; align-items: flex-start;
          justify-content: center;
          padding: 140px 5vw 100px;
          position: relative; overflow: hidden;
          background: var(--bg-surface);
        }
        .hero-media { position: absolute; inset: 0; z-index: 0; }
        .hero-media-img {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0.42;
          animation: heroFadeIn 0.6s ease;
        }
        @keyframes heroFadeIn { from { opacity: 0; } to { opacity: 0.42; } }
        .hero-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            105deg,
            rgba(247,248,251,0.97) 0%,
            rgba(247,248,251,0.88) 40%,
            rgba(247,248,251,0.55) 65%,
            rgba(247,248,251,0.08) 100%
          );
        }
        .hero-content { position: relative; z-index: 2; max-width: 660px; }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--accent-glow); border: 1px solid var(--border-accent);
          padding: 6px 14px; border-radius: 6px;
          font-size: 0.72rem; color: var(--accent); margin-bottom: 28px;
          font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase;
        }
        .hero-badge-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

        .hero h1 {
          font-size: clamp(3rem, 6.5vw, 6rem);
          margin-bottom: 24px;
          color: var(--text-primary);
          line-height: 1.08;
        }
        .hero h1 em { color: var(--accent); font-style: italic; }
        .hero-sub {
          font-size: clamp(1rem, 1.8vw, 1.2rem);
          color: var(--text-secondary); max-width: 520px;
          margin-bottom: 14px; line-height: 1.75;
          transition: opacity 0.4s;
        }
        .hero-pricing {
          display: inline-block;
          font-size: 0.8rem; color: var(--accent);
          margin-bottom: 36px; font-weight: 700;
          letter-spacing: 0.06em; text-transform: uppercase;
          background: var(--accent-glow);
          padding: 5px 12px; border-radius: 5px;
        }
        .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .btn-primary {
          background: var(--accent); color: #fff;
          padding: 14px 32px; border-radius: var(--radius-sm);
          font-weight: 700; font-size: 1rem; border: none;
          cursor: pointer; font-family: inherit;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 14px rgba(201,168,76,0.25);
        }
        .btn-primary:hover {
          background: var(--accent-dim);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.35);
        }
        .btn-secondary {
          background: transparent; color: var(--text-primary);
          padding: 14px 32px; border-radius: var(--radius-sm);
          font-weight: 600; font-size: 1rem;
          border: 1.5px solid rgba(0,0,0,0.15);
          cursor: pointer; font-family: inherit; transition: border-color 0.2s, color 0.2s;
        }
        .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }

        .hero-stats {
          display: flex; gap: 48px; margin-top: 60px;
          flex-wrap: wrap;
          padding-top: 40px;
          border-top: 1px solid var(--border);
        }
        .stat { text-align: left; }
        .stat-num {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 2.25rem; color: var(--text-primary); line-height: 1;
        }
        .stat-label { font-size: 0.75rem; color: var(--text-muted); margin-top: 5px; letter-spacing: 0.02em; }

        /* ── Section common ──────────────────────── */
        section { padding: 100px 5vw; }
        .container { max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 14px; font-weight: 700;
          display: flex; align-items: center; gap: 10px;
        }
        .section-label::before {
          content: ''; display: inline-block;
          width: 24px; height: 2px; background: var(--accent); border-radius: 2px;
        }
        .section-title {
          font-size: clamp(1.9rem, 4vw, 3rem);
          margin-bottom: 18px;
        }
        .section-sub {
          font-size: 1.1rem; color: var(--text-secondary);
          max-width: 600px; line-height: 1.75;
        }

        /* ── Problem ─────────────────────────────── */
        .problem { background: var(--bg-surface); }
        .problem-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px; margin-top: 56px;
        }
        .problem-card {
          background: var(--bg-card);
          border-radius: var(--radius); padding: 32px 28px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .problem-card:hover {
          box-shadow: var(--shadow);
          transform: translateY(-2px);
        }
        .problem-num {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 3rem; color: var(--accent); line-height: 1;
        }
        .problem-label {
          font-size: 0.85rem; color: var(--text-secondary);
          margin-top: 10px; line-height: 1.55;
        }

        /* ── Impact ──────────────────────────────── */
        .impact { background: var(--bg); }
        .impact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px; margin-top: 56px;
        }
        .impact-card {
          background: var(--bg-card);
          border-radius: var(--radius); padding: 32px;
          display: flex; flex-direction: column; gap: 14px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .impact-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
        .impact-icon { font-size: 1.75rem; line-height: 1; }
        .impact-card h3 { font-size: 1.1rem; }
        .impact-card p { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.65; }

        /* ── SDVs ────────────────────────────────── */
        .sdvs { background: var(--bg-surface); }
        .sdv-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 18px; margin-top: 56px;
        }
        .sdv-card {
          background: var(--bg-card);
          border-radius: var(--radius); padding: 28px 28px 24px;
          box-shadow: var(--shadow-sm); border: 1px solid var(--border);
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .sdv-card:hover {
          box-shadow: var(--shadow);
          transform: translateY(-2px);
          border-color: var(--border-accent);
        }
        .sdv-header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
        .sdv-badge {
          padding: 4px 10px; border-radius: 6px;
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .sdv-card h3 { font-size: 1.15rem; }
        .sdv-card p { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.65; }
        .sdv-needs { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 16px; }
        .sdv-tag {
          background: var(--bg-surface); border: 1px solid var(--border);
          padding: 4px 11px; border-radius: 5px;
          font-size: 0.73rem; color: var(--text-muted); font-weight: 500;
        }

        /* ── How it works ────────────────────────── */
        .how { background: var(--bg); }
        .steps { display: flex; flex-direction: column; margin-top: 56px; }
        .step {
          display: flex; gap: 40px; align-items: flex-start;
          padding: 32px 0; border-bottom: 1px solid var(--border);
        }
        .step:last-child { border-bottom: none; }
        .step-num {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 3rem; color: rgba(201,168,76,0.5);
          min-width: 56px; line-height: 1;
          font-style: italic;
        }
        .step-content h3 { font-size: 1.2rem; margin-bottom: 10px; }
        .step-content p { color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; }

        /* ── Revenue model ───────────────────────── */
        .revenue { background: var(--bg-surface); }
        .model-row {
          display: flex; gap: 16px; align-items: stretch;
          margin-top: 56px; flex-wrap: wrap;
        }
        .model-card {
          flex: 1; min-width: 220px;
          background: var(--bg-card); border-radius: var(--radius); padding: 28px;
          box-shadow: var(--shadow-sm); border: 1px solid var(--border);
        }
        .model-card.highlight {
          border-color: var(--border-accent);
          background: linear-gradient(135deg, #fff 0%, rgba(201,168,76,0.04) 100%);
        }
        .model-card h4 {
          font-size: 0.75rem; color: var(--accent); margin-bottom: 10px;
          font-family: inherit; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .model-card p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.65; }
        .model-arrow {
          display: flex; align-items: center; color: var(--accent);
          font-size: 1.75rem; padding: 0 4px; font-weight: 300;
        }

        /* ── Timeline ────────────────────────────── */
        .timeline { background: var(--bg); }
        .tl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px; margin-top: 56px;
        }
        .tl-card {
          background: var(--bg-card); border-radius: var(--radius); padding: 28px;
          box-shadow: var(--shadow-sm); border: 1px solid var(--border);
          border-top: 3px solid var(--accent);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .tl-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
        .tl-phase {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--accent); margin-bottom: 10px;
        }
        .tl-card h3 { font-size: 1.05rem; margin-bottom: 12px; }
        .tl-card ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
        .tl-card li {
          font-size: 0.83rem; color: var(--text-secondary);
          padding-left: 16px; position: relative; line-height: 1.5;
        }
        .tl-card li::before {
          content: ''; position: absolute; left: 0;
          width: 5px; height: 5px; border-radius: 50%;
          background: var(--accent); top: 7px;
        }

        /* ── Waitlist ─────────────────────────────── */
        .waitlist {
          text-align: center;
          background: var(--accent);
        }
        .waitlist .section-label { color: rgba(255,255,255,0.65); justify-content: center; }
        .waitlist .section-label::before { background: rgba(255,255,255,0.4); }
        .waitlist .section-title { color: #fff; }
        .waitlist .section-sub { color: rgba(255,255,255,0.78); margin: 0 auto; }
        .waitlist-box {
          max-width: 520px; margin: 48px auto 0;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(12px);
          border-radius: var(--radius); padding: 40px;
        }
        .waitlist-tabs {
          display: flex; gap: 4px; margin-bottom: 28px;
          background: rgba(0,0,0,0.12); border-radius: var(--radius-sm);
          padding: 4px;
        }
        .tab {
          flex: 1; padding: 10px;
          background: transparent; border: none;
          border-radius: 8px;
          color: rgba(255,255,255,0.55); cursor: pointer;
          font-family: inherit; font-size: 0.875rem; font-weight: 600;
          transition: background 0.2s, color 0.2s;
        }
        .tab.active { background: rgba(255,255,255,0.18); color: #fff; }
        .waitlist-form { display: flex; flex-direction: column; gap: 12px; }
        .waitlist-form input, .waitlist-form select {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: var(--radius-sm); padding: 13px 16px;
          color: #fff; font-family: inherit; font-size: 0.95rem;
          outline: none; transition: border-color 0.2s, background 0.2s;
          width: 100%;
        }
        .waitlist-form input::placeholder { color: rgba(255,255,255,0.5); }
        .waitlist-form input:focus, .waitlist-form select:focus {
          border-color: rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.18);
        }
        .waitlist-form select { color: rgba(255,255,255,0.85); }
        .waitlist-form select option { background: var(--accent-dim); color: #fff; }
        .waitlist .btn-primary {
          background: #fff; color: var(--accent);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }
        .waitlist .btn-primary:hover {
          background: #f0fdfb; color: var(--accent-dim);
          box-shadow: 0 6px 24px rgba(0,0,0,0.18);
        }
        .waitlist-note { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 10px; }

        /* ── Footer ──────────────────────────────── */
        footer {
          background: #0f172a;
          padding: 48px 24px; text-align: center;
        }
        .footer-logo {
          font-family: 'DM Serif Display', Georgia, serif;
          font-size: 1.6rem; color: #fff; margin-bottom: 10px;
        }
        .footer-logo span { color: var(--accent-light); }
        footer p { color: rgba(255,255,255,0.4); font-size: 0.85rem; }

        /* ── Fade-in ──────────────────────────────── */
        .fade-in { animation: fadeIn 0.6s ease forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }

        /* ── Responsive ──────────────────────────── */
        @media (max-width: 768px) {
          section { padding: 72px 20px; }
          .hero { padding: 120px 20px 80px; }
          .hero h1 { font-size: clamp(2.5rem, 8vw, 3.5rem); }
          .hero-content { max-width: 100%; }
          .hero-stats { gap: 28px; margin-top: 40px; padding-top: 28px; }
          .stat { text-align: center; }
          .model-arrow { display: none; }
          .step { flex-direction: column; gap: 8px; }
          .step-num { font-size: 2rem; }
          .waitlist-box { padding: 28px 20px; }
          .nav { padding: 14px 20px; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">The <span>Mandate</span></div>
        <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
          <a href="/donate" style={{background:"transparent",color:"var(--accent)",padding:"9px 18px",borderRadius:"var(--radius-sm)",fontWeight:600,fontSize:"0.875rem",border:"1.5px solid var(--border-accent)",textDecoration:"none",transition:"background 0.2s,color 0.2s"}}>Donate / Join</a>
          <button className="nav-cta" onClick={() => {
            document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
          }}>Join Waitlist</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        {/* Background media */}
        <div className="hero-media" key={region}>
          <div
            className="hero-media-img"
            style={{ backgroundImage: `url(${c.heroImg})` }}
          />
        </div>
        <div className="hero-overlay" />

        <div className={`hero-content${geoLoaded ? " fade-in" : ""}`}>
          <h1>{c.headline}</h1>
          <p className="hero-sub">{c.sub}</p>
          <p className="hero-pricing">{c.pricing}</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => {
              document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
            }}>{c.primaryCta}</button>
            <button className="btn-secondary" onClick={() => {
              document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
            }}>{c.secondaryCta}</button>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-num">6</div>
              <div className="stat-label">Service Divisions</div>
            </div>
            <div className="stat">
              <div className="stat-num">$1.8M</div>
              <div className="stat-label">ARR Target · Year 3</div>
            </div>
            <div className="stat">
              <div className="stat-num">M9</div>
              <div className="stat-label">Break-even</div>
            </div>
            <div className="stat">
              <div className="stat-num">40K+</div>
              <div className="stat-label">Subscribers · 3 Markets</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="problem">
        <div className="container">
          <p className="section-label">The Gap</p>
          <h2 className="section-title">Basic needs have no infrastructure.</h2>
          <p className="section-sub">
            Billions of people can access Netflix, ride Uber, and order food online —
            but no single platform ensures access to the five fundamentals every human
            deserves. That changes now.
          </p>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-num">2.2B</div>
              <div className="problem-label">people without reliable access to safe drinking water</div>
            </div>
            <div className="problem-card">
              <div className="problem-num">1.6B</div>
              <div className="problem-label">living without adequate shelter — not by choice</div>
            </div>
            <div className="problem-card">
              <div className="problem-num">733M</div>
              <div className="problem-label">go to sleep hungry every night</div>
            </div>
            <div className="problem-card">
              <div className="problem-num">$0</div>
              <div className="problem-label">sustainable tech infrastructure addressing this — until now</div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="impact">
        <div className="container">
          <p className="section-label">Why It Matters</p>
          <h2 className="section-title">More than a subscription. A lifeline.</h2>
          <p className="section-sub">
            When basic needs are met, everything else becomes possible — careers, families,
            communities, futures. The Mandate is the platform that makes that possible, at scale.
          </p>
          <div className="impact-grid">
            <div className="impact-card">
              <h3>Clean water, on schedule</h3>
              <p>Subscribers receive reliable water access through vetted local providers, delivered to where they are, not where services assume they should be.</p>
            </div>
            <div className="impact-card">
              <h3>Shelter that feels like home</h3>
              <p>From emergency housing to stability support, connecting people to providers who offer safe, clean, dignified shelter options in their community.</p>
            </div>
            <div className="impact-card">
              <h3>Nourishment, not charity</h3>
              <p>Fresh, local food sourced from community providers and markets, delivered with dignity. Subscribers choose; providers fulfill; everyone benefits.</p>
            </div>
            <div className="impact-card">
              <h3>Dressed with confidence</h3>
              <p>Clean, well-fitted clothing that reflects who someone is. Providers earn; subscribers receive; dignity is the standard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SDVs */}
      <section className="sdvs">
        <div className="container">
          <p className="section-label">The Platform</p>
          <h2 className="section-title">Six Service Divisions. One Mandate.</h2>
          <p className="section-sub">
            Each division is independently monetizable, cross-subsidized by advertising
            and provider commissions — built to sustain itself, not dependent on donations or grants.
          </p>
          <div className="sdv-grid">
            <div className="sdv-card">
              <div className="sdv-header">
                <span className="sdv-badge" style={{background:'rgba(16,185,129,0.15)',color:'var(--sdv1)'}}>SDV 1</span>
                <h3>Basic Needs</h3>
              </div>
              <p>Recurring subscriptions for water, shelter, food, clothing, and rest. Per-region pricing, powered by local provider networks in every community we serve.</p>
              <div className="sdv-needs">
                {['Water','Shelter','Food','Clothing','Rest'].map(n => (
                  <span key={n} className="sdv-tag">{n}</span>
                ))}
              </div>
            </div>

            <div className="sdv-card">
              <div className="sdv-header">
                <span className="sdv-badge" style={{background:'rgba(59,130,246,0.15)',color:'var(--sdv2)'}}>SDV 2</span>
                <h3>Provider Network</h3>
              </div>
              <p>Local businesses and individuals sign up, take jobs, and receive direct payouts. Every provider earns fairly. Target: 100 providers live at launch, growing with every region.</p>
              <div className="sdv-needs">
                {['Sign up','Take jobs','Direct payout','WhatsApp flow'].map(n => (
                  <span key={n} className="sdv-tag">{n}</span>
                ))}
              </div>
            </div>

            <div className="sdv-card">
              <div className="sdv-header">
                <span className="sdv-badge" style={{background:'rgba(139,92,246,0.15)',color:'var(--sdv3)'}}>SDV 3</span>
                <h3>AI Life Coach</h3>
              </div>
              <p>Resume building, interview prep, exam support, and career guidance — AI-powered, available to every subscriber. Because access to opportunity should be universal.</p>
              <div className="sdv-needs">
                {['Resume','Interview prep','Career paths','Skills assessment'].map(n => (
                  <span key={n} className="sdv-tag">{n}</span>
                ))}
              </div>
            </div>

            <div className="sdv-card">
              <div className="sdv-header">
                <span className="sdv-badge" style={{background:'rgba(245,158,11,0.15)',color:'var(--sdv4)'}}>SDV 4</span>
                <h3>Job Creation Engine</h3>
              </div>
              <p>A job board and placement engine connecting subscribers with providers and employers. Every transaction on the platform creates real employment in the community.</p>
              <div className="sdv-needs">
                {['Job board','Placement','Local employers','Remote work'].map(n => (
                  <span key={n} className="sdv-tag">{n}</span>
                ))}
              </div>
            </div>

            <div className="sdv-card">
              <div className="sdv-header">
                <span className="sdv-badge" style={{background:'rgba(239,68,68,0.15)',color:'var(--sdv5)'}}>SDV 5</span>
                <h3>Regional Funds</h3>
              </div>
              <p>Capital pools allocated per region with full transparency. Communities see exactly where funds come from and where they go. No black boxes. No guesswork.</p>
              <div className="sdv-needs">
                {['Capital pool','Transparency','Allocation','Community input'].map(n => (
                  <span key={n} className="sdv-tag">{n}</span>
                ))}
              </div>
            </div>

            <div className="sdv-card">
              <div className="sdv-header">
                <span className="sdv-badge" style={{background:'rgba(107,114,128,0.15)',color:'#9ca3af'}}>SDV 6</span>
                <h3>Advertising</h3>
              </div>
              <p>Ad spaces built into the platform fund operations and keep subscriptions accessible. Businesses reach a purpose-driven audience. Subscribers benefit from what brands spend.</p>
              <div className="sdv-needs">
                {['Display ads','Sponsored listings','Regional targeting','B2B placements'].map(n => (
                  <span key={n} className="sdv-tag">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="container">
          <p className="section-label">How It Works</p>
          <h2 className="section-title">Simple for subscribers. Powerful underneath.</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <div className="step-content">
                <h3>Subscribe to your needs</h3>
                <p>Choose a subscription tier for water, food, shelter, or the full bundle. Pricing is localized to your region — Jamaican dollars, USD, GBP, or the right currency for where you are.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <div className="step-content">
                <h3>Get matched to local providers</h3>
                <p>Our network of vetted local providers delivers what you need. They are compensated directly and fairly through the platform — no middlemen taking cuts from people doing real work.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <div className="step-content">
                <h3>Access your AI Life Coach</h3>
                <p>Every subscriber receives AI-guided career support — resume help, interview practice, skill development paths. Not a chatbot. A coach that remembers your goals and tracks your progress.</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <div className="step-content">
                <h3>Advertising funds the system</h3>
                <p>Businesses pay to reach The Mandate&apos;s audience. That revenue keeps subscription costs accessible — and covers them entirely for people who qualify. The system sustains itself.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="waitlist" id="waitlist">
        <div className="container">
          <p className="section-label">Early Access</p>
          <h2 className="section-title">Be part of the first wave.</h2>
          <p className="section-sub" style={{margin:'0 auto'}}>
            We are onboarding subscribers and providers in Kingston + Portmore first.
            Join the waitlist and we will reach out when your region goes live.
          </p>
          <div className="waitlist-box">
            <div className="waitlist-tabs">
              <button
                className={`tab${waitlistTab === "subscriber" ? " active" : ""}`}
                onClick={() => setWaitlistTab("subscriber")}
              >I want access</button>
              <button
                className={`tab${waitlistTab === "provider" ? " active" : ""}`}
                onClick={() => setWaitlistTab("provider")}
              >I&apos;m a provider</button>
            </div>
            <form className="waitlist-form" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your name" required />
              <input type="email" placeholder="Email address" required />
              <input type="tel" placeholder="WhatsApp number (optional)" />
              {waitlistTab === "provider" && (
                <input type="text" placeholder="Your business or service type" />
              )}
              <select defaultValue="">
                <option value="" disabled>Your city / region</option>
                {c.waitlistRegions.map(r => (
                  <option key={r}>{r}</option>
                ))}
                {!c.waitlistRegions.includes("Other") && (
                  <option>Other</option>
                )}
              </select>
              <button type="submit" className="btn-primary" style={{marginTop:'4px'}}>
                {waitlistTab === "subscriber" ? "Join the Waitlist" : "Apply as a Provider"}
              </button>
            </form>
            <p className="waitlist-note">No spam. We notify you when your region launches.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">The <span>Mandate</span></div>
        <p>A J Supreme Tech initiative · Basic human needs, subscribed.</p>
        <p style={{marginTop:'8px'}}>{c.city}</p>
        <div style={{marginTop:'28px',display:'flex',gap:'6px',justifyContent:'center',flexWrap:'wrap',alignItems:'center'}}>
          <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.3)',letterSpacing:'0.08em',textTransform:'uppercase',marginRight:'8px'}}>View region</span>
          {([
            {label:'Jamaica',param:'JA'},
            {label:'United States',param:'US'},
            {label:'United Kingdom',param:'UK'},
            {label:'Africa',param:'AF'},
          ] as {label:string;param:string}[]).map(({label,param}) => (
            <a
              key={param}
              href={`?r=${param}`}
              style={{
                fontSize:'0.78rem',color:'rgba(255,255,255,0.45)',
                textDecoration:'none',padding:'4px 12px',
                border:'1px solid rgba(255,255,255,0.12)',
                borderRadius:'5px',transition:'color 0.2s,border-color 0.2s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.85)';(e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(255,255,255,0.3)';}}
              onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color='rgba(255,255,255,0.45)';(e.currentTarget as HTMLAnchorElement).style.borderColor='rgba(255,255,255,0.12)';}}
            >{label}</a>
          ))}
        </div>
      </footer>
    </>
  );
}
