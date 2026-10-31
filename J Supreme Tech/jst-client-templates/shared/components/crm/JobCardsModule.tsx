"use client";
import { useState, useEffect } from "react";

export interface JobCard { id: string; job_number: string | null; customer_name: string; customer_phone: string | null; vehicle_or_device: string | null; make_model: string | null; serial_imei: string | null; issue_reported: string | null; diagnosis: string | null; parts_needed: string | null; labour_cost: number; parts_cost: number; total_cost: number; currency: string; technician: string | null; status: string; drop_off_date: string | null; estimated_completion: string | null; created_at: string; }
interface Props { jobs?: JobCard[]; clientId?: string; accentColor?: string; currency?: string; deviceLabel?: string; }

export function JobCardsModule({ jobs: initial, clientId, accentColor = "#111", currency = "JMD", deviceLabel = "Vehicle / Device" }: Props) {
  const [jobs, setJobs] = useState<JobCard[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/job-cards?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setJobs(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customer_name:"", customer_phone:"", vehicle_or_device:"", make_model:"", serial_imei:"", issue_reported:"", parts_needed:"", labour_cost:"", parts_cost:"", technician:"", drop_off_date:"", estimated_completion:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const num = `JOB-${Date.now().toString().slice(-5)}`;
    const lc = Number(form.labour_cost)||0; const pc = Number(form.parts_cost)||0;
    const res = await fetch("/api/ct/job-cards", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, job_number:num, ...form, labour_cost:lc, parts_cost:pc, total_cost:lc+pc, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setJobs(p=>[json.data,...p]); setForm({ customer_name:"", customer_phone:"", vehicle_or_device:"", make_model:"", serial_imei:"", issue_reported:"", parts_needed:"", labour_cost:"", parts_cost:"", technician:"", drop_off_date:"", estimated_completion:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ received:"#dbeafe", diagnosed:"#fef3c7", in_progress:"#ede9fe", awaiting_parts:"#fee2e2", ready:"#dcfce7", collected:"#f0fdf4" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ received:"#1e40af", diagnosed:"#92400e", in_progress:"#5b21b6", awaiting_parts:"#991b1b", ready:"#166534", collected:"#14532d" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New Job Card</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Customer name" value={form.customer_name} onChange={e=>setForm(f=>({...f,customer_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.customer_phone} onChange={e=>setForm(f=>({...f,customer_phone:e.target.value}))} style={inp} />
          <input placeholder={deviceLabel} value={form.vehicle_or_device} onChange={e=>setForm(f=>({...f,vehicle_or_device:e.target.value}))} style={inp} />
          <input placeholder="Make / Model" value={form.make_model} onChange={e=>setForm(f=>({...f,make_model:e.target.value}))} style={inp} />
          <input placeholder="Serial / IMEI / Plate" value={form.serial_imei} onChange={e=>setForm(f=>({...f,serial_imei:e.target.value}))} style={inp} />
          <input placeholder="Technician" value={form.technician} onChange={e=>setForm(f=>({...f,technician:e.target.value}))} style={inp} />
          <textarea placeholder="Issue reported" value={form.issue_reported} onChange={e=>setForm(f=>({...f,issue_reported:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <input placeholder="Parts needed" value={form.parts_needed} onChange={e=>setForm(f=>({...f,parts_needed:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input type="number" placeholder={`Labour cost (${currency})`} value={form.labour_cost} onChange={e=>setForm(f=>({...f,labour_cost:e.target.value}))} style={inp} />
          <input type="number" placeholder={`Parts cost (${currency})`} value={form.parts_cost} onChange={e=>setForm(f=>({...f,parts_cost:e.target.value}))} style={inp} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Drop-off</label><input type="date" value={form.drop_off_date} onChange={e=>setForm(f=>({...f,drop_off_date:e.target.value}))} style={inp} /></div>
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Est. completion</label><input type="date" value={form.estimated_completion} onChange={e=>setForm(f=>({...f,estimated_completion:e.target.value}))} style={inp} /></div>
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {jobs.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No job cards yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Job #","Customer",deviceLabel,"Issue","Parts","Technician","Total","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{jobs.map(j=>(
              <tr key={j.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontFamily:"monospace", fontSize:12, color:"#6b7280" }}>{j.job_number}</td>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{j.customer_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{j.vehicle_or_device||"—"}{j.make_model?` (${j.make_model})`:""}</td>
                <td style={{ padding:"10px 12px", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{j.issue_reported||"—"}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{j.parts_needed||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{j.technician||"—"}</td>
                <td style={{ padding:"10px 12px", fontWeight:600 }}>{j.currency} {j.total_cost.toLocaleString()}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(j.status), color:stc(j.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{j.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}