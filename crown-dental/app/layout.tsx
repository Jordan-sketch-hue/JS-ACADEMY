import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Crown — Intelligent Dental Practice Cloud",
  description:
    "The operating system for modern dental care. AI scheduling, clinical charting, revenue automation, and patient experience — local practices to global DSO networks.",
  openGraph: {
    title: "Crown — Intelligent Dental Practice Cloud",
    description: "AI scheduling, clinical charting, revenue automation — one platform for every dental practice.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <style>{`
          @view-transition { navigation: auto; }
          ::view-transition-old(root) {
            animation: 220ms cubic-bezier(0.4, 0, 1, 1) both fade-out-up;
          }
          ::view-transition-new(root) {
            animation: 280ms cubic-bezier(0, 0, 0.2, 1) 80ms both fade-in-up;
          }
          @keyframes fade-out-up {
            to { opacity: 0; transform: translateY(-8px); }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(12px); }
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
