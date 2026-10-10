import type JSZip from "jszip";
import type { SiteKitInput } from "./types";
import { escapeHtml } from "./types";

export function appendReactViteApp(zip: JSZip, input: SiteKitInput, slug: string): void {
  const baseUrl = (input.baseUrl?.trim() || `https://${slug}.example.com`).replace(/\/$/, "");
  const brand = input.projectName.trim() || "Your brand";
  const brandHtml = escapeHtml(brand);
  const BRAND = JSON.stringify(brand);
  const TAG = JSON.stringify(input.tagline?.trim() ?? "Premium digital presence");
  const DESC = JSON.stringify(input.description?.trim() || "We help teams ship memorable products.");
  const EMAIL = JSON.stringify(input.contactEmail?.trim() || "hello@example.com");
  const LOGO_RAW = input.logoUrl?.trim() || "";
  const LOGO = LOGO_RAW ? JSON.stringify(LOGO_RAW) : "null";
  const color = (input.primaryColor?.trim() || "#38bdf8").replace(/[^#0-9a-fA-F]/g, "") || "#38bdf8";
  const initial = (input.projectName.trim()[0] || "B").toUpperCase();

  zip.file(
    "package.json",
    JSON.stringify(
      {
        name: `${slug}-react-app`,
        private: true,
        type: "module",
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview",
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
        },
        devDependencies: {
          "@types/react": "^19.0.12",
          "@types/react-dom": "^19.0.4",
          "@vitejs/plugin-react": "^4.3.4",
          autoprefixer: "^10.4.21",
          postcss: "^8.5.3",
          tailwindcss: "^3.4.17",
          typescript: "^5.8.2",
          vite: "^6.0.3",
        },
      },
      null,
      2,
    ),
  );

  zip.file(
    "tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          useDefineForClassFields: true,
          lib: ["ES2022", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
        },
        include: ["src"],
      },
      null,
      2,
    ),
  );

  zip.file(
    "tsconfig.node.json",
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["ES2023"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
        },
        include: ["vite.config.ts"],
      },
      null,
      2,
    ),
  );

  zip.file(
    "vite.config.ts",
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
`,
  );

  zip.file(
    "tailwind.config.js",
    `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { brand: "${color}" },
    },
  },
  plugins: [],
};
`,
  );

  zip.file(
    "postcss.config.js",
    `export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
`,
  );

  zip.file(
    "index.html",
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${brandHtml}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
  );

  zip.file("src/vite-env.d.ts", "/// <reference types=\"vite/client\" />\n");

  zip.file(
    "src/index.css",
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  );

  zip.file(
    "src/main.tsx",
    `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`,
  );

  zip.file(
    "src/App.tsx",
    `import { useEffect, useRef, useState } from "react";

const BRAND = ${BRAND};
const TAG = ${TAG};
const DESC = ${DESC};
const EMAIL = ${EMAIL};
const LOGO: string | null = ${LOGO};

export default function App() {
  const [openMenu, setOpenMenu] = useState(false);
  const [modal, setModal] = useState(false);
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});

  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (ents) => {
        for (const e of ents) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("opacity-100", "translate-y-0");
            (e.target as HTMLElement).classList.remove("opacity-0", "translate-y-6");
          }
        }
      },
      { threshold: 0.12 },
    );
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const addReveal = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            {LOGO ? (
              <img src={LOGO} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-cyan-600 text-sm font-bold text-white">
                {BRAND.slice(0, 1)}
              </span>
            )}
            <div>
              <p className="text-sm font-semibold tracking-tight">{BRAND}</p>
              <p className="text-xs text-slate-400">{TAG}</p>
            </div>
          </div>
          <nav className="hidden gap-8 md:flex">
            <a href="#top" className="text-sm text-slate-300 hover:text-white">Home</a>
            <a href="#about" className="text-sm text-slate-300 hover:text-white">About</a>
            <a href="#faq" className="text-sm text-slate-300 hover:text-white">FAQ</a>
          </nav>
          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 md:hidden"
            aria-label="Menu"
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </button>
        </div>
        {openMenu ? (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-2">
              <a href="#top" className="text-sm" onClick={() => setOpenMenu(false)}>Home</a>
              <a href="#about" className="text-sm" onClick={() => setOpenMenu(false)}>About</a>
              <a href="#faq" className="text-sm" onClick={() => setOpenMenu(false)}>FAQ</a>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="top">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/20 via-slate-950 to-slate-950" />
          <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
            <div ref={addReveal} className="translate-y-6 opacity-0 transition duration-700">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-brand">React + Vite + Tailwind</p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">{BRAND}</h1>
              <p className="mt-6 max-w-2xl text-lg text-slate-300">{TAG}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button type="button" className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-brand/25" onClick={() => setModal(true)}>
                  Book a call
                </button>
                <a href="#about" className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium hover:bg-white/5">About</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-3xl scroll-mt-24 px-4 py-20">
          <div ref={addReveal} className="translate-y-6 opacity-0 transition duration-700">
            <h2 className="text-2xl font-semibold">About</h2>
            <p className="mt-4 whitespace-pre-wrap text-slate-300">{DESC}</p>
          </div>
        </section>

        <section id="faq" className="border-y border-white/10 bg-slate-900/40 py-20 scroll-mt-24">
          <div className="mx-auto max-w-3xl px-4">
            <h2 className="text-center text-2xl font-semibold">FAQ</h2>
            <dl className="mt-8 space-y-2">
              {["What ships in this kit?", "How do we deploy?"].map((q, i) => (
                <div key={q} className="rounded-xl border border-white/10 bg-slate-950/60">
                  <dt>
                    <button type="button" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium" onClick={() => setFaqOpen((p) => ({ ...p, [i]: !p[i] }))}>
                      {q}
                      <span className="text-brand">{faqOpen[i] ? "−" : "+"}</span>
                    </button>
                  </dt>
                  {faqOpen[i] ? (
                    <dd className="px-4 pb-3 text-sm text-slate-400">
                      {i === 0
                        ? "A React ES module app with Tailwind, SEO files in /public, and Vercel config."
                        : "Connect the folder to Vercel; build command npm run build, output dist."}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-center text-xs text-slate-500">
        © \${new Date().getFullYear()} {BRAND} · React · TypeScript · Tailwind · SVG · XML sitemap
      </footer>

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={() => setModal(false)} role="presentation">
          <div className="max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()} role="dialog">
            <h3 className="text-lg font-semibold">Let’s talk</h3>
            <p className="mt-2 text-sm text-slate-400">
              <a className="text-brand underline" href={"mailto:" + EMAIL}>{EMAIL}</a>
            </p>
            <button type="button" className="mt-6 w-full rounded-lg border border-white/10 py-2 text-sm hover:bg-white/5" onClick={() => setModal(false)}>Close</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
`,
  );

  zip.file(
    "public/favicon.svg",
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><text x="32" y="42" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="28" font-weight="700">${initial}</text></svg>`,
  );

  zip.file(
    "public/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><changefreq>weekly</changefreq></url>
</urlset>
`,
  );

  zip.file(
    "public/robots.txt",
    `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`,
  );

  zip.file(
    "vercel.json",
    JSON.stringify({ buildCommand: "npm run build", outputDirectory: "dist", framework: "vite" }, null, 2),
  );

  zip.file(
    ".gitignore",
    `node_modules
dist
.DS_Store
*.local
`,
  );
}
