"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { Logo } from "@/components/Logo";
import { SidebarNav } from "@/components/SidebarNav";
import { PageGuide, HelpTrigger, useGuideControl } from "@/components/PageGuide";
import { clinics, aiActions, patients } from "@/lib/data";

// ── live date ──────────────────────────────────────────
function useLiveDate() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "short", month: "short", day: "numeric", year: "numeric",
      });
    setLabel(fmt());
    const id = setInterval(() => setLabel(fmt()), 60_000);
    return () => clearInterval(id);
  }, []);
  return label;
}

// ── ⌘K global search ──────────────────────────────────
const ALL_ROUTES = [
  { label: "Dashboard",      href: "/platform" },
  { label: "Crown AI",       href: "/platform/ai-agent" },
  { label: "Patients",       href: "/platform/patients" },
  { label: "Schedule",       href: "/platform/schedule" },
  { label: "Clinical",       href: "/platform/clinical" },
  { label: "Lab Cases",      href: "/platform/labs" },
  { label: "Treatment Plans",href: "/platform/treatment-plans" },
  { label: "Communications", href: "/platform/communications" },
  { label: "Billing",        href: "/platform/billing" },
  { label: "Insurance",      href: "/platform/insurance" },
  { label: "Intake",         href: "/platform/intake" },
  { label: "Forms",          href: "/platform/forms" },
  { label: "Documents",      href: "/platform/documents" },
  { label: "Reviews",        href: "/platform/reviews" },
  { label: "Marketing",      href: "/platform/marketing" },
  { label: "Inventory",      href: "/platform/inventory" },
  { label: "Staff",          href: "/platform/staff" },
  { label: "Team",           href: "/platform/team" },
  { label: "Huddle",         href: "/platform/huddle" },
  { label: "Compliance",     href: "/platform/compliance" },
  { label: "Referrals",      href: "/platform/referrals" },
  { label: "Analytics",      href: "/platform/analytics" },
  { label: "Revenue Pulse",  href: "/platform/pulse" },
  { label: "Revenue",        href: "/platform/revenue" },
  { label: "Reports",        href: "/platform/reports" },
  { label: "Automation",     href: "/platform/automation" },
  { label: "Training",       href: "/platform/training" },
  { label: "Integrations",   href: "/platform/integrations" },
  { label: "Settings",       href: "/platform/settings" },
];

function SearchModal({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const lower = q.toLowerCase().trim();
  const patientResults = lower
    ? patients.filter(p => p.name.toLowerCase().includes(lower)).slice(0, 4)
    : [];
  const routeResults = lower
    ? ALL_ROUTES.filter(r => r.label.toLowerCase().includes(lower)).slice(0, 6)
    : ALL_ROUTES.slice(0, 8);

  function go(href: string) {
    router.push(href);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-ink/40 backdrop-blur-sm p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-line overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Icons.Search className="h-4 w-4 text-mist shrink-0" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, modules…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-mist outline-none"
          />
          <kbd className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-mist font-mono border border-line">Esc</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-line">
          {patientResults.length > 0 && (
            <div className="py-1.5">
              <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-mist">Patients</p>
              {patientResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => go(`/platform/patients/${p.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface transition-colors"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold text-[10px] font-bold text-white">
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                    <p className="text-xs text-mist">{p.plan} · {p.tags.join(", ")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="py-1.5">
            <p className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-mist">
              {lower ? "Modules" : "Jump to"}
            </p>
            {routeResults.map(r => (
              <button
                key={r.href}
                onClick={() => go(r.href)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface transition-colors"
              >
                <Icons.ArrowRight className="h-3.5 w-3.5 text-mist shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-ink">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Notification panel ─────────────────────────────────
function NotificationPanel({ onClose }: { onClose: () => void }) {
  const items = [
    { icon: "Bot",            color: "text-teal",      label: "AI agent filled a cancellation slot automatically",          time: "Just now" },
    { icon: "MessageSquare",  color: "text-gold-deep", label: "Unread messages from patients",                              time: "—"       },
    { icon: "ClipboardList",  color: "text-gold-deep", label: "Intake forms awaiting signature — check today's schedule",  time: "—"       },
    { icon: "Shield",         color: "text-gold-deep", label: "Insurance eligibility verification required",                time: "—"       },
    { icon: "ShieldCheck",    color: "text-slate",     label: "Staff certifications — review expiry dates",                 time: "—"       },
  ];
  return (
    <div
      className="fixed inset-0 z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute right-4 top-14 w-80 rounded-2xl bg-white shadow-2xl border border-line overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="text-sm font-semibold text-ink">Notifications</span>
          <button onClick={onClose} className="text-mist hover:text-ink transition-colors">
            <Icons.X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="divide-y divide-line">
          {items.map((item, i) => {
            const I = (Icons as any)[item.icon] ?? Icons.Circle;
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-surface transition-colors cursor-pointer">
                <I className={`h-4 w-4 shrink-0 mt-0.5 ${item.color}`} strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink leading-relaxed">{item.label}</p>
                  <p className="text-[10px] text-mist mt-0.5">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-line px-4 py-2.5">
          <button onClick={onClose} className="text-xs text-gold-deep hover:underline">Mark all read</button>
        </div>
      </div>
    </div>
  );
}

// ── Clinic switcher ────────────────────────────────────
function ClinicSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(clinics[0] ?? null);

  function pick(c: (typeof clinics)[0]) {
    setActive(c);
    setOpen(false);
  }

  return (
    <div className="relative px-3 pt-4">
      <button
        onClick={() => clinics.length > 0 && setOpen(o => !o)}
        className="flex w-full items-center justify-between rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm hover:border-gold/50 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex items-center gap-2.5">
          <span className="pulse-ring h-2 w-2 rounded-full bg-teal" />
          <span className="font-medium text-ink truncate">{active?.name ?? "Your Practice"}</span>
        </div>
        {clinics.length > 1 && <Icons.ChevronsUpDown className="h-3.5 w-3.5 text-mist shrink-0" />}
      </button>
      {open && clinics.length > 0 && (
        <div className="absolute left-3 right-3 top-full mt-1 z-40 rounded-xl border border-line bg-white shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          {clinics.map(c => (
            <button
              key={c.id}
              onClick={() => pick(c)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-surface ${c.id === active?.id ? "text-gold-deep font-semibold" : "text-ink"}`}
              role="option"
              aria-selected={c.id === active?.id}
            >
              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.id === active?.id ? "bg-teal" : "bg-line"}`} />
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-[10px] text-mist">{c.region}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shell ──────────────────────────────────────────────
export function PlatformShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dateLabel = useLiveDate();
  const pathname = usePathname();
  const { guide, open: guideOpen, openGuide, closeGuide } = useGuideControl();

  // ⌘K global shortcut
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // section label for breadcrumb
  const routeLabel = ALL_ROUTES.find(r => r.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="flex h-screen overflow-hidden bg-surface text-ink">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 shrink-0 flex-col border-r border-line bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo row */}
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Logo />
          <button
            className="rounded-lg p-1 text-slate hover:text-ink transition-colors lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <Icons.X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Clinic switcher */}
        <ClinicSwitcher />

        {/* Nav */}
        <SidebarNav />

        {/* AI Status chip */}
        <div className="border-t border-line p-3">
          <div className="ai-thinking relative flex items-center gap-2.5 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/8 to-gold/4 px-3 py-2.5">
            <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="absolute h-3 w-3 rounded-full bg-teal/30 animate-ping" />
              <span className="h-2 w-2 rounded-full bg-teal" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gold-deep">AI Agent active</p>
              <p className="truncate text-[10px] text-slate">
                Monitoring 8 chairs · {aiActions.length} actions taken
              </p>
            </div>
            <Icons.Sparkles className="h-3.5 w-3.5 shrink-0 text-gold/60" strokeWidth={1.5} />
          </div>
        </div>

        {/* User */}
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-surface transition-colors cursor-pointer">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-deep to-gold text-xs font-bold text-white shadow-gold">
              <Icons.User className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink">Practice Owner</p>
              <p className="truncate text-[10px] text-slate">Administrator</p>
            </div>
            <Icons.ChevronRight className="h-3 w-3 shrink-0 text-mist" strokeWidth={1.5} />
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-4 lg:px-6">
          <div className="flex items-center gap-2">
            {/* Hamburger — mobile only */}
            <button
              className="mr-1 rounded-lg border border-line bg-white p-2 text-slate hover:text-ink hover:border-gold/40 transition-all lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Icons.Menu className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <div className="flex items-center gap-2 text-sm text-mist">
              <span className="font-medium text-ink">{routeLabel}</span>
              {dateLabel && (
                <>
                  <Icons.ChevronRight className="h-3.5 w-3.5 hidden sm:block" />
                  <span className="hidden sm:block">{dateLabel}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* ⌘K Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="search-bar hidden sm:flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-slate hover:border-gold/40 transition-colors cursor-pointer"
              aria-label="Search patients and modules (⌘K)"
            >
              <Icons.Search className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden md:block">Search patients, modules…</span>
              <kbd className="hidden md:block ml-2 rounded bg-line px-1.5 py-0.5 text-[10px] text-mist font-mono">⌘K</kbd>
            </button>

            {/* ? Help */}
            {guide && <HelpTrigger onOpen={openGuide} />}

            {/* Notification bell */}
            <button
              onClick={() => setNotifOpen(o => !o)}
              className="relative rounded-lg border border-line bg-white p-2 text-slate hover:text-ink hover:border-gold/40 hover:shadow-card transition-all"
              aria-label="Notifications"
            >
              <Icons.Bell className="h-4 w-4" strokeWidth={1.5} />
              {!notifOpen && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-teal pulse-dot" />}
            </button>

            {/* Homepage link */}
            <Link
              href="/"
              className="rounded-lg border border-line bg-white p-2 text-slate hover:text-ink hover:border-gold/40 transition-all"
              aria-label="Back to homepage"
            >
              <Icons.ExternalLink className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-surface">{children}</main>
      </div>

      {/* Overlays */}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      {notifOpen  && <NotificationPanel onClose={() => setNotifOpen(false)} />}
      {guide && <PageGuide guide={guide} open={guideOpen} onClose={closeGuide} />}
    </div>
  );
}
