import Link from "next/link";
import * as Icons from "lucide-react";
import { features, featureCategories } from "@/lib/features";
import { Reveal } from "@/components/Reveal";
import { Logo } from "@/components/Logo";

const tierCell = {
  yes:      <Icons.Check className="mx-auto h-4 w-4 text-teal" />,
  no:       <Icons.X className="mx-auto h-4 w-4 text-line" />,
  partial:  <Icons.Minus className="mx-auto h-4 w-4 text-gold/70" />,
  exclusive:(
    <div className="flex justify-center">
      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold-deep">ONLY</span>
    </div>
  ),
};

export default function ComparePage() {
  const countFull = (key: string) =>
    features.filter((f) => (f as any)[key] === "yes" || (f as any)[key] === "exclusive").length;

  const exclusives = features.filter((f) => f.meridian === "exclusive").length;

  const scores = [
    { key: "meridian",  label: "Crown",        score: countFull("meridian"),  note: `${exclusives} AI-exclusive features`, highlight: true },
    { key: "dentrix",   label: "Dentrix",       score: countFull("dentrix"),   note: "Server-based · Windows only",         highlight: false },
    { key: "curve",     label: "Curve Dental",  score: countFull("curve"),     note: "Cloud · limited AI",                  highlight: false },
    { key: "nexhealth", label: "NexHealth",     score: countFull("nexhealth"), note: "Patient comms focus",                 highlight: false },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
        <div className="shell flex items-center justify-between py-4">
          <Link href="/"><Logo /></Link>
          <div className="flex gap-3">
            <Link href="/" className="rounded-full border border-line px-4 py-2 text-sm text-slate hover:text-ink hover:border-gold/40 transition-colors">
              ← Back
            </Link>
            <Link href="/platform" className="gold-btn rounded-full px-5 py-2 text-sm shadow-gold">
              Launch console
            </Link>
          </div>
        </div>
      </header>

      <div className="shell py-16">
        <Reveal>
          <div className="text-center mb-12">
            <span className="eyebrow">Feature Comparison</span>
            <h1 className="section-heading mt-3">Crown vs. the market</h1>
            <p className="mt-4 mx-auto max-w-2xl text-slate">
              We benchmarked against Dentrix, Eaglesoft, Curve Dental, NexHealth, Weave, Open Dental,
              and Lighthouse 360 to cover every capability — then built 15 AI-exclusive features none of them offer.
            </p>
          </div>
        </Reveal>

        {/* Score cards */}
        <Reveal delay={0.08}>
          <div className="grid gap-4 sm:grid-cols-4 mb-12">
            {scores.map((s) => (
              <div
                key={s.key}
                className={`rounded-2xl p-6 ${
                  s.highlight
                    ? "bg-ink text-white shadow-card-hover"
                    : "card bg-white shadow-card"
                }`}
              >
                <p className={`text-sm font-medium ${s.highlight ? "text-white/60" : "text-slate"}`}>{s.label}</p>
                <p className={`mt-1 font-display text-5xl font-bold ${s.highlight ? "text-white" : "text-ink"}`}>
                  {s.score}
                  <span className={`text-2xl ${s.highlight ? "text-white/40" : "text-mist"}`}>/{features.length}</span>
                </p>
                <p className={`mt-1 text-xs ${s.highlight ? "text-gold" : "text-slate"}`}>{s.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Table */}
        <Reveal delay={0.12}>
          <div className="card overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-surface">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-mist w-[40%]">
                      Feature
                    </th>
                    {scores.map((s) => (
                      <th
                        key={s.key}
                        className={`px-4 py-4 text-center text-sm font-semibold w-[15%] ${
                          s.highlight ? "text-ink" : "text-mist"
                        }`}
                      >
                        {s.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureCategories.map((cat) => {
                    const catFeatures = features.filter((f) => f.category === cat);
                    return (
                      <>
                        <tr key={cat}>
                          <td colSpan={5} className="border-t border-line bg-surface/70 px-5 py-2.5">
                            <span className="eyebrow">{cat}</span>
                          </td>
                        </tr>
                        {catFeatures.map((f) => (
                          <tr key={f.name} className="border-t border-line/60 hover:bg-surface/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-ink">{f.name}</span>
                                {f.note && (
                                  <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase text-gold-deep">
                                    {f.note}
                                  </span>
                                )}
                              </div>
                            </td>
                            {scores.map((s) => (
                              <td key={s.key} className="px-4 py-3 text-center">
                                {tierCell[(f as any)[s.key] as keyof typeof tierCell]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-slate mb-4">Ready to run a practice that operates itself?</p>
          <Link
            href="/platform"
            className="gold-btn inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm shadow-gold transition hover:shadow-lg"
          >
            Enter the live console <Icons.ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
