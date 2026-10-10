import { NextRequest } from "next/server";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { resolveDataOwnerIdSync } from "@/lib/session";

/**
 * MT5 → Supabase bridge endpoint.
 *
 * MetaTrader 5 has no browser API. Run a small script on the same PC/VPS as MT5
 * (see `scripts/mt5_bridge_example.py`) that reads deal history and POSTs here.
 *
 * Headers: `Authorization: Bearer <MT5_INGEST_SECRET>`
 * Body: `{ "deals": [...], "account"?: { ... } }` — include `account` on the last
 * chunk of a batched upload so `trading_sync_state` updates once with full deal times.
 *
 * Env (Vercel / local):
 * - MT5_INGEST_SECRET — shared secret for the bridge
 * - MT5_INGEST_FROM_ISO or MT5_HISTORY_FROM_ISO — optional UTC cutoff (default
 *   `2026-04-30T00:00:00.000Z`); deals strictly before this are skipped.
 * - Trades use the same owner id as the rest of the app: `OS_OWNER_ID`,
 *   `NO_CLERK_OWNER_ID`, or the built-in default (see `src/lib/session.ts`).
 */
const DEAL_TYPE_BUY = 0;
const DEAL_TYPE_SELL = 1;
const DEAL_TYPE_BALANCE = 2;
const DEAL_TYPE_CREDIT = 3;
const DEAL_TYPE_CHARGE = 4;
const DEAL_TYPE_CORRECTION = 5;
const DEAL_TYPE_BONUS = 6;
/** Single commission adjustment on a closed position (often mirrored from position deal). */
const DEAL_TYPE_COMMISSION = 7;
const DEAL_TYPE_COMMISSION_DAILY = 8;
const DEAL_TYPE_COMMISSION_MONTHLY = 9;
const DEAL_TYPE_AGENT_DAILY = 10;
const DEAL_TYPE_AGENT_MONTHLY = 11;
const DEAL_TYPE_INTERESTRATE = 12;
const DEAL_TYPE_BUY_CANCELED = 13;
const DEAL_TYPE_SELL_CANCELED = 14;

const DEFAULT_INGEST_FROM = "2026-04-30T00:00:00.000Z";
const BALANCE_SYMBOL_PLACEHOLDER = "(balance)";

type Mt5FlowKind =
  | "market"
  | "deposit"
  | "withdrawal"
  | "credit"
  | "adjustment";

function parseIngestCutoffUtc(): Date {
  const raw =
    process.env.MT5_INGEST_FROM_ISO?.trim() || process.env.MT5_HISTORY_FROM_ISO?.trim();
  if (!raw) return new Date(DEFAULT_INGEST_FROM);
  const d = new Date(raw);
  return Number.isFinite(d.valueOf()) ? d : new Date(DEFAULT_INGEST_FROM);
}

function directionFromDealType(type: number): "long" | "short" | null {
  if (type === DEAL_TYPE_BUY || type === DEAL_TYPE_BUY_CANCELED) return "long";
  if (type === DEAL_TYPE_SELL || type === DEAL_TYPE_SELL_CANCELED) return "short";
  return null;
}

function classifyDeal(
  dealType: number,
  profit: number,
  mt5Symbol: string,
): { flow_kind: Mt5FlowKind; direction: "long" | "short" | null; symbolFallback: string } {
  switch (dealType) {
    case DEAL_TYPE_BUY:
    case DEAL_TYPE_SELL:
    case DEAL_TYPE_BUY_CANCELED:
    case DEAL_TYPE_SELL_CANCELED: {
      const dir = directionFromDealType(dealType);
      return { flow_kind: "market", direction: dir, symbolFallback: "" };
    }
    case DEAL_TYPE_BALANCE: {
      if (profit > 0)
        return { flow_kind: "deposit", direction: null, symbolFallback: BALANCE_SYMBOL_PLACEHOLDER };
      if (profit < 0)
        return {
          flow_kind: "withdrawal",
          direction: null,
          symbolFallback: BALANCE_SYMBOL_PLACEHOLDER,
        };
      return {
        flow_kind: "adjustment",
        direction: null,
        symbolFallback: BALANCE_SYMBOL_PLACEHOLDER,
      };
    }
    case DEAL_TYPE_CREDIT:
      return {
        flow_kind: "credit",
        direction: null,
        symbolFallback: mt5Symbol.trim() || BALANCE_SYMBOL_PLACEHOLDER,
      };
    case DEAL_TYPE_BONUS:
      if (profit > 0)
        return { flow_kind: "deposit", direction: null, symbolFallback: BALANCE_SYMBOL_PLACEHOLDER };
      if (profit < 0)
        return {
          flow_kind: "withdrawal",
          direction: null,
          symbolFallback: BALANCE_SYMBOL_PLACEHOLDER,
        };
      return {
        flow_kind: "adjustment",
        direction: null,
        symbolFallback: BALANCE_SYMBOL_PLACEHOLDER,
      };
    case DEAL_TYPE_CHARGE:
    case DEAL_TYPE_CORRECTION:
    case DEAL_TYPE_COMMISSION:
    case DEAL_TYPE_COMMISSION_DAILY:
    case DEAL_TYPE_COMMISSION_MONTHLY:
    case DEAL_TYPE_AGENT_DAILY:
    case DEAL_TYPE_AGENT_MONTHLY:
    case DEAL_TYPE_INTERESTRATE:
    default:
      return {
        flow_kind: "adjustment",
        direction: null,
        symbolFallback: mt5Symbol.trim() || BALANCE_SYMBOL_PLACEHOLDER,
      };
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.MT5_INGEST_SECRET?.trim();
  if (!secret) {
    return Response.json(
      {
        ok: false,
        error:
          "Server not configured: set MT5_INGEST_SECRET. Owner id matches the app (OS_OWNER_ID / NO_CLERK_OWNER_ID / default).",
      },
      { status: 501 },
    );
  }

  const ownerId = resolveDataOwnerIdSync();
  const ingestNotBefore = parseIngestCutoffUtc();

  const auth = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "")
    .trim();
  if (auth !== secret) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ ok: false, error: "Expected JSON object" }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;
  const deals = payload.deals;
  if (!Array.isArray(deals) || deals.length === 0) {
    return Response.json(
      { ok: false, error: 'Body must include non-empty "deals" array' },
      { status: 400 },
    );
  }

  const accountRaw =
    payload.account && typeof payload.account === "object"
      ? (payload.account as Record<string, unknown>)
      : null;

  const sb = getServiceSupabase();
  if (!sb) {
    return Response.json(
      { ok: false, error: "Supabase is not configured on the server." },
      { status: 503 },
    );
  }

  let upserted = 0;
  let skipped = 0;

  for (const raw of deals) {
    if (!raw || typeof raw !== "object") {
      skipped++;
      continue;
    }
    const d = raw as Record<string, unknown>;
    const ticket = typeof d.ticket === "number" ? d.ticket : Number(d.ticket);
    if (!Number.isFinite(ticket)) {
      skipped++;
      continue;
    }

    const type = typeof d.type === "number" ? d.type : Number(d.type);
    if (!Number.isFinite(type)) {
      skipped++;
      continue;
    }

    const profitRaw = typeof d.profit === "number" ? d.profit : Number(d.profit);
    const mt5Sym = String(d.symbol ?? "").trim();
    const classified = classifyDeal(
      Math.trunc(type),
      Number.isFinite(profitRaw) ? profitRaw : 0,
      mt5Sym,
    );

    let symbol = mt5Sym || classified.symbolFallback;
    if (!symbol && classified.flow_kind === "market") {
      skipped++;
      continue;
    }

    const volume = typeof d.volume === "number" ? d.volume : Number(d.volume);
    const price = typeof d.price === "number" ? d.price : Number(d.price);
    const commission = d.commission != null ? Number(d.commission) : null;
    const swap = d.swap != null ? Number(d.swap) : null;
    const timeRaw = d.time;
    const openedAt =
      typeof timeRaw === "string" && timeRaw.trim()
        ? new Date(timeRaw).toISOString()
        : new Date().toISOString();

    if (Number.isFinite(new Date(openedAt).valueOf())) {
      if (new Date(openedAt).getTime() < ingestNotBefore.getTime()) {
        skipped++;
        continue;
      }
    }

    const external_id = `mt5:${ticket}`;
    const comment = d.comment != null ? String(d.comment).slice(0, 2000) : null;
    const magic = d.magic != null ? Number(d.magic) : null;

    const direction = classified.direction;
    const volumeForRow =
      classified.flow_kind === "market" && Number.isFinite(volume) ? volume : null;
    const priceForRow =
      classified.flow_kind === "market" && Number.isFinite(price) ? price : null;

    const row = {
      owner_clerk_id: ownerId,
      symbol,
      direction,
      entry_price: priceForRow,
      exit_price: priceForRow,
      size: volumeForRow,
      volume_lots: volumeForRow,
      pnl: Number.isFinite(profitRaw) ? profitRaw : null,
      commission:
        commission != null && Number.isFinite(commission) ? commission : null,
      swap: swap != null && Number.isFinite(swap) ? swap : null,
      opened_at: openedAt,
      closed_at: openedAt,
      source: "mt5",
      external_id,
      flow_kind: classified.flow_kind,
      deal_comment: comment,
      mt5_magic:
        classified.flow_kind === "market" && magic != null && Number.isFinite(magic)
          ? Math.trunc(magic)
          : null,
    };

    const { data: existing } = await sb
      .from("trades")
      .select("id")
      .eq("owner_clerk_id", ownerId)
      .eq("external_id", external_id)
      .maybeSingle();

    if (existing?.id) {
      const { error } = await sb
        .from("trades")
        .update(row)
        .eq("id", existing.id as string);
      if (error) {
        return Response.json({ ok: false, error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await sb.from("trades").insert(row);
      if (error) {
        return Response.json({ ok: false, error: error.message }, { status: 500 });
      }
    }
    upserted++;
  }

  if (accountRaw) {
    const syncRow: Record<string, unknown> = {
      owner_clerk_id: ownerId,
      last_sync_at: new Date().toISOString(),
      account_login: accountRaw?.login != null ? String(accountRaw.login) : null,
      account_server: accountRaw?.server != null ? String(accountRaw.server) : null,
      account_currency:
        accountRaw?.currency != null ? String(accountRaw.currency) : null,
      balance: accountRaw?.balance != null ? Number(accountRaw.balance) : null,
      equity: accountRaw?.equity != null ? Number(accountRaw.equity) : null,
      margin: accountRaw?.margin != null ? Number(accountRaw.margin) : null,
      meta: {},
    };

    const times = deals
      .map((x) =>
        x && typeof x === "object" ? (x as Record<string, unknown>).time : null,
      )
      .filter((t): t is string => typeof t === "string" && !!t);
    if (times.length) {
      const sorted = [...times].sort();
      syncRow.last_deal_time = new Date(sorted[sorted.length - 1]!).toISOString();
    } else {
      syncRow.last_deal_time = null;
    }

    const { error: syncErr } = await sb
      .from("trading_sync_state")
      .upsert(syncRow, { onConflict: "owner_clerk_id" });

    if (syncErr) {
      return Response.json({ ok: false, error: syncErr.message }, { status: 500 });
    }
  }

  return Response.json({
    ok: true,
    upserted,
    skipped,
    owner_clerk_id: ownerId,
    ingest_from_utc: ingestNotBefore.toISOString(),
  });
}
