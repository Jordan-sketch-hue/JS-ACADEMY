import Link from "next/link";
import { me, myPackages, statusMeta } from "@/lib/demo-data";
import { StatusBadge } from "@/components/status";
import { CopyButton } from "@/components/copy-button";
import { Icon } from "@/components/brand";
import { ArrowRight, Warehouse, Package, Home as HomeIcon } from "lucide-react";

export default function PortalOverview() {
  const active = myPackages.filter((p) => p.status !== "Delivered");
  const ready = myPackages.filter((p) => p.status === "Ready for pickup").length;
  const fullAddress = `${me.usAddress.line1}, ${me.usAddress.line2}`;

  const stats = [
    { label: "Active shipments", value: active.length, Icon: Package },
    { label: "Ready for pickup", value: ready, Icon: HomeIcon },
    { label: "Rewards stamps", value: `${me.rewards.stamps}/${me.rewards.nextAt}`, Icon: Warehouse },
  ];

  return (
    <div className="space-y-8">
      {/* greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">
            Welcome back, {me.firstName} 👋
          </h1>
          <p className="mt-1 text-slate-500">Here's what's moving today.</p>
        </div>
        <Link
          href="/portal/pre-alert"
          className="inline-flex items-center gap-2 rounded-xl bg-sky px-4 py-2.5 text-sm font-bold text-navy-deep shadow-lg shadow-sky/30 transition-colors hover:bg-sky-light"
        >
          <Icon name="bell" className="h-4 w-4" /> Pre-alert a package
        </Link>
      </div>

      {/* US address + rewards */}
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-navy-gradient p-7 text-white lg:col-span-2">
          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-sky/20 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-sky-light">
                <Warehouse className="h-4 w-4" /> Your free U.S. shipping address
              </div>
              {/* Air / Sea toggle */}
              <div className="flex rounded-lg bg-white/10 p-0.5 ring-1 ring-white/20 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setAddrMode("air")}
                  className={"rounded-md px-3 py-1.5 transition-colors " + (addrMode === "air" ? "bg-sky text-navy-deep" : "text-mist/70 hover:text-white")}
                >
                  ✈ AIR
                </button>
                <button
                  type="button"
                  onClick={() => setAddrMode("sea")}
                  className={"rounded-md px-3 py-1.5 transition-colors " + (addrMode === "sea" ? "bg-sky text-navy-deep" : "text-mist/70 hover:text-white")}
                >
                  🚢 SEA
                </button>
              </div>
            </div>
            <p className="mt-4 font-mono text-sm leading-7 text-white/90">
              {me.usAddress.name}<br />
              {me.usAddress.street}<br />
              <span className="text-sky-light font-bold">
                {addrMode === "air" ? me.usAddress.airLine2 : me.usAddress.seaLine2}
              </span><br />
              {me.usAddress.cityStateZip}<br />
              USA
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <CopyButton text={addrMode === "air" ? airAddress : seaAddress} label="Copy address" />
              <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold text-white ring-1 ring-white/20">
                Code: AVORA{me.suite}
              </span>
            </div>
            <p className="mt-4 text-xs text-mist/60">
              Use the <span className="text-sky-light">✈ AIR</span> address for fast air freight · <span className="text-sky-light">🚢 SEA</span> for sea freight. Put your name exactly as shown on the first line.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-3xl bg-white p-7 ring-1 ring-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold-deep">
              <Icon name="gift" className="h-4 w-4" /> Rewards
            </div>
            <p className="mt-3 text-3xl font-extrabold text-navy">
              {me.rewards.stamps}
              <span className="text-lg text-slate-400"> / {me.rewards.nextAt}</span>
            </p>
            <p className="text-sm text-slate-500">shipments to your {me.rewards.nextReward.toLowerCase()}</p>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gold-gradient"
                style={{ width: `${(me.rewards.stamps / me.rewards.nextAt) * 100}%` }}
              />
            </div>
          </div>
          <Link href="/portal/rewards" className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-blue hover:underline">
            View rewards <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200/80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky/10 text-blue">
              <s.Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-2xl font-extrabold text-navy">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* active shipments */}
      <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-200/80 sm:p-7">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-navy">Active shipments</h2>
          <Link href="/portal/shipments" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue hover:underline">
            All shipments <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 space-y-4">
          {active.map((p) => (
            <div key={p.id} className="rounded-2xl border border-slate-100 p-4 transition-colors hover:border-sky/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold text-navy">{p.desc}</p>
                  <p className="text-sm text-slate-400">{p.store} · {p.id} · {p.weight}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={p.status} />
                  <p className="mt-1 text-xs font-semibold text-slate-400">ETA {p.eta}</p>
                </div>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
