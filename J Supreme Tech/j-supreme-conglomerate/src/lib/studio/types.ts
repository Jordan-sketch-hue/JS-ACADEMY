// Creative Studio — shared types for the template gallery + smart-field editor.

export type StudioLayout = "hero" | "feature" | "cta";

export type StudioMock =
  | "none"
  | "browser"
  | "dashboard"
  | "phoneChat"
  | "store"
  | "courier";

export type StudioFields = {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  bullets?: string[];
  ctaLabel?: string;
  contact?: string;
  badge?: string;
  mock?: StudioMock;
  // Theme tokens (all editable from the smart-field form)
  bg?: string;
  ink?: string;
  muted?: string;
  accent?: string;
  accent2?: string;
  brand?: string;
};

export type StudioTemplate = {
  id: string; // uuid for saved templates; the seed `key` for built-ins
  key: string;
  name: string;
  category: string;
  layout: StudioLayout;
  ratio: string; // "WxH" — must be a key of RATIOS
  fields: StudioFields;
  isBuiltin: boolean;
  owner?: string | null;
  updatedAt?: string;
};

export const RATIOS: Record<string, { w: number; h: number; label: string }> = {
  "1080x1080": { w: 1080, h: 1080, label: "Square · Feed post" },
  "1080x1350": { w: 1080, h: 1350, label: "Portrait · Flyer" },
  "1080x1920": { w: 1080, h: 1920, label: "Story · 9:16" },
};

export function ratioDims(ratio: string) {
  return RATIOS[ratio] ?? RATIOS["1080x1080"];
}
