"use client";
import { useState, useEffect } from "react";

export interface KitchenOrder { id: string; order_number: string | null; customer_name: string | null; items: string; order_type: string; status: string; priority: string; notes: string | null; created_at: string; }
interface Props { orders?: KitchenOrder[]; clientId?: string; accentColor?: string; }

export function KitchenOrdersModule({ orders: initial, clientId, accentColor = "#111" }: Props) {
  const [orders, setOrders] = useState<KitchenOrder[]>(initial ?? []);
  useEffect(() => {
    if (!clientId || (initial && initial.length > 0)) return;
    fetch(/api/ct/kitchen-orders?clientId=).then(r=>r.json()).then(j=>{ if (j.data) setOrders(j.data); });
  }, [clientId]);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ customer_name:"", items:"", order_type:"pickup", priority:"normal", notes:"" });
  const inp = { padding:"8px 12px", border:"1px solid #e5e7eb", borderRadius:6, fontSize:14, width:"100%" };
  const sel = { ...inp, background:"#fff" };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); if (!clientId) return; setSaving(true);
    const num = `#${Date.now().toString().slice(-5)}`;
    const res = await fetch("/api/ct/kitchen-orders", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ clientId, order_number:num, ...form }) });
    const json = await res.json();
    if (json.ok && json.data) { setOrders(p=>[json.data,...p]); setForm({ customer_name:"", items:"", order_type:"pickup", priority:"normal", notes:"" }); setShowAdd(false); }
    setSaving(false);
  }

  const sc = (s:string) => ({ received:"#dbeafe", preparing:"#fef3c7", ready:"#dcfce7", picked_up:"#f0fdf4", cancelled:"#fee2e2" }[s]||"#f3f4f6");
  const stc = (s:string) => ({ received:"#1e40af", preparing:"#92400e", ready:"#166534", picked_up:"#14532d", cancelled:"#991b1b" }[s]||"#374151");
  const pc = (p:string) => p === "rush" ? { background:"#fee2e2", color:"#991b1b" } : { background:"#f3f4f6", color:"#374151" };

  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        {clientId && <button onClick={()=>setShowAdd(!showAdd)} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"8px 18px", fontWeight:700, fontSize:13, cursor:"pointer" }}>+ New Order</button>}
      </div>
      {showAdd && (
        <form onSubmit={handleAdd} style={{ background:"#f9fafb", border:"1px solid #e5e7eb", borderRadius:8, padding:20, marginBottom:20, display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:12 }}>
          <input placeholder="Customer name" value={form.customer_name} onChange={e=>setForm(f=>({...f,customer_name:e.target.value}))} style={inp} />
          <textarea required placeholder="Items ordered" value={form.items} onChange={e=>setForm(f=>({...f,items:e.target.value}))} rows={2} style={{ ...inp, gridColumn:"1/-1", resize:"vertical" }} />
          <select value={form.order_type} onChange={e=>setForm(f=>({...f,order_type:e.target.value}))} style={sel}>
            <option value="pickup">Pickup</option><option value="delivery">Delivery</option><option value="dine_in">Dine In</option>
          </select>
          <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} style={sel}>
            <option value="normal">Normal</option><option value="rush">Rush</option>
          </select>
          <input placeholder="Notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} style={{ ...inp, gridColumn:"1/-1" }} />
          <div style={{ gridColumn:"1/-1", display:"flex", gap:10 }}>
            <button type="submit" disabled={saving} style={{ background:accentColor, color:"#fff", border:"none", borderRadius:6, padding:"9px 22px", fontWeight:700, cursor:"pointer" }}>{saving?"Saving...":"Save"}</button>
            <button type="button" onClick={()=>setShowAdd(false)} style={{ background:"#f3f4f6", border:"none", borderRadius:6, padding:"9px 16px", cursor:"pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      {orders.length === 0 ? <p style={{ color:"#9ca3af", textAlign:"center", padding:32 }}>No orders in queue.</p> : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:12 }}>
          {orders.map(o=>(
            <div key={o.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:16, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontWeight:700, fontSize:13 }}>{o.order_number||"—"}</span>
                <span style={{ ...pc(o.priority), borderRadius:999, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{o.priority}</span>
              </div>
              <p style={{ margin:0, fontSize:14, fontWeight:500 }}>{o.customer_name||"Walk-in"}</p>
              <p style={{ margin:"6px 0", fontSize:13, color:"#374151", lineHeight:1.4 }}>{o.items}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:8 }}>
                <span style={{ fontSize:12, color:"#6b7280" }}>{o.order_type}</span>
                <span style={{ background:sc(o.status), color:stc(o.status), borderRadius:999, padding:"2px 10px", fontSize:12, fontWeight:600 }}>{o.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}