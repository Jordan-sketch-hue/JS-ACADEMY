import { myPackages, statusMeta } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status";

export default function PortalShipments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Your shipments</h1>
        <p className="mt-1 text-slate-500">Every package, from U.S. warehouse to your door.</p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200/80">
        {/* header (desktop) */}
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_1fr_0.7fr] gap-4 border-b border-slate-100 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 md:grid">
          <span>Package</span>
          <span>Tracking</span>
          <span>Weight</span>
          <span>Status</span>
          <span className="text-right">ETA</span>
        </div>
        <div className="divide-y divide-slate-100">
          {myPackages.map((p) => (
            <div key={p.id} className="px-6 py-4">
              <div className="grid items-center gap-3 md:grid-cols-[1.4fr_1fr_0.8fr_1fr_0.7fr] md:gap-4">
                <div>
                  <p className="font-bold text-navy">{p.desc}</p>
                  <p className="text-sm text-slate-400">{p.store}</p>
                </div>
                <p className="font-mono text-sm text-slate-500">{p.id}</p>
                <p className="text-sm text-slate-500">{p.weight}</p>
                <div><StatusBadge status={p.status} /></div>
                <p className="text-sm font-semibold text-slate-500 md:text-right">{p.eta}</p>
              </div>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-gradient"
                  style={{ width: `${(statusMeta[p.status].step / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
