"use client";
import { useState } from "react";

interface NavChild { label: string; href: string; }
interface NavLink { label: string; href: string; children?: NavChild[]; }
interface Props {
  logoSrc: string;
  logoAlt: string;
  phone: string;
  navLinks: NavLink[];
  ctaLabel?: string;
  ctaHref?: string;
  accent?: string;
}

export function SiteNav({ logoSrc, logoAlt, phone, navLinks, ctaLabel, ctaHref, accent = "#1A1A1A" }: Props) {
  const [open, setOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  const toggleMobileSection = (label: string) =>
    setExpandedMobile((prev) => (prev === label ? null : label));

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid #E5E5E5" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", height: 64 }}>
        {/* Logo */}
        {logoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoSrc} alt={logoAlt} style={{ height: 36, objectFit: "contain", flexShrink: 0 }} />
        ) : (
          <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em", color: "#111", flexShrink: 0 }}>{logoAlt}</span>
        )}

        {/* Desktop nav */}
        <nav className="site-desktop-nav" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {navLinks.map((l) =>
            l.children && l.children.length > 0 ? (
              <div key={l.label} style={{ position: "relative" }} className="site-nav-dropdown-wrapper">
                <a href={l.href} style={{ fontSize: 14, color: "#555", textDecoration: "none", transition: "color 0.15s", display: "flex", alignItems: "center", gap: 4 }}
                  onMouseEnter={e => (e.currentTarget.style.color = accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                >
                  {l.label}
                  <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
                </a>
                <div className="site-nav-dropdown" style={{
                  position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                  background: "#fff", border: "1px solid #E5E5E5", borderRadius: 10, padding: "8px 0",
                  minWidth: 180, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50,
                  opacity: 0, pointerEvents: "none", transition: "opacity 0.15s ease, transform 0.15s ease",
                }}>
                  {l.children.map((child) => (
                    <a key={child.label} href={child.href} style={{ display: "block", padding: "9px 18px", fontSize: 13, color: "#444", textDecoration: "none" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.color = accent; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#444"; }}
                    >{child.label}</a>
                  ))}
                </div>
              </div>
            ) : (
              <a key={l.label} href={l.href} style={{ fontSize: 14, color: "#555", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = accent)}
                onMouseLeave={e => (e.currentTarget.style.color = "#555")}
              >{l.label}</a>
            )
          )}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
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
          <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "1px solid #E5E5E5", borderRadius: 6, padding: "6px 10px", cursor: "pointer", fontSize: 18, lineHeight: 1, display: "none" }}
            aria-label="Menu"
            className="site-mobile-btn"
          >&#9776;</button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ borderTop: "1px solid #E5E5E5", background: "#fff", padding: "12px 16px 20px" }}>
          {navLinks.map((l) => (
            <div key={l.label}>
              {l.children && l.children.length > 0 ? (
                <>
                  <button
                    onClick={() => toggleMobileSection(l.label)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 0", fontSize: 15, color: "#333", background: "none", border: "none", borderBottom: "1px solid #F5F5F5", cursor: "pointer", textAlign: "left" }}
                  >
                    {l.label}
                    <span style={{ fontSize: 12, transition: "transform 0.2s", transform: expandedMobile === l.label ? "rotate(180deg)" : "none" }}>▾</span>
                  </button>
                  {expandedMobile === l.label && (
                    <div style={{ background: "#f9fafb", borderRadius: 8, margin: "4px 0 8px", padding: "4px 0" }}>
                      {l.children.map((child) => (
                        <a key={child.label} href={child.href} onClick={() => setOpen(false)}
                          style={{ display: "block", padding: "10px 16px", fontSize: 14, color: "#555", textDecoration: "none" }}
                        >{child.label}</a>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <a href={l.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "12px 0", fontSize: 15, color: "#333", textDecoration: "none", borderBottom: "1px solid #F5F5F5" }}>{l.label}</a>
              )}
            </div>
          ))}
          {ctaLabel && ctaHref && (
            <a href={ctaHref} onClick={() => setOpen(false)} style={{ display: "block", marginTop: 16, background: accent, color: "#FFFFFF", padding: "12px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center" }}>{ctaLabel}</a>
          )}
          {phone && (
            <a href={`tel:${phone}`} style={{ display: "block", marginTop: 12, fontSize: 14, fontWeight: 600, color: accent, textDecoration: "none", textAlign: "center" }}>{phone}</a>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .site-desktop-nav { display: none !important; }
          .site-desktop-cta { display: none !important; }
          .site-mobile-btn { display: block !important; }
        }
        @media (min-width: 768px) {
          .site-md-phone { display: block !important; }
          .site-nav-dropdown-wrapper:hover .site-nav-dropdown {
            opacity: 1 !important;
            pointer-events: all !important;
          }
        }
      `}</style>
    </header>
  );
}
