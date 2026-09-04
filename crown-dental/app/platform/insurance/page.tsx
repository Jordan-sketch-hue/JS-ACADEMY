"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const PATIENTS: string[] = [];
const PROVIDERS = ["Delta Dental","Cigna","United HC","Humana","Aetna","Guardian","MetLife","Self-pay"];
const PROCEDURES = ["D2740 – Crown","D1110 – Prophylaxis","D4341 – SRP","D2150 – Amalgam","D0210 – Full X-ray","D7210 – Extraction","D8080 – Ortho Treatment","D2391 – Composite x2"];

const eligResults: Record<string, { deductible: string; remaining: string; maxBenefit: string; covered: string[] }> = {};

const initialClaims: { id: string; patient: string; provider: string; procedure: string; submitted: string; amount: number; status: string; paid: number }[] = [];

const statusStyle: Record<string, string> = {
  pending:  "bg-gold/10 text-gold-deep",
  approved: "bg-teal/10 text-teal",
  paid:     "bg-slate/10 text-slate",
  denied:   "bg-red-50 text-red-600",
  appealed: "bg-purple-50 text-purple-700",
};

const kpis = [
  { label: "Outstanding AR",   value: "$14,280", sub: "Across 23 claims",     icon: "Banknote",    up: false },
  { label: "Collected MTD",    value: "$48,600", sub: "+12% vs last month",   icon: "TrendingUp",  up: true  },
  { label: "Claims Pending",   value: "7",       sub: "Avg 8 days in queue",  icon: "Clock",       up: false },
  { label: "Clean Claim Rate", value: "94.2%",   sub: "Industry avg: 88%",   icon: "CheckCircle", up: true  },
];

export default function InsurancePage() {
  const [filter, setFilter] = useState("All");
  const [claims, setClaims] = useState(initialClaims);
  const [claimStatuses, setClaimStatuses] = useState<Record<string, string>>(
    Object.fromEntries(initialClaims.map(c => [c.id, c.status]))
  );
  const [toast, setToast] = useState<string | null>(null);
  const [showElig, setShowElig] = useState(false);
  const [eligPatient, setEligPatient] = useState(PATIENTS[0]);
  const [eligResult, setEligResult] = useState<(typeof eligResults)[string] | null>(null);
  const [showClaim, setShowClaim] = useState(false);
  const [claimForm, setClaimForm] = useState({ patient: PATIENTS[0], provider: PROVIDERS[0], procedure: PROCEDURES[0], amount: "" });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function appealClaim(id: string) {
    setClaimStatuses(prev => ({ ...prev, [id]: "appealed" }));
  }

  function checkEligibility() {
    setEligResult(eligResults[eligPatient] ?? { deductible: "N/A", remaining: "N/A", maxBenefit: "N/A", covered: ["No data available"] });
  }

  function submitClaim() {
    if (!claimForm.amount) return;
    const id = `CLM-${2842 + claims.length}`;
    const newClaim = { id, patient: claimForm.patient, provider: claimForm.provider, procedure: claimForm.procedure, submitted: "Today", amount: Number(claimForm.amount), status: "pending", paid: 0 };
    setClaims(prev => [newClaim, ...prev]);
    setClaimStatuses(prev => ({ ...prev, [id]: "pending" }));
    setShowClaim(false);
    flash(`Claim ${id} submitted for ${claimForm.patient}.`);
  }

  const visible = filter === "All"
    ? claims
    : claims.filter(c => (claimStatuses[c.id] ?? c.status).toLowerCase() === filter.toLowerCase());

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      {/* Eligibility modal */}
      {showElig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowElig(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.Search className="h-4 w-4 text-gold-deep" />
                <span className="font-semibold text-ink">Verify Eligibility</span>
              </div>
              <button onClick={() => { setShowElig(false); setEligResult(null); }} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Patient</label>
                <select value={eligPatient} onChange={e => { setEligPatient(e.target.value); setEligResult(null); }}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {PATIENTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              {eligResult && (
                <div className="rounded-xl bg-teal/5 border border-teal/20 p-4 space-y-2">
                  <p className="text-xs font-semibold text-teal mb-2">Eligibility Verified</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-[10px] text-mist">Deductible</p><p className="text-sm font-bold text-ink">{eligResult.deductible}</p></div>
                    <div><p className="text-[10px] text-mist">Remaining</p><p className="text-sm font-bold text-ink">{eligResult.remaining}</p></div>
                    <div><p className="text-[10px] text-mist">Max Benefit</p><p className="text-sm font-bold text-ink">{eligResult.maxBenefit}</p></div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {eligResult.covered.map(c => <span key={c} className="rounded-full bg-teal/10 px-2 py-0.5 text-[10px] text-teal font-semibold">{c}</span>)}
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => { setShowElig(false); setEligResult(null); }} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Close</button>
              <button onClick={checkEligibility} className="flex-1 gold-btn rounded-xl py-2.5 text-sm">Check Now</button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Claim modal */}
      {showClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowClaim(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.Plus className="h-4 w-4 text-gold-deep" />
                <span className="font-semibold text-ink">Submit Claim</span>
              </div>
              <button onClick={() => setShowClaim(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: "Patient", key: "patient", options: PATIENTS },
                { label: "Insurance Provider", key: "provider", options: PROVIDERS },
                { label: "Procedure", key: "procedure", options: PROCEDURES },
              ].map(({ label, key, options }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate mb-1.5">{label}</label>
                  <select value={(claimForm as any)[key]} onChange={e => setClaimForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Claim Amount ($) <span className="text-alert">*</span></label>
                <input type="number" value={claimForm.amount} onChange={e => setClaimForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowClaim(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={submitClaim} disabled={!claimForm.amount} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Submit</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Insurance</h1>
          <p className="mt-1 text-sm text-slate">Claims, eligibility, EOBs, and pre-authorizations.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setShowElig(true); setEligResult(null); }}
            className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-ink hover:border-gold/40 transition-colors"
          >
            <Icons.Search className="h-4 w-4" strokeWidth={1.5} />
            Verify Eligibility
          </button>
          <button
            onClick={() => setShowClaim(true)}
            className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm"
          >
            <Icons.Plus className="h-4 w-4" />
            Submit Claim
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => {
          const I = (Icons as any)[k.icon] ?? Icons.Circle;
          return (
            <div key={k.label} className="card bg-white p-5 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate">{k.label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/8">
                  <I className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-ink">{k.value}</p>
              <p className={`mt-1 text-xs ${k.up ? "text-teal" : "text-slate"}`}>{k.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Icons.Shield className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
            <span className="font-semibold text-ink">Claims</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {["All", "Pending", "Approved", "Denied"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === f ? "bg-ink text-white" : "text-slate hover:bg-surface hover:text-ink"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                {["Claim ID", "Patient", "Insurance Provider", "Procedure", "Submitted", "Amount", "Paid", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-mist">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                        <Icons.Shield className="h-7 w-7 text-mist" strokeWidth={1.5} />
                      </div>
                      <p className="font-semibold text-ink">No claims yet</p>
                      <p className="mt-1 text-sm text-slate">Data will appear here once connected to your practice system.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                visible.map((c) => {
                  const st = claimStatuses[c.id] ?? c.status;
                  return (
                    <tr key={c.id} className="hover:bg-surface transition-colors">
                      <td className="px-4 py-3.5 font-mono text-xs text-slate">{c.id}</td>
                      <td className="px-4 py-3.5 font-medium text-ink">{c.patient}</td>
                      <td className="px-4 py-3.5 text-xs text-slate">{c.provider}</td>
                      <td className="px-4 py-3.5 text-xs text-slate">{c.procedure}</td>
                      <td className="px-4 py-3.5 text-xs text-mist">{c.submitted}</td>
                      <td className="px-4 py-3.5 font-semibold text-ink">${c.amount}</td>
                      <td className="px-4 py-3.5 text-xs text-teal">{c.paid > 0 ? `$${c.paid}` : "—"}</td>
                      <td className="px-4 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusStyle[st]}`}>{st}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => st === "denied" && appealClaim(c.id)}
                          className={`rounded border px-2 py-0.5 text-[10px] transition-colors ${
                            st === "denied" ? "border-red-200 text-red-600 hover:bg-red-50"
                            : st === "appealed" ? "border-purple-200 text-purple-600 cursor-default"
                            : "border-line text-slate hover:border-gold/40 hover:text-ink"
                          }`}>
                          {st === "denied" ? "Appeal" : st === "appealed" ? "Appealed" : "View EOB"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card bg-white p-5 shadow-card">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-mist">Pre-Authorizations Pending</p>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="font-semibold text-ink">No pre-authorizations pending</p>
          <p className="mt-1 text-sm text-slate">Pre-auth requests will appear here once your PMS is connected.</p>
        </div>
      </div>
    </div>
  );
}
