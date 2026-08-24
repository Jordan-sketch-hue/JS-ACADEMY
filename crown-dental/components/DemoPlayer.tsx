"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

/* ── colour tokens (kept inline so DemoPlayer is self-contained) ── */
const T = {
  ink:    "#0C1526",
  slate:  "#64748B",
  mist:   "#94A3B8",
  line:   "#E5E9F0",
  surface:"#F8F9FB",
  gold:   "#C9A96E",
  goldDp: "#B8953F",
  teal:   "#0D9488",
};

/* ──────────────────────────────────────────────────────────────────
   SCREEN 1 — SCHEDULE
───────────────────────────────────────────────────────────────────*/
function ScheduleScreen() {
  const appts = [
    { name: "Amara Bennett",  proc: "Implant consult",  time: "08:00", chair: "Op 1", status: "completed"  },
    { name: "Devon Clarke",   proc: "Crown seat",        time: "08:30", chair: "Op 2", status: "completed"  },
    { name: "Priya Nair",     proc: "Whitening",         time: "09:15", chair: "Op 1", status: "in-chair"   },
    { name: "Marcus Reid",    proc: "Perio maintenance", time: "09:30", chair: "Op 3", status: "checked-in" },
    { name: "Sofia Moreno",   proc: "Root canal #19",    time: "10:00", chair: "Op 2", status: "confirmed"  },
    { name: "Liam Walsh",     proc: "Prophylaxis",       time: "10:45", chair: "Op 3", status: "confirmed"  },
    { name: "Zainab Hassan",  proc: "Implant fixture",   time: "11:30", chair: "Op 1", status: "confirmed"  },
    { name: "Noah Grant",     proc: "Extraction #17",    time: "13:00", chair: "Op 4", status: "confirmed"  },
  ];

  const statusCfg: Record<string, { bg: string; text: string; label: string }> = {
    "completed":  { bg: T.surface, text: T.mist,   label: "done"       },
    "in-chair":   { bg: `${T.gold}18`, text: T.goldDp, label: "in chair" },
    "checked-in": { bg: `${T.teal}15`, text: T.teal,   label: "checked in"},
    "confirmed":  { bg: "#fff",        text: T.slate,  label: "confirmed" },
  };

  return (
    <div className="flex h-full gap-0">
      {/* Mini sidebar */}
      <div className="w-32 shrink-0 border-r flex flex-col gap-1 p-2" style={{ borderColor: T.line, background: T.surface }}>
        {[
          { icon: "LayoutDashboard", label: "Dashboard" },
          { icon: "CalendarClock",   label: "Schedule",  active: true },
          { icon: "Users",           label: "Patients"   },
          { icon: "Stethoscope",     label: "Clinical"   },
          { icon: "CreditCard",      label: "Billing"    },
        ].map(n => {
          const I = (Icons as any)[n.icon];
          return (
            <div key={n.label} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors"
              style={{ background: n.active ? `${T.gold}12` : "transparent", color: n.active ? T.goldDp : T.slate,
                       borderLeft: n.active ? `2px solid ${T.goldDp}` : "2px solid transparent" }}>
              <I className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              {n.label}
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold" style={{ color: T.ink }}>Schedule — Thu Jul 3, 2026</p>
            <p className="text-[10px]" style={{ color: T.slate }}>Crown Kingston · 8 chairs active</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: `${T.gold}12`, color: T.goldDp }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: T.goldDp }} />
            7 / 8 live
          </div>
        </div>

        {/* Appointment cards */}
        <div className="grid grid-cols-4 gap-2 flex-1">
          {appts.map((a, i) => {
            const s = statusCfg[a.status];
            return (
              <motion.div key={a.name}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="rounded-xl border p-2.5 flex flex-col justify-between"
                style={{ background: s.bg, borderColor: a.status === "in-chair" ? `${T.gold}50` : T.line }}>
                <div>
                  <p className="text-[10px] font-semibold truncate" style={{ color: T.ink }}>{a.name}</p>
                  <p className="text-[9px] truncate mt-0.5" style={{ color: T.slate }}>{a.proc}</p>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[8px]" style={{ color: T.mist }}>{a.time} · {a.chair}</span>
                  <span className="rounded px-1.5 py-0.5 text-[8px] font-bold" style={{ background: `${s.text}18`, color: s.text }}>{s.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI bar */}
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-2.5 rounded-xl border px-3 py-2"
          style={{ borderColor: `${T.gold}30`, background: `${T.gold}08` }}>
          <Icons.Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: T.gold }} />
          <p className="text-[10px]" style={{ color: T.ink }}>
            <span className="font-semibold">Crown AI</span> backfilled a 9:00 AM cancellation from the waitlist —{" "}
            <span className="font-semibold" style={{ color: T.teal }}>$980 recovered</span>
          </p>
          <button className="ml-auto shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-semibold"
            style={{ background: T.teal, color: "#fff" }}>View</button>
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SCREEN 2 — CLINICAL CHART
───────────────────────────────────────────────────────────────────*/
function ClinicalScreen() {
  const [typed, setTyped] = useState("");
  const note = "Pt presents for implant evaluation. CBCT reveals adequate bone density at sites #5–6 (≥7mm width, 12mm height). No active perio noted. BOP 4%. Recommended: implant placement #6 pending consent. Amoxicillin 500mg ×3d pre-surgical.";

  useEffect(() => {
    setTyped("");
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyped(note.slice(0, i));
      if (i >= note.length) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, []);

  const teeth = Array.from({ length: 16 }, (_, i) => ({
    n: i + 1,
    highlight: i === 4 || i === 5,
  }));

  return (
    <div className="flex h-full gap-0">
      {/* Mini sidebar */}
      <div className="w-32 shrink-0 border-r flex flex-col gap-1 p-2" style={{ borderColor: T.line, background: T.surface }}>
        {[
          { icon: "LayoutDashboard", label: "Dashboard" },
          { icon: "CalendarClock",   label: "Schedule"   },
          { icon: "Users",           label: "Patients"   },
          { icon: "Stethoscope",     label: "Clinical",  active: true },
          { icon: "CreditCard",      label: "Billing"    },
        ].map(n => {
          const I = (Icons as any)[n.icon];
          return (
            <div key={n.label} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium"
              style={{ background: n.active ? `${T.gold}12` : "transparent", color: n.active ? T.goldDp : T.slate,
                       borderLeft: n.active ? `2px solid ${T.goldDp}` : "2px solid transparent" }}>
              <I className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              {n.label}
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div className="flex-1 flex gap-3 p-4">
        {/* Left: patient + chart */}
        <div className="flex-1 flex flex-col gap-2.5">
          {/* Patient header */}
          <div className="flex items-center gap-2.5 rounded-xl border p-2.5" style={{ borderColor: T.line, background: "#fff" }}>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ background: `linear-gradient(135deg, ${T.goldDp}, ${T.gold})` }}>AB</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold" style={{ color: T.ink }}>Amara Bennett · 34F</p>
              <p className="text-[9px]" style={{ color: T.slate }}>Implant consult · Op 1 · Dr. Chen</p>
            </div>
            <div className="flex gap-1.5">
              <span className="rounded-full px-2 py-0.5 text-[8px] font-bold" style={{ background: `${T.teal}15`, color: T.teal }}>Low risk</span>
              <span className="rounded-full px-2 py-0.5 text-[8px] font-bold" style={{ background: `${T.gold}15`, color: T.goldDp }}>Crown Care+</span>
            </div>
          </div>

          {/* Odontogram */}
          <div className="rounded-xl border p-2.5" style={{ borderColor: T.line, background: T.surface }}>
            <p className="mb-2 text-[8px] font-semibold uppercase tracking-widest" style={{ color: T.mist }}>Odontogram</p>
            <div className="flex gap-0.5 justify-center">
              {teeth.map(t => (
                <motion.div key={t.n}
                  initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: t.n * 0.03 }}
                  className="h-6 w-5 rounded-sm border flex items-center justify-center text-[7px] font-bold"
                  style={{
                    borderColor: t.highlight ? `${T.gold}80` : T.line,
                    background:  t.highlight ? `${T.gold}18` : "#fff",
                    color:       t.highlight ? T.goldDp : T.mist,
                    boxShadow:   t.highlight ? `0 0 0 1px ${T.gold}40` : "none",
                  }}>
                  {t.n}
                </motion.div>
              ))}
            </div>
            <p className="mt-1.5 text-center text-[8px]" style={{ color: T.mist }}>Sites #5–6 flagged for implant</p>
          </div>

          {/* AI note */}
          <div className="flex-1 rounded-xl border p-3" style={{ borderColor: `${T.gold}25`, background: `${T.gold}05` }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Icons.Sparkles className="h-3 w-3" style={{ color: T.gold }} />
              <span className="text-[8px] font-semibold uppercase tracking-widest" style={{ color: T.goldDp }}>AI Clinical Note — generating</span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: T.teal }} />
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: T.ink }}>
              {typed}<span className="animate-pulse">|</span>
            </p>
          </div>
        </div>

        {/* Right: case coach */}
        <div className="w-28 flex flex-col gap-2">
          <div className="rounded-xl border p-2.5 text-center" style={{ borderColor: T.line, background: "#fff" }}>
            <p className="text-[8px] font-semibold uppercase tracking-wide mb-1" style={{ color: T.mist }}>Accept Score</p>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}
              className="text-2xl font-bold" style={{ color: T.teal }}>82%</motion.div>
            <p className="text-[8px] mt-0.5" style={{ color: T.slate }}>High likelihood</p>
          </div>
          <div className="rounded-xl border p-2.5 flex-1" style={{ borderColor: T.line, background: T.surface }}>
            <p className="text-[8px] font-semibold mb-2" style={{ color: T.mist }}>Fee breakdown</p>
            {[["Implant","$4,200"],["Abutment","$680"],["Crown","$1,400"]].map(([l,v],i) => (
              <motion.div key={l} initial={{ x: 8, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
                className="flex justify-between mb-1">
                <span className="text-[9px]" style={{ color: T.slate }}>{l}</span>
                <span className="text-[9px] font-semibold" style={{ color: T.ink }}>{v}</span>
              </motion.div>
            ))}
            <div className="mt-1.5 border-t pt-1 flex justify-between" style={{ borderColor: T.line }}>
              <span className="text-[9px] font-bold" style={{ color: T.ink }}>Total</span>
              <span className="text-[9px] font-bold" style={{ color: T.goldDp }}>$6,280</span>
            </div>
          </div>
          <button className="rounded-xl py-2 text-[9px] font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${T.goldDp}, ${T.gold})` }}>
            Present Plan
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SCREEN 3 — TREATMENT PLANS
───────────────────────────────────────────────────────────────────*/
function TreatmentScreen() {
  const plans = [
    { name: "Amara Bennett", procedures: "Implant #6 · Bone Graft", total: 6280, ins: 3800, pt: 2480, status: "accepted",  stage: 1 },
    { name: "Sofia Moreno",  procedures: "Root Canal #19 · Crown", total: 3200, ins: 1920, pt: 1280, status: "proposed",  stage: 0 },
    { name: "Liam Walsh",    procedures: "Veneers #8–#10 (3×)",     total: 4200, ins: 0,    pt: 4200, status: "proposed",  stage: 0 },
    { name: "Marcus Reid",   procedures: "Extractions · Partial",   total: 2100, ins: 1050, pt: 1050, status: "scheduled", stage: 2 },
    { name: "Noah Grant",    procedures: "Wisdom Teeth ×4",          total: 3600, ins: 2880, pt: 720,  status: "completed", stage: 4 },
  ];

  const stageCfg: Record<string, { color: string; bg: string }> = {
    accepted:  { color: T.teal,   bg: `${T.teal}12`  },
    proposed:  { color: T.goldDp, bg: `${T.gold}12`  },
    scheduled: { color: T.ink,    bg: `${T.ink}08`   },
    completed: { color: T.mist,   bg: T.surface       },
  };

  const workflow = ["Proposed","Accepted","Scheduled","In Progress","Completed"];

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* Pipeline */}
      <div className="grid grid-cols-5 gap-2">
        {workflow.map((w, i) => {
          const count = plans.filter(p => p.stage === i).length;
          return (
            <motion.div key={w} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl border p-2 text-center" style={{ borderColor: T.line, background: i === 1 ? `${T.gold}08` : "#fff" }}>
              <div className="mx-auto mb-1 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ background: i === 1 ? `${T.gold}20` : T.surface, color: i === 1 ? T.goldDp : T.mist }}>{count}</div>
              <p className="text-[8px] font-medium" style={{ color: T.ink }}>{w}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Plans */}
      <div className="flex-1 rounded-xl border overflow-hidden" style={{ borderColor: T.line, background: "#fff" }}>
        <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: T.line, background: T.surface }}>
          <Icons.ClipboardCheck className="h-3.5 w-3.5" style={{ color: T.goldDp }} strokeWidth={1.5} />
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Active Plans</span>
          <span className="ml-auto text-[9px]" style={{ color: T.mist }}>
            ${plans.reduce((s,p) => s + p.total, 0).toLocaleString()} pipeline
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: T.line }}>
          {plans.map((p, i) => {
            const s = stageCfg[p.status];
            return (
              <motion.div key={p.name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-semibold truncate" style={{ color: T.ink }}>{p.name}</p>
                    <span className="rounded-full px-1.5 py-0.5 text-[8px] font-semibold capitalize shrink-0"
                      style={{ background: s.bg, color: s.color }}>{p.status}</span>
                  </div>
                  <p className="text-[9px] mt-0.5 truncate" style={{ color: T.slate }}>{p.procedures}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold" style={{ color: T.ink }}>${p.total.toLocaleString()}</p>
                  <p className="text-[8px]" style={{ color: T.mist }}>Pt: ${p.pt.toLocaleString()}</p>
                </div>
                {p.status === "proposed" && (
                  <button className="shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg,${T.goldDp},${T.gold})` }}>
                    Present
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SCREEN 4 — REVENUE & BILLING
───────────────────────────────────────────────────────────────────*/
function RevenueScreen() {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul"];
  const production = [268, 291, 312, 305, 348, 372, 413];
  const target =     [280, 280, 300, 320, 340, 360, 400];
  const max = 430;

  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  return (
    <div className="flex h-full gap-0">
      <div className="w-32 shrink-0 border-r flex flex-col gap-1 p-2" style={{ borderColor: T.line, background: T.surface }}>
        {[
          { icon: "LayoutDashboard", label: "Dashboard" },
          { icon: "CalendarClock",   label: "Schedule"  },
          { icon: "Users",           label: "Patients"  },
          { icon: "CreditCard",      label: "Billing",  active: true },
          { icon: "BarChart3",       label: "Reports"   },
        ].map(n => {
          const I = (Icons as any)[n.icon];
          return (
            <div key={n.label} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] font-medium"
              style={{ background: n.active ? `${T.gold}12` : "transparent", color: n.active ? T.goldDp : T.slate,
                       borderLeft: n.active ? `2px solid ${T.goldDp}` : "2px solid transparent" }}>
              <I className="h-3 w-3 shrink-0" strokeWidth={1.5} />
              {n.label}
            </div>
          );
        })}
      </div>

      <div className="flex-1 flex flex-col gap-3 p-4">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { l: "MTD Production", v: "$412,880", d: "+18.4%", c: T.teal },
            { l: "Collections",    v: "98.6%",    d: "+2.4%",  c: T.teal },
            { l: "Claims Filed",   v: "31",       d: "Auto",   c: T.goldDp },
            { l: "A/R Balance",    v: "$24,310",  d: "−12%",   c: T.teal },
          ].map((k, i) => (
            <motion.div key={k.l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl border p-2.5" style={{ borderColor: T.line, background: "#fff" }}>
              <p className="text-[9px]" style={{ color: T.mist }}>{k.l}</p>
              <p className="mt-0.5 text-sm font-bold" style={{ color: T.ink }}>{k.v}</p>
              <p className="text-[9px] font-semibold" style={{ color: k.c }}>{k.d}</p>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 rounded-xl border p-3" style={{ borderColor: T.line, background: "#fff" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.mist }}>Production vs Target 2026</p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[8px]" style={{ color: T.goldDp }}>
                <span className="h-1.5 w-3 rounded-full inline-block" style={{ background: T.gold }} /> Production
              </span>
              <span className="flex items-center gap-1 text-[8px]" style={{ color: T.mist }}>
                <span className="h-1.5 w-3 rounded-full inline-block" style={{ background: T.line }} /> Target
              </span>
            </div>
          </div>
          <div className="flex h-28 items-end gap-2">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-24">
                  {/* Target bar */}
                  <motion.div className="flex-1 rounded-t-sm"
                    style={{ background: T.line, height: visible ? `${(target[i] / max) * 100}%` : "0%" }}
                    animate={{ height: visible ? `${(target[i] / max) * 100}%` : "0%" }}
                    transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }} />
                  {/* Production bar */}
                  <motion.div className="flex-1 rounded-t-sm"
                    style={{ background: `linear-gradient(to top, ${T.goldDp}, ${T.gold})` }}
                    animate={{ height: visible ? `${(production[i] / max) * 100}%` : "0%" }}
                    transition={{ duration: 0.6, delay: i * 0.06 + 0.1, ease: "easeOut" }} />
                </div>
                <span className="text-[8px]" style={{ color: T.mist }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SCREEN 5 — AUTOMATION
───────────────────────────────────────────────────────────────────*/
function AutomationScreen() {
  const [on, setOn] = useState<Record<string, boolean>>({
    a1: true, a2: true, a3: true, a4: false, a5: true,
  });

  const autos = [
    { id: "a1", name: "Recall Reminder",         trigger: "6 months since last visit",   action: "SMS + Email", runs: 2840, cat: "Recall"    },
    { id: "a2", name: "Appt Confirmation",        trigger: "48h before appointment",       action: "SMS",         runs: 1240, cat: "Scheduling"},
    { id: "a3", name: "Post-Visit Review Ask",    trigger: "2h after appt ends",           action: "Google link", runs: 892,  cat: "Reviews"  },
    { id: "a4", name: "Birthday Offer",           trigger: "Patient birthday −1 day",      action: "Email promo", runs: 312,  cat: "Marketing"},
    { id: "a5", name: "Tx Plan Follow-up",        trigger: "3 days after plan presented",  action: "SMS nudge",   runs: 188,  cat: "Clinical" },
  ];

  return (
    <div className="flex h-full flex-col gap-3 p-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { l: "Live",          v: String(Object.values(on).filter(Boolean).length), icon: "Zap",        c: T.teal   },
          { l: "Runs / month",  v: "1,840",   icon: "RefreshCw",  c: T.ink    },
          { l: "Pts reached",   v: "612",     icon: "Users",      c: T.goldDp },
          { l: "Est. revenue",  v: "$24,400", icon: "TrendingUp", c: T.teal   },
        ].map((k, i) => {
          const I = (Icons as any)[k.icon];
          return (
            <motion.div key={k.l} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl border p-2.5" style={{ borderColor: T.line, background: "#fff" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <I className="h-3 w-3" style={{ color: k.c }} strokeWidth={1.5} />
                <p className="text-[9px]" style={{ color: T.mist }}>{k.l}</p>
              </div>
              <p className="text-sm font-bold" style={{ color: T.ink }}>{k.v}</p>
            </motion.div>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 rounded-xl border overflow-hidden" style={{ borderColor: T.line }}>
        <div className="px-3 py-2 border-b" style={{ borderColor: T.line, background: T.surface }}>
          <span className="text-[10px] font-semibold" style={{ color: T.ink }}>Active Automations</span>
        </div>
        <div className="divide-y" style={{ borderColor: T.line }}>
          {autos.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 px-3 py-2.5">
              {/* Toggle */}
              <button onClick={() => setOn(prev => ({ ...prev, [a.id]: !prev[a.id] }))}
                className="relative h-4 w-7 rounded-full shrink-0 transition-colors"
                style={{ background: on[a.id] ? T.teal : T.line }}>
                <span className="absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform"
                  style={{ transform: on[a.id] ? "translateX(12px)" : "translateX(0)" }} />
              </button>
              <Icons.Bot className="h-3.5 w-3.5 shrink-0" style={{ color: T.goldDp }} strokeWidth={1.5} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-semibold truncate" style={{ color: T.ink }}>{a.name}</p>
                  {on[a.id] && <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${T.teal}15`, color: T.teal }}>LIVE</span>}
                </div>
                <p className="text-[8px] truncate" style={{ color: T.mist }}>{a.trigger} → {a.action}</p>
              </div>
              <span className="text-[10px] font-bold shrink-0" style={{ color: T.ink }}>{a.runs.toLocaleString()}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI suggestion */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex items-center gap-3 rounded-xl border p-3"
        style={{ borderColor: `${T.gold}25`, background: T.ink }}>
        <Icons.Sparkles className="h-4 w-4 shrink-0" style={{ color: T.gold }} strokeWidth={1.5} />
        <p className="text-[10px] flex-1" style={{ color: "rgba(255,255,255,0.75)" }}>
          <span className="font-semibold text-white">AI:</span> 12 patients accepted implant plans but haven't scheduled. Nudge could recover ~$48,000.
        </p>
        <button className="shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold text-white"
          style={{ background: `linear-gradient(135deg,${T.goldDp},${T.gold})` }}>Create</button>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   SCREEN 6 — PATIENT PORTAL
───────────────────────────────────────────────────────────────────*/
function PatientScreen() {
  return (
    <div className="flex h-full flex-col gap-3 p-4" style={{ background: T.surface }}>
      {/* Header */}
      <div className="flex items-center gap-3 rounded-2xl border p-3" style={{ borderColor: T.line, background: "#fff" }}>
        <div className="h-9 w-9 rounded-full overflow-hidden shrink-0" style={{ outline: `2px solid ${T.gold}40` }}>
          <div className="h-full w-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: `linear-gradient(135deg,${T.goldDp},${T.gold})` }}>AB</div>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-semibold" style={{ color: T.ink }}>Good morning, Amara 👋</p>
          <p className="text-[9px]" style={{ color: T.slate }}>Crown Care+ · Member since Jan 2025</p>
        </div>
        <div className="rounded-xl border px-2.5 py-1.5 text-center" style={{ borderColor: `${T.gold}30`, background: `${T.gold}08` }}>
          <p className="text-sm font-bold" style={{ color: T.goldDp }}>91</p>
          <p className="text-[7px]" style={{ color: T.mist }}>Crown Score™</p>
        </div>
      </div>

      {/* Journey tracker */}
      <div className="rounded-2xl border p-3" style={{ borderColor: T.line, background: "#fff" }}>
        <p className="mb-2.5 text-[8px] font-semibold uppercase tracking-widest" style={{ color: T.mist }}>Treatment Journey</p>
        <div className="flex items-center">
          {[{ l: "Consult", done: true },{ l: "CBCT Scan", done: true },{ l: "Implant", done: false },{ l: "Crown", done: false }]
            .map((s, i, arr) => (
              <div key={s.l} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  {i > 0 && <div className="h-0.5 flex-1" style={{ background: arr[i-1].done ? T.teal : T.line }} />}
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 + i * 0.1, type: "spring" }}
                    className="h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0"
                    style={{ borderColor: s.done ? T.teal : T.line, background: s.done ? T.teal : "#fff" }}>
                    {s.done && <Icons.Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                  </motion.div>
                  {i < arr.length - 1 && <div className="h-0.5 flex-1" style={{ background: s.done ? T.teal : T.line }} />}
                </div>
                <p className="mt-1 text-[8px]" style={{ color: T.slate }}>{s.l}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex gap-2 flex-1">
        {/* Upcoming appt */}
        <div className="flex-1 rounded-2xl border p-3" style={{ borderColor: T.line, background: "#fff" }}>
          <p className="text-[8px] font-semibold mb-2" style={{ color: T.mist }}>Next Appointment</p>
          <p className="text-[10px] font-semibold" style={{ color: T.gold }}>Wed Jul 9 · 10:30 AM</p>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: T.ink }}>Hygiene cleaning</p>
          <p className="text-[8px] mt-0.5" style={{ color: T.slate }}>RDH Torres · Crown Kingston</p>
          <div className="mt-2 flex gap-1.5">
            <button className="rounded-lg px-2.5 py-1 text-[9px] font-bold text-white"
              style={{ background: T.teal }}>Confirm</button>
            <button className="rounded-lg border px-2.5 py-1 text-[9px]"
              style={{ borderColor: T.line, color: T.slate }}>Reschedule</button>
          </div>
        </div>

        {/* AI message */}
        <div className="flex-1 rounded-2xl border p-3" style={{ borderColor: T.line, background: "#fff" }}>
          <p className="text-[8px] font-semibold mb-2" style={{ color: T.mist }}>From Crown AI</p>
          <div className="flex items-start gap-1.5">
            <div className="h-5 w-5 rounded-full shrink-0 flex items-center justify-center text-[6px] font-bold text-white"
              style={{ background: `linear-gradient(135deg,${T.goldDp},${T.gold})` }}>AI</div>
            <p className="text-[9px] leading-relaxed" style={{ color: T.ink }}>
              Your CBCT results look excellent — bone density is ideal for your implant. You're all set for Jul 9! 🎉
            </p>
          </div>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            <button className="rounded-lg border px-2 py-1 text-[8px]" style={{ borderColor: T.line, color: T.slate }}>Reply</button>
            <button className="rounded-lg border px-2 py-1 text-[8px]" style={{ borderColor: T.line, color: T.slate }}>View Results</button>
          </div>
        </div>

        {/* Docs */}
        <div className="flex-1 rounded-2xl border p-3" style={{ borderColor: T.line, background: "#fff" }}>
          <p className="text-[8px] font-semibold mb-2" style={{ color: T.mist }}>My Documents</p>
          {[
            { icon: "FileText", label: "Consent Form",    status: "Signed" },
            { icon: "FileCheck",label: "CBCT Report",     status: "Ready"  },
            { icon: "Receipt",  label: "Invoice #2061",   status: "Paid"   },
          ].map(d => {
            const I = (Icons as any)[d.icon];
            return (
              <div key={d.label} className="flex items-center gap-1.5 mb-1.5">
                <I className="h-3 w-3 shrink-0" style={{ color: T.goldDp }} strokeWidth={1.5} />
                <span className="text-[9px] flex-1 truncate" style={{ color: T.ink }}>{d.label}</span>
                <span className="text-[8px] font-semibold" style={{ color: T.teal }}>{d.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────
   MAIN DEMO PLAYER
───────────────────────────────────────────────────────────────────*/
const chapters = [
  { id: "schedule",   label: "Schedule",    icon: "CalendarClock"  },
  { id: "clinical",   label: "Clinical",    icon: "Stethoscope"    },
  { id: "treatment",  label: "Tx Plans",    icon: "ClipboardCheck" },
  { id: "revenue",    label: "Revenue",     icon: "TrendingUp"     },
  { id: "automation", label: "Automation",  icon: "Bot"            },
  { id: "portal",     label: "Patient",     icon: "HeartPulse"     },
] as const;

type ChapterId = typeof chapters[number]["id"];

const screens: Record<ChapterId, React.ComponentType> = {
  schedule:   ScheduleScreen,
  clinical:   ClinicalScreen,
  treatment:  TreatmentScreen,
  revenue:    RevenueScreen,
  automation: AutomationScreen,
  portal:     PatientScreen,
};

const INTERVAL = 5000;

export function DemoPlayer() {
  const [active, setActive] = useState<ChapterId>("schedule");
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const order: ChapterId[] = chapters.map(c => c.id);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    setProgress(0);
    startRef.current = Date.now();
    if (!playing) return;
    intervalRef.current = setInterval(() => {
      setActive(cur => order[(order.indexOf(cur) + 1) % order.length]);
      setProgress(0);
      startRef.current = Date.now();
    }, INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active, playing]);

  useEffect(() => {
    if (!playing) return;
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(elapsed / INTERVAL, 1));
      requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [playing, active]);

  const Screen = screens[active];

  function switchTo(id: ChapterId) {
    setActive(id);
    setPlaying(false);
    setProgress(0);
  }

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-x-12 -top-10 h-36 bg-gradient-to-b from-[#C9A96E]/10 to-transparent blur-3xl" />

      {/* Frame */}
      <div className="relative overflow-hidden rounded-3xl border border-[#E5E9F0] bg-white shadow-[0_32px_80px_-8px_rgba(12,21,38,0.22)]">

        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-[#E5E9F0] bg-[#F8F9FB] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-400/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
          <span className="h-3 w-3 rounded-full bg-green-400/70" />
          <div className="mx-3 flex flex-1 items-center gap-2 rounded-md border border-[#E5E9F0] bg-white px-3 py-1">
            <Icons.Lock className="h-2.5 w-2.5 text-[#94A3B8]" strokeWidth={1.5} />
            <span className="text-[10px] text-[#94A3B8]">
              console.crowndental.io / {active === "portal" ? "patient-portal" : `platform/${active}`}
            </span>
          </div>
          <button
            onClick={() => setPlaying(p => !p)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E9F0] bg-white px-2.5 py-1 text-[10px] font-semibold text-[#64748B] hover:border-[#C9A96E]/50 hover:text-[#B8953F] transition-colors"
          >
            {playing ? <Icons.Pause className="h-3 w-3" /> : <Icons.Play className="h-3 w-3" />}
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        {/* Screen content with AnimatePresence */}
        <div className="relative overflow-hidden" style={{ height: 360 }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} className="absolute inset-0"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Chapter tabs */}
        <div className="flex border-t border-[#E5E9F0] bg-[#F8F9FB]">
          {chapters.map((ch) => {
            const isActive = active === ch.id;
            const I = (Icons as any)[ch.icon] ?? Icons.Circle;
            return (
              <button key={ch.id} onClick={() => switchTo(ch.id)}
                className="relative flex flex-1 flex-col items-center gap-1 overflow-hidden px-2 py-3 text-[10px] font-semibold transition-colors"
                style={{ color: isActive ? T.goldDp : T.mist }}>
                {/* Active indicator */}
                {isActive && (
                  <motion.span layoutId="tab-indicator"
                    className="absolute inset-x-0 top-0 h-0.5"
                    style={{ background: `linear-gradient(90deg,${T.goldDp},${T.gold})` }} />
                )}
                {/* Progress bar */}
                {isActive && playing && (
                  <span className="absolute inset-x-0 top-0 h-0.5 origin-left"
                    style={{ background: `${T.gold}40`, transform: `scaleX(${progress})`, transition: "none" }} />
                )}
                <I className="h-3.5 w-3.5" strokeWidth={1.5} />
                {ch.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
