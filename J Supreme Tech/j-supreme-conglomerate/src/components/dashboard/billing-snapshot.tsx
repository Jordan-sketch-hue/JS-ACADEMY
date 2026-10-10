"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import {
  listInvoicesForEarningsAction,
  type EarningsInvoiceSummary,
} from "@/app/(app)/invoices/actions";
import {
  balanceNative,
  collectedNative,
  convert,
  groupForJob,
  invoiceToJob,
  loadDisplayCurrency,
  loadFx,
  type Currency,
  type DisplayCurrency,
} from "@/lib/earnings/income";
import { isRecurring } from "@/lib/invoices/recurrence";
import {
  AlertTriangle,
  ArrowUpRight,
  Receipt,
  Repeat,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

function fmt(n: number, c: DisplayCurrency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: c,
    maximumFractionDigits: 0,
  }).format(n);
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function BillingSnapshot() {
  const [invoices, setInvoices] = useState<EarningsInvoiceSummary[] | null>(null);
  const [fx, setFx] = useState(155);
  const [display, setDisplay] = useState<DisplayCurrency>("USD");

  useEffect(() => {
    setFx(loadFx());
    setDisplay(loadDisplayCurrency());
    let cancelled = false;
    (async () => {
      try {
        const rows = await listInvoicesForEarningsAction();
        if (!cancelled) setInvoices(rows);
      } catch {
        if (!cancelled) setInvoices([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const rows = invoices ?? [];
    const conv = (v: number, cur: Currency) => convert(v, cur, display, fx);
    const jobs = rows.map(invoiceToJob);

    let outstanding = 0;
    let collected = 0;
    let open = 0;
    const monthMap = new Map<string, number>();
    for (const j of jobs) {
      collected += conv(collectedNative(j), j.currency);
      const bal = conv(balanceNative(j), j.currency);
      outstanding += bal;
      if (bal > 0) open += 1;
      const m = j.date.slice(0, 7);
      monthMap.set(m, (monthMap.get(m) ?? 0) + conv(j.amount, j.currency));
    }

    // Fixed income = any invoice whose income type resolves to "Fixed income"
    // (explicitly tagged on the invoice, or recurring).
    let fixedIncome = 0;
    let fixedCount = 0;
    for (const j of jobs) {
      if (groupForJob(j) === "Fixed income") {
        fixedIncome += conv(j.amount, j.currency);
        fixedCount += 1;
      }
    }
    const recurring = rows.filter((r) => isRecurring(r.recurrence));
    const nextDue = recurring
      .map((r) => r.next_issue_date)
      .filter((d): d is string => !!d)
      .sort()[0] ?? null;

    const months = Array.from(monthMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-12)
      .map(([m, v]) => {
        const [y, mo] = m.split("-");
        return {
          label: `${MONTH_NAMES[Number(mo) - 1] ?? mo} ${y.slice(2)}`,
          value: Math.round(v),
        };
      });

    return {
      outstanding,
      collected,
      open,
      recurringCount: recurring.length,
      fixedIncome,
      fixedCount,
      nextDue,
      months,
      ready: invoices !== null,
    };
  }, [invoices, fx, display]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotCard
          href="/earnings"
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Outstanding"
          value={fmt(stats.outstanding, display)}
          hint={`${stats.open} open invoice${stats.open === 1 ? "" : "s"}`}
          tone={stats.outstanding > 0 ? "warn" : "ok"}
          loading={!stats.ready}
        />
        <SnapshotCard
          href="/earnings"
          icon={<TrendingUp className="h-4 w-4" />}
          label="Collected (all-time)"
          value={fmt(stats.collected, display)}
          hint="Across every invoice"
          tone="ok"
          loading={!stats.ready}
        />
        <SnapshotCard
          href="/earnings"
          icon={<Repeat className="h-4 w-4" />}
          label="Fixed income"
          value={fmt(stats.fixedIncome, display)}
          hint={
            stats.fixedCount > 0
              ? `${stats.fixedCount} invoice${stats.fixedCount === 1 ? "" : "s"} · ${stats.recurringCount} recurring${stats.nextDue ? ` · next ${stats.nextDue}` : ""}`
              : "Tag invoices as Fixed income"
          }
          tone="accent"
          loading={!stats.ready}
        />
        <SnapshotCard
          href="/invoices"
          icon={<Receipt className="h-4 w-4" />}
          label="Open invoices"
          value={String(stats.open)}
          hint="Awaiting full payment"
          tone="default"
          loading={!stats.ready}
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-medium">
            <Link
              href="/earnings"
              className="inline-flex items-center gap-1 rounded-md text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Billing by month
              <ArrowUpRight className="h-3.5 w-3.5 opacity-50" aria-hidden />
            </Link>
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            Real invoices · {display}
          </Badge>
        </CardHeader>
        <CardContent>
          <RevenueChart data={stats.months} />
        </CardContent>
      </Card>
    </div>
  );
}

function SnapshotCard({
  href,
  icon,
  label,
  value,
  hint,
  tone,
  loading,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone: "default" | "ok" | "warn" | "accent";
  loading?: boolean;
}) {
  const toneRing: Record<typeof tone, string> = {
    default: "from-primary/10",
    ok: "from-positive/15",
    warn: "from-warning/20",
    accent: "from-accent/15",
  };
  const toneIcon: Record<typeof tone, string> = {
    default: "text-primary",
    ok: "text-positive",
    warn: "text-warning",
    accent: "text-accent",
  };
  return (
    <Link
      href={href}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card
        className={cn(
          "relative h-full overflow-hidden transition-colors group-hover:border-border",
          tone === "warn" && "border-warning/40",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-br to-transparent",
            toneRing[tone],
          )}
        />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={toneIcon[tone]}>{icon}</span>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-semibold tracking-tight tabular-nums",
              loading && "animate-pulse text-muted-foreground/40",
            )}
          >
            {loading ? "—" : value}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
