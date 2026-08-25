import { adminShipments } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status";
import { Search } from "lucide-react";

export default function AdminShipments() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Shipments</h1>
          <p className="mt-1 text-sm text-slate-400">{adminShipments.length} packages in the pipeline</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-[#111a2e] px-3 py-2 ring-1 ring-white/10">
          <Search className="h-4 w-4 text-slate-500" />
          <input
            placeholder="Search ID or customer…"
            className="bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#111a2e] ring-1 ring-white/10">
        <div className="hidden grid-cols-[1fr_1.3fr_1fr_0.8fr_1fr_0.8fr] gap-4 border-b border-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid">
          <span>Tracking</span><span>Customer</span><span>Store</span><span>Weight</span><span>Status</span><span className="text-right">Updated</span>
        </div>
        <div className="divide-y divide-white/5">
          {adminShipments.map((s) => (
            <div key={s.id} className="grid items-center gap-2 px-6 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[1fr_1.3fr_1fr_0.8fr_1fr_0.8fr] md:gap-4">
              <span className="font-mono text-sm text-sky-light">{s.id}</span>
              <span className="font-semibold text-white">{s.customer}</span>
              <span className="text-sm text-slate-400">{s.store}</span>
              <span className="text-sm text-slate-400">{s.weight}</span>
              <span><StatusBadge status={s.status} /></span>
              <span className="text-xs text-slate-500 md:text-right">{s.updated}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
