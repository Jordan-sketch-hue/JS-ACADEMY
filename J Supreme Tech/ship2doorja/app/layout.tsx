import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Shop the U.S., delivered to your door in Jamaica`,
    template: `%s · ${site.name}`,
  },
  description:
    "Get a free U.S. shipping address, shop any American store, and we forward it to your door in Jamaica. Customs handled, tracked door-to-door. Economical · Reliable · Accountable.",
  keywords: [
    "Ship 2 Door JA",
    "package forwarding Jamaica",
    "US to Jamaica shipping",
    "free US address Jamaica",
    "freight forwarding Jamaica",
    "Jamaica online shopping",
  ],
  openGraph: {
    type: "website",
    locale: "en_JM",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — USA → Jamaica, straight to your door`,
    description:
      "Free U.S. address. Shop any American store. We forward it to your door in Jamaica — customs handled, tracked door-to-door.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}`,
    description:
      "Shop the U.S., delivered to your door in Jamaica. Free U.S. address — pay only when you ship.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c2750",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
