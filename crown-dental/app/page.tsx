"use client";
import Link from "next/link";
import * as Icons from "lucide-react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { DemoPlayer } from "@/components/DemoPlayer";
import { CountUp } from "@/components/CountUp";
import { MagneticButton } from "@/components/MagneticButton";
import { SmoothScroll } from "@/components/SmoothScroll";
import { modules, globalStats } from "@/lib/data";
import { useState, useEffect } from "react";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? "bg-[#0A0F1A]/97 backdrop-blur-md border-b border-white/8 shadow-lg" : "bg-transparent"}`}>
      <div className="shell flex items-center justify-between py-4">
        <LogoLight />
        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {[["Platform","/platform"],["Modules","#modules"],["Compare","#compare"],["Pricing","#pricing"]].map(([n,h]) => (
            <a key={n} href={h} className="text-white/60 hover:text-white transition-colors">{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/platform" className="hidden md:block rounded-full px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
            Sign in
          </Link>
          <MagneticButton
            as="a"
            href="/platform"
            className="gold-btn group hidden md:flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm shadow-gold transition-all hover:shadow-lg cursor-pointer"
          >
            Launch console <Icons.ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </MagneticButton>
          {/* Mobile CTA */}
          <a href="/platform" className="md:hidden gold-btn rounded-full px-4 py-2 text-sm">
            Get started
          </a>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/70 hover:text-white transition-colors">
            {menuOpen ? <Icons.X className="h-4 w-4" /> : <Icons.Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#0A0F1A]/97 px-6 py-5 space-y-4">
          {[["Platform","/platform"],["Modules","#modules"],["Compare","#compare"],["Pricing","#pricing"],["Sign in","/platform"]].map(([n,h]) => (
            <a key={n} href={h} onClick={() => setMenuOpen(false)} className="block text-base text-white/70 hover:text-white transition-colors py-1">{n}</a>
          ))}
        </div>
      )}
    </header>
  );
}

function LogoLight() {
  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="h-9 w-9 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nl1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#B8953F"/>
            <stop offset="55%" stopColor="#C9A96E"/>
            <stop offset="100%" stopColor="#E2C98A"/>
          </linearGradient>
          <linearGradient id="nl2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#F0F4F8"/>
          </linearGradient>
        </defs>
        <path d="M 15 34 Q 10 28 11 20 Q 13 10 20 10 Q 24 10 26 14 Q 28 9 32 9 Q 36 9 38 14 Q 40 10 44 10 Q 51 10 53 20 Q 54 28 49 34 Q 42 37 32 37 Q 22 37 15 34 Z" fill="url(#nl2)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M 20 37 Q 19 43 17 52 Q 16 58 20 59 Q 24 60 25 55 L 29 42 Z" fill="url(#nl2)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <path d="M 44 37 Q 45 43 47 52 Q 48 58 44 59 Q 40 60 39 55 L 35 42 Z" fill="url(#nl2)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
        <rect x="12" y="16" width="40" height="8" rx="2" fill="url(#nl1)"/>
        <path d="M 12 16 L 16 7 L 21 14 L 27 5 L 32 13 L 37 5 L 43 14 L 48 7 L 52 16 Z" fill="url(#nl1)"/>
        <circle cx="27" cy="6" r="2.2" fill="white" opacity="0.9"/>
        <circle cx="37" cy="6" r="2.2" fill="white" opacity="0.9"/>
        <rect x="12" y="16" width="40" height="2.5" rx="1" fill="white" opacity="0.25"/>
      </svg>
      <span className="font-display text-xl font-semibold tracking-tight text-white">Crown</span>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#060A14]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://t4.ftcdn.net/jpg/02/10/65/47/240_F_210654708_kpOk6kE3MioRLRvhToYHtT84pmuS8XBj.jpg"
          alt=""
          className="h-full w-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060A14]/60 via-[#060A14]/50 to-[#060A14]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060A14]/80 via-transparent to-[#060A14]/80" />
      </div>

      {/* Gold ambient glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full opacity-10"
        style={{ background: "radial-gradient(ellipse, #C9A96E 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold backdrop-blur-sm">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
            <span>Trusted by 1,240+ practices · 14 countries</span>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="font-display text-[42px] font-semibold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[80px] xl:text-[88px]">
            Where <em className="not-italic" style={{ color: "#C9A96E" }}>modern</em><br />
            practices go to <em className="not-italic" style={{ color: "#C9A96E" }}>thrive</em>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-xl sm:mt-7">
            Crown handles scheduling, clinical charting, revenue cycle, and patient experience — so your team can focus entirely on care.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <MagneticButton as="a" href="/platform"
              className="gold-btn group flex items-center gap-2 rounded-full px-8 py-4 text-base shadow-gold transition-all hover:shadow-lg cursor-pointer"
            >
              Enter live console
              <Icons.ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </MagneticButton>
            <a href="#demo" className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base text-white/80 backdrop-blur-sm transition hover:bg-white/10 hover:text-white hover:border-white/30">
              <Icons.PlayCircle className="h-5 w-5 text-gold" /> Watch demo
            </a>
          </div>
        </Reveal>

        {/* Social proof row */}
        <Reveal delay={0.32}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[
                  { initials: "RC", from: "#1A2640", to: "#2E3F5C" },
                  { initials: "AB", from: "#0D9488", to: "#0a7a70" },
                  { initials: "MR", from: "#C9A96E", to: "#B8953F" },
                  { initials: "PN", from: "#8B5CF6", to: "#6d4ac7" },
                ].map((a, i) => (
                  <div key={a.initials}
                    className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#060A14] text-[10px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})`, marginLeft: i === 0 ? 0 : -8 }}
                  >{a.initials}</div>
                ))}
              </div>
              <p className="text-sm text-white/50"><span className="font-semibold text-white/80">1,240+</span> practices</p>
            </div>
            <div className="h-4 w-px bg-white/15 hidden sm:block" />
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Icons.Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />)}
              <span className="ml-1 text-sm text-white/50">4.9 rating</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Floating cards */}
      <Reveal delay={0.4}>
        <div className="absolute bottom-14 left-10 hidden xl:block">
          <div className="rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-md shadow-float" style={{ width: 200 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/20">
                <Icons.Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[9px] font-semibold text-white/50">Crown AI recovered</p>
                <p className="text-sm font-bold text-white">$980 overnight</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
              <span className="text-[9px] font-semibold text-teal">Live · 7 of 8 chairs active</span>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.44}>
        <div className="absolute bottom-14 right-10 hidden xl:block">
          <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md shadow-float" style={{ width: 190 }}>
            <img
              src="https://t4.ftcdn.net/jpg/05/23/54/89/240_F_523548910_PUUVbXKJ43T1aFwl76ZyoYcD9a7cwGiR.jpg"
              alt="Patient"
              className="h-24 w-full object-cover"
            />
            <div className="p-3">
              <p className="text-xs font-semibold text-white">Your Patient</p>
              <p className="text-[10px] text-white/50">Crown Care+ · Low risk</p>
              <div className="mt-1.5 flex items-center gap-1">
                {[...Array(5)].map((_, i) => <Icons.Star key={i} className="h-2.5 w-2.5 fill-gold text-gold" />)}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="h-10 w-5 rounded-full border border-white/40 flex items-start justify-center pt-1.5">
          <div className="h-2 w-0.5 rounded-full bg-white animate-bounce" />
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { label: "Practices worldwide", end: 1240, suffix: "+" },
    { label: "Countries active",    end: 14,   suffix: "" },
    { label: "Claims filed",        end: 98400, suffix: "+" },
    { label: "Patient visits / year", end: 2100000, suffix: "+" },
  ];
  return (
    <section className="border-y border-line bg-surface py-10">
      <div className="shell">
        <div className="grid grid-cols-2 gap-8 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-semibold text-ink">
                <CountUp end={s.end} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-slate">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section id="demo" className="section bg-[#faf8f5]">
      <div className="shell">
        <Reveal>
          <div className="mb-12 text-center">
            <span className="eyebrow">Product walkthrough</span>
            <h2 className="section-heading mt-3">
              See Crown in action — start to finish.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate">
              From morning huddle to last claim submitted. Tab through each module or let it run automatically.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <DemoPlayer />
        </Reveal>
      </div>
    </section>
  );
}

const moduleImages: Record<string, string> = {
  scheduling: "https://t4.ftcdn.net/jpg/04/71/35/73/240_F_471357376_meBx9h0EFBHZfTPg0uy2Sst47ISd02g9.jpg",
  clinical:   "https://t3.ftcdn.net/jpg/04/26/35/46/240_F_426354607_KbDyzvIeMq9PlRsWhF2HlORPDI7aZJLk.jpg",
  rcm:        "https://t3.ftcdn.net/jpg/02/94/31/26/240_F_294312657_eswKKrtmL24d8W4OjQ5fbf8RGzGKXls1.jpg",
  experience: "https://t3.ftcdn.net/jpg/03/82/88/02/240_F_382880269_cTX1LbwBoiLqO7AiuUaX9VinQ0v1pbhI.jpg",
  analytics:  "https://t4.ftcdn.net/jpg/05/73/35/59/240_F_573355904_qvx1iTSgCLGJimijj5JqV5HV6sZRfxvf.jpg",
  compliance: "https://t4.ftcdn.net/jpg/04/40/60/97/240_F_440609733_K7qXaqSw0QcSTjopMiXxAhaZ00x6jEqi.jpg",
};

function Modules() {
  return (
    <section id="modules" className="section bg-white">
      <div className="shell">
        <Reveal>
          <span className="eyebrow">One platform</span>
          <h2 className="section-heading mt-3 max-w-2xl">
            Six intelligent modules, engineered to feel like one.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((m, i) => {
            const I = (Icons as any)[m.icon] ?? Icons.Square;
            const img = moduleImages[m.key];
            return (
              <Reveal key={m.key} delay={i * 0.06}>
                <a
                  href={m.href}
                  className="group card-glass flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 transition-all duration-300 hover:shadow-float hover:border-gold/30 hover:-translate-y-1 block"
                >
                  {img && (
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={img}
                        alt={m.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 shadow-card backdrop-blur-sm">
                        <I className="h-4 w-4 text-gold-deep" strokeWidth={1.5} />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold text-ink">{m.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{m.desc}</p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-gold-deep opacity-0 transition group-hover:opacity-100">
                      Explore <Icons.ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </div>
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Global() {
  return (
    <section id="global" className="section bg-surface">
      <div className="shell">
        <div className="card grid items-center gap-10 rounded-3xl p-8 shadow-card lg:grid-cols-2 lg:p-14">
          <Reveal>
            <div>
              <span className="eyebrow">Local roots, global scale</span>
              <h2 className="section-heading mt-3">
                One chair in Kingston or a network across five continents.
              </h2>
              <p className="mt-5 text-slate">
                Multi-clinic roll-ups, per-region data residency, native currencies, and
                localised recall journeys. Crown scales from your first patient to your
                thousandth location without changing tools.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {globalStats.map((s) => (
                  <div key={s.k} className="card-sm rounded-xl p-4">
                    <p className="text-xl font-semibold text-ink">{s.v}</p>
                    <p className="mt-0.5 text-xs text-slate">{s.k}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="relative flex aspect-square items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-line" />
              <div className="absolute inset-8 rounded-full border border-line" />
              <div className="absolute inset-16 rounded-full border border-line" />
              {["Kingston", "Miami", "London", "Dubai", "Montego Bay"].map((c, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const r = 40;
                const x = 50 + Math.cos(angle) * r;
                const y = 50 + Math.sin(angle) * r;
                return (
                  <div key={c} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                    <div className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-white px-2.5 py-1 text-xs font-medium text-ink shadow-card">
                      <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {c}
                    </div>
                  </div>
                );
              })}
              <Logo />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const rows = [
    { feature: "Pricing model",           crown: "Per chair / mo",  dentrix: "Flat monthly",      curve: "Per provider / mo",  nexhealth: "Per location / mo", eaglesoft: "Flat monthly"    },
    { feature: "Starting price",          crown: "$79–$99 / chair", dentrix: "$400–$600 / mo",    curve: "$499 / provider",    nexhealth: "$350–$500 / mo",    eaglesoft: "$200–$400 / mo"  },
    { feature: "AI scheduling agent",     crown: true,  dentrix: false, curve: false, nexhealth: true,  eaglesoft: false },
    { feature: "No-show predictor",       crown: true,  dentrix: false, curve: false, nexhealth: false, eaglesoft: false },
    { feature: "Voice clinical charting", crown: true,  dentrix: false, curve: false, nexhealth: false, eaglesoft: false },
    { feature: "Patient Crown Score™",    crown: true,  dentrix: false, curve: false, nexhealth: false, eaglesoft: false },
    { feature: "Revenue cycle automation",crown: true,  dentrix: true,  curve: true,  nexhealth: false, eaglesoft: true  },
    { feature: "Two-way SMS / chat",      crown: true,  dentrix: false, curve: false, nexhealth: true,  eaglesoft: false },
    { feature: "Patient portal app",      crown: true,  dentrix: true,  curve: true,  nexhealth: true,  eaglesoft: false },
    { feature: "Multi-clinic DSO",        crown: true,  dentrix: true,  curve: true,  nexhealth: false, eaglesoft: false },
    { feature: "Morning Huddle AI",       crown: true,  dentrix: false, curve: false, nexhealth: false, eaglesoft: false },
    { feature: "HIPAA / SOC 2 / GDPR",   crown: true,  dentrix: true,  curve: true,  nexhealth: true,  eaglesoft: true  },
    { feature: "Cloud-native",            crown: true,  dentrix: false, curve: true,  nexhealth: true,  eaglesoft: false },
    { feature: "Setup time",              crown: "Days",            dentrix: "Weeks",             curve: "1–2 weeks",          nexhealth: "1 week",            eaglesoft: "Weeks"           },
  ];
  const cols = [
    { key: "crown",     label: "Crown",     highlight: true  },
    { key: "dentrix",   label: "Dentrix",   highlight: false },
    { key: "curve",     label: "Curve",     highlight: false },
    { key: "nexhealth", label: "NexHealth", highlight: false },
    { key: "eaglesoft", label: "Eaglesoft", highlight: false },
  ];
  return (
    <section id="compare" className="section bg-surface">
      <div className="shell">
        <Reveal>
          <div className="mb-2 text-center">
            <span className="eyebrow">How we compare</span>
            <h2 className="section-heading mt-3">Crown vs. the competition</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate">
              Based on publicly available information. All competitor data sourced from their websites and independent review platforms.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-line bg-surface">
                  <th className="px-5 py-4 text-left text-xs font-semibold text-mist w-52">Feature</th>
                  {cols.map((c) => (
                    <th key={c.key} className={`px-4 py-4 text-center text-xs font-bold ${c.highlight ? "text-gold-deep bg-gold/5" : "text-ink"}`}>
                      {c.highlight && <div className="mb-1 inline-block rounded-full bg-gold px-2 py-0.5 text-[9px] font-bold text-white">YOU</div>}
                      <div>{c.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r, i) => (
                  <tr key={r.feature} className={`transition-colors hover:bg-surface/60 ${i % 2 === 0 ? "" : "bg-surface/30"}`}>
                    <td className="px-5 py-3.5 text-xs font-medium text-ink">{r.feature}</td>
                    {cols.map((c) => {
                      const val = (r as any)[c.key];
                      return (
                        <td key={c.key} className={`px-4 py-3.5 text-center ${c.highlight ? "bg-gold/4" : ""}`}>
                          {typeof val === "boolean" ? (
                            val ? (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal/15">
                                <Icons.Check className="h-3 w-3 text-teal" strokeWidth={1.5} />
                              </span>
                            ) : (
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-line">
                                <Icons.Minus className="h-3 w-3 text-mist" strokeWidth={1.5} />
                              </span>
                            )
                          ) : (
                            <span className={`text-xs ${c.highlight ? "font-semibold text-gold-deep" : "text-slate"}`}>{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-center text-[11px] text-mist">
            * Competitor data based on publicly available pricing pages and G2/Capterra reviews as of 2026. Features may vary by plan.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    { name: "Practice",     price: "$99", unit: "/chair · mo", best: false, features: ["Autonomous scheduling", "Clinical charting & imaging", "Patient app + digital forms", "Standard analytics", "Email + chat support"] },
    { name: "Group",        price: "$79", unit: "/chair · mo", best: true,  features: ["Everything in Practice", "Revenue cycle automation", "Multi-clinic roll-ups", "Provider scorecards", "Priority success manager"] },
    { name: "Enterprise DSO", price: "Custom", unit: "global", best: false, features: ["Everything in Group", "Data residency & SOC 2", "SSO, RBAC, audit trails", "Custom integrations & API", "24/7 dedicated support"] },
  ];
  return (
    <section id="pricing" className="section bg-white">
      <div className="shell">
        <Reveal>
          <div className="text-center">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-heading mt-3">Priced per chair. Scales with you.</h2>
          </div>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <div className={`relative h-full rounded-2xl p-7 ${t.best ? "bg-ink text-white shadow-float" : "card shadow-card"}`}>
                {t.best && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-gold-deep to-gold px-3 py-1 text-xs font-semibold text-white shadow-gold">
                    Most popular
                  </span>
                )}
                <h3 className={`text-base font-semibold ${t.best ? "text-white" : "text-ink"}`}>{t.name}</h3>
                <div className="mt-4 flex items-end gap-1">
                  <span className={`font-display text-4xl font-bold ${t.best ? "text-white" : "text-ink"}`}>{t.price}</span>
                  <span className={`pb-1 text-sm ${t.best ? "text-white/50" : "text-slate"}`}>{t.unit}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${t.best ? "text-white/75" : "text-slate"}`}>
                      <Icons.Check className={`mt-0.5 h-4 w-4 shrink-0 ${t.best ? "text-gold" : "text-teal"}`} strokeWidth={1.5} /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/platform"
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition ${
                    t.best ? "gold-btn shadow-gold hover:shadow-lg" : "border border-line text-ink hover:bg-surface"
                  }`}
                >
                  {t.price === "Custom" ? "Talk to sales" : "Start free trial"}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="section bg-surface">
      <div className="shell">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink px-10 py-16 text-center sm:px-16">
            <div className="mesh-hero">
              <div className="mesh-orb" style={{ width: 400, height: 400, top: -100, left: "20%", background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, transparent 70%)", animationDuration: "20s" }} />
              <div className="mesh-orb" style={{ width: 300, height: 300, top: 0, right: "10%", background: "radial-gradient(circle, rgba(13,148,136,0.10) 0%, transparent 70%)", animationDuration: "25s" }} />
            </div>
            <span className="relative eyebrow text-gold">Get started</span>
            <h2 className="relative mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
              Give every patient a flawless visit.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-white/60">
              Join the practices that switched to Crown and never looked back. Onboarding in days, not months.
            </p>
            <div className="relative mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <MagneticButton as="a" href="/platform" className="gold-btn flex items-center gap-2 rounded-full px-7 py-3.5 text-sm shadow-gold transition hover:shadow-lg cursor-pointer">
                Launch the console <Icons.ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </MagneticButton>
              <a href="#pricing" className="rounded-full border border-white/20 px-7 py-3.5 text-sm text-white transition hover:bg-white/10">
                View pricing
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-line bg-white py-10">
      <div className="shell flex flex-col items-center justify-between gap-5 sm:flex-row">
        <Logo />
        <p className="text-sm text-mist">© 2026 Crown Dental Systems. HIPAA · GDPR · SOC 2.</p>
        <div className="flex gap-4 text-mist">
          <Icons.Twitter className="h-5 w-5 hover:text-ink transition-colors cursor-pointer" strokeWidth={1.5} />
          <Icons.Linkedin className="h-5 w-5 hover:text-ink transition-colors cursor-pointer" strokeWidth={1.5} />
          <Icons.Github className="h-5 w-5 hover:text-ink transition-colors cursor-pointer" strokeWidth={1.5} />
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="grain">
      <SmoothScroll />
      <Nav />
      <Hero />
      <SocialProof />
      <Demo />
      <Compare />
      <Modules />
      <Global />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
