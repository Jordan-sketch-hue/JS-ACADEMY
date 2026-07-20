import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: { default: "WIAG — Wine In A Glass | Big Island Traders Jamaica", template: "%s | Big Island Traders" },
  description: "WIAG — 187ml premium Australian RTD wine sealed in a real stemless glass. Corporate gifting, events, and retail in Jamaica. Order online or WhatsApp us.",
  keywords: ["WIAG", "wine in a glass", "Jamaica corporate gifts", "RTD wine Jamaica", "Australian wine Jamaica", "corporate gifting Kingston", "event wine Jamaica", "Big Island Traders"],
  openGraph: {
    title: "WIAG — Wine In A Glass | Big Island Traders Jamaica",
    description: "Premium Australian RTD wine sealed in a real glass. Corporate gifting and events across Jamaica.",
    url: "https://big-island-traders.vercel.app",
    siteName: "Big Island Traders",
    locale: "en_JM",
    type: "website",
    images: [{ url: "https://big-island-traders.vercel.app/og-image.jpg", width: 1200, height: 630, alt: "Big Island Traders — WIAG Wine In A Glass" }],
  },
  twitter: { card: "summary_large_image", title: "WIAG — Wine In A Glass Jamaica", description: "187ml premium Australian RTD wine. Corporate gifting & events. Order now." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          {children}
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
