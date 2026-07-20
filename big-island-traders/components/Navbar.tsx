"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import AuthModal from "@/components/AuthModal";

type UserSession = { name: string; email: string } | null;

const CartSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const SunSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
  </svg>
);
const UserSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/corporate", label: "Corporate" },
  { href: "/book", label: "Book" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [user, setUser] = useState<UserSession>(null);
  const { count, setIsOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    const raw = localStorage.getItem("bit_session");
    if (raw) { try { setUser(JSON.parse(raw)); } catch { /**/ } }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleSignIn = (name: string, email: string) => {
    setUser({ name, email });
  };

  const signOut = () => {
    localStorage.removeItem("bit_session");
    setUser(null);
    setUserMenu(false);
  };

  const initials = user ? user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() : "";

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSignIn={handleSignIn} />

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        backgroundColor: scrolled ? "var(--nav-bg)" : "rgba(6,12,26,0.6)",
        backdropFilter: "blur(14px)",
        borderBottom: scrolled ? "1px solid var(--nav-border)" : "none",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logobigisland.jpg" alt="Big Island Traders" style={{ height: 40, width: "auto", objectFit: "contain" }} />
          </Link>

          {/* Desktop center nav */}
          <div className="nav-desktop-links" style={{ gap: 28, alignItems: "center" }}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 14, fontWeight: 500, letterSpacing: "0.3px", transition: "color 0.2s", fontFamily: "Inter, sans-serif" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A84A")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>

            {/* Theme toggle */}
            <button onClick={toggleTheme} aria-label="Toggle theme"
              style={{ background: "none", border: "1px solid rgba(200,168,74,0.3)", cursor: "pointer", color: "#C8A84A", borderRadius: 4, padding: "5px 9px", display: "flex", alignItems: "center", gap: 5, fontSize: 10, letterSpacing: "0.08em", fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
              {theme === "dark" ? <SunSVG /> : <MoonSVG />}
              <span style={{ display: "inline" }}>{theme === "dark" ? "LIGHT" : "DARK"}</span>
            </button>

            {/* Cart */}
            <button onClick={() => setIsOpen(true)} aria-label="Cart"
              style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", padding: "6px 8px" }}>
              <CartSVG />
              {count > 0 && (
                <span style={{ position: "absolute", top: 2, right: 2, backgroundColor: "#C8A84A", color: "#0A0906", borderRadius: "50%", width: 16, height: 16, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {count}
                </span>
              )}
            </button>

            {/* Sign In / Account — hidden on mobile (mobile strip handles it) */}
            <div className="nav-auth-desktop">
              {user ? (
                <div style={{ position: "relative" }}>
                  <button onClick={() => setUserMenu(!userMenu)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px solid rgba(200,168,74,0.3)", cursor: "pointer", borderRadius: 4, padding: "6px 12px" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#C8A84A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "#0A0906", fontFamily: "Montserrat, sans-serif" }}>
                      {initials}
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
                  </button>
                  {userMenu && (
                    <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, backgroundColor: "#0D1933", border: "1px solid rgba(200,168,74,0.2)", borderRadius: 6, padding: "8px 0", minWidth: 180, zIndex: 300 }}>
                      <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 2 }}>{user.email}</div>
                      </div>
                      <Link href="/account" onClick={() => setUserMenu(false)} style={{ display: "block", padding: "10px 16px", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 13 }}>My Orders</Link>
                      <Link href="/book" onClick={() => setUserMenu(false)} style={{ display: "block", padding: "10px 16px", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 13 }}>Book Consultation</Link>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 4 }}>
                        <button onClick={signOut} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 16px", background: "none", border: "none", color: "#E8561A", fontSize: 13, cursor: "pointer" }}>Sign Out</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)}
                  style={{ display: "flex", alignItems: "center", gap: 7, backgroundColor: "transparent", border: "1px solid rgba(200,168,74,0.4)", color: "#C8A84A", cursor: "pointer", borderRadius: 4, padding: "8px 14px", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em" }}>
                  <UserSVG />
                  SIGN IN
                </button>
              )}
              <Link href="/shop"
                style={{ backgroundColor: "#C8A84A", color: "#060C1A", padding: "9px 18px", borderRadius: 4, textDecoration: "none", fontFamily: "Montserrat, sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                SHOP WIAG
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile nav — separate strip below header on small screens */}
        <div style={{ display: "none" }} className="mobile-nav-strip">
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid rgba(255,255,255,0.06)", backgroundColor: "rgba(6,12,26,0.97)" }}>
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                style={{ flex: 1, textAlign: "center", padding: "13px 4px", color: "rgba(255,255,255,0.7)", textDecoration: "none", fontSize: 12, fontWeight: 600, letterSpacing: "0.04em", fontFamily: "Montserrat, sans-serif", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                {l.label}
              </Link>
            ))}
            <button onClick={() => setAuthOpen(true)}
              style={{ flex: 1, textAlign: "center", padding: "13px 4px", color: "#C8A84A", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", fontFamily: "Montserrat, sans-serif" }}>
              {user ? user.name.split(" ")[0] : "SIGN IN"}
            </button>
          </div>
        </div>

        <style>{`
          .nav-desktop-links { display: flex; }
          .nav-auth-desktop { display: flex; gap: 10px; align-items: center; }
          @media (max-width: 860px) {
            .nav-desktop-links { display: none !important; }
            .nav-auth-desktop { display: none !important; }
            .mobile-nav-strip { display: block !important; }
          }
        `}</style>
      </nav>
    </>
  );
}
