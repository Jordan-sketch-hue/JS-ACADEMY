/** Pure trading types & metrics (safe for Client Components — no Supabase imports). */

export type TradeDirection = "long" | "short";

export type TradeFlowKind =
  | "market"
  | "deposit"
  | "withdrawal"
  | "credit"
  | "adjustment";

export type TradeRecord = {
  id: string;
  owner_clerk_id: string;
  symbol: string;
  direction: TradeDirection | null;
  entry_price: number | null;
  exit_price: number | null;
  size: number | null;
  pnl: number | null;
  risk_reward: number | null;
  strategy_tag: string | null;
  emotional_state: string | null;
  journal_note: string | null;
  screenshot_url: string | null;
  session_label: string | null;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  source: string;
  external_id: string | null;
  commission: number | null;
  swap: number | null;
  volume_lots: number | null;
  mt5_magic: number | null;
  deal_comment: string | null;
  flow_kind?: TradeFlowKind | null;
};

export type TradingSyncState = {
  owner_clerk_id: string;
  last_sync_at: string;
  last_deal_time: string | null;
  account_login: string | null;
  account_server: string | null;
  account_currency: string | null;
  balance: number | null;
  equity: number | null;
  margin: number | null;
  meta: Record<string, unknown>;
};

export type EquityCurvePoint = {
  label: string;
  cumulative: number;
  dealTime: string;
};

export type TradingStats = {
  tradeCount: number;
  closedMarketDealCount: number;
  netPnl: number;
  winRate: number;
  profitFactor: number | null;
  grossProfit: number;
  grossLoss: number;
  avgWin: number | null;
  avgLoss: number | null;
  sumDeposits: number;
  sumWithdrawals: number;
  sumCredits: number;
  sumAdjustments: number;
};

export type TradeListBundle = {
  trades: TradeRecord[];
  sync: TradingSyncState | null;
  stats: TradingStats;
  equityCurve: EquityCurvePoint[];
};

export function isClosedMarketDeal(t: Pick<TradeRecord, "flow_kind">): boolean {
  return !t.flow_kind || t.flow_kind === "market";
}

export function computeTradingStats(trades: TradeRecord[]): TradingStats {
  let sumDeposits = 0;
  let sumWithdrawals = 0;
  let sumCredits = 0;
  let sumAdjustments = 0;

  for (const t of trades) {
    const fk = t.flow_kind;
    const p = t.pnl;
    if (p == null || !Number.isFinite(p)) continue;
    if (!fk || fk === "market") continue;
    if (fk === "deposit") sumDeposits += p > 0 ? p : 0;
    else if (fk === "withdrawal") sumWithdrawals += p < 0 ? p : 0;
    else if (fk === "credit") sumCredits += p;
    else if (fk === "adjustment") sumAdjustments += p;
  }

  const markets = trades.filter((t) => isClosedMarketDeal(t));
  const withPnl = markets.filter((t) => t.pnl != null);
  const n = withPnl.length;
  if (!n) {
    return {
      tradeCount: trades.length,
      closedMarketDealCount: withPnl.length,
      netPnl: 0,
      winRate: 0,
      profitFactor: null,
      grossProfit: 0,
      grossLoss: 0,
      avgWin: null,
      avgLoss: null,
      sumDeposits,
      sumWithdrawals,
      sumCredits,
      sumAdjustments,
    };
  }
  let netPnl = 0;
  let wins = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let winSum = 0;
  let lossSum = 0;
  let winCount = 0;
  let lossCount = 0;
  for (const t of withPnl) {
    const p = t.pnl ?? 0;
    netPnl += p;
    if (p > 0) {
      wins++;
      grossProfit += p;
      winSum += p;
      winCount++;
    } else if (p < 0) {
      grossLoss += p;
      lossSum += p;
      lossCount++;
    }
  }
  const profitFactor =
    grossLoss !== 0 ? grossProfit / Math.abs(grossLoss) : grossProfit > 0 ? null : null;
  return {
    tradeCount: trades.length,
    closedMarketDealCount: withPnl.length,
    netPnl,
    winRate: wins / n,
    profitFactor: profitFactor != null && Number.isFinite(profitFactor) ? profitFactor : null,
    grossProfit,
    grossLoss,
    avgWin: winCount ? winSum / winCount : null,
    avgLoss: lossCount ? lossSum / lossCount : null,
    sumDeposits,
    sumWithdrawals,
    sumCredits,
    sumAdjustments,
  };
}

export function buildEquityCurve(trades: TradeRecord[]): EquityCurvePoint[] {
  const market = trades
    .filter((t) => isClosedMarketDeal(t) && t.pnl != null)
    .map((t) => ({
      ms: new Date((t.closed_at ?? t.opened_at) ?? 0).valueOf(),
      pnl: t.pnl ?? 0,
      iso: t.closed_at ?? t.opened_at,
    }))
    .filter((x) => Number.isFinite(x.ms));

  market.sort((a, b) => a.ms - b.ms);
  let cumulative = 0;
  const out: EquityCurvePoint[] = [];
  for (let i = 0; i < market.length; i++) {
    const m = market[i]!;
    cumulative += m.pnl;
    let label = new Date((m.iso ?? "") as string).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const prevIso = i > 0 ? market[i - 1]!.iso : null;
    if (
      prevIso &&
      new Date(String(prevIso)).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }) === label
    ) {
      label = new Date((m.iso ?? "") as string).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    out.push({ label, cumulative, dealTime: String(m.iso) });
  }
  return out;
}
