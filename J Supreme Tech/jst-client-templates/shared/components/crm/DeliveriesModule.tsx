"use client";
import { useState, useEffect } from "react";

export interface Delivery { id: string; customer_name: string; customer_phone: string | null; address: string | null; scheduled_date: string | null; scheduled_time: string | null; items: string | null; driver: string | null; status: string; notes: string | null; created_at: string; }
interface Props { deliveries?: Delivery[]; clientId?: string; accentColor?: string; }

export function DeliveriesModule({ deliveries: initial, clientId, accentColor = "#111" }: Props) {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(`/api/ct/deliveries?clientId=${clientId}`).then(r=>r.json()).then(j=>{ if (j.data) setDeliveries(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customer_name:"", customer_phone:"", address:"", scheduled_date:"", scheduled_time:"", items:"", driver:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/deliveries", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form }) });
    const json = await res.json();
    if (json.ok && json.data) { setDeliveries(p=>[json.data,...p]); setForm({ customer_name:"", customer_phone:"", address:"", scheduled_date:"", scheduled_time:"", items:"", driver:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ scheduled:"#dbeafe", out_for_delivery:"#fef3c7", delivered:"#dcfce7", failed:"#fee2e2" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ scheduled:"#1e40af", out_for_delivery:"#92400e", delivered:"#166534", failed:"#991b1b" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Schedule Delivery</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Customer name" value={form.customer_name} onChange={e=>setForm(f=>({...f,customer_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.customer_phone} onChange={e=>setForm(f=>({...f,customer_phone:e.target.value}))} style={inp} />
          <input placeholder="Delivery address" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input placeholder="Items" value={form.items} onChange={e=>setForm(f=>({...f,items:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <input type="date" value={form.scheduled_date} onChange={e=>setForm(f=>({...f,scheduled_date:e.target.value}))} style={inp} />
          <input placeholder="Time (e.g. 10:00 AM)" value={form.scheduled_time} onChange={e=>setForm(f=>({...f,scheduled_time:e.target.value}))} style={inp} />
          <input placeholder="Driver name" value={form.driver} onChange={e=>setForm(f=>({...f,driver:e.target.value}))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={inp} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {deliveries.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No deliveries scheduled.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Customer","Address","Items","Date","Time","Driver","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{deliveries.map(d=>(
              <tr key={d.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{d.customer_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{d.address||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{d.items||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{d.scheduled_date||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{d.scheduled_time||"—"}</td>
                <td style={{ padding:"10px 12px" }}>{d.driver||"—"}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(d.status), color:stc(d.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{d.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}