import type { Metadata } from "next";
import Image from "next/image";
import { site, rewards } from "@/lib/site";
import { Container, Section, SectionHeading, Button, Card, IconBadge, Badge } from "@/components/ui";
import { Icon } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { Reveal, Stagger, StaggerItem, TiltCard } from "@/components/motion";
import { Stamp } from "@/components/creative";

export const metadata: Metadata = {
  title: "Rewards",
  description:
    "Ship2Door Rewards: every shipment earns a stamp. Ship 7 times a year for a free birthday shipment (≤20lb) and 10 times for a free Christmas shipment (≤17lb).",
};

const howRewards = [
  { icon: "package", title: "Ship as usual", body: "Forward any package through Ship2Door — no special sign-up needed." },
  { icon: "star", title: "Earn a stamp", body: "Every shipment earns one stamp on your Ship2Door Rewards card." },
  { icon: "gift", title: "Redeem free shipments", body: "Hit a milestone and your birthday or Christmas shipment is on us." },
];

export default function RewardsPage() {
  return (
    <>
      <PageHero
        eyebrow="Ship2Door Rewards"
        title={<>Ship more.<br /><span className="text-sky-gradient">Get free shipments.</span></>}
        blurb="Our way of saying thanks. Every package you forward brings you closer to a shipment on the house."
      />

      {/* Tier cards */}
      <Section>
        <Container>
          <Stagger className="grid gap-6 md:grid-cols-2">
            {rewards.map((r) => (
              <StaggerItem key={r.reward} className="h-full">
                <TiltCard className="relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200/80">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-gradient opacity-10" />
                  <div className="relative flex items-start gap-5">
                    <IconBadge tone="gold">
                      <Icon name={r.icon} className="h-8 w-8" strokeWidth={2.2} />
                    </IconBadge>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider text-gold-deep">
                        {r.when}
                      </p>
                      <h3 className="mt-1 text-2xl font-extrabold text-navy">{r.reward}</h3>
                      <p className="mt-2 flex items-center gap-2 font-semibold text-slate-500">
                        <Icon name="package" className="h-5 w-5 text-blue" /> Shipment {r.limit}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* How rewards work */}
      <Section className="bg-mist/40 pt-0">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Three stamps to a free shipment"
              blurb="No points to track, no fine print games — just ship and get rewarded."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {howRewards.map((step, i) => (
              <Card key={step.title} className="relative">
                <span className="absolute -top-4 left-7 flex h-9 w-9 items-center justify-center rounded-full bg-sky-gradient text-sm font-black text-white shadow-md">
                  {i + 1}
                </span>
                <IconBadge>
                  <Icon name={step.icon} className="h-7 w-7" />
                </IconBadge>
                <h3 className="mt-5 text-xl font-bold text-navy">{step.title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-600">{step.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* The card */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge tone="gold">Your rewards card</Badge>
              <h2 className="mt-5 text-4xl font-extrabold text-navy">
                Stamp your way to free shipping
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
                Ask for your Ship2Door Rewards card on your next shipment. We stamp one
                slot every time you ship — hit slot 7 and 10 to unlock your free
                birthday and Christmas shipments.
              </p>
              <ul className="mt-6 space-y-3">
                {rewards.map((r) => (
                  <li key={r.reward} className="flex items-center gap-3 text-slate-700">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold-deep">
                      <Icon name="check" className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span><strong className="text-navy">{r.when}</strong> → {r.reward} ({r.limit})</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href={site.contact.whatsappHref} variant="primary" external withArrow>
                  Ask for your card
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <TiltCard>
                <Stamp rotate="3deg" className="max-w-md">
                  <Image
                    src="/rewards-card.png"
                    alt="Ship2Door Rewards punch card — 7 shipments for a free birthday shipment, 10 for a free Christmas shipment"
                    width={1050}
                    height={600}
                    className="rounded-md"
                  />
                </Stamp>
              </TiltCard>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section dark className="relative overflow-hidden">
        <Container className="relative text-center">
          <h2 className="mx-auto max-w-2xl text-4xl font-black sm:text-5xl">
            Start earning on your next shipment
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-mist/80">
            Get your free U.S. address, ship your first package, and we'll start your
            rewards card right away.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={site.portal.signupHref} variant="primary" external withArrow>
              Get your free U.S. address
            </Button>
            <Button href="/how-it-works" variant="outline">
              See how it works
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
