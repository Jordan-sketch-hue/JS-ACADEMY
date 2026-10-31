"use client";
import { useState, useEffect } from "react";
import type { Supplier } from "./SuppliersModule";

export interface PurchaseOrder { id: string; supplier_id: string | null; supplier_name?: string; po_number: string | null; items: string | null; total_amount: number; currency: string; order_date: string | null; expected_date: string | null; status: string; notes: string | null; created_at: string; }
interface Props { orders?: PurchaseOrder[]; suppliers?: Supplier[]; clientId?: string; accentColor?: string; currency?: string; }

export function PurchaseOrdersModule({ orders: initial, suppliers = [], clientId, accentColor = "#111", currency = "JMD" }: Props) {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/purchase-orders?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setOrders(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ supplier_id:"", items:"", total_amount:"", order_date:"", expected_date:"", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const po = `PO-${Date.now().toString().slice(-6)}`;
    const res = await fetch("/api/ct/purchase-orders", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, po_number:po, ...form, total_amount:Number(form.total_amount)||0, currency }) });
    const json = await res.json();
    if (json.ok && json.data) { setOrders(p=>[json.data,...p]); setForm({ supplier_id:"", items:"", total_amount:"", order_date:"", expected_date:"", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ draft:"#f3f4f6", sent:"#dbeafe", confirmed:"#ede9fe", received:"#dcfce7", cancelled:"#fee2e2" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ draft:"#374151", sent:"#1e40af", confirmed:"#5b21b6", received:"#166534", cancelled:"#991b1b" }[s]||"#374151");

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New PO</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <div style={{ gridColumn:"1/-1" }}>
            <label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Supplier</label>
            <select value={form.supplier_id} onChange={e=>setForm(f=>({...f,supplier_id:e.target.value}))} style={{ ...inp }}>
              <option value="">— Select supplier —</option>
              {suppliers.map(s=><option key={s.id} value={s.id}>{s.supplier_name}</option>)}
            </select>
          </div>
          <textarea required placeholder="Items / description" value={form.items} onChange={e=>setForm(f=>({...f,items:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <input type="number" placeholder={`Total (${currency})`} value={form.total_amount} onChange={e=>setForm(f=>({...f,total_amount:e.target.value}))} style={inp} />
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Order date</label><input type="date" value={form.order_date} onChange={e=>setForm(f=>({...f,order_date:e.target.value}))} style={inp} /></div>
          <div><label style={{ fontSize:12, color:"#6b7280", display:"block", marginBottom:4 }}>Expected delivery</label><input type="date" value={form.expected_date} onChange={e=>setForm(f=>({...f,expected_date:e.target.value}))} style={inp} /></div>
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {orders.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No purchase orders yet.</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:14 }}>
            <thead><tr style={{ borderBottom:"2px solid #f3f4f6" }}>
              {["PO #","Supplier","Items","Total","Order Date","Expected","Status"].map(h=><th key={h} style={{ textAlign:"left", padding:"8px 12px", fontWeight:600 }}>{h}</th>)}
            </tr></thead>
            <tbody>{orders.map(o=>(
              <tr key={o.id} style={{ borderBottom:"1px solid #f3f4f6" }}>
                <td style={{ padding:"10px 12px", fontFamily:"monospace", fontSize:12, color:"#6b7280" }}>{o.po_number}</td>
                <td style={{ padding:"10px 12px" }}>{o.supplier_name||"—"}</td>
                <td style={{ padding:"10px 12px", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{o.items||"—"}</td>
                <td style={{ padding:"10px 12px", fontWeight:600 }}>{o.currency} {o.total_amount.toLocaleString()}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{o.order_date||"—"}</td>
                <td style={{ padding:"10px 12px", color:"#6b7280" }}>{o.expected_date||"—"}</td>
                <td style={{ padding:"10px 12px" }}><span style={{ background:sc(o.status), color:stc(o.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{o.status}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}