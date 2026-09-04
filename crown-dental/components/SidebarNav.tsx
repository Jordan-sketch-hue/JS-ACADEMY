"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";

const nav = [
  { href: "/platform",                  label: "Dashboard",        icon: "LayoutDashboard" },
  { href: "/platform/ai-agent",         label: "Crown AI",         icon: "Sparkles",       badge: "LIVE" },
  { href: "/platform/patients",         label: "Patients",         icon: "Users" },
  { href: "/platform/schedule",         label: "Schedule",         icon: "CalendarClock" },
  { href: "/platform/clinical",         label: "Clinical",         icon: "Stethoscope" },
  { href: "/platform/labs",             label: "Lab Cases",        icon: "FlaskConical" },
  { href: "/platform/treatment-plans",  label: "Treatment Plans",  icon: "ClipboardCheck" },
  { href: "/platform/communications",   label: "Communications",   icon: "MessageSquare",  badge: "3" },
  { href: "/platform/billing",          label: "Billing",          icon: "CreditCard" },
  { href: "/platform/insurance",        label: "Insurance",        icon: "Shield" },
  { href: "/platform/intake",           label: "Intake",           icon: "ClipboardList" },
  { href: "/platform/forms",            label: "Forms",            icon: "FileText" },
  { href: "/platform/documents",        label: "Documents",        icon: "FolderOpen" },
  { href: "/platform/reviews",          label: "Reviews",          icon: "Star" },
  { href: "/platform/marketing",        label: "Marketing",        icon: "Megaphone" },
  { href: "/platform/inventory",        label: "Inventory",        icon: "Package" },
  { href: "/platform/staff",            label: "Staff",            icon: "BadgeCheck" },
  { href: "/platform/team",             label: "Team",             icon: "Users2" },
  { href: "/platform/huddle",           label: "Huddle",           icon: "Coffee" },
  { href: "/platform/compliance",       label: "Compliance",       icon: "ShieldCheck" },
  { href: "/platform/referrals",        label: "Referrals",        icon: "ArrowRightLeft" },
  { href: "/platform/analytics",        label: "Analytics",        icon: "LineChart" },
  { href: "/platform/pulse",            label: "Revenue Pulse",    icon: "Activity" },
  { href: "/platform/revenue",          label: "Revenue",          icon: "Banknote" },
  { href: "/platform/reports",          label: "Reports",          icon: "BarChart3" },
  { href: "/platform/automation",       label: "Automation",       icon: "Bot",            badge: "LIVE" },
  { href: "/platform/training",          label: "Training",         icon: "GraduationCap" },
  { href: "/platform/integrations",     label: "Integrations",     icon: "Puzzle" },
  { href: "/platform/settings",         label: "Settings",         icon: "Settings2" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-3 space-y-0.5" style={{ overscrollBehavior: "contain" }}>
      {nav.map((n) => {
        const I = (Icons as any)[n.icon] ?? Icons.Circle;
        const isActive = pathname === n.href || (n.href !== "/platform" && pathname.startsWith(n.href));
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
              isActive
                ? "nav-item-active"
                : "text-slate hover:bg-surface hover:text-ink"
            }`}
          >
            <I
              className={`h-4 w-4 shrink-0 transition-colors ${isActive ? "text-gold-deep" : "group-hover:text-gold-deep"}`}
              strokeWidth={1.5}
            />
            <span className="flex-1 truncate">{n.label}</span>
            {n.badge && (
              <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                n.badge === "LIVE" ? "bg-teal/10 text-teal" : "bg-gold/15 text-gold-deep"
              }`}>
                {n.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
