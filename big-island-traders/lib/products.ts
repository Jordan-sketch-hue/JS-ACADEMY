export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: "single" | "bundle";
  color: string;
  badge?: string;
  image?: string;
  abv?: string;
};

export const products: Product[] = [
  {
    id: "wiag-merlot",
    name: "WIAG Merlot",
    description: "Rich, velvety Australian Merlot. 13.5% ABV. 187ml premium RTD in a real wine glass.",
    price: 850,
    unit: "per glass",
    category: "single",
    color: "from-red-900 to-red-700",
    badge: "Classic",
    image: "/images/wiag-merlot.jpg",
    abv: "13.5%",
  },
  {
    id: "wiag-cabernat",
    name: "WIAG Cabernet Sauvignon",
    description: "Bold, full-bodied Australian Cab Sauv. Deep dark fruit, perfect for gifting.",
    price: 850,
    unit: "per glass",
    category: "single",
    color: "from-red-950 to-red-800",
    badge: "Bold",
    image: "/images/wiag-cabernat.jpg",
    abv: "13.5%",
  },
  {
    id: "wiag-rose",
    name: "WIAG Rosé",
    description: "Premium Australian Rosé. 13% ABV. Light, crisp, perfect for beach and picnic.",
    price: 850,
    unit: "per glass",
    category: "single",
    color: "from-pink-200 to-rose-300",
    badge: "Fresh",
    image: "/images/wiag-rose-cooler.jpg",
    abv: "13%",
  },
  {
    id: "wiag-moscato",
    name: "WIAG Moscato",
    description: "Sweet, aromatic Moscato. The lifestyle wine — sunsets, celebrations, every moment.",
    price: 850,
    unit: "per glass",
    category: "single",
    color: "from-amber-100 to-yellow-200",
    badge: "Lifestyle",
    image: "/images/wiag-moscato-sunset.jpg",
    abv: "7.5%",
  },
  {
    id: "bundle-12",
    name: "Gift Box — 12 Pack",
    description: "12 × WIAG glasses in a premium black & gold gift carrier. Mix any varieties.",
    price: 9600,
    unit: "J$800 each",
    category: "bundle",
    color: "from-[#1B4FBD] to-[#0D1933]",
    badge: "Save J$600",
  },
  {
    id: "bundle-24",
    name: "Gift Box — 24 Pack",
    description: "24 × WIAG glasses. Ideal for team recognition and office events.",
    price: 18000,
    unit: "J$750 each",
    category: "bundle",
    color: "from-[#5BC8E8] to-[#1B4FBD]",
    badge: "Save J$2,400",
  },
  {
    id: "bundle-48",
    name: "Gift Box — 48 Pack",
    description: "48 × WIAG glasses. Conference-scale corporate gifting. Most popular.",
    price: 33600,
    unit: "J$700 each",
    category: "bundle",
    color: "from-[#F5C800] to-[#E8561A]",
    badge: "Best Value",
  },
];

export const tiers = [
  { qty: "1–11", price: "J$850–J$950", per: "per unit", highlight: false },
  { qty: "12-pack", price: "J$9,600", per: "J$800 each", highlight: false },
  { qty: "24-pack", price: "J$18,000", per: "J$750 each", highlight: false },
  { qty: "48-pack", price: "J$33,600", per: "J$700 each", highlight: true },
  { qty: "100-pack", price: "J$65,000", per: "J$650 each", highlight: false },
  { qty: "500+", price: "Contact us", per: "custom pricing", highlight: false },
];
