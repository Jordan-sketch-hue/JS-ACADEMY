"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { site, nav } from "@/lib/site";
import { Button, cn } from "@/components/ui";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "bg-white/90 shadow-[0_4px_30px_rgba(12,39,80,0.08)] backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" aria-label={site.name}>
          <Image
            src={solid ? "/logo.png" : "/logo-white.png"}
            alt={site.name}
            width={833}
            height={729}
            priority
            className="h-11 w-auto"
          />
          <span
            className={cn(
              "hidden text-lg font-extrabold leading-none sm:block",
              solid ? "text-navy" : "text-white"
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ship&nbsp;2&nbsp;Door<span className="text-sky"> JA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                  solid
                    ? active
                      ? "text-blue"
                      : "text-slate-600 hover:text-navy"
                    : active
                      ? "text-white"
                      : "text-white/80 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href={site.portal.loginHref}
            className={cn(
              "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
              solid ? "text-navy hover:text-blue" : "text-white/90 hover:text-white"
            )}
          >
            Log in
          </Link>
          <Button href={site.portal.signupHref} variant="primary" external>
            Get free U.S. address
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden",
            solid ? "text-navy hover:bg-slate-100" : "text-white hover:bg-white/10"
          )}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "overflow-hidden border-t border-slate-100 bg-white lg:hidden",
          "transition-[max-height,opacity] duration-300 ease-in-out",
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 px-5 py-4">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block rounded-xl px-4 py-3 text-base font-semibold",
                  active ? "bg-sky/10 text-blue" : "text-navy hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="grid grid-cols-1 gap-2.5 pt-3">
            <Button href={site.portal.signupHref} variant="primary" external withArrow>
              Get free U.S. address
            </Button>
            <Button href={site.portal.loginHref} variant="white" external className="ring-1 ring-slate-200">
              Log in to your account
            </Button>
            <a
              href={site.contact.phoneHref}
              className="mt-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-slate-500"
            >
              <Phone className="h-4 w-4" /> {site.contact.phone}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
