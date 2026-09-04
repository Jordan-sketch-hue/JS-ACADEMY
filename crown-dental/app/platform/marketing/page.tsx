"use client";
import { useState } from "react";
import * as Icons from "lucide-react";
import { useGuideActive } from "@/components/GuideContext";

const CHANNELS = ["SMS","Email","SMS + Email","Email + SMS","Social","SMS + Social"];

const initialCampaigns = [
  { id: "c1", name: "Whitening Summer Promo",    channel: "SMS + Email", sent: 1240, opened: 892,  booked: 67,  status: "active", revenue: 8040  },
  { id: "c2", name: "Implant Awareness Series",  channel: "Email",       sent: 680,  opened: 314,  booked: 22,  status: "active", revenue: 36300 },
  { id: "c3", name: "Recall — 6-Month Checkup",  channel: "SMS",         sent: 2100, opened: 1890, booked: 284, status: "active", revenue: 42600 },
  { id: "c4", name: "Invisalign Free Consult",   channel: "Email + SMS", sent: 540,  opened: 218,  booked: 18,  status: "paused", revenue: 12600 },
  { id: "c5", name: "New Mover Welcome Offer",   channel: "Email",       sent: 95,   opened: 71,   booked: 9,   status: "draft",  revenue: 0     },
];

const statusStyle: Record<string, string> = {
  active: "bg-teal/10 text-teal",
  paused: "bg-gold/10 text-gold-deep",
  draft:  "bg-slate/10 text-slate",
};

export default function MarketingPage() {
  const guideActive = useGuideActive();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const displayedCampaigns = guideActive ? campaigns : [];
  const [toast, setToast] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: "", channel: "SMS" });
  const [editCampaign, setEditCampaign] = useState<typeof initialCampaigns[0] | null>(null);
  const [editName, setEditName] = useState("");

  function flash(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  function openEdit(c: typeof initialCampaigns[0]) { setEditCampaign(c); setEditName(c.name); }
  function saveEdit() {
    if (!editCampaign || !editName.trim()) return;
    setCampaigns(prev => prev.map(c => c.id === editCampaign.id ? { ...c, name: editName.trim() } : c));
    setEditCampaign(null);
    flash("Campaign updated.");
  }

  function toggle(id: string) {
    setCampaigns(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === "active" ? "paused" : "active" } : c
    ));
  }

  function addCampaign() {
    if (!form.name.trim()) return;
    const id = `c${campaigns.length + 1}`;
    setCampaigns(prev => [...prev, {
      id, name: form.name.trim(), channel: form.channel,
      sent: 0, opened: 0, booked: 0, status: "draft", revenue: 0,
    }]);
    setForm({ name: "", channel: "SMS" });
    setShowNew(false);
    flash(`Campaign "${form.name.trim()}" created as a draft.`);
  }

  const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      {editCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setEditCampaign(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-semibold text-ink">Edit Campaign</span>
              <button onClick={() => setEditCampaign(null)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Campaign name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Channel</label>
                <p className="text-sm text-slate">{editCampaign.channel} (read-only — change via campaign settings)</p>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setEditCampaign(null)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={saveEdit} disabled={!editName.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Save</button>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2">
                <Icons.Megaphone className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                <span className="font-semibold text-ink">New Campaign</span>
              </div>
              <button onClick={() => setShowNew(false)} className="rounded-lg p-1 text-mist hover:text-ink"><Icons.X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Campaign name <span className="text-alert">*</span></label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Summer Whitening Promo"
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-mist focus:border-gold/60 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate mb-1.5">Channel</label>
                <select value={form.channel} onChange={e => setForm(f => ({...f, channel: e.target.value}))}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink focus:border-gold/60 focus:outline-none">
                  {CHANNELS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 border-t border-line px-5 py-4">
              <button onClick={() => setShowNew(false)} className="flex-1 rounded-xl border border-line py-2.5 text-sm text-slate hover:bg-surface">Cancel</button>
              <button onClick={addCampaign} disabled={!form.name.trim()} className="flex-1 gold-btn rounded-xl py-2.5 text-sm disabled:opacity-40">Create Campaign</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Marketing</h1>
          <p className="mt-1 text-sm text-slate">{guideActive ? `${displayedCampaigns.filter(c => c.status === "active").length} active campaigns · $${totalRevenue.toLocaleString()} attributed revenue` : "No campaigns yet · connect your practice to get started"}</p>
        </div>
        <button onClick={() => setShowNew(true)} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
          <Icons.Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(guideActive ? [
          { label: "Total Sent",  value: "4,655", icon: "Send",       color: "text-ink" },
          { label: "Open Rate",   value: "72%",   icon: "MailOpen",   color: "text-teal" },
          { label: "Bookings",    value: "400",   icon: "Calendar",   color: "text-gold-deep" },
          { label: "Avg ROI",     value: "9.4×",  icon: "TrendingUp", color: "text-teal" },
        ] : []).map(s => {
          const I = (Icons as any)[s.icon];
          return (
            <div key={s.label} className="card bg-white p-4 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <I className={`h-4 w-4 ${s.color}`} strokeWidth={1.5} />
                <p className="text-xs text-slate">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-ink">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="card overflow-hidden bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2">
            <Icons.Megaphone className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
            <span className="font-semibold text-ink">Campaigns</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface">
                <th className="px-5 py-3 text-left text-xs font-medium text-slate">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate">Channel</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate">Sent</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate">Opened</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate">Booked</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {displayedCampaigns.map(c => (
                <tr key={c.id} className="hover:bg-surface transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <p className="font-medium text-ink">{c.name}</p>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[c.status]}`}>{c.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate text-xs">{c.channel}</td>
                  <td className="px-4 py-4 text-right font-medium text-ink">{c.sent.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-teal font-medium">{c.sent > 0 ? Math.round((c.opened / c.sent) * 100) : 0}%</span>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-ink">{c.booked}</td>
                  <td className="px-4 py-4 text-right font-semibold text-ink">
                    {c.revenue > 0 ? `$${c.revenue.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {c.status !== "draft" && (
                        <button onClick={() => toggle(c.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs border transition-colors ${
                            c.status === "active"
                              ? "border-gold/30 text-gold-deep hover:bg-gold/5"
                              : "border-teal/30 text-teal hover:bg-teal/5"
                          }`}>
                          {c.status === "active" ? "Pause" : "Resume"}
                        </button>
                      )}
                      <button onClick={() => openEdit(c)} className="rounded-lg border border-line px-3 py-1.5 text-xs text-slate hover:border-gold/40 hover:text-ink transition-colors">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: "MessageSquare", label: "SMS",    sent: guideActive ? 3195 : 0, rate: guideActive ? "89% delivery"  : "No data yet" },
          { icon: "Mail",          label: "Email",  sent: guideActive ? 1460 : 0, rate: guideActive ? "72% open rate" : "No data yet" },
          { icon: "Share2",        label: "Social", sent: 0,    rate: "Connect account" },
        ].map(ch => {
          const I = (Icons as any)[ch.icon];
          return (
            <div key={ch.label} className="card bg-white p-5 shadow-card flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/8 shrink-0">
                <I className="h-5 w-5 text-gold-deep" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-ink">{ch.label}</p>
                {ch.rate === "Connect account" ? (
                  <button onClick={() => flash("Social connection coming soon — contact support to integrate your accounts.")} className="mt-0.5 block text-xs font-semibold text-gold-deep hover:underline">{ch.rate}</button>
                ) : (
                  <p className="text-xs text-slate mt-0.5">{ch.sent > 0 ? `${ch.sent.toLocaleString()} sent · ` : ""}{ch.rate}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
