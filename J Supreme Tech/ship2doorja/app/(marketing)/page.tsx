import { site, steps, whyUs, services, rewards } from "@/lib/site";
import { Container, Section, SectionHeading, Button, Badge, IconBadge } from "@/components/ui";
import { Icon, Orbs } from "@/components/brand";
import { AirRoute, Postmark, Marquee, AirmailEdge, Stamp } from "@/components/creative";
import { Reveal, Stagger, StaggerItem, TiltCard, Magnetic, Counter } from "@/components/motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const stores = ["Amazon", "SHEIN", "eBay", "Walmart", "Temu", "Nike", "Apple", "Target", "ASOS", "Best Buy"];

export default function HomePage() {
  return (
    <>
      {/* ============================= HERO ============================= */}
      <section className="grain relative overflow-hidden bg-navy-gradient text-white">
        <div className="absolute inset-0 grid-faint opacity-50" aria-hidden />
        <Orbs />
        {/* giant ghost wordmark */}
        <span
          aria-hidden
          className="text-stroke pointer-events-none absolute -right-6 top-28 select-none text-[9rem] font-black leading-none sm:text-[15rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          JA
        </span>
        <AirRoute className="pointer-events-none absolute left-1/2 top-32 hidden -translate-x-1/2 text-sky-light/40 lg:block" />

        <Container className="relative">
          <div className="flex flex-col items-center pt-36 pb-28 text-center sm:pt-44 sm:pb-36">
            <Reveal>
              <Badge tone="outline">
                <span className="h-1.5 w-1.5 rounded-full bg-sky animate-pulse" />
                Now shipping · USA → Jamaica
              </Badge>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-7 max-w-4xl text-5xl font-black leading-[0.93] sm:text-7xl">
                Shop the U.S.,
                <br />
                delivered to your{" "}
                <span className="relative inline-block text-sky-gradient">
                  door
                  <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 200 12" fill="none" aria-hidden>
                    <path d="M2 9C50 3 150 3 198 9" stroke="#27B9FF" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>{" "}
                in Jamaica.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-mist/85 sm:text-xl">
                Get your <strong className="font-semibold text-white">free U.S. shipping
                address</strong>, buy from any American store, and we fly it home —
                customs handled, tracked door-to-door.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex items-center gap-3 text-base font-bold sm:gap-4 sm:text-lg">
                <span className="rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15 backdrop-blur">
                  🇺🇸 Shop U.S.
                </span>
                <ArrowRight className="h-7 w-7 animate-floaty text-sky-light" />
                <span className="rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15 backdrop-blur">
                  🇯🇲 We deliver
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Magnetic>
                  <Button href={site.portal.signupHref} variant="primary" external withArrow>
                    Get your free U.S. address
                  </Button>
                </Magnetic>
                <Button href="/how-it-works" variant="outline">
                  See how it works
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-mist/70">
                {site.promises.map((p) => (
                  <span key={p} className="flex items-center gap-2">
                    <Icon name="check" className="h-4 w-4 text-sky" /> {p}
                  </span>
                ))}
                <span className="flex items-center gap-2">
                  <Icon name="check" className="h-4 w-4 text-sky" /> No sign-up fee
                </span>
              </div>
            </Reveal>
          </div>
        </Container>

        {/* postmark accent */}
        <Postmark className="pointer-events-none absolute -left-10 bottom-24 hidden h-44 w-44 rotate-[-12deg] text-white/10 sm:block" />

        {/* air-mail seam into the marquee */}
        <AirmailEdge className="h-3 w-full" />
      </section>

      {/* ============================ STORE MARQUEE ============================ */}
      <div className="relative bg-navy py-5 text-white">
        <div className="mb-3 text-center text-xs font-bold uppercase tracking-[0.35em] text-sky-light">
          Shop any U.S. store
        </div>
        <Marquee
          items={stores}
          className="text-2xl font-black tracking-tight text-white/85 sm:text-3xl"
          slow
        />
      </div>

      {/* ============================= FUN STATS ============================= */}
      <Section className="bg-mesh py-16">
        <Container>
          <Stagger className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { n: <Counter to={3} />, label: "easy steps to your door" },
              { n: "$0", label: "sign-up fee, ever" },
              { n: <><Counter to={100} suffix="%" /></>, label: "customs handled for you" },
              { n: <Counter to={7} />, label: "shipments → a free one" },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <div className="rounded-2xl bg-white/70 p-6 text-center ring-1 ring-white/60 backdrop-blur">
                  <div className="text-4xl font-black text-blue sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                    {s.n}
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-slate-600">{s.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* =========================== HOW IT WORKS =========================== */}
      <Section className="relative bg-mesh pt-4">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Simple as 1 · 2 · 3"
              title={<>How Ship2Door <span className="text-blue">works</span></>}
              blurb="From a free U.S. address to your doorstep in Jamaica — three easy steps."
            />
          </Reveal>
          <Stagger className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <StaggerItem key={step.title}>
                <TiltCard className="group relative h-full rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200/80 transition-shadow hover:shadow-2xl">
                  <span className="absolute -top-5 left-7 flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-gradient text-lg font-black text-[#5A3B00] shadow-lg [transform:translateZ(40px)]">
                    {i + 1}
                  </span>
                  <div className="[transform:translateZ(25px)]">
                    <IconBadge>
                      <Icon name={step.icon} className="h-7 w-7" />
                    </IconBadge>
                    <h3 className="mt-5 text-xl font-bold text-navy">{step.title}</h3>
                    <p className="mt-2.5 leading-relaxed text-slate-600">{step.body}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <div className="mt-10 text-center">
              <Button href="/how-it-works" variant="white" className="ring-1 ring-slate-200" withArrow>
                The full walkthrough
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* ============================== WHY US ============================== */}
      <section className="grain relative overflow-hidden bg-navy-gradient py-24 text-white sm:py-28">
        <Orbs />
        <Postmark className="pointer-events-none absolute -right-12 top-12 hidden h-52 w-52 rotate-[14deg] text-white/[0.07] lg:block" />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              dark
              eyebrow="Why Ship2Door"
              title={<>Shipping you can <span className="text-sky-gradient">actually trust</span></>}
              blurb="We compete on three promises you feel on every single shipment."
            />
          </Reveal>
          <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <StaggerItem key={item.title} className="h-full">
                <TiltCard className="h-full rounded-2xl bg-white/[0.06] p-7 ring-1 ring-white/10 transition-colors hover:ring-sky/50">
                  <div className="[transform:translateZ(25px)]">
                    <IconBadge>
                      <Icon name={item.icon} className="h-7 w-7" />
                    </IconBadge>
                    <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-mist/70">{item.body}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ============================= REWARDS ============================= */}
      <Section className="bg-mesh">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <Badge tone="gold">Ship2Door Rewards</Badge>
                <h2 className="mt-5 text-4xl font-extrabold text-navy sm:text-5xl">
                  Ship more.
                  <br />
                  <span className="text-blue">Get free shipments.</span>
                </h2>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
                  Every shipment earns a stamp on your rewards card. Hit the milestones
                  and we ship one <strong className="text-navy">on us</strong>.
                </p>
                <div className="mt-7 space-y-3">
                  {rewards.map((r) => (
                    <div key={r.reward} className="flex items-center gap-4 rounded-2xl bg-white/70 p-4 ring-1 ring-white/60 backdrop-blur">
                      <IconBadge tone="gold">
                        <Icon name={r.icon} className="h-6 w-6" strokeWidth={2.2} />
                      </IconBadge>
                      <div>
                        <p className="font-extrabold text-navy">{r.when}</p>
                        <p className="text-sm font-bold text-blue">{r.reward} · {r.limit}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <Magnetic>
                    <Button href="/rewards" variant="primary" withArrow>
                      See the rewards program
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="flex justify-center">
                <TiltCard>
                  <Stamp rotate="3deg" className="max-w-md">
                    <Image
                      src="/rewards-card.png"
                      alt="Ship2Door Rewards punch card"
                      width={1050}
                      height={600}
                      className="rounded-md"
                    />
                  </Stamp>
                </TiltCard>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ============================= SERVICES ============================= */}
      <Section className="bg-white py-20">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Everything you need"
              title={<>One partner, <span className="text-blue">door to door</span></>}
              blurb="From your free U.S. address to delivery in Jamaica, we handle every step."
            />
          </Reveal>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <StaggerItem key={s.title}>
                <div className="group flex h-full items-start gap-4 rounded-2xl bg-mesh p-6 ring-1 ring-slate-200/70 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-sky/40">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-gradient text-white shadow-md transition-transform group-hover:scale-110">
                    <Icon name={s.icon} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </Section>

      {/* ============================= QUESTIONS? ============================= */}
      <Section className="bg-slate-50">
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">
                Got questions?
              </h2>
              <p className="mt-4 text-lg text-slate-600">
                Our team is real and we actually reply. Reach out anytime — we're here to help.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="phone" className="h-5 w-5 text-sky" />
                  <a href={site.contact.phoneHref} className="font-bold text-navy hover:text-sky">
                    {site.contact.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="messageCircle" className="h-5 w-5 text-sky" />
                  <a href={site.contact.whatsappHref} className="font-bold text-navy hover:text-sky">
                    WhatsApp us
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="mail" className="h-5 w-5 text-sky" />
                  <a href={site.contact.emailHref} className="font-bold text-navy hover:text-sky">
                    {site.contact.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="rounded-2xl bg-sky/10 p-8 text-center ring-1 ring-sky/20">
                <p className="text-sm font-semibold uppercase tracking-wider text-sky">
                  Response time
                </p>
                <p className="mt-3 text-3xl font-black text-navy">Under 1 hour</p>
                <p className="mt-2 text-sm text-slate-600">
                  Mon–Fri, 9am–6pm Jamaica time
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* =========================== FREE ADDRESS CTA =========================== */}
      <section className="grain relative overflow-hidden bg-navy-gradient text-white">
        <AirmailEdge className="h-3 w-full" />
        <Orbs />
        <AirRoute className="pointer-events-none absolute -left-10 bottom-4 hidden text-sky-light/25 md:block" />
        <Container className="relative">
          <div className="py-24 text-center">
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-sky-light">
                Shop the U.S. · we deliver to JA
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-4 text-7xl font-black leading-none text-sky-gradient sm:text-9xl">
                FREE
              </p>
              <h2 className="mt-2 text-4xl font-black sm:text-5xl">U.S. shipping address</h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-mist/80">
                New to Ship2Door? Sign up and get your own U.S. address at no cost —
                shop any American store and we bring it home to Jamaica.
              </p>
              <p className="mt-3 text-sm font-semibold text-mist/60">
                No sign-up fee · pay only when you ship
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Magnetic>
                  <Button href={site.portal.signupHref} variant="primary" external withArrow>
                    Get your free address
                  </Button>
                </Magnetic>
                <Button href={site.contact.whatsappHref} variant="ghost" external>
                  Ask a question on WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
