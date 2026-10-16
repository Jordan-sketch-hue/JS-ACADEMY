// Brand context layer — enriches prompts with JST brand visual identity

export type BrandContext = {
  style?: string;   // visual style / aesthetic
  tone?: string;    // mood / atmosphere
  colors?: string;  // color palette hint
  scene?: string;   // additional scene framing
};

// JST brand presets — add/edit per brand as needed
export const BRAND_PRESETS: Record<string, BrandContext> = {
  jst: {
    style: "tech-forward, premium, clean",
    tone: "confident, authoritative, modern",
    colors: "black, white, gold accents",
  },
  ferguson: {
    style: "professional, legal, polished",
    tone: "trustworthy, precise, established",
    colors: "navy blue, gold, white",
  },
  home: {
    style: "real estate, aspirational, warm",
    tone: "welcoming, aspirational, Jamaican homes",
    colors: "terracotta, cream, forest green",
  },
  language_cradle: {
    style: "educational, premium, global",
    tone: "empowering, sophisticated, multilingual",
    colors: "deep navy, gold, charcoal",
  },
  bp_couriers: {
    style: "logistics, dynamic, trustworthy",
    tone: "reliable, efficient, professional",
    colors: "blue, white, orange accents",
  },
  solid_trust: {
    style: "courier, bold, Caribbean",
    tone: "dependable, community-focused",
    colors: "red, black, white",
  },
  mover_guy: {
    style: "moving services, approachable, local",
    tone: "helpful, friendly, Jamaican",
    colors: "orange, dark gray, white",
  },
  ship2door: {
    style: "e-commerce logistics, modern",
    tone: "convenient, American-Caribbean bridge",
    colors: "blue, white, green",
  },
  car_wash: {
    style: "luxury automotive, premium detail",
    tone: "upscale, aspirational, clean",
    colors: "deep blue, chrome, white",
  },
  aboo_tours: {
    style: "tourism, vibrant, Jamaican nature",
    tone: "adventurous, warm, inviting",
    colors: "turquoise, green, golden sand",
  },
  morris_pizza: {
    style: "food photography, appetizing, authentic",
    tone: "warm, homey, delicious",
    colors: "red, warm orange, cream",
  },
};

export function enrichPrompt(prompt: string, ctx: BrandContext): string {
  const modifiers: string[] = [];
  if (ctx.style)  modifiers.push(ctx.style);
  if (ctx.tone)   modifiers.push(ctx.tone);
  if (ctx.colors) modifiers.push(`colors: ${ctx.colors}`);
  if (ctx.scene)  modifiers.push(ctx.scene);

  return modifiers.length > 0
    ? `${prompt}, ${modifiers.join(", ")}`
    : prompt;
}
