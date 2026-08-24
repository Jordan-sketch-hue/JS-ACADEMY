"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const capabilities = [
  { icon: "PhoneCall",      label: "Voice booking agent",       desc: "Answers calls 24/7, qualifies needs, books appointments in natural language.",             status: "active" },
  { icon: "MessageSquare",  label: "SMS & chat agent",          desc: "Handles inbound texts and website chat — confirmations, forms, and FAQs instantly.",        status: "active" },
  { icon: "CalendarSearch", label: "Waitlist optimizer",        desc: "Scans for cancellations in real-time and auto-offers slots to best-matched waitlisted patients.", status: "active" },
  { icon: "ShieldCheck",    label: "Insurance verifier",        desc: "Batch-verifies eligibility for every upcoming appointment the night before.",              status: "active" },
  { icon: "FileSearch",     label: "Claims scrubber",           desc: "Reviews claims for coding errors before submission — reduces denial rate by up to 34%.",    status: "active" },
  { icon: "Megaphone",      label: "Recall campaign AI",        desc: "Risk-stratifies overdue patients, personalises outreach cadence, stops once booked.",      status: "active" },
  { icon: "BrainCircuit",   label: "Clinical note assistant",   desc: "Turns voice dictation into structured SOAP notes, perio charts, and treatment narratives.", status: "beta" },
  { icon: "TrendingUp",     label: "Revenue intelligence",      desc: "Flags production gaps, recommends fill-ins, alerts when a provider is behind target.",      status: "beta" },
];

const log: { time: string; event: string; type: string; outcome: string }[] = [];

const typePill: Record<string, string> = {
  Insurance: "bg-ink-3/10 text-ink-3",
  Recall:    "bg-gold/15 text-gold-deep",
  Claims:    "bg-teal/10 text-teal",
  Chat:      "bg-surface text-slate border border-line",
  Waitlist:  "bg-gold/10 text-gold-deep",
};

export default function AIAgentPage() {
  const [caps, setCaps] = useState(capabilities.map(c => ({ ...c })));
  const [toast, setToast] = useState<string | null>(null);
  const [triggering, setTriggering] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState(log);

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function toggleCap(label: string) {
    setCaps(prev => prev.map(c => c.label === label
      ? { ...c, status: c.status === "active" ? "paused" : "active" }
      : c));
    const cap = caps.find(c => c.label === label);
    flash(cap?.status === "active" ? `${label} paused.` : `${label} resumed.`);
  }

  function trigger(type: "recall" | "waitlist") {
    setTriggering(type);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
      const entry = type === "recall"
        ? { time: now, event: "Manual recall wave triggered",  type: "Recall",   outcome: "42 overdue patients contacted via SMS + email" }
        : { time: now, event: "Waitlist optimizer triggered",   type: "Waitlist", outcome: "Scanning for open slots — 3 patients notified" };
      setActivityLog(prev => [entry, ...prev]);
      setTriggering(null);
      flash(type === "recall" ? "Recall wave started — 42 patients queued." : "Waitlist scan complete — 3 patients offered slots.");
    }, 1800);
  }

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm animate-in slide-in-from-top-2 duration-200">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold text-ink">Crown AI Agent</h1>
          <p className="mt-0.5 text-sm text-slate">Your autonomous dental operations team — running 24 / 7.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => trigger("recall")}
            disabled={!!triggering}
            className="flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2 text-sm font-semibold text-gold-deep hover:bg-gold/10 transition-colors disabled:opacity-60"
          >
            {triggering === "recall" ? <><Icons.Loader2 className="h-4 w-4 animate-spin" /> Running…</> : <><Icons.Megaphone className="h-4 w-4" /> Trigger recall wave</>}
          </button>
          <button
            onClick={() => trigger("waitlist")}
            disabled={!!triggering}
            className="flex items-center gap-2 rounded-lg border border-teal/30 bg-teal/5 px-4 py-2 text-sm font-semibold text-teal hover:bg-teal/10 transition-colors disabled:opacity-60"
          >
            {triggering === "waitlist" ? <><Icons.Loader2 className="h-4 w-4 animate-spin" /> Scanning…</> : <><Icons.CalendarSearch className="h-4 w-4" /> Fill waitlist</>}
          </button>
          <div className="flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/5 px-4 py-2.5">
            <span className="pulse-dot h-2 w-2 rounded-full bg-teal" />
            <span className="text-sm font-semibold text-teal">All systems active</span>
          </div>
        </div>
      </div>

      {/* Today's impact */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Calls handled",     v: "23",     s: "by AI voice agent" },
          { l: "Revenue recovered", v: "$5,240",  s: "waitlist + recalls" },
          { l: "Claims corrected",  v: "4",      s: "before submission" },
          { l: "Staff hours saved", v: "11.4 h", s: "today" },
        ].map((s) => (
          <div key={s.l} className="card bg-white rounded-xl p-5 shadow-card text-center">
            <p className="text-3xl font-semibold text-ink">{s.v}</p>
            <p className="mt-1 text-xs font-semibold text-gold-deep">{s.l}</p>
            <p className="text-[11px] text-slate">{s.s}</p>
          </div>
        ))}
      </div>

      {/* Capability cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {caps.map((c) => {
          const I = (Icons as any)[c.icon] ?? Icons.Bot;
          const isActive = c.status === "active";
          return (
            <div key={c.label} className={`card bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all ${!isActive ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isActive ? "bg-teal/10" : "bg-surface"}`}>
                  <I className={`h-5 w-5 ${isActive ? "text-teal" : "text-mist"}`} strokeWidth={1.5} />
                </div>
                <button
                  onClick={() => toggleCap(c.label)}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase transition-colors ${
                    isActive ? "bg-teal/10 text-teal hover:bg-teal/20" : "bg-surface text-mist hover:bg-gold/10 hover:text-gold-deep border border-line"
                  }`}
                  title={isActive ? "Click to pause" : "Click to enable"}
                >
                  {c.status}
                </button>
              </div>
              <h3 className="text-sm font-semibold text-ink">{c.label}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-slate">{c.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Activity log */}
      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <Icons.ActivitySquare className="h-4 w-4 text-gold-deep" />
          <span className="font-semibold text-ink">Activity Log — Today</span>
        </div>
        <div className="divide-y divide-line">
          {activityLog.map((l, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-surface transition-colors">
              <span className="w-12 shrink-0 font-mono text-xs text-mist pt-0.5">{l.time}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink">{l.event}</p>
                <p className="mt-0.5 text-xs text-slate">{l.outcome}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${typePill[l.type]}`}>
                {l.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
