"use client";
import { useState } from "react";
import * as Icons from "lucide-react";

const monthly = [
  { month: "Jan", revenue: 41200, patients: 182, collections: 38900 },
  { month: "Feb", revenue: 38700, patients: 168, collections: 36400 },
  { month: "Mar", revenue: 44100, patients: 196, collections: 41800 },
  { month: "Apr", revenue: 47300, patients: 210, collections: 45100 },
  { month: "May", revenue: 51200, patients: 228, collections: 48700 },
  { month: "Jun", revenue: 55800, patients: 244, collections: 53100 },
];

const quarterly = [
  { month: "Q4 '25", revenue: 148200, patients: 656, collections: 141000 },
  { month: "Q1 '26", revenue: 124000, patients: 546, collections: 117100 },
  { month: "Q2 '26", revenue: 154300, patients: 682, collections: 147300 },
];

const yearly = [
  { month: "2023", revenue: 389000, patients: 1840, collections: 368000 },
  { month: "2024", revenue: 441200, patients: 2100, collections: 418000 },
  { month: "2025", revenue: 512400, patients: 2480, collections: 487000 },
  { month: "2026", revenue: 278200, patients: 1390, collections: 264000 },
];

const periodKpis = {
  month: [
    { label: "Production",   value: "$55,800",   change: "+8.9%",  up: true },
    { label: "Collections",  value: "$53,100",   change: "+9.1%",  up: true },
    { label: "New Patients", value: "38",         change: "+12%",   up: true },
    { label: "Avg Tx Value", value: "$228",        change: "+4.2%", up: true },
  ],
  quarter: [
    { label: "Production",   value: "$154,300",  change: "+11.2%", up: true },
    { label: "Collections",  value: "$147,300",  change: "+10.8%", up: true },
    { label: "New Patients", value: "104",        change: "+18%",   up: true },
    { label: "Avg Tx Value", value: "$215",        change: "+3.1%", up: true },
  ],
  year: [
    { label: "Production",   value: "$278,200",  change: "+14.3%", up: true },
    { label: "Collections",  value: "$264,000",  change: "+13.8%", up: true },
    { label: "New Patients", value: "398",        change: "+22%",   up: true },
    { label: "Avg Tx Value", value: "$198",        change: "+5.6%", up: true },
  ],
};

const periodSubtitles = {
  month:   "Practice performance · Jun 2026",
  quarter: "Practice performance · Q2 2026",
  year:    "Practice performance · 2026 YTD",
};

const procedures = [
  { name: "Crown & Bridge",    count: 84,  revenue: 126000, pct: 32 },
  { name: "Implants",          count: 28,  revenue: 112000, pct: 28 },
  { name: "Whitening",         count: 156, revenue: 46800,  pct: 12 },
  { name: "Cleaning / Prophy", count: 312, revenue: 46800,  pct: 12 },
  { name: "Fillings",          count: 198, revenue: 39600,  pct: 10 },
  { name: "Other",             count: 94,  revenue: 23500,  pct: 6  },
];

const reportTypes = ["Revenue", "Production", "Collections", "Procedures", "Patients", "Insurance"];

export default function ReportsPage() {
  const [period, setPeriod] = useState<"month" | "quarter" | "year">("month");
  const [exported, setExported] = useState<string | null>(null);

  const chartData = period === "month" ? monthly : period === "quarter" ? quarterly : yearly;
  const maxRev = Math.max(...chartData.map(m => m.revenue));

  function doExport(type: string) {
    const rows = ["Month,Revenue,Collections"];
    chartData.forEach(m => rows.push(`${m.month},${m.revenue},${m.collections}`));
    const blob = new Blob([`Crown Dental OS — ${type} Report (${period})\n\n` + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `crown-${type.toLowerCase()}-report-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
    setExported(type);
    setTimeout(() => setExported(null), 2500);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Reports</h1>
          <p className="mt-1 text-sm text-slate">{periodSubtitles[period]}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-line overflow-hidden">
            {(["month", "quarter", "year"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  period === p ? "bg-ink text-white" : "text-slate hover:bg-surface"
                }`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => doExport("PDF")} className="gold-btn flex items-center gap-2 rounded-lg px-4 py-2 text-sm">
            <Icons.Download className="h-4 w-4" /> Export PDF
          </button>
        </div>
      </div>

      {exported && (
        <div className="flex items-center gap-3 rounded-xl bg-teal/10 border border-teal/20 px-4 py-3">
          <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" />
          <p className="text-sm text-teal font-medium">Report exported as {exported}. Download started.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {periodKpis[period].map(s => (
          <div key={s.label} className="card bg-white p-4 shadow-card">
            <p className="text-xs text-slate">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-ink">{s.value}</p>
            <p className={`mt-1 text-xs font-medium ${s.up ? "text-teal" : "text-red-500"}`}>{s.change} vs prior</p>
          </div>
        ))}
      </div>

      <div className="card bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-ink">Revenue Trend</h3>
          <div className="flex items-center gap-3 text-xs text-slate">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold-deep inline-block" /> Production</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal inline-block" /> Collections</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {chartData.map(m => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end gap-1 h-32">
                <div
                  className="flex-1 rounded-t-lg bg-gold-deep/80 transition-all duration-500"
                  style={{ height: `${(m.revenue / maxRev) * 100}%` }}
                />
                <div
                  className="flex-1 rounded-t-lg bg-teal/60 transition-all duration-500"
                  style={{ height: `${(m.collections / maxRev) * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate">{m.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ink">Production by Procedure</h3>
          <button onClick={() => doExport("CSV")} className="flex items-center gap-1.5 text-xs text-slate hover:text-ink transition-colors">
            <Icons.Download className="h-3.5 w-3.5" /> CSV
          </button>
        </div>
        <div className="space-y-3">
          {procedures.map(p => (
            <div key={p.name} className="flex items-center gap-4">
              <span className="text-xs text-ink font-medium w-36 shrink-0 truncate">{p.name}</span>
              <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                <div className="h-full rounded-full bg-gold-deep transition-all duration-700" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-ink w-16 text-right shrink-0">${(p.revenue / 1000).toFixed(0)}k</span>
              <span className="text-xs text-slate w-8 text-right shrink-0">{p.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-white p-5 shadow-card">
        <h3 className="text-sm font-semibold text-ink mb-4">Report Library</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          {reportTypes.map(rt => (
            <button key={rt} onClick={() => doExport(rt)}
              className="flex items-center gap-3 rounded-xl border border-line p-4 hover:border-gold/40 hover:bg-surface transition-colors text-left">
              <Icons.BarChart3 className="h-4 w-4 text-gold-deep shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-medium text-ink">{rt} Report</p>
                <p className="text-xs text-slate">Export PDF / CSV</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
