"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Logo } from "@/components/brand/logo";
import { ThemeSwitcher } from "@/components/app/theme-switcher";
import {
  Activity,
  BookOpen,
  Bot,
  Brain,
  Boxes,
  Briefcase,
  CalendarClock,
  CalendarDays,
  CandlestickChart,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Compass,
  CreditCard,
  ExternalLink,
  FileSignature,
  FileText,
  GalleryHorizontalEnd,
  Inbox,
  Layers,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Newspaper,
  Package,
  Palette,
  PanelLeft,
  PiggyBank,
  Globe2,
  Building2,
  Radar,
  Radio,
  ScrollText,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Workflow,
  X,
  Zap,
  LineChart,
  type LucideIcon,
} from "lucide-react";

const linkedBackOffices: { name: string; href: string; initials: string; accent: string }[] = [
  { name: "Solid Trust", href: "https://solidtrustservices.com/admin", initials: "ST", accent: "from-green-600 to-emerald-700" },
  { name: "Ship 2 Door", href: "/go/ship2door", initials: "S2", accent: "from-sky-500 to-blue-700" },
  { name: "AbooTours", href: "https://abootours.com/admin", initials: "AT", accent: "from-amber-400 to-yellow-600" },
  { name: "Language Cradle", href: "https://thelanguagecradle.vercel.app/admin/login", initials: "LC", accent: "from-red-600 via-yellow-500 to-green-600" },
  { name: "BP Courier", href: "https://courier-app-gamma.vercel.app/dispatch", initials: "BP", accent: "from-orange-500 to-red-600" },
  { name: "Solace Auto", href: "https://solaceautoimportsltd.com/backoffice.html", initials: "SA", accent: "from-orange-400 to-amber-500" },
  { name: "Cleanser JA", href: "https://the-cleanser-ja.vercel.app/admin", initials: "CJ", accent: "from-pink-500 to-rose-600" },
];

type NavItem = { href: string; label: string; icon: LucideIcon };

const navSections: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Operate",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/backoffice", label: "Back office", icon: Building2 },
      { href: "/todos", label: "Tasks", icon: ClipboardList },
      { href: "/reports", label: "EOD Reports", icon: ScrollText },
    ],
  },
  {
    heading: "Vision",
    items: [{ href: "/vision", label: "Vision Board", icon: Compass }],
  },
  {
    heading: "Supreme Suite",
    items: [{ href: "/suite", label: "Suite Control", icon: Boxes }],
  },
  {
    heading: "Cyber Defense",
    items: [
      { href: "/cyber", label: "Cyber Command", icon: ShieldCheck },
      { href: "/cyber/fleet", label: "Fleet Security Scan", icon: Radar },
      { href: "/cyber/playbooks", label: "IR Playbooks", icon: ShieldAlert },
      { href: "/cyber/compliance", label: "Compliance & Audit", icon: ClipboardCheck },
    ],
  },
  {
    heading: "Clients & Money",
    items: [
      { href: "/crm", label: "CRM", icon: Users },
      { href: "/meetings", label: "Meetings", icon: CalendarClock },
      { href: "/pipeline-intake", label: "Pipeline intake", icon: Inbox },
      { href: "/invoices", label: "Invoices", icon: FileText },
      { href: "/contracts", label: "Contracts", icon: FileSignature },
      { href: "/earnings", label: "All-time earnings", icon: Wallet },
      { href: "/budget", label: "Budget", icon: PiggyBank },
      { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
      { href: "/projects", label: "Projects", icon: Briefcase },
      { href: "/client-showcase", label: "Client Showcase", icon: GalleryHorizontalEnd },
      { href: "/client-feedback", label: "Client Feedback (Lyra)", icon: MessageSquare },
    ],
  },
  {
    heading: "Sales Department",
    items: [
      { href: "/sales", label: "Sales Dashboard", icon: Send },
      { href: "/sales/prospects", label: "Prospects", icon: Users },
      { href: "/sales/inbox", label: "Inbox", icon: Inbox },
      { href: "/sales/campaigns", label: "Campaigns", icon: Megaphone },
      { href: "/sales/templates", label: "Templates", icon: FileText },
      { href: "/sales/settings", label: "Sales Settings", icon: Settings },
      { href: "/sales/sop", label: "Sales SOP", icon: ClipboardCheck },
    ],
  },
  {
    heading: "Jarvis AI",
    items: [
      { href: "/jarvis", label: "Jarvis Hub", icon: Workflow },
      { href: "/jarvis/angel", label: "Angel — Inbox", icon: MessagesSquare },
      { href: "/jarvis/whatsapp", label: "WhatsApp", icon: MessageCircle },
      // Direct tab links — a server redirect to the same pathname with only a
      // query change gets dropped by the client router (nothing happens).
      { href: "/jarvis?tab=automations", label: "Automations", icon: Zap },
      { href: "/jarvis?tab=ai-workflows", label: "AI Workflows", icon: Sparkles },
      { href: "/think", label: "Think Bot", icon: Brain },
    ],
  },
  {
    heading: "Build & Sites",
    items: [
      { href: "/site-kit", label: "Site kit", icon: Package },
      { href: "/sites", label: "Vercel sites", icon: Globe2 },
      { href: "/web-toolset", label: "Web Toolset", icon: Layers },
      { href: "/sops", label: "SOPs", icon: ClipboardCheck },
    ],
  },
  {
    heading: "Growth & Ops",
    items: [
      { href: "/daily-brief", label: "Daily Brief", icon: Newspaper },
      { href: "/wire", label: "The Wire", icon: Radio },
      { href: "/studio", label: "Creative Studio", icon: Palette },
      { href: "/marketing", label: "Marketing", icon: Megaphone },
      { href: "/analytics", label: "Site Analytics", icon: Activity },
      { href: "/social", label: "Social Stats", icon: LineChart },
      { href: "/scripts", label: "Scripts", icon: MessagesSquare },
      { href: "/market-pricing", label: "Market Pricing", icon: Target },
      { href: "/assets", label: "Assets", icon: Activity },
    ],
  },
  {
    heading: "Markets",
    items: [
      { href: "/trading", label: "Trading", icon: TrendingUp },
      { href: "/trading/deriv", label: "Deriv TradeDesk", icon: Bot },
      { href: "/calendar", label: "Economic Calendar", icon: CalendarDays },
      { href: "/mt5-markups", label: "MT5 Markups", icon: CandlestickChart },
    ],
  },
  {
    heading: "System",
    items: [
      { href: "/need-to-know", label: "Need to know", icon: BookOpen },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const setCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const mobileOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileOpen = useUiStore((s) => s.setMobileNavOpen);

  // Longest-match-wins active route: a parent (e.g. /cyber) must NOT stay lit
  // while you're on a child (/cyber/fleet). We pick the single most-specific
  // path-only href that prefixes the current pathname. Query links (/jarvis?tab=)
  // are skipped here and handled by exact match below.
  const activeHref = (() => {
    let best = "";
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.href.includes("?")) continue;
        const matches =
          pathname === item.href || pathname.startsWith(item.href + "/");
        if (matches && item.href.length > best.length) best = item.href;
      }
    }
    return best;
  })();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname, setMobileOpen]);

  // Mobile drawer always shows labels; desktop honors the collapse toggle.
  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-50 flex h-svh flex-col border-r border-border/60 bg-card/95 backdrop-blur-xl transition-transform duration-300 ease-out",
          "w-[264px] lg:static lg:z-20 lg:translate-x-0 lg:bg-card/40 lg:transition-[width]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-[72px]" : "lg:w-[244px]",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border/60 px-3">
          <Link
            href="/dashboard"
            className={cn(
              "flex min-w-0 items-center gap-2",
              showLabels ? "flex-1" : "justify-center",
            )}
          >
            <Logo className="h-8 w-8 shrink-0 text-primary" />
            {showLabels && (
              <span className="min-w-0 leading-tight">
                <span className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  J Supreme
                </span>
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-sm font-semibold text-transparent">
                  Conglomerate
                </span>
              </span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden shrink-0 lg:flex"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-2 py-3">
          <nav className="flex flex-col gap-1">
            {!showLabels ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => useUiStore.getState().toggleAiPanel()}
                    className="flex w-full items-center justify-center rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                  >
                    <Bot className="h-4 w-4 shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">Jarvis AI (⌘⇧A or Ctrl+Shift+A)</TooltipContent>
              </Tooltip>
            ) : (
              <button
                type="button"
                onClick={() => useUiStore.getState().toggleAiPanel()}
                className="mb-1 flex w-full items-center gap-3 rounded-lg border border-accent/20 bg-accent/[0.06] px-2.5 py-2 text-sm text-accent transition-colors hover:bg-accent/10"
              >
                <Bot className="h-4 w-4 shrink-0" />
                <span>Jarvis AI</span>
              </button>
            )}

            {navSections.map((section) => (
              <div key={section.heading} className="mt-2 first:mt-0">
                {showLabels ? (
                  <p className="px-2.5 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                    {section.heading}
                  </p>
                ) : (
                  <div className="mx-2 my-2 border-t border-border/50" aria-hidden />
                )}
                {section.items.map((item) => {
                  // Query tab links (/jarvis?tab=…) keep their prior behavior
                  // (matched on click via the page, not the sidebar) to stay
                  // SSR-safe; path links use longest-match-wins.
                  const active = item.href.includes("?")
                    ? pathname === item.href
                    : item.href === activeHref;
                  const content = (
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        active
                          ? "bg-gradient-to-r from-primary/25 via-primary/10 to-transparent font-medium text-primary ring-1 ring-inset ring-primary/25"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                        !showLabels && "justify-center",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {showLabels && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                  if (!showLabels) {
                    return (
                      <Tooltip key={item.href} delayDuration={0}>
                        <TooltipTrigger asChild>{content}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    );
                  }
                  return <div key={item.href}>{content}</div>;
                })}
              </div>
            ))}

            <div className="mt-4 border-t border-border/60 pt-3">
              {showLabels && (
                <p className="px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
                  Back Office · Sites
                </p>
              )}
              {linkedBackOffices.map((site) => {
                const link = (
                  <a
                    href={site.href}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors",
                      "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                      !showLabels && "justify-center",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br text-[9px] font-black text-white shadow-sm",
                        site.accent,
                      )}
                    >
                      {site.initials}
                    </span>
                    {showLabels && (
                      <>
                        <span className="flex-1 truncate">{site.name}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-40 group-hover:opacity-100" />
                      </>
                    )}
                  </a>
                );
                if (!showLabels) {
                  return (
                    <Tooltip key={site.href} delayDuration={0}>
                      <TooltipTrigger asChild>{link}</TooltipTrigger>
                      <TooltipContent side="right">
                        {site.name} <span className="opacity-60">↗</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                return <div key={site.href}>{link}</div>;
              })}
            </div>
          </nav>
        </ScrollArea>
        <div className="space-y-2 border-t border-border/60 p-2">
          {showLabels && (
            <div className="flex items-center justify-between gap-2 px-1 lg:hidden">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/60">
                Theme
              </span>
              <ThemeSwitcher />
            </div>
          )}
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", !showLabels && "justify-center px-0")}
            onClick={() => useUiStore.getState().toggleCommand()}
          >
            <PanelLeft className="h-4 w-4" />
            {showLabels && <span className="text-xs text-muted-foreground">⌘K Search</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
