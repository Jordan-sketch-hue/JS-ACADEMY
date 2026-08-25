import Image from "next/image";
import { me } from "@/lib/demo-data";
import { rewards } from "@/lib/site";
import { Icon } from "@/components/brand";

export default function PortalRewards() {
  const pct = (me.rewards.stamps / me.rewards.nextAt) * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">Your rewards</h1>
        <p className="mt-1 text-slate-500">Every shipment earns a stamp toward a free one.</p>
      </div>

      {/* progress */}
      <div className="rounded-3xl bg-navy-gradient p-7 text-white sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-sky-light">Progress</p>
            <p className="mt-2 text-4xl font-extrabold">
              {me.rewards.stamps}<span className="text-xl text-mist/60"> / {me.rewards.nextAt} shipments</span>
            </p>
          </div>
          <p className="text-sm text-mist/70">
            {me.rewards.nextAt - me.rewards.stamps} more for your {me.rewards.nextReward.toLowerCase()}
          </p>
        </div>
        {/* stamps row */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {Array.from({ length: me.rewards.nextAt }).map((_, i) => (
            <div
              key={i}
              className={
                "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold " +
                (i < me.rewards.stamps
                  ? "bg-gold-gradient text-[#5A3B00]"
                  : "border-2 border-dashed border-white/25 text-white/40")
              }
            >
              {i < me.rewards.stamps ? <Icon name="check" className="h-5 w-5" strokeWidth={3} /> : i + 1}
            </div>
          ))}
        </div>
        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gold-gradient" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* tiers + card */}
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {rewards.map((r) => (
            <div key={r.reward} className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200/80">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-gradient text-[#5A3B00]">
                <Icon name={r.icon} className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div>
                <p className="font-extrabold text-navy">{r.when}</p>
                <p className="text-sm font-bold text-blue">{r.reward} · {r.limit}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <Image
            src="/rewards-card.png"
            alt="Ship2Door Rewards punch card"
            width={1050}
            height={600}
            className="w-full max-w-md rounded-2xl shadow-xl ring-1 ring-slate-200/60"
          />
        </div>
      </div>
    </div>
  );
}
