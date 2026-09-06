"""The live demo trading loop. Hard-locked to demo accounts via mt5_client.connect()."""
from __future__ import annotations

import json
import logging
import os
import time
import urllib.request

from . import mt5_client as mc
from .indicators import atr
from .position_manager import PositionState, plan_management
from .risk import DayGuard, position_size
from .signals import generate_signal, htf_bias, meanrev_signal
from .structure import analyze_structure

log = logging.getLogger("smcbot")

# ── Structural history logger + Deriv fusion webhook ─────────────────────────
_HISTORY_PATH  = os.path.join(os.path.dirname(__file__), "..", "structural_history.jsonl")
_FUSION_URL    = os.environ.get("DERIV_BOT_URL", "").rstrip("/") + "/api/fusion/structure"
_SWING_N       = 3  # swing confirmation candles each side


def _push_structure(symbol: str, bias: str, score: int, htf_count: int, accu_suppressed: bool) -> None:
    """Log structural state to JSONL and push to the Deriv bot fusion endpoint."""
    record = {
        "sym": symbol, "bias": bias, "score": score,
        "htf_agree_count": htf_count, "accumulation_suppressed": accu_suppressed,
        "ts": int(time.time()),
    }
    try:
        with open(_HISTORY_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")
    except OSError:
        pass

    if not _FUSION_URL or _FUSION_URL.endswith("/api/fusion/structure"):
        return  # DERIV_BOT_URL not configured — skip HTTP push
    try:
        data = json.dumps(record).encode()
        req  = urllib.request.Request(_FUSION_URL, data=data,
                                      headers={"Content-Type": "application/json"})
        urllib.request.urlopen(req, timeout=3)
    except Exception as exc:
        log.debug("Fusion push failed for %s: %s", symbol, exc)


def _structural_state(frames: dict, cfg: dict, symbol: str) -> dict:
    """Derive structural state dict for one symbol from the current frame data."""
    htf_frames = {tf: df for tf, df in frames.items()
                  if tf in cfg["timeframes"].get("htf", [])}
    mtf_frames  = {tf: df for tf, df in frames.items()
                   if tf in cfg["timeframes"].get("mtf", [])}

    # HTF bias via confluence count
    htf_biases = [analyze_structure(df, _SWING_N).trend for df in htf_frames.values()]
    ups   = htf_biases.count("up")
    downs = htf_biases.count("down")
    total = len(htf_biases)
    if ups > downs:
        bias      = "bullish"
        htf_count = ups
    elif downs > ups:
        bias      = "bearish"
        htf_count = downs
    else:
        bias      = "neutral"
        htf_count = 0

    # Confidence score 0–100 (proportion of HTFs aligned)
    score = int((max(ups, downs) / total) * 100) if total else 0

    # accumulation_suppressed: True when MTF shows impulse (large body trending candle)
    accu_suppressed = False
    for df in mtf_frames.values():
        if df is None or len(df) < 2:
            continue
        last  = df.iloc[-1]
        body  = abs(last["close"] - last["open"])
        candle_range = last["high"] - last["low"]
        if candle_range > 0 and body / candle_range > 0.7:
            accu_suppressed = True
            break

    return {"bias": bias, "score": score, "htf_count": htf_count, "accu_suppressed": accu_suppressed}


def _manage_open_positions(symbol, cfg, states, atr_value):
    """Apply partial TPs, breakeven and trailing to our open positions."""
    positions = mc.open_positions(symbol, cfg["magic"])
    live = set()
    for pos in positions:
        live.add(pos.ticket)
        st = states.get(pos.ticket)
        if st is None:
            side = "buy" if pos.type == mc.mt5.POSITION_TYPE_BUY else "sell"
            st = PositionState(entry=pos.price_open, risk=abs(pos.price_open - pos.sl),
                               side=side, orig_volume=pos.volume)
            states[pos.ticket] = st
        if st.risk <= 0:
            continue   # can't size R (no/odd initial stop) — leave broker SL/TP to run

        tick = mc.mt5.symbol_info_tick(symbol)
        price = tick.bid if st.side == "buy" else tick.ask
        plan = plan_management(st, price, atr_value, cfg)

        if plan.partial_volume > 0 and not st.partial_done:
            res = mc.partial_close(pos, plan.partial_volume, cfg["magic"])
            if res is not None and res.retcode == mc.mt5.TRADE_RETCODE_DONE:
                st.partial_done = True
                log.info("Partial TP: closed %.4f of #%s at +%.2fR",
                         plan.partial_volume, pos.ticket, plan.r_now)

        if plan.new_sl is not None:
            better = (plan.new_sl > pos.sl + 1e-9) if st.side == "buy" \
                else (plan.new_sl < pos.sl - 1e-9)
            if better:
                res = mc.modify_sl(pos, plan.new_sl)
                if res is not None and res.retcode == mc.mt5.TRADE_RETCODE_DONE:
                    log.info("Stop -> %.2f on #%s (+%.2fR%s)", plan.new_sl, pos.ticket,
                             plan.r_now, ", breakeven+" if plan.r_now >= 1 else "")

    for ticket in [t for t in states if t not in live]:
        del states[ticket]
    return len(positions)


def run(cfg: dict) -> None:
    acct = mc.connect(allow_contest=cfg.get("allow_contest_accounts", False))
    log.info(
        "Connected: %s account %s @ %s | balance %.2f %s",
        "DEMO" if acct.is_demo else "CONTEST",
        acct.login, acct.server, acct.balance, acct.currency,
    )

    wanted = cfg.get("symbols") or [cfg["symbol"]]
    symbols = []
    for s in wanted:
        try:
            symbols.append(mc.ensure_symbol(s))
        except Exception as exc:           # noqa: BLE001 - skip any symbol this broker lacks
            log.warning("Skipping symbol '%s': %s", s, exc)
    if not symbols:
        raise RuntimeError("No tradeable symbols resolved.")
    log.info("Trading symbols: %s", ", ".join(symbols))

    guard = DayGuard(acct.balance, cfg["max_daily_loss_pct"], cfg["max_trades_per_day"])
    all_tfs = sorted(set(sum(cfg["timeframes"].values(), [])))
    mtf_tf = cfg["timeframes"]["mtf"][0]
    states: dict = {}

    sigfn = meanrev_signal if cfg.get("strategy") == "meanrev" else generate_signal
    manage = cfg.get("manage_exits", True)
    log.info("Strategy: %s | manage_exits: %s", cfg.get("strategy", "smc"), manage)

    log.info("Bot live. Ctrl+C to stop. Scanning every %ss.", cfg["poll_seconds"])
    try:
        while True:
            balance = mc.mt5.account_info().balance
            ok, why = guard.can_trade(balance)
            if not ok:
                log.warning("Halting for the day: %s", why)
                break

            for symbol in symbols:
                try:
                    frames = {tf: mc.get_rates(symbol, tf, 500) for tf in all_tfs}
                except Exception as exc:    # noqa: BLE001 - transient data hiccup, try next
                    log.warning("Data fetch failed for %s: %s", symbol, exc)
                    continue
                if manage:
                    atr_value = float(atr(frames[mtf_tf]).iloc[-1])
                    n_open = _manage_open_positions(symbol, cfg, states, atr_value)
                else:
                    # mean-reversion uses fixed TP(mean)/SL on the order — no trailing
                    n_open = len(mc.open_positions(symbol, cfg["magic"]))
                if n_open >= cfg["max_open_trades"]:
                    continue

                # Structural state — log + push to Deriv fusion gate every poll
                st = _structural_state(frames, cfg, symbol)
                _push_structure(symbol, st["bias"], st["score"], st["htf_count"], st["accu_suppressed"])

                sig = sigfn(frames, cfg)
                if sig is None:
                    continue

                vol = position_size(symbol, balance, cfg["risk_per_trade_pct"], sig.entry, sig.sl)
                if vol <= 0:
                    log.info("%s signal skipped — risk-sized volume rounded to 0.", symbol)
                    continue

                log.info("SIGNAL %s %s vol=%s entry=%.2f sl=%.2f tp=%.2f | %s",
                         sig.side.upper(), symbol, vol, sig.entry, sig.sl, sig.tp, sig.reason)
                res = mc.market_order(symbol, sig.side, vol, sig.sl, sig.tp, cfg["magic"])
                if res is None or res.retcode != mc.mt5.TRADE_RETCODE_DONE:
                    log.error("%s order rejected: %s", symbol, res)
                else:
                    guard.trades_today += 1
                    log.info("FILLED %s #%s @ %.2f (trade %d/%d today)", symbol, res.order,
                             res.price, guard.trades_today, cfg["max_trades_per_day"])

            time.sleep(cfg["poll_seconds"])
    except KeyboardInterrupt:
        log.info("Stopped by user (open positions keep their SL/TP).")
    finally:
        mc.shutdown()
