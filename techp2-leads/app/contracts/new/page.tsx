"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

const TYPES = ["Pricing Agreement","Supply Agreement","Distribution Agreement","MOU","Service Agreement","Custom"];

export default function NewContractPage() {
  const router = useRouter();
  const params = useSearchParams();
  const leadId = params.get("lead");
  const [leads, setLeads] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    lead_id: leadId || "",
    title: "",
    contract_type: "Pricing Agreement",
    status: "Draft",
    start_date: "",
    end_date: "",
    total_value: "",
    currency: "JMD",
    payment_terms: "",
    delivery_terms: "",
    notes: "",
    products: [] as string[],
  });

  useEffect(() => {
    supabase.from("leads").select("id,business_name,parish").order("business_name")
      .then(({ data }) => { if (data) setLeads(data); });
  }, []);

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const save = async () => {
    if (!form.lead_id || !form.title) return;
    setSaving(true);
    const { data } = await supabase.from("contracts").insert({
      ...form,
      total_value: form.total_value ? parseFloat(form.total_value) : null,
      products: form.products.length ? form.products : null,
    }).select().single();
    if (data) {
      await supabase.from("leads").update({ has_contract: true }).eq("id", form.lead_id);
      router.push(leadId ? `/leads/${leadId}` : `/contracts/${data.id}`);
    }
    setSaving(false);
  };

  const inp = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C]";

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-4 flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-[#888]"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-white font-bold flex-1">New Contract</h1>
          <button onClick={save} disabled={saving || !form.lead_id || !form.title}
            className="flex items-center gap-1.5 bg-[#C9930C] text-black font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">
            <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-4">
        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
          <h3 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">Contract Details</h3>
          {!leadId && (
            <div className="space-y-1.5">
              <label className="text-[#888] text-xs">Business / Client *</label>
              <select value={form.lead_id} onChange={e => set("lead_id", e.target.value)} className={inp}>
                <option value="">Select a lead...</option>
                {leads.map(l => <option key={l.id} value={l.id}>{l.business_name} — {l.parish}</option>)}
              </select>
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-[#888] text-xs">Contract Title *</label>
            <input value={form.title} onChange={e => set("title", e.target.value)}
              placeholder="e.g. Quarterly Fertiliser Supply Agreement" className={inp} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[#888] text-xs">Type</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map(t => (
                <button key={t} onClick={() => set("contract_type", t)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${form.contract_type === t ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[#888] text-xs">Start Date</label>
              <input type="date" value={form.start_date} onChange={e => set("start_date", e.target.value)} className={inp} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#888] text-xs">End Date</label>
              <input type="date" value={form.end_date} onChange={e => set("end_date", e.target.value)} className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[#888] text-xs">Total Value</label>
              <input type="number" value={form.total_value} onChange={e => set("total_value", e.target.value)}
                placeholder="0.00" className={inp} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[#888] text-xs">Currency</label>
              <select value={form.currency} onChange={e => set("currency", e.target.value)} className={inp}>
                <option>JMD</option><option>USD</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
          <h3 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">Terms</h3>
          <div className="space-y-1.5">
            <label className="text-[#888] text-xs">Payment Terms</label>
            <input value={form.payment_terms} onChange={e => set("payment_terms", e.target.value)}
              placeholder="e.g. 30% upfront, balance on delivery" className={inp} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[#888] text-xs">Delivery Terms</label>
            <input value={form.delivery_terms} onChange={e => set("delivery_terms", e.target.value)}
              placeholder="e.g. Bi-monthly delivery to site, FOB Kingston" className={inp} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[#888] text-xs">Notes</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={3}
              placeholder="Special conditions, discounts, exclusivity clauses..."
              className={`${inp} resize-none`} />
          </div>
        </div>
      </main>
    </div>
  );
}
