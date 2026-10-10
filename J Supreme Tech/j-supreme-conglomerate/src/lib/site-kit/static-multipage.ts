import type JSZip from "jszip";
import type { SiteKitInput } from "./types";
import { escapeHtml } from "./types";

function navLinks() {
  return `<a href="index.html" class="nav-link text-sm font-medium text-slate-300 hover:text-white transition">Home</a>
          <a href="about.html" class="nav-link text-sm font-medium text-slate-300 hover:text-white transition">About</a>
          <a href="contact.html" class="nav-link text-sm font-medium text-slate-300 hover:text-white transition">Contact</a>`;
}

function shell(
  input: SiteKitInput,
  opts: { title: string; main: string },
): string {
  const brand = escapeHtml(input.projectName.trim() || "Your brand");
  const tag = escapeHtml(input.tagline?.trim() ?? "Premium digital presence");
  const color = (input.primaryColor?.trim() || "#38bdf8").replace(/[^#0-9a-fA-F]/g, "") || "#38bdf8";
  const logo = input.logoUrl?.trim();

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark" style="--brand:${color}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="${escapeHtml((input.description ?? tag).slice(0, 160))}" />
  <title>${escapeHtml(opts.title)} — ${brand}</title>
  <link rel="icon" href="favicon.svg" type="image/svg+xml" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: "var(--brand)",
          },
        },
      },
    };
  </script>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-brand/30">
  <header class="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
      <a href="index.html" class="flex items-center gap-3">
        ${
          logo
            ? `<img src="${escapeHtml(logo)}" alt="" class="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />`
            : `<span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-cyan-600 text-sm font-bold text-white">${brand.slice(0, 1).toUpperCase()}</span>`
        }
        <div>
          <p class="text-sm font-semibold tracking-tight">${brand}</p>
          <p class="text-xs text-slate-400">${tag}</p>
        </div>
      </a>
      <nav class="hidden items-center gap-8 md:flex" id="desktop-nav">
        ${navLinks()}
      </nav>
      <button type="button" class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 md:hidden" aria-label="Open menu" data-mobile-open>
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
    <div class="hidden border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden" id="mobile-drawer">
      <nav class="flex flex-col gap-3">${navLinks()}</nav>
    </div>
  </header>
  <main>
    ${opts.main}
  </main>
  <footer class="mt-24 border-t border-white/10 bg-slate-950 py-12">
    <div class="mx-auto max-w-6xl px-4 text-center text-xs text-slate-500">
      <p>&copy; ${new Date().getFullYear()} ${brand}. HTML5 · ES modules · Tailwind · SVG · sitemap.xml · robots.txt</p>
    </div>
  </footer>
  <script type="module" src="js/main.js"></script>
</body>
</html>`;
}

/** UTF-8 text files for the static multipage kit (ZIP and Vercel upload). */
export function buildStaticMultipageFiles(input: SiteKitInput, slug: string): Record<string, string> {
  const baseUrl = (input.baseUrl?.trim() || `https://${slug}.example.com`).replace(/\/$/, "");
  const brand = input.projectName.trim() || "Your brand";
  const desc = input.description?.trim() || "We help teams ship memorable products.";
  const email = input.contactEmail?.trim() || "hello@example.com";

  const homeMain = `
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/20 via-slate-950 to-slate-950"></div>
    <div class="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
      <p class="reveal mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand">Digital flagship</p>
      <h1 class="reveal text-4xl font-semibold tracking-tight md:text-6xl">${escapeHtml(brand)}</h1>
      <p class="reveal mt-6 max-w-2xl text-lg text-slate-300 delay-100">${escapeHtml(input.tagline ?? "Clarity, craft, and conversion — without the clutter.")}</p>
      <div class="reveal mt-10 flex flex-wrap gap-4 delay-200">
        <button type="button" data-open-modal class="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand/25 transition hover:brightness-110">Book a call</button>
        <a href="about.html" class="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white hover:bg-white/5">Our story</a>
      </div>
    </div>
  </section>
  <section class="mx-auto max-w-6xl px-4 py-20">
    <div class="grid gap-12 md:grid-cols-3">
      <div class="reveal rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 class="text-lg font-semibold">Strategy</h2>
        <p class="mt-2 text-sm text-slate-400">Positioning, messaging, and IA shaped around your buyer.</p>
      </div>
      <div class="reveal rounded-2xl border border-white/10 bg-white/5 p-6 delay-100">
        <h2 class="text-lg font-semibold">Design</h2>
        <p class="mt-2 text-sm text-slate-400">Premium UI systems, motion, and responsive Tailwind layouts.</p>
      </div>
      <div class="reveal rounded-2xl border border-white/10 bg-white/5 p-6 delay-200">
        <h2 class="text-lg font-semibold">Build</h2>
        <p class="mt-2 text-sm text-slate-400">Static sites, React apps, and Vercel-ready configs.</p>
      </div>
    </div>
  </section>
  <section class="border-y border-white/10 bg-slate-900/40 py-20">
    <div class="mx-auto max-w-3xl px-4">
      <h2 class="text-center text-2xl font-semibold">FAQ</h2>
      <dl class="mt-8 space-y-3" data-faq>
        <div class="rounded-xl border border-white/10 bg-slate-950/60">
          <dt><button type="button" class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium" data-faq-trigger>What do you deliver?<span class="text-brand">+</span></button></dt>
          <dd class="hidden px-4 pb-3 text-sm text-slate-400" data-faq-panel>Multi-page sites or React apps, assets, and deployment configs — tuned from client intake.</dd>
        </div>
        <div class="rounded-xl border border-white/10 bg-slate-950/60">
          <dt><button type="button" class="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium" data-faq-trigger>Can we use our own logo?<span class="text-brand">+</span></button></dt>
          <dd class="hidden px-4 pb-3 text-sm text-slate-400" data-faq-panel>Yes — replace favicon.svg and set your logo URL in this template.</dd>
        </div>
      </dl>
    </div>
  </section>
  <div class="fixed inset-0 z-50 hidden items-center justify-center bg-black/70 p-4 backdrop-blur-sm" data-modal-root aria-hidden="true">
    <div class="max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl" role="dialog" aria-modal="true">
      <h3 class="text-lg font-semibold">Let’s talk</h3>
      <p class="mt-2 text-sm text-slate-400">Reach us at <a class="text-brand underline" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <button type="button" class="mt-6 w-full rounded-lg border border-white/10 py-2 text-sm hover:bg-white/5" data-close-modal>Close</button>
    </div>
  </div>`;

  const aboutMain = `
  <section class="mx-auto max-w-3xl px-4 py-20">
    <h1 class="text-3xl font-semibold">About ${escapeHtml(brand)}</h1>
    <p class="reveal mt-6 whitespace-pre-wrap text-slate-300">${escapeHtml(desc)}</p>
  </section>`;

  const contactMain = `
  <section class="mx-auto max-w-3xl px-4 py-20">
    <h1 class="text-3xl font-semibold">Contact</h1>
    <p class="mt-6 text-slate-300">Email: <a class="text-brand underline" href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
  </section>`;

  const mainJs = `const qs = (s, r = document) => r.querySelector(s);
const qsa = (s, r = document) => [...r.querySelectorAll(s)];

const drawer = qs("#mobile-drawer");
const openBtn = qs("[data-mobile-open]");
openBtn?.addEventListener("click", () => {
  drawer?.classList.toggle("hidden");
  const open = !drawer?.classList.contains("hidden");
  openBtn.setAttribute("aria-expanded", String(open));
});

const modalRoot = qs("[data-modal-root]");
const openModal = qs("[data-open-modal]");
const closeModal = qs("[data-close-modal]");
const openM = () => { modalRoot?.classList.remove("hidden"); modalRoot?.classList.add("flex"); modalRoot?.setAttribute("aria-hidden", "false"); };
const shutM = () => { modalRoot?.classList.add("hidden"); modalRoot?.classList.remove("flex"); modalRoot?.setAttribute("aria-hidden", "true"); };
openModal?.addEventListener("click", openM);
closeModal?.addEventListener("click", shutM);
modalRoot?.addEventListener("click", (e) => { if (e.target === modalRoot) shutM(); });

const io = new IntersectionObserver((ents) => {
  for (const e of ents) {
    if (e.isIntersecting) {
      e.target.classList.add("opacity-100", "translate-y-0");
      e.target.classList.remove("opacity-0", "translate-y-6");
    }
  }
}, { threshold: 0.12 });
qsa(".reveal").forEach((el) => {
  el.classList.add("translate-y-6", "opacity-0", "transition", "duration-700");
  io.observe(el);
});

qsa("[data-faq-trigger]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wrap = btn.closest("div.rounded-xl");
    const panel = wrap?.querySelector("[data-faq-panel]");
    const nowOpen = panel?.classList.toggle("hidden") === false;
    const mark = btn.querySelector("span:last-child");
    if (mark) mark.textContent = nowOpen ? "−" : "+";
  });
});

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href")?.slice(1);
    const t = id && document.getElementById(id);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
  });
});
`;

  const initial = (brand[0] || "B").toUpperCase();

  return {
    "index.html": shell(input, { title: "Home", main: homeMain }),
    "about.html": shell(input, { title: "About", main: aboutMain }),
    "contact.html": shell(input, { title: "Contact", main: contactMain }),
    "js/main.js": mainJs,
    "favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${input.primaryColor?.trim() || "#38bdf8"}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="42" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="28" font-weight="700">${initial}</text></svg>`,
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/index.html</loc><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/about.html</loc><changefreq>monthly</changefreq></url>
  <url><loc>${baseUrl}/contact.html</loc><changefreq>monthly</changefreq></url>
</urlset>
`,
    "robots.txt": `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`,
    "package.json": JSON.stringify(
      {
        name: `${slug}-static-site`,
        private: true,
        description: "Multi-page HTML + ESM + Tailwind CDN starter",
        scripts: { dev: "npx --yes serve .", start: "npx --yes serve ." },
      },
      null,
      2,
    ),
    "vercel.json": JSON.stringify({ trailingSlash: false }, null, 2),
  };
}

export function appendStaticMultipageSite(zip: JSZip, input: SiteKitInput, slug: string): void {
  const files = buildStaticMultipageFiles(input, slug);
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
}
