/** Maps each shop slug to its CRM type. Used to wire /t/[slug] → /crm/[type]?slug=[slug] */
export const SLUG_TO_CRM: Record<string, string> = {
  // Fashion
  "chichaven": "fashion",
  "velvet-vault": "fashion",
  "berry-fits": "fashion",
  "boutique-intuition": "fashion",
  "clarks-clothes": "fashion",
  "diamond-couture": "fashion",
  "everything-cutee": "fashion",
  "fashionminisadult": "fashion",
  "kylas-content": "fashion",
  "luxurious-wholesale-ja": "fashion",
  "surprise-fashion": "fashion",
  "westside-mandeville": "fashion",
  // Accessories
  "trendy-accessories": "accessories",
  // Variety / general
  "gk-family-variety": "variety",
  "trust-depot": "variety",
  "mini-good-girl": "variety",
  "kidoro-baby-store": "variety",
  "cassie-bar": "variety",
  // Food
  "cre8tive-cafe": "food",
  "ginza-yotsumi": "food",
  "tropical-toppingz": "food",
  "keke-the-baker": "food",
  "sweet-face-pastries": "food",
  // Beauty
  "beauty-lounge-sydz": "beauty",
  "blye-beauty": "beauty",
  "ruel": "beauty",
  "sincerely-sparks": "beauty",
  // Automotive
  "buff-n-beam": "automotive",
  "sg-engine-master": "automotive",
  // Events
  "beach-picnic-ja": "events",
  // Tech repair
  "savvy-apple": "tech-repair",
  "wiz-repair": "tech-repair",
  // Furniture
  "atelier-luxridge": "furniture",
  "mr-jackson-furniture": "furniture",
  "rockland-furniture": "furniture",
  "west-furniture": "furniture",
  // Lighting
  "samkhil": "lighting",
  // Packaging
  "sett-to-go": "packaging",
  // Crafts / graphics
  "ecm-graphics": "crafts",
  // Florist
  "bouquets-by-mira": "florist",
};
