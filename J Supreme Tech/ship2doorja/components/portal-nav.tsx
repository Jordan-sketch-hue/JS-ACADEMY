"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Package, Bell, Gift, LogOut, Menu, X } from "lucide-react";
import { me } from "@/lib/demo-data";
import { cn } from "@/components/ui";

const links = [
  { href: "/portal", label: "Overview", icon: Home },
  { href: "/portal/shipments", label: "Shipments", icon: Package },
  { href: "/portal/pre-alert", label: "Pre-alert", icon: Bell },
  { href: "/portal/rewards", label: "Rewards", icon: Gift },
];

export function PortalNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initials = me.name.split(" ").map((n) => n[0]).join("");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/portal" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Ship 2 Door JA" width={833} height={729} className="h-9 w-auto" />
          </Link>
          <span className="hidden rounded-full bg-sky/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue sm:inline">
            Customer Portal
          </span>
        </div>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors",
                  active ? "bg-sky/10 text-blue" : "text-slate-500 hover:bg-slate-100 hover:text-navy"
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2.5 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-gradient text-sm font-bold text-white">
              {initials}
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-navy">{me.firstName}</p>
              <p className="text-[11px] text-slate-400">{me.suite}</p>
            </div>
          </div>
          <a
            href="/api/exit"
            className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-400 hover:text-navy md:flex"
            title="Log out"
          >
            <LogOut className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-navy hover:bg-slate-100 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <nav className="space-y-1 border-t border-slate-100 px-4 py-3 md:hidden">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold",
                  active ? "bg-sky/10 text-blue" : "text-navy hover:bg-slate-50"
                )}
              >
                <l.icon className="h-5 w-5" />
                {l.label}
              </Link>
            );
          })}
          <a href="/api/exit" className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-500">
            <LogOut className="h-5 w-5" /> Log out
          </a>
        </nav>
      )}
    </header>
  );
}
