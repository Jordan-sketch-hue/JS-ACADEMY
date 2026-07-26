import type { Metadata } from "next";
import { faqs } from "@/lib/site";
import { Container, Section, SectionHeading, Card, IconBadge, Badge } from "@/components/ui";
import { Icon } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { RateEstimator } from "@/components/rate-estimator";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Rates",
  description:
    "Clear per-pound shipping rates from the U.S. to Jamaica with no hidden fees. Rates start at J$1,110/lb. Message Ship 2 Door JA with your package details for an exact quote.",
};

// Published starting rate (per pound). Heavier/oversized tiers quoted on request.
const startingRate = { amount: "J$1,110", unit: "/lb", tier: "0–10 lb" };

const pricingPillars = [
  {
    icon: "dollar",
    title: "Clear per-pound rates",
    body: "You pay for the weight you ship — straightforward pricing with no guessing games.",
  },
  {
    icon: "shield",
    title: "No hidden fees",
    body: "What we quote is what you pay. Any government customs duties are shown separately and transparently.",
  },
  {
    icon: "home",
    title: "Door delivery included",
    body: "Forwarding and door-to-door delivery in Jamaica are built into your shipment.",
  },
];

const rateFactors = [
  { icon: "package", label: "Package weight", note: "The main driver — heavier means more." },
  { icon: "truck", label: "Size & dimensions", note: "Bulky, light items may be charged by volume." },
  { icon: "shield", label: "Item type & value", note: "Some goods carry customs duties or special handling." },
  { icon: "plane", label: "Speed", note: "Standard vs. expedited turnaround." },
];

const costFaqs = faqs.filter((f) =>
  /cost|much|ship|address/i.test(f.q)
);

export default function RatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Transparent pricing"
        title={<>Simple rates, <span className="text-sky-gradient">no surprises</span></>}
        blurb="Clear per-pound rates starting at J$1,110/lb for 0–10 lb, customs shown separately, and an exact quote before you ever ship."
      />

      {/* Pricing pillars */}
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {pricingPillars.map((p) => (
              <Card key={p.title}>
                <IconBadge>
                  <Icon name={p.icon} className="h-7 w-7" />
                </IconBadge>
                <h3 className="mt-5 text-xl font-bold text-navy">{p.title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-600">{p.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Starting rate + interactive estimator */}
      <Section className="bg-mist/40 pt-0">
        <Container>
          <div className="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.4fr]">
            <Reveal>
              <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-3xl bg-navy-gradient p-8 text-center text-white">
                <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-sky/20 blur-2xl" />
                <p className="relative text-sm font-bold uppercase tracking-[0.22em] text-sky-light">
                  Starting rate
                </p>
                <p className="relative mt-3 text-6xl font-black leading-none text-sky-gradient">
                  {startingRate.amount}
                  <span className="text-2xl text-white">{startingRate.unit}</span>
                </p>
                <p className="relative mt-3 font-semibold">
                  Packages {startingRate.tier} · USA → Jamaica
                </p>
                <p className="relative mt-2 text-sm text-mist/70">
                  Heavier or oversized? Build your shipment for an exact quote →
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <RateEstimator />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* What affects your rate */}
      <Section className="pt-0">
        <Container>
          <SectionHeading
            eyebrow="Good to know"
            title="What affects your rate"
            blurb="A few simple factors decide your shipping cost."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {rateFactors.map((f) => (
              <Card key={f.label}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/10 text-blue">
                  <Icon name={f.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-navy">{f.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.note}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Cost FAQ */}
      <Section dark className="relative overflow-hidden">
        <Container className="relative">
          <div className="mx-auto max-w-3xl">
            <div className="text-center">
              <Badge tone="outline">FAQ</Badge>
              <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                Questions about cost
              </h2>
            </div>
            <div className="mt-10 space-y-4">
              {costFaqs.map((f) => (
                <div key={f.q} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                  <h3 className="font-bold text-white">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist/75">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
