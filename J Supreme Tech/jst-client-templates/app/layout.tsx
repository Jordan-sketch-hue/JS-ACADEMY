import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JST Client Templates",
  description: "J Supreme Tech client template system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
