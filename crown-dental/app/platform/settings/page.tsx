"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

type Field = { l: string; v: string; type: "text" | "textarea" | "number" | "select"; options?: string[] };

const sections: { title: string; icon: string; fields: Field[] }[] = [
  {
    title: "Practice Information",
    icon: "Building2",
    fields: [
      { l: "Practice name",  v: "Crown Kingston",   type: "text" },
      { l: "NPI number",     v: "1234567890",        type: "text" },
      { l: "Timezone",       v: "America/New_York",  type: "select", options: ["America/New_York","America/Chicago","America/Denver","America/Los_Angeles","Europe/London","Asia/Dubai"] },
      { l: "Currency",       v: "JMD (J$)",          type: "select", options: ["JMD (J$)","USD ($)","GBP (£)","EUR (€)"] },
    ],
  },
  {
    title: "AI Agent Configuration",
    icon: "Bot",
    fields: [
      { l: "Voice agent greeting",           v: "Hello, you've reached Crown Kingston…", type: "textarea" },
      { l: "Scheduling window (days out)",    v: "90",                                    type: "number" },
      { l: "AI recall cadence",              v: "3-touch: SMS → Email → Voice",          type: "select", options: ["3-touch: SMS → Email → Voice","2-touch: SMS → Email","1-touch: SMS only","1-touch: Email only"] },
    ],
  },
  {
    title: "Insurance & Billing",
    icon: "Banknote",
    fields: [
      { l: "Clearinghouse",        v: "Availity",    type: "select", options: ["Availity","Change Healthcare","Waystar","Dental Xchange"] },
      { l: "Default provider NPI", v: "9876543210",  type: "text" },
      { l: "In-house plan name",   v: "Crown Care+", type: "text" },
    ],
  },
  {
    title: "Compliance",
    icon: "ShieldCheck",
    fields: [
      { l: "Data residency region",  v: "US-East",  type: "select", options: ["US-East","US-West","EU-West","APAC"] },
      { l: "HIPAA BAA signed",       v: "Jul 2, 2026", type: "text" },
      { l: "Audit log retention",    v: "7 years",  type: "select", options: ["7 years","10 years","5 years","3 years"] },
    ],
  },
];

export default function SettingsPage() {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.l, f.v])))
  );
  const [saved, setSaved] = useState(false);

  function set(key: string, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
    setSaved(false);
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputCls = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-gold/60 focus:outline-none focus:ring-2 focus:ring-gold/10";

  return (
    <div className="p-6 space-y-5 max-w-3xl">
      <h1 className="text-xl font-semibold text-ink">Settings</h1>

      {saved && (
        <div className="flex items-center gap-3 rounded-xl bg-teal/10 border border-teal/20 px-4 py-3">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
          <p className="text-sm text-teal font-medium">Settings saved.</p>
        </div>
      )}

      {sections.map((s) => {
        const I = (Icons as any)[s.icon] ?? Icons.Circle;
        return (
          <div key={s.title} className="card bg-white p-6 shadow-card">
            <div className="flex items-center gap-2 mb-5">
              <I className="h-4 w-4 text-gold-deep" />
              <h2 className="text-sm font-semibold text-ink">{s.title}</h2>
            </div>
            <div className="space-y-4">
              {s.fields.map((f) => (
                <div key={f.l} className="grid grid-cols-[180px_1fr] items-start gap-4">
                  <label className="pt-2 text-sm text-slate">{f.l}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      rows={2}
                      value={values[f.l]}
                      onChange={(e) => set(f.l, e.target.value)}
                      className={`${inputCls} resize-none`}
                    />
                  ) : f.type === "select" ? (
                    <select
                      value={values[f.l]}
                      onChange={(e) => set(f.l, e.target.value)}
                      className={inputCls}
                    >
                      {(f.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      value={values[f.l]}
                      onChange={(e) => set(f.l, e.target.value)}
                      className={inputCls}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-2">
        <button onClick={save} className="gold-btn rounded-full px-6 py-2.5 text-sm shadow-gold transition hover:shadow-lg">
          Save changes
        </button>
      </div>
    </div>
  );
}
