import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jet", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://communications.jsupremetech.online"),
  title: {
    default: "J Supreme Tech Communications",
    template: "%s | JST Communications",
  },
  description:
    "Intelligence, analysis and field notes on technology, marketing, finance, business and the markets shaping the Caribbean — from the team building inside them.",
  keywords: [
    "JST communications", "technology news Caribbean", "AI business Jamaica",
    "J Supreme Tech", "digital marketing Caribbean", "business intelligence Jamaica",
    "Caribbean tech publication", "In Today's World newsletter JST",
  ],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "J Supreme Tech Communications",
    description: "Intelligence, analysis and field notes on technology, marketing, finance, business and the markets shaping the Caribbean.",
    type: "website",
    url: "https://communications.jsupremetech.online",
    siteName: "JST Communications",
  },
  twitter: {
    card: "summary_large_image",
    title: "J Supreme Tech Communications",
    description: "Intelligence, analysis and field notes on technology, marketing, finance, business and the markets shaping the Caribbean.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body style={{ background: "var(--bg)", color: "var(--ink)" }} className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
