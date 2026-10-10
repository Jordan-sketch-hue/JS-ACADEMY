"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  DollarSign,
  Plus,
  Trash2,
  Download,
  Upload,
  TrendingUp,
  CalendarDays,
  Building2,
  Filter,
  Pencil,
  ArrowLeftRight,
  ExternalLink,
  Receipt,
  AlertTriangle,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { listInvoicesForEarningsAction } from "@/app/(app)/invoices/actions";
import {
  type Currency,
  type DisplayCurrency,
  type IncomeGroup,
  type Job,
  type Status,
  CATEGORIES,
  INCOME_GROUPS,
  DEFAULT_FX,
  STORAGE_KEY,
  FX_KEY,
  CCY_KEY,
  EXCLUDE_KEY,
  balanceNative,
  collectedNative,
  convert,
  groupForJob,
  invoiceToJob,
  monthlyNative,
  loadDisplayCurrency,
  loadFx,
  snap,
} from "@/lib/earnings/income";


/* ============================================================ */
const CUTOFF_KEY = "jsc-earnings-import-cutoff-iso";

/** Invoices created at or before this timestamp are NOT auto-imported into
 *  earnings. On first hydrate we set the cutoff to "now" so existing invoices
 *  (Nicole + anything older) stay out — only invoices created AFTER the user
 *  first runs this version will flow into earnings automatically. */
function loadCutoffIso(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CUTOFF_KEY);
  } catch {
    return null;
  }
}
function saveCutoffIso(iso: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(CUTOFF_KEY, iso); } catch {}
}

const STATUS_VARIANT: Record<Status, "success" | "secondary" | "outline"> = {
  paid: "success",
  invoiced: "secondary",
  pending: "outline",
};

const GROUP_COLOR: Record<IncomeGroup, string> = {
  Marketing: "hsl(var(--chart-5))",
  Tech: "hsl(var(--chart-1))",
  "Fixed income": "hsl(var(--chart-3))",
  Other: "hsl(var(--chart-2))",
};

/* ---------------- helpers ---------------- */
function loadJobs(): Job[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}
function saveJobs(jobs: Job[]) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs)); } catch {}
}
function saveFx(rate: number) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(FX_KEY, String(rate)); } catch {}
}
function saveCcy(c: DisplayCurrency) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(CCY_KEY, c); } catch {}
}

function loadExcluded(): Set<string> {
  const set = new Set<string>();
  if (typeof window === "undefined") return set;
  try {
    const raw = window.localStorage.getItem(EXCLUDE_KEY);
    if (!raw) return set;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      for (const n of parsed) {
        if (typeof n === "string") set.add(n);
      }
    }
  } catch {}
  return set;
}
function saveExcluded(set: Set<string>) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(EXCLUDE_KEY, JSON.stringify(Array.from(set))); } catch {}
}

const fmt = (n: number, c: Currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

/** Pre-seeded from NCB 874520241 + Scotia 935609 bank statements Apr–Jul 2026.
 *  Only loads when localStorage has no prior data. Invoice auto-import overlays on top. */
const SEED: Job[] = []; // Bank statement data now lives in Supabase as paid invoices (STMT-* series)

/* ============================================================ */
export function EarningsClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [display, setDisplay] = useState<DisplayCurrency>("USD");
  const [fx, setFx] = useState<number>(DEFAULT_FX);

  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; job?: Job } | null>(null);

  const [filterClient, setFilterClient] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<Status | "all">("all");
  const [filterYear,   setFilterYear]   = useState<string>("all");
  const [selectedGroups, setSelectedGroups] = useState<Set<IncomeGroup>>(
    () => new Set(INCOME_GROUPS),
  );

  const toggleGroup = useCallback((g: IncomeGroup) => {
    setSelectedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      // Never leave the table empty — an empty selection resets to "all".
      return next.size === 0 ? new Set(INCOME_GROUPS) : next;
    });
  }, []);
  const groupsActive = selectedGroups.size < INCOME_GROUPS.length;
  const [showTools, setShowTools] = useState(false);

  const [excludedInvoices, setExcludedInvoices] = useState<Set<string>>(() => new Set());
  const [importStatus, setImportStatus] = useState<{ added: number; skipped: number } | null>(null);

  /* hydrate */
  useEffect(() => {
    const loaded = loadJobs();
    setJobs(loaded.length ? loaded : SEED);
    setFx(loadFx());
    setDisplay(loadDisplayCurrency());
    setExcludedInvoices(loadExcluded());
    // Auto-import is no longer gated by a cutoff timestamp — every non-excluded
    // invoice flows in. Clean up the legacy cutoff key from earlier versions.
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(CUTOFF_KEY); } catch {}
    }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveJobs(jobs); }, [jobs, hydrated]);
  useEffect(() => { if (hydrated) saveFx(fx); }, [fx, hydrated]);
  useEffect(() => { if (hydrated) saveCcy(display); }, [display, hydrated]);
  useEffect(() => { if (hydrated) saveExcluded(excludedInvoices); }, [excludedInvoices, hydrated]);

  /* Auto-sync invoices ↔ earnings. Adds new rows, updates already-linked
   * rows, and removes auto-imported rows whose source invoice has been
   * deleted upstream. Manually-added rows (no sourceInvoiceId) are left
   * alone. Skips invoices in the excluded set. */
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    (async () => {
      try {
        const invoices = await listInvoicesForEarningsAction();
        if (cancelled) return;
        setJobs((cur) => {
          let added = 0;
          let skipped = 0;
          let updated = 0;
          let removed = 0;

          const invById = new Map(invoices.map((i) => [i.id, i]));
          const invByNumber = new Map(invoices.map((i) => [i.number, i]));

          // 1) drop auto-imported rows whose invoice no longer exists
          //    (match by id, then by number for legacy rows missing id).
          const kept: Job[] = [];
          for (const j of cur) {
            const linked =
              (j.sourceInvoiceId && invById.has(j.sourceInvoiceId)) ||
              (j.sourceInvoiceNumber && invByNumber.has(j.sourceInvoiceNumber));
            if (j.sourceInvoiceId || j.sourceInvoiceNumber) {
              if (linked) {
                kept.push(j);
              } else {
                removed++;
              }
            } else {
              kept.push(j);
            }
          }

          // 2) update + add against the surviving set
          // Index surviving jobs by invoice id AND number so we can re-link a
          // cached job even if only one matches (legacy rows, regenerated ids).
          const byId = new Map<string, number>();
          const byNumber = new Map<string, number>();
          kept.forEach((j, i) => {
            if (j.sourceInvoiceId) byId.set(j.sourceInvoiceId, i);
            const num = j.sourceInvoiceNumber ?? j.invoiceRef;
            if (num) byNumber.set(num, i);
          });

          const next = kept.slice();
          const newRows: Job[] = [];
          const claimed = new Set<number>();

          for (const inv of invoices) {
            if (excludedInvoices.has(inv.number)) { skipped++; continue; }
            const mapped = invoiceToJob(inv);
            let idx = byId.get(inv.id);
            if (idx === undefined) idx = byNumber.get(inv.number);
            if (idx !== undefined && !claimed.has(idx)) {
              claimed.add(idx);
              const prev = next[idx];
              const merged: Job = { ...prev, ...mapped, id: prev.id };
              // Always refresh derived fields from the live invoice so income
              // type, recurrence, totals, etc. never go stale in the cache.
              next[idx] = merged;
              if (
                prev.amount !== merged.amount ||
                prev.currency !== merged.currency ||
                prev.status !== merged.status ||
                prev.deposit !== merged.deposit ||
                prev.client !== merged.client ||
                prev.project !== merged.project ||
                prev.date !== merged.date ||
                prev.invoiceRef !== merged.invoiceRef ||
                prev.category !== merged.category ||
                prev.incomeGroup !== merged.incomeGroup ||
                prev.recurring !== merged.recurring
              ) {
                updated++;
              }
            } else {
              newRows.push(mapped);
              added++;
            }
          }

          if (!cancelled) setImportStatus({ added: added + updated + removed, skipped });
          if (added === 0 && updated === 0 && removed === 0) return cur;
          return [...newRows, ...next];
        });
      } catch {
        /* offline / not configured — silent */
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  /* per-job conversions */
  const totalIn      = useCallback((j: Job) => convert(j.amount, j.currency, display, fx), [display, fx]);
  const collectedIn  = useCallback((j: Job) => convert(collectedNative(j), j.currency, display, fx), [display, fx]);
  const balanceIn    = useCallback((j: Job) => convert(balanceNative(j),  j.currency, display, fx), [display, fx]);
  const altCcy: DisplayCurrency = display === "USD" ? "JMD" : "USD";
  const totalInAlt   = useCallback((j: Job) => convert(j.amount, j.currency, altCcy, fx), [altCcy, fx]);

  /* filtered set */
  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (filterClient && !j.client.toLowerCase().includes(filterClient.toLowerCase())) return false;
      if (filterStatus !== "all" && j.status !== filterStatus) return false;
      if (filterYear !== "all" && !j.date.startsWith(filterYear)) return false;
      if (!selectedGroups.has(groupForJob(j))) return false;
      return true;
    });
  }, [jobs, filterClient, filterStatus, filterYear, selectedGroups]);

  /* aggregate totals */
  const allTime      = useMemo(() => jobs.reduce((s, j) => s + totalIn(j), 0), [jobs, totalIn]);
  const collected    = useMemo(() => jobs.reduce((s, j) => s + collectedIn(j), 0), [jobs, collectedIn]);
  const outstanding  = useMemo(() => jobs.reduce((s, j) => s + balanceIn(j), 0), [jobs, balanceIn]);

  /* Monthly recurring income (MRR) — kept in NATIVE currencies so each figure is
   * exact; the combined total is converted only once, with the rate shown, so a
   * mixed JMD+USD book never looks like a "bad conversion". */
  const mrrByCcy = useMemo(() => {
    const m: Record<Currency, number> = { USD: 0, JMD: 0 };
    for (const j of jobs) {
      const v = monthlyNative(j);
      if (v > 0) m[j.currency] += v;
    }
    return m;
  }, [jobs]);
  const mrr = useMemo(
    () => convert(mrrByCcy.USD, "USD", display, fx) + convert(mrrByCcy.JMD, "JMD", display, fx),
    [mrrByCcy, display, fx],
  );
  const mrrNative = useMemo(
    () =>
      [
        mrrByCcy.JMD > 0 ? fmt(mrrByCcy.JMD, "JMD") : null,
        mrrByCcy.USD > 0 ? fmt(mrrByCcy.USD, "USD") : null,
      ]
        .filter(Boolean)
        .join(" + "),
    [mrrByCcy],
  );
  const recurringClients = useMemo(
    () => new Set(jobs.filter((j) => j.recurring).map((j) => j.client)).size,
    [jobs],
  );

  const altOf = (v: number) => display === "USD" ? v * fx : v / fx;
  const filteredSum  = useMemo(() => filtered.reduce((s, j) => s + totalIn(j), 0), [filtered, totalIn]);
  const avg          = jobs.length ? allTime / jobs.length : 0;
  const clientsCount = useMemo(() => new Set(jobs.map((j) => j.client)).size, [jobs]);
  const years        = useMemo(() => Array.from(new Set(jobs.map((j) => j.date.slice(0, 4)))).sort().reverse(), [jobs]);

  const openJobs     = useMemo(() => jobs.filter((j) => balanceNative(j) > 0), [jobs]);
  const depositCount = useMemo(() => jobs.filter((j) => j.status !== "paid" && (j.deposit ?? 0) > 0).length, [jobs]);

  /* roll-ups */
  const byClient = useMemo(() => {
    const map = new Map<string, { client: string; total: number; collected: number; balance: number; jobs: number; lastDate: string }>();
    for (const j of jobs) {
      const cur = map.get(j.client) ?? { client: j.client, total: 0, collected: 0, balance: 0, jobs: 0, lastDate: j.date };
      cur.total     += totalIn(j);
      cur.collected += collectedIn(j);
      cur.balance   += balanceIn(j);
      cur.jobs += 1;
      if (j.date > cur.lastDate) cur.lastDate = j.date;
      map.set(j.client, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [jobs, totalIn, collectedIn, balanceIn]);

  const byYear = useMemo(() => {
    const map = new Map<string, number>();
    for (const j of jobs) {
      const y = j.date.slice(0, 4);
      map.set(y, (map.get(y) ?? 0) + totalIn(j));
    }
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [jobs, totalIn]);
  const maxYearVal = byYear.length ? Math.max(...byYear.map(([, v]) => v)) : 1;

  /* income-type roll-up (Marketing / Tech / Fixed income / Other) */
  const byGroup = useMemo(() => {
    const map = new Map<IncomeGroup, { total: number; collected: number; jobs: number }>();
    for (const g of INCOME_GROUPS) map.set(g, { total: 0, collected: 0, jobs: 0 });
    for (const j of jobs) {
      const cur = map.get(groupForJob(j))!;
      cur.total += totalIn(j);
      cur.collected += collectedIn(j);
      cur.jobs += 1;
    }
    return INCOME_GROUPS.map((group) => ({ group, ...map.get(group)! }));
  }, [jobs, totalIn, collectedIn]);

  /* actions */
  const upsert = useCallback((j: Job) => {
    setJobs((cur) => {
      const idx = cur.findIndex((x) => x.id === j.id);
      if (idx === -1) return [j, ...cur];
      const next = cur.slice();
      next[idx] = j;
      return next;
    });
  }, []);
  const deleteJob = useCallback((id: string) => {
    setJobs((cur) => {
      const target = cur.find((j) => j.id === id);
      if (target?.sourceInvoiceNumber) {
        // Don't let it reappear on the next page load.
        setExcludedInvoices((prev) => {
          if (prev.has(target.sourceInvoiceNumber!)) return prev;
          const next = new Set(prev);
          next.add(target.sourceInvoiceNumber!);
          return next;
        });
      }
      return cur.filter((j) => j.id !== id);
    });
  }, []);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ jobs, fx, display }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `jsc-earnings-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };
  const importJson: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const incoming: Job[] = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.jobs) ? parsed.jobs : []);
        if (incoming.length) {
          if (window.confirm(`Replace ${jobs.length} entries with ${incoming.length} from file?`)) {
            setJobs(incoming);
            if (parsed.fx) setFx(Number(parsed.fx) || DEFAULT_FX);
          }
        }
      } catch { window.alert("Could not parse file."); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  /* ============================================================ */
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">All-time earnings</p>
          <h1 className="font-jarvis text-3xl font-semibold tracking-tight">
            Every job, every dollar — one profile.
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Lifetime revenue — collected vs outstanding, by client and income type. Tap any entry to edit.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-md border bg-muted/20 p-0.5 text-xs">
            <button
              onClick={() => setDisplay("USD")}
              className={cn("rounded-sm px-2.5 py-1 transition", display === "USD" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
            >USD</button>
            <button
              onClick={() => setDisplay("JMD")}
              className={cn("rounded-sm px-2.5 py-1 transition", display === "JMD" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
            >JMD</button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowTools((v) => !v)}
            aria-expanded={showTools}
          >
            <Settings2 className="h-4 w-4" />
            Tools
          </Button>
          <Button size="sm" onClick={() => setDialog({ mode: "add" })}>
            <Plus className="mr-2 h-4 w-4" />Add
          </Button>
        </div>
      </div>

      {/* Tools — FX rate + import/export (collapsed by default to keep the header clean) */}
      {showTools && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/30 p-3">
          <div className="inline-flex items-center gap-1.5 rounded-md border bg-muted/20 px-2 py-1 text-xs">
            <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">1 USD =</span>
            <Input
              type="number"
              min={1}
              step={0.5}
              value={fx}
              onChange={(e) => setFx(Math.max(1, Number(e.target.value) || DEFAULT_FX))}
              className="h-6 w-16 border-0 bg-transparent px-1 text-right tabular-nums focus-visible:ring-1"
            />
            <span className="text-muted-foreground">JMD rate</span>
          </div>
          <Button asChild variant="outline" size="sm">
            <label className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Import
              <input type="file" accept="application/json" className="hidden" onChange={importJson} />
            </label>
          </Button>
          <Button variant="outline" size="sm" onClick={exportJson}>
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </div>
      )}

      {importStatus && (importStatus.added > 0 || importStatus.skipped > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-info/30 bg-info/[0.06] px-3 py-2 text-xs">
          <div className="text-info">
            <span className="font-semibold">Synced from invoices:</span>{" "}
            {importStatus.added > 0
              ? `${importStatus.added} ${importStatus.added === 1 ? "row" : "rows"} added/updated.`
              : "everything is up to date."}
            {importStatus.skipped > 0 && (
              <> {importStatus.skipped} excluded {importStatus.skipped === 1 ? "invoice was" : "invoices were"} skipped.</>
            )}
          </div>
          <div className="flex items-center gap-2">
            {excludedInvoices.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => {
                  if (!window.confirm(
                    `Clear ${excludedInvoices.size} invoice exclusion${excludedInvoices.size === 1 ? "" : "s"} and re-import everything from /invoices?`,
                  )) return;
                  setExcludedInvoices(new Set());
                  setImportStatus(null);
                  window.location.reload();
                }}
              >
                Reset exclusions
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setImportStatus(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* KPIs — dual currency */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="All-time charged" primary={fmt(allTime, display)}     secondary={fmt(altOf(allTime), altCcy)}     sub={`${jobs.length} job${jobs.length === 1 ? "" : "s"}`}                          icon={DollarSign}    accent="text-positive" />
        <Kpi label="Collected"        primary={fmt(collected, display)}   secondary={fmt(altOf(collected), altCcy)}   sub={`${jobs.filter((j) => j.status === "paid").length} fully paid · ${depositCount} w/ deposit`} icon={TrendingUp} accent="text-positive" />
        <Kpi label="Outstanding"      primary={fmt(outstanding, display)} secondary={fmt(altOf(outstanding), altCcy)} sub={`${openJobs.length} open job${openJobs.length === 1 ? "" : "s"}`}              icon={CalendarDays}  accent={outstanding > 0 ? "text-warning" : "text-positive"} highlight={outstanding > 0} />
        <Kpi label="Avg job size"     primary={fmt(avg, display)}         secondary={fmt(altOf(avg), altCcy)}         sub="per engagement"                                                               icon={Briefcase}     accent="text-info" />
        <Kpi label="Clients served"   primary={String(clientsCount)}      sub="unique organisations"                                                                                                     icon={Building2}     accent="text-info" />
      </div>

      {/* Monthly recurring income (MRR) — the run-rate from retainer clients */}
      {mrr > 0 && (
        <Card className="border-primary/40 bg-primary/[0.06]">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-md border border-primary/30 bg-primary/10 p-2">
                <CalendarDays className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Monthly recurring income (MRR)
                </p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">
                  {mrrNative}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  ≈ {fmt(mrr, display)}/mo combined
                  {mrrByCcy.USD > 0 && mrrByCcy.JMD > 0 && <> · at 1 USD = {fx} JMD</>}
                  {" · "}{recurringClients} recurring client{recurringClients === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Annualized</p>
              <p className="text-lg font-semibold tabular-nums">{fmt(mrr * 12, display)}<span className="text-xs font-normal text-muted-foreground">/yr</span></p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Income type — filter + breakdown */}
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-base">Income type</CardTitle>
            <CardDescription>
              Tap a type to filter the jobs table below. Recurring invoices count as Fixed income.
            </CardDescription>
          </div>
          {groupsActive ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setSelectedGroups(new Set(INCOME_GROUPS))}
            >
              Show all
            </Button>
          ) : null}
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {byGroup.map(({ group, total, collected, jobs: count }) => {
              const active = selectedGroups.has(group);
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => toggleGroup(group)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    active
                      ? "border-primary/50 bg-primary/[0.06]"
                      : "border-border/50 bg-background/30 opacity-55 hover:opacity-100",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: GROUP_COLOR[group] }}
                        aria-hidden
                      />
                      {group}
                    </span>
                    <input
                      type="checkbox"
                      checked={active}
                      readOnly
                      tabIndex={-1}
                      className="pointer-events-none h-4 w-4 accent-primary"
                    />
                  </div>
                  <p className="mt-2 text-xl font-semibold tabular-nums">{fmt(total, display)}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {count} job{count === 1 ? "" : "s"} · {fmt(collected, display)} collected
                  </p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Outstanding bills · prominent at top */}
      {openJobs.length > 0 && (
        <Card className="border-warning/40 bg-warning/[0.06]">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="flex items-start gap-3">
              <div className="rounded-md border border-warning/30 bg-warning/10 p-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </div>
              <div>
                <CardTitle className="text-base">Outstanding bills</CardTitle>
                <CardDescription>
                  {openJobs.length} open · <span className="font-semibold text-foreground">{fmt(outstanding, display)}</span> due ({fmt(altOf(outstanding), altCcy)})
                </CardDescription>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/invoices">
                <Receipt className="mr-2 h-4 w-4" />
                All invoices
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Collected</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openJobs
                  .slice()
                  .sort((a, b) => balanceIn(b) - balanceIn(a))
                  .map((j) => {
                    const pct = j.amount > 0 ? Math.round((collectedNative(j) / j.amount) * 100) : 0;
                    return (
                      <TableRow key={j.id} className="cursor-pointer hover:bg-warning/[0.06]" onClick={() => setDialog({ mode: "edit", job: j })}>
                        <TableCell className="font-medium">{j.client}</TableCell>
                        <TableCell>
                          <div>{j.project}</div>
                          <div className="mt-1.5 flex items-center gap-2">
                            <div className="h-1.5 w-28 rounded-full bg-muted/40">
                              <div className="h-1.5 rounded-full bg-gradient-to-r from-positive to-warning" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[10px] text-muted-foreground tabular-nums">{pct}% collected</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          {j.invoiceRef ? (
                            <Button asChild variant="ghost" size="sm" className="h-7 -ml-2 px-2 text-xs">
                              <Link href={`/invoices/${encodeURIComponent(j.invoiceRef)}`}>
                                <Receipt className="mr-1.5 h-3 w-3" />
                                {j.invoiceRef}
                                <ExternalLink className="ml-1 h-3 w-3 opacity-70" />
                              </Link>
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 -ml-2 px-2 text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => setDialog({ mode: "edit", job: j })}
                            >
                              + add invoice ref
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">{fmt(totalIn(j), display)}</TableCell>
                        <TableCell className="text-right tabular-nums text-positive">{fmt(collectedIn(j), display)}</TableCell>
                        <TableCell className="text-right tabular-nums font-semibold text-warning">{fmt(balanceIn(j), display)}</TableCell>
                        <TableCell><Badge variant={STATUS_VARIANT[j.status]}>{j.status}</Badge></TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* By year + By client */}
      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle className="text-base">By year</CardTitle>
            <CardDescription>Lifetime revenue grouped by calendar year ({display}).</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {byYear.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add a job to see year totals.</p>
            ) : byYear.map(([y, total]) => {
              const pct = Math.round((total / maxYearVal) * 100);
              return (
                <div key={y} className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-sm">{y}</span>
                    <span className="font-semibold tabular-nums">{fmt(total, display)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/40">
                    <div className="h-2 rounded-full bg-gradient-to-r from-positive via-warning to-negative" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">By client</CardTitle>
              <CardDescription>Top revenue contributors · total · collected · balance ({display}).</CardDescription>
            </div>
            <Badge variant="outline">{clientsCount} client{clientsCount === 1 ? "" : "s"}</Badge>
          </CardHeader>
          <CardContent>
            {byClient.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Jobs</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Collected</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byClient.map((c) => (
                    <TableRow key={c.client}>
                      <TableCell className="font-medium">{c.client}</TableCell>
                      <TableCell className="text-right tabular-nums">{c.jobs}</TableCell>
                      <TableCell className="text-right tabular-nums">{fmt(c.total, display)}</TableCell>
                      <TableCell className="text-right tabular-nums text-positive">{fmt(c.collected, display)}</TableCell>
                      <TableCell className={cn("text-right tabular-nums", c.balance > 0 ? "text-warning font-semibold" : "text-muted-foreground")}>
                        {fmt(c.balance, display)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Jobs table + filters */}
      <Card>
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">All jobs</CardTitle>
              <CardDescription>
                Filtered total: <span className="font-semibold text-foreground">{fmt(filteredSum, display)}</span> · {filtered.length} of {jobs.length}
              </CardDescription>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </div>
              <Input
                placeholder="Client…"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="h-9 w-full sm:w-40"
              />
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as Status | "all")}>
                <SelectTrigger className="h-9 flex-1 sm:w-32 sm:flex-none"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="invoiced">Invoiced</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="h-9 flex-1 sm:w-28 sm:flex-none"><SelectValue placeholder="Year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All years</SelectItem>
                  {years.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No jobs match the current filter. Adjust filters or add a new job.</p>
          ) : (
            <>
              <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Collected · Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice().sort((a, b) => b.date.localeCompare(a.date)).map((j) => {
                  const total = totalIn(j);
                  const got   = collectedIn(j);
                  const due   = balanceIn(j);
                  const pct   = j.amount > 0 ? Math.round((collectedNative(j) / j.amount) * 100) : 0;
                  const fullyPaid = due <= 0;
                  return (
                    <TableRow
                      key={j.id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setDialog({ mode: "edit", job: j })}
                    >
                      <TableCell className="font-mono text-xs">{j.date}</TableCell>
                      <TableCell className="font-medium">{j.client}</TableCell>
                      <TableCell>
                        <div>{j.project}</div>
                        {j.notes ? <div className="mt-0.5 text-xs text-muted-foreground">{j.notes}</div> : null}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        {j.invoiceRef ? (
                          <Button asChild variant="ghost" size="sm" className="h-7 -ml-2 px-2 text-xs">
                            <Link href={`/invoices/${encodeURIComponent(j.invoiceRef)}`}>
                              <Receipt className="mr-1.5 h-3 w-3" />
                              {j.invoiceRef}
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        <div className="font-medium">{fmt(total, display)}</div>
                        {j.currency !== display && (
                          <div className="text-[10px] text-muted-foreground">{fmt(j.amount, j.currency)} native</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {fullyPaid ? (
                          <Badge variant="success" className="font-normal">Fully collected</Badge>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-end gap-2 text-xs">
                              <span className="text-positive">{fmt(got, display)}</span>
                              <span className="text-muted-foreground">/</span>
                              <span className="font-semibold text-warning">{fmt(due, display)} due</span>
                            </div>
                            <div className="ml-auto h-1.5 w-28 rounded-full bg-muted/40">
                              <div className="h-1.5 rounded-full bg-gradient-to-r from-positive to-warning" style={{ width: `${pct}%` }} />
                            </div>
                            <div className="text-[10px] text-right text-muted-foreground tabular-nums">{pct}%</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell><Badge variant={STATUS_VARIANT[j.status]}>{j.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDialog({ mode: "edit", job: j })}
                            aria-label="Edit job"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => { if (window.confirm(`Delete "${j.project}"?`)) deleteJob(j.id); }}
                            aria-label="Delete job"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
              </div>

              {/* Mobile card list */}
              <div className="space-y-2 lg:hidden">
                {filtered
                  .slice()
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((j) => {
                    const total = totalIn(j);
                    const got = collectedIn(j);
                    const due = balanceIn(j);
                    const pct = j.amount > 0 ? Math.round((collectedNative(j) / j.amount) * 100) : 0;
                    const fullyPaid = due <= 0;
                    return (
                      <div
                        key={j.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setDialog({ mode: "edit", job: j })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setDialog({ mode: "edit", job: j });
                        }}
                        className="cursor-pointer rounded-xl border border-border/60 bg-card/40 p-3 transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate font-medium">{j.client}</p>
                            <p className="truncate text-xs text-muted-foreground">{j.project}</p>
                          </div>
                          <Badge variant={STATUS_VARIANT[j.status]} className="shrink-0 capitalize">
                            {j.status}
                          </Badge>
                        </div>
                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                            <p className="font-semibold tabular-nums">{fmt(total, display)}</p>
                          </div>
                          <div className="text-right">
                            {fullyPaid ? (
                              <Badge variant="success" className="font-normal">Fully collected</Badge>
                            ) : (
                              <>
                                <p className="text-xs">
                                  <span className="text-positive">{fmt(got, display)}</span>
                                  <span className="text-muted-foreground"> / </span>
                                  <span className="font-semibold text-warning">{fmt(due, display)} due</span>
                                </p>
                                <div className="ml-auto mt-1 h-1.5 w-24 rounded-full bg-muted/40">
                                  <div
                                    className="h-1.5 rounded-full bg-gradient-to-r from-positive to-warning"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2">
                          <span className="font-mono text-[10px] text-muted-foreground">{j.date}</span>
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {j.invoiceRef ? (
                              <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                                <Link href={`/invoices/${encodeURIComponent(j.invoiceRef)}`}>
                                  <Receipt className="mr-1 h-3 w-3" />
                                  {j.invoiceRef}
                                </Link>
                              </Button>
                            ) : null}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              aria-label="Delete job"
                              onClick={() => {
                                if (window.confirm(`Delete "${j.project}"?`)) deleteJob(j.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit dialog */}
      <JobDialog
        state={dialog}
        fx={fx}
        onClose={() => setDialog(null)}
        onSubmit={(job) => { upsert(job); setDialog(null); }}
      />
    </div>
  );
}

/* ============================================================ */
function Kpi({
  label, primary, secondary, sub, icon: Icon, accent, highlight,
}: { label: string; primary: string; secondary?: string; sub?: string; icon: typeof DollarSign; accent?: string; highlight?: boolean }) {
  return (
    <Card className={cn(highlight && "border-warning/40 bg-warning/[0.06]")}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className={cn("h-4 w-4", accent)} />
        </div>
        <p className="mt-2 text-2xl font-semibold tabular-nums">{primary}</p>
        {secondary ? <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">≈ {secondary}</p> : null}
        {sub ? <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p> : null}
      </CardContent>
    </Card>
  );
}

/* ============================================================ */
function JobDialog({
  state, onClose, onSubmit, fx,
}: {
  state: { mode: "add" | "edit"; job?: Job } | null;
  onClose: () => void;
  onSubmit: (j: Job) => void;
  fx: number;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const isEdit = state?.mode === "edit";
  const editing = state?.job;

  const [client, setClient]         = useState("");
  const [project, setProject]       = useState("");
  const [category, setCategory]     = useState<string>(CATEGORIES[0]);
  const [amount, setAmount]         = useState<string>("");
  const [deposit, setDeposit]       = useState<string>("");
  const [currency, setCurrency]     = useState<Currency>("USD");
  const [date, setDate]             = useState<string>(today);
  const [status, setStatus]         = useState<Status>("paid");
  const [invoiceRef, setInvoiceRef] = useState<string>("");
  const [notes, setNotes]           = useState<string>("");
  const [recurring, setRecurring]   = useState<boolean>(false);
  const [convertedAt, setConvertedAt] = useState<{ from: Currency; rate: number } | null>(null);

  /* hydrate fields when dialog opens */
  useEffect(() => {
    if (!state) return;
    setConvertedAt(null);
    if (state.mode === "edit" && state.job) {
      const j = state.job;
      setClient(j.client); setProject(j.project); setCategory(j.category);
      setAmount(String(j.amount)); setDeposit(j.deposit != null ? String(j.deposit) : "");
      setCurrency(j.currency); setDate(j.date); setStatus(j.status);
      setInvoiceRef(j.invoiceRef ?? ""); setNotes(j.notes ?? "");
      setRecurring(!!j.recurring);
    } else {
      setClient(""); setProject(""); setCategory(CATEGORIES[0]); setAmount(""); setDeposit("");
      setCurrency("USD"); setDate(today); setStatus("paid"); setInvoiceRef(""); setNotes("");
      setRecurring(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const amt = Number(amount) || 0;
  const dep = Number(deposit) || 0;
  const balance = status === "paid" ? 0 : Math.max(0, amt - dep);
  const pct = amt > 0 ? Math.round(((status === "paid" ? amt : Math.min(amt, dep)) / amt) * 100) : 0;

  /** Currency-aware live previews of the entered amounts in the OTHER currency. */
  const altCcy: Currency = currency === "USD" ? "JMD" : "USD";
  const amtAlt = amt > 0 ? convert(amt, currency, altCcy, fx) : 0;
  const depAlt = dep > 0 ? convert(dep, currency, altCcy, fx) : 0;

  /** Switching the currency dropdown auto-converts both Amount and Deposit so the
   *  monetary value is preserved (no more "4200 USD silently becomes 4200 JMD"). */
  const onCurrencyChange = (next: Currency) => {
    if (next === currency) return;
    const newAmt = amt > 0 ? snap(convert(amt, currency, next, fx), next) : amt;
    const newDep = dep > 0 ? snap(convert(dep, currency, next, fx), next) : dep;
    if (amt > 0) setAmount(String(newAmt));
    if (dep > 0) setDeposit(String(newDep));
    setConvertedAt({ from: currency, rate: fx });
    setCurrency(next);
  };

  const submit = () => {
    if (!client.trim() || !project.trim() || !Number.isFinite(amt) || amt <= 0) return;
    onSubmit({
      // Spread the row being edited FIRST so we preserve the invoice link
      // (sourceInvoiceId / sourceInvoiceNumber) and any explicit incomeGroup.
      // Without this, saving an edit stripped those fields — demoting synced
      // Fixed-income rows and letting the invoice re-import as a duplicate.
      ...(editing ?? {}),
      id: editing?.id ?? `j_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      client: client.trim(),
      project: project.trim(),
      category,
      amount: snap(amt, currency),
      deposit: status === "paid" ? undefined : (dep > 0 ? snap(Math.min(dep, amt), currency) : undefined),
      currency,
      date,
      status,
      invoiceRef: invoiceRef.trim() || undefined,
      notes: notes.trim() || undefined,
      // Monthly / recurring clients always count as Fixed income (see groupForJob).
      recurring: recurring || undefined,
    });
  };

  return (
    <Dialog open={!!state} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit job" : "Add a past job"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update fields. KPIs and outstanding bills recompute instantly."
              : "Logged to this browser. Export anytime."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="ej-client">Client</Label>
            <Input id="ej-client" value={client} onChange={(e) => setClient(e.target.value)} placeholder="The Language Cradle" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ej-project">Project / engagement</Label>
            <Input id="ej-project" value={project} onChange={(e) => setProject(e.target.value)} placeholder="Mockup site + Global Voice™" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ej-cat">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="ej-cat"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ej-date">Date</Label>
              <Input id="ej-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>

          {/* MONEY group */}
          <div className="rounded-md border border-border/60 bg-muted/20 p-3 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 grid gap-1.5">
                <Label htmlFor="ej-amount" className="flex items-center justify-between">
                  <span>Total charged</span>
                  {amt > 0 && (
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      ≈ {fmt(amtAlt, altCcy)}
                    </span>
                  )}
                </Label>
                <Input
                  id="ej-amount"
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setConvertedAt(null); }}
                  placeholder="2200"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="ej-currency">Currency</Label>
                <Select value={currency} onValueChange={(v) => onCurrencyChange(v as Currency)}>
                  <SelectTrigger id="ej-currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="JMD">JMD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {convertedAt && (
              <div className="rounded-sm border border-info/30 bg-info/10 px-2.5 py-1.5 text-[11px] text-info flex items-center gap-1.5">
                <ArrowLeftRight className="h-3 w-3" />
                Auto-converted from {convertedAt.from} at 1 USD = {convertedAt.rate} JMD
              </div>
            )}

            {status !== "paid" && (
              <>
                <div className="grid gap-1.5">
                  <Label htmlFor="ej-deposit" className="flex items-center justify-between">
                    <span>
                      Deposit received{" "}
                      <span className="text-muted-foreground text-[10px] uppercase tracking-wider ml-1">{currency}</span>
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums flex items-center gap-2">
                      {dep > 0 && <span>≈ {fmt(depAlt, altCcy)}</span>}
                      {amt > 0 && dep > 0 && <span>· {pct}% of total</span>}
                    </span>
                  </Label>
                  <Input
                    id="ej-deposit"
                    type="number"
                    min={0}
                    max={amt}
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="0"
                  />
                </div>
                {amt > 0 && (
                  <div className="rounded-sm bg-background/60 px-2 py-1.5 text-xs flex items-center justify-between">
                    <span className="text-muted-foreground">Balance outstanding</span>
                    <span className={cn("tabular-nums font-semibold", balance > 0 ? "text-warning" : "text-positive")}>
                      {fmt(balance, currency)}
                      {balance > 0 && (
                        <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                          ≈ {fmt(convert(balance, currency, altCcy, fx), altCcy)}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ej-status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger id="ej-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid (full)</SelectItem>
                <SelectItem value="invoiced">Invoiced (awaiting / partial)</SelectItem>
                <SelectItem value="pending">Pending / quoted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Monthly / recurring → always counted as Fixed income */}
          <label
            htmlFor="ej-recurring"
            className="flex cursor-pointer items-start gap-3 rounded-md border border-border/60 bg-muted/20 p-3"
          >
            <input
              id="ej-recurring"
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span className="space-y-0.5">
              <span className="flex items-center gap-2 text-sm font-medium">
                <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                Bills monthly / recurring
              </span>
              <span className="block text-xs text-muted-foreground">
                Turn on for clients on a repeating retainer — they&apos;re added to{" "}
                <span className="font-medium text-foreground">Fixed income</span> automatically.
              </span>
            </span>
          </label>

          <div className="grid gap-1.5">
            <Label htmlFor="ej-invoice" className="flex items-center justify-between">
              <span>Invoice reference</span>
              {invoiceRef.trim() && (
                <Link
                  href={`/invoices/${encodeURIComponent(invoiceRef.trim())}`}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  Open invoice <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </Label>
            <Input id="ej-invoice" value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} placeholder="INV-2026-0042" />
            <p className="text-[10px] text-muted-foreground">Used as the slug for /invoices/[ref] · leave blank if no invoice exists yet.</p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="ej-notes">Notes</Label>
            <Textarea id="ej-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional scope or context" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={submit}>{isEdit ? "Save changes" : "Save job"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
