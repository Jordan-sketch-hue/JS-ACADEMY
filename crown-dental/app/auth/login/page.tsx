import Link from "next/link";
import * as Icons from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="card bg-white p-8 shadow-card-hover rounded-2xl">
          <h1 className="font-display text-2xl font-semibold text-ink text-center">Welcome back</h1>
          <p className="mt-1 text-sm text-slate text-center">Sign in to your Crown console</p>

          <form className="mt-7 space-y-4" action="/platform">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="dr.chen@crownkingston.com"
                defaultValue="dr.chen@crownkingston.com"
                className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-ink">Password</label>
                <a href="#" className="text-xs text-gold-deep hover:underline">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                defaultValue="demo1234"
                className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10"
              />
            </div>

            {/* MFA hint */}
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5">
              <Icons.ShieldCheck className="h-4 w-4 shrink-0 text-teal" />
              <span className="text-xs text-slate">2-factor authentication is enabled on this account.</span>
            </div>

            <Link
              href="/platform"
              className="gold-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm shadow-gold transition hover:shadow-lg"
            >
              Sign in to console <Icons.ArrowRight className="h-4 w-4" />
            </Link>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-mist">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google Workspace", "Microsoft SSO"].map((p) => (
              <button key={p} className="flex items-center justify-center gap-2 rounded-lg border border-line bg-white py-2.5 text-xs font-medium text-ink hover:bg-surface transition-colors">
                {p === "Google Workspace" ? <Icons.Globe className="h-3.5 w-3.5" /> : <Icons.Building2 className="h-3.5 w-3.5" />}
                {p}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-mist">
          New practice?{" "}
          <Link href="/onboarding" className="font-semibold text-gold-deep hover:underline">Set up Crown →</Link>
        </p>

        <p className="mt-3 text-center text-[10px] text-mist">
          HIPAA · GDPR · SOC 2 certified · 99.98% uptime SLA
        </p>
      </div>
    </main>
  );
}
