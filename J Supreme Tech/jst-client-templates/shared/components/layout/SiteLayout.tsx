import type { ClientConfig } from "@shared/types/config";
import { WhatsAppCTA } from "@shared/components/ui/WhatsAppCTA";
import { SiteNav } from "@shared/components/layout/SiteNav";

const DEFAULT_NAV = [
  { label: "Services",  href: "#services"      },
  { label: "Gallery",   href: "#gallery"       },
  { label: "Reviews",   href: "#testimonials"  },
  { label: "Contact",   href: "#contact"       },
];

interface Props {
  config: ClientConfig;
  children: React.ReactNode;
  navLinks?: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function SiteLayout({ config, children, navLinks, ctaLabel, ctaHref }: Props) {
  return (
    <>
      <SiteNav
        logoSrc={config.logo}
        logoAlt={config.name}
        phone={config.contact.phone}
        navLinks={navLinks ?? DEFAULT_NAV}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        accent={config.colors.accent}
      />

      <main>{children}</main>

      <footer className="border-t border-[var(--border)] bg-[var(--bg-card)] px-6 py-10">
        <div className="mx-auto max-w-6xl flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-bold text-[var(--text-primary)]">{config.name}</p>
          {config.contact.address && (
            <p className="text-sm text-[var(--text-secondary)]">{config.contact.address}</p>
          )}
          {config.contact.phone && (
            <p className="text-xs" style={{ color: "#666" }}>{config.contact.phone}</p>
          )}
          <p className="text-xs" style={{ color: "#666" }}>
            &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
          </p>
        </div>
      </footer>

      <WhatsAppCTA number={config.contact.whatsapp} />
    </>
  );
}