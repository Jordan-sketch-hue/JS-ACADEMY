/**
 * ClientConfig — single source of truth for all client branding and contact data.
 * HOW TO TEST: import this type in any template; TypeScript will error if any required field is missing.
 */
export type ClientConfig = {
  /** Business name displayed in header, footer, page title */
  name: string;
  /** Category slug — must match one of the 13 template directories */
  category:
    | "fashion" | "accessories" | "furniture" | "food"
    | "beauty" | "tech-repair" | "automotive" | "packaging"
    | "variety" | "lighting" | "florist" | "crafts" | "events";
  /** Absolute URL or relative path to logo image (compressed <200KB) */
  logo: string;
  /** Color palette — all values are hex strings */
  colors: {
    accent: string;
    accentFg: string;
    bg?: string;
    text?: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
    email?: string;
    address?: string;
  };
  socials?: {
    tiktok?: string;
    instagram?: string;
    facebook?: string;
  };
  seo?: {
    description?: string;
    keywords?: string[];
  };
};
