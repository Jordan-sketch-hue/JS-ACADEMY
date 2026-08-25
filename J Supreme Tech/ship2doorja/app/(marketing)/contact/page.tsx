import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Container, Section, Card, IconBadge } from "@/components/ui";
import { Icon } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Ship 2 Door JA. Call or WhatsApp (876) 360-2586, message @ship.2doorja on Instagram, or visit us in Montego Bay, St James.",
};

const methods = [
  {
    icon: "phone",
    label: "Call or WhatsApp",
    value: site.contact.phone,
    href: site.contact.whatsappHref,
    external: true,
  },
  {
    icon: "instagram",
    label: "Instagram",
    value: site.contact.instagram,
    href: site.contact.instagramHref,
    external: true,
  },
  {
    icon: "chat",
    label: "Email",
    value: site.contact.email,
    href: site.contact.emailHref,
    external: false,
  },
  {
    icon: "mapPin",
    label: "Pickup / drop-off",
    value: site.contact.location,
    href: undefined,
    external: false,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={<>Let's get your package <span className="text-sky-gradient">home</span></>}
        blurb="Questions, quotes, or ready to ship? We're real people and we reply fast — pick whatever's easiest for you."
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            {/* Methods */}
            <div>
              <h2 className="text-2xl font-extrabold text-navy">Reach us directly</h2>
              <p className="mt-2 text-slate-600">
                WhatsApp is the fastest way to get a quote or a status update.
              </p>
              <div className="mt-8 space-y-4">
                {methods.map((m) => {
                  const inner = (
                    <Card className="flex items-center gap-4 !p-5">
                      <IconBadge>
                        <Icon name={m.icon} className="h-6 w-6" />
                      </IconBadge>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {m.label}
                        </p>
                        <p className="font-bold text-navy">{m.value}</p>
                      </div>
                    </Card>
                  );
                  return m.href ? (
                    <a
                      key={m.label}
                      href={m.href}
                      target={m.external ? "_blank" : undefined}
                      rel={m.external ? "noopener noreferrer" : undefined}
                      className="block"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div key={m.label}>{inner}</div>
                  );
                })}
              </div>

              <div className="mt-8 rounded-2xl bg-sky/10 p-6 ring-1 ring-sky/20">
                <p className="flex items-center gap-2 font-bold text-navy">
                  <Icon name="warehouse" className="h-5 w-5 text-blue" />
                  Don't have a U.S. address yet?
                </p>
                <p className="mt-1.5 text-sm text-slate-600">
                  Sign up free and we'll issue yours instantly — then you can start
                  shopping any U.S. store today.
                </p>
                <a
                  href={site.portal.signupHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue hover:underline"
                >
                  Get your free U.S. address <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl bg-white p-7 ring-1 ring-slate-200/80 shadow-sm sm:p-9">
              <h2 className="text-2xl font-extrabold text-navy">Send us a message</h2>
              <p className="mt-2 text-slate-600">
                Tell us what you're shipping and we'll get right back to you.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
