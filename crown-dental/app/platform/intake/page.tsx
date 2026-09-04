"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

type Field = { id: string; label: string; type: "text" | "select" | "radio" | "checkbox" | "signature"; required?: boolean; options?: string[]; branch?: { value: string; show: Field[] } };

const baseFields: Field[] = [
  { id: "name",    label: "Full legal name",        type: "text",   required: true },
  { id: "dob",     label: "Date of birth",           type: "text",   required: true },
  { id: "phone",   label: "Mobile number",           type: "text",   required: true },
  { id: "email",   label: "Email address",           type: "text",   required: true },
  { id: "ins",     label: "Do you have dental insurance?", type: "radio", options: ["Yes", "No"],
    branch: { value: "Yes", show: [
      { id: "ins_name",   label: "Insurance provider",     type: "text" },
      { id: "ins_id",     label: "Member ID",              type: "text" },
      { id: "ins_group",  label: "Group number",           type: "text" },
    ]}
  },
  { id: "diabetes", label: "Do you have diabetes?", type: "radio", options: ["Yes", "No"],
    branch: { value: "Yes", show: [
      { id: "dm_type",    label: "Type 1 or Type 2?",      type: "select", options: ["Type 1", "Type 2", "Pre-diabetic"] },
      { id: "dm_control", label: "Is it currently controlled?", type: "radio", options: ["Yes", "No"] },
      { id: "last_a1c",   label: "Last HbA1c value (if known)", type: "text" },
    ]}
  },
  { id: "meds",    label: "Are you currently taking any medications?", type: "radio", options: ["Yes", "No"],
    branch: { value: "Yes", show: [
      { id: "med_list", label: "List all medications and dosages", type: "text" },
    ]}
  },
  { id: "allergies",label: "Do you have any drug allergies?", type: "radio", options: ["Yes", "No"],
    branch: { value: "Yes", show: [
      { id: "allergy_list", label: "List all allergies and reactions", type: "text" },
    ]}
  },
  { id: "anxiety",  label: "Do you experience dental anxiety?", type: "radio", options: ["Yes — severe", "Yes — mild", "No"] },
  { id: "consent",  label: "I consent to treatment and authorize Crown to bill my insurance.", type: "checkbox", required: true },
  { id: "sig",      label: "Patient signature", type: "signature", required: true },
];

function FieldPreview({ field, depth = 0 }: { field: Field; depth?: number }) {
  const [radioVal, setRadioVal] = useState("");
  return (
    <div className={`${depth > 0 ? "ml-5 border-l-2 border-gold/30 pl-4" : ""}`}>
      <div className={`mb-4 ${depth > 0 ? "mt-3" : ""}`}>
        <label className="block text-sm font-medium text-ink mb-1.5">
          {field.label} {field.required && <span className="text-alert">*</span>}
        </label>
        {field.type === "text" && (
          <input className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" placeholder="Enter here…" />
        )}
        {field.type === "select" && field.options && (
          <select className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:border-gold/60 focus:outline-none">
            <option value="">Select…</option>
            {field.options.map(o => <option key={o}>{o}</option>)}
          </select>
        )}
        {field.type === "radio" && field.options && (
          <div className="flex flex-wrap gap-2">
            {field.options.map((o) => (
              <label key={o} onClick={() => setRadioVal(o)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${radioVal === o ? "border-gold/60 bg-gold/5" : "border-line bg-white hover:border-gold/40"}`}>
                <div className={`h-3.5 w-3.5 rounded-full border-2 flex items-center justify-center ${radioVal === o ? "border-gold-deep" : "border-mist"}`}>
                  {radioVal === o && <div className="h-1.5 w-1.5 rounded-full bg-gold-deep" />}
                </div>
                <span className="text-sm text-ink">{o}</span>
              </label>
            ))}
          </div>
        )}
        {field.type === "checkbox" && (
          <label className="flex items-start gap-3 rounded-lg border border-line bg-surface px-3 py-3 cursor-pointer hover:border-gold/40 transition-colors">
            <input type="checkbox" className="accent-gold-deep mt-0.5" />
            <span className="text-sm text-slate">{field.label}</span>
          </label>
        )}
        {field.type === "signature" && (
          <div className="h-20 rounded-lg border border-dashed border-gold/40 bg-gold/5 flex items-center justify-center text-sm text-gold-deep">
            <Icons.PenLine className="h-4 w-4 mr-2" /> Tap to sign
          </div>
        )}
      </div>
      {field.branch && radioVal === field.branch.value && (
        <div className="space-y-0">
          {field.branch.show.map(f => <FieldPreview key={f.id} field={f} depth={depth + 1} />)}
        </div>
      )}
    </div>
  );
}

const PATIENTS: string[] = [];
const NEW_FIELD_TYPES = ["text", "radio", "checkbox", "select", "signature"] as const;

export default function IntakePage() {
  const [view, setView] = useState<"builder" | "preview">("builder");
  const [toast, setToast] = useState<string | null>(null);
  const [fields, setFields] = useState<Field[]>(baseFields);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [sendPatient, setSendPatient] = useState(PATIENTS[0] ?? "");
  const [settings, setSettings] = useState<Record<string, boolean>>({
    "eSignature required": true,
    "Pre-fill from prior visit": true,
    "Send via SMS link": true,
    "HIPAA-secure submission": true,
    "Expire after 48 hours": false,
  });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function removeField(id: string) {
    setFields(prev => prev.filter(f => f.id !== id));
    flash("Field removed.");
  }

  function startEdit(f: Field) {
    setEditingId(f.id);
    setEditLabel(f.label);
  }

  function saveEdit() {
    if (!editLabel.trim()) return;
    setFields(prev => prev.map(f => f.id === editingId ? { ...f, label: editLabel.trim() } : f));
    setEditingId(null);
    flash("Field label updated.");
  }

  function addField() {
    const id = `custom_${Date.now()}`;
    setFields(prev => [...prev.slice(0, -1), { id, label: "New question", type: "text" }, ...prev.slice(-1)]);
    setEditingId(id);
    setEditLabel("New question");
    flash("Field added — click the label to edit.");
  }
  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Smart Intake Form Builder</h1>
        <div className="flex gap-2">
          <div className="flex rounded-lg border border-line bg-white overflow-hidden">
            {(["builder","preview"] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 text-sm capitalize transition-colors ${view === v ? "bg-ink text-white" : "text-slate hover:bg-surface"}`}>{v}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <select value={sendPatient} onChange={e => setSendPatient(e.target.value)}
              className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-slate focus:outline-none focus:border-gold/40">
              {PATIENTS.map(p => <option key={p}>{p}</option>)}
            </select>
            <button onClick={() => flash(`Intake form sent to ${sendPatient} via SMS.`)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm shadow-gold"><Icons.Send className="h-4 w-4" /> Send</button>
          </div>
        </div>
      </div>

      {view === "builder" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="card bg-white shadow-card overflow-hidden">
            <div className="border-b border-line px-5 py-4 flex items-center gap-2">
              <Icons.Layers className="h-4 w-4 text-gold-deep" />
              <span className="font-semibold text-ink text-sm">Form structure</span>
              <span className="ml-auto text-xs text-mist">{fields.length} fields · adaptive branching</span>
            </div>
            <div className="divide-y divide-line">
              {fields.map((f, i) => (
                <div key={f.id} className="flex items-center gap-3 px-5 py-3 hover:bg-surface transition-colors group">
                  <span className="text-xs text-mist w-5 shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    {editingId === f.id ? (
                      <div className="flex gap-2 items-center">
                        <input autoFocus value={editLabel} onChange={e => setEditLabel(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                          className="flex-1 rounded border border-gold/60 bg-white px-2 py-1 text-sm text-ink focus:outline-none" />
                        <button onClick={saveEdit} className="text-[10px] rounded bg-gold/10 px-2 py-1 text-gold-deep font-semibold">Save</button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-ink">{f.label}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-mist capitalize">{f.type}</span>
                          {f.branch && <span className="rounded-full bg-gold/10 px-1.5 py-0.5 text-[10px] font-semibold text-gold-deep">branches on "{f.branch.value}"</span>}
                          {f.required && <span className="rounded-full bg-alert/10 px-1.5 py-0.5 text-[10px] font-semibold text-alert">required</span>}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="hidden group-hover:flex gap-1 shrink-0">
                    <button onClick={() => startEdit(f)} className="rounded border border-line p-1 text-mist hover:text-ink" title="Edit label"><Icons.Edit2 className="h-3 w-3" /></button>
                    <button onClick={() => removeField(f.id)} className="rounded border border-line p-1 text-mist hover:text-alert" title="Remove field"><Icons.Trash2 className="h-3 w-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-line px-5 py-4">
              <button onClick={addField} className="flex items-center gap-2 text-sm font-semibold text-gold-deep hover:underline"><Icons.Plus className="h-4 w-4" /> Add field</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="card bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-ink mb-3">Form settings</p>
              <div className="space-y-3">
                {Object.entries(settings).map(([label, on]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-slate">{label}</span>
                    <button onClick={() => setSettings(prev => ({ ...prev, [label]: !prev[label] }))}
                      className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ${on ? "bg-teal" : "bg-mist/30"}`}>
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="card bg-white p-5 shadow-card">
              <p className="text-sm font-semibold text-ink mb-1">Completion rate</p>
              <p className="text-3xl font-semibold text-teal">94%</p>
              <p className="text-xs text-slate mt-1">Last 90 days · 1,204 forms sent</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full w-[94%] rounded-full bg-teal" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-xl mx-auto">
          <div className="card bg-white shadow-card-hover p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-deep to-gold">
                <Icons.FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-ink">Crown Kingston — Patient Intake</p>
                <p className="text-xs text-slate">Adaptive form · answers shape what you see next</p>
              </div>
            </div>
            <div className="space-y-0">
              {fields.map(f => <FieldPreview key={f.id} field={f} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
