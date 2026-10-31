"use client";
import { useState, useEffect } from "react";

export interface WholesaleAccount { id: string; business_name: string; contact_name: string | null; phone: string | null; email: string | null; address: string | null; tier: string; credit_limit: number; currency: string; moq_override: number | null; active: boolean; notes: string | null; created_at: string; }
interface Props { accounts?: WholesaleAccount[]; clientId?: string; accentColor?: string; currency?: string; }

export function WholesaleAccountsModule({ accounts: initial, clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [accounts, setAccounts] = useState<WholesaleAccount[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/wholesale-accounts?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setAccounts(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ business_name:"", contact_name:"", phone:"", email:"", address:"", tier:"standard", credit_limit:"", moq_override:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const res = await fetch("/api/ct/wholesale-accounts", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, ...form, credit_limit:Number(form.credit_limit)||0, moq_override:form.moq_override?Number(form.moq_override):null, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setAccounts(p=>[json.data,...p]); setForm({ business_name:"", contact_name:"", phone:"", email:"", address:"", tier:"standard", credit_limit:"", moq_override:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const tc = (t:string) => ({ vip:{ background:"#fef3c7", color:"#92400e" }, premium:{ background:"#ede9fe", color:"#5b21b6" }, standard:{ background:"#f3f4f6", color:"#374151" } }[t] || { background:"#f3f4f6", color:"#374151" });

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Add Reseller</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input required placeholder="Business name" value={form.business_name} onChange={e=>setForm(f=>({...f,business_name:e.target.value}))} style={inp} />
          <input placeholder="Contact person" value={form.contact_name} onChange={e=>setForm(f=>({...f,contact_name:e.target.value}))} style={inp} />
          <input placeholder="Phone" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={inp} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} />
          <input placeholder="Address" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <select value={form.tier} onChange={e=>setForm(f=>({...f,tier:e.target.value}))} style={{ ...inp, background:"#fff" }}>
            <option value="standard">Standard</option><option value="premium">Premium</option><option value="vip">VIP</option>
          </select>
          <input type="number" placeholder={`Credit limit (${currency})`} value={form.credit_limit} onChange={e=>setForm(f=>({...f,credit_limit:e.target.value}))} style={inp} />
          <input type="number" placeholder="MOQ override" value={form.moq_override} onChange={e=>setForm(f=>({...f,moq_override:e.target.value}))} style={inp} />
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {accounts.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No reseller accounts yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["Business","Contact","Phone","Tier","Credit Limit","MOQ","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{accounts.map(a=>(
              <tr key={a.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontWeight:500 }}>{a.business_name}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{a.contact_name||"—"}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{a.phone||"—"}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ ...tc(a.tier), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{a.tier}</span></td>
                <td style={{ padding:"10px 12px" }}>{a.currency} {a.credit_limit.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", textAlign:"center" }}>{a.moq_override||"—"}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:a.active?"#dcfce7":"#f3f4f6", color:a.active?"#166534":"#6b7280", borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{a.active?"Active":"Inactive"}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}