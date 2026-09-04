import type { Metadata } from "next";
import { site, steps, services } from "@/lib/site";
import { Container, Section, SectionHeading, Button, Card, IconBadge } from "@/components/ui";
import { Icon } from "@/components/brand";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Ship 2 Door JA works: get a free U.S. address, shop any American store, and we forward your package to your door in Jamaica — customs handled, tracked door-to-door.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Simple as 1 · 2 · 3"
        title={<>From U.S. checkout to your <span className="text-sky-gradient">Jamaican door</span></>}
        blurb="No more 'doesn't ship to Jamaica.' Get a U.S. address, shop like a local, and let us handle the rest."
      />

      {/* Steps timeline */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl space-y-6">
            {steps.map((step, i) => (
              <div key={step.title} className="flex gap-5 sm:gap-7">
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-gradient text-lg font-black text-[#5A3B00] shadow-md">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="mt-2 w-px flex-1 bg-gradient-to-b from-sky/50 to-transparent" />
                  )}
                </div>
                <Card className="flex-1 mb-2">
                  <div className="flex items-start gap-4">
                    <IconBadge>
                      <Icon name={step.icon} className="h-7 w-7" />
                    </IconBadge>
                    <div>
                      <h3 className="text-xl font-bold text-navy">{step.title}</h3>
                      <p className="mt-2 leading-relaxed text-slate-600">{step.body}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button href={site.portal.signupHref} variant="primary" external withArrow>
              Start with your free U.S. address
            </Button>
          </div>
        </Container>
      </Section>

      {/* What we handle */}
      <Section dark className="relative overflow-hidden">
        <Container className="relative">
          <SectionHeading
            dark
            eyebrow="We handle the hard parts"
            title="You shop. We do the logistics."
            blurb="Once your package hits our U.S. warehouse, every step below is on us."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Card key={s.title} dark>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky/15 text-sky-light">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-white">{s.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-mist/70">{s.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Tracking note */}
      <Section className="bg-mist/40">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl bg-white p-10 text-center ring-1 ring-slate-200/80 shadow-sm sm:p-14">
            <IconBadge>
              <Icon name="search" className="h-7 w-7" />
            </IconBadge>
            <h2 className="text-3xl font-extrabold text-navy">Track every step</h2>
            <p className="max-w-xl text-slate-600">
              Log in to your account to see your packages move from the U.S. warehouse
              to your door, and get a notification at every milestone.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href={site.portal.loginHref} variant="primary" external>
                Log in to track
              </Button>
              <Button href={site.contact.whatsappHref} variant="white" external className="ring-1 ring-slate-200">
                Ask us on WhatsApp
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
