import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { site, nav } from "@/lib/site";
import { Container, Button } from "@/components/ui";
import { FlightArc, InstagramGlyph } from "@/components/brand";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy-gradient text-white">
      <FlightArc className="pointer-events-none absolute -right-20 top-0 h-48 w-[36rem] text-sky-light/15" />

      {/* CTA band */}
      <Container className="relative">
        <div className="grid items-center gap-8 border-b border-white/10 py-16 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to shop the U.S.?
            </h2>
            <p className="mt-3 max-w-lg text-mist/80">
              Get your free U.S. shipping address today — no sign-up fee, pay only
              when you ship.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={site.portal.signupHref} variant="primary" external withArrow>
              Get free U.S. address
            </Button>
            <Button href={site.contact.whatsappHref} variant="ghost" external>
              <MessageCircle className="h-5 w-5" /> WhatsApp us
            </Button>
          </div>
        </div>
      </Container>

      {/* Link columns */}
      <Container className="relative">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Image
              src="/logo-white.png"
              alt={site.name}
              width={833}
              height={729}
              className="h-14 w-auto"
            />
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-sky-light">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist/70">
              USA → Jamaica package forwarding. Shop any American store and we
              deliver it to your door.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-mist/75 transition-colors hover:text-sky-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
              Account
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={site.portal.signupHref} className="text-sm text-mist/75 transition-colors hover:text-sky-light">
                  Sign up
                </a>
              </li>
              <li>
                <a href={site.portal.loginHref} className="text-sm text-mist/75 transition-colors hover:text-sky-light">
                  Log in
                </a>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-mist/75 transition-colors hover:text-sky-light">
                  Track a package
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-mist/80">
              <li>
                <a href={site.contact.phoneHref} className="flex items-center gap-3 hover:text-sky-light">
                  <Phone className="h-4 w-4 shrink-0 text-sky-light" /> {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={site.contact.instagramHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-sky-light">
                  <InstagramGlyph className="h-4 w-4 shrink-0 text-sky-light" /> {site.contact.instagram}
                </a>
              </li>
              <li>
                <a href={site.contact.emailHref} className="flex items-center gap-3 hover:text-sky-light">
                  <Mail className="h-4 w-4 shrink-0 text-sky-light" /> {site.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-light" /> {site.contact.location}
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <Container>
          <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-mist/55 sm:flex-row">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <p className="uppercase tracking-[0.18em]">{site.tagline}</p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
