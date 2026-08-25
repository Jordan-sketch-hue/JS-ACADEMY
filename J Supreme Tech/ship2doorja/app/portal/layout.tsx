import type { Metadata } from "next";
import { PortalNav } from "@/components/portal-nav";

// Private, cookie-gated area — render per request (never CDN-cached) and
// emit a lambda so middleware-matched routes resolve correctly.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Customer Portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <PortalNav />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</div>
      <p className="pb-10 text-center text-xs text-slate-400">
        Ship 2 Door JA · Customer Portal · demo preview
      </p>
    </div>
  );
}
