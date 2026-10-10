"use client";

import { useMemo, useRef, useState, useTransition, type CSSProperties } from "react";
import { toPng } from "html-to-image";
import {
  ArrowLeft,
  Copy,
  Download,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCanvas } from "@/components/studio/template-canvas";
import type { StudioTemplate, StudioLayout, StudioMock } from "@/lib/studio/types";
import { RATIOS, ratioDims } from "@/lib/studio/types";
import {
  deleteTemplate,
  listSavedTemplates,
  saveTemplate,
} from "@/app/(app)/studio/actions";

const clone = (t: StudioTemplate): StudioTemplate => JSON.parse(JSON.stringify(t));
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 40) || "template";

function ScaledCanvas({
  template,
  width,
  stageWrapRef,
}: {
  template: StudioTemplate;
  width: number;
  stageWrapRef?: React.Ref<HTMLDivElement>;
}) {
  const { w, h } = ratioDims(template.ratio);
  const scale = width / w;
  return (
    <div
      style={{
        width,
        height: h * scale,
        overflow: "hidden",
        borderRadius: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        flexShrink: 0,
      }}
    >
      <div ref={stageWrapRef} style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <TemplateCanvas template={template} />
      </div>
    </div>
  );
}

const PALETTES: Record<string, Partial<StudioTemplate["fields"]>> = {
  Dark: { bg: "#0B0B0C", ink: "#FFFFFF", muted: "#9A9AA2" },
  Light: { bg: "#F5F5F3", ink: "#0B0B0C", muted: "#5C5C63" },
  Ink: { bg: "#10131A", ink: "#FFFFFF", muted: "#8A93A6" },
  Cream: { bg: "#FBF7F0", ink: "#16130F", muted: "#6B6258" },
};

const BLANK: StudioTemplate = {
  id: "new",
  key: "custom",
  name: "New template",
  category: "service-ad",
  layout: "feature",
  ratio: "1080x1080",
  isBuiltin: false,
  fields: {
    bg: "#F5F5F3",
    ink: "#0B0B0C",
    muted: "#5C5C63",
    accent: "#2D6BFF",
    accent2: "#7C5CFF",
    brand: "J SUPREME TECH",
    eyebrow: "SERVICE",
    headline: "Your headline here.",
    subhead: "A short supporting line that sells the outcome.",
    bullets: ["First benefit", "Second benefit", "Third benefit"],
    ctaLabel: "Get started",
    contact: "(658) 218-2282 · global.jsuprememarketing@gmail.com",
    badge: "New",
    mock: "browser",
  },
};

export function StudioClient({
  seeds,
  saved: savedInitial,
  operator,
}: {
  seeds: StudioTemplate[];
  saved: StudioTemplate[];
  operator?: string | null;
}) {
  const [saved, setSaved] = useState<StudioTemplate[]>(savedInitial);
  const [draft, setDraft] = useState<StudioTemplate | null>(null);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [pending, startTransition] = useTransition();
  const previewRef = useRef<HTMLDivElement>(null);

  const editing = draft !== null;

  function open(t: StudioTemplate) {
    setStatus(null);
    setDraft(clone(t));
  }

  function setField<K extends keyof StudioTemplate["fields"]>(key: K, value: StudioTemplate["fields"][K]) {
    setDraft((d) => (d ? { ...d, fields: { ...d.fields, [key]: value } } : d));
  }
  function setTop<K extends keyof StudioTemplate>(key: K, value: StudioTemplate[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }
  function applyPalette(name: string) {
    setDraft((d) => (d ? { ...d, fields: { ...d.fields, ...PALETTES[name] } } : d));
  }

  async function refreshSaved() {
    const next = await listSavedTemplates();
    setSaved(next);
  }

  async function doExport() {
    const stage = previewRef.current?.querySelector<HTMLElement>("[data-studio-stage]");
    if (!stage || !draft) return;
    setExporting(true);
    setStatus(null);
    try {
      // Skip web-font embedding: it needs network access to the font CDN (which
      // can hang) and the rasterized SVG can't use page-loaded web fonts anyway.
      // OS-installed fonts (Montserrat → Segoe UI fallback) still render, so the
      // preview and the exported PNG stay visually consistent — and offline.
      const dataUrl = await Promise.race([
        toPng(stage, { pixelRatio: 2, cacheBust: true, skipFonts: true }),
        new Promise<string>((_, reject) =>
          setTimeout(() => reject(new Error("Export timed out — try again or pick a smaller format.")), 20000),
        ),
      ]);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `jst-${slug(draft.name)}-${draft.ratio}.png`;
      a.click();
      setStatus({ kind: "ok", msg: "PNG exported to your Downloads (2160px wide)." });
    } catch (e) {
      setStatus({ kind: "err", msg: e instanceof Error ? e.message : "Export failed." });
    } finally {
      setExporting(false);
    }
  }

  function persist(asCopy: boolean) {
    if (!draft) return;
    const useId = !asCopy && !draft.isBuiltin ? draft.id : undefined;
    startTransition(async () => {
      const res = await saveTemplate({
        id: useId,
        key: draft.isBuiltin ? draft.key : slug(draft.name),
        name: draft.name,
        category: draft.category,
        layout: draft.layout,
        ratio: draft.ratio,
        fields: draft.fields,
        owner: operator ?? null,
      });
      if (!res.ok) {
        setStatus({ kind: "err", msg: res.error ?? "Save failed." });
        return;
      }
      if (res.id) setDraft((d) => (d ? { ...d, id: res.id!, isBuiltin: false } : d));
      await refreshSaved();
      setStatus({ kind: "ok", msg: asCopy ? "Saved as a new template." : "Template saved." });
    });
  }

  function remove() {
    if (!draft || draft.isBuiltin) return;
    startTransition(async () => {
      const res = await deleteTemplate(draft.id);
      if (!res.ok) {
        setStatus({ kind: "err", msg: res.error ?? "Delete failed." });
        return;
      }
      await refreshSaved();
      setDraft(null);
      setStatus({ kind: "ok", msg: "Template deleted." });
    });
  }

  if (!editing) {
    return (
      <Gallery
        seeds={seeds}
        saved={saved}
        onOpen={open}
        onBlank={() => open(BLANK)}
      />
    );
  }

  const d = draft!;
  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => setDraft(null)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to gallery
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={doExport} disabled={exporting} className="gap-1.5">
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export PNG
          </Button>
          {d.isBuiltin ? (
            <Button size="sm" onClick={() => persist(false)} disabled={pending} className="gap-1.5">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save to my templates
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={() => persist(false)} disabled={pending} className="gap-1.5">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Update
              </Button>
              <Button size="sm" variant="outline" onClick={() => persist(true)} disabled={pending} className="gap-1.5">
                <Copy className="h-4 w-4" /> Save as copy
              </Button>
              <Button size="sm" variant="ghost" onClick={remove} disabled={pending} className="gap-1.5 text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {status ? (
        <p
          className={`rounded-md border p-2 text-xs ${
            status.kind === "ok"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {status.msg}
        </p>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-[460px_1fr]">
        {/* Live preview */}
        <div className="lg:sticky lg:top-4 self-start">
          <div ref={previewRef} className="flex justify-center rounded-2xl border border-border/60 bg-muted/20 p-4">
            <ScaledCanvas template={d} width={Math.min(420, ratioDims(d.ratio).w)} />
          </div>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            {RATIOS[d.ratio]?.label ?? d.ratio} · live preview · exports at 2× ({ratioDims(d.ratio).w * 2}px)
          </p>
        </div>

        {/* Smart fields */}
        <div className="space-y-5">
          <Section title="Content">
            <Text label="Template name" value={d.name} onChange={(v) => setTop("name", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Format"
                value={d.ratio}
                options={Object.keys(RATIOS).map((r) => [r, RATIOS[r].label])}
                onChange={(v) => setTop("ratio", v)}
              />
              <Select
                label="Layout"
                value={d.layout}
                options={[
                  ["hero", "Hero"],
                  ["feature", "Feature / vertical"],
                  ["cta", "Call to action"],
                ]}
                onChange={(v) => setTop("layout", v as StudioLayout)}
              />
            </div>
            <Text label="Eyebrow" value={d.fields.eyebrow ?? ""} onChange={(v) => setField("eyebrow", v)} />
            <Area label="Headline" value={d.fields.headline ?? ""} onChange={(v) => setField("headline", v)} rows={2} />
            <Area label="Subhead" value={d.fields.subhead ?? ""} onChange={(v) => setField("subhead", v)} rows={2} />
            <Area
              label="Bullets / common uses (one per line)"
              value={(d.fields.bullets ?? []).join("\n")}
              onChange={(v) => setField("bullets", v.split("\n"))}
              rows={4}
            />
            <div className="grid grid-cols-2 gap-3">
              <Text label="CTA button" value={d.fields.ctaLabel ?? ""} onChange={(v) => setField("ctaLabel", v)} />
              <Text label="Badge" value={d.fields.badge ?? ""} onChange={(v) => setField("badge", v)} />
            </div>
            <Text label="Contact line" value={d.fields.contact ?? ""} onChange={(v) => setField("contact", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Text label="Brand wordmark" value={d.fields.brand ?? ""} onChange={(v) => setField("brand", v)} />
              <Select
                label="Product mockup"
                value={d.fields.mock ?? "none"}
                options={[
                  ["none", "None"],
                  ["browser", "Website / browser"],
                  ["dashboard", "CRM dashboard"],
                  ["store", "Ecommerce store"],
                  ["courier", "Courier tracking"],
                  ["phoneChat", "AI chat (phone)"],
                ]}
                onChange={(v) => setField("mock", v as StudioMock)}
              />
            </div>
          </Section>

          <Section title="Theme">
            <div className="flex flex-wrap gap-2">
              {Object.keys(PALETTES).map((p) => (
                <Button key={p} size="sm" variant="outline" className="gap-1.5" onClick={() => applyPalette(p)}>
                  <Wand2 className="h-3.5 w-3.5" /> {p}
                </Button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Color label="Background" value={d.fields.bg ?? "#0B0B0C"} onChange={(v) => setField("bg", v)} />
              <Color label="Text" value={d.fields.ink ?? "#FFFFFF"} onChange={(v) => setField("ink", v)} />
              <Color label="Muted" value={d.fields.muted ?? "#9A9AA2"} onChange={(v) => setField("muted", v)} />
              <Color label="Accent" value={d.fields.accent ?? "#2D6BFF"} onChange={(v) => setField("accent", v)} />
              <Color label="Accent 2" value={d.fields.accent2 ?? "#7C5CFF"} onChange={(v) => setField("accent2", v)} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Gallery({
  seeds,
  saved,
  onOpen,
  onBlank,
}: {
  seeds: StudioTemplate[];
  saved: StudioTemplate[];
  onOpen: (t: StudioTemplate) => void;
  onBlank: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <Sparkles className="h-5 w-5 text-primary" /> Creative Studio
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Pick a template, edit the copy and colors with live preview, then export a post or save
            your own version. These promote the builds you sell — websites, CRMs, back-offices & AI.
          </p>
        </div>
        <Button onClick={onBlank} className="gap-1.5">
          <Plus className="h-4 w-4" /> New blank
        </Button>
      </div>

      <GallerySection title="Starter templates" subtitle="J Supreme Tech offer set — fully editable" items={seeds} onOpen={onOpen} />

      {saved.length > 0 ? (
        <GallerySection title="My templates" subtitle="Saved in your CRM" items={saved} onOpen={onOpen} />
      ) : null}
    </div>
  );
}

function GallerySection({
  title,
  subtitle,
  items,
  onOpen,
}: {
  title: string;
  subtitle: string;
  items: StudioTemplate[];
  onOpen: (t: StudioTemplate) => void;
}) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => onOpen(t)}
            className="group flex flex-col gap-2 rounded-xl border border-border/60 bg-card/40 p-3 text-left transition hover:border-primary/40 hover:bg-card"
          >
            <div className="flex justify-center overflow-hidden rounded-lg bg-muted/30">
              <ScaledCanvas template={t} width={300} />
            </div>
            <div className="flex items-center justify-between gap-2 px-0.5">
              <span className="truncate text-sm font-medium">{t.name}</span>
              <span className="shrink-0 rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                {RATIOS[t.ratio]?.label.split(" · ")[0] ?? t.ratio}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- field primitives ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-card/40 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-border/70 bg-background px-3 py-2 text-sm outline-none focus:border-primary";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Labeled label={label}>
      <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
    </Labeled>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <Labeled label={label}>
      <textarea className={`${inputCls} resize-y leading-snug`} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </Labeled>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <Labeled label={label}>
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </Labeled>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const swatch: CSSProperties = { width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", padding: 0, background: "none" };
  return (
    <Labeled label={label}>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} style={swatch} aria-label={label} />
        <input className={`${inputCls} font-mono text-xs`} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Labeled>
  );
}
