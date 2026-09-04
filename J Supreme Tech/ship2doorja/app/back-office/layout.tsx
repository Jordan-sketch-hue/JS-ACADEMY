import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin-sidebar";

// Private, cookie-gated area — render per request (never CDN-cached) and
// emit a lambda so middleware-matched routes resolve correctly.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Operations · Back office",
  robots: { index: false, follow: false },
};

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070d18] text-slate-200">
      <AdminSidebar />
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
