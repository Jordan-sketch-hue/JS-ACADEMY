"use client";
import { useState, useEffect } from "react";

type Order = { id: string; created_at: string; customer_name: string; customer_email: string; product_name: string; quantity: number; amount_jmd: number; status: string; company: string };
type Lead = { id: string; created_at: string; name: string; company: string; email: string; phone: string; occasion: string; status: string; message?: string };
type Product = { id: string; name: string; description: string; price: number; unit: string; category: string; abv?: string; badge?: string; image?: string; active: boolean };

const S_ORDER = ["pending", "confirmed", "processing", "delivered", "cancelled"];
const S_LEAD  = ["new", "contacted", "quoted", "closed"];

const DEMO_PRODUCTS: Product[] = [
  { id: "wiag-merlot",    name: "WIAG Merlot",               description: "Rich, velvety Australian Merlot. 187ml RTD.",        price: 850,  unit: "per glass", category: "single", abv: "13.5%", badge: "Classic",   image: "/images/wiag-merlot.jpg",         active: true },
  { id: "wiag-cabernat",  name: "WIAG Cabernet Sauvignon",   description: "Bold, full-bodied Australian Cab Sauv. 187ml RTD.", price: 850,  unit: "per glass", category: "single", abv: "13.5%", badge: "Bold",      image: "/images/wiag-cabernat.jpg",       active: true },
  { id: "wiag-rose",      name: "WIAG Rosé",                 description: "Premium Australian Rosé. 13% ABV. 187ml RTD.",       price: 850,  unit: "per glass", category: "single", abv: "13%",   badge: "Fresh",     image: "/images/wiag-rose-cooler.jpg",    active: true },
  { id: "wiag-moscato",   name: "WIAG Moscato",              description: "Sweet, aromatic Moscato. 7.5% ABV. 187ml RTD.",      price: 850,  unit: "per glass", category: "single", abv: "7.5%",  badge: "Lifestyle", image: "/images/wiag-moscato-sunset.jpg", active: true },
  { id: "bundle-12",      name: "Gift Box — 12 Pack",        description: "12 × WIAG glasses. Mix any varieties.",               price: 9600, unit: "per box",   category: "bundle", badge: "Save J$600",  active: true },
  { id: "bundle-24",      name: "Gift Box — 24 Pack",        description: "24 × WIAG glasses. Team recognition.",                price: 18000,unit: "per box",   category: "bundle", badge: "Save J$2,400",active: true },
  { id: "bundle-48",      name: "Gift Box — 48 Pack",        description: "48 × WIAG glasses. Conference scale.",                price: 33600,unit: "per box",   category: "bundle", badge: "Best Value",  active: true },
];

const EMPTY_PRODUCT: Omit<Product,"id"> = { name: "", description: "", price: 0, unit: "per glass", category: "single", abv: "", badge: "", image: "", active: true };

const statusColor: Record<string, string> = {
  pending:"#C8A84A",confirmed:"#8AB4C8",processing:"#5B7FA8",delivered:"#6BAF8A",cancelled:"#C87060",
  new:"#C8A84A",contacted:"#8AB4C8",quoted:"#5B7FA8",closed:"#6BAF8A",
};

const badge = (s: string) => (
  <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, backgroundColor: `${statusColor[s] || "#fff"}22`, color: statusColor[s] || "#fff", fontWeight: 700, letterSpacing: "0.06em", fontFamily: "Montserrat,sans-serif", whiteSpace: "nowrap" }}>{s.toUpperCase()}</span>
);

const inp = (extra?: React.CSSProperties): React.CSSProperties => ({ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none", width: "100%", fontFamily: "Inter,sans-serif", ...extra });
const sel = (): React.CSSProperties => ({ ...inp(), cursor: "pointer" });
const btn = (bg = "#C8A84A", c = "#060C1A"): React.CSSProperties => ({ backgroundColor: bg, color: c, border: "none", borderRadius: 4, padding: "9px 18px", fontFamily: "Montserrat,sans-serif", fontWeight: 800, fontSize: 12, cursor: "pointer", letterSpacing: "0.06em", whiteSpace: "nowrap" });

export default function AdminPage() {
  const [authed, setAuthed] = useState(true);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tab, setTab] = useState<"dashboard"|"orders"|"leads"|"products">("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads]   = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [editProd, setEditProd] = useState<Product | null>(null);
  const [newProd, setNewProd]   = useState(false);
  const [form, setForm] = useState<Omit<Product,"id">>(EMPTY_PRODUCT);
  const [expandLead, setExpandLead] = useState<string|null>(null);

  useEffect(() => { loadData(); }, []);
  const login = () => { setAuthed(true); loadData(); };

  const loadData = async () => {
    setLoading(true);
    try {
      const [oR, lR] = await Promise.all([fetch("/api/orders"), fetch("/api/leads")]);
      if (oR.ok) setOrders(await oR.json());
      if (lR.ok) setLeads(await lR.json());
    } catch { /* db not connected */ }
    setLoading(false);
  };

  const updOrder = async (id: string, status: string) => {
    await fetch("/api/orders", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id,status}) });
    setOrders(p => p.map(o => o.id===id ? {...o,status} : o));
  };
  const delOrder = (id: string) => setOrders(p => p.filter(o => o.id !== id));

  const updLead = async (id: string, status: string) => {
    await fetch("/api/leads", { method: "PATCH", headers: {"Content-Type":"application/json"}, body: JSON.stringify({id,status}) });
    setLeads(p => p.map(l => l.id===id ? {...l,status} : l));
  };
  const delLead = (id: string) => setLeads(p => p.filter(l => l.id !== id));

  const saveProd = () => {
    if (!form.name || !form.price) return;
    if (editProd) {
      setProducts(p => p.map(x => x.id === editProd.id ? {...form, id: editProd.id} : x));
      setEditProd(null);
    } else {
      const id = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g,"");
      setProducts(p => [...p, {...form, id}]);
      setNewProd(false);
    }
    setForm(EMPTY_PRODUCT);
  };

  const startEdit = (p: Product) => { setEditProd(p); setForm({name:p.name,description:p.description,price:p.price,unit:p.unit,category:p.category,abv:p.abv||"",badge:p.badge||"",image:p.image||"",active:p.active}); setNewProd(false); };
  const delProd = (id: string) => setProducts(p => p.filter(x => x.id !== id));
  const toggleActive = (id: string) => setProducts(p => p.map(x => x.id===id ? {...x,active:!x.active} : x));

  const f = (d: string) => new Date(d).toLocaleDateString("en-JM",{month:"short",day:"numeric",year:"numeric"});
  const jd = (n: number) => `J$${(n||0).toLocaleString()}`;
  const revenue = orders.reduce((s,o) => s+(o.amount_jmd||0),0);

  const TH = (s: string) => <th style={{padding:"9px 12px",textAlign:"left",color:"rgba(200,168,74,0.7)",fontSize:10,fontWeight:700,letterSpacing:"0.1em",fontFamily:"Montserrat,sans-serif",whiteSpace:"nowrap"}}>{s.toUpperCase()}</th>;
  const TD: React.FC<{children: React.ReactNode; style?: React.CSSProperties; onClick?: (e: React.MouseEvent) => void}> = ({children, style, onClick}) => <td onClick={onClick} style={{padding:"11px 12px",color:"rgba(255,255,255,0.75)",fontSize:13,borderBottom:"1px solid rgba(255,255,255,0.05)",...style}}>{children}</td>;

  const tabBtn = (t: typeof tab, label: string) => (
    <button key={t} onClick={() => setTab(t)} style={{padding:"9px 18px",borderRadius:4,border:"none",cursor:"pointer",fontFamily:"Montserrat,sans-serif",fontWeight:700,fontSize:12,textTransform:"capitalize",letterSpacing:"0.04em",
      backgroundColor: tab===t ? "#C8A84A" : "rgba(255,255,255,0.05)",
      color: tab===t ? "#060C1A" : "rgba(255,255,255,0.5)"}}>
      {label}
    </button>
  );

  // ── LOGIN ─────────────────────────────────────────────────
  if (!authed) return (
    <div style={{minHeight:"100vh",backgroundColor:"#060C1A",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{backgroundColor:"#0D1933",borderRadius:8,padding:48,width:"100%",maxWidth:380,border:"1px solid rgba(200,168,74,0.2)"}}>
        <img src="/images/logobigisland.jpg" alt="Big Island Traders" style={{height:40,objectFit:"contain",display:"block",marginBottom:24}} />
        <p style={{color:"rgba(255,255,255,0.4)",fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"Montserrat,sans-serif",marginBottom:24}}>Admin Back Office</p>
        <input type="password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} placeholder="Admin password" style={{...inp(),marginBottom:10}} />
        {pwErr && <p style={{color:"#E8561A",fontSize:12,marginBottom:10}}>{pwErr}</p>}
        <button onClick={login} style={{...btn(),width:"100%",padding:13,fontSize:14}}>ENTER</button>
      </div>
    </div>
  );

  // ── MAIN ──────────────────────────────────────────────────
  return (
    <div style={{minHeight:"100vh",backgroundColor:"#060C1A",fontFamily:"Inter,sans-serif"}}>

      {/* Top bar */}
      <div style={{backgroundColor:"#0D1933",padding:"14px 24px",borderBottom:"1px solid rgba(255,255,255,0.07)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <img src="/images/logobigisland.jpg" alt="" style={{height:32,objectFit:"contain"}} />
          <span style={{color:"rgba(255,255,255,0.35)",fontSize:11,letterSpacing:"0.08em",fontFamily:"Montserrat,sans-serif"}}>BACK OFFICE</span>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {tabBtn("dashboard","Dashboard")}
          {tabBtn("products","Products")}
          {tabBtn("orders","Orders")}
          {tabBtn("leads","Leads")}
          <button onClick={()=>setAuthed(false)} style={{padding:"9px 14px",borderRadius:4,border:"1px solid rgba(255,255,255,0.12)",background:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontSize:12}}>Sign Out</button>
        </div>
      </div>

      <div style={{maxWidth:1400,margin:"0 auto",padding:"28px 24px"}}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div>
            <h2 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:20,color:"#fff",marginBottom:24}}>Overview</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:36}}>
              {[
                {label:"Total Orders",value:orders.length,c:"#5BC8E8"},
                {label:"Revenue",value:jd(revenue),c:"#C8A84A"},
                {label:"Total Leads",value:leads.length,c:"#E8561A"},
                {label:"New Leads",value:leads.filter(l=>l.status==="new").length,c:"#22c55e"},
                {label:"Active Products",value:products.filter(p=>p.active).length,c:"#C8A84A"},
              ].map(s=>(
                <div key={s.label} style={{backgroundColor:"#111E3A",borderRadius:6,padding:"20px 22px",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div style={{fontFamily:"Montserrat,sans-serif",fontWeight:900,fontSize:26,color:s.c}}>{s.value}</div>
                  <div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginTop:5,letterSpacing:"0.04em"}}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
              {[
                {title:"RECENT ORDERS",color:"#5BC8E8",items:orders.slice(0,5).map(o=>({a:o.customer_name||"—",b:o.product_name,s:o.status}))},
                {title:"RECENT LEADS",color:"#C8A84A",items:leads.slice(0,5).map(l=>({a:l.name||"—",b:l.company||l.email,s:l.status}))},
              ].map(col=>(
                <div key={col.title} style={{backgroundColor:"#111E3A",borderRadius:6,padding:22,border:"1px solid rgba(255,255,255,0.06)"}}>
                  <p style={{fontFamily:"Montserrat,sans-serif",fontWeight:700,fontSize:11,color:col.color,letterSpacing:"0.1em",marginBottom:16}}>{col.title}</p>
                  {col.items.length===0 && <p style={{color:"rgba(255,255,255,0.3)",fontSize:13}}>None yet.</p>}
                  {col.items.map((it,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <div>
                        <div style={{color:"#fff",fontSize:13,fontWeight:500}}>{it.a}</div>
                        <div style={{color:"rgba(255,255,255,0.4)",fontSize:11}}>{it.b}</div>
                      </div>
                      {badge(it.s)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab==="products" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24,flexWrap:"wrap",gap:12}}>
              <h2 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:20,color:"#fff",margin:0}}>Products</h2>
              <button onClick={()=>{setNewProd(true);setEditProd(null);setForm(EMPTY_PRODUCT);}} style={btn("#C8A84A","#060C1A")}>+ ADD PRODUCT</button>
            </div>

            {/* Add / Edit form */}
            {(newProd || editProd) && (
              <div style={{backgroundColor:"#111E3A",borderRadius:6,padding:24,border:"1px solid rgba(200,168,74,0.25)",marginBottom:28}}>
                <p style={{fontFamily:"Montserrat,sans-serif",fontWeight:700,fontSize:12,color:"#C8A84A",letterSpacing:"0.1em",marginBottom:18}}>{editProd ? "EDIT PRODUCT" : "NEW PRODUCT"}</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:12}}>
                  <div><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Name *</label>
                    <input style={inp()} value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="WIAG Merlot"/></div>
                  <div><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Price (JMD) *</label>
                    <input style={inp()} type="number" value={form.price||""} onChange={e=>setForm(f=>({...f,price:+e.target.value}))} placeholder="850"/></div>
                  <div><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Unit</label>
                    <input style={inp()} value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))} placeholder="per glass"/></div>
                  <div><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Category</label>
                    <select style={sel()} value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                      <option value="single">Single</option><option value="bundle">Bundle</option>
                    </select></div>
                  <div><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>ABV</label>
                    <input style={inp()} value={form.abv} onChange={e=>setForm(f=>({...f,abv:e.target.value}))} placeholder="13.5%"/></div>
                  <div><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Badge</label>
                    <input style={inp()} value={form.badge} onChange={e=>setForm(f=>({...f,badge:e.target.value}))} placeholder="Classic"/></div>
                  <div style={{gridColumn:"1 / -1"}}><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Description</label>
                    <textarea style={{...inp(),resize:"vertical",minHeight:60}} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Product description"/></div>
                  <div style={{gridColumn:"1 / -1"}}><label style={{color:"rgba(255,255,255,0.4)",fontSize:11,display:"block",marginBottom:5}}>Image path (e.g. /images/wiag-merlot.jpg)</label>
                    <input style={inp()} value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} placeholder="/images/wiag-merlot.jpg"/></div>
                </div>
                <div style={{display:"flex",gap:10,marginTop:18}}>
                  <button onClick={saveProd} style={btn("#C8A84A","#060C1A")}>SAVE</button>
                  <button onClick={()=>{setNewProd(false);setEditProd(null);setForm(EMPTY_PRODUCT);}} style={{...btn("rgba(255,255,255,0.08)","rgba(255,255,255,0.6)"),border:"1px solid rgba(255,255,255,0.1)"}}>CANCEL</button>
                </div>
              </div>
            )}

            {/* Products table */}
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Image","Name","Price","Category","ABV","Badge","Active","Actions"].map(TH)}</tr></thead>
                <tbody>
                  {products.map(p=>(
                    <tr key={p.id}>
                      <TD><div style={{width:44,height:44,borderRadius:4,overflow:"hidden",backgroundColor:"#0D1933"}}>{p.image && <img src={p.image} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>}</div></TD>
                      <TD style={{color:"#fff",fontWeight:500}}>{p.name}</TD>
                      <TD style={{color:"#C8A84A",fontWeight:700}}>{jd(p.price)}</TD>
                      <TD>{p.category}</TD>
                      <TD>{p.abv||"—"}</TD>
                      <TD>{p.badge||"—"}</TD>
                      <TD>
                        <button onClick={()=>toggleActive(p.id)} style={{...btn(p.active?"#22c55e":"rgba(255,255,255,0.1)",p.active?"#0A0906":"rgba(255,255,255,0.5)"),padding:"4px 12px",fontSize:10}}>
                          {p.active ? "LIVE" : "HIDDEN"}
                        </button>
                      </TD>
                      <TD>
                        <div style={{display:"flex",gap:8}}>
                          <button onClick={()=>startEdit(p)} style={{...btn("#5BC8E8","#060C1A"),padding:"5px 12px",fontSize:11}}>EDIT</button>
                          <button onClick={()=>{ if(confirm(`Delete "${p.name}"?`)) delProd(p.id); }} style={{...btn("#E8561A","#fff"),padding:"5px 12px",fontSize:11}}>DELETE</button>
                        </div>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab==="orders" && (
          <div>
            <h2 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:20,color:"#fff",marginBottom:24}}>Orders{loading&&<span style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginLeft:12}}>Loading…</span>}</h2>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Date","Customer","Company","Product","Qty","Amount","Status","Update",""].map(TH)}</tr></thead>
                <tbody>
                  {orders.map(o=>(
                    <tr key={o.id}>
                      <TD>{f(o.created_at)}</TD>
                      <TD style={{color:"#fff",fontWeight:500}}>{o.customer_name}</TD>
                      <TD>{o.company||"—"}</TD>
                      <TD>{o.product_name}</TD>
                      <TD>{o.quantity}</TD>
                      <TD style={{color:"#C8A84A",fontWeight:700}}>{jd(o.amount_jmd)}</TD>
                      <TD>{badge(o.status)}</TD>
                      <TD>
                        <select value={o.status} onChange={e=>updOrder(o.id,e.target.value)} style={sel()}>
                          {S_ORDER.map(s=><option key={s} value={s}>{s}</option>)}
                        </select>
                      </TD>
                      <TD><button onClick={()=>delOrder(o.id)} style={{...btn("#E8561A","#fff"),padding:"4px 10px",fontSize:10}}>DEL</button></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length===0 && <p style={{color:"rgba(255,255,255,0.3)",fontSize:14,padding:"24px 0"}}>No orders yet. They will appear here once Supabase is connected.</p>}
            </div>
          </div>
        )}

        {/* ── LEADS ── */}
        {tab==="leads" && (
          <div>
            <h2 style={{fontFamily:"Montserrat,sans-serif",fontWeight:800,fontSize:20,color:"#fff",marginBottom:24}}>Leads{loading&&<span style={{fontSize:12,color:"rgba(255,255,255,0.3)",marginLeft:12}}>Loading…</span>}</h2>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead><tr>{["Date","Name","Company","Email","Phone","Occasion","Status","Update",""].map(TH)}</tr></thead>
                <tbody>
                  {leads.map(l=>(
                    <>
                      <tr key={l.id} onClick={()=>setExpandLead(expandLead===l.id?null:l.id)} style={{cursor:"pointer"}}>
                        <TD>{f(l.created_at)}</TD>
                        <TD style={{color:"#fff",fontWeight:500}}>{l.name}</TD>
                        <TD>{l.company||"—"}</TD>
                        <TD><a href={`mailto:${l.email}`} onClick={e=>e.stopPropagation()} style={{color:"#5BC8E8",textDecoration:"none"}}>{l.email}</a></TD>
                        <TD>{l.phone||"—"}</TD>
                        <TD>{l.occasion||"—"}</TD>
                        <TD>{badge(l.status)}</TD>
                        <TD onClick={e=>e.stopPropagation()}>
                          <select value={l.status} onChange={e=>updLead(l.id,e.target.value)} style={sel()}>
                            {S_LEAD.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                        </TD>
                        <TD onClick={e=>e.stopPropagation()}>
                          <button onClick={()=>delLead(l.id)} style={{...btn("#E8561A","#fff"),padding:"4px 10px",fontSize:10}}>DEL</button>
                        </TD>
                      </tr>
                      {expandLead===l.id && l.message && (
                        <tr key={l.id+"_msg"}>
                          <td colSpan={9} style={{padding:"12px 12px 20px 12px",backgroundColor:"rgba(91,200,232,0.04)",borderBottom:"1px solid rgba(91,200,232,0.1)"}}>
                            <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,lineHeight:1.7,margin:0,fontStyle:"italic"}}>"{l.message}"</p>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
              {leads.length===0 && <p style={{color:"rgba(255,255,255,0.3)",fontSize:14,padding:"24px 0"}}>No leads yet. Booking form submissions will appear here once Supabase is connected.</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
