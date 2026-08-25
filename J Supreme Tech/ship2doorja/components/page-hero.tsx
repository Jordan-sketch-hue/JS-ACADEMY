import { type ReactNode } from "react";
import { Container } from "@/components/ui";
import { Orbs } from "@/components/brand";
import { Postmark, AirRoute, AirmailEdge } from "@/components/creative";
import { Reveal } from "@/components/motion";

export function PageHero({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow?: string;
  title: ReactNode;
  blurb?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-navy-gradient text-white">
      <div className="absolute inset-0 grid-faint opacity-50" aria-hidden />
      <Orbs />
      <AirRoute className="pointer-events-none absolute right-0 top-20 hidden text-sky-light/25 lg:block" />
      <Postmark className="pointer-events-none absolute -left-8 -bottom-10 hidden h-44 w-44 rotate-[-10deg] text-white/[0.07] sm:block" />
      <Container className="relative">
        <div className="max-w-3xl pt-36 pb-20 sm:pt-44 sm:pb-24">
          {eyebrow && (
            <Reveal>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.22em] text-sky-light ring-1 ring-white/15">
                {eyebrow}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.08}>
            <h1 className="text-4xl font-black leading-[0.98] sm:text-6xl">{title}</h1>
          </Reveal>
          {blurb && (
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist/85">
                {blurb}
              </p>
            </Reveal>
          )}
        </div>
      </Container>
      <AirmailEdge className="h-3 w-full" />
    </section>
  );
}
