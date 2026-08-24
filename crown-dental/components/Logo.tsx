let _id = 0;

export function Logo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  // Unique per-instance gradient IDs so two Logo mounts don't share the same SVG defs
  const uid = typeof window === "undefined" ? "s" : ((_id++ % 999) + 1).toString();
  const g1 = `cg1_${uid}`;
  const g2 = `cg2_${uid}`;

  const sz = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const tx = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 64 64" className={`${sz} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={g1} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#B8953F"/>
            <stop offset="55%"  stopColor="#C9A96E"/>
            <stop offset="100%" stopColor="#E2C98A"/>
          </linearGradient>
          <linearGradient id={g2} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#FFFFFF"/>
            <stop offset="100%" stopColor="#F0F4F8"/>
          </linearGradient>
        </defs>
        {/* Tooth body */}
        <path d="M 15 34 Q 10 28 11 20 Q 13 10 20 10 Q 24 10 26 14 Q 28 9 32 9 Q 36 9 38 14 Q 40 10 44 10 Q 51 10 53 20 Q 54 28 49 34 Q 42 37 32 37 Q 22 37 15 34 Z" fill={`url(#${g2})`} stroke="#DDE3EC" strokeWidth="1"/>
        {/* Left root */}
        <path d="M 20 37 Q 19 43 17 52 Q 16 58 20 59 Q 24 60 25 55 L 29 42 Z" fill={`url(#${g2})`} stroke="#DDE3EC" strokeWidth="1"/>
        {/* Right root */}
        <path d="M 44 37 Q 45 43 47 52 Q 48 58 44 59 Q 40 60 39 55 L 35 42 Z" fill={`url(#${g2})`} stroke="#DDE3EC" strokeWidth="1"/>
        {/* Crown band */}
        <rect x="12" y="16" width="40" height="8" rx="2" fill={`url(#${g1})`}/>
        {/* Crown peaks */}
        <path d="M 12 16 L 16 7 L 21 14 L 27 5 L 32 13 L 37 5 L 43 14 L 48 7 L 52 16 Z" fill={`url(#${g1})`}/>
        {/* Gems */}
        <circle cx="27" cy="6" r="2.2" fill="white" opacity="0.9"/>
        <circle cx="37" cy="6" r="2.2" fill="white" opacity="0.9"/>
        {/* Band highlight */}
        <rect x="12" y="16" width="40" height="2.5" rx="1" fill="white" opacity="0.25"/>
      </svg>
      <span className={`font-display font-semibold tracking-tight text-ink ${tx}`}>Crown</span>
    </div>
  );
}
