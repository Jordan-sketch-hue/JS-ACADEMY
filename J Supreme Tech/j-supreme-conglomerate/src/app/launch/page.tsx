import Link from "next/link";

const TODAY = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

type Release = {
  key: string;
  brand: string;
  tagline: string;
  blurb: string;
  liveUrl: string;
  pngUrl: string;
  accent: string;
  shadow: string;
  installNote: string;
};

const RELEASES: Release[] = [
  {
    key: "bp-couriers",
    brand: "BP Couriers",
    tagline: "Same-day. Tracked. Delivered.",
    blurb:
      "Live dispatch board, real-time driver workflow, payments, reports — and a Payload-powered CMS now branded in our orange.",
    liveUrl: "https://courier-app-gamma.vercel.app/install",
    pngUrl: "/launch/bp-couriers.png",
    accent: "from-[#FF6A3D] to-[#E0451B]",
    shadow: "shadow-[0_30px_90px_-25px_rgba(224,69,27,0.55)]",
    installNote: "iOS · Android · Desktop · PWA",
  },
  {
    key: "aboo-tours",
    brand: "AbooTours",
    tagline: "Jamaica without limits.",
    blurb:
      "Concierge OS for 40+ tourism + transfer back-office modules: dispatch, fleet, money, cruises, vendors, marketing.",
    liveUrl: "https://abootours.com",
    pngUrl: "/launch/aboo-tours.png",
    accent: "from-[#F2D85C] to-[#C9A832]",
    shadow: "shadow-[0_30px_90px_-25px_rgba(242,216,92,0.55)]",
    installNote: "Add to home screen on iPhone · Android · Desktop",
  },
  {
    key: "solace",
    brand: "Solace Auto Imports",
    tagline: "We Import. We Sell. We Source.",
    blurb:
      "Certified Jamaican dealership with a new back office — inventory, leads, settings, brand store — all installable.",
    liveUrl: "https://solaceautoimportsltd.com",
    pngUrl: "/launch/solace.png",
    accent: "from-[#ED7B2D] to-[#F2B340]",
    shadow: "shadow-[0_30px_90px_-25px_rgba(237,123,45,0.55)]",
    installNote: "PWA · Tap the share menu → Add to home screen",
  },
  {
    key: "j-supreme",
    brand: "J Supreme Conglomerate",
    tagline: "One OS for the whole portfolio.",
    blurb:
      "CRM, pipeline, tasks, invoices, trading, AI workflows, plus the new Back Office hub that opens every brand console with one click.",
    liveUrl: "https://jsupremeconglomerate.online",
    pngUrl: "/launch/j-supreme.png",
    accent: "from-[#7B2FFF] to-[#A855F7]",
    shadow: "shadow-[0_30px_90px_-25px_rgba(123,47,255,0.55)]",
    installNote: "PWA · Operator OS · invite-only",
  },
];

export default function LaunchPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <header className="mb-12 max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-[#A855F7]">
          Now live · Releases
        </p>
        <h1 className="mt-3 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
          Four apps just shipped.
          <span className="block bg-gradient-to-r from-[#FF6A3D] via-[#F2D85C] to-[#A855F7] bg-clip-text text-transparent">
            Install them anywhere.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
          Every brand below is a Progressive Web App — open it on your phone, tap{" "}
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-medium text-white">
            Add to Home Screen
          </span>{" "}
          and it installs like a native app, full-screen, offline-aware. Right-click any poster to
          save the 1080×1920 Instagram story version.
        </p>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/35">{TODAY}</p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        {RELEASES.map((r) => (
          <article key={r.key} className="group">
            <div
              className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0A0F] ${r.shadow} transition-transform duration-500 group-hover:-translate-y-1`}
            >
              <a href={r.pngUrl} target="_blank" rel="noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.pngUrl}
                  alt={`${r.brand} launch story`}
                  loading="lazy"
                  className="block aspect-[9/16] w-full object-cover"
                />
              </a>
            </div>

            <div className="mt-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-xl font-black tracking-tight">{r.brand}</h2>
                <span
                  className={`rounded-full bg-gradient-to-r ${r.accent} px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_12px_-4px_rgba(0,0,0,0.5)]`}
                >
                  Now live
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-white/85">{r.tagline}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{r.blurb}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={r.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${r.accent} px-4 py-2 text-sm font-bold text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] transition hover:scale-[1.02]`}
                >
                  Open the app →
                </a>
                <a
                  href={r.pngUrl}
                  download={`${r.key}-launch-story.png`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/85 transition hover:border-white/40 hover:bg-white/[0.08]"
                >
                  Download PNG
                </a>
              </div>

              <p className="mt-2.5 text-[11px] uppercase tracking-[0.18em] text-white/35">
                {r.installNote}
              </p>
            </div>
          </article>
        ))}
      </section>

      <footer className="mt-20 border-t border-white/10 pt-8 text-center text-xs text-white/40">
        <p>
          Generated server-side via{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5">next/og</code> — open this page on
          Instagram&apos;s in-app browser to upload directly to your story.
        </p>
        <p className="mt-2">
          <Link href="/" className="text-white/55 hover:text-white">
            ← back to conglomerate
          </Link>
        </p>
      </footer>
    </main>
  );
}
