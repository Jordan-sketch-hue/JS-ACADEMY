"use client";
import { useState } from "react";
import Link from "next/link";
import * as Icons from "lucide-react";

const patientIdMap: Record<string, string> = {};

const PATIENTS: string[] = [];
const PROVIDERS: string[] = [];

const initialPlans: { id: string; name: string; created: string; procedures: string[]; total: number; insurance: number; ptPortion: number; status: string; provider: string }[] = [];

const statusStyles: Record<string, string> = {
  proposed:  "bg-gold/10 text-gold-deep",
  accepted:  "bg-teal/10 text-teal",
  scheduled: "bg-ink/8 text-ink",
  completed: "bg-slate/10 text-slate",
  paid:      "bg-surface text-mist border border-line",
};

const workflow = ["Proposed", "Accepted", "Scheduled", "Completed", "Paid"];

export default function TreatmentPlansPage() {
  const [planList, setPlanList] = useState(initialPlans);
  const [toast, setToast] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ patient: "", procedure: "", total: "", insurance: "", provider: "" });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function addPlan() {
    if (!form.patient || !form.procedure || !form.total) return;
    const pt = Number(form.total) - Number(form.insurance || 0);
    setPlanList(prev => [{
      id: `tp${prev.length + 1}`,
      name: form.patient,
      created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      procedures: [form.procedure],
      total: Number(form.total),
      insurance: Number(form.insurance || 0),
      ptPortion: pt,
      status: "proposed",
      provider: form.provider,
    }, ...prev]);
    setForm({ patient: "", procedure: "", total: "", insurance: "", provider: "" });
    setShowNew(false);
    flash(`Treatment plan created for ${form.patient}.`);
  }

  function present(id: string, name: string) {
    setPlanList(prev => prev.map(p => p.id === id ? { ...p, status: "accepted" } : p));
    flash(`${name} accepted the treatment plan.`);
  }

  const accepted = planList.filter(p => p.status === "accepted").reduce((s, p) => s + p.total, 0);
  const proposed = planList.filter(p => p.status === "proposed").reduce((s, p) => s + p.total, 0);

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.ClipboardCheck className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">New Treatment Plan</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Patient <span className="text-alert">*</span></label>
                <select value={form.patient} onChange={e => setForm(f => ({...f, patient: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  <option value="">Select patient…</option>
                  {PATIENTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Procedure(s) <span className="text-alert">*</span></label>
                <input type="text" value={form.procedure} onChange={e => setForm(f => ({...f, procedure: e.target.value}))}
                  placeholder="e.g. Implant #8, Crown #14…"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Total ($) <span className="text-alert">*</span></label>
                  <input type="number" value={form.total} onChange={e => setForm(f => ({...f, total: e.target.value}))}
                    placeholder="0"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Insurance covers ($)</label>
                  <input type="number" value={form.insurance} onChange={e => setForm(f => ({...f, insurance: e.target.value}))}
                    placeholder="0"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Provider</label>
                <select value={form.provider} onChange={e => setForm(f => ({...f, provider: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {PROVIDERS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addPlan} disabled={!form.patient || !form.procedure || !form.total} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Create Plan</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Treatment Plans</h1>
          <p className="mt-1 text-sm text-slate">
            {planList.length} active plans · <span className="font-semibold text-teal">${accepted.toLocaleString()} accepted</span> · <span className="font-semibold text-gold-deep">${proposed.toLocaleString()} proposed</span>
          </p>
        </div>
        <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Plus className="h-4 w-4" /> New Plan
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {workflow.map((stage, i) => {
          const count = planList.filter(p => p.status === stage.toLowerCase()).length;
          return (
            <div key={stage} className="card bg-white p-3 text-center">
              <div className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                i === 0 ? "bg-gold/15 text-gold-deep" :
                i === 1 ? "bg-teal/10 text-teal" :
                i === 2 ? "bg-ink/8 text-ink" :
                "bg-surface text-slate"
              }`}>{count}</div>
              <p className="text-xs font-medium text-ink">{stage}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Icons.ClipboardCheck className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
            <span className="font-semibold text-ink">All Plans</span>
          </div>
        </div>
        <div className="divide-y divide-line">
          {planList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <Icons.ClipboardCheck className="h-7 w-7 text-mist" strokeWidth={1.5} />
              </div>
              <p className="font-semibold text-ink">No treatment plans yet</p>
              <p className="mt-1 text-sm text-slate">Data will appear here once connected to your practice system.</p>
            </div>
          ) : (
            planList.map((plan) => (
              <div key={plan.id} className="flex items-center gap-5 px-5 py-4 hover:bg-surface transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <p className="text-sm font-semibold text-ink">{plan.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[plan.status]}`}>{plan.status}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate">{plan.procedures.join(" · ")}</p>
                  <p className="mt-0.5 text-[10px] text-mist">{plan.provider} · Created {plan.created}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-ink">${plan.total.toLocaleString()}</p>
                  <p className="text-[10px] text-slate">Ins: ${plan.insurance.toLocaleString()} · Pt: ${plan.ptPortion.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/platform/patients/${patientIdMap[plan.name] ?? "search"}`} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">View</Link>
                  {plan.status === "proposed" && (
                    <button onClick={() => present(plan.id, plan.name)} className="gold-btn rounded-lg px-3 py-1.5 text-xs">Present</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Treatment Acceptance Rate", value: "68%", sub: "Industry avg: 52%", up: true },
          { label: "Avg Plan Value", value: "$3,536", sub: "Per accepted plan", up: true },
          { label: "Pending Revenue", value: `$${proposed.toLocaleString()}`, sub: "Proposed, not yet accepted", up: false },
        ].map((s) => (
          <div key={s.label} className="card bg-white p-5 shadow-card">
            <p className="text-xs font-medium text-slate">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-ink">{s.value}</p>
            <p className={`mt-1 text-xs ${s.up ? "text-teal" : "text-gold-deep"}`}>{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

