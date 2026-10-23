"use client";

import { useState } from "react";

type Tab = "donate" | "membership";
type LoadingKey = string | null;

const TIERS = [
  {
    id: "ally",
    name: "Ally",
    amountJmd: 1500,
    badge: "Essential",
    badgeColor: "rgba(16,185,129,0.15)",
    badgeText: "#059669",
    period: "/ month",
    headline: "Meet a basic need",
    benefits: [
      "Funds one basic-need delivery per month",
      "Quarterly impact report by email",
      "Recognition on The Mandate community board",
    ],
    cta: "Become an Ally",
  },
  {
    id: "advocate",
    name: "Advocate",
    amountJmd: 3000,
    badge: "Popular",
    badgeColor: "rgba(201,168,76,0.15)",
    badgeText: "#a88a38",
    period: "/ month",
    headline: "Expand the reach",
    benefits: [
      "Everything in Ally",
      "Sponsor one subscriber's AI Life Coach access",
      "Monthly behind-the-scenes update",
      "Named in provider onboarding materials",
    ],
    cta: "Become an Advocate",
    featured: true,
  },
  {
    id: "champion",
    name: "Champion",
    amountJmd: 5000,
    badge: "High Impact",
    badgeColor: "rgba(124,58,237,0.12)",
    badgeText: "#7c3aed",
    period: "/ month",
    headline: "Drive real change",
    benefits: [
      "Everything in Advocate",
      "Direct line to The Mandate team",
      "Invitation to quarterly strategy calls",
      "Priority recognition across all platforms",
      "Input on which communities are funded next",
    ],
    cta: "Become a Champion",
  },
];

async function initiatePayment(amountJmd: number, description: string) {
  const res = await fetch("/api/payments/handypay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountJmd, description }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string })?.error ?? "Payment initiation failed");
  }
  const { url } = await res.json();
  if (!url) throw new Error("No checkout URL returned");
  window.location.href = url;
}

export default function DonatePage() {
  const [tab, setTab] = useState<Tab>("membership");
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState<LoadingKey>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleTierPay(tier: (typeof TIERS)[number]) {
    setError(null);
    setLoading(tier.id);
    try {
      await initiatePayment(
        tier.amountJmd,
        `The Mandate — ${tier.name} Membership (J$${tier.amountJmd.toLocaleString()}/mo)`
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  async function handleDonate() {
    const amt = parseFloat(customAmount.replace(/,/g, ""));
    if (!amt || amt < 100) {
      setError("Minimum donation is J$100.");
      return;
    }
    setError(null);
    setLoading("donate");
    try {
      await initiatePayment(amt, `The Mandate — One-time Donation (J$${amt.toLocaleString()})`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.35; } }
        .donate-page { min-height:100vh; background:var(--bg-surface); padding-top:80px; }
        .nav {
          position:fixed; top:0; left:0; right:0; z-index:100;
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 32px;
          background:rgba(255,255,255,0.92); backdrop-filter:blur(16px);
          border-bottom:1px solid var(--border);
        }
        .nav-logo {
          font-family:'DM Serif Display',Georgia,serif;
          font-size:1.3rem; color:var(--text-primary); letter-spacing:-0.03em;
          text-decoration:none;
        }
        .nav-logo span { color:var(--accent); }
        .nav-back {
          background:transparent; color:var(--text-secondary);
          padding:8px 18px; border-radius:var(--radius-sm);
          font-size:0.875rem; font-weight:500;
          border:1.5px solid var(--border); cursor:pointer;
          font-family:inherit; text-decoration:none;
          transition:border-color 0.2s,color 0.2s; display:inline-block;
        }
        .nav-back:hover { border-color:var(--accent); color:var(--accent); }
        .donate-hero {
          text-align:center; padding:72px 24px 56px;
          max-width:680px; margin:0 auto;
        }
        .donate-hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:var(--accent-glow); border:1px solid var(--border-accent);
          padding:6px 14px; border-radius:6px;
          font-size:0.72rem; color:var(--accent); margin-bottom:24px;
          font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
        }
        .donate-hero h1 { font-size:clamp(2.2rem,5vw,3.6rem); margin-bottom:18px; color:var(--text-primary); }
        .donate-hero h1 em { color:var(--accent); font-style:italic; }
        .donate-hero p { font-size:1.1rem; color:var(--text-secondary); line-height:1.75; max-width:520px; margin:0 auto; }
        .tab-bar {
          display:flex; gap:4px; max-width:360px; margin:40px auto 0;
          background:rgba(0,0,0,0.05); border-radius:12px; padding:4px;
        }
        .tab-btn {
          flex:1; padding:11px 16px; background:transparent; border:none; border-radius:9px;
          font-family:inherit; font-size:0.9rem; font-weight:600;
          color:var(--text-muted); cursor:pointer; transition:background 0.2s,color 0.2s;
        }
        .tab-btn.active { background:#fff; color:var(--text-primary); box-shadow:0 1px 4px rgba(0,0,0,0.08); }
        .tiers-section { max-width:1060px; margin:0 auto; padding:48px 24px 80px; }
        .tiers-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; margin-top:8px; }
        .tier-card {
          background:var(--bg-card); border-radius:var(--radius);
          border:1.5px solid var(--border); padding:32px 28px 28px;
          display:flex; flex-direction:column; box-shadow:var(--shadow-sm); position:relative;
          transition:box-shadow 0.2s,transform 0.2s,border-color 0.2s;
        }
        .tier-card:hover { box-shadow:var(--shadow); transform:translateY(-3px); border-color:var(--border-accent); }
        .tier-card.featured { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent),var(--shadow); }
        .tier-featured-label {
          position:absolute; top:-13px; left:50%; transform:translateX(-50%);
          background:var(--accent); color:#fff;
          font-size:0.7rem; font-weight:700; letter-spacing:0.09em;
          text-transform:uppercase; padding:4px 14px; border-radius:6px; white-space:nowrap;
        }
        .tier-badge { display:inline-block; padding:4px 10px; border-radius:6px; font-size:0.68rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase; margin-bottom:18px; }
        .tier-name { font-family:'DM Serif Display',Georgia,serif; font-size:1.6rem; color:var(--text-primary); margin-bottom:6px; }
        .tier-price { display:flex; align-items:baseline; gap:4px; margin-bottom:4px; }
        .tier-amount { font-family:'DM Serif Display',Georgia,serif; font-size:2.4rem; color:var(--text-primary); line-height:1; }
        .tier-currency { font-size:1rem; color:var(--text-muted); font-weight:500; }
        .tier-period { font-size:0.85rem; color:var(--text-muted); }
        .tier-headline { font-size:0.85rem; color:var(--text-secondary); margin-bottom:22px; margin-top:8px; }
        .tier-divider { height:1px; background:var(--border); margin-bottom:20px; }
        .tier-benefits { list-style:none; display:flex; flex-direction:column; gap:10px; flex:1; margin-bottom:28px; }
        .tier-benefit { display:flex; align-items:flex-start; gap:10px; font-size:0.875rem; color:var(--text-secondary); line-height:1.5; }
        .benefit-check { width:18px; height:18px; border-radius:50%; background:var(--accent-glow); border:1.5px solid var(--border-accent); display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; color:var(--accent); font-size:0.65rem; font-weight:700; }
        .tier-cta { width:100%; padding:13px 20px; border-radius:var(--radius-sm); font-family:inherit; font-size:0.95rem; font-weight:700; cursor:pointer; border:none; transition:background 0.2s,transform 0.15s,box-shadow 0.2s; }
        .tier-cta-default { background:var(--bg-surface); color:var(--text-primary); border:1.5px solid var(--border); }
        .tier-cta-default:hover { border-color:var(--accent); color:var(--accent); }
        .tier-cta-featured { background:var(--accent); color:#fff; box-shadow:0 4px 14px rgba(201,168,76,0.28); }
        .tier-cta-featured:hover { background:var(--accent-dim); transform:translateY(-1px); }
        .tier-cta:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .recurring-note { text-align:center; padding:0 24px 32px; font-size:0.82rem; color:var(--text-muted); max-width:540px; margin:0 auto; line-height:1.65; }
        .recurring-note strong { color:var(--text-secondary); }
        .donate-section { max-width:520px; margin:0 auto; padding:48px 24px 80px; }
        .donate-card { background:var(--bg-card); border:1.5px solid var(--border); border-radius:var(--radius); padding:40px 36px; box-shadow:var(--shadow-sm); }
        .donate-card h2 { font-size:1.8rem; margin-bottom:8px; }
        .donate-card .sub { font-size:0.95rem; color:var(--text-secondary); margin-bottom:32px; line-height:1.65; }
        .presets { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:22px; }
        .preset-btn { padding:9px 18px; border-radius:var(--radius-sm); font-family:inherit; font-size:0.875rem; font-weight:600; border:1.5px solid var(--border); background:var(--bg-surface); color:var(--text-primary); cursor:pointer; transition:border-color 0.2s,background 0.2s,color 0.2s; }
        .preset-btn:hover,.preset-btn.active { border-color:var(--accent); background:var(--accent-glow); color:var(--accent-dim); }
        .amount-row { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:var(--radius-sm); overflow:hidden; background:var(--bg); transition:border-color 0.2s; margin-bottom:18px; }
        .amount-row:focus-within { border-color:var(--accent); }
        .amount-prefix { padding:0 14px; font-size:0.9rem; color:var(--text-muted); font-weight:600; background:var(--bg-surface); border-right:1.5px solid var(--border); display:flex; align-items:center; align-self:stretch; white-space:nowrap; }
        .amount-input { flex:1; padding:14px 16px; border:none; outline:none; font-family:inherit; font-size:1.1rem; font-weight:600; color:var(--text-primary); background:transparent; }
        .donate-btn { width:100%; padding:14px; background:var(--accent); color:#fff; border:none; border-radius:var(--radius-sm); font-family:inherit; font-size:1rem; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(201,168,76,0.28); transition:background 0.2s,transform 0.15s; }
        .donate-btn:hover { background:var(--accent-dim); transform:translateY(-1px); }
        .donate-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .fee-note { font-size:0.78rem; color:var(--text-muted); margin-top:12px; text-align:center; }
        .error-bar { background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:8px; padding:12px 16px; font-size:0.875rem; color:#dc2626; margin-bottom:16px; }
        .donate-footer { background:#0f172a; padding:40px 24px; text-align:center; }
        .footer-logo { font-family:'DM Serif Display',Georgia,serif; font-size:1.4rem; color:#fff; margin-bottom:8px; }
        .footer-logo span { color:var(--accent-light); }
        .donate-footer p { font-size:0.82rem; color:rgba(255,255,255,0.4); }
        @media (max-width:768px) {
          .nav { padding:14px 20px; }
          .donate-hero { padding:56px 20px 40px; }
          .tiers-section,.donate-section { padding-left:16px; padding-right:16px; }
          .donate-card { padding:28px 22px; }
          .tier-card { padding:28px 22px 22px; }
          .tiers-grid { grid-template-columns:1fr; }
        }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">The <span>Mandate</span></a>
        <a href="/" className="nav-back">← Back</a>
      </nav>

      <div className="donate-page">
        <div className="donate-hero">
          <div className="donate-hero-badge">
            <span style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)',animation:'pulse 2s infinite',display:'inline-block'}} />
            &nbsp;Support The Mandate
          </div>
          <h1>Fund a human<br /><em>right.</em></h1>
          <p>
            Every dollar accelerates access to water, food, shelter, clothing, and rest
            for communities that have been left behind. Choose a monthly membership or
            make a one-time donation — all powered by HandyPay.
          </p>
          <div className="tab-bar">
            <button className={`tab-btn${tab === "membership" ? " active" : ""}`} onClick={() => setTab("membership")}>Monthly Membership</button>
            <button className={`tab-btn${tab === "donate" ? " active" : ""}`} onClick={() => setTab("donate")}>One-time Donation</button>
          </div>
        </div>

        {error && (
          <div style={{maxWidth:520,margin:'0 auto',padding:'0 24px'}}>
            <div className="error-bar">{error}</div>
          </div>
        )}

        {tab === "membership" && (
          <>
            <div className="tiers-section">
              <div className="tiers-grid">
                {TIERS.map((tier) => (
                  <div key={tier.id} className={`tier-card${tier.featured ? " featured" : ""}`}>
                    {tier.featured && <div className="tier-featured-label">Most popular</div>}
                    <div className="tier-badge" style={{background:tier.badgeColor,color:tier.badgeText}}>{tier.badge}</div>
                    <div className="tier-name">{tier.name}</div>
                    <div className="tier-price">
                      <span className="tier-currency">J$</span>
                      <span className="tier-amount">{tier.amountJmd.toLocaleString()}</span>
                      <span className="tier-period">{tier.period}</span>
                    </div>
                    <div className="tier-headline">{tier.headline}</div>
                    <div className="tier-divider" />
                    <ul className="tier-benefits">
                      {tier.benefits.map((b, i) => (
                        <li key={i} className="tier-benefit">
                          <div className="benefit-check">&#10003;</div>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`tier-cta${tier.featured ? " tier-cta-featured" : " tier-cta-default"}`}
                      disabled={loading === tier.id}
                      onClick={() => handleTierPay(tier)}
                    >
                      {loading === tier.id ? "Redirecting\u2026" : tier.cta}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className="recurring-note">
              <strong>How monthly memberships work:</strong> Your payment goes directly to The Mandate
              via HandyPay. To continue your membership, return each month and make your pledge again.
              Full recurring billing is coming \u2014 your early support makes it happen faster.
              A small processing fee may be added at checkout by HandyPay.
            </p>
          </>
        )}

        {tab === "donate" && (
          <div className="donate-section">
            <div className="donate-card">
              <h2>Make a donation</h2>
              <p className="sub">
                Enter any amount in Jamaican dollars. Every contribution goes directly toward
                water, food, shelter, clothing, and rest for people in your community.
              </p>
              <div className="presets">
                {[500, 1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    className={`preset-btn${customAmount === String(amt) ? " active" : ""}`}
                    onClick={() => { setCustomAmount(String(amt)); setError(null); }}
                  >J${amt.toLocaleString()}</button>
                ))}
              </div>
              <div className="amount-row">
                <span className="amount-prefix">J$</span>
                <input
                  className="amount-input"
                  type="number"
                  min="100"
                  step="100"
                  placeholder="Other amount"
                  value={customAmount}
                  onChange={(e) => { setCustomAmount(e.target.value); setError(null); }}
                />
              </div>
              <button className="donate-btn" disabled={loading === "donate"} onClick={handleDonate}>
                {loading === "donate"
                  ? "Redirecting to checkout\u2026"
                  : customAmount
                  ? `Donate J$${parseFloat(customAmount || "0").toLocaleString()}`
                  : "Donate Now"}
              </button>
              <p className="fee-note">
                A small processing fee may be added at checkout by HandyPay.
                You will be redirected to a secure payment page.
              </p>
            </div>
          </div>
        )}
      </div>

      <footer className="donate-footer">
        <div className="footer-logo">The <span>Mandate</span></div>
        <p>A J Supreme Tech initiative \u00b7 Basic human needs, subscribed.</p>
      </footer>
    </>
  );
}