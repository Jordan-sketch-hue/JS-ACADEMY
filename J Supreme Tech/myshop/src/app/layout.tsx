import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
import { CurrencyProvider } from "@/context/CurrencyContext"
import Nav from "@/components/Nav"
import { ToastContainer } from "@/components/ToastContainer"

export const metadata: Metadata = {
  title: {
    default: "Mine & Yours Shop — Premium Curated Store | Jamaica",
    template: "%s | Mine & Yours Shop",
  },
  description: "Discover curated collections of premium products — jewelry, home decor, electronics, beauty and more. Fast delivery across Jamaica and beyond. Shop online now.",
  keywords: ["buy online jamaica", "online shopping jamaica", "premium products jamaica", "curated store", "jewelry online", "home decor shop", "electronics jamaica", "beauty products", "myshop"],
  authors: [{ name: "Mine & Yours Shop" }],
  creator: "Mine & Yours Shop",
  publisher: "J Supreme Tech",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://mineandyoursshop.online"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mineandyoursshop.online",
    siteName: "Mine & Yours Shop",
    title: "Mine & Yours Shop — Premium Curated Store | Jamaica",
    description: "Discover curated collections of premium products — jewelry, home decor, electronics, beauty and more. Fast delivery across Jamaica.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Mine & Yours Shop — Premium Curated Store" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mine & Yours Shop — Premium Curated Store | Jamaica",
    description: "Discover curated collections of premium products. Fast delivery Jamaica.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: { google: "verify-token-add-here" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <CartProvider>
          <CurrencyProvider>
            <Nav />
            <ToastContainer />
            <main style={{ flex: 1 }}>{children}</main>
            <footer style={{ background: "var(--dark)", color: "rgba(255,255,255,0.35)", padding: "56px 24px 36px" }}>
              <div style={{ maxWidth: 1280, margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
                  <div>
                    <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 20, color: "#fff", display: "block", marginBottom: 12 }}>
                      Mine &amp; Yours<span style={{ color: "var(--gold)" }}> Shop</span>
                    </span>
                    <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>Premium curated products, fast delivery across Jamaica and beyond.</p>
                    <a href="tel:+16582182282" style={{ display: "inline-block", marginTop: 16, fontSize: 13, color: "var(--gold)", textDecoration: "none", fontWeight: 600 }}>(658) 218-2282</a>
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontFamily: "var(--font-stamp)", letterSpacing: ".18em", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Shop</p>
                    {([["All Products","/shop"],["New In","/shop?sort=new"],["Cart","/cart"],["Inspire","/inspire"],["Journal","/blog"]] as [string,string][]).map(([l,h]) => (
                      <a key={h} href={h} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{l}</a>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontFamily: "var(--font-stamp)", letterSpacing: ".18em", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Account</p>
                    {([["Create Account","/account/signup"],["Sign In","/account/login"],["My Account","/account"]] as [string,string][]).map(([l,h]) => (
                      <a key={h} href={h} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", marginBottom: 8 }}>{l}</a>
                    ))}
                  </div>
                </div>
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, fontSize: 11 }}>
                  <span>&copy; {new Date().getFullYear()} Mine &amp; Yours Shop. All rights reserved.</span>
                  <a href="https://jsupremetech.online" target="_blank" rel="noopener" style={{ color: "#666", textDecoration: "none" }}>Powered by J Supreme Tech</a>
                </div>
              </div>
            </footer>
          </CurrencyProvider>
        </CartProvider>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Mine & Yours Shop",
          "description": "Premium curated online store with jewelry, home decor, electronics and more.",
          "url": "https://mineandyoursshop.online",
          "potentialAction": { "@type": "SearchAction", "target": "https://mineandyoursshop.online/shop?q={search_term_string}", "query-input": "required name=search_term_string" }
        })}} />
      </body>
    </html>
  )
}
