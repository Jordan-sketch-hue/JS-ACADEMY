"use client";
import { useState, useEffect } from "react";

export interface ProductionJob { id: string; title: string; customer_name: string | null; customer_phone: string | null; description: string | null; quantity: number; production_date: string | null; due_date: string | null; deposit_paid: boolean; deposit_amount: number; total_amount: number; currency: string; status: string; created_at: string; }
interface Props { jobs?: ProductionJob[]; clientId?: string; accentColor?: string; currency?: string; }

export function ProductionJobsModule({ jobs: initial, clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [jobs, setJobs] = useState<ProductionJob[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/production-jobs?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setJobs(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title:"", customer_name:"", customer_phone:"", description:"", quantity:"1", production_date:"", due_date:"", deposit_amount:"", total_amount:"", ingredients_needed:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/production-jobs", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form, quantity:Number(form.quantity)||1, deposit_amount:Number(form.deposit_amount)||0, total_amount:Number(form.total_amount)||0, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setJobs(p=>[json.data,...p]); setForm({ title:"", customer_name:"", customer_phone:"", description:"", quantity:"1", production_date:"", due_date:"", deposit_amount:"", total_amount:"", ingredients_needed:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ pending:"#fef3c7", confirmed:"#dbeafe", in_production:"#ede9fe", ready:"#dcfce7", delivered:"#f0fdf4" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ pending:"#92400e", confirmed:"#1e40af", in_production:"#5b21b6", ready:"#166534", delivered:"#14532d" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New Order</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Item / cake title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} style={inp} />
          <input type="number" min="1" placeholder="Qty" value={form.quantity} onChange={e=>setForm(f=>({...f,quantity:e.target.value}))} style={inp} />
          <input placeholder="Customer name" value={form.customer_name} onChange={e=>setForm(f=>({...f,customer_name:e.target.value}))} style={inp} />
          <input placeholder="Customer phone" value={form.customer_phone} onChange={e=>setForm(f=>({...f,customer_phone:e.target.value}))} style={inp} />
          <textarea placeholder="Design brief / description" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <input placeholder="Ingredients needed" value={form.ingredients_needed} onChange={e=>setForm(f=>({...f,ingredients_needed:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Production date</label><input type="date" value={form.production_date} onChange={e=>setForm(f=>({...f,production_date:e.target.value}))} style={inp} /></div>
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Due / pickup date</label><input type="date" value={form.due_date} onChange={e=>setForm(f=>({...f,due_date:e.target.value}))} style={inp} /></div>
          <input type="number" placeholder={`Deposit (${currency})`} value={form.deposit_amount} onChange={e=>setForm(f=>({...f,deposit_amount:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Total (${currency})`} value={form.total_amount} onChange={e=>setForm(f=>({...f,total_amount:e.target.value}))} style={inp} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {jobs.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No production orders yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Item","Customer","Qty","Production Date","Due Date","Deposit","Total","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{jobs.map(j=>(
              <tr key={j.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{j.title}</td>
                <td style={{ padding:"10px 12px" }}>{j.customer_name||"—"}</td>
                <td style={{ padding:"10px 12px", textAlign:"center" }}>{j.quantity}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{j.production_date||"—"}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{j.due_date||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{j.currency} {j.deposit_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", fontWeight:600 }}>{j.currency} {j.total_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(j.status), color:stc(j.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{j.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}