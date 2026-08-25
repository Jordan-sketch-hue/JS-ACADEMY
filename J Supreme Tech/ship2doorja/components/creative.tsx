import { type ReactNode } from "react";
import { cn } from "@/components/ui";

/* ----------------------------- AirmailEdge ----------------------------- */
/* Thin classic air-mail stripe — use as a top/bottom accent bar. */
export function AirmailEdge({ className }: { className?: string }) {
  return <div aria-hidden className={cn("airmail-stripe", className)} />;
}

/* ------------------------------- Postmark ------------------------------ */
/* Circular postal cancellation stamp with curved text. Decorative. */
export function Postmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <defs>
        <path id="pm-top" d="M100,100 m-74,0 a74,74 0 1,1 148,0" />
        <path id="pm-bottom" d="M100,100 m74,0 a74,74 0 1,1 -148,0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 7" />
      <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="48" fill="none" stroke="currentColor" strokeWidth="2" />
      <text fill="currentColor" fontSize="13" fontWeight="800" letterSpacing="4">
        <textPath href="#pm-top" startOffset="50%" textAnchor="middle">
          SHIP 2 DOOR JA
        </textPath>
      </text>
      <text fill="currentColor" fontSize="11" fontWeight="700" letterSpacing="5">
        <textPath href="#pm-bottom" startOffset="50%" textAnchor="middle">
          USA → JAMAICA
        </textPath>
      </text>
      {/* center plane */}
      <g transform="translate(100 100) scale(1.5) translate(-12 -12)" fill="currentColor">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </g>
      <text x="100" y="158" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700" letterSpacing="3">
        PAR AVION
      </text>
    </svg>
  );
}

/* --------------------------- PlaneGlyph -------------------------------- */
function PlaneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor" className={className} aria-hidden>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
    </svg>
  );
}

/* ------------------------------- AirRoute ------------------------------ */
/* Dashed USA→JA arc with a plane continuously flying it (CSS offset-path). */
export function AirRoute({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative", className)}
      style={{ width: 600, height: 220 }}
    >
      <svg viewBox="0 0 600 220" width="600" height="220" fill="none" className="absolute inset-0">
        <path d="M40 170 Q300 -10 560 120" stroke="currentColor" strokeWidth="3" strokeDasharray="1 13" strokeLinecap="round" />
        <circle cx="40" cy="170" r="8" fill="currentColor" />
        <circle cx="40" cy="170" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <circle cx="560" cy="120" r="8" fill="currentColor" />
        <circle cx="560" cy="120" r="14" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
      </svg>
      <span className="plane-fly absolute left-0 top-0 -ml-3.5 -mt-3.5 drop-shadow">
        <PlaneGlyph />
      </span>
    </div>
  );
}

/* -------------------------------- Stamp -------------------------------- */
/* Postage-stamp frame: white perforated-look border, slight rotation. */
export function Stamp({
  children,
  className,
  rotate = "-3deg",
}: {
  children: ReactNode;
  className?: string;
  rotate?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] bg-white p-2 shadow-xl",
        "[outline:3px_dashed_rgba(255,255,255,0.9)] [outline-offset:-8px]",
        className
      )}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------- Marquee ------------------------------- */
export function Marquee({
  items,
  className,
  slow = false,
}: {
  items: string[];
  className?: string;
  slow?: boolean;
}) {
  const group = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-10 whitespace-nowrap">
          <span>{it}</span>
          <span className="text-sky">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("flex overflow-hidden", className)} aria-hidden>
      <div className={cn("flex shrink-0", slow ? "animate-marquee-slow" : "animate-marquee")}>
        {group}
        {group}
      </div>
    </div>
  );
}
