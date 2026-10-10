"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Inbox,
  Mail,
  Play,
  Send,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { REGION_LABEL, type Region } from "@/lib/sales/types";
import { runSalesEngineNowAction } from "@/app/(app)/sales/actions";
import type { SalesDashboard as Dash } from "@/lib/sales/stats";

const REGION_FLAG: Record<Region, string> = {
  local: "🇯🇲",
  caribbean: "🌴",
  europe: "🇪🇺",
  americas: "🇺🇸",
};

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Mail;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>}
    </Card>
  );
}

export function SalesDashboard({
  data,
  fromEmail,
  dailyTarget,
}: {
  data: Dash;
  fromEmail: string;
  dailyTarget: number;
}) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const openRate =
    data.sentTotal > 0 ? Math.round((data.opened / data.sentTotal) * 100) : 0;
  const replyRate =
    data.sentTotal > 0 ? Math.round((data.replies / data.sentTotal) * 100) : 0;

  function runNow() {
    setMsg(null);
    start(async () => {
      const r = await runSalesEngineNowAction();
      if (r.ok) {
        const x = r.result;
        setMsg(
          `Tick complete · status: ${x.status} · sourced ${x.sourced} · sent ${x.sent} · failed ${x.failed}${
            x.notes.length ? " · " + x.notes[0] : ""
          }`,
        );
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <TrendingUp className="h-6 w-6" /> Sales Department
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Automated cold outreach to {data.byRegion.length} regions ·{" "}
            <span className="font-mono">{fromEmail}</span>
          </p>
        </div>
        <Button onClick={runNow} disabled={pending}>
          <Play className="mr-1.5 h-4 w-4" />
          {pending ? "Running…" : "Run engine now"}
        </Button>
      </div>

      {msg && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">{msg}</div>
      )}

      {/* Configuration / compliance status banners */}
      <div className="space-y-2">
        {!data.sendingConfigured && (
          <Banner
            tone="warn"
            text="Sending domain not verified yet. The engine is collecting prospects now; emails start automatically once go.jsupremetech.online is verified in Resend and RESEND_API_KEY + SALES_OUTREACH_FROM are set."
          />
        )}
        {!data.hunterConfigured && (
          <Banner
            tone="warn"
            text="HUNTER_API_KEY not set — automatic lead sourcing is paused. Add it in Vercel env, or import prospects under Prospects → Add."
          />
        )}
        {data.sendingConfigured && data.hunterConfigured && data.sendingEnabled && (
          <Banner tone="ok" text="Live: sourcing + sending are active and compliant." />
        )}
        {!data.sendingEnabled && (
          <Banner tone="warn" text="Sending is turned OFF in Settings (master switch)." />
        )}
        {data.warmupActive && (
          <Banner
            tone="info"
            text={`Warm-up active — today's ceiling is ${data.ceiling}/day (ramping to your ${dailyTarget}/day target to protect deliverability).`}
          />
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi
          icon={Send}
          label="Sent today"
          value={`${data.sentToday} / ${data.ceiling}`}
          sub={`Target ${dailyTarget}/day`}
        />
        <Kpi icon={Mail} label="Sent all-time" value={data.sentTotal} sub={`${openRate}% opened`} />
        <Kpi icon={Inbox} label="Replies" value={data.replies} sub={`${replyRate}% reply rate · ${data.unread} unread`} />
        <Kpi icon={Users} label="Prospects" value={data.prospectsTotal} sub={`${data.contactable} contactable`} />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Kpi icon={CheckCircle2} label="Delivered" value={data.delivered} />
        <Kpi icon={Target} label="Opened" value={data.opened} />
        <Kpi icon={AlertTriangle} label="Bounced / spam" value={data.bounced} />
        <Kpi icon={ShieldCheck} label="Suppressed" value={data.suppressed} sub="opt-outs honoured" />
      </div>

      {/* Region breakdown */}
      <Card className="p-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground/70">
          Pipeline by region
        </h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {data.byRegion.map((r) => (
            <div
              key={r.region}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span>{REGION_FLAG[r.region]}</span>
                {REGION_LABEL[r.region]}
              </span>
              <span className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="secondary">{r.contactable} ready</Badge>
                <span className="text-xs">{r.total} total</span>
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/sales/prospects" className="text-primary underline-offset-4 hover:underline">
          Prospect list →
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link href="/sales/inbox" className="text-primary underline-offset-4 hover:underline">
          Inbox ({data.unread}) →
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link href="/sales/campaigns" className="text-primary underline-offset-4 hover:underline">
          Campaigns →
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link href="/sales/templates" className="text-primary underline-offset-4 hover:underline">
          Templates →
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link href="/sales/settings" className="text-primary underline-offset-4 hover:underline">
          Settings →
        </Link>
        <span className="text-muted-foreground">·</span>
        <Link href="/sales/sop" className="text-primary underline-offset-4 hover:underline">
          SOP →
        </Link>
      </div>
    </div>
  );
}

function Banner({ tone, text }: { tone: "ok" | "warn" | "info"; text: string }) {
  const styles =
    tone === "ok"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
      : tone === "warn"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
        : "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300";
  return (
    <div className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${styles}`}>
      {tone === "ok" ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>{text}</span>
    </div>
  );
}
