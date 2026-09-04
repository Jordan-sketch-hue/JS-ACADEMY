"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

type Integration = { name: string; cat: string; desc: string; connected: boolean; icon: string };

const initialList: Integration[] = [
  { name: "Availity",           cat: "Insurance",    desc: "Real-time eligibility checks & claim submission",     connected: true,  icon: "ShieldCheck"   },
  { name: "Google Workspace",   cat: "Productivity", desc: "Calendar sync, Drive, and Gmail for your team",       connected: true,  icon: "Mail"          },
  { name: "Stripe",             cat: "Payments",     desc: "In-office and online payment processing",             connected: true,  icon: "CreditCard"    },
  { name: "Twilio",             cat: "Messaging",    desc: "Automated appointment reminders via SMS",             connected: true,  icon: "MessageSquare" },
  { name: "Dexis Imaging",      cat: "Imaging",      desc: "X-ray and CBCT DICOM viewer integration",            connected: false, icon: "Scan"          },
  { name: "Planmeca",           cat: "Imaging",      desc: "Chair-side pan/bitewing acquisition bridge",         connected: false, icon: "Monitor"       },
  { name: "Patterson Dental",   cat: "Supplies",     desc: "One-click reorders from inventory low-stock alerts", connected: false, icon: "Package"       },
  { name: "QuickBooks Online",  cat: "Accounting",   desc: "Automatic revenue posting and expense tracking",     connected: false, icon: "BookOpen"      },
  { name: "Zoom",               cat: "Telehealth",   desc: "HIPAA-compliant virtual consultations",              connected: false, icon: "Video"         },
  { name: "Yelp / Google",      cat: "Reviews",      desc: "Post-visit review request automation",               connected: false, icon: "Star"          },
  { name: "Open Dental Bridge", cat: "Migration",    desc: "One-time import from Open Dental PMS",               connected: false, icon: "GitMerge"      },
  { name: "Apple Health",       cat: "Patient",      desc: "Patient health records sync on iOS",                 connected: false, icon: "HeartPulse"    },
];

const catColor: Record<string, string> = {
  Insurance:    "bg-gold/10 text-gold-deep",
  Productivity: "bg-teal/10 text-teal",
  Payments:     "bg-ink-3/10 text-ink-3",
  Messaging:    "bg-surface text-slate border border-line",
  Imaging:      "bg-surface text-slate border border-line",
  Supplies:     "bg-surface text-slate border border-line",
  Accounting:   "bg-surface text-slate border border-line",
  Telehealth:   "bg-surface text-slate border border-line",
  Reviews:      "bg-surface text-slate border border-line",
  Migration:    "bg-surface text-slate border border-line",
  Patient:      "bg-surface text-slate border border-line",
};

export default function IntegrationsPage() {
  const [list, setList] = useState(initialList);
  const [toast, setToast] = useState<string | null>(null);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function toggle(name: string) {
    const it = list.find(i => i.name === name);
    if (!it) return;
    if (it.connected) {
      flash(`${name} disconnected.`);
      setList(prev => prev.map(i => i.name === name ? { ...i, connected: false } : i));
    } else {
      flash(`${name} connected successfully.`);
      setList(prev => prev.map(i => i.name === name ? { ...i, connected: true } : i));
    }
  }

  const connected = list.filter(i => i.connected);
  const available = list.filter(i => !i.connected);

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-ink text-white px-4 py-3 shadow-xl text-sm">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" /> {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Integrations</h1>
        <button onClick={() => flash("Crown AI Marketplace coming soon — additional integrations will appear here.")} className="flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm text-slate hover:bg-surface transition-colors">
          <Icons.Puzzle className="h-4 w-4" /> Browse marketplace
        </button>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-mist mb-3">Connected ({connected.length})</p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {connected.map((int) => {
            const I = (Icons as any)[int.icon] ?? Icons.Circle;
            return (
              <div key={int.name} className="card bg-white p-4 shadow-card border-l-2 border-l-teal flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal/10"><I className="h-4 w-4 text-teal" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{int.name}</p>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${catColor[int.cat]}`}>{int.cat}</span>
                  </div>
                  <p className="text-xs text-slate mt-0.5 line-clamp-2">{int.desc}</p>
                </div>
                <button onClick={() => toggle(int.name)} className="shrink-0 rounded-lg border border-line px-2.5 py-1 text-xs text-slate hover:bg-surface transition-colors">Manage</button>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-mist mb-3">Available ({available.length})</p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {available.map((int) => {
            const I = (Icons as any)[int.icon] ?? Icons.Circle;
            return (
              <div key={int.name} className="card bg-white p-4 shadow-card flex items-start gap-3 opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface"><I className="h-4 w-4 text-mist" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{int.name}</p>
                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${catColor[int.cat]}`}>{int.cat}</span>
                  </div>
                  <p className="text-xs text-slate mt-0.5 line-clamp-2">{int.desc}</p>
                </div>
                <button onClick={() => toggle(int.name)} className="shrink-0 gold-btn rounded-lg px-2.5 py-1 text-xs">Connect</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
