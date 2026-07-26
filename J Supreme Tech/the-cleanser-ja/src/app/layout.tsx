import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thecleanserja.com"),
  title: {
    default: "The Cleanser JA by Nicole | Herbal Wellness Store",
    template: "%s | The Cleanser JA by Nicole",
  },
  description:
    "Premium herbal cleanse, natural remedies, and wellness rituals by Nicole. Shop worldwide with WhatsApp consultations and payment-ready checkout.",
  keywords: [
    "The Cleanser JA",
    "Nicole Thompson",
    "herbal remedies",
    "natural cleanse",
    "wellness drinks",
    "Jamaica",
    "online store",
  ],
  openGraph: {
    title: "The Cleanser JA by Nicole",
    description:
      "Premium herbal cleanse, natural remedies, and wellness rituals shipped worldwide.",
    url: "https://thecleanserja.com",
    siteName: "The Cleanser JA by Nicole",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1024, height: 1024, alt: "The Cleanser JA by Nicole" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Cleanser JA by Nicole",
    description:
      "Premium herbal cleanse, natural remedies, and wellness rituals shipped worldwide.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ec2a8a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sora.variable}>
      <body>
        {children}
        {/* PWA install/update prompts removed — no app available */}
        <Analytics />
      </body>
    </html>
  );
}
