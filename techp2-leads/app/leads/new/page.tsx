"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

const PARISHES = ["St. Ann", "Portland", "St. Mary", "St. Thomas", "Other"];
const CATEGORIES = ["Agriculture", "Hardware", "Both"];
const STATUSES = ["New","Contacted","Interested","Follow Up"];
const SOURCES = ["Field Visit","Referral","Cold Call","Email","Text","Online","Other"];
const PRODUCTS_AG = ["Fertiliser","Seeds","Pesticides","Herbicides","Irrigation","Farm Equipment","Animal Feed","Veterinary Supplies","Organic Inputs","Agro-chemicals","Nursery Plants","Soil/Compost"];
const PRODUCTS_HW = ["Cement","Blocks","Lumber","Roofing","Rebar","Plumbing","Electrical","Paint","Tiles","Tools","Hardware","Glass","Sand/Aggregate"];

export default function NewLeadPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    phone: "",
    email: "",
    address: "",
    parish: "St. Ann" as const,
    community: "",
    category: "Agriculture" as const,
    business_type: "",
    size: "Small" as const,
    annual_spend_estimate: "",
    status: "New" as const,
    priority: "Medium" as const,
    source: "Field Visit" as const,
    preferred_contact: "Call",
    best_time: "",
    credit_terms: "",
    payment_method: "",
    price_agreement: "",
    products_needed: [] as string[],
    volume_notes: "",
    current_supplier: "",
    follow_up_required: false,
    follow_up_date: "",
  });

  const set = (k: string, v: any) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleProduct = (p: string) => {
    set("products_needed", form.products_needed.includes(p)
      ? form.products_needed.filter(x => x !== p)
      : [...form.products_needed, p]
    );
  };

  const save = async () => {
    if (!form.business_name.trim()) return;
    setSaving(true);
    const { data, error } = await supabase.from("leads").insert({
      ...form,
      products_needed: form.products_needed.length ? form.products_needed : null,
      follow_up_date: form.follow_up_required && form.follow_up_date ? form.follow_up_date : null,
    }).select().single();
    setSaving(false);
    if (data) router.push(`/leads/${data.id}`);
  };

  const products = form.category === "Agriculture" ? PRODUCTS_AG :
                   form.category === "Hardware" ? PRODUCTS_HW :
                   [...PRODUCTS_AG, ...PRODUCTS_HW];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <header className="bg-[#111] border-b border-[#2a2a2a] sticky top-0 z-30 safe-top">
        <div className="px-4 py-4 flex items-center gap-3 max-w-6xl mx-auto">
          <button onClick={() => router.back()} className="text-[#888]"><ArrowLeft className="w-5 h-5" /></button>
          <h1 className="text-white font-bold flex-1">New Lead</h1>
          <button onClick={save} disabled={saving || !form.business_name.trim()}
            className="flex items-center gap-1.5 bg-[#C9930C] text-black font-bold px-4 py-2 rounded-lg text-sm disabled:opacity-50">
            <Save className="w-4 h-4" />{saving ? "Saving..." : "Save"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-6">
        {/* Identity */}
        <Section title="Business Identity">
          <Field label="Business Name *">
            <input value={form.business_name} onChange={e => set("business_name", e.target.value)}
              placeholder="e.g. Brown's Town Hardware Centre" className={input()} />
          </Field>
          <Field label="Contact Name">
            <input value={form.contact_name} onChange={e => set("contact_name", e.target.value)}
              placeholder="Owner / Manager name" className={input()} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={e => set("phone", e.target.value)}
              placeholder="(876) 000-0000" type="tel" className={input()} />
          </Field>
          <Field label="Email">
            <input value={form.email} onChange={e => set("email", e.target.value)}
              placeholder="email@example.com" type="email" className={input()} />
          </Field>
          <Field label="Address">
            <input value={form.address} onChange={e => set("address", e.target.value)}
              placeholder="Street address" className={input()} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Parish">
              <select value={form.parish} onChange={e => set("parish", e.target.value)} className={input()}>
                {PARISHES.map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Community">
              <input value={form.community} onChange={e => set("community", e.target.value)}
                placeholder="e.g. Brown's Town" className={input()} />
            </Field>
          </div>
        </Section>

        {/* Classification */}
        <Section title="Classification">
          <Field label="Category">
            <div className="flex gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => set("category", c)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-fast ${form.category === c ? "bg-[#C9930C] text-black border-[#C9930C]" : "text-[#888] border-[#2a2a2a] hover:border-[#C9930C]"}`}>
                  {c === "Agriculture" ? "🌾 Agri" : c === "Hardware" ? "🔨 HW" : "🌾🔨 Both"}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Business Type">
            <input value={form.business_type} onChange={e => set("business_type", e.target.value)}
              placeholder="e.g. Hardware Store, Farm, Co-op, Nursery" className={input()} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Size">
              <select value={form.size} onChange={e => set("size", e.target.value as any)} className={input()}>
                {["Small","Medium","Large"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select value={form.priority} onChange={e => set("priority", e.target.value as any)} className={input()}>
                {["High","Medium","Low"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Source">
            <div className="flex flex-wrap gap-1.5">
              {SOURCES.map(s => (
                <button key={s} onClick={() => set("source", s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${form.source === s ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => set("status", e.target.value as any)} className={input()}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
        </Section>

        {/* Procurement */}
        <Section title="Procurement Details">
          <Field label="Products Needed">
            <div className="flex flex-wrap gap-1.5">
              {products.map(p => (
                <button key={p} onClick={() => toggleProduct(p)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${form.products_needed.includes(p) ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Volume / Order Frequency">
            <input value={form.volume_notes} onChange={e => set("volume_notes", e.target.value)}
              placeholder="e.g. Monthly, 500 bags fertiliser/quarter" className={input()} />
          </Field>
          <Field label="Current Supplier">
            <input value={form.current_supplier} onChange={e => set("current_supplier", e.target.value)}
              placeholder="Who do they currently buy from?" className={input()} />
          </Field>
          <Field label="Est. Annual Spend">
            <input value={form.annual_spend_estimate} onChange={e => set("annual_spend_estimate", e.target.value)}
              placeholder="e.g. JMD $500k - $1M" className={input()} />
          </Field>
        </Section>

        {/* Contact Prefs */}
        <Section title="Contact Preferences">
          <Field label="Preferred Contact">
            <div className="flex flex-wrap gap-1.5">
              {["Call","Text","Email","WhatsApp","In-Person"].map(c => (
                <button key={c} onClick={() => set("preferred_contact", c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-fast ${form.preferred_contact === c ? "bg-[#C9930C] text-black border-[#C9930C] font-semibold" : "text-[#888] border-[#2a2a2a]"}`}>
                  {c}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Best Time to Contact">
            <input value={form.best_time} onChange={e => set("best_time", e.target.value)}
              placeholder="e.g. Mornings 8-10AM, After 5PM" className={input()} />
          </Field>
        </Section>

        {/* Commercial */}
        <Section title="Commercial Terms">
          <Field label="Credit Terms">
            <input value={form.credit_terms} onChange={e => set("credit_terms", e.target.value)}
              placeholder="e.g. 30 days net, Cash on delivery" className={input()} />
          </Field>
          <Field label="Payment Method">
            <input value={form.payment_method} onChange={e => set("payment_method", e.target.value)}
              placeholder="Cash, Bank transfer, Cheque" className={input()} />
          </Field>
          <Field label="Price Agreement Notes">
            <textarea value={form.price_agreement} onChange={e => set("price_agreement", e.target.value)}
              rows={2} placeholder="Any pricing arrangement, discounts, special rates discussed..."
              className={`${input()} resize-none`} />
          </Field>
        </Section>

        {/* Follow-up */}
        <Section title="Follow-up">
          <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-white text-sm">Schedule follow-up</p>
            <button onClick={() => set("follow_up_required", !form.follow_up_required)}
              className={`w-12 h-6 rounded-full relative transition-fast ${form.follow_up_required ? "bg-[#C9930C]" : "bg-[#2a2a2a]"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.follow_up_required ? "left-[26px]" : "left-0.5"}`} />
            </button>
          </div>
          {form.follow_up_required && (
            <Field label="Follow-up Date">
              <input type="date" value={form.follow_up_date} onChange={e => set("follow_up_date", e.target.value)}
                min={new Date().toISOString().split("T")[0]} className={input()} />
            </Field>
          )}
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-4">
      <h3 className="text-[#C9930C] text-xs font-semibold tracking-widest uppercase">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[#888] text-xs">{label}</label>
      {children}
    </div>
  );
}

function input() {
  return "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9930C] appearance-none";
}
