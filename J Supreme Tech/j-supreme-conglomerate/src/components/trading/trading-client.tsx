"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/utils";
import type { EquityCurvePoint, TradeListBundle, TradeRecord } from "@/lib/data/trading-metrics";
import {
  buildEquityCurve,
  computeTradingStats,
  isClosedMarketDeal,
} from "@/lib/data/trading-metrics";
import { TradingEquityChart } from "@/components/trading/equity-trading-chart";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTradeJournalAction } from "@/app/(app)/trading/actions";
import { Pencil, RefreshCw } from "lucide-react";

const CACHE_KEY = (ownerId: string) => `j-supreme:trading-bundle:${ownerId}`;

function formatWhen(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function normalizeTradeBundle(raw: unknown): TradeListBundle | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<TradeListBundle>;
  if (!Array.isArray(p.trades)) return null;
  return {
    trades: p.trades,
    sync: p.sync ?? null,
    stats: p.stats ?? computeTradingStats(p.trades),
    equityCurve:
      p.equityCurve && p.equityCurve.length ?
        (p.equityCurve as EquityCurvePoint[])
      : buildEquityCurve(p.trades),
  };
}

function flowBadgeLabel(t: Pick<TradeRecord, "flow_kind">): string {
  switch (t.flow_kind) {
    case "deposit":
      return "Deposit";
    case "withdrawal":
      return "Withdrawal";
    case "credit":
      return "Credit";
    case "adjustment":
      return "Adjustment";
    case "market":
      return "Market";
    default:
      return "Market";
  }
}

function avgRMultiple(trades: TradeRecord[]): string {
  const vals = trades
    .filter((t) => isClosedMarketDeal(t))
    .map((t) => t.risk_reward)
    .filter((x): x is number => x != null && Number.isFinite(x));
  if (!vals.length) return "—";
  const s = vals.reduce((a, b) => a + b, 0);
  return (s / vals.length).toFixed(2);
}

type Props = {
  bundle: TradeListBundle;
  ownerId: string;
};

export function TradingClient({ bundle: initialBundle, ownerId }: Props) {
  const router = useRouter();
  const [bundle, setBundle] = useState(initialBundle);
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [cached, setCached] = useState(false);
  const [editing, setEditing] = useState<TradeRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [tag, setTag] = useState("");
  const [mood, setMood] = useState("");
  const [session, setSession] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setBundle(initialBundle);
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(CACHE_KEY(ownerId), JSON.stringify(initialBundle));
    } catch {
      /* ignore quota */
    }
  }, [initialBundle, ownerId]);

  useEffect(() => {
    const onOff = () => setOffline(!navigator.onLine);
    window.addEventListener("online", onOff);
    window.addEventListener("offline", onOff);
    return () => {
      window.removeEventListener("online", onOff);
      window.removeEventListener("offline", onOff);
    };
  }, []);

  useEffect(() => {
    if (offline && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(CACHE_KEY(ownerId));
        if (raw) {
          const nb = normalizeTradeBundle(JSON.parse(raw));
          if (nb) {
            setBundle(nb);
            setCached(true);
          }
        }
      } catch {
        /* ignore */
      }
    } else {
      setCached(false);
    }
  }, [offline, ownerId]);

  const openEdit = useCallback((t: TradeRecord) => {
    setEditing(t);
    setTag(t.strategy_tag ?? "");
    setMood(t.emotional_state ?? "");
    setSession(t.session_label ?? "");
    setNote(t.journal_note ?? "");
  }, []);

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await updateTradeJournalAction(editing.id, {
        strategy_tag: tag.trim() || null,
        emotional_state: mood.trim() || null,
        session_label: session.trim() || null,
        journal_note: note.trim() || null,
      });
      if (!res.ok) {
        console.error(res.error);
        return;
      }
      setEditing(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const { stats, sync, trades, equityCurve } = bundle;

  const tagBuckets = useMemo(() => {
    const m = new Map<string, { wins: number; losses: number }>();
    for (const t of trades) {
      if (!isClosedMarketDeal(t)) continue;
      const k = (t.strategy_tag ?? "").trim() || "—";
      if (!m.has(k)) m.set(k, { wins: 0, losses: 0 });
      const b = m.get(k)!;
      const p = t.pnl ?? 0;
      if (p > 0) b.wins++;
      else if (p < 0) b.losses++;
    }
    return [...m.entries()].sort((a, b) => b[1].wins + b[1].losses - (a[1].wins + a[1].losses));
  }, [trades]);

  const marketRows = useMemo(() => trades.filter(isClosedMarketDeal), [trades]);
  const depositRows = useMemo(() => trades.filter((t) => t.flow_kind === "deposit"), [trades]);
  const withdrawalRows = useMemo(() => trades.filter((t) => t.flow_kind === "withdrawal"), [trades]);
  const ledgerRows = useMemo(
    () =>
      trades.filter((t) => t.flow_kind === "credit" || t.flow_kind === "adjustment"),
    [trades],
  );

  return (
    <div className="mx-auto max-w-[1400px] space-y-6">
      {(offline || cached) && (
        <p
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100"
        >
          {offline
            ? "You appear offline — showing the last saved trading snapshot from this device. Reconnect and re-open the page to refresh from the server."
            : "Loaded a cached snapshot."}
        </p>
      )}

      {sync && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-2">
            <CardTitle className="text-base font-medium">Account snapshot (MT5 bridge)</CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh
              </Button>
              <span>Last sync {formatWhen(sync.last_sync_at)}</span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-muted-foreground">Login / server</p>
              <p className="font-medium tabular-nums">
                {sync.account_login ?? "—"}
                {sync.account_server ? (
                  <span className="text-muted-foreground"> · {sync.account_server}</span>
                ) : null}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Balance</p>
              <p className="text-lg font-semibold tabular-nums">
                {sync.balance != null
                  ? formatCurrency(sync.balance, sync.account_currency ?? undefined)
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Equity</p>
              <p className="text-lg font-semibold tabular-nums">
                {sync.equity != null
                  ? formatCurrency(sync.equity, sync.account_currency ?? undefined)
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Margin</p>
              <p className="text-lg font-semibold tabular-nums">
                {sync.margin != null
                  ? formatCurrency(sync.margin, sync.account_currency ?? undefined)
                  : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-sm text-muted-foreground">
        MT5 does not talk to the browser directly. Run the Python bridge on your trading PC (
        <span className="font-mono text-xs">scripts/mt5_bridge_example.py</span>) with matching{" "}
        <span className="font-mono text-xs">MT5_INGEST_SECRET</span>. Deal history defaults from{" "}
        <span className="font-mono text-xs">2026-04-30</span> UTC via{" "}
        <span className="font-mono text-xs">MT5_HISTORY_FROM_ISO</span> /{" "}
        <span className="font-mono text-xs">MT5_INGEST_FROM_ISO</span> — the ingest API enforces the
        same cutoff. Loaded rows cap at 2,500; extend or paginate in Supabase if you need more.
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Win rate (closed markets)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats.closedMarketDealCount ? formatPercent(stats.winRate) : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Net trading P/L</CardTitle>
          </CardHeader>
          <CardContent
            className={`text-3xl font-semibold ${stats.netPnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {formatCurrency(stats.netPnl)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Profit factor</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats.profitFactor != null ? stats.profitFactor.toFixed(2) : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Avg R (where set)</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{avgRMultiple(trades)}</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Gross profit / loss</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 text-lg font-semibold tabular-nums">
            <span className="text-emerald-500">{formatCurrency(stats.grossProfit)}</span>
            <span className="text-rose-500">{formatCurrency(stats.grossLoss)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Loaded rows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-3xl font-semibold tabular-nums">{stats.tradeCount}</p>
            <p className="text-xs text-muted-foreground">
              Closed markets:{" "}
              <span className="font-medium text-foreground tabular-nums">
                {stats.closedMarketDealCount}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Deposits (sum)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-emerald-500 tabular-nums">
            {formatCurrency(stats.sumDeposits)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Withdrawals (sum)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-rose-500 tabular-nums">
            {formatCurrency(stats.sumWithdrawals)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Credits (sum)</CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-semibold tabular-nums ${stats.sumCredits >= 0 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {formatCurrency(stats.sumCredits)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Other adjustments</CardTitle>
          </CardHeader>
          <CardContent
            className={`text-2xl font-semibold tabular-nums ${stats.sumAdjustments >= 0 ? "text-emerald-500" : "text-rose-500"}`}
          >
            {formatCurrency(stats.sumAdjustments)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equity curve (realized market P/L)</CardTitle>
        </CardHeader>
        <CardContent>
          <TradingEquityChart data={equityCurve} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Edge by session tag</CardTitle>
        </CardHeader>
        <CardContent>
          {tagBuckets.length === 0 || (tagBuckets.length === 1 && tagBuckets[0][0] === "—") ? (
            <p className="text-sm text-muted-foreground">
              Tag setups on each row to map wins vs losses by strategy.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {tagBuckets.map(([label, v]) => (
                <li
                  key={label}
                  className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2"
                >
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">
                    <span className="text-emerald-500">{v.wins}W</span> ·{" "}
                    <span className="text-rose-500">{v.losses}L</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="markets">
        <TabsList className="flex flex-wrap gap-1">
          <TabsTrigger value="markets">Profit / loss</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="ledger">Credits & adjustments</TabsTrigger>
          <TabsTrigger value="mistakes">Mistake map</TabsTrigger>
        </TabsList>

        <TabsContent value="markets" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Dir</TableHead>
                  <TableHead>Volume</TableHead>
                  <TableHead>P/L</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Setup</TableHead>
                  <TableHead>R</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="py-12 text-center text-sm text-muted-foreground"
                    >
                      No closed market fills in this slice. Funding rows live under Deposits / Withdrawals — run
                      the MT5 bridge after the app migration applies <span className="font-mono text-xs">flow_kind</span>.
                    </TableCell>
                  </TableRow>
                ) : (
                  marketRows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatWhen(t.closed_at ?? t.opened_at)}
                      </TableCell>
                      <TableCell className="font-medium">{t.symbol}</TableCell>
                      <TableCell>
                        {t.direction ? (
                          <Badge variant={t.direction === "long" ? "default" : "secondary"}>
                            {t.direction}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="tabular-nums text-xs">
                        {t.volume_lots ?? t.size ?? "—"}
                      </TableCell>
                      <TableCell
                        className={`tabular-nums text-xs ${(t.pnl ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {t.pnl != null ? formatCurrency(t.pnl) : "—"}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-xs text-muted-foreground">
                        {[t.commission, t.swap]
                          .filter((x) => x != null && x !== 0)
                          .map((x) => formatCurrency(x as number))
                          .join(" · ") || "—"}
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate text-xs">
                        {t.strategy_tag ?? "—"}
                      </TableCell>
                      <TableCell className="tabular-nums text-xs">
                        {t.risk_reward != null ? t.risk_reward.toFixed(2) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {t.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Edit journal fields"
                          onClick={() => openEdit(t)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="deposits" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>MT5 comment</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {depositRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No deposit ledger rows synced yet — they map from MT5{" "}
                      <span className="font-mono text-xs">DEAL_TYPE_BALANCE</span> with positive wallet movement.
                    </TableCell>
                  </TableRow>
                ) : (
                  depositRows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatWhen(t.closed_at ?? t.opened_at)}
                      </TableCell>
                      <TableCell className="tabular-nums text-sm font-medium text-emerald-500">
                        {t.pnl != null ? formatCurrency(t.pnl) : "—"}
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate text-xs text-muted-foreground">
                        {t.deal_comment ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {t.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Edit journal fields"
                          onClick={() => openEdit(t)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="withdrawals" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>MT5 comment</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      No withdrawal ledger rows synced yet — they map from MT5 balance deals with negative wallet
                      movement.
                    </TableCell>
                  </TableRow>
                ) : (
                  withdrawalRows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatWhen(t.closed_at ?? t.opened_at)}
                      </TableCell>
                      <TableCell className="tabular-nums text-sm font-medium text-rose-500">
                        {t.pnl != null ? formatCurrency(t.pnl) : "—"}
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate text-xs text-muted-foreground">
                        {t.deal_comment ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {t.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Edit journal fields"
                          onClick={() => openEdit(t)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="ledger" className="mt-4">
          <div className="overflow-x-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Kind</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>MT5 comment</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="w-[70px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgerRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      No miscellaneous MT5 ledger rows yet (credits / broker adjustments / swaps-charges style
                      entries).
                    </TableCell>
                  </TableRow>
                ) : (
                  ledgerRows.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {formatWhen(t.closed_at ?? t.opened_at)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge
                          variant={
                            t.flow_kind === "credit"
                              ? "secondary"
                              : "outline"
                          }
                          className="text-[10px] capitalize"
                        >
                          {flowBadgeLabel(t)}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`tabular-nums text-sm font-medium ${(t.pnl ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {t.pnl != null ? formatCurrency(t.pnl) : "—"}
                      </TableCell>
                      <TableCell className="max-w-[320px] truncate text-xs text-muted-foreground">
                        {t.deal_comment ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {t.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Edit journal fields"
                          onClick={() => openEdit(t)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="mistakes" className="mt-4">
          {marketRows.some((t) => (t.emotional_state ?? "").trim()) ? (
            <div className="overflow-x-auto rounded-xl border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>State</TableHead>
                    <TableHead>Trades</TableHead>
                    <TableHead className="text-right">Net trading P/L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(
                    marketRows.reduce<Record<string, { n: number; pl: number }>>((acc, t) => {
                      const k = (t.emotional_state ?? "").trim() || "—";
                      if (!acc[k]) acc[k] = { n: 0, pl: 0 };
                      acc[k].n++;
                      acc[k].pl += t.pnl ?? 0;
                      return acc;
                    }, {}),
                  ).map(([state, v]) => (
                    <TableRow key={state}>
                      <TableCell>{state}</TableCell>
                      <TableCell>{v.n}</TableCell>
                      <TableCell
                        className={`text-right tabular-nums ${v.pl >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {formatCurrency(v.pl)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border/60 py-12 text-center text-sm text-muted-foreground">
              Tag emotional state on market fills (edit) to see mistake-style groupings — balance rows are excluded.
            </p>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Journal — {editing?.symbol}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-2">
              <Label htmlFor="tj-tag">Setup tag</Label>
              <Input
                id="tj-tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="Breakout, FVG, news…"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tj-mood">Emotional state / mistake tag</Label>
              <Input
                id="tj-mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="FOMO, moved stop, …"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tj-session">Session label</Label>
              <Input
                id="tj-session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                placeholder="London, NY…"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tj-note">Notes</Label>
              <Textarea
                id="tj-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Your narrative — MT5 deal comment is read-only here."
              />
            </div>
            {editing?.deal_comment ? (
              <p className="text-xs text-muted-foreground">
                MT5 comment: {editing.deal_comment}
              </p>
            ) : null}
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button type="button" disabled={saving} onClick={() => void saveEdit()}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
