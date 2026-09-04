import type { Metadata } from "next";
import { site, whyUs } from "@/lib/site";
import { Container, Section, SectionHeading, Button, Card, IconBadge } from "@/components/ui";
import { Icon } from "@/components/brand";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ship 2 Door JA is the modern, accountable way to shop America and get it delivered to your Jamaican door. Economical, reliable, and accountable freight forwarding.",
};

const audiences = [
  {
    icon: "globe",
    title: "Jamaican online shoppers",
    body: "Shopping Amazon, SHEIN, electronics and fashion sites? Get a U.S. address and a forwarder you can trust.",
  },
  {
    icon: "gift",
    title: "The U.S. diaspora",
    body: "Sending gifts, barrels and essentials home to family — especially at birthdays and Christmas.",
  },
  {
    icon: "truck",
    title: "Small Jamaican businesses",
    body: "Resellers and shops importing inventory who value consolidation, reliability and predictable cost.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Ship 2 Door JA"
        title={<>The modern way to <span className="text-sky-gradient">shop America</span> from Jamaica</>}
        blurb="We're a full-service freight forwarding and shipping company built on one idea: getting your packages home should be simple, affordable, and something you never have to worry about."
      />

      {/* Mission */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue">Our mission</p>
            <p className="mt-6 text-2xl font-semibold leading-relaxed text-navy sm:text-3xl">
              "To provide seamless, trustworthy, and cost-effective shipping solutions
              that empower clients to move goods with{" "}
              <span className="text-blue">confidence</span>."
            </p>
          </div>
        </Container>
      </Section>

      {/* Promises */}
      <Section dark className="relative overflow-hidden pt-0">
        <Container className="relative">
          <SectionHeading
            dark
            eyebrow="What we stand for"
            title="Three promises on every shipment"
            blurb="They're not slogans — they're how we run the business."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item) => (
              <Card key={item.title} dark>
                <IconBadge>
                  <Icon name={item.icon} className="h-7 w-7" />
                </IconBadge>
                <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-mist/70">{item.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Who we serve */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Who we serve"
            title="Built for how Jamaica shops"
            blurb="Whether it's one parcel or a business shipment, we've got you."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {audiences.map((a) => (
              <Card key={a.title}>
                <IconBadge>
                  <Icon name={a.icon} className="h-7 w-7" />
                </IconBadge>
                <h3 className="mt-5 text-xl font-bold text-navy">{a.title}</h3>
                <p className="mt-2.5 leading-relaxed text-slate-600">{a.body}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Location */}
      <Section className="bg-mist/40">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-3xl bg-white p-10 text-center ring-1 ring-slate-200/80 shadow-sm sm:p-14">
            <IconBadge tone="gold">
              <Icon name="mapPin" className="h-7 w-7" strokeWidth={2.2} />
            </IconBadge>
            <h2 className="text-3xl font-extrabold text-navy">Find us in Jamaica</h2>
            <p className="max-w-lg text-slate-600">
              We deliver door-to-door islandwide — and you can always reach a real
              person. Drop-off & pickup at:
            </p>
            <p className="text-lg font-bold text-navy">{site.contact.location}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Button href={site.contact.whatsappHref} variant="primary" external>
                Message us
              </Button>
              <Button href="/contact" variant="white" className="ring-1 ring-slate-200">
                All contact options
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
