"use client";

import { useEffect, useRef, useState } from "react";
import { create } from "zustand";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AlertTriangle, Bot, ExternalLink, TrendingUp, Zap } from "lucide-react";

// ─── Deriv WebSocket ──────────────────────────────────────────────────────────

// app_id=36544 is Deriv's public API Explorer — accepts any valid PAT token
const WS_URL = "wss://ws.binaryws.com/websockets/v3?app_id=36544";

class DerivClient {
  private ws: WebSocket | null = null;
  private listeners = new Map<string, Set<(d: any) => void>>();
  private reqListeners = new Map<number, (d: any) => void>();
  private reqId = 1;
  private _token: string | null = null;
  connected = false;
  authorized = false;

  connect(token: string): Promise<any> {
    this._token = token;
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return reject("SSR");
      this.ws = new WebSocket(WS_URL);
      this.ws.onopen = () => {
        this.connected = true;
        this.send({ authorize: token }).then(resolve).catch(reject);
      };
      this.ws.onmessage = (e) => {
        const data = JSON.parse(e.data as string);
        const id: number = data.req_id;
        if (id && this.reqListeners.has(id)) {
          this.reqListeners.get(id)!(data);
          this.reqListeners.delete(id);
        }
        const type: string = data.msg_type;
        if (type) this.listeners.get(type)?.forEach((fn) => fn(data));
        if (type === "authorize") this.authorized = !data.error;
      };
      this.ws.onclose = () => {
        this.connected = false;
        this.authorized = false;
      };
      this.ws.onerror = (e) => reject(e);
    });
  }

  send(payload: object): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN)
        return reject(new Error("Not connected"));
      const id = this.reqId++;
      this.ws.send(JSON.stringify({ ...payload, req_id: id }));
      this.reqListeners.set(id, (d) => (d.error ? reject(d.error) : resolve(d)));
      setTimeout(() => {
        if (this.reqListeners.has(id)) {
          this.reqListeners.delete(id);
          reject(new Error("Timeout"));
        }
      }, 15000);
    });
  }

  on(type: string, fn: (d: any) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
    return () => this.listeners.get(type)?.delete(fn);
  }

  disconnect() {
    this._token = null;
    this.ws?.close();
  }
}

const derivClient = new DerivClient();

// ─── Store ────────────────────────────────────────────────────────────────────

interface TradeEntry {
  id: number;
  type: string;
  stake: number;
  pnl: number | null;
  status: "open" | "won" | "lost";
  time: number;
}

interface TDStore {
  token: string;
  connected: boolean;
  authorized: boolean;
  account: { loginid: string; balance: number; currency: string; is_virtual: boolean } | null;
  ticks: { time: number; price: number }[];
  digits: number[];
  trades: TradeEntry[];
  accuRunning: boolean;
  rfRunning: boolean;
  digitsRunning: boolean;
  consLosses: { accu: number; rf: number; digits: number };
  setToken: (t: string) => void;
  setConnected: (v: boolean) => void;
  setAuthorized: (v: boolean) => void;
  setAccount: (a: TDStore["account"]) => void;
  updateBalance: (b: number) => void;
  addTick: (time: number, price: number) => void;
  addTrade: (t: TradeEntry) => void;
  updateTrade: (id: number, u: Partial<TradeEntry>) => void;
  setAccuRunning: (v: boolean) => void;
  setRfRunning: (v: boolean) => void;
  setDigitsRunning: (v: boolean) => void;
  incLoss: (b: keyof TDStore["consLosses"]) => void;
  resetLoss: (b: keyof TDStore["consLosses"]) => void;
}

const useStore = create<TDStore>((set) => ({
  token: "",
  connected: false,
  authorized: false,
  account: null,
  ticks: [],
  digits: [],
  trades: [],
  accuRunning: false,
  rfRunning: false,
  digitsRunning: false,
  consLosses: { accu: 0, rf: 0, digits: 0 },
  setToken: (token) => set({ token }),
  setConnected: (connected) => set({ connected }),
  setAuthorized: (authorized) => set({ authorized }),
  setAccount: (account) => set({ account }),
  updateBalance: (balance) =>
    set((s) => (s.account ? { account: { ...s.account, balance } } : {})),
  addTick: (time, price) =>
    set((s) => ({
      ticks: [...s.ticks.slice(-300), { time, price }],
      digits: [...s.digits.slice(-50), parseInt(price.toFixed(2).slice(-1))],
    })),
  addTrade: (t) => set((s) => ({ trades: [t, ...s.trades.slice(0, 99)] })),
  updateTrade: (id, u) =>
    set((s) => ({ trades: s.trades.map((t) => (t.id === id ? { ...t, ...u } : t)) })),
  setAccuRunning: (accuRunning) => set({ accuRunning }),
  setRfRunning: (rfRunning) => set({ rfRunning }),
  setDigitsRunning: (digitsRunning) => set({ digitsRunning }),
  incLoss: (b) => set((s) => ({ consLosses: { ...s.consLosses, [b]: s.consLosses[b] + 1 } })),
  resetLoss: (b) => set((s) => ({ consLosses: { ...s.consLosses, [b]: 0 } })),
}));

// ─── Tick chart ───────────────────────────────────────────────────────────────

function TickChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ticks = useStore((s) => s.ticks);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || ticks.length < 2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = devicePixelRatio;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth,
      h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    const prices = ticks.map((t) => t.price);
    const min = Math.min(...prices),
      max = Math.max(...prices);
    const range = max - min || 1;
    const pad = { t: 16, b: 24, l: 56, r: 12 };
    const cw = w - pad.l - pad.r,
      ch = h - pad.t - pad.b;
    const tx = (i: number) => pad.l + (i / (ticks.length - 1)) * cw;
    const ty = (p: number) => pad.t + (1 - (p - min) / range) * ch;
    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = pad.t + (i / 3) * ch;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "9px monospace";
      ctx.fillText((max - (i / 3) * range).toFixed(2), 2, y + 3);
    }
    // area
    const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
    grad.addColorStop(0, "rgba(201,168,76,0.18)");
    grad.addColorStop(1, "rgba(201,168,76,0)");
    ctx.beginPath();
    ctx.moveTo(tx(0), ty(ticks[0].price));
    ticks.forEach((t, i) => ctx.lineTo(tx(i), ty(t.price)));
    ctx.lineTo(tx(ticks.length - 1), pad.t + ch);
    ctx.lineTo(tx(0), pad.t + ch);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    // line
    ctx.beginPath();
    ctx.moveTo(tx(0), ty(ticks[0].price));
    ticks.forEach((t, i) => ctx.lineTo(tx(i), ty(t.price)));
    ctx.strokeStyle = "#c9a84c";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // dot + label
    const lx = tx(ticks.length - 1),
      ly = ty(ticks[ticks.length - 1].price);
    ctx.beginPath();
    ctx.arc(lx, ly, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#c9a84c";
    ctx.fill();
    ctx.fillStyle = "#c9a84c";
    ctx.font = "bold 10px monospace";
    ctx.fillText(ticks[ticks.length - 1].price.toFixed(2), lx - 22, ly - 8);
  }, [ticks]);

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
      {ticks.length < 2 && (
        <p className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Waiting for ticks…
        </p>
      )}
    </div>
  );
}

// ─── Accumulator bot panel ────────────────────────────────────────────────────

function AccumulatorPanel() {
  const s = useStore();
  const [growthRate, setGrowthRate] = useState(2);
  const [stake, setStake] = useState(1);
  const [target, setTarget] = useState(30);
  const [maxHits, setMaxHits] = useState(2);
  const [status, setStatus] = useState("Idle");
  const [liveP, setLiveP] = useState(0);
  const activeId = useRef<number | null>(null);

  async function runCycle() {
    const st = useStore.getState();
    if (!st.accuRunning) return;
    if (st.consLosses.accu >= maxHits) {
      setStatus(`⛔ Paused — ${st.consLosses.accu} barrier hits`);
      s.setAccuRunning(false);
      return;
    }
    try {
      setStatus("Getting proposal…");
      const prop = await derivClient.send({
        proposal: 1,
        contract_type: "ACCU",
        symbol: "R_75",
        amount: stake,
        basis: "stake",
        growth_rate: growthRate / 100,
        currency: "USD",
      });
      if (prop.error) throw prop.error;
      const buy = await derivClient.send({ buy: prop.proposal.id, price: stake });
      if (buy.error) throw buy.error;
      const cid: number = buy.buy.contract_id;
      activeId.current = cid;
      s.addTrade({ id: cid, type: "ACCU", stake, pnl: null, status: "open", time: Date.now() });
      setStatus(`Running #${cid}`);
      let sold = false;
      const off = derivClient.on("proposal_open_contract", async (data: any) => {
        const c = data.proposal_open_contract;
        if (!c || c.contract_id !== cid) return;
        const profit = parseFloat(c.profit) || 0;
        const pct = (profit / stake) * 100;
        setLiveP(profit);
        if ((c.status === "lost" || !c.is_valid_to_sell) && !sold) {
          sold = true;
          off();
          activeId.current = null;
          s.updateTrade(cid, { pnl: profit, status: "lost" });
          s.incLoss("accu");
          setLiveP(0);
          setStatus(`Barrier hit — $${Math.abs(profit).toFixed(2)} loss`);
          setTimeout(() => useStore.getState().accuRunning && runCycle(), 2000);
        } else if (pct >= target && !sold && c.is_valid_to_sell) {
          sold = true;
          off();
          activeId.current = null;
          await derivClient.send({ sell: cid, price: 0 }).catch(() => {});
          s.updateTrade(cid, { pnl: profit, status: "won" });
          s.resetLoss("accu");
          setLiveP(0);
          setStatus(`✓ Sold +${pct.toFixed(1)}% — $${profit.toFixed(2)}`);
          setTimeout(() => useStore.getState().accuRunning && runCycle(), 1500);
        }
      });
      await derivClient.send({ proposal_open_contract: 1, contract_id: cid, subscribe: 1 });
    } catch (e: any) {
      setStatus(`Error: ${e?.message ?? "Unknown"}`);
      s.setAccuRunning(false);
    }
  }

  function stop() {
    s.setAccuRunning(false);
    if (activeId.current) derivClient.send({ sell: activeId.current, price: 0 }).catch(() => {});
    activeId.current = null;
    setLiveP(0);
    setStatus("Stopped");
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Growth Rate</Label>
          <Select
            value={String(growthRate)}
            onValueChange={(v) => setGrowthRate(Number(v))}
            disabled={s.accuRunning}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5].map((v) => (
                <SelectItem key={v} value={String(v)}>
                  {v}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Stake (USD)</Label>
          <Input
            type="number"
            min={0.35}
            step={0.5}
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            disabled={s.accuRunning}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Profit Target %</Label>
          <Input
            type="number"
            min={5}
            max={200}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            disabled={s.accuRunning}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Max Barrier Hits</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={maxHits}
            onChange={(e) => setMaxHits(Number(e.target.value))}
            disabled={s.accuRunning}
            className="h-8 text-sm"
          />
        </div>
      </div>
      {liveP !== 0 && (
        <p
          className={cn(
            "text-center text-xl font-mono font-semibold",
            liveP >= 0 ? "text-emerald-500" : "text-rose-500",
          )}
        >
          {liveP >= 0 ? "+" : ""}
          {liveP.toFixed(2)} USD
        </p>
      )}
      <p className="truncate font-mono text-xs text-muted-foreground">{status}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={s.accuRunning ? "destructive" : "default"}
          className="flex-1"
          onClick={() => {
            if (s.accuRunning) {
              stop();
            } else {
              s.setAccuRunning(true);
              setStatus("Starting…");
              runCycle();
            }
          }}
        >
          {s.accuRunning ? "Stop Bot" : "Start Bot"}
        </Button>
        {s.consLosses.accu > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              s.resetLoss("accu");
              setStatus("Reset — ready");
            }}
          >
            Reset ({s.consLosses.accu})
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Rise / Fall panel ────────────────────────────────────────────────────────

function calcEMA(prices: number[], period: number) {
  if (prices.length < period) return prices[prices.length - 1] ?? 0;
  const k = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) ema = prices[i] * k + ema * (1 - k);
  return ema;
}

function bos(prices: number[]): "bullish" | "bearish" | null {
  if (prices.length < 10) return null;
  const r = prices.slice(-10);
  const mid = 5;
  const pH = Math.max(...r.slice(0, mid)),
    pL = Math.min(...r.slice(0, mid));
  const cH = Math.max(...r.slice(mid)),
    cL = Math.min(...r.slice(mid));
  if (cH > pH && cL > pL) return "bullish";
  if (cH < pH && cL < pL) return "bearish";
  return null;
}

function RiseFallPanel() {
  const s = useStore();
  const [duration, setDuration] = useState(10);
  const [stake, setStake] = useState(1);
  const [maxLoss, setMaxLoss] = useState(5);
  const [status, setStatus] = useState("Waiting for signal…");
  const [signal, setSignal] = useState<"CALL" | "PUT" | null>(null);
  const inTrade = useRef(false);

  useEffect(() => {
    if (!s.rfRunning || inTrade.current) return;
    const prices = s.ticks.map((t) => t.price);
    if (prices.length < 20) return;
    const ema = calcEMA(prices, 14);
    const last = prices[prices.length - 1];
    const b = bos(prices);
    const mom = last > ema ? "bullish" : "bearish";
    const sig: "CALL" | "PUT" | null =
      b === "bullish" && mom === "bullish" ? "CALL"
      : b === "bearish" && mom === "bearish" ? "PUT"
      : null;
    setSignal(sig);
    if (!sig) return;
    if (s.consLosses.rf >= maxLoss) {
      setStatus(`⛔ ${s.consLosses.rf} losses — reset to continue`);
      s.setRfRunning(false);
      return;
    }
    executeTrade(sig);
  }, [s.ticks, s.rfRunning]);

  async function executeTrade(dir: "CALL" | "PUT") {
    if (inTrade.current) return;
    inTrade.current = true;
    setStatus(`Buying ${dir}…`);
    try {
      const prop = await derivClient.send({
        proposal: 1,
        contract_type: dir,
        symbol: "R_75",
        amount: stake,
        basis: "stake",
        duration,
        duration_unit: "t",
        currency: "USD",
      });
      if (prop.error) throw prop.error;
      const buy = await derivClient.send({ buy: prop.proposal.id, price: stake });
      if (buy.error) throw buy.error;
      const cid: number = buy.buy.contract_id;
      s.addTrade({ id: cid, type: dir, stake, pnl: null, status: "open", time: Date.now() });
      setStatus(`${dir} open — #${cid}`);
      const off = derivClient.on("proposal_open_contract", (data: any) => {
        const c = data.proposal_open_contract;
        if (!c || c.contract_id !== cid) return;
        if (c.is_settleable || c.is_expired) {
          off();
          inTrade.current = false;
          const pnl = parseFloat(c.profit) || 0;
          s.updateTrade(cid, { pnl, status: pnl > 0 ? "won" : "lost" });
          pnl > 0 ? s.resetLoss("rf") : s.incLoss("rf");
          setStatus(`${pnl > 0 ? "✓ Win" : "✗ Loss"} $${Math.abs(pnl).toFixed(2)}`);
        }
      });
      await derivClient.send({ proposal_open_contract: 1, contract_id: cid, subscribe: 1 });
    } catch (e: any) {
      inTrade.current = false;
      setStatus(`Error: ${e?.message}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Duration (ticks)</Label>
          <Input
            type="number"
            min={5}
            max={50}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={s.rfRunning}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Stake (USD)</Label>
          <Input
            type="number"
            min={0.35}
            step={0.5}
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            disabled={s.rfRunning}
            className="h-8 text-sm"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs">Max consecutive losses</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={maxLoss}
            onChange={(e) => setMaxLoss(Number(e.target.value))}
            disabled={s.rfRunning}
            className="h-8 text-sm"
          />
        </div>
      </div>
      {signal && s.rfRunning && (
        <div
          className={cn(
            "rounded-md py-2 text-center text-xs font-bold tracking-widest",
            signal === "CALL"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400",
          )}
        >
          {signal === "CALL" ? "▲ RISE SIGNAL" : "▼ FALL SIGNAL"}
        </div>
      )}
      <p className="truncate font-mono text-xs text-muted-foreground">{status}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={s.rfRunning ? "destructive" : "default"}
          className="flex-1"
          onClick={() => {
            inTrade.current = false;
            s.setRfRunning(!s.rfRunning);
            if (s.rfRunning) setStatus("Stopped");
          }}
        >
          {s.rfRunning ? "Stop Bot" : "Start Bot"}
        </Button>
        {s.consLosses.rf > 0 && (
          <Button size="sm" variant="outline" onClick={() => s.resetLoss("rf")}>
            Reset ({s.consLosses.rf})
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Digits panel ─────────────────────────────────────────────────────────────

function DigitsPanel() {
  const s = useStore();
  const [mode, setMode] = useState<"DIGITEVEN" | "DIGITODD">("DIGITEVEN");
  const [stake, setStake] = useState(0.35);
  const [streak, setStreak] = useState(5);
  const [maxLoss, setMaxLoss] = useState(6);
  const [status, setStatus] = useState("Idle");
  const inTrade = useRef(false);

  const dist = Array(10).fill(0);
  s.digits.forEach((d) => dist[d]++);
  const maxD = Math.max(...dist, 1);

  // streak analysis
  let lastType: "even" | "odd" = "even";
  let streakLen = 1;
  if (s.digits.length > 0) {
    lastType = s.digits[s.digits.length - 1] % 2 === 0 ? "even" : "odd";
    for (let i = s.digits.length - 2; i >= 0; i--) {
      if ((s.digits[i] % 2 === 0 ? "even" : "odd") === lastType) streakLen++;
      else break;
    }
  }

  useEffect(() => {
    if (!s.digitsRunning || inTrade.current || s.digits.length < streak) return;
    if (s.consLosses.digits >= maxLoss) {
      setStatus(`⛔ ${s.consLosses.digits} losses`);
      s.setDigitsRunning(false);
      return;
    }
    if (streakLen < streak) return;
    const bet: "DIGITEVEN" | "DIGITODD" = lastType === "even" ? "DIGITODD" : "DIGITEVEN";
    executeTrade(bet);
  }, [s.digits, s.digitsRunning]);

  async function executeTrade(m: "DIGITEVEN" | "DIGITODD") {
    if (inTrade.current) return;
    inTrade.current = true;
    setStatus(`Buying ${m}…`);
    try {
      const prop = await derivClient.send({
        proposal: 1,
        contract_type: m,
        symbol: "R_10",
        amount: stake,
        basis: "stake",
        duration: 1,
        duration_unit: "t",
        currency: "USD",
      });
      if (prop.error) throw prop.error;
      const buy = await derivClient.send({ buy: prop.proposal.id, price: stake });
      if (buy.error) throw buy.error;
      const cid: number = buy.buy.contract_id;
      s.addTrade({ id: cid, type: m, stake, pnl: null, status: "open", time: Date.now() });
      setStatus(`${m} open — #${cid}`);
      const off = derivClient.on("proposal_open_contract", (data: any) => {
        const c = data.proposal_open_contract;
        if (!c || c.contract_id !== cid) return;
        if (c.is_settleable || c.is_expired) {
          off();
          inTrade.current = false;
          const pnl = parseFloat(c.profit) || 0;
          s.updateTrade(cid, { pnl, status: pnl > 0 ? "won" : "lost" });
          pnl > 0 ? s.resetLoss("digits") : s.incLoss("digits");
          setStatus(`${pnl > 0 ? "✓" : "✗"} $${Math.abs(pnl).toFixed(2)}`);
        }
      });
      await derivClient.send({ proposal_open_contract: 1, contract_id: cid, subscribe: 1 });
    } catch (e: any) {
      inTrade.current = false;
      setStatus(`Error: ${e?.message}`);
    }
  }

  return (
    <div className="space-y-4">
      {/* Digit bar chart */}
      <div>
        <p className="mb-1 text-xs text-muted-foreground">Last 50 digits</p>
        <div className="flex h-10 items-end gap-0.5">
          {dist.map((count, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-0.5">
              <div
                className="w-full rounded-sm bg-amber-500/50 transition-all"
                style={{ height: `${(count / maxD) * 32}px`, minHeight: 2 }}
              />
              <span className="text-[8px] text-muted-foreground">{i}</span>
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Streak:{" "}
          <span className={streakLen >= streak ? "font-semibold text-amber-500" : ""}>
            {lastType} ×{streakLen}
          </span>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Stake (USD)</Label>
          <Input
            type="number"
            min={0.35}
            step={0.35}
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            disabled={s.digitsRunning}
            className="h-8 text-sm"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Streak trigger</Label>
          <Input
            type="number"
            min={3}
            max={10}
            value={streak}
            onChange={(e) => setStreak(Number(e.target.value))}
            disabled={s.digitsRunning}
            className="h-8 text-sm"
          />
        </div>
      </div>
      <p className="truncate font-mono text-xs text-muted-foreground">{status}</p>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={s.digitsRunning ? "destructive" : "default"}
          className="flex-1"
          onClick={() => {
            inTrade.current = false;
            s.setDigitsRunning(!s.digitsRunning);
            if (s.digitsRunning) setStatus("Stopped");
          }}
        >
          {s.digitsRunning ? "Stop Bot" : "Start Bot"}
        </Button>
        {s.consLosses.digits > 0 && (
          <Button size="sm" variant="outline" onClick={() => s.resetLoss("digits")}>
            Reset ({s.consLosses.digits})
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── P&L sidebar ─────────────────────────────────────────────────────────────

function PnLSidebar() {
  const { trades, account } = useStore();
  const settled = trades.filter((t) => t.pnl !== null);
  const totalPnl = settled.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const wins = settled.filter((t) => (t.pnl ?? 0) > 0).length;
  const wr = settled.length ? ((wins / settled.length) * 100).toFixed(0) : "—";
  const todayPnl = settled
    .filter((t) => t.time >= new Date().setHours(0, 0, 0, 0))
    .reduce((s, t) => s + (t.pnl ?? 0), 0);

  const label: Record<string, string> = {
    ACCU: "ACCU",
    CALL: "RISE",
    PUT: "FALL",
    DIGITEVEN: "EVEN",
    DIGITODD: "ODD",
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: "Balance", v: account ? `$${account.balance.toFixed(2)}` : "—", sub: account?.currency },
          {
            l: "Today",
            v: `${todayPnl >= 0 ? "+" : ""}$${todayPnl.toFixed(2)}`,
            color: todayPnl >= 0 ? "text-emerald-500" : "text-rose-500",
          },
          {
            l: "Total P/L",
            v: `${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`,
            color: totalPnl >= 0 ? "text-emerald-500" : "text-rose-500",
          },
          { l: "Win Rate", v: `${wr}%`, sub: `${wins}W / ${settled.length - wins}L` },
        ].map(({ l, v, sub, color }) => (
          <Card key={l} className="p-3">
            <p className="text-[10px] text-muted-foreground">{l}</p>
            <p className={cn("font-mono text-base font-semibold tabular-nums", color)}>{v}</p>
            {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
          </Card>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        <p className="text-xs text-muted-foreground mb-2">Recent trades</p>
        {trades.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">No trades yet</p>
        )}
        {trades.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-md border border-border/40 px-2 py-1.5"
          >
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[9px] px-1">
                {label[t.type] ?? t.type}
              </Badge>
              <span className="text-xs text-muted-foreground">${t.stake.toFixed(2)}</span>
            </div>
            {t.status === "open" ? (
              <span className="animate-pulse text-[10px] text-amber-500">● open</span>
            ) : (
              <span
                className={cn(
                  "font-mono text-sm font-medium",
                  (t.pnl ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {(t.pnl ?? 0) >= 0 ? "+" : ""}
                {(t.pnl ?? 0).toFixed(2)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Login panel ──────────────────────────────────────────────────────────────

function LoginCard({ onAuth }: { onAuth: () => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const s = useStore();

  async function connect() {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await derivClient.connect(input.trim());
      const auth = res.authorize;
      s.setToken(input.trim());
      s.setConnected(true);
      s.setAuthorized(true);
      s.setAccount({
        loginid: auth.loginid,
        balance: auth.balance,
        currency: auth.currency,
        is_virtual: auth.is_virtual,
      });
      onAuth();
    } catch (e: any) {
      setError(e?.message ?? "Invalid token");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" />
          Connect Deriv Account
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-200 flex gap-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>
            Always test on a <strong>Demo account</strong> first. Never share your token.
          </span>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deriv-token">API Token</Label>
          <Input
            id="deriv-token"
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && connect()}
            placeholder="pat_xxxxxxxxxxxxx"
            className="font-mono text-sm"
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <Button className="w-full" onClick={connect} disabled={loading || !input.trim()}>
          {loading ? "Connecting…" : "Connect"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Get your token at{" "}
          <a
            href="https://app.deriv.com/account/api-token"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            app.deriv.com/account/api-token
          </a>
          {" "}(needs read + trade + trading_information scopes)
        </p>
      </CardContent>
    </Card>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DerivTradeDeskClient() {
  const s = useStore();
  const [authed, setAuthed] = useState(false);
  const [activeBot, setActiveBot] = useState<"accumulator" | "risefall" | "digits">("accumulator");

  // Subscribe to ticks
  useEffect(() => {
    if (!authed) return;
    let subId: string | null = null;
    derivClient.send({ ticks: "R_75", subscribe: 1 }).then((r) => {
      subId = r?.subscription?.id ?? null;
    }).catch(() => {});
    const offTick = derivClient.on("tick", (data: any) => {
      const t = data.tick;
      if (t) s.addTick(t.epoch, parseFloat(t.quote));
    });
    const offBal = derivClient.on("balance", (data: any) => {
      if (data.balance?.balance != null) s.updateBalance(parseFloat(data.balance.balance));
    });
    derivClient.send({ balance: 1, subscribe: 1 }).catch(() => {});
    return () => {
      offTick();
      offBal();
      if (subId) derivClient.send({ forget: subId }).catch(() => {});
    };
  }, [authed]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-[1400px] space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Deriv TradeDesk</h1>
          <p className="text-sm text-muted-foreground">
            Automated Deriv trading — Accumulator · Rise/Fall · Digits
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: <TrendingUp className="h-4 w-4" />, title: "Accumulator", rating: "★★★★★", desc: "Highest win rate. Exit at profit target." },
            { icon: <Zap className="h-4 w-4" />, title: "Rise / Fall", rating: "★★★★", desc: "SMC-driven trend entries on V75." },
            { icon: <Bot className="h-4 w-4" />, title: "Digits", rating: "★★★", desc: "Statistical streak-reversal trading." },
          ].map(({ icon, title, rating, desc }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">{icon}{title}</span>
                  <span className="text-xs text-amber-500">{rating}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <LoginCard onAuth={() => setAuthed(true)} />
        <p className="text-center text-xs text-muted-foreground">
          <a
            href="https://deriv-tradedesk.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary underline underline-offset-2"
          >
            Open standalone TradeDesk <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Deriv TradeDesk</h1>
          <p className="text-xs text-muted-foreground">
            {s.account?.loginid} · {s.account?.is_virtual ? "Demo" : "Real"} ·{" "}
            <span className="font-mono font-semibold text-foreground">
              ${s.account?.balance.toFixed(2)} {s.account?.currency}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {s.account?.is_virtual && <Badge variant="outline">DEMO</Badge>}
          <Badge variant={s.connected ? "default" : "destructive"} className="text-[10px]">
            {s.connected ? "● LIVE" : "○ OFFLINE"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {/* Chart */}
          <Card>
            <CardHeader className="pb-1 pt-3">
              <CardTitle className="font-mono text-xs text-muted-foreground">
                R_75 · Live Ticks
              </CardTitle>
            </CardHeader>
            <CardContent className="h-36 pb-3">
              <TickChart />
            </CardContent>
          </Card>

          {/* Bot tabs */}
          <Card>
            <CardContent className="pt-4">
              <Tabs value={activeBot} onValueChange={(v) => setActiveBot(v as typeof activeBot)}>
                <TabsList className="w-full">
                  <TabsTrigger value="accumulator" className="flex-1 text-xs">
                    Accumulator ★★★★★
                  </TabsTrigger>
                  <TabsTrigger value="risefall" className="flex-1 text-xs">
                    Rise / Fall ★★★★
                  </TabsTrigger>
                  <TabsTrigger value="digits" className="flex-1 text-xs">
                    Digits ★★★
                  </TabsTrigger>
                </TabsList>
                <div className="mt-4">
                  <TabsContent value="accumulator">
                    <AccumulatorPanel />
                  </TabsContent>
                  <TabsContent value="risefall">
                    <RiseFallPanel />
                  </TabsContent>
                  <TabsContent value="digits">
                    <DigitsPanel />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* P&L sidebar */}
        <div className="h-[600px]">
          <PnLSidebar />
        </div>
      </div>
    </div>
  );
}
