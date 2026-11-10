"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { useCurrency } from "@/context/CurrencyContext"

type Category = { name: string; slug: string; href?: string }

const CATEGORIES: Category[] = [
  { name: "Baby & Toddler",        slug: "baby" },
  { name: "Beauty & Wellness",     slug: "beauty" },
  { name: "Cellphone Accessories", slug: "cellphone" },
  { name: "Electronics & Tech",    slug: "electronics" },
  { name: "Fitness & Outdoor",     slug: "fitness" },
  { name: "Furniture",             slug: "furniture" },
  { name: "Patio & Garden",        slug: "garden" },
  { name: "Home Improvement",      slug: "home-improvement" },
  { name: "Home & Living",         slug: "home-living" },
  { name: "Jewelry & Accessories", slug: "jewelry" },
  { name: "Lifestyle Finds",       slug: "lifestyle" },
  { name: "Office Products",       slug: "office" },
  { name: "Pet Supplies",          slug: "pets" },
  { name: "Adult & Intimate",      slug: "adults", href: "/adults" },
]

export default function Nav() {
  const { cartCount } = useCart()
  const { currency, toggle: toggleCurrency } = useCurrency()
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalItems = cartCount ?? 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <style>{`
        .ms-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(250,250,248,0.94);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          transition: all 0.3s ease;
        }
        .ms-nav.scrolled { box-shadow: 0 1px 20px rgba(0,0,0,0.06); }
        .ms-nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 64px; transition: height 0.3s ease;
        }
        .ms-nav.scrolled .ms-nav-inner { height: 52px; }
        .ms-wordmark {
          font-family: var(--font-serif); font-size: 22px; font-weight: 900;
          color: var(--ink); text-decoration: none; letter-spacing: -0.01em;
        }
        .ms-wordmark span { color: var(--gold); }
        .ms-nav-links {
          display: flex; align-items: center; gap: 36px; list-style: none; margin: 0; padding: 0;
        }
        .ms-nav-link {
          font-family: var(--font-sans); font-size: 11px; font-weight: 600;
          letter-spacing: 0.13em; text-transform: uppercase;
          color: var(--ink); text-decoration: none;
          cursor: pointer; transition: color 0.2s;
          position: relative; display: flex; align-items: center; gap: 4px;
        }
        .ms-nav-link:hover { color: var(--gold); }
        .ms-nav-actions { display: flex; align-items: center; gap: 16px; }
        .ms-currency-chip {
          display: flex; align-items: center; gap: 0;
          border: 1.5px solid var(--border); border-radius: 20px;
          overflow: hidden; cursor: pointer; background: none;
          padding: 0; font-size: 10px; font-weight: 700; letter-spacing: .06em;
        }
        .ms-currency-chip span {
          padding: 4px 9px; transition: all .15s; color: var(--ink-muted);
        }
        .ms-currency-chip span.active {
          background: var(--gold); color: var(--dark);
        }
        .ms-cart-btn {
          position: relative; background: none; border: none; cursor: pointer;
          padding: 4px; display: flex; align-items: center;
          color: var(--ink); transition: color 0.2s;
        }
        .ms-cart-btn:hover { color: var(--gold); }
        .ms-cart-badge {
          position: absolute; top: -6px; right: -6px;
          background: var(--gold); color: var(--ink);
          font-size: 9px; font-weight: 800; border-radius: 50%;
          width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;
        }
        .ms-mega {
          position: absolute; top: 100%; left: 0; right: 0;
          background: var(--surface); border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          box-shadow: 0 8px 40px rgba(0,0,0,0.08);
          padding: 36px 0; z-index: 99;
          animation: fadeIn 0.18s ease;
        }
        .ms-mega-inner {
          max-width: 1280px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 1fr 1fr; gap: 0;
        }
        .ms-mega-col { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .ms-mega-item {
          display: block; padding: 10px 16px; color: var(--ink);
          font-size: 12px; font-weight: 500; letter-spacing: 0.04em;
          text-decoration: none; transition: all 0.15s;
          border-left: 2px solid transparent;
        }
        .ms-mega-item:hover {
          color: var(--gold); border-left-color: var(--gold);
          background: rgba(200,168,75,0.04); padding-left: 20px;
        }
        .ms-hamburger {
          display: none; background: none; border: none; cursor: pointer;
          padding: 4px; color: var(--ink);
        }
        .ms-mobile-overlay {
          position: fixed; inset: 0; background: var(--dark); z-index: 200;
          display: flex; flex-direction: column;
          animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .ms-mobile-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 24px 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .ms-mobile-wordmark {
          font-family: var(--font-serif); font-size: 24px; font-weight: 900;
          color: #fff; text-decoration: none;
        }
        .ms-mobile-wordmark span { color: var(--gold); }
        .ms-close-btn {
          background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.6);
          font-size: 20px; padding: 4px;
        }
        .ms-mobile-nav {
          flex: 1; overflow-y: auto; padding: 32px 24px;
          display: flex; flex-direction: column; gap: 4px;
        }
        .ms-mobile-link {
          font-family: var(--font-serif); font-size: 20px; font-weight: 600;
          color: rgba(255,255,255,0.75); text-decoration: none;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: color 0.2s;
        }
        .ms-mobile-link:hover { color: var(--gold); }
        .ms-mobile-footer {
          padding: 24px; border-top: 1px solid rgba(255,255,255,0.08);
          display: flex; gap: 16px; align-items: center;
        }
        .ms-mobile-currency {
          display: flex; border: 1.5px solid rgba(255,255,255,0.2); border-radius: 20px;
          overflow: hidden; font-size: 10px; font-weight: 700; letter-spacing: .06em;
        }
        .ms-mobile-currency span {
          padding: 6px 12px; cursor: pointer; color: rgba(255,255,255,0.5); transition: all .15s;
        }
        .ms-mobile-currency span.active { background: var(--gold); color: var(--dark); }
        @media (max-width: 768px) {
          .ms-nav-links { display: none; }
          .ms-currency-chip { display: none; }
          .ms-hamburger { display: flex; }
        }
        @media (min-width: 769px) {
          .ms-mobile-overlay { display: none !important; }
        }
      `}</style>

      <nav className={`ms-nav${scrolled ? " scrolled" : ""}`} onMouseLeave={() => setMegaOpen(false)}>
        <div className="ms-nav-inner">
          <Link href="/" className="ms-wordmark">Mine &amp; Yours<span> Shop</span></Link>

          <ul className="ms-nav-links">
            <li>
              <span className="ms-nav-link" onMouseEnter={() => setMegaOpen(true)}>
                Categories <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </span>
            </li>
            <li><Link href="/shop?sort=new" className="ms-nav-link" onClick={() => setMegaOpen(false)}>New In</Link></li>
            <li><Link href="/visualizer" className="ms-nav-link" onClick={() => setMegaOpen(false)}>Visualize</Link></li>
            <li><Link href="/inspire" className="ms-nav-link" onClick={() => setMegaOpen(false)}>Inspire</Link></li>
            <li><Link href="/blog" className="ms-nav-link" onClick={() => setMegaOpen(false)}>Journal</Link></li>
            <li><Link href="/shop" className="ms-nav-link" onClick={() => setMegaOpen(false)}>All Products</Link></li>
          </ul>

          <div className="ms-nav-actions">
            <button className="ms-currency-chip" onClick={toggleCurrency} aria-label="Toggle currency">
              <span className={currency === "JMD" ? "active" : ""}>JMD</span>
              <span className={currency === "USD" ? "active" : ""}>USD</span>
            </button>
            <Link href="/account/login" className="ms-cart-btn" aria-label="Account" title="My Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
            <Link href="/cart" className="ms-cart-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {totalItems > 0 && <span className="ms-cart-badge">{totalItems}</span>}
            </Link>
            <button className="ms-hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {megaOpen && (
          <div className="ms-mega">
            <div className="ms-mega-inner">
              <div className="ms-mega-col">
                {CATEGORIES.slice(0, 7).map(c => (
                  <Link key={c.slug} href={c.href ?? `/shop?category=${c.slug}`} className="ms-mega-item" onClick={() => setMegaOpen(false)}>
                    {c.name}
                  </Link>
                ))}
              </div>
              <div className="ms-mega-col">
                {CATEGORIES.slice(7).map(c => (
                  <Link key={c.slug} href={c.href ?? `/shop?category=${c.slug}`} className="ms-mega-item" onClick={() => setMegaOpen(false)}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {mobileOpen && (
        <div className="ms-mobile-overlay">
          <div className="ms-mobile-header">
            <Link href="/" className="ms-mobile-wordmark" onClick={() => setMobileOpen(false)}>Mine &amp; Yours<span> Shop</span></Link>
            <button className="ms-close-btn" onClick={() => setMobileOpen(false)}>&#x2715;</button>
          </div>
          <nav className="ms-mobile-nav">
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={c.href ?? `/shop?category=${c.slug}`} className="ms-mobile-link" onClick={() => setMobileOpen(false)}>
                {c.name}
              </Link>
            ))}
            <Link href="/visualizer" className="ms-mobile-link" onClick={() => setMobileOpen(false)}>Visualize Your Space</Link>
            <Link href="/inspire" className="ms-mobile-link" onClick={() => setMobileOpen(false)}>Inspire</Link>
            <Link href="/blog" className="ms-mobile-link" onClick={() => setMobileOpen(false)}>Journal</Link>
            <Link href="/shop" className="ms-mobile-link" onClick={() => setMobileOpen(false)}>All Products</Link>
            <Link href="/account/login" className="ms-mobile-link" onClick={() => setMobileOpen(false)}>My Account</Link>
          </nav>
          <div className="ms-mobile-footer">
            <Link href="/cart" className="btn-outline-white" onClick={() => setMobileOpen(false)}>View Cart {totalItems > 0 && `(${totalItems})`}</Link>
            <div className="ms-mobile-currency" onClick={toggleCurrency}>
              <span className={currency === "JMD" ? "active" : ""}>JMD</span>
              <span className={currency === "USD" ? "active" : ""}>USD</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
