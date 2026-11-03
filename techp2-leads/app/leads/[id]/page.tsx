"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase, Lead, LeadNote, CallLog, FollowUp, Contract } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone, Mail, MapPin, ArrowLeft, Edit, Plus, Calendar,
  CheckCircle, Clock, FileText, Wheat, Hammer, Trash2,
  PhoneCall, MessageSquare, Building, AlertCircle, Star
} from "lucide-react";

const STATUS_OPTIONS = ["New","Contacted","Interested","Proposal Sent","Negotiating","Converted","Not Interested","Follow Up","Cold"];
const PARISH_OPTIONS = ["St. Ann", "Portland", "St. Mary", "St. Thomas", "Other"];
const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-900/50 text-blue-400", Contacted: "bg-green-900/50 text-green-400",
  Interested: "bg-purple-900/50 text-purple-400", "Proposal Sent": "bg-amber-900/50 text-amber-400",
  Negotiating: "bg-orange-900/50 text-orange-400", Converted: "bg-emerald-900/50 text-emerald-400",
  "Not Interested": "bg-red-900/50 text-red-400", "Follow Up": "bg-lime-900/50 text-lime-400",
  Cold: "bg-slate-800/50 text-slate-400",
};

type Tab = "overview" | "notes" | "calls" | "followup" | "contracts";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCallModal, setShowCallModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showParishModal, setShowParishModal] = useState(false);

  const load = useCallback(async () => {
    const [l, n, c, f, ct] = await Promise.all([
      supabase.from("tp2_leads").select("*").eq("id", id).single(),
      supabase.from("tp2_lead_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("tp2_call_logs").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
      supabase.from("tp2_follow_ups").select("*").eq("lead_id", id).order("due_date"),
      supabase.from("tp2_contracts").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    ]);
    if (l.data) setLead(l.data);
    if (n.data) setNotes(n.data);
    if (c.data) setCalls(c.data);
    if (f.data) setFollowUps(f.data);
    if (ct.data) setContracts(ct.data);
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (newStatus: string) => {
    await supabase.from("tp2_leads").update({ status: newStatus }).eq("id", id);
    setLead(prev => prev ? { ...prev, status: newStatus as any } : prev);
    setShowStatusModal(false);
  };

  const updateParish = async (newParish: string) => {
    await supabase.from("tp2_leads").update({ parish: newParish }).eq("id", id);
    setLead(prev => prev ? { ...prev, parish: newParish as any } : prev);
    setShowParishModal(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="w-8 h-8 border-2 border-[#C9930C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!lead) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <p className="text-[#888]">Lead not found</p>
    </div>
  );

  const openFollowUpCount = followUps.filter(f => !f.completed).length;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-3 flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#C9930C] transition-fast"><ArrowLeft className="w-4 h-4" /></button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold text-base leading-tight truncate">{lead.business_name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <button
                onClick={() => setShowStatusModal(true)}
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[lead.status] || "bg-[#222] text-[#888]"}`}
              >
                {lead.status} ▾
              </button>
              {lead.priority === "High" && <span className="text-[10px] text-[#C9930C] font-semibold">● HIGH</span>}
            </div>
          </div>
          <Link href={`/leads/${id}/edit`} className="p-2 text-[#888] hover:text-[#C9930C]">
            <Edit className="w-4 h-4" />
          </Link>
        </div>

        {/* Call action bar */}
        <div className="px-4 pb-3 max-w-6xl mx-auto">
          <div className="flex gap-2">
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                onClick={() => setTimeout(() => setShowCallModal(true), 1500)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#C9930C] text-black font-bold py-2.5 rounded-xl text-sm"
              >
                <PhoneCall className="w-4 h-4" /> Call {lead.phone}
              </a>
            )}
            {lead.phone && (
              <a
                href={`sms:${lead.phone}`}
                className="flex items-center justify-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] py-2.5 px-4 rounded-xl text-sm hover:border-[#C9930C] hover:text-white"
              >
                <MessageSquare className="w-4 h-4" /> Text
              </a>
            )}
            {lead.email && (
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center justify-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] py-2.5 px-4 rounded-xl text-sm hover:border-[#C9930C] hover:text-white"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#2a2a2a] px-4 max-w-6xl mx-auto overflow-x-auto">
          {(["overview","notes","calls","followup","contracts"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-2 px-3 text-xs font-semibold capitalize whitespace-nowrap border-b-2 transition-fast ${
                tab === t ? "border-[#C9930C] text-[#C9930C]" : "border-transparent text-[#555] hover:text-white"
              }`}
            >
              {t === "followup" ? `Follow-up${openFollowUpCount ? ` (${openFollowUpCount})` : ""}` : t}
              {t === "notes" && notes.length ? ` (${notes.length})` : ""}
              {t === "calls" && calls.length ? ` (${calls.length})` : ""}
              {t === "contracts" && contracts.length ? ` (${contracts.length})` : ""}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
              <h3 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">Business Info</h3>
              {lead.parish && (
                <div className="flex justify-between items-center">
                  <span className="text-[#555] text-sm">Parish</span>
                  <button onClick={() => setShowParishModal(true)} className="flex items-center gap-1 text-white text-sm">
                    {lead.parish} <span className="text-[#555] text-xs ml-1">v</span>
                  </button>
                </div>
              )}
              {[
                { label: "Contact", value: lead.contact_name, icon: Building },
                { label: "Community", value: lead.community },
                { label: "Category", value: lead.category },
                { label: "Type", value: lead.business_type },
                { label: "Size", value: lead.size },
                { label: "Source", value: lead.source },
                { label: "Preferred Contact", value: lead.preferred_contact },
                { label: "Best Time", value: lead.best_time },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex justify-between">
                  <span className="text-[#555] text-sm">{row.label}</span>
                  <span className="text-white text-sm text-right">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
              <h3 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">Procurement</h3>
              {lead.products_needed?.length && (
                <div>
                  <p className="text-[#555] text-xs mb-1">Products Needed</p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.products_needed.map(p => (
                      <span key={p} className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-xs px-2 py-0.5 rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
              )}
              {[
                { label: "Volume / Frequency", value: lead.volume_notes },
                { label: "Current Supplier", value: lead.current_supplier },
                { label: "Est. Annual Spend", value: lead.annual_spend_estimate },
                { label: "Credit Terms", value: lead.credit_terms },
                { label: "Payment Method", value: lead.payment_method },
              ].filter(r => r.value).map(row => (
                <div key={row.label} className="flex justify-between gap-3">
                  <span className="text-[#555] text-sm flex-shrink-0">{row.label}</span>
                  <span className="text-white text-sm text-right">{row.value}</span>
                </div>
              ))}
              {lead.price_agreement && (
                <div>
                  <p className="text-[#555] text-xs mb-1">Price Agreement</p>
                  <p className="text-white text-sm">{lead.price_agreement}</p>
                </div>
              )}
            </div>

            {lead.ai_summary && (
              <div className="bg-[#0d1a0d] border border-[#1a3a1a] rounded-xl p-4">
                <p className="text-green-400 text-xs font-semibold tracking-widest uppercase mb-2">⚡ AI Insight</p>
                <p className="text-[#ccc] text-sm leading-relaxed">{lead.ai_summary}</p>
              </div>
            )}

            {/* Quick follow-up toggle */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold">Follow-up Required</p>
                  {lead.follow_up_date && (
                    <p className="text-[#888] text-xs">Due: {lead.follow_up_date}</p>
                  )}
                </div>
                <button
                  onClick={async () => {
                    const newVal = !lead.follow_up_required;
                    await supabase.from("tp2_leads").update({ follow_up_required: newVal }).eq("id", id);
                    setLead(prev => prev ? { ...prev, follow_up_required: newVal } : prev);
                  }}
                  className={`w-12 h-6 rounded-full transition-fast relative ${lead.follow_up_required ? "bg-[#C9930C]" : "bg-[#2a2a2a]"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${lead.follow_up_required ? "left-[26px]" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* NOTES */}
        {tab === "notes" && (
          <div className="space-y-3">
            <button
              onClick={() => setShowNoteModal(true)}
              className="w-full flex items-center gap-2 border border-dashed border-[#333] rounded-xl p-3 text-[#555] hover:border-[#C9930C] hover:text-[#C9930C] transition-fast text-sm"
            >
              <Plus className="w-4 h-4" /> Add note...
            </button>
            {notes.length === 0 && (
              <p className="text-center text-[#444] text-sm py-8">No notes yet. Log your first interaction.</p>
            )}
            {notes.map(note => (
              <div key={note.id} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#C9930C] text-xs font-semibold">{note.note_type}</span>
                  <span className="text-[#444] text-xs">{new Date(note.created_at).toLocaleDateString("en-JM")}</span>
                </div>
                <p className="text-white text-sm leading-relaxed">{note.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* CALLS */}
        {tab === "calls" && (
          <div className="space-y-3">
            <button
              onClick={() => setShowCallModal(true)}
              className="w-full flex items-center gap-2 border border-dashed border-[#333] rounded-xl p-3 text-[#555] hover:border-[#C9930C] hover:text-[#C9930C] transition-fast text-sm"
            >
              <Phone className="w-4 h-4" /> Log a call...
            </button>
            {calls.length === 0 && (
              <p className="text-center text-[#444] text-sm py-8">No calls logged yet.</p>
            )}
            {calls.map(call => (
              <div key={call.id} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-[#C9930C]" />
                    <span className={`text-xs font-semibold ${
                      call.outcome === "Answered" ? "text-green-400" :
                      call.outcome === "No Answer" ? "text-red-400" : "text-[#888]"
                    }`}>{call.outcome}</span>
                    {call.duration_mins && <span className="text-[#444] text-xs">{call.duration_mins} min</span>}
                  </div>
                  <span className="text-[#444] text-xs">{new Date(call.created_at).toLocaleDateString("en-JM")}</span>
                </div>
                {call.summary && <p className="text-white text-sm">{call.summary}</p>}
                {call.follow_up_required && (
                  <p className="text-amber-400 text-xs mt-1">⚡ Follow-up: {call.follow_up_date}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* FOLLOW-UP */}
        {tab === "followup" && (
          <div className="space-y-3">
            <button
              onClick={() => setShowFollowUpModal(true)}
              className="w-full flex items-center gap-2 border border-dashed border-[#333] rounded-xl p-3 text-[#555] hover:border-[#C9930C] hover:text-[#C9930C] transition-fast text-sm"
            >
              <Plus className="w-4 h-4" /> Schedule follow-up...
            </button>
            {followUps.length === 0 && (
              <p className="text-center text-[#444] text-sm py-8">No follow-ups scheduled.</p>
            )}
            {followUps.map(fu => (
              <div key={fu.id} className={`border rounded-xl p-4 ${fu.completed ? "bg-[#0a0a0a] border-[#1a1a1a] opacity-60" : fu.due_date < today ? "bg-red-950/20 border-red-900/50" : "bg-[#111] border-[#2a2a2a]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${fu.due_date < today && !fu.completed ? "text-red-400" : "text-[#C9930C]"}`}>
                        {fu.due_date < today && !fu.completed ? "OVERDUE" : fu.due_date}
                      </span>
                      {fu.task_type && <span className="text-[#555] text-xs">{fu.task_type}</span>}
                    </div>
                    {fu.description && <p className="text-white text-sm mt-1">{fu.description}</p>}
                  </div>
                  {!fu.completed && (
                    <button
                      onClick={async () => {
                        await supabase.from("tp2_follow_ups").update({ completed: true, completed_at: new Date().toISOString() }).eq("id", fu.id);
                        load();
                      }}
                      className="p-2 text-[#555] hover:text-green-400"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTRACTS */}
        {tab === "contracts" && (
          <div className="space-y-3">
            <Link
              href={`/contracts/new?lead=${id}`}
              className="w-full flex items-center gap-2 border border-dashed border-[#333] rounded-xl p-3 text-[#555] hover:border-[#C9930C] hover:text-[#C9930C] transition-fast text-sm"
            >
              <Plus className="w-4 h-4" /> New contract / pricing agreement...
            </Link>
            {contracts.length === 0 && (
              <p className="text-center text-[#444] text-sm py-8">No contracts yet.</p>
            )}
            {contracts.map(c => (
              <Link key={c.id} href={`/contracts/${c.id}`} className="block bg-[#111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#C9930C]/40">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{c.title}</p>
                    <p className="text-[#555] text-xs mt-0.5">{c.contract_type}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    c.status === "Active" ? "bg-green-900/50 text-green-400" :
                    c.status === "Signed" ? "bg-blue-900/50 text-blue-400" :
                    c.status === "Draft" ? "bg-[#222] text-[#888]" : "bg-[#222] text-[#888]"
                  }`}>{c.status}</span>
                </div>
                {c.total_value && (
                  <p className="text-[#C9930C] text-sm font-semibold mt-2">
                    {c.currency || "JMD"} {c.total_value.toLocaleString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Call Modal */}
      {showCallModal && <CallModal leadId={id} onClose={() => { setShowCallModal(false); load(); }} />}
      {showNoteModal && <NoteModal leadId={id} onClose={() => { setShowNoteModal(false); load(); }} />}
      {showFollowUpModal && <FollowUpModal leadId={id} onClose={() => { setShowFollowUpModal(false); load(); }} />}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="bg-[#111] border border-[#2a2a2a] rounded-t-3xl w-full p-6 space-y-2">
            <p className="text-[#888] text-xs font-semibold tracking-widest uppercase mb-4">Update Status</p>
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => updateStatus(s)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-fast ${lead.status === s ? "bg-[#C9930C] text-black" : "text-white hover:bg-[#1a1a1a]"}`}>
                {s}
              </button>
            ))}
            <button onClick={() => setShowStatusModal(false)} className="w-full text-center text-[#555] text-sm py-2 mt-2">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────

function CallModal({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const [outcome, setOutcome] = useState("Answered");
  const [duration, setDuration] = useState("");
  const [summary, setSummary] = useState("");
  const [followUp, setFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await supabase.from("tp2_call_logs").insert({
      lead_id: leadId,
      outcome,
      duration_mins: duration ? parseInt(duration) : null,
      summary,
      follow_up_required: followUp,
      follow_up_date: followUp ? followUpDate : null,
    });
    if (followUp && followUpDate) {
      await supabase.from("tp2_follow_ups").insert({
        lead_id: leadId,
        due_date: followUpDate,
        task_type: "Call",
        description: `Follow up from call: ${summary.slice(0, 100)}`,
        completed: false,
        priority: "High",
      });
      await supabase.from("tp2_leads").update({ follow_up_required: true, follow_up_date: followUpDate }).eq("id", leadId);
    }
    await supabase.from("tp2_lead_notes").insert({
      lead_id: leadId,
      note_type: "Call Log",
      content: `${outcome}${duration ? ` · ${duration} min` : ""}${summary ? ` · ${summary}` : ""}`,
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-t-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <p className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase mb-4">Log Call</p>
        <div className="space-y-4">
          <div>
            <p className="text-[#888] text-xs mb-2">Outcome</p>
            <div className="flex flex-wrap gap-2">
              {["Answered","No Answer","Voicemail","Busy","Callback Requested"].map(o => (
                <button key={o} onClick={() => setOutcome(o)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${outcome === o ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                  {o}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[#888] text-xs mb-1">Duration (mins)</p>
            <input value={duration} onChange={e => setDuration(e.target.value)} type="number" placeholder="e.g. 5"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C]" />
          </div>
          <div>
            <p className="text-[#888] text-xs mb-1">Notes / Summary</p>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3}
              placeholder="What was discussed? Their needs, objections, interest level..."
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C] resize-none" />
          </div>
          <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-white text-sm">Needs follow-up?</p>
            <button onClick={() => setFollowUp(!followUp)}
              className={`w-12 h-6 rounded-full relative transition-fast ${followUp ? "bg-[#C9930C]" : "bg-[#2a2a2a]"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${followUp ? "left-[26px]" : "left-0.5"}`} />
            </button>
          </div>
          {followUp && (
            <div>
              <p className="text-[#888] text-xs mb-1">Follow-up Date</p>
              <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C]" />
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <button onClick={onClose} className="flex-1 border border-[#2a2a2a] text-[#888] rounded-xl py-3 text-sm">Cancel</button>
            <button onClick={save} disabled={saving}
              className="flex-1 bg-[#C9930C] text-black font-bold rounded-xl py-3 text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Save Call"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NoteModal({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const [type, setType] = useState("General");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!content.trim()) return;
    setSaving(true);
    await supabase.from("tp2_lead_notes").insert({ lead_id: leadId, note_type: type, content });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-t-3xl w-full p-6">
        <p className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase mb-4">Add Note</p>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {["General","Site Visit","Requirement","Meeting","Complaint","Contract Note"].map(t => (
              <button key={t} onClick={() => setType(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${type === t ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                {t}
              </button>
            ))}
          </div>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
            placeholder="Enter your note — client needs, requirements, what they said, pricing discussed..."
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C] resize-none" />
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 border border-[#2a2a2a] text-[#888] rounded-xl py-3 text-sm">Cancel</button>
            <button onClick={save} disabled={saving || !content.trim()}
              className="flex-1 bg-[#C9930C] text-black font-bold rounded-xl py-3 text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Save Note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FollowUpModal({ leadId, onClose }: { leadId: string; onClose: () => void }) {
  const [taskType, setTaskType] = useState("Call");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("High");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!date) return;
    setSaving(true);
    await Promise.all([
      supabase.from("tp2_follow_ups").insert({
        lead_id: leadId, due_date: date, task_type: taskType,
        description: desc, completed: false, priority,
      }),
      supabase.from("tp2_leads").update({ follow_up_required: true, follow_up_date: date }).eq("id", leadId),
    ]);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-t-3xl w-full p-6">
        <p className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase mb-4">Schedule Follow-up</p>
        <div className="space-y-4">
          <div>
            <p className="text-[#888] text-xs mb-2">Task Type</p>
            <div className="flex flex-wrap gap-2">
              {["Call","Visit","Email","Send Quote","Send Contract","Deliver Sample"].map(t => (
                <button key={t} onClick={() => setTaskType(t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${taskType === t ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[#888] text-xs mb-1">Due Date</p>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C]" />
          </div>
          <div>
            <p className="text-[#888] text-xs mb-1">Description</p>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="What needs to happen?"
              className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C]" />
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 border border-[#2a2a2a] text-[#888] rounded-xl py-3 text-sm">Cancel</button>
            <button onClick={save} disabled={saving || !date}
              className="flex-1 bg-[#C9930C] text-black font-bold rounded-xl py-3 text-sm disabled:opacity-50">
              {saving ? "Saving..." : "Schedule"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
