import {
  Warehouse,
  Package,
  Home,
  DollarSign,
  ShieldCheck,
  UserCheck,
  MessageCircle,
  Plane,
  Truck,
  Search,
  Bell,
  Cake,
  Gift,
  Globe,
  Phone,
  MapPin,
  Check,
  Clock,
  Star,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  warehouse: Warehouse,
  package: Package,
  home: Home,
  dollar: DollarSign,
  shield: ShieldCheck,
  userCheck: UserCheck,
  chat: MessageCircle,
  plane: Plane,
  truck: Truck,
  search: Search,
  bell: Bell,
  cake: Cake,
  gift: Gift,
  globe: Globe,
  phone: Phone,
  mapPin: MapPin,
  check: Check,
  clock: Clock,
  star: Star,
  arrow: ArrowRight,
};

export function Icon({
  name,
  className,
  strokeWidth = 2,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  // lucide v1 dropped brand icons — render Instagram from an inline glyph.
  if (name === "instagram")
    return <InstagramGlyph className={className} strokeWidth={strokeWidth} />;
  const C = ICONS[name] ?? Package;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden />;
}

/* Instagram mark (lucide-compatible inline SVG). */
export function InstagramGlyph({
  className,
  strokeWidth = 2,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/* Decorative dashed USA -> Jamaica flight arc with a little plane at the end. */
export function FlightArc({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 220"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M40 170 Q300 -10 560 120"
        stroke="currentColor"
        strokeWidth="4"
        strokeDasharray="3 15"
        strokeLinecap="round"
      />
      <circle cx="40" cy="170" r="9" fill="currentColor" />
      <circle cx="560" cy="120" r="9" fill="currentColor" />
      <g transform="translate(538 116) rotate(28)" fill="currentColor">
        <path d="M0 8 L26 2 L24 9 L9 12 L4 22 L0 22 L2 12 L-6 12 Z" />
      </g>
    </svg>
  );
}

/* Soft glowing orbs for dark sections. */
export function Orbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-sky/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-blue/20 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sky-light/10 blur-3xl" />
    </div>
  );
}
