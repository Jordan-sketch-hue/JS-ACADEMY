import { adminCustomers } from "@/lib/demo-data";
import { cn } from "@/components/ui";

const tone: Record<string, string> = {
  Active: "bg-sky/15 text-sky-light",
  New: "bg-emerald-500/15 text-emerald-400",
  VIP: "bg-gold/20 text-gold",
};

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Customers</h1>
        <p className="mt-1 text-sm text-slate-400">{adminCustomers.length} of 742 shown</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-[#111a2e] ring-1 ring-white/10">
        <div className="hidden grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr] gap-4 border-b border-white/10 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid">
          <span>Customer</span><span>Suite</span><span>Shipments</span><span>Tier</span><span className="text-right">Joined</span>
        </div>
        <div className="divide-y divide-white/5">
          {adminCustomers.map((c) => (
            <div key={c.suite} className="grid items-center gap-2 px-6 py-4 transition-colors hover:bg-white/[0.03] md:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr] md:gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-gradient text-xs font-bold text-white">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="font-semibold text-white">{c.name}</span>
              </div>
              <span className="font-mono text-sm text-slate-400">{c.suite}</span>
              <span className="text-sm text-slate-300">{c.shipments}</span>
              <span>
                <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", tone[c.status])}>{c.status}</span>
              </span>
              <span className="text-xs text-slate-500 md:text-right">{c.joined}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
