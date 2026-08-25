import Link from "next/link";
import { type ReactNode } from "react";
import { ArrowRight } from "lucide-react";

/* ---------------------------------- cn ---------------------------------- */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------- Container ------------------------------ */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/* -------------------------------- Section ------------------------------- */
export function Section({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <section
      className={cn(
        "py-20 sm:py-28",
        dark && "bg-navy-gradient text-white",
        className
      )}
    >
      {children}
    </section>
  );
}

/* --------------------------------- Badge -------------------------------- */
export function Badge({
  children,
  tone = "sky",
  className,
}: {
  children: ReactNode;
  tone?: "sky" | "gold" | "outline";
  className?: string;
}) {
  const tones = {
    sky: "bg-sky/15 text-blue ring-1 ring-sky/30",
    gold: "bg-gold-gradient text-[#5A3B00] shadow-sm",
    outline: "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/* ----------------------------- SectionHeading --------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  blurb,
  align = "center",
  dark = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  blurb?: ReactNode;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-3 text-sm font-bold uppercase tracking-[0.22em]",
            dark ? "text-sky-light" : "text-blue"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-4xl sm:text-5xl font-extrabold",
          dark ? "text-white" : "text-navy"
        )}
      >
        {title}
      </h2>
      {blurb && (
        <p
          className={cn(
            "mt-5 text-lg leading-relaxed",
            dark ? "text-mist/85" : "text-slate-600"
          )}
        >
          {blurb}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- Button -------------------------------- */
type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "gold" | "outline" | "ghost" | "white";
  className?: string;
  withArrow?: boolean;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  withArrow = false,
  external = false,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-sky text-navy-deep hover:bg-sky-light shadow-lg shadow-sky/30",
    gold: "bg-gold-gradient text-[#5A3B00] shadow-lg shadow-gold/30 hover:brightness-105",
    outline:
      "bg-transparent text-white ring-2 ring-white/30 hover:ring-white/70 hover:bg-white/5",
    ghost: "bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 backdrop-blur",
    white: "bg-white text-navy hover:bg-mist shadow-lg shadow-black/5",
  };
  const base =
    "group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold transition-all duration-200 active:scale-[0.98]";
  const rel = external ? "noopener noreferrer" : undefined;
  const target = external ? "_blank" : undefined;
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(base, variants[variant], className)}
    >
      {children}
      {withArrow && (
        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
      )}
    </Link>
  );
}

/* --------------------------------- Card --------------------------------- */
export function Card({
  children,
  className,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-7 transition-all duration-200",
        dark
          ? "bg-white/[0.06] ring-1 ring-white/10 hover:ring-sky/40"
          : "bg-white ring-1 ring-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------- IconBadge ------------------------------ */
export function IconBadge({
  children,
  tone = "sky",
}: {
  children: ReactNode;
  tone?: "sky" | "gold";
}) {
  return (
    <div
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-2xl",
        tone === "sky"
          ? "bg-sky-gradient text-white shadow-lg shadow-blue/30"
          : "bg-gold-gradient text-[#5A3B00] shadow-lg shadow-gold/30"
      )}
    >
      {children}
    </div>
  );
}
