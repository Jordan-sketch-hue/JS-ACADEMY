"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const automations = [
  { id: "a1", name: "Recall Reminder",          trigger: "6 months since last visit",   action: "Send SMS + Email",        runs: 2840, status: true,  category: "Recall"    },
  { id: "a2", name: "Appointment Confirmation", trigger: "48h before appointment",       action: "Send SMS confirmation",   runs: 1240, status: true,  category: "Scheduling" },
  { id: "a3", name: "Post-Visit Review Ask",    trigger: "2h after appointment ends",    action: "Send Google review link", runs: 892,  status: true,  category: "Reviews"    },
  { id: "a4", name: "Missed Appointment",       trigger: "Patient no-shows",             action: "SMS + reschedule link",   runs: 134,  status: true,  category: "Scheduling" },
  { id: "a5", name: "Birthday Offer",           trigger: "Patient birthday (day before)",action: "Send email promo",        runs: 312,  status: false, category: "Marketing"  },
  { id: "a6", name: "Treatment Plan Follow-up", trigger: "3 days after plan presented",  action: "Send acceptance nudge",   runs: 188,  status: true,  category: "Clinical"   },
  { id: "a7", name: "Insurance Expiry Alert",   trigger: "30 days before plan expires",  action: "Notify front desk",       runs: 96,   status: false, category: "Insurance"  },
  { id: "a8", name: "New Patient Welcome",      trigger: "First appointment confirmed",   action: "Send welcome packet SMS", runs: 214,  status: true,  category: "Intake"     },
];

const categoryColors: Record<string, string> = {
  Recall:    "bg-teal/10 text-teal",
  Scheduling:"bg-gold/10 text-gold-deep",
  Reviews:   "bg-purple-50 text-purple-700",
  Marketing: "bg-pink-50 text-pink-700",
  Clinical:  "bg-ink/8 text-ink",
  Insurance: "bg-blue-50 text-blue-700",
  Intake:    "bg-green-50 text-green-700",
};

export default function AutomationPage() {
  const [autoList, setAutoList] = useState(automations);
  const [statuses, setStatuses] = useState<Record<string, boolean>>(
    Object.fromEntries(automations.map(a => [a.id, a.status]))
  );
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(autoList.map(a => a.category)))];
  const visible = filter === "All" ? autoList : autoList.filter(a => a.category === filter);
  const activeCount = Object.values(statuses).filter(Boolean).length;
  const totalRuns = autoList.reduce((s, a) => s + a.runs, 0);
  const [toast, setToast] = useState<string | null>(null);
  const [editAuto, setEditAuto] = useState<typeof automations[0] | null>(null);
  const [editName, setEditName] = useState("");
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }
  function openEditAuto(a: typeof automations[0]) { setEditAuto(a); setEditName(a.name); }
  function saveEditAuto() {
    if (!editAuto || !editName.trim()) return;
    setAutoList(prev => prev.map(a => a.id === editAuto.id ? { ...a, name: editName.trim() } : a));
    setEditAuto(null);
    flash("Automation updated.");
  }

  function createImplantAutomation() {
    const newId = `a${autoList.length + 1}`;
    const newAuto = {
      id: newId,
      name: "Unscheduled Implant Patient Nudge",
      trigger: "Implant plan accepted, no appointment booked",
      action: "Send 'Ready to schedule?' SMS",
      runs: 0,
      status: true,
      category: "Clinical",
    };
    setAutoList(prev => [newAuto, ...prev]);
    setStatuses(prev => ({ ...prev, [newId]: true }));
    flash("Automation created: Unscheduled Implant Patient Nudge — now live.");
  }

  function toggle(id: string) {
    setStatuses(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      {editAuto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setEditAuto(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Edit Automation</span>
              <button onClick={() => setEditAuto(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate mb-0.5">Trigger</p>
                <p className="text-sm text-slate">{editAuto.trigger}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate mb-0.5">Action</p>
                <p className="text-sm text-slate">{editAuto.action}</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setEditAuto(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={saveEditAuto} disabled={!editName.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Save</button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Automation</h1>
          <p className="mt-1 text-sm text-slate">
            <span className="text-teal font-semibold">{activeCount} live</span> automations · {totalRuns.toLocaleString()} total runs
          </p>
        </div>
        <button onClick={createImplantAutomation} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Plus className="h-4 w-4" /> New Automation
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active",           value: String(activeCount),           icon: "Zap",          color: "text-teal" },
          { label: "Runs This Month",  value: "1,840",                       icon: "RefreshCw",    color: "text-ink" },
          { label: "Patients Reached", value: "612",                         icon: "Users",        color: "text-gold-deep" },
          { label: "Est. Revenue",     value: "$24,400",                     icon: "TrendingUp",   color: "text-teal" },
        ].map(s => {
          const I = (Icons as any)[s.icon];
          return (
            <div key={s.label} className="card bg-white p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <I className={`h-4 w-4 ${s.color}`} strokeWidth={1.5} />
                <p className="text-xs text-slate">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-ink">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === c ? "bg-ink text-white" : "bg-surface border border-line text-slate hover:border-gold/40 hover:text-ink"
            }`}>
            {c}
          </button>
        ))}
      </div>

      {/* Automation list */}
      <div className="card overflow-hidden bg-white shadow-card">
        <div className="divide-y divide-line">
          {visible.map(auto => {
            const on = statuses[auto.id];
            return (
              <div key={auto.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${on ? "hover:bg-surface" : "bg-surface/50 opacity-70 hover:opacity-100"}`}>
                {/* Toggle */}
                <button
                  onClick={() => toggle(auto.id)}
                  className={`relative h-5 w-9 rounded-full transition-colors shrink-0 ${on ? "bg-teal" : "bg-line"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : ""}`} />
                </button>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface border border-line shrink-0">
                  <Icons.Bot className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="text-sm font-semibold text-ink">{auto.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColors[auto.category]}`}>{auto.category}</span>
                    {on && <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-teal/10 text-teal">LIVE</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-slate">
                    <span className="text-mist">Trigger:</span> {auto.trigger} →{" "}
                    <span className="text-mist">Action:</span> {auto.action}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-ink">{auto.runs.toLocaleString()}</p>
                  <p className="text-[10px] text-slate">total runs</p>
                </div>

                <button onClick={() => openEditAuto(auto)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors shrink-0">
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI suggestion */}
      <div className="card bg-gradient-to-r from-ink to-ink/90 p-5 shadow-card text-white">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 shrink-0">
            <Icons.Sparkles className="h-5 w-5 text-gold" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">AI Suggestion</p>
            <p className="mt-1 text-sm text-white/70">
              12 patients who accepted implant plans haven&rsquo;t scheduled yet. An automated &ldquo;Ready to schedule?&rdquo; nudge could recover ~$48,000.
            </p>
          </div>
          <button onClick={createImplantAutomation} className="gold-btn rounded-lg px-4 py-2 text-sm shrink-0">
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
