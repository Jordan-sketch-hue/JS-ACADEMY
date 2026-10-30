import type { Metadata } from "next";
import Script from "next/script";
import "../src/app/globals.css";

export const metadata: Metadata = {
  title: { default: "JST Client Templates", template: "%s | JST" },
  description: "Powered by J Supreme Tech",
  metadataBase: new URL("https://jst-client-templates.vercel.app"),
};

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {GA4_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
            <Script id="gtag-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `}</Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
