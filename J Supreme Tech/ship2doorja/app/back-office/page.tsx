import Link from "next/link";
import { adminKpis, adminShipments, adminPreAlerts, statusBreakdown } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status";
import { Icon } from "@/components/brand";
import { Counter } from "@/components/motion";
import { VolumeChart, StatusDonut } from "@/components/admin-charts";
import { ArrowRight } from "lucide-react";

export default function BackOfficeDashboard() {
  return (
    <div className="space-y-7">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Operations dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">USA → Jamaica forwarding · live overview</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400 ring-1 ring-emerald-500/30">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
        </span>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {adminKpis.map((k) => (
          <div key={k.label} className="rounded-2xl bg-[#111a2e] p-5 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/15 text-sky-light">
                <Icon name={k.icon} className="h-5 w-5" />
              </div>
              <span className={"text-xs font-bold " + (k.delta.startsWith("+") ? "text-emerald-400" : "text-slate-500")}>
                {k.delta}
              </span>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-white">
              <Counter to={k.value} />
            </p>
            <p className="text-sm text-slate-400">{k.label}</p>
          </div>
        ))}
      </div>

      {/* charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-[#111a2e] p-6 ring-1 ring-white/10 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-bold text-white">Shipment volume</h2>
            <span className="text-xs text-slate-500">last 6 months</span>
          </div>
          <VolumeChart />
        </div>
        <div className="rounded-2xl bg-[#111a2e] p-6 ring-1 ring-white/10">
          <h2 className="mb-2 font-bold text-white">By status</h2>
          <StatusDonut />
          <div className="mt-3 space-y-1.5">
            {statusBreakdown.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="font-semibold text-white">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* recent + queue */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* recent shipments */}
        <div className="rounded-2xl bg-[#111a2e] ring-1 ring-white/10 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="font-bold text-white">Recent shipments</h2>
            <Link href="/back-office/shipments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-light hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {adminShipments.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{s.customer}</p>
                  <p className="font-mono text-xs text-slate-500">{s.id} · {s.store}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={s.status} />
                  <span className="hidden w-16 text-right text-xs text-slate-500 sm:block">{s.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* pre-alert queue */}
        <div className="rounded-2xl bg-[#111a2e] ring-1 ring-white/10">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 className="font-bold text-white">Pre-alert queue</h2>
            <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-bold text-gold">{adminPreAlerts.length}</span>
          </div>
          <div className="divide-y divide-white/5">
            {adminPreAlerts.map((p) => (
              <div key={p.id} className="px-5 py-3.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{p.customer}</p>
                  <span className="text-xs text-slate-500">{p.when}</span>
                </div>
                <p className="text-xs text-slate-400">{p.store} · {p.desc} · {p.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
