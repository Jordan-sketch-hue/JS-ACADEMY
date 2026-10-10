/**
 * J Supreme Conglomerate monogram. Inline SVG using currentColor so it adapts
 * to the active theme (set the parent's text color, e.g. text-primary).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label="J Supreme Conglomerate"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.6"
        y="1.6"
        width="36.8"
        height="36.8"
        rx="10"
        stroke="currentColor"
        strokeWidth="2.2"
        opacity="0.9"
      />
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-jarvis), 'Space Grotesk', system-ui, sans-serif"
        fontSize="16.5"
        fontWeight={700}
        letterSpacing="0.5"
        fill="currentColor"
      >
        JS
      </text>
    </svg>
  );
}
