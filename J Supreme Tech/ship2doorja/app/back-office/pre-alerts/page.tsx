import { adminPreAlerts } from "@/lib/demo-data";
import { Package } from "lucide-react";
import { site } from "@/lib/site";
import { NotifyButton } from "@/components/notify-button";

export default function AdminPreAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Pre-alert queue</h1>
        <p className="mt-1 text-sm text-slate-400">Packages customers told us to expect</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {adminPreAlerts.map((p) => (
          <div key={p.id} className="rounded-2xl bg-[#111a2e] p-5 ring-1 ring-white/10">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">{p.customer}</p>
                  <p className="font-mono text-xs text-slate-500">{p.id}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">{p.when}</span>
            </div>
            <div className="mt-4 rounded-xl bg-black/20 p-3 text-sm">
              <p className="text-slate-300">{p.desc}</p>
              <p className="mt-1 text-xs text-slate-500">{p.store} · declared {p.value}</p>
            </div>
            <NotifyButton to={site.contact.email} name={p.customer} packageId={p.id} store={p.store} />
          </div>
        ))}
      </div>
    </div>
  );
}
