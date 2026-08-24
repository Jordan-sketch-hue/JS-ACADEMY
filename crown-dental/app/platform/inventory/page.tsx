"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const CATEGORIES = ["PPE", "Consumables", "Restorative", "Impression", "Anesthetic", "Equipment"];
const VENDORS = ["Henry Schein","Hu-Friedy","Ivoclar","Patterson Dental","Kerr Dental","Dentsply","3M Oral Care"];

const initialItems = [
  { sku: "SUP-001", name: "Nitrile gloves (M) — 100ct",  cat: "PPE",         qty: 42, par: 20, unit: "Box",    vendor: "Henry Schein", last: "Jun 25", status: "OK"  },
  { sku: "SUP-002", name: "Prophy paste — mint 200ct",   cat: "Consumables",  qty: 6,  par: 10, unit: "Tub",    vendor: "Hu-Friedy",    last: "Jun 10", status: "Low" },
  { sku: "SUP-003", name: "Composite A2 — 20g syringe",  cat: "Restorative",  qty: 3,  par: 8,  unit: "Unit",   vendor: "Ivoclar",      last: "Jun 18", status: "Low" },
  { sku: "SUP-004", name: "Surgical masks — 50ct",        cat: "PPE",          qty: 0,  par: 15, unit: "Box",    vendor: "Patterson Dental", last: "May 30", status: "Out" },
  { sku: "SUP-005", name: "Bonding agent — 6ml",          cat: "Restorative",  qty: 11, par: 6,  unit: "Bottle", vendor: "Kerr Dental",  last: "Jun 29", status: "OK"  },
  { sku: "SUP-006", name: "Alginate impression — 1lb",    cat: "Impression",   qty: 8,  par: 5,  unit: "Can",    vendor: "Dentsply",     last: "Jun 20", status: "OK"  },
];

const statusStyle: Record<string, string> = {
  OK:  "bg-teal/10 text-teal",
  Low: "bg-gold/15 text-gold-deep",
  Out: "bg-alert/10 text-alert",
};

export default function InventoryPage() {
  const [items, setItems] = useState(initialItems);
  const [toast, setToast] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", cat: "PPE", qty: "", par: "", unit: "Box", vendor: VENDORS[0] });

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function order(sku: string) {
    const item = items.find(i => i.sku === sku);
    if (!item) return;
    setItems(prev => prev.map(i => i.sku === sku ? { ...i, qty: i.par * 2, status: "OK", last: "Today" } : i));
    flash(`Reorder placed for ${item.name}. Arriving in 2 business days.`);
  }

  function addItem() {
    if (!form.name.trim() || !form.qty || !form.par) return;
    const qty = Number(form.qty);
    const par = Number(form.par);
    const status = qty === 0 ? "Out" : qty < par ? "Low" : "OK";
    const nextSku = `SUP-${String(initialItems.length + items.length - initialItems.length + 1).padStart(3, "0")}`;
    setItems(prev => [...prev, {
      sku: nextSku, name: form.name.trim(), cat: form.cat, qty, par, unit: form.unit,
      vendor: form.vendor, last: "Today", status,
    }]);
    setForm({ name: "", cat: "PPE", qty: "", par: "", unit: "Box", vendor: VENDORS[0] });
    setShowNew(false);
    flash(`"${form.name.trim()}" added to inventory.`);
  }

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Inventory</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => {
            const rows = ["SKU,Name,Category,Qty,PAR,Unit,Vendor,Last Order,Status"];
            items.forEach(i => rows.push(`${i.sku},"${i.name}",${i.cat},${i.qty},${i.par},${i.unit},"${i.vendor}",${i.last},${i.status}`));
            const blob = new Blob([rows.join("\n")], { type: "text/csv" });
            const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "crown-inventory.csv"; a.click(); URL.revokeObjectURL(url);
            flash("Inventory exported.");
          }} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate hover:bg-surface transition-colors">
            <Icons.Download className="h-4 w-4" /> Export
          </button>
          <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.Plus className="h-4 w-4" /> Add item
          </button>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.Package className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">Add Inventory Item</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Item name <span className="text-alert">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Nitrile gloves (M) — 100ct"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Category</label>
                  <select value={form.cat} onChange={e => setForm(f => ({...f, cat: e.target.value}))}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Unit</label>
                  <input type="text" value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))}
                    placeholder="Box, Bottle, Unit…"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">Current qty <span className="text-alert">*</span></label>
                  <input type="number" value={form.qty} onChange={e => setForm(f => ({...f, qty: e.target.value}))}
                    min={0} placeholder="0"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-1.5">PAR level <span className="text-alert">*</span></label>
                  <input type="number" value={form.par} onChange={e => setForm(f => ({...f, par: e.target.value}))}
                    min={1} placeholder="10"
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Vendor</label>
                <select value={form.vendor} onChange={e => setForm(f => ({...f, vendor: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {VENDORS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addItem} disabled={!form.name.trim() || !form.qty || !form.par} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Add Item</button>
            </div>
          </div>
        </div>
      )}

      {items.some(i => i.status !== "OK") && (
        <div className="flex items-start gap-3 rounded-xl border border-alert/30 bg-alert/5 p-4">
          <Icons.AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-alert" />
          <div>
            <p className="text-sm font-semibold text-ink">{items.filter(i => i.status !== "OK").length} items need attention</p>
            <p className="text-xs text-slate mt-0.5">
              {items.find(i => i.status === "Out")?.name} is out of stock.{" "}
              {items.filter(i => i.status === "Low").map(i => i.name).join(" and ")}{" "}
              {items.filter(i => i.status === "Low").length > 1 ? "are" : "is"} below par.{" "}
              <button onClick={() => {
                items.filter(i => i.status !== "OK").forEach(i => order(i.sku));
              }} className="text-gold-deep font-semibold hover:underline">Reorder all</button>
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Total SKUs",    v: String(148 + items.length - initialItems.length), i: "Package" },
          { l: "Low stock",     v: String(items.filter(i => i.status === "Low").length),  i: "TrendingDown" },
          { l: "Out of stock",  v: String(items.filter(i => i.status === "Out").length),  i: "X" },
          { l: "Reorders / mo", v: "$47k", i: "ShoppingCart" },
        ].map((s) => {
          const I = (Icons as any)[s.i] ?? Icons.Circle;
          return (
            <div key={s.l} className="card bg-white rounded-xl p-4 shadow-card flex items-center gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface"><I className="h-5 w-5 text-gold-deep" /></div>
              <div><p className="text-xs text-slate">{s.l}</p><p className="text-xl font-semibold text-ink">{s.v}</p></div>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-surface">
              {["SKU","Item","Category","Qty","PAR","Unit","Vendor","Last order","Status",""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-mist">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((it) => (
              <tr key={it.sku} className="hover:bg-surface transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-mist">{it.sku}</td>
                <td className="px-4 py-3 font-medium text-ink">{it.name}</td>
                <td className="px-4 py-3 text-slate">{it.cat}</td>
                <td className={`px-4 py-3 font-semibold ${it.qty === 0 ? "text-alert" : it.qty < it.par ? "text-gold-deep" : "text-ink"}`}>{it.qty}</td>
                <td className="px-4 py-3 text-mist">{it.par}</td>
                <td className="px-4 py-3 text-slate">{it.unit}</td>
                <td className="px-4 py-3 text-slate">{it.vendor}</td>
                <td className="px-4 py-3 text-mist">{it.last}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyle[it.status]}`}>{it.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => order(it.sku)} className="rounded-lg border border-line px-3 py-1 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                    {it.status === "OK" ? "Reorder" : "Order now"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
