"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Package, Users, Bell, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/components/ui";

const links = [
  { href: "/back-office", label: "Dashboard", icon: LayoutDashboard },
  { href: "/back-office/shipments", label: "Shipments", icon: Package },
  { href: "/back-office/customers", label: "Customers", icon: Users },
  { href: "/back-office/pre-alerts", label: "Pre-alerts", icon: Bell },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-sky/15 text-sky-light ring-1 ring-sky/30"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            )}
          >
            <l.icon className="h-5 w-5" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <Image src="/logo-white.png" alt="Ship 2 Door JA" width={833} height={729} className="h-8 w-auto" />
      <div className="leading-tight">
        <p className="text-sm font-extrabold text-white">Ship 2 Door</p>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-light">Operations</p>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col justify-between border-r border-white/10 bg-[#0a1322] px-4 py-6 lg:flex">
        <div>
          <Brand />
          <div className="mt-8">
            <p className="px-3.5 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Menu</p>
            <NavLinks />
          </div>
        </div>
        <a href="/api/exit" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
          <LogOut className="h-5 w-5" /> Sign out
        </a>
      </aside>

      {/* mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#0a1322] px-4 py-3 lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-[#0a1322] px-4 py-6">
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white hover:bg-white/10" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
            <a href="/api/exit" className="mt-6 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-white">
              <LogOut className="h-5 w-5" /> Sign out
            </a>
          </div>
        </div>
      )}
    </>
  );
}
