import HeroCarousel from "@/components/HeroCarousel";
import AdCarousel from "@/components/AdCarousel";
import AdSlot from "@/components/AdSlot";
import DebriefForm from "@/components/DebriefForm";

/* ─── CONTENT DATA ─── */
const LATEST = [
  {
    cat: "Technology",
    title: "AI Is Moving From Experiment to Infrastructure",
    excerpt: "The businesses that treat artificial intelligence as a side project are falling behind. Practical lessons from deploying AI inside real Caribbean operations.",
    date: "Aug 16, 2026",
    read: "7 min",
    img: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    href: "/articles/ai-infrastructure-caribbean",
  },
  {
    cat: "Caribbean",
    title: "Why Caribbean Businesses Are Still Underinvesting in Digital Systems",
    date: "Aug 14, 2026", read: "5 min",
    img: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    href: "/articles/caribbean-digital-investment",
  },
  {
    cat: "Marketing",
    title: "Social Media Is Not a Strategy. This Is.",
    date: "Aug 12, 2026", read: "5 min",
    img: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    href: "/articles/social-media-strategy",
  },
  {
    cat: "Technology",
    title: "Why Your Business Still Needs a Custom CRM in 2026",
    date: "Aug 15, 2026", read: "6 min",
    img: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    href: "/articles/custom-crm-2026",
  },
  {
    cat: "AI",
    title: "Automation Is Not AI — And the Difference Matters",
    date: "Aug 10, 2026", read: "5 min",
    img: "https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    href: "/articles/automation-vs-ai",
  },
];

const NC_AFFILIATE = "https://namecheap.pxf.io/c/7420688/1632743/5618";

const TECH_ARTICLES = [
  { cat: "Technology", title: "Why Your Business Still Needs a Custom CRM in 2026", excerpt: "Off-the-shelf tools cap your growth. Here's what bespoke data infrastructure actually looks like in practice.", date: "Aug 15", read: "6 min", img: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/custom-crm-2026" },
  { cat: "Technology", title: "The Infrastructure Stack Every Modern Business Needs", excerpt: "Web, app, database, automation — this is what a complete digital operation looks like in 2026.", date: "Aug 11", read: "5 min", img: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/ai-infrastructure-caribbean" },
  { cat: "AI", title: "AI Agents Are Becoming Business Infrastructure", excerpt: "From chatbots to operational agents — how the category is maturing faster than most businesses can respond.", date: "Aug 8", read: "7 min", img: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/automation-vs-ai" },
];

const MARKETING_ARTICLES = [
  { cat: "Marketing", title: "Social Media Is Not a Strategy. This Is.", excerpt: "Why treating channels as the plan — instead of as distribution for a real strategy — keeps most Caribbean businesses stuck.", date: "Aug 13", read: "5 min", img: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/social-media-strategy" },
  { cat: "Branding", title: "What a Brand System Actually Does for a Business", excerpt: "It's not a logo. It's not a colour palette. It's the operating system underneath every customer decision.", date: "Aug 7", read: "4 min", img: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/social-media-strategy" },
  { cat: "Growth", title: "The Conversion Stack: From Traffic to Revenue", excerpt: "Most businesses have an audience problem. Most actually have a conversion problem. The difference matters.", date: "Aug 5", read: "6 min", img: "https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/social-media-strategy" },
];

const AI_ARTICLES = [
  { cat: "AI", title: "How Caribbean Businesses Can Deploy AI Without a Technical Team", excerpt: "The tools exist. The gap is implementation knowledge. This is what actually works.", date: "Aug 14", read: "8 min", img: "https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/ai-infrastructure-caribbean" },
  { cat: "AI", title: "Automation Is Not AI — And the Difference Matters", excerpt: "Confusing the two is expensive. Here's how to think about each tool in a real business context.", date: "Aug 10", read: "5 min", img: "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/automation-vs-ai" },
  { cat: "AI", title: "The Real ROI of AI Implementation for SMEs", excerpt: "Beyond hype: the actual productivity gains operators are reporting after 90 days of structured AI deployment.", date: "Aug 6", read: "6 min", img: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/ai-infrastructure-caribbean" },
];

const CARIBBEAN_ARTICLES = [
  { cat: "Caribbean", title: "The Caribbean Digital Economy: Where We Are in 2026", excerpt: "A region-wide landscape of technology adoption, infrastructure gaps and the businesses filling them.", date: "Aug 12", read: "9 min", img: "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/caribbean-digital-investment" },
  { cat: "Caribbean", title: "Jamaica Is Building a Tech Ecosystem — Here&apos;s What&apos;s Missing", excerpt: "Infrastructure, capital, talent and policy — an honest audit of where the island stands.", date: "Aug 9", read: "7 min", img: "https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "/articles/caribbean-digital-investment" },
];

const AFFILIATE_PICKS = [
  {
    brand: "Namecheap",
    cat: "Domains & Hosting",
    title: "Get Your Business Domain & Hosting — Fast, Affordable, Reliable",
    desc: "Every business needs a home online. Namecheap offers domain registration, web hosting, SSL certificates and email hosting starting under $10/year — the infrastructure stack for serious operators.",
    cta: "Get Your Domain →",
    href: NC_AFFILIATE,
    badge: "Partner Pick",
    img: "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
  },
  {
    brand: "Namecheap",
    cat: "Business Email",
    title: "Professional Business Email — Because @gmail Isn't a Brand",
    desc: "Your email address is your first impression. Namecheap Private Email gives you a branded inbox at your domain, starting from $1/month. Used by thousands of Caribbean businesses.",
    cta: "Set Up Business Email →",
    href: NC_AFFILIATE,
    badge: "Recommended",
    img: "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
  },
  {
    brand: "Namecheap",
    cat: "SSL & Security",
    title: "Secure Your Site With SSL — Google Ranks You Higher When You Do",
    desc: "An SSL certificate isn't optional in 2026. It protects your users, signals trust, and is a direct ranking factor. Namecheap SSL certificates start from $5.99/year.",
    cta: "Get SSL Certificate →",
    href: NC_AFFILIATE,
    badge: "Essential Tool",
    img: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
  },
];

const NEW_RELEASES = [
  {
    type: "Website",
    name: "Language Cradle",
    desc: "Full digital platform for Jamaica's premier language institute — CMS, booking, member portal and AI-powered language assistant.",
    tags: ["Next.js", "Supabase", "CMS", "Web App"],
    url: "https://thelanguagecradle.com",
    img: "https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    launched: "Aug 2026",
  },
  {
    type: "Digital Brand",
    name: "Stratus Logistics",
    desc: "Four-portal logistics platform built for a Caribbean freight company — operator, driver, client and admin dashboards under one brand.",
    tags: ["Brand System", "4 Portals", "Dashboard"],
    url: "https://courier-logistics.vercel.app",
    img: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    launched: "Aug 2026",
  },
  {
    type: "Platform",
    name: "Supreme Suite",
    desc: "13-system white-label business OS for Caribbean operators — CRM, billing, marketing, booking, analytics and more under one roof.",
    tags: ["SaaS", "White-label", "13 Systems"],
    url: "https://supreme-suite.vercel.app",
    img: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    launched: "Jul 2026",
  },
  {
    type: "Website",
    name: "Solid Trust Courier",
    desc: "Freight and shipping platform for a Jamaican logistics company — customer portal, live rate calculator and WiPay payment integration.",
    tags: ["Next.js", "WiPay", "Freight"],
    url: "https://solidtrustservices.com",
    img: "https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop",
    launched: "Jul 2026",
  },
];

const MOST_READ = [
  { title: "Why Caribbean Businesses Are Behind on AI", cat: "Technology" },
  { title: "The New Economics of Digital Marketing", cat: "Marketing" },
  { title: "Why Every Business Needs a CRM", cat: "Business" },
  { title: "Jamaica's Next Technology Opportunity", cat: "Caribbean" },
  { title: "The Future of Caribbean Commerce", cat: "Markets" },
];

const STUDIO = [
  { label: "Platform Shipped", title: "Supreme Suite — 13-System Business OS for Caribbean Operators", img: "https://images.pexels.com/photos/3183153/pexels-photo-3183153.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop" },
  { label: "Campaign Live", title: "Language Cradle: Full Digital Brand + App + Marketing System", img: "https://images.pexels.com/photos/4974920/pexels-photo-4974920.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop" },
  { label: "System Built", title: "Multi-Brand Logistics Dashboard for BP Couriers", img: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop" },
];

/* ─── ICON SVG STRINGS ─── */
const DISCORD_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:15px;height:15px"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" fill="currentColor"/></svg>`;
const TELEGRAM_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:15px;height:15px"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="currentColor"/></svg>`;
const WA_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:15px;height:15px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" fill="currentColor"/></svg>`;

export default function CommunicationsHome() {
  return (
    <>
      {/* ══════ NAVIGATION ══════ */}
      <nav className="pub-nav">
        <div className="pub-nav__top">
          <a href="https://jsupremetech.online" className="pub-nav__logo">
            <div className="pub-nav__mark">JST</div>
            <div className="pub-nav__wordmark">
              <span className="pub-nav__name">J Supreme Tech</span>
              <span className="pub-nav__sub">Communications</span>
            </div>
          </a>
          <div className="pub-nav__links">
            <a href="#latest" className="pub-nav__link">Latest</a>
            <a href="#technology" className="pub-nav__link">Technology</a>
            <a href="#ai" className="pub-nav__link">AI</a>
            <a href="#marketing" className="pub-nav__link">Marketing</a>
            <a href="#caribbean" className="pub-nav__link">Caribbean</a>
            <a href="/newsletters" className="pub-nav__link">Archive</a>
            <a href="/about" className="pub-nav__link">About</a>
          </div>
          <div className="pub-nav__actions">
            <a href="/advertise" className="pub-nav__advertise">Advertise</a>
            <a href="#newsletter" className="pub-nav__subscribe">Subscribe →</a>
          </div>
        </div>
      </nav>
      <div className="spectrum-bar" />

      {/* ══════ HERO ══════ */}
      <section className="hero-ed">
        <div className="hero-ed__left">
          <div className="hero-ed__eyebrow">J Supreme Tech Communications</div>
          <h1 className="hero-ed__headline">
            Technology.<br />
            Business.<br />
            The Caribbean.
          </h1>
          <p className="hero-ed__sub">
            Intelligence, analysis and field notes on technology, marketing, finance,
            business and the markets shaping the Caribbean — from the team building
            inside them.
          </p>
          <div className="hero-ed__ctas">
            <a href="#latest" className="hero-ed__cta-primary">Read the Latest</a>
            <a href="#newsletter" className="hero-ed__cta-secondary">Subscribe Free →</a>
          </div>
        </div>
        <div className="hero-ed__right">
          <HeroCarousel />
        </div>
      </section>

      {/* ══════ STAT STRIP ══════ */}
      <div className="stat-strip-light">
        <div className="stat-cell-light">
          <div className="stat-val-light">13+</div>
          <div className="stat-lbl-light">Systems Built</div>
        </div>
        <div className="stat-cell-light">
          <div className="stat-val-light">6</div>
          <div className="stat-lbl-light">Disciplines Covered</div>
        </div>
        <div className="stat-cell-light">
          <div className="stat-val-light">Daily</div>
          <div className="stat-lbl-light">In Today's World:</div>
        </div>
        <div className="stat-cell-light">
          <div className="stat-val-light">JA+</div>
          <div className="stat-lbl-light">Caribbean & Global</div>
        </div>
      </div>

      {/* ══════ PREMIUM AD SLOT — LEADERBOARD ══════ */}
      <div className="shell">
        <div style={{ padding: "32px 0 0" }}>
          <AdSlot slotId="AD-TOP-LEADERBOARD" format="leaderboard" concept={4} />
        </div>
      </div>

      {/* ══════ LATEST STORIES ══════ */}
      <section id="latest" className="shell ed-section" style={{ paddingTop: "0" }}>
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// What&apos;s happening now</div>
              <h2 className="sec-hd__title">The Latest</h2>
            </div>
            <a href="/technology" className="sec-hd__more">View all →</a>
          </div>
        </div>
        <div className="latest-grid">
          {/* Feature article */}
          <div className="latest-grid__feature">
            <div className="card card--feature">
              <div className="card__img-wrap">
                <img src={LATEST[0].img} alt={LATEST[0].title} className="card__img" loading="eager" />
              </div>
              <div className="card__body">
                <div className="card__cat">{LATEST[0].cat}</div>
                <div className="card__title" style={{ WebkitLineClamp: 4 }}>{LATEST[0].title}</div>
                <p className="card__excerpt" style={{ WebkitLineClamp: 3 }}>{LATEST[0].excerpt}</p>
                <div className="card__meta">
                  <span>{LATEST[0].date}</span>
                  <span className="card__meta-sep">·</span>
                  <span>{LATEST[0].read} read</span>
                </div>
              </div>
            </div>
          </div>
          {/* Small article stack */}
          <div className="latest-grid__stack">
            {LATEST.slice(1).map((a) => (
              <div key={a.title} className="latest-grid__small">
                <div className="card__cat">{a.cat}</div>
                <div className="card__title" style={{ fontSize: "0.92rem", marginBottom: "8px", WebkitLineClamp: 2 }}>{a.title}</div>
                <div className="card__meta">
                  <span>{a.date}</span>
                  <span className="card__meta-sep">·</span>
                  <span>{a.read} read</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FEATURED STORY ══════ */}
      <section className="shell ed-section" style={{ paddingTop: "0" }}>
        <div className="feature-story">
          <div className="feature-story__img-wrap">
            <img
              src="https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop"
              alt="Caribbean digital economy"
              className="feature-story__img"
              loading="lazy"
            />
          </div>
          <div className="feature-story__body">
            <div className="feature-story__label">Featured</div>
            <h2 className="feature-story__title">
              The Next Caribbean Digital Economy
            </h2>
            <p className="feature-story__desc">
              How technology, AI, marketing and modern business infrastructure are
              reshaping the region — and the operators building it from inside.
            </p>
            <a href="#" className="feature-story__read">Read Feature →</a>
          </div>
        </div>
      </section>

      {/* ══════ TECHNOLOGY ══════ */}
      <section id="technology" className="shell ed-section">
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// Software · Infrastructure · Platforms</div>
              <h2 className="sec-hd__title">Technology</h2>
              <p className="sec-hd__sub">Digital systems changing how Caribbean businesses operate and compete.</p>
            </div>
            <a href="/technology" className="sec-hd__more">All Technology →</a>
          </div>
        </div>
        <div className="grid-3">
          {TECH_ARTICLES.map((a) => (
            <a key={a.title} href={a.href} className="card" style={{ textDecoration: "none" }}>
              <div className="card__img-wrap">
                <img src={a.img} alt={a.title} className="card__img" loading="lazy" />
              </div>
              <div className="card__body">
                <div className="card__cat">{a.cat}</div>
                <div className="card__title">{a.title}</div>
                <p className="card__excerpt">{a.excerpt}</p>
                <div className="card__meta">
                  <span>{a.date}</span><span className="card__meta-sep">·</span><span>{a.read} read</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══════ MID-CONTENT AD ══════ */}
      <div className="shell" style={{ paddingBottom: "48px" }}>
        <AdSlot slotId="AD-MID-CONTENT" format="billboard" concept={1} />
      </div>

      {/* ══════ MARKETING ══════ */}
      <section id="marketing" className="shell ed-section" style={{ paddingTop: "0" }}>
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// Growth · Brand · Conversion</div>
              <h2 className="sec-hd__title">Marketing & Growth</h2>
              <p className="sec-hd__sub">What separates brands that grow from brands that stall.</p>
            </div>
            <a href="/marketing" className="sec-hd__more">All Marketing →</a>
          </div>
        </div>
        <div className="grid-3">
          {MARKETING_ARTICLES.map((a) => (
            <a key={a.title} href={a.href} className="card" style={{ textDecoration: "none" }}>
              <div className="card__img-wrap">
                <img src={a.img} alt={a.title} className="card__img" loading="lazy" />
              </div>
              <div className="card__body">
                <div className="card__cat">{a.cat}</div>
                <div className="card__title">{a.title}</div>
                <p className="card__excerpt">{a.excerpt}</p>
                <div className="card__meta">
                  <span>{a.date}</span><span className="card__meta-sep">·</span><span>{a.read} read</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══════ FULL-BLEED EDITORIAL BREAK ══════ */}
      <div className="bleed-img">
        <img
          src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&fit=crop"
          alt="Editorial"
          loading="lazy"
        />
        <div className="bleed-img__overlay">
          <div className="bleed-img__copy shell">
            <div className="bleed-img__eyebrow">// The Signal Behind the Systems</div>
            <div className="bleed-img__headline">
              Technology is moving faster than most businesses can respond.
            </div>
            <div className="bleed-img__sub">
              In Today&apos;s World: exists to close that gap. Intelligence, analysis and field notes — every weekday morning.
            </div>
          </div>
        </div>
      </div>

      {/* ══════ AI (DARK SECTION) ══════ */}
      <section id="ai" className="dark-section">
        <div className="shell">
          <div className="sec-hd" style={{ paddingTop: "0" }}>
            <div className="sec-hd__row">
              <div>
                <div className="sec-hd__eyebrow">// Agents · Automation · Implementation</div>
                <h2 className="sec-hd__title">Artificial Intelligence</h2>
                <p className="sec-hd__sub">AI is becoming operational infrastructure. Here&apos;s how to actually use it.</p>
              </div>
              <a href="/ai" className="sec-hd__more">All AI →</a>
            </div>
          </div>
          <div className="grid-3">
            {AI_ARTICLES.map((a) => (
              <a key={a.title} href={a.href} className="card" style={{ textDecoration: "none" }}>
                <div className="card__img-wrap">
                  <img src={a.img} alt={a.title} className="card__img" loading="lazy" />
                </div>
                <div className="card__body">
                  <div className="card__cat">{a.cat}</div>
                  <div className="card__title">{a.title}</div>
                  <p className="card__excerpt">{a.excerpt}</p>
                  <div className="card__meta">
                    <span>{a.date}</span><span className="card__meta-sep" style={{ color: "rgba(255,255,255,0.2)" }}>·</span><span>{a.read} read</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ BUSINESS + FINANCE ══════ */}
      <section id="business" className="shell ed-section">
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// Operations · Systems · Entrepreneurship</div>
              <h2 className="sec-hd__title">Business & Finance</h2>
              <p className="sec-hd__sub">How serious operators build, run and scale their businesses.</p>
            </div>
            <a href="/business" className="sec-hd__more">All Business →</a>
          </div>
        </div>
        <div className="grid-2">
          {[
            { cat: "Business", title: "The System Every Growing Caribbean Business Is Missing", excerpt: "Operations, CRM, marketing, payments — what a complete business infrastructure actually looks like.", date: "Aug 13", read: "6 min", img: "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: "#" },
            { cat: "Finance", title: "What Caribbean Founders Need to Know About Business Finance in 2026", excerpt: "From digital payments to funding pathways — the financial landscape for SMEs is changing.", date: "Aug 8", read: "7 min", img: "https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600&h=380&fit=crop", href: NC_AFFILIATE },
          ].map((a) => (
            <a key={a.title} href={a.href} className="card" style={{ textDecoration: "none" }}>
              <div className="card__img-wrap">
                <img src={a.img} alt={a.title} className="card__img" loading="lazy" />
              </div>
              <div className="card__body">
                <div className="card__cat">{a.cat}</div>
                <div className="card__title" style={{ fontSize: "1.1rem" }}>{a.title}</div>
                <p className="card__excerpt">{a.excerpt}</p>
                <div className="card__meta">
                  <span>{a.date}</span><span className="card__meta-sep">·</span><span>{a.read} read</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══════ CARIBBEAN ══════ */}
      <section id="caribbean" className="shell ed-section" style={{ paddingTop: "0" }}>
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// Jamaica · Caribbean · Regional Markets</div>
              <h2 className="sec-hd__title">Caribbean</h2>
              <p className="sec-hd__sub">A publication watching the Caribbean digital economy from inside it.</p>
            </div>
            <a href="/caribbean" className="sec-hd__more">All Caribbean →</a>
          </div>
        </div>
        <div className="grid-2">
          {CARIBBEAN_ARTICLES.map((a) => (
            <a key={a.title} href={a.href} className="card" style={{ textDecoration: "none" }}>
              <div className="card__img-wrap">
                <img src={a.img} alt={a.title} className="card__img" loading="lazy" />
              </div>
              <div className="card__body">
                <div className="card__cat">{a.cat}</div>
                <div className="card__title" style={{ fontSize: "1.1rem" }}>{a.title}</div>
                <p className="card__excerpt">{a.excerpt}</p>
                <div className="card__meta">
                  <span>{a.date}</span><span className="card__meta-sep">·</span><span>{a.read} read</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ══════ NEW RELEASES ══════ */}
      <section id="releases" className="releases-sec shell ed-section" style={{ paddingTop: "0" }}>
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// Websites · Digital Brands · Platforms</div>
              <h2 className="sec-hd__title">New Releases</h2>
              <p className="sec-hd__sub">The latest platforms and digital brands shipped from the JST studio.</p>
            </div>
            <a href="https://jsupremetech.online/#work" className="sec-hd__more">All Releases →</a>
          </div>
        </div>
        <div className="releases-grid">
          {NEW_RELEASES.map((r) => (
            <a key={r.name} href={r.url} className="release-card" target="_blank" rel="noopener noreferrer">
              <div className="release-card__img-wrap">
                <img src={r.img} alt={r.name} className="release-card__img" loading="lazy" />
                <div className="release-card__type-badge">{r.type}</div>
              </div>
              <div className="release-card__body">
                <div className="release-card__header">
                  <div className="release-card__name">{r.name}</div>
                  <div className="release-card__launched">{r.launched}</div>
                </div>
                <p className="release-card__desc">{r.desc}</p>
                <div className="release-card__tags">
                  {r.tags.map((t) => (
                    <span key={t} className="release-card__tag">{t}</span>
                  ))}
                </div>
                <div className="release-card__cta">
                  <span>View Live Site</span>
                  <span>↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {/* Bottom CTA */}
        <div className="releases-cta">
          <div className="releases-cta__copy">
            <div className="releases-cta__eyebrow">// Ready to launch?</div>
            <div className="releases-cta__headline">Your platform. Your brand. Built by JST.</div>
          </div>
          <a href="https://jsupremetech.online/#contact" className="releases-cta__btn">Start a Project →</a>
        </div>
      </section>

      {/* ══════ AD CAROUSEL ══════ */}
      <div style={{ padding: "0 0 64px" }}>
        <div className="shell--narrow" style={{ padding: "0 0 14px" }}>
          <div style={{ fontFamily: "var(--font-jet)", fontSize: "8.5px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-40)", paddingTop: "48px", borderTop: "1px solid var(--border)" }}>
            // The Marketplace
          </div>
        </div>
        <AdCarousel />
      </div>

      {/* ══════ JST STUDIO ══════ */}
      <section id="studio" className="shell ed-section" style={{ paddingTop: "0" }}>
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// What JST Is Building</div>
              <h2 className="sec-hd__title">Inside the Studio</h2>
              <p className="sec-hd__sub">Platforms shipped, campaigns live, systems built — field notes from inside JST.</p>
            </div>
            <a href="https://jsupremetech.online/#work" className="sec-hd__more">See All Work →</a>
          </div>
        </div>
        <div className="grid-3">
          {STUDIO.map((s) => (
            <div key={s.title} className="card">
              <div className="card__img-wrap">
                <img src={s.img} alt={s.title} className="card__img" loading="lazy" />
              </div>
              <div className="card__body">
                <div className="card__cat">{s.label}</div>
                <div className="card__title">{s.title}</div>
              </div>
            </div>
          ))}
        </div>
        {/* JST CTA block */}
        <div style={{
          marginTop: "1px", padding: "32px", background: "var(--bg-subtle)",
          border: "1px solid var(--border)", borderTop: "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px"
        }}>
          <div>
            <div style={{ fontFamily: "var(--font-jet)", fontSize: "8.5px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: "6px" }}>// Full-Stack Technology & Marketing Partner</div>
            <div style={{ fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--ink)" }}>Need the system behind your growth? We build it.</div>
          </div>
          <a href="https://jsupremetech.online/#contact" style={{
            fontFamily: "var(--font-space)", fontWeight: 700, fontSize: "12px",
            letterSpacing: "0.04em", textTransform: "uppercase",
            padding: "12px 24px", background: "var(--ink)", color: "#fff",
            textDecoration: "none", borderRadius: "2px", whiteSpace: "nowrap"
          }}>Start a Project →</a>
        </div>
      </section>

      {/* ══════ MOST READ ══════ */}
      <div className="shell" style={{ paddingBottom: "64px" }}>
        <div className="most-read">
          <div className="most-read__title">Most Read</div>
          <div className="most-read__list">
            {MOST_READ.map((r, i) => (
              <div key={r.title} className="most-read__row">
                <div className="most-read__num">{String(i + 1).padStart(2, "0")}</div>
                <div>
                  <div className="most-read__title-text">{r.title}</div>
                  <div className="most-read__cat">{r.cat}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ PARTNER PICKS / AFFILIATE ══════ */}
      <section id="partner-picks" className="shell--narrow ed-section" style={{ paddingTop: "0" }}>
        <div className="sec-hd">
          <div className="sec-hd__row">
            <div>
              <div className="sec-hd__eyebrow">// Tools We Use & Recommend</div>
              <h2 className="sec-hd__title">Partner Picks</h2>
              <p className="sec-hd__sub">Vetted tools, platforms and services JST Communications recommends for Caribbean businesses. Some links are affiliate links — we only feature products we&apos;d actually use.</p>
            </div>
          </div>
        </div>
        <div className="affiliate-grid">
          {AFFILIATE_PICKS.map((p) => (
            <a key={p.title} href={p.href} className="affiliate-card" target="_blank" rel="noopener noreferrer">
              <div className="affiliate-card__img-wrap">
                <img src={p.img} alt={p.brand} className="affiliate-card__img" loading="lazy" />
                <div className="affiliate-card__badge">{p.badge}</div>
              </div>
              <div className="affiliate-card__body">
                <div className="affiliate-card__brand-row">
                  <span className="affiliate-card__brand">{p.brand}</span>
                  <span className="affiliate-card__cat">{p.cat}</span>
                </div>
                <div className="affiliate-card__title">{p.title}</div>
                <p className="affiliate-card__desc">{p.desc}</p>
                <div className="affiliate-card__cta">
                  <span>{p.cta}</span>
                  <span className="affiliate-card__arrow">↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="affiliate-disclosure">
          Disclosure: Some links in the Partner Picks section are affiliate links. JST Communications earns a small commission when you purchase through these links, at no extra cost to you. We only feature tools we genuinely recommend.
        </div>
      </section>

      {/* ══════ IN TODAY'S WORLD — NEWSLETTER ══════ */}
      <section id="newsletter" className="shell--narrow" style={{ paddingBottom: "80px" }}>
        <div className="debrief-sec">
          <div className="debrief-sec__left">
            <div className="debrief-mockup">
              <div className="debrief-mockup__bar" />
              <div className="debrief-mockup__meta">Issue #34 · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · J Supreme Tech</div>
              <div className="debrief-mockup__title">In Today&apos;s World:</div>
              <div className="debrief-mockup__tags">
                <span className="debrief-mockup__tag">Technology</span>
                <span className="debrief-mockup__tag">AI</span>
                <span className="debrief-mockup__tag">Caribbean</span>
                <span className="debrief-mockup__tag">Markets</span>
              </div>
              <div className="debrief-mockup__preview">
                Today: AI infrastructure is moving from experiment to operation. Caribbean market adoption lags — but the businesses moving first are seeing real results. Plus: what the new economics of automated marketing mean for SMEs...
              </div>
            </div>
            <div className="debrief-sec__eyebrow">In Today&apos;s World:</div>
            <div className="debrief-sec__title">One clean dispatch, every morning.</div>
            <p className="debrief-sec__sub">Technology, AI, marketing, finance, Caribbean and Jamaica coverage — delivered to your inbox every weekday morning by JST.</p>
            <div className="debrief-perks">
              <div className="debrief-perk">Daily field notes from inside the studio</div>
              <div className="debrief-perk">Free ebooks & resource drops for subscribers</div>
              <div className="debrief-perk">Member-only deals, discounts & early access</div>
              <div className="debrief-perk">First to know on launches, tools & specials</div>
              <div className="debrief-perk">The signal serious Caribbean builders rely on</div>
            </div>
          </div>
          <div className="debrief-sec__right">
            <div style={{ fontFamily: "var(--font-jet)", fontSize: "8.5px", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: "24px" }}>// Subscribe — it&apos;s free</div>
            <DebriefForm />
          </div>
        </div>
      </section>

      {/* ══════ ADVERTISE ══════ */}
      <div className="shell--narrow" style={{ paddingBottom: "80px" }}>
        <div className="advertise-sec">
          <div>
            <div className="advertise-sec__eyebrow">Reach the People Building What&apos;s Next</div>
            <h2 className="advertise-sec__title">Your Brand Belongs Here.</h2>
            <p className="advertise-sec__sub">JST Communications connects brands with founders, business owners, technology professionals, marketers, and Caribbean decision-makers — the audience actively investing in growth.</p>
            <a href="/advertise" className="advertise-sec__cta">View Ad Packages →</a>
          </div>
          <div className="advertise-packages">
            {[
              { name: "Starter", desc: "Basic display placement" },
              { name: "Featured", desc: "Premium homepage placement" },
              { name: "Dominant", desc: "Homepage + article placements" },
              { name: "Sponsored", desc: "Native editorial feature" },
            ].map((p) => (
              <div key={p.name} className="pkg">
                <div className="pkg__name">{p.name}</div>
                <div className="pkg__desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════ FOLLOW THE SIGNAL ══════ */}
      <div className="shell--narrow" style={{ paddingBottom: "80px" }}>
        <div style={{ fontFamily: "var(--font-jet)", fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink-40)", marginBottom: "14px" }}>// Follow the Signal</div>
        <div className="signal-channels">
          <div className="sig-ch">
            <div className="sig-ch__icon-row">
              <div className="sig-ch__ico sig-ch__ico--dc" dangerouslySetInnerHTML={{ __html: DISCORD_SVG }} />
              <div>
                <div className="sig-ch__name">Discord</div>
              </div>
            </div>
            <div className="sig-ch__tag">Community Hub</div>
            <div className="sig-ch__desc">Join daily conversations on tech, marketing, brand and AI with Caribbean builders and operators.</div>
            <a href="#" className="sig-ch__link"><span>Join Discord</span><span>→</span></a>
          </div>
          <div className="sig-ch">
            <div className="sig-ch__icon-row">
              <div className="sig-ch__ico sig-ch__ico--tg" dangerouslySetInnerHTML={{ __html: TELEGRAM_SVG }} />
              <div>
                <div className="sig-ch__name">Telegram</div>
              </div>
            </div>
            <div className="sig-ch__tag">Breaking Signal</div>
            <div className="sig-ch__desc">Fast-moving channel for market intelligence, tool drops and early access notifications.</div>
            <a href="#" className="sig-ch__link"><span>Join Telegram</span><span>→</span></a>
          </div>
          <div className="sig-ch">
            <div className="sig-ch__icon-row">
              <div className="sig-ch__ico sig-ch__ico--wa" dangerouslySetInnerHTML={{ __html: WA_SVG }} />
              <div>
                <div className="sig-ch__name">WhatsApp</div>
              </div>
            </div>
            <div className="sig-ch__tag">Direct Channel</div>
            <div className="sig-ch__desc">Key updates, member specials and direct access — delivered where you already are.</div>
            <a href="#" className="sig-ch__link"><span>Join WhatsApp</span><span>→</span></a>
          </div>
        </div>
      </div>

      {/* ══════ FOOTER ══════ */}
      <footer className="pub-footer">
        <div className="shell">
          <div className="spectrum-bar" style={{ marginBottom: "40px" }} />
          <div className="pub-footer__grid">
            <div>
              <div className="pub-footer__brand-name">J Supreme Tech</div>
              <div className="pub-footer__brand-sub">Communications</div>
              <p className="pub-footer__tagline">
                Intelligence, analysis and field notes on technology, marketing,
                finance, business and the markets shaping the Caribbean — from the
                team building inside them.
              </p>
            </div>
            <div>
              <div className="pub-footer__col-title">Communications</div>
              <div className="pub-footer__links">
                {["Technology", "AI", "Marketing", "Business", "Finance", "Caribbean", "Markets"].map((l) => (
                  <a key={l} href={`/${l.toLowerCase()}`} className="pub-footer__link">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="pub-footer__col-title">J Supreme Tech</div>
              <div className="pub-footer__links">
                {[
                  { label: "Services", href: "https://jsupremetech.online" },
                  { label: "Products", href: "https://jsupremetech.online/products" },
                  { label: "Work", href: "https://jsupremetech.online/#work" },
                  { label: "About", href: "https://jsupremetech.online/about" },
                  { label: "Contact", href: "https://jsupremetech.online/#contact" },
                  { label: "Advertise", href: "/advertise" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="pub-footer__link">{l.label}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="pub-footer__col-title">Subscribe</div>
              <div className="pub-footer__links">
                {[
                  { label: "In Today's World: (Email)", href: "#newsletter" },
                  { label: "WhatsApp Channel", href: "#newsletter" },
                  { label: "Telegram Signal", href: "#newsletter" },
                  { label: "Discord Community", href: "#newsletter" },
                ].map((l) => (
                  <a key={l.label} href={l.href} className="pub-footer__link">{l.label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="pub-footer__bottom">
            <div className="pub-footer__copy">© 2026 J Supreme Tech. All rights reserved.</div>
            <div className="pub-footer__legal">
              <a href="/privacy" className="pub-footer__legal-link">Privacy</a>
              <a href="/terms" className="pub-footer__legal-link">Terms</a>
              <a href="/advertise" className="pub-footer__legal-link">Advertise</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
