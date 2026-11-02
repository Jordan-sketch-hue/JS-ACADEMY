import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PWAInstallBanner from "@/components/PWAInstallBanner";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Agri-H Leads",
  description: "Agriculture & Hardware Procurement CRM",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Agri-H Leads" },
  icons: { apple: "/icon-192.png" },
  openGraph: {
    title: "Agri-H Leads",
    description: "Agriculture & Hardware Procurement CRM",
    siteName: "Agri-H Leads",
    type: "website",
  },
  twitter: {
    title: "Agri-H Leads",
    description: "Agriculture & Hardware Procurement CRM",
  },
};

export const viewport: Viewport = {
  themeColor: "#C9930C",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#0a0a0a] text-white antialiased`}>
        <ThemeProvider>
          <PWAInstallBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
