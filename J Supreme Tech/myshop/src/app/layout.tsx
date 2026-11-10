import type { Metadata } from "next"
import "./globals.css"
import { CartProvider } from "@/context/CartContext"
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
  metadataBase: new URL("https://myshop-three-tau.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://myshop-three-tau.vercel.app",
    siteName: "Mine & Yours Shop",
    title: "Mine & Yours Shop — Premium Curated Store | Jamaica",
    description: "Discover curated collections of premium products — jewelry, home decor, electronics, beauty and more. Fast delivery across Jamaica.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "MyShop — Premium Curated Store" }],
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
          <Nav />
          <ToastContainer />
          <main style={{ flex: 1 }}>{children}</main>
          <footer style={{ background: "var(--dark)", color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "32px 24px", fontSize: 12, letterSpacing: "0.08em" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 900, fontSize: 16, color: "#fff" }}>MY<span style={{ color: "var(--gold)" }}>SHOP</span></span>
              <span>&copy; {new Date().getFullYear()} Mine & Yours Shop</span>
              <div style={{ display: "flex", gap: 24 }}>
                <a href="/shop" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Shop</a>
                <a href="/cart" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Cart</a>
              </div>
            </div>
          </footer>
        </CartProvider>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "MyShop",
          "description": "Premium curated online store with jewelry, home decor, electronics and more.",
          "url": "https://myshop-three-tau.vercel.app",
          "potentialAction": { "@type": "SearchAction", "target": "https://myshop-three-tau.vercel.app/shop?q={search_term_string}", "query-input": "required name=search_term_string" }
        })}} />
      </body>
    </html>
  )
}



