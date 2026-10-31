"use client";
import { useState, useEffect } from "react";

interface NavLink { label: string; href: string; }
interface Props {
  logoSrc: string;
  logoAlt: string;
  phone: string;
  navLinks: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  accent?: string;
  category?: string;
}

// Bottom nav icon SVGs
const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ShopIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.71l1.65-9.69H6"/>
  </svg>
);
const GalleryIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);
const ContactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013 5.18 2 2 0 015 3h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 17z"/>
  </svg>
);
const CartIcon = ({ count }: { count: number }) => (
  <div style={{ position: "relative", display: "inline-flex" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.98-1.71l1.65-9.69H6"/>
    </svg>
    {count > 0 && (
      <span style={{ position: "absolute", top: -6, right: -6, background: "var(--accent)", color: "#fff", borderRadius: "999px", fontSize: 9, fontWeight: 800, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
        {count > 9 ? "9+" : count}
      </span>
    )}
  </div>
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const QuoteIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

function getNavIcon(label: string, href: string): JSX.Element {
  const lc = label.toLowerCase();
  if (lc === "home" || href === "/" || href === "#") return <HomeIcon />;
  if (lc.includes("shop") || lc.includes("product") || lc.includes("menu") || lc.includes("order")) return <ShopIcon />;
  if (lc.includes("gallery") || lc.includes("photo") || lc.includes("port")) return <GalleryIcon />;
  if (lc.includes("contact") || lc.includes("reach") || lc.includes("touch")) return <ContactIcon />;
  if (lc.includes("book") || lc.includes("appoint") || lc.includes("reserv")) return <ContactIcon />;
  if (lc.includes("service")) return <ShopIcon />;
  return <QuoteIcon />;
}

function getBottomNavItems(navLinks: NavLink[]) {
  const home = navLinks.find(l => l.label.toLowerCase() === "home" || l.href === "/" || l.href === "#");
  const rest = navLinks.filter(l => l !== home);
  const ordered = home ? [home, ...rest] : navLinks;
  return ordered.slice(0, 5).map(l => ({ icon: getNavIcon(l.label, l.href), label: l.label, href: l.href }));
}

import { createClient } from "@supabase/supabase-js";
const _sb = typeof window !== "undefined"
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "")
  : null;

export function SiteNav({ logoSrc, logoAlt, phone, navLinks, ctaLabel, ctaHref, accent = "#1A1A1A", category }: Props) {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPwd, setAuthPwd] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authStatus, setAuthStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [authMsg, setAuthMsg] = useState("");
  const [user, setUser] = useState<{ email?: string } | null>(null);

  // Listen for cart updates dispatched by ShopGrid
  useEffect(() => {
    const handler = (e: CustomEvent) => setCartCount(e.detail?.count ?? 0);
    window.addEventListener("cart-update", handler as EventListener);
    return () => window.removeEventListener("cart-update", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!_sb) return;
    _sb.auth.getSession().then(({ data }) => { if (data.session?.user) setUser({ email: data.session.user.email }); });
    const { data: { subscription } } = _sb.auth.onAuthStateChange((_e, s) => { setUser(s?.user ? { email: s.user.email } : null); });
    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!_sb) return;
    setAuthStatus("loading");
    const fn = authMode === "signin" ? _sb.auth.signInWithPassword({ email: authEmail, password: authPwd }) : _sb.auth.signUp({ email: authEmail, password: authPwd });
    const { error } = await fn;
    if (error) { setAuthStatus("error"); setAuthMsg(error.message); }
    else { setAuthStatus("done"); setAuthOpen(false); setAuthMsg(""); }
  };

  const handleSignOut = async () => { if (_sb) { await _sb.auth.signOut(); setUser(null); } };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };

  const bottomItems = getBottomNavItems(navLinks);

  return (
    <>
      <header style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.96)", backdropFilter: "blur(10px)", borderBottom: "1px solid #E5E5E5" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64 }}>
          {/* Logo â€” click scrolls to top */}
          <button onClick={scrollToTop} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center" }} aria-label="Back to top">
            {logoSrc
              ? <img src={logoSrc} alt={logoAlt} style={{ height: 36, objectFit: "contain" }} />
              : <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", color: "#111" }}>{logoAlt}</span>
            }
          </button>

          {/* Desktop nav */}
          <nav className="site-desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center", flex: 1, justifyContent: "center" }}>
            {navLinks.map((l) => (
              <div key={l.label} style={{ position: "relative" }}
                onMouseEnter={() => setHovered(l.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <a href={l.href} style={{ fontSize: 14, color: hovered === l.label ? accent : "#555", textDecoration: "none", transition: "color 0.15s", fontWeight: hovered === l.label ? 600 : 400 }}>
                  {l.label}
                </a>
              </div>
            ))}
          </nav>

          {/* Right side: cart + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            {/* Profile icon â€” desktop */}
            <button onClick={() => user ? handleSignOut() : setAuthOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: user ? accent : "#888", display: "flex", alignItems: "center" }}
              aria-label={user ? `Signed in as ${user.email}` : "Sign in"} title={user ? user.email : "Sign in"}>
              <ProfileIcon />
            </button>
            {/* Cart icon â€” desktop */}
            {cartCount > 0 && (
              <button className="site-desktop-nav" onClick={() => window.dispatchEvent(new CustomEvent("open-cart"))}
                style={{ background: "none", border: "none", cursor: "pointer", color: accent, display: "flex", alignItems: "center" }}
                aria-label={`Cart (${cartCount})`}>
                <CartIcon count={cartCount} />
              </button>
            )}
            {ctaLabel && ctaHref && (
              <a href={ctaHref} className="site-desktop-cta" style={{ background: accent, color: "#FFFFFF", padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                {ctaLabel}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="site-md-phone" style={{ fontSize: 13, fontWeight: 600, color: accent, textDecoration: "none", display: "none" }}>
                {phone}
              </a>
            )}
            {/* Hamburger - mobile only */}
            <button onClick={() => setOpen(!open)}
              style={{ background: "none", border: "1px solid #E5E5E5", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 18, lineHeight: 1, display: "none" }}
              aria-label="Menu" className="site-mobile-btn">&#9776;</button>
          </div>
        </div>

        {/* Mobile dropdown (hamburger) */}
        {open && (
          <div style={{ borderTop: "1px solid #E5E5E5", background: "#fff", padding: "12px 16px 20px" }}>
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)}
                style={{ display: "block", padding: "12px 0", fontSize: 15, color: "#333", textDecoration: "none", borderBottom: "1px solid #F5F5F5" }}>
                {l.label}
              </a>
            ))}
            {ctaLabel && ctaHref && (
              <a href={ctaHref} onClick={() => setOpen(false)}
                style={{ display: "block", marginTop: 16, background: accent, color: "#FFFFFF", padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>
                {ctaLabel}
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} style={{ display: "block", marginTop: 12, fontSize: 14, fontWeight: 600, color: accent, textDecoration: "none", textAlign: "center" }}>
                {phone}
              </a>
            )}
          </div>
        )}
      </header>

      {/* â”€â”€ TRAILING BOTTOM NAV â€” mobile only â”€â”€ */}
      <nav className="site-bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(12px)", borderTop: "1px solid #E8E8E8", display: "none", alignItems: "center", justifyContent: "space-around", padding: "8px 0 max(8px, env(safe-area-inset-bottom))" }}>
        {bottomItems.map((item) => (
          <a key={item.label} href={item.href}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "#666", textDecoration: "none", fontSize: 10, fontWeight: 500, minWidth: 56, padding: "0 4px" }}
            onClick={() => setOpen(false)}>
            <span style={{ color: "#444" }}>{item.icon}</span>
            {item.label}
          </a>
        ))}
        {/* Cart slot â€” only show when items in cart */}
        {cartCount > 0 && (
        <button onClick={() => { window.dispatchEvent(new CustomEvent("open-cart")); }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: "#666", background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 500, minWidth: 56, padding: "0 4px" }}
          aria-label="Cart">
          <CartIcon count={cartCount} />
          Cart
        </button>
        )}
      </nav>

      {/* Spacer so content doesn't hide behind bottom nav on mobile */}
      <div className="site-bottom-spacer" style={{ display: "none", height: 64 }} />

      {/* Auth modal */}
      {authOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, width: "min(400px,100%)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{authMode === "signin" ? "Sign In" : "Create Account"}</h3>
              <button onClick={() => setAuthOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#888", lineHeight: 1 }}>&#215;</button>
            </div>
            <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="email" placeholder="Email" required value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
              <input type="password" placeholder="Password" required value={authPwd} onChange={(e) => setAuthPwd(e.target.value)} style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #d1d5db", fontSize: 15 }} />
              {authStatus === "error" && <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{authMsg}</p>}
              <button type="submit" style={{ background: accent, color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 700, cursor: "pointer", fontSize: 15 }}>
                {authStatus === "loading" ? "..." : authMode === "signin" ? "Sign In" : "Sign Up"}
              </button>
            </form>
            <p style={{ textAlign: "center", fontSize: 13, marginTop: 16, color: "#6b7280" }}>
              {authMode === "signin" ? "No account? " : "Have an account? "}
              <button onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")} style={{ background: "none", border: "none", color: accent, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
                {authMode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .site-desktop-nav { display: none !important; }
          .site-desktop-cta { display: none !important; }
          .site-mobile-btn { display: block !important; }
          .site-bottom-nav { display: flex !important; }
          .site-bottom-spacer { display: block !important; }
        }
        @media (min-width: 768px) {
          .site-md-phone { display: block !important; }
        }
      `}</style>
    </>
  );
}
