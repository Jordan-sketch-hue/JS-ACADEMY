import type { Metadata, Viewport } from "next";
import { Great_Vibes, Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import PwaInstall from "@/components/pwa-install";
import PwaUpdate from "@/components/pwa-update";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const jarvis = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-jarvis",
  display: "swap",
});

// Script face for typed e-signatures (contracts + public signing page).
const signature = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jsupremeconglomerate.online"),
  title: "J Supreme Conglomerate",
  description:
    "J Supreme Conglomerate — command center for CRM, delivery, trading, marketing, and AI workflows.",
  applicationName: "J Supreme",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "J Supreme",
  },
  openGraph: {
    title: "J Supreme Conglomerate — Operator OS",
    description:
      "CRM, delivery, trading, marketing, and AI workflows — one command center.",
    url: "https://jsupremeconglomerate.online",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "J Supreme Conglomerate — Operator OS" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "J Supreme Conglomerate — Operator OS",
    description:
      "CRM, delivery, trading, marketing, and AI workflows — one command center.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E0F12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mono.variable} ${jarvis.variable} ${signature.variable} min-h-svh font-sans antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('jsc-theme');if(t!=='light'&&t!=='dark'&&t!=='color')t='light';var e=document.documentElement;e.setAttribute('data-theme',t);e.classList.toggle('dark',t!=='light');}catch(e){}})();`,
          }}
        />
        <Providers>{children}</Providers>
        <PwaInstall />
        <PwaUpdate />
        <Analytics />
      </body>
    </html>
  );
}
