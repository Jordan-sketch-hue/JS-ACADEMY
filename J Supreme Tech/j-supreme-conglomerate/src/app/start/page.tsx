import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "J Supreme — Build, Market, Register · From J$5,000",
  description:
    "One studio for the three things every Jamaican business needs: a real website or app, social that brings clients, and proper business registration. From J$5,000 JMD.",
  openGraph: {
    title: "J Supreme — Build, Market, Register · From J$5,000 JMD",
    description:
      "Tech, marketing, and business setup — done right. Talk to us on WhatsApp.",
    url: "https://jsupremetech.online/start",
  },
};

const WHATSAPP_NUMBER = "6582182282"; // J Supreme IG/WhatsApp bot line
const PHONE_DISPLAY = "(658) 218-2282";

type ServiceKey = "build" | "market" | "register";

const SERVICES: Record<
  ServiceKey,
  {
    label: string;
    headline: string;
    sub: string;
    bullets: string[];
    waText: string;
  }
> = {
  build: {
    label: "Build",
    headline: "Your business needs a real website or app.",
    sub: "We design it, ship it, and keep it running. From J$5,000 JMD.",
    bullets: [
      "Custom site or mobile app",
      "Built on modern stack (Next.js, Supabase, Vercel)",
      "Live in days, not months",
    ],
    waText: "Hi J Supreme — I'm interested in building a website / app.",
  },
  market: {
    label: "Market",
    headline: "Posts not bringing in clients? We run your social.",
    sub: "Premium IG + FB content, ads, and outreach. From J$5,000 JMD.",
    bullets: [
      "Daily branded posts + reels",
      "Targeted ads with real reporting",
      "DMs answered in your voice",
    ],
    waText: "Hi J Supreme — I'd like to talk about social media management.",
  },
  register: {
    label: "Register",
    headline: "Registering a Jamaican business? We file everything.",
    sub: "BRN, TRN, NIS, NHT — handled. From J$5,000 JMD.",
    bullets: [
      "COJ business name + Tax Registration",
      "All paperwork prepared & filed for you",
      "Diaspora-friendly (we handle it from here)",
    ],
    waText: "Hi J Supreme — I want help registering a business in Jamaica.",
  },
};

const ORDER: ServiceKey[] = ["build", "market", "register"];

function waLink(text: string, source: string) {
  const enc = encodeURIComponent(`${text}\n\n(via /start · ${source})`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${enc}`;
}

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string }>;
}) {
  const sp = await searchParams;
  const focus = (["build", "market", "register"] as const).find(
    (k) => k === sp.s,
  );
  const cards = focus
    ? [focus, ...ORDER.filter((k) => k !== focus)]
    : ORDER;

  return (
    <div className="relative isolate min-h-svh overflow-x-hidden bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 bg-grid opacity-30"
        aria-hidden="true"
      />

      <main className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-12 pb-24 sm:pt-20">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Image
            src="/logo.svg"
            alt="J Supreme"
            width={56}
            height={56}
            className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/10 sm:h-14 sm:w-14"
            priority
          />
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-md">
            J Supreme · Jamaica
          </div>

          <h1 className="mt-7 max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Tech, marketing, and business setup —{" "}
            <span className="text-muted-foreground">done right.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            One studio for the three things every Jamaican business needs.
            Pick what you need. Talk to a real person.{" "}
            <span className="text-foreground">Packages from J$5,000 JMD.</span>
          </p>

          {/* Primary CTA row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={waLink("Hi J Supreme — I'd like to talk.", "hero")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp us
            </a>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card/40 px-6 text-sm font-medium transition-colors hover:bg-accent/10"
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
          </div>
        </div>

        {/* Service cards */}
        <section className="mt-16 grid grid-cols-1 gap-4 sm:mt-20 sm:grid-cols-3">
          {cards.map((key, i) => {
            const s = SERVICES[key];
            const isFocus = focus === key;
            return (
              <a
                key={key}
                href={waLink(s.waText, `card:${key}`)}
                className={`group relative flex flex-col rounded-2xl border bg-card/40 p-6 transition-colors hover:bg-card/70 ${
                  isFocus
                    ? "border-foreground/40"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    0{i + 1} · {s.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <h2 className="mt-4 text-balance text-xl font-semibold tracking-tight">
                  {s.headline}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.sub}</p>
                <ul className="mt-5 space-y-2 text-sm">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/70" />
                      <span className="text-muted-foreground">{b}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                  Chat on WhatsApp
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </a>
            );
          })}
        </section>

        {/* Proof / trust */}
        <section className="mt-16 flex flex-col items-center text-center">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            Trusted by Jamaican founders & SMBs
          </p>
          <p className="mt-3 max-w-2xl text-pretty text-sm text-muted-foreground">
            Sites, apps, and brands shipped across logistics, legal, education,
            real estate, hospitality, and retail. Same team. One bar.
          </p>
        </section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-center gap-1 text-center text-xs text-muted-foreground">
          <div>
            J Supreme · Kingston, Jamaica · {PHONE_DISPLAY}
          </div>
          <div>
            <a className="underline-offset-2 hover:underline" href="/privacy">
              Privacy
            </a>
            <span aria-hidden> · </span>
            <Link className="underline-offset-2 hover:underline" href="/">
              Workspace
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
