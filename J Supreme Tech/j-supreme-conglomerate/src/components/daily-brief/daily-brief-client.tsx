"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  Globe2,
  Lightbulb,
  Mail,
  Newspaper,
  RefreshCcw,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── System checks ──────────────────────────────────────────────────────────
const SYSTEM_CHECKS = [
  {
    id: "vercel",
    label: "Vercel deployments",
    detail: "No red builds or 500s",
    href: "https://vercel.com/dashboard",
    icon: Globe2,
    priority: "high",
  },
  {
    id: "pipeline",
    label: "Pipeline intake",
    detail: "New submissions to review",
    href: "/pipeline-intake",
    icon: Target,
    priority: "high",
  },
  {
    id: "crm",
    label: "CRM follow-ups",
    detail: "Overdue or due today",
    href: "/crm",
    icon: Users,
    priority: "high",
  },
  {
    id: "invoices",
    label: "Outstanding invoices",
    detail: "Any overdue payments",
    href: "/invoices",
    icon: TrendingUp,
    priority: "medium",
  },
  {
    id: "supabase",
    label: "Supabase health",
    detail: "Rate limits or error spikes",
    href: "https://supabase.com/dashboard",
    icon: Activity,
    priority: "medium",
  },
  {
    id: "todos",
    label: "Open tasks",
    detail: "Anything blocking a project",
    href: "/todos",
    icon: CheckCircle2,
    priority: "medium",
  },
  {
    id: "eas",
    label: "EAS mobile builds",
    detail: "Any failed iOS/Android builds",
    href: "https://expo.dev",
    icon: Smartphone,
    priority: "low",
  },
  {
    id: "earnings",
    label: "Earnings snapshot",
    detail: "Review revenue vs target",
    href: "/earnings",
    icon: TrendingUp,
    priority: "low",
  },
];

const GOTCHAS = [
  "Never run `vercel env pull` — creates .env.production.local with EMPTY Sensitive values that shadow .env.local and break auth.",
  "PWA auto-popup must never be re-added to any project (removed fleet-wide 2026-06-10).",
  "Always use real logo files (logo.jpg / logo.png) — never the bundled SVG approximations.",
  "PS 5.1: use `cmd /c echo VALUE` for vercel env add — never Write-Output (adds BOM).",
  "forgeworks-jamaica and the-mover-guy have auto-restore processes — use fresh paths or new files.",
  "Rotate ALL operator credential stores together (Supabase/Payload/Clerk/file) or they desync.",
];

const DAILY_READS = [
  { label: "Awwwards SOTD", desc: "Today's best UI design", url: "https://www.awwwards.com/", cat: "Design" },
  { label: "Dribbble trending UI", desc: "Component + layout inspiration", url: "https://dribbble.com/shots/popular/ui-ux", cat: "Design" },
  { label: "Mobbin new screens", desc: "Latest iOS app screens", url: "https://mobbin.com/screens?platform=ios&sort=new", cat: "Design" },
  { label: "Next.js blog", desc: "Releases and upgrade notices", url: "https://nextjs.org/blog", cat: "Dev" },
  { label: "web.dev blog", desc: "Chrome team performance updates", url: "https://web.dev/blog/", cat: "Dev" },
  { label: "IG Algorithm guide", desc: "Social media best practices", url: "https://later.com/blog/how-instagram-algorithm-works/", cat: "Marketing" },
  { label: "Smashing Magazine", desc: "Frontend and UX deep-dives", url: "https://www.smashingmagazine.com/", cat: "Dev" },
  { label: "CSS-Tricks", desc: "CSS techniques and demos", url: "https://css-tricks.com/", cat: "Dev" },
];

const CAT_COLOR: Record<string, string> = {
  Design: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  Dev: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  Marketing: "bg-amber-500/15 text-amber-400 border-amber-500/25",
};

// ── Component ──────────────────────────────────────────────────────────────
export function DailyBriefClient() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const sendNewsletter = async () => {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch("/api/newsletter/daily", { method: "POST" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({})) as { error?: string };
        setSendError(j.error ?? "Send failed");
      } else {
        setSent(true);
        setTimeout(() => setSent(false), 4000);
      }
    } catch {
      setSendError("Network error");
    } finally {
      setSending(false);
    }
  };

  const completedCount = checked.size;
  const totalChecks = SYSTEM_CHECKS.length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header + send */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">Live</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{totalChecks} checks done today
          </p>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted/40">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${(completedCount / totalChecks) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Button
            variant={sent ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={sendNewsletter}
            disabled={sending || sent}
          >
            {sent ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : sending ? (
              <RefreshCcw className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
            {sent ? "Brief sent to email" : sending ? "Sending…" : "Send brief to email"}
          </Button>
          {sendError && (
            <p className="text-xs text-red-400">{sendError}</p>
          )}
          <p className="text-[11px] text-muted-foreground">
            Sends to jordanmorrisr@gmail.com via Resend
          </p>
        </div>
      </div>

      {/* System checks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            System checks
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {SYSTEM_CHECKS.map((c) => {
            const isDone = checked.has(c.id);
            const priorityColor =
              c.priority === "high"
                ? "border-red-500/20"
                : c.priority === "medium"
                ? "border-amber-500/15"
                : "border-border/40";
            return (
              <div
                key={c.id}
                className={cn(
                  "flex items-start gap-2.5 rounded-lg border p-2.5 transition-all",
                  priorityColor,
                  isDone && "opacity-50",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(c.id)}
                  className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-sm font-medium">{c.label}</p>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                      className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Standing gotchas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Standing gotchas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {GOTCHAS.map((g, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2"
              >
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                <p className="text-xs text-amber-300 leading-relaxed">{g}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick nav */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              Quick navigation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: "Dashboard", href: "/dashboard", desc: "Revenue, tasks, ecosystem snapshot" },
              { label: "CRM", href: "/crm", desc: "Client pipeline and follow-ups" },
              { label: "Invoices", href: "/invoices", desc: "Billing and payments" },
              { label: "Pipeline intake", href: "/pipeline-intake", desc: "New client submissions" },
              { label: "SOPs", href: "/sops", desc: "Step-by-step procedures" },
              { label: "Web Toolset", href: "/web-toolset", desc: "Design reference and integration map" },
              { label: "Marketing", href: "/marketing", desc: "Active campaigns" },
              { label: "Vercel sites", href: "/sites", desc: "All live deployments" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors hover:bg-muted/30"
              >
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-60" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Daily reads */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Newspaper className="h-4 w-4 text-primary" />
            Daily reads
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {DAILY_READS.map((r) => (
            <a
              key={r.label}
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start justify-between gap-2 rounded-lg border border-border/50 px-3 py-2.5 text-sm transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
            >
              <div>
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {r.label}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
                <span
                  className={cn(
                    "mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium",
                    CAT_COLOR[r.cat],
                  )}
                >
                  {r.cat}
                </span>
              </div>
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-30 group-hover:opacity-80 transition-opacity" />
            </a>
          ))}
        </CardContent>
      </Card>

      {/* Newsletter schedule note */}
      <Card className="border-primary/20 bg-primary/[0.04]">
        <CardContent className="flex items-start gap-3 p-4">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Auto-delivery schedule</p>
            <p className="text-xs text-muted-foreground">
              This brief is sent automatically every morning at 7:00 AM Jamaica time (UTC-5) via Vercel Cron → Resend.
              Use the button above to trigger a manual send anytime.
            </p>
            <p className="text-[11px] text-muted-foreground/60">
              Cron: <code className="font-mono">0 12 * * *</code> UTC (= 7 AM Jamaica / EST)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
