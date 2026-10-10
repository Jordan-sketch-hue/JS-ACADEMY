import { getServiceSupabase } from "@/lib/supabase/admin";

import type {
  TradeDirection,
  TradeFlowKind,
  TradeListBundle,
  TradeRecord,
  TradingSyncState,
} from "@/lib/data/trading-metrics";
export type {
  EquityCurvePoint,
  TradeDirection,
  TradeFlowKind,
  TradeListBundle,
  TradeRecord,
  TradingStats,
  TradingSyncState,
} from "@/lib/data/trading-metrics";
export {
  buildEquityCurve,
  computeTradingStats,
  isClosedMarketDeal,
} from "@/lib/data/trading-metrics";

import {
  buildEquityCurve,
  computeTradingStats,
} from "@/lib/data/trading-metrics";

function num(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseFlowKind(row: Record<string, unknown>): TradeFlowKind | null {
  const k = row.flow_kind;
  if (k == null || k === "") return null;
  const s = String(k);
  if (
    s === "market" ||
    s === "deposit" ||
    s === "withdrawal" ||
    s === "credit" ||
    s === "adjustment"
  )
    return s as TradeFlowKind;
  return null;
}

function mapTradeRow(row: Record<string, unknown>): TradeRecord {
  const fk = parseFlowKind(row);
  let direction: TradeDirection | null = null;
  if (!fk || fk === "market") {
    direction = row.direction === "short" ? "short" : "long";
  }
  return {
    id: String(row.id),
    owner_clerk_id: String(row.owner_clerk_id),
    symbol: row.symbol != null ? String(row.symbol) : "",
    direction,
    entry_price: num(row.entry_price),
    exit_price: num(row.exit_price),
    size: num(row.size),
    pnl: num(row.pnl),
    risk_reward: num(row.risk_reward),
    strategy_tag: row.strategy_tag != null ? String(row.strategy_tag) : null,
    emotional_state:
      row.emotional_state != null ? String(row.emotional_state) : null,
    journal_note: row.journal_note != null ? String(row.journal_note) : null,
    screenshot_url:
      row.screenshot_url != null ? String(row.screenshot_url) : null,
    session_label:
      row.session_label != null ? String(row.session_label) : null,
    opened_at: String(row.opened_at),
    closed_at: row.closed_at != null ? String(row.closed_at) : null,
    created_at: String(row.created_at),
    source: row.source != null ? String(row.source) : "manual",
    external_id: row.external_id != null ? String(row.external_id) : null,
    commission: num(row.commission),
    swap: num(row.swap),
    volume_lots: num(row.volume_lots),
    mt5_magic: row.mt5_magic != null ? Number(row.mt5_magic) : null,
    deal_comment: row.deal_comment != null ? String(row.deal_comment) : null,
    flow_kind: fk,
  };
}

const SELECT_TRADES =
  "id,owner_clerk_id,symbol,direction,flow_kind,entry_price,exit_price,size,pnl,risk_reward,strategy_tag,emotional_state,journal_note,screenshot_url,session_label,opened_at,closed_at,created_at,source,external_id,commission,swap,volume_lots,mt5_magic,deal_comment";

export async function listTradesWithSync(
  ownerClerkId: string,
  limit = 2500,
): Promise<TradeListBundle> {
  const sb = getServiceSupabase();
  if (!sb) {
    return {
      trades: [],
      sync: null,
      stats: computeTradingStats([]),
      equityCurve: [],
    };
  }
  try {
    const [tradesRes, syncRes] = await Promise.all([
      sb
        .from("trades")
        .select(SELECT_TRADES)
        .eq("owner_clerk_id", ownerClerkId)
        .order("opened_at", { ascending: false })
        .limit(limit),
      sb
        .from("trading_sync_state")
        .select("*")
        .eq("owner_clerk_id", ownerClerkId)
        .maybeSingle(),
    ]);

    const trades = (tradesRes.data ?? []).map((r) =>
      mapTradeRow(r as Record<string, unknown>),
    );
    let sync: TradingSyncState | null = null;
    if (syncRes.data) {
      const s = syncRes.data as Record<string, unknown>;
      sync = {
        owner_clerk_id: String(s.owner_clerk_id),
        last_sync_at: String(s.last_sync_at),
        last_deal_time: s.last_deal_time != null ? String(s.last_deal_time) : null,
        account_login: s.account_login != null ? String(s.account_login) : null,
        account_server: s.account_server != null ? String(s.account_server) : null,
        account_currency:
          s.account_currency != null ? String(s.account_currency) : null,
        balance: num(s.balance),
        equity: num(s.equity),
        margin: num(s.margin),
        meta:
          s.meta && typeof s.meta === "object" && !Array.isArray(s.meta)
            ? (s.meta as Record<string, unknown>)
            : {},
      };
    }
    const stats = computeTradingStats(trades);
    return {
      trades,
      sync,
      stats,
      equityCurve: buildEquityCurve(trades),
    };
  } catch {
    return {
      trades: [],
      sync: null,
      stats: computeTradingStats([]),
      equityCurve: [],
    };
  }
}

export async function updateTradeJournal(
  ownerClerkId: string,
  tradeId: string,
  patch: {
    strategy_tag?: string | null;
    emotional_state?: string | null;
    journal_note?: string | null;
    session_label?: string | null;
  },
): Promise<{ ok: true } | { ok: false; error: string }> {
  const sb = getServiceSupabase();
  if (!sb) return { ok: false, error: "Supabase is not configured." };
  const row: Record<string, string | null> = {};
  if (patch.strategy_tag !== undefined) row.strategy_tag = patch.strategy_tag;
  if (patch.emotional_state !== undefined)
    row.emotional_state = patch.emotional_state;
  if (patch.journal_note !== undefined) row.journal_note = patch.journal_note;
  if (patch.session_label !== undefined) row.session_label = patch.session_label;
  if (!Object.keys(row).length) return { ok: true };

  const { error } = await sb
    .from("trades")
    .update(row)
    .eq("id", tradeId)
    .eq("owner_clerk_id", ownerClerkId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
