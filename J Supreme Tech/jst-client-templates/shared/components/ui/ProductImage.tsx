"use client";

const CATEGORY_THEMES: Record<string, { bg: string; icon: string }> = {
  fashion:       { bg: "linear-gradient(135deg,#9c27b0 0%,#e91e63 100%)", icon: "👗" },
  accessories:   { bg: "linear-gradient(135deg,#f9a825 0%,#00897b 100%)", icon: "💎" },
  baby:          { bg: "linear-gradient(135deg,#81d4fa 0%,#f8bbd0 100%)", icon: "🍼" },
  variety:       { bg: "linear-gradient(135deg,#00acc1 0%,#ff7043 100%)", icon: "🛒" },
  food:          { bg: "linear-gradient(135deg,#fb8c00 0%,#e53935 100%)", icon: "🍽️" },
  pizza:         { bg: "linear-gradient(135deg,#e53935 0%,#fb8c00 100%)", icon: "🍕" },
  baker:         { bg: "linear-gradient(135deg,#8d6e63 0%,#f9a825 100%)", icon: "🎂" },
  bar:           { bg: "linear-gradient(135deg,#283593 0%,#7b1fa2 100%)", icon: "🍹" },
  beauty:        { bg: "linear-gradient(135deg,#e91e63 0%,#9c27b0 100%)", icon: "💄" },
  automotive:    { bg: "linear-gradient(135deg,#37474f 0%,#1565c0 100%)", icon: "🔧" },
  "tech-repair": { bg: "linear-gradient(135deg,#3949ab 0%,#6a1b9a 100%)", icon: "📱" },
  furniture:     { bg: "linear-gradient(135deg,#5d4037 0%,#bf8f6e 100%)", icon: "🪑" },
  lighting:      { bg: "linear-gradient(135deg,#f9a825 0%,#ff8f00 100%)", icon: "💡" },
  events:        { bg: "linear-gradient(135deg,#6a1b9a 0%,#f9a825 100%)", icon: "🎉" },
  florist:       { bg: "linear-gradient(135deg,#2e7d32 0%,#e91e63 100%)", icon: "🌸" },
  packaging:     { bg: "linear-gradient(135deg,#1a237e 0%,#546e7a 100%)", icon: "📦" },
  crafts:        { bg: "linear-gradient(135deg,#e65100 0%,#6a1b9a 100%)", icon: "🎨" },
  design:        { bg: "linear-gradient(135deg,#1565c0 0%,#00897b 100%)", icon: "✏️" },
};

const KEYWORD_MAP: [string, string][] = [
  ["cake", "baker"], ["pastry", "baker"], ["cupcake", "baker"], ["bake", "baker"],
  ["pizza", "pizza"], ["burger", "food"], ["ramen", "food"], ["food", "food"],
  ["dress", "fashion"], ["top", "fashion"], ["shoe", "fashion"], ["heel", "fashion"],
  ["ring", "accessories"], ["earring", "accessories"], ["necklace", "accessories"], ["bracelet", "accessories"],
  ["sofa", "furniture"], ["bed", "furniture"], ["table", "furniture"], ["chair", "furniture"],
  ["bulb", "lighting"], ["pendant", "lighting"], ["lamp", "lighting"], ["chandelier", "lighting"],
  ["phone", "tech-repair"], ["screen", "tech-repair"], ["repair", "tech-repair"], ["battery", "tech-repair"],
  ["nail", "beauty"], ["hair", "beauty"], ["lash", "beauty"], ["brow", "beauty"],
  ["oil change", "automotive"], ["engine", "automotive"], ["brake", "automotive"], ["detail", "automotive"],
  ["flower", "florist"], ["bouquet", "florist"], ["floral", "florist"],
  ["box", "packaging"], ["bag", "packaging"], ["label", "packaging"], ["ribbon", "packaging"],
];

function guessCategory(name: string, category?: string | null): string {
  if (category) return category;
  const lower = name.toLowerCase();
  for (const [kw, cat] of KEYWORD_MAP) {
    if (lower.includes(kw)) return cat;
  }
  return "variety";
}

interface Props {
  name: string;
  category?: string | null;
  imageUrl?: string | null;
  height?: number;
}

export function ProductImage({ name, category, imageUrl, height = 200 }: Props) {
  const cat = guessCategory(name, category);
  const theme = CATEGORY_THEMES[cat] ?? CATEGORY_THEMES.variety;

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name}
        style={{ width: "100%", height, objectFit: "cover", display: "block" }}
        loading="lazy"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          el.style.display = "none";
          (el.nextElementSibling as HTMLElement | null)?.style.setProperty("display", "flex");
        }}
      />
    );
  }

  return (
    <div style={{ width: "100%", height, background: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, flexShrink: 0 }}>
      {theme.icon}
    </div>
  );
}
