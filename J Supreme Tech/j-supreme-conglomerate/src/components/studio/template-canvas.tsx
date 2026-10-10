import type { CSSProperties } from "react";
import type { StudioTemplate, StudioFields } from "@/lib/studio/types";
import { ratioDims } from "@/lib/studio/types";
import { StudioMockView } from "@/components/studio/mocks";

const HEAD = '"Montserrat", "Segoe UI", system-ui, -apple-system, sans-serif';
const BODY = '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif';

function tokens(f: StudioFields) {
  return {
    bg: f.bg ?? "#0B0B0C",
    ink: f.ink ?? "#FFFFFF",
    muted: f.muted ?? "#9A9AA2",
    accent: f.accent ?? "#2D6BFF",
    accent2: f.accent2 ?? "#7C5CFF",
    brand: f.brand ?? "J SUPREME TECH",
  };
}

function Wordmark({ brand, accent, ink }: { brand: string; accent: string; ink: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          background: accent,
          display: "inline-block",
          boxShadow: `0 0 0 6px ${accent}22`,
        }}
      />
      <span
        style={{
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 2,
          color: ink,
        }}
      >
        {brand}
      </span>
    </div>
  );
}

function Badge({ text, accent, ink }: { text?: string; accent: string; ink: string }) {
  if (!text) return null;
  return (
    <span
      style={{
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: 20,
        color: ink,
        border: `2px solid ${accent}`,
        borderRadius: 999,
        padding: "8px 20px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 11, height: 11, borderRadius: 999, background: accent }} />
      {text}
    </span>
  );
}

function CtaPill({ label, accent, accent2 }: { label?: string; accent: string; accent2: string }) {
  if (!label) return null;
  return (
    <span
      style={{
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: 30,
        color: "#fff",
        background: `linear-gradient(135deg, ${accent}, ${accent2})`,
        borderRadius: 16,
        padding: "20px 38px",
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        boxShadow: `0 18px 40px ${accent}44`,
      }}
    >
      {label}
      <span style={{ fontSize: 30, lineHeight: 1 }}>→</span>
    </span>
  );
}

function Contact({ text, muted }: { text?: string; muted: string }) {
  if (!text) return null;
  return (
    <div style={{ fontFamily: BODY, fontSize: 21, color: muted, letterSpacing: 0.3 }}>{text}</div>
  );
}

function Bullets({ items, ink, accent }: { items: string[]; ink: string; accent: string }) {
  const list = (items ?? []).filter((s) => s && s.trim());
  if (!list.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {list.map((b, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: `${accent}1f`,
              color: accent,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            ✓
          </span>
          <span style={{ fontFamily: BODY, fontSize: 26, color: ink, fontWeight: 500 }}>{b}</span>
        </div>
      ))}
    </div>
  );
}

function Pills({ items, ink, accent }: { items: string[]; ink: string; accent: string }) {
  const list = (items ?? []).filter((s) => s && s.trim());
  if (!list.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {list.map((b, i) => (
        <span
          key={i}
          style={{
            fontFamily: BODY,
            fontSize: 22,
            fontWeight: 600,
            color: ink,
            border: `1.5px solid ${accent}55`,
            background: `${accent}12`,
            borderRadius: 999,
            padding: "10px 22px",
          }}
        >
          {b}
        </span>
      ))}
    </div>
  );
}

function HeroLayout({ t }: { t: StudioTemplate }) {
  const f = t.fields;
  const c = tokens(f);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark brand={c.brand} accent={c.accent} ink={c.ink} />
        <Badge text={f.badge} accent={c.accent} ink={c.ink} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26, marginTop: 8 }}>
        {f.eyebrow ? (
          <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: c.accent }}>
            {f.eyebrow}
          </span>
        ) : null}
        <h1
          style={{
            fontFamily: HEAD,
            fontWeight: 800,
            fontSize: 82,
            lineHeight: 1.02,
            letterSpacing: -1.5,
            color: c.ink,
            margin: 0,
            maxWidth: "94%",
          }}
        >
          {f.headline}
        </h1>
        {f.subhead ? (
          <p style={{ fontFamily: BODY, fontSize: 30, lineHeight: 1.4, color: c.muted, margin: 0, maxWidth: "82%" }}>
            {f.subhead}
          </p>
        ) : null}
        <Pills items={f.bullets ?? []} ink={c.ink} accent={c.accent} />
      </div>

      <div style={{ flex: 1, position: "relative", minHeight: 40 }}>
        {f.mock && f.mock !== "none" ? (
          <div style={{ position: "absolute", right: -8, bottom: 8, width: "62%", height: "94%" }}>
            <StudioMockView kind={f.mock} accent={c.accent} accent2={c.accent2} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, bottom: 14 }}>
          <CtaPill label={f.ctaLabel} accent={c.accent} accent2={c.accent2} />
        </div>
      </div>

      <Contact text={f.contact} muted={c.muted} />
    </>
  );
}

function FeatureLayout({ t }: { t: StudioTemplate }) {
  const f = t.fields;
  const c = tokens(f);
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark brand={c.brand} accent={c.accent} ink={c.ink} />
        <Badge text={f.badge} accent={c.accent} ink={c.ink} />
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 44, marginTop: 12 }}>
        <div style={{ flex: 1.05, display: "flex", flexDirection: "column", gap: 24 }}>
          {f.eyebrow ? (
            <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: 21, letterSpacing: 3.5, color: c.accent }}>
              {f.eyebrow}
            </span>
          ) : null}
          <h1
            style={{
              fontFamily: HEAD,
              fontWeight: 800,
              fontSize: 60,
              lineHeight: 1.04,
              letterSpacing: -1,
              color: c.ink,
              margin: 0,
            }}
          >
            {f.headline}
          </h1>
          {f.subhead ? (
            <p style={{ fontFamily: BODY, fontSize: 26, lineHeight: 1.4, color: c.muted, margin: 0 }}>
              {f.subhead}
            </p>
          ) : null}
          <Bullets items={f.bullets ?? []} ink={c.ink} accent={c.accent} />
          <div style={{ marginTop: 8 }}>
            <CtaPill label={f.ctaLabel} accent={c.accent} accent2={c.accent2} />
          </div>
        </div>
        <div style={{ flex: 0.95, alignSelf: "stretch", position: "relative", minWidth: 0 }}>
          {f.mock && f.mock !== "none" ? (
            <div style={{ position: "absolute", inset: "6% 0" }}>
              <StudioMockView kind={f.mock} accent={c.accent} accent2={c.accent2} />
            </div>
          ) : null}
        </div>
      </div>

      <Contact text={f.contact} muted={c.muted} />
    </>
  );
}

function CtaLayout({ t }: { t: StudioTemplate }) {
  const f = t.fields;
  const c = tokens(f);
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 30,
      }}
    >
      <Wordmark brand={c.brand} accent={c.accent} ink={c.ink} />
      <Badge text={f.badge} accent={c.accent} ink={c.ink} />
      <h1
        style={{
          fontFamily: HEAD,
          fontWeight: 800,
          fontSize: 78,
          lineHeight: 1.03,
          letterSpacing: -1.5,
          color: c.ink,
          margin: 0,
          maxWidth: "92%",
        }}
      >
        {f.headline}
      </h1>
      {f.subhead ? (
        <p style={{ fontFamily: BODY, fontSize: 29, lineHeight: 1.4, color: c.muted, margin: 0, maxWidth: "80%" }}>
          {f.subhead}
        </p>
      ) : null}
      <div style={{ marginTop: 8 }}>
        <CtaPill label={f.ctaLabel} accent={c.accent} accent2={c.accent2} />
      </div>
      <div style={{ marginTop: 6 }}>
        <Contact text={f.contact} muted={c.muted} />
      </div>
    </div>
  );
}

/**
 * Renders a template at its natural pixel size (width is always 1080). The
 * caller scales it with a CSS transform for thumbnails / fit-to-pane preview;
 * PNG export captures this node unscaled.
 */
export function TemplateCanvas({ template }: { template: StudioTemplate }) {
  const { w, h } = ratioDims(template.ratio);
  const c = tokens(template.fields);
  const root: CSSProperties = {
    width: w,
    height: h,
    background: c.bg,
    color: c.ink,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: 72,
    boxSizing: "border-box",
    fontFamily: BODY,
    gap: 18,
  };
  return (
    <div data-studio-stage style={root}>
      {/* corner accent rule */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 160,
          height: 8,
          background: `linear-gradient(90deg, ${c.accent}, ${c.accent2})`,
        }}
      />
      {template.layout === "hero" ? (
        <HeroLayout t={template} />
      ) : template.layout === "cta" ? (
        <CtaLayout t={template} />
      ) : (
        <FeatureLayout t={template} />
      )}
    </div>
  );
}
