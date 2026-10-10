import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch · J Supreme releases",
  description:
    "Promotional assets and install links for our latest web app releases — BP Couriers, AbooTours, Solace Auto Imports, and the J Supreme Conglomerate OS.",
  robots: { index: true, follow: true },
};

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#050505] text-white antialiased">{children}</div>;
}
