export type BrandKitCategoryId = "logos" | "social" | "mockups" | "guidelines";

export type BrandKitItem = {
  id: string;
  category: BrandKitCategoryId;
  title: string;
  description: string;
  /** Public path under /public */
  file: string;
  /** Rough hint for downloads */
  ext: "svg" | "png" | "pdf";
};

export const BRAND_KIT_CATEGORIES: { id: BrandKitCategoryId; label: string; blurb: string }[] = [
  {
    id: "logos",
    label: "Logos & marks",
    blurb: "Vector-friendly marks you can scale in Illustrator or drop into web builds.",
  },
  {
    id: "social",
    label: "Social shells",
    blurb: "Starter squares and story frames — replace text in Photoshop or Express.",
  },
  {
    id: "mockups",
    label: "UI mockups",
    blurb: "Simple layout placeholders to brief engineers or presentation decks.",
  },
  {
    id: "guidelines",
    label: "Brand cheat sheet",
    blurb: "One-page reference for colors, type rhythm, and voice.",
  },
];

export const BRAND_KIT_ITEMS: BrandKitItem[] = [
  {
    id: "logo-mark",
    category: "logos",
    title: "J Supreme mark",
    description: "Abstract monogram-style mark for favicons and app chrome.",
    file: "/brand-kit/logo-mark.svg",
    ext: "svg",
  },
  {
    id: "logo-wordmark",
    category: "logos",
    title: "Wordmark strip",
    description: "Horizontal lockup for headers and email footers.",
    file: "/brand-kit/wordmark.svg",
    ext: "svg",
  },
  {
    id: "social-1080",
    category: "social",
    title: "Post canvas 1080×1080",
    description: "Square template with safe margins for feeds.",
    file: "/brand-kit/social-post-1080.svg",
    ext: "svg",
  },
  {
    id: "story-1080-1920",
    category: "social",
    title: "Story shell 1080×1920",
    description: "Vertical shell for reels/stories; swap photography inside Adobe.",
    file: "/brand-kit/social-story-1080x1920.svg",
    ext: "svg",
  },
  {
    id: "dashboard-mock",
    category: "mockups",
    title: "Dashboard wireframe",
    description: "Low-fidelity module layout to align with your app’s real routes.",
    file: "/brand-kit/mock-dashboard.svg",
    ext: "svg",
  },
  {
    id: "brand-onepager",
    category: "guidelines",
    title: "Voice & color one-pager",
    description: "Editable SVG “poster” — open in Illustrator to tune tokens.",
    file: "/brand-kit/brand-guidelines.svg",
    ext: "svg",
  },
];
