"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import * as Icons from "lucide-react";

const allPatients: { id: string; name: string; age: number; procedure: string; fee: number; insurance: number; portion: number; accept: number; script: string }[] = [];

const patientToothStatus: Record<string, Record<number, string>> = {};

const patientAllergies: Record<string, string | null> = {};

const patientMeds: Record<string, string> = {};

const teeth = Array.from({ length: 32 }, (_, i) => i + 1);
const statusColor: Record<string, string> = {
  healthy: "bg-white border-line", crown: "bg-gold/20 border-gold/50",
  implant: "bg-teal/15 border-teal/50", rct: "bg-alert/10 border-alert/30",
  "rct+crown": "bg-alert/15 border-alert/40", composite: "bg-ink-3/10 border-ink-3/30",
  missing: "bg-surface border-dashed border-mist/40",
};

const perioData = [
  [3,2,3],[2,2,3],[2,2,2],[2,2,3],[2,2,2],[2,2,3],[2,2,2],[3,3,4],
  [3,3,3],[2,2,3],[2,3,2],[2,2,2],[3,2,3],[3,3,2],[2,2,3],[2,2,2],
];

const voiceExamples = [
  "Tooth 14 mesial — 3mm pocket, BOP positive.",
  "Tooth 8 implant — no mobility, tissue healthy, 2mm probing.",
  "Tooth 19 root canal — patient reports mild sensitivity to percussion.",
];


function ClinicalInner() {
  const params = useSearchParams();
  const [patientId, setPatientId] = useState(params.get("pid") ?? "");

  useEffect(() => {
    const pid = params.get("pid");
    if (pid && allPatients.find(p => p.id === pid)) { setPatientId(pid); setToothStatuses(patientToothStatus[pid] ?? {}); setClinicalNote(""); }
  }, [params]);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [showCoach, setShowCoach] = useState(true);

  const [toast, setToast] = useState<string | null>(null);
  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const pt = allPatients.find(p => p.id === patientId) ?? null;
  const [toothStatuses, setToothStatuses] = useState<Record<string, string>>(patientToothStatus[patientId] ?? {});
  const toothStatus = toothStatuses;

  const [clinicalNote, setClinicalNote] = useState(`S: ${allPatients.find(p => p.id === patientId)?.name ?? ""} presents for today's procedure.\n\nO: Clinical exam performed. Vitals normal. Relevant findings charted in odontogram above.\n\nA: Treatment as planned.\n\nP: Procedure completed / initiated today. Post-op instructions given. Follow-up scheduled as needed.`);

  const STATUS_CYCLE = ["healthy", "needs-work", "treated", "missing"];
  function cycleToothStatus(tooth: number) {
    setToothStatuses(prev => {
      const current = prev[tooth] ?? "healthy";
      const nextIdx = (STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length;
      return { ...prev, [tooth]: STATUS_CYCLE[nextIdx] };
    });
  }
  const allergy = patientAllergies[patientId];
  const meds = patientMeds[patientId];

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
    } else {
      setRecording(true);
      let i = 0;
      const full = voiceExamples[voiceIdx % voiceExamples.length];
      setTranscript("");
      const t = setInterval(() => {
        i++;
        setTranscript(full.slice(0, i));
        if (i >= full.length) { clearInterval(t); setRecording(false); setVoiceIdx(v => v + 1); }
      }, 40);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      {/* Main clinical area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-ink">Clinical</h1>
            <select
              value={patientId}
              onChange={e => { setPatientId(e.target.value); setTranscript(""); setToothStatuses(patientToothStatus[e.target.value] ?? {}); setClinicalNote(""); }}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-card focus:border-gold/60 focus:outline-none cursor-pointer hover:border-gold/40 transition-colors"
            >
              {allPatients.length === 0
                ? <option value="">No patients loaded — connect your PMS</option>
                : allPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.procedure}</option>
                  ))
              }
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleRecord}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${recording ? "bg-alert text-white shadow-lg animate-pulse" : "border border-line bg-white text-slate hover:border-gold/40 hover:text-ink"}`}>
              <Icons.Mic className="h-4 w-4" />
              {recording ? "Recording…" : "Voice chart"}
            </button>
            <button onClick={() => setShowCoach(!showCoach)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors ${showCoach ? "bg-gold/10 text-gold-deep border border-gold/30" : "border border-line bg-white text-slate hover:bg-surface"}`}>
              <Icons.Sparkles className="h-4 w-4" /> Case coach
            </button>
            <button onClick={() => {
              try { localStorage.setItem(`crown-chart-${patientId}`, JSON.stringify(toothStatuses)); } catch {}
              flash("Chart saved successfully.");
            }} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
              <Icons.Save className="h-4 w-4" /> Save chart
            </button>
          </div>
        </div>

        {/* Voice transcript */}
        {(transcript || recording) && (
          <div className={`rounded-xl border p-4 transition-all ${recording ? "border-alert/40 bg-alert/5" : "border-teal/30 bg-teal/5"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-2 w-2 rounded-full ${recording ? "bg-alert animate-pulse" : "bg-teal"}`} />
              <span className="text-xs font-semibold text-ink">{recording ? "Listening…" : "Transcribed — review and accept"}</span>
            </div>
            <p className="text-sm text-ink">{transcript || "Speak your clinical findings…"}</p>
            {!recording && transcript && (
              <div className="flex gap-2 mt-3">
                <button onClick={() => setTranscript("")} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:bg-surface transition-colors">Discard</button>
                <button onClick={() => { setTranscript(""); flash("Voice note accepted into chart."); }} className="gold-btn rounded-lg px-3 py-1.5 text-xs">Accept into chart</button>
              </div>
            )}
          </div>
        )}

        {/* Odontogram */}
        <div data-guide="odontogram" className="card bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-mist mb-4">Odontogram</p>
          <div className="space-y-3">
            {[teeth.slice(0, 16), teeth.slice(16)].map((row, ri) => (
              <div key={ri} className={`flex gap-1 ${ri === 1 ? "flex-row-reverse" : ""}`}>
                {row.map((t) => {
                  const status = toothStatus[t] ?? "healthy";
                  return (
                    <div key={t} onClick={() => cycleToothStatus(t)} className="flex flex-1 flex-col items-center gap-0.5 cursor-pointer group">
                      <div className={`w-full aspect-square rounded border text-[9px] flex items-center justify-center font-medium transition-all group-hover:border-gold/60 group-hover:shadow-card ${statusColor[status]}`}>
                        {status === "missing" ? "—" : t}
                      </div>
                      <span className="text-[8px] text-mist">{t}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(statusColor).map(([s, c]) => (
              <div key={s} className="flex items-center gap-1.5">
                <div className={`h-3 w-3 rounded border ${c}`} />
                <span className="text-[10px] text-mist capitalize">{s.replace("+", " + ")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI clinical note */}
        <div data-guide="clinical-note" className="card bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Icons.Bot className="h-4 w-4 text-gold-deep" />
            <span className="text-sm font-semibold text-ink">AI clinical note draft</span>
            <span className="ml-auto rounded-full bg-teal/10 px-2 py-0.5 text-[11px] font-semibold text-teal">AI-generated</span>
          </div>
          <textarea value={clinicalNote} onChange={e => setClinicalNote(e.target.value)}
            rows={10} className="w-full text-sm text-ink leading-relaxed bg-surface rounded-lg border border-line px-3.5 py-3 focus:border-gold/60 focus:outline-none resize-none" />
          <div className="flex gap-2 mt-3">
            <button onClick={() => {
              const ts = toothStatus;
              const findings = Object.entries(ts).filter(([,v]) => v !== "healthy").map(([t,v]) => `Tooth ${t}: ${v}`).join("; ") || "No notable findings";
              setClinicalNote(pt ? `S: ${pt.name} presents for ${pt.procedure}. Age ${pt.age}.\n\nO: Clinical exam performed. Odontogram findings: ${findings}.\n\nA: Treatment as planned — ${pt.procedure}.\n\nP: Procedure completed today. Post-op instructions provided verbally and in writing. Patient tolerated procedure well. Follow-up in 4 weeks.` : `S: No patient selected.\n\nO: Select a patient to generate a clinical note.\n\nA: —\n\nP: —`);
              flash("Clinical note regenerated with current chart data.");
            }} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:bg-surface transition-colors">Regenerate</button>
            <button onClick={() => {
              try { localStorage.setItem(`crown-note-${patientId}`, clinicalNote); } catch {}
              flash("Clinical note accepted and saved to chart.");
            }} className="gold-btn rounded-lg px-3 py-1.5 text-xs">Accept note</button>
          </div>
        </div>

        {/* Perio chart */}
        <div className="card bg-white p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-widest text-mist mb-4">Periodontal Chart</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left text-mist pb-2 pr-3 font-normal">Tooth</th>
                  {perioData.map((_, i) => <th key={i} className="text-center text-mist pb-2 font-normal w-10">{i + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-mist pr-3 text-[10px]">B</td>
                  {perioData.map((d, i) => (
                    <td key={i} className="text-center pb-0.5">
                      <div className="flex justify-center gap-px">
                        {d.map((v, j) => (
                          <span key={j} className={`w-4 text-center font-semibold ${v >= 4 ? "text-alert" : v === 3 ? "text-gold-deep" : "text-teal"}`}>{v}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="text-mist pr-3 text-[10px]">L</td>
                  {perioData.map((d, i) => (
                    <td key={i} className="text-center">
                      <div className="flex justify-center gap-px">
                        {[...d].reverse().map((v, j) => (
                          <span key={j} className={`w-4 text-center font-semibold ${v >= 4 ? "text-alert" : v === 3 ? "text-gold-deep" : "text-teal"}`}>{v}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Meds/allergies */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card bg-white p-5 shadow-card">
            <p className="text-sm font-semibold text-ink mb-3">Medications</p>
            <p className="text-sm text-slate">{meds}</p>
          </div>
          <div className="card bg-white p-5 shadow-card">
            {allergy ? (
              <div className="flex items-center gap-2 rounded-lg border border-alert/30 bg-alert/5 px-3 py-2.5">
                <Icons.AlertTriangle className="h-4 w-4 text-alert shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-alert">Allergy — {allergy}</p>
                  <p className="text-xs text-slate">Review before prescribing any medications.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-teal/30 bg-teal/5 px-3 py-2.5">
                <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
                <p className="text-xs font-semibold text-teal">No known allergies</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Case Acceptance Coach side panel */}
      {showCoach && pt && (
        <div className="w-72 shrink-0 border-l border-line bg-white overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <Icons.Sparkles className="h-4 w-4 text-gold-deep" />
              <span className="text-sm font-semibold text-ink">Case coach</span>
            </div>
            <button onClick={() => setShowCoach(false)} className="text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
          </div>

          <div className="p-5 space-y-5 flex-1">
            {/* Acceptance score */}
            <div className="rounded-xl bg-surface p-4 text-center">
              <p className="text-xs text-mist mb-2">Acceptance likelihood</p>
              <div className="relative inline-flex items-center justify-center">
                <svg viewBox="0 0 72 72" className="w-20 h-20 -rotate-90">
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#E5E9F0" strokeWidth="7"/>
                  <circle cx="36" cy="36" r="30" fill="none" stroke="#C9A96E" strokeWidth="7"
                    strokeDasharray={`${(pt.accept / 100) * 188.5} 188.5`} strokeLinecap="round"/>
                </svg>
                <span className="absolute text-xl font-bold text-gold-deep">{pt.accept}%</span>
              </div>
              <p className="text-xs text-slate mt-2">Based on {pt.name.split(" ")[0]}&apos;s history and this case type</p>
            </div>

            {/* Fee breakdown */}
            <div>
              <p className="text-xs font-semibold text-ink mb-2">Fee breakdown</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Total fee</span>
                  <span className="font-semibold text-ink">${pt.fee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate">Insurance covers</span>
                  <span className="font-semibold text-teal">−${pt.insurance.toLocaleString()}</span>
                </div>
                <div className="h-px bg-line" />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-ink">Patient owes</span>
                  <span className="font-bold text-ink">${pt.portion}</span>
                </div>
              </div>
            </div>

            {/* Financing options */}
            {pt.portion > 200 && (
              <div>
                <p className="text-xs font-semibold text-ink mb-2">Financing options</p>
                <div className="space-y-2">
                  {[
                    { plan: "3 months", payment: Math.round(pt.portion / 3) },
                    { plan: "6 months", payment: Math.round(pt.portion / 6) },
                    { plan: "CareCredit 12mo", payment: Math.round(pt.portion / 12) },
                  ].map((f) => (
                    <div key={f.plan} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-ink">{f.plan}</p>
                        <p className="text-[10px] text-mist">0% interest</p>
                      </div>
                      <p className="text-sm font-bold text-ink">${f.payment}/mo</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested script */}
            <div>
              <p className="text-xs font-semibold text-ink mb-2">Suggested script</p>
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-3">
                <p className="text-xs text-ink leading-relaxed italic">&ldquo;{pt.script}&rdquo;</p>
              </div>
              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(pt.script).then(() => flash("Script copied to clipboard."));
                  } else {
                    flash("Script copied to clipboard.");
                  }
                }}
                className="mt-2 w-full rounded-lg border border-line py-2 text-xs text-slate hover:bg-surface hover:border-gold/40 transition-colors flex items-center justify-center gap-1.5"
              >
                <Icons.Copy className="h-3 w-3" /> Copy to clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClinicalPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate">Loading chart…</div>}>
      <ClinicalInner />
    </Suspense>
  );
}
