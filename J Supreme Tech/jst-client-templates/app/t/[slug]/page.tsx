export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getClient } from "@/lib/ct-client";
import type { Metadata } from "next";
import type { ClientConfig } from "@shared/types/config";
import { SLUG_TO_CRM } from "@/lib/crm-map";
import { SiteLayout } from "@shared/components/layout/SiteLayout";
import { SiteHero } from "@shared/components/sections/SiteHero";
import { ServicesGrid } from "@shared/components/sections/ServicesGrid";
import { AnimatedStats } from "@shared/components/sections/AnimatedStats";
import { GalleryCarousel } from "@shared/components/sections/GalleryCarousel";
import { Testimonials } from "@shared/components/sections/Testimonials";
import { BookingWidget } from "@shared/components/sections/BookingWidget";
import { ContactForm } from "@shared/components/sections/ContactForm";
import { ShopGrid } from "@shared/components/sections/ShopGrid";
import { MenuGrid } from "@shared/components/sections/MenuGrid";
import CakeOrderForm from "@shared/components/sections/CakeOrderForm";
import QuoteForm, { type QuoteItem } from "@shared/components/sections/QuoteForm";
import { WholesaleGrid } from "@shared/components/sections/WholesaleGrid";
import type { ShopProduct } from "@shared/components/sections/ShopGrid";
import type { WholesaleProduct } from "@shared/components/sections/WholesaleGrid";
import type { ServiceItem } from "@shared/components/sections/ServicesGrid";
import type { Stat } from "@shared/components/sections/AnimatedStats";

type GalleryImage = { src: string; alt: string };
type Review = { name: string; rating: number; text: string };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const WHOLESALE_SLUGS = new Set(["luxurious-wholesale-ja", "mini-good-girl"]);
const CAKE_SLUGS = new Set(["keke-the-baker", "sweet-face-pastries"]);

// ── Category-specific site defaults ──────────────────────────────────────────

type CategoryDefaults = {
  heroHeadline: string;
  heroSubline: string;
  ctaLabel: string;
  ctaHref: string;
  navLinks: { label: string; href: string }[];
  services: ServiceItem[];
  stats: Stat[];
  gallery: GalleryImage[];
  testimonials: Review[];
  bookingServices?: string[];
};

const GALLERY_IMAGES: Record<string, GalleryImage[]> = {
  accessories: [
    { src: "/gallery/accessories/accessories-1.webp", alt: "Accessories display 1" },
    { src: "/gallery/accessories/accessories-2.webp", alt: "Accessories display 2" },
    { src: "/gallery/accessories/accessories-3.webp", alt: "Accessories display 3" },
    { src: "/gallery/accessories/accessories-4.webp", alt: "Accessories display 4" },
    { src: "/gallery/accessories/accessories-5.webp", alt: "Accessories display 5" },
    { src: "/gallery/accessories/accessories-6.webp", alt: "Accessories display 6" },
  ],
  crafts: [
    { src: "/gallery/crafts/crafts-1.webp", alt: "Crafts work 1" },
    { src: "/gallery/crafts/crafts-2.webp", alt: "Crafts work 2" },
    { src: "/gallery/crafts/crafts-3.webp", alt: "Crafts work 3" },
    { src: "/gallery/crafts/crafts-4.webp", alt: "Crafts work 4" },
    { src: "/gallery/crafts/crafts-5.webp", alt: "Crafts work 5" },
    { src: "/gallery/crafts/crafts-6.webp", alt: "Crafts work 6" },
  ],
  events: [
    { src: "/gallery/events/events-1.webp", alt: "Events setup 1" },
    { src: "/gallery/events/events-2.webp", alt: "Events setup 2" },
    { src: "/gallery/events/events-3.webp", alt: "Events setup 3" },
    { src: "/gallery/events/events-4.webp", alt: "Events setup 4" },
    { src: "/gallery/events/events-5.webp", alt: "Events setup 5" },
    { src: "/gallery/events/events-6.webp", alt: "Events setup 6" },
  ],
  fashion: [
    { src: "/gallery/fashion/fashion-1.webp", alt: "Fashion look 1" },
    { src: "/gallery/fashion/fashion-2.webp", alt: "Fashion look 2" },
    { src: "/gallery/fashion/fashion-3.webp", alt: "Fashion look 3" },
    { src: "/gallery/fashion/fashion-4.webp", alt: "Fashion look 4" },
    { src: "/gallery/fashion/fashion-5.webp", alt: "Fashion look 5" },
    { src: "/gallery/fashion/fashion-6.webp", alt: "Fashion look 6" },
  ],
};

function placeholderGallery(category: string, accent = "#1A1A1A"): GalleryImage[] {
  return GALLERY_IMAGES[category] ?? Array.from({ length: 6 }, (_, i) => ({
    src: `/gallery/${category}/${category}-${i + 1}.webp`,
    alt: `${category} image ${i + 1}`,
  }));
}

// ── Category constants ────────────────────────────────────────────────────────

const BOOKING_CATS = new Set(["beauty", "automotive", "tech-repair", "events", "florist"]);
const COMMERCE_CATS = new Set(["fashion", "variety", "accessories", "crafts", "baby", "florist"]);
const QUOTE_CATS = new Set(["events", "packaging", "lighting", "furniture", "design", "ceiling"]);
const FOOD_CATS = new Set(["food", "pizza", "baker", "bar"]);
const SERVICE_CATS = new Set(["beauty", "automotive", "tech-repair"]);

// ── Category defaults (abbreviated — same as base) ────────────────────────────

const CATEGORY_DEFAULTS: Record<string, CategoryDefaults> = {
  fashion: {
    heroHeadline: "Style That Speaks for You",
    heroSubline: "Discover the latest trends, curated looks, and everyday essentials — all at prices you'll love.",
    ctaLabel: "Shop Now",
    ctaHref: "#shop",
    navLinks: [{ label: "Shop", href: "#shop" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Women's Fashion", description: "Dresses, tops, bottoms, sets, and co-ords for every occasion." },
      { icon: "", title: "Accessories", description: "Bags, jewellery, and statement pieces to complete any look." },
    ],
    stats: [
      { value: 500, suffix: "+", label: "Styles Available" },
      { value: 2000, suffix: "+", label: "Happy Customers" },
    ],
    gallery: [],
    testimonials: [
      { name: "Kezia R.", rating: 5, text: "Love the quality. Pieces hold up and look amazing on." },
      { name: "Tamara B.", rating: 5, text: "Always something new every week. My go-to shop." },
    ],
  },
  beauty: {
    heroHeadline: "Look Good. Feel Good.",
    heroSubline: "Professional beauty services — hair, nails, lashes, and skincare — by appointment.",
    ctaLabel: "Book Now",
    ctaHref: "#booking",
    navLinks: [{ label: "Services", href: "#services" }, { label: "Book", href: "#booking" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Hair Services", description: "Cuts, colour, blow-dry, and styling." },
      { icon: "", title: "Nail Services", description: "Gel, acrylic, nail art, and manicure." },
      { icon: "", title: "Lashes & Brows", description: "Extensions, lifts, lamination, and tinting." },
    ],
    stats: [
      { value: 3000, suffix: "+", label: "Clients Served" },
      { value: 5, label: "Years Experience" },
    ],
    gallery: [],
    testimonials: [
      { name: "Sasha D.", rating: 5, text: "Best nails I've ever had. She's so detailed." },
      { name: "Tanya M.", rating: 5, text: "My hair has never looked this good." },
    ],
    bookingServices: ["Hair Services", "Nail Services", "Lash Extensions", "Brow Design", "Facial", "Makeup"],
  },
  automotive: {
    heroHeadline: "Keep Your Vehicle in Peak Condition",
    heroSubline: "Trusted auto care — from oil changes to full engine rebuilds.",
    ctaLabel: "Book a Service",
    ctaHref: "#booking",
    navLinks: [{ label: "Services", href: "#services" }, { label: "Book", href: "#booking" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Oil Change", description: "Full synthetic, semi-synthetic, and conventional oil changes." },
      { icon: "", title: "Brake Service", description: "Pad replacement, rotor resurfacing, and brake flush." },
      { icon: "", title: "Engine Diagnostics", description: "Computer diagnostics and check engine light analysis." },
    ],
    stats: [
      { value: 5000, suffix: "+", label: "Vehicles Serviced" },
      { value: 10, label: "Years in Business" },
    ],
    gallery: [],
    testimonials: [
      { name: "Donovan P.", rating: 5, text: "Quick, honest, and affordable. Won't go anywhere else." },
      { name: "Maxine G.", rating: 5, text: "They diagnosed an issue two other shops missed." },
    ],
    bookingServices: ["Oil Change", "Brake Service", "Engine Diagnostics", "Tune-Up", "A/C Service", "Wheel Alignment"],
  },
  food: {
    heroHeadline: "Fresh Food, Fast Delivery",
    heroSubline: "Order online, pick up or get it delivered hot to your door.",
    ctaLabel: "Order Now",
    ctaHref: "#menu",
    navLinks: [{ label: "Menu", href: "#menu" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Fresh Meals", description: "Made to order with quality ingredients." },
    ],
    stats: [{ value: 10000, suffix: "+", label: "Orders Delivered" }, { value: 4.8, label: "Star Rating" }],
    gallery: [],
    testimonials: [{ name: "Ricardo T.", rating: 5, text: "Best food in the area. Always fresh." }],
  },
  furniture: {
    heroHeadline: "Furniture Crafted to Last",
    heroSubline: "Custom and ready-made furniture for every room. Built with quality you can feel.",
    ctaLabel: "Request a Quote",
    ctaHref: "#contact",
    navLinks: [{ label: "Products", href: "#services" }, { label: "Gallery", href: "#gallery" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Living Room", description: "Sofas, chairs, coffee tables, and entertainment units." },
      { icon: "", title: "Bedroom", description: "Beds, wardrobes, dressers, and nightstands." },
      { icon: "", title: "Dining", description: "Dining tables, chairs, and buffet units." },
    ],
    stats: [{ value: 1200, suffix: "+", label: "Pieces Sold" }, { value: 8, label: "Years Experience" }],
    gallery: [],
    testimonials: [{ name: "Colin M.", rating: 5, text: "The craftsmanship is exceptional. Worth every dollar." }],
  },
  lighting: {
    heroHeadline: "Light That Transforms Every Space",
    heroSubline: "Indoor, outdoor, commercial, and decorative lighting solutions.",
    ctaLabel: "Shop Lighting",
    ctaHref: "#services",
    navLinks: [{ label: "Products", href: "#services" }, { label: "Gallery", href: "#gallery" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Indoor Lighting", description: "Pendants, chandeliers, recessed, and wall fixtures." },
      { icon: "", title: "Outdoor & Security", description: "Floodlights, pathway lights, and smart security lighting." },
      { icon: "", title: "LED & Smart Lighting", description: "Energy-efficient bulbs, strips, and smart home systems." },
    ],
    stats: [{ value: 800, suffix: "+", label: "Projects Completed" }, { value: 3000, suffix: "+", label: "Products in Catalogue" }],
    gallery: [],
    testimonials: [{ name: "Colette B.", rating: 5, text: "Completely transformed our living room." }],
  },
  packaging: {
    heroHeadline: "Packaging That Sells Before It Opens",
    heroSubline: "Custom boxes, bags, labels, and branded packaging for every product.",
    ctaLabel: "Request a Quote",
    ctaHref: "#contact",
    navLinks: [{ label: "Products", href: "#services" }, { label: "Gallery", href: "#gallery" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Custom Boxes", description: "Folding cartons, mailer boxes, rigid gift boxes." },
      { icon: "", title: "Bags & Pouches", description: "Paper bags, poly bags, stand-up pouches." },
      { icon: "", title: "Labels & Stickers", description: "Product labels, logo stickers, and seal labels." },
    ],
    stats: [{ value: 500, suffix: "+", label: "Brands Served" }, { value: 7, label: "Years in Business" }],
    gallery: [],
    testimonials: [{ name: "Kezia F.", rating: 5, text: "The custom boxes for my skincare line look absolutely luxurious." }],
  },
  variety: {
    heroHeadline: "Everything You Need, In One Place",
    heroSubline: "Household goods, groceries, beauty, and more — stocked fresh daily.",
    ctaLabel: "Shop Now",
    ctaHref: "#shop",
    navLinks: [{ label: "Shop", href: "#shop" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Variety Store", description: "A wide range of everyday essentials." }],
    stats: [{ value: 500, suffix: "+", label: "Products" }, { value: 4.7, label: "Star Rating" }],
    gallery: [],
    testimonials: [{ name: "Monique F.", rating: 5, text: "One stop shop, amazing prices." }],
  },
  accessories: {
    heroHeadline: "The Detail That Defines Your Look",
    heroSubline: "Jewellery, bags, and accessories for every style and every budget.",
    ctaLabel: "Shop Now",
    ctaHref: "#shop",
    navLinks: [{ label: "Shop", href: "#shop" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Accessories", description: "Rings, earrings, necklaces, bracelets, and bags." }],
    stats: [{ value: 300, suffix: "+", label: "Styles" }, { value: 1500, suffix: "+", label: "Customers" }],
    gallery: [],
    testimonials: [{ name: "Jasmine R.", rating: 5, text: "Always finding something new and unique here." }],
  },
  design: {
    heroHeadline: "Creative Design Solutions",
    heroSubline: "Logos, branding, print, and digital design for businesses of all sizes.",
    ctaLabel: "Request a Quote",
    ctaHref: "#contact",
    navLinks: [{ label: "Services", href: "#services" }, { label: "Gallery", href: "#gallery" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Logo Design", description: "Custom brand marks and identity design." },
      { icon: "", title: "Print Design", description: "Flyers, posters, banners, and business cards." },
      { icon: "", title: "Digital Design", description: "Social media graphics and digital ads." },
    ],
    stats: [{ value: 400, suffix: "+", label: "Projects" }, { value: 7, label: "Years Experience" }],
    gallery: [],
    testimonials: [{ name: "Owen F.", rating: 5, text: "My logo elevated my brand completely." }],
  },
  events: {
    heroHeadline: "Events That People Talk About",
    heroSubline: "Full event planning and management — weddings, corporate, parties, and more.",
    ctaLabel: "Book a Consultation",
    ctaHref: "#booking",
    navLinks: [{ label: "Services", href: "#services" }, { label: "Gallery", href: "#gallery" }, { label: "Book", href: "#booking" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Corporate Events", description: "Launch parties, team outings, and conferences." },
      { icon: "", title: "Weddings", description: "Full wedding planning from proposal to honeymoon." },
      { icon: "", title: "Private Parties", description: "Birthdays, anniversaries, and celebrations." },
    ],
    stats: [{ value: 200, suffix: "+", label: "Events Planned" }, { value: 5, label: "Years Experience" }],
    gallery: [],
    testimonials: [
      { name: "Denise A.", rating: 5, text: "Our product launch was seamless." },
      { name: "Marcus J.", rating: 5, text: "They planned our wedding from start to finish. Absolutely unforgettable." },
    ],
    bookingServices: ["Corporate Event", "Wedding", "Birthday Party", "Brand Activation", "Private Function"],
  },
  "tech-repair": {
    heroHeadline: "Fast, Reliable Tech Repairs",
    heroSubline: "Phone, laptop, and tablet repairs with genuine parts and a quality guarantee.",
    ctaLabel: "Book a Repair",
    ctaHref: "#booking",
    navLinks: [{ label: "Services", href: "#services" }, { label: "Book", href: "#booking" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "Screen Replacement", description: "iPhone, Samsung, iPad, and laptop screen repairs." },
      { icon: "", title: "Battery Replacement", description: "Fast battery swaps for all major phone brands." },
      { icon: "", title: "Software & Recovery", description: "Data recovery, OS reinstalls, and virus removal." },
    ],
    stats: [{ value: 6000, suffix: "+", label: "Devices Repaired" }, { value: 98, suffix: "%", label: "Success Rate" }],
    gallery: [],
    testimonials: [{ name: "Leroy T.", rating: 5, text: "Fixed my phone in two hours. Better service than the official store." }],
    bookingServices: ["Screen Repair", "Battery Replacement", "Water Damage", "Laptop Repair", "Data Recovery", "Software Fix"],
  },
  baby: {
    heroHeadline: "Everything for Your Little One",
    heroSubline: "Baby clothing, toys, feeding essentials, and nursery supplies — all in one place.",
    ctaLabel: "Shop Now",
    ctaHref: "#shop",
    navLinks: [{ label: "Shop", href: "#shop" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Baby Essentials", description: "Clothing, feeding, toys, and bedding for newborns to toddlers." }],
    stats: [{ value: 1000, suffix: "+", label: "Products" }, { value: 800, suffix: "+", label: "Happy Parents" }],
    gallery: [],
    testimonials: [{ name: "Nadine C.", rating: 5, text: "Best baby store. Excellent quality at great prices." }],
  },
  florist: {
    heroHeadline: "Flowers That Say Everything",
    heroSubline: "Fresh bouquets, arrangements, and custom floral designs for every occasion.",
    ctaLabel: "Shop Flowers",
    ctaHref: "#shop",
    navLinks: [{ label: "Shop", href: "#shop" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Floral Arrangements", description: "Custom bouquets, roses, sunflowers, and seasonal blooms." }],
    stats: [{ value: 2000, suffix: "+", label: "Arrangements Made" }, { value: 4.9, label: "Star Rating" }],
    gallery: [],
    testimonials: [{ name: "Tiffany H.", rating: 5, text: "The most beautiful bouquet I've ever received." }],
  },
  crafts: {
    heroHeadline: "Handmade with Heart",
    heroSubline: "Unique handcrafted pieces — gifts, home decor, and wearable art.",
    ctaLabel: "Shop Now",
    ctaHref: "#shop",
    navLinks: [{ label: "Shop", href: "#shop" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Handcrafted Goods", description: "Unique pieces made with care and skill." }],
    stats: [{ value: 300, suffix: "+", label: "Items" }, { value: 4.8, label: "Rating" }],
    gallery: [],
    testimonials: [{ name: "Sandra B.", rating: 5, text: "Incredibly detailed work. Perfect gifts." }],
  },
  pizza: {
    heroHeadline: "Fresh Pizza, Made to Order",
    heroSubline: "Classic and gourmet pizzas baked in-house. Dine-in, takeaway, or delivery.",
    ctaLabel: "Order Now",
    ctaHref: "#menu",
    navLinks: [{ label: "Menu", href: "#menu" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Pizza", description: "Classic, gourmet, and build-your-own options." }],
    stats: [{ value: 50000, suffix: "+", label: "Pizzas Sold" }, { value: 4.8, label: "Star Rating" }],
    gallery: [],
    testimonials: [{ name: "Daniel F.", rating: 5, text: "Best pizza on the island. Period." }],
  },
  baker: {
    heroHeadline: "Baked Fresh, Daily",
    heroSubline: "Cakes, pastries, and custom orders for every celebration.",
    ctaLabel: "Order Now",
    ctaHref: "#menu",
    navLinks: [{ label: "Menu", href: "#menu" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Custom Cakes", description: "Birthday, wedding, and celebration cakes made to order." }],
    stats: [{ value: 5000, suffix: "+", label: "Cakes Baked" }, { value: 4.9, label: "Star Rating" }],
    gallery: [],
    testimonials: [{ name: "Tricia K.", rating: 5, text: "Most beautiful and delicious cakes. Always on time." }],
  },
  bar: {
    heroHeadline: "Your Bar, Elevated",
    heroSubline: "Premium cocktails, craft beers, and bar supplies for every occasion.",
    ctaLabel: "Order Now",
    ctaHref: "#menu",
    navLinks: [{ label: "Menu", href: "#menu" }, { label: "Contact", href: "#contact" }],
    services: [{ icon: "", title: "Bar Services", description: "Cocktails, beers, spirits, and bar supplies." }],
    stats: [{ value: 100, suffix: "+", label: "Cocktails" }, { value: 4.7, label: "Rating" }],
    gallery: [],
    testimonials: [{ name: "Kyle A.", rating: 5, text: "Best drinks in the city. Creative menu." }],
  },
  ceiling: {
    heroHeadline: "Premium Ceiling Installations",
    heroSubline: "PVC panels, false ceilings, and architectural ceiling solutions for homes and businesses.",
    ctaLabel: "Request a Quote",
    ctaHref: "#contact",
    navLinks: [{ label: "Products", href: "#services" }, { label: "Gallery", href: "#gallery" }, { label: "Contact", href: "#contact" }],
    services: [
      { icon: "", title: "PVC Ceiling Panels", description: "Durable, moisture-resistant panels for any room." },
      { icon: "", title: "False Ceilings", description: "Suspended ceiling systems with integrated lighting." },
    ],
    stats: [{ value: 500, suffix: "+", label: "Installations" }, { value: 10, label: "Years Experience" }],
    gallery: [],
    testimonials: [{ name: "Paul R.", rating: 5, text: "Transformed our entire home. Clean, professional finish." }],
  },
};

// ── Video backgrounds by category ─────────────────────────────────────────────
const VIDEO_CATS: Record<string, string> = {
  beauty: "/videos/hero-beauty.mp4",
  fashion: "/videos/hero-fashion.mp4",
  food: "/videos/hero-food.mp4",
  automotive: "/videos/hero-automotive.mp4",
};

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) return { title: "Not Found" };
  return {
    title: `${client.name} | Jamaica`,
    description: (client as { subline?: string; headline?: string }).subline ?? (client as { headline?: string }).headline ?? undefined,
    openGraph: {
      title: client.name,
      description: (client as { subline?: string; headline?: string }).subline ?? undefined,
      images: client.hero_url ? [{ url: client.hero_url as string, width: 1280, height: 720 }] : [],
      siteName: client.name,
      type: "website",
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await getClient(slug) as (Awaited<ReturnType<typeof getClient>> & {
    hero_url?: string | null;
    hero_url_mobile?: string | null;
    hero_video_url?: string | null;
  });
  if (!client) notFound();

  const defaults = CATEGORY_DEFAULTS[client.category] ?? CATEGORY_DEFAULTS.variety;

  // Slug-level overrides
  const slugOverrides: Record<string, Partial<CategoryDefaults>> = {
    "luxurious-wholesale-ja": {
      heroHeadline: "Wholesale Fashion & Accessories",
      heroSubline: "Trade prices, MOQ deals, and premium styles for boutiques, vendors, and resellers.",
      ctaLabel: "Browse Catalogue",
      ctaHref: "#wholesale",
    },
    "mini-good-girl": {
      heroHeadline: "Wholesale Snacks & Household Goods",
      heroSubline: "Bulk pricing on beverages, snacks, beauty products, and household essentials.",
      ctaLabel: "Browse Catalogue",
      ctaHref: "#wholesale",
    },
  };

  const finalDefaults = { ...defaults, ...(slugOverrides[slug] ?? {}) };

  // Build nav with shop-category dropdowns
  const COMMERCE_NAV_SLUGS = ["fashion", "food", "variety", "accessories", "crafts", "baby", "bar", "pizza", "baker", "florist"];
  const MENU_NAV_SLUGS = ["food", "pizza", "baker", "bar"];

  const dynamicNavLinks: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
    { label: "Home", href: "/t/" + slug },
  ];

  if (MENU_NAV_SLUGS.includes(client.category)) {
    dynamicNavLinks.push({ label: "Menu", href: "/t/" + slug + "/menu" });
  } else if (COMMERCE_NAV_SLUGS.includes(client.category)) {
    // Fetch distinct product categories for dropdown
    const { data: catRows } = await supabase
      .from("ct_products")
      .select("category")
      .eq("client_id", client.id)
      .eq("active", true)
      .not("category", "is", null);
    const productCats = [...new Set((catRows ?? []).map((r) => r.category as string))].filter(Boolean);
    dynamicNavLinks.push({
      label: "Shop",
      href: "/t/" + slug + "/shop",
      children: productCats.slice(0, 8).map((c) => ({
        label: c,
        href: `/t/${slug}/shop/${encodeURIComponent(c)}`,
      })),
    });
  }

  if (new Set(["beauty", "automotive", "tech-repair", "events", "florist"]).has(client.category)) {
    dynamicNavLinks.push({ label: "Book", href: "#booking" });
  }
  if (new Set(["events", "packaging", "lighting", "furniture", "design", "ceiling"]).has(client.category)) {
    dynamicNavLinks.push({ label: "Quote", href: "#contact" });
  }
  dynamicNavLinks.push(
    { label: "Services", href: "#services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  );

  // Fetch products with category
  const { data: productsRaw } = await supabase
    .from("ct_products")
    .select("id,name,price,currency,description,image_url,category,active")
    .eq("client_id", client.id)
    .eq("active", true)
    .limit(WHOLESALE_SLUGS.has(slug) ? 60 : 12);

  const realServices: ServiceItem[] = (productsRaw ?? []).slice(0, 6).map((p) => ({
    icon: "",
    title: String(p.name ?? ""),
    description: p.description ? String(p.description) : `${String(p.currency ?? "JMD")} ${Number(p.price).toLocaleString()}`,
  }));

  const shopProducts: ShopProduct[] = (productsRaw ?? []).map((p) => ({
    id: String(p.id),
    name: String(p.name ?? ""),
    price: Number(p.price ?? 0),
    currency: String(p.currency ?? "JMD"),
    description: p.description ? String(p.description) : null,
    image_url: p.image_url ? String(p.image_url) : null,
    category: p.category ? String(p.category) : null,
  }));

  const wholesaleProducts: WholesaleProduct[] = shopProducts.map((p) => ({ ...p, moq: 10 }));

  const services = realServices.length > 0 ? realServices : finalDefaults.services;

  const config: ClientConfig = {
    name: client.name,
    category: client.category as ClientConfig["category"],
    logo: client.logo_url ?? "",
    colors: {
      accent: client.accent ?? "#1A1A1A",
      accentFg: client.accent_fg ?? "#FFFFFF",
    },
    contact: {
      phone: client.phone ?? "",
      whatsapp: client.whatsapp ?? "",
      address: client.address ?? undefined,
    },
  };

  const heroUrl = client.hero_url ?? `/heroes/hero-${client.category}-desktop.webp`;
  const heroMobileFallback = (() => {
    if (client.hero_url) {
      const m = (client.hero_url as string).match(/\/heroes\/hero-(.+)-desktop\.webp$/);
      if (m) return `/heroes/hero-${m[1]}-mobile.webp`;
    }
    return `/heroes/hero-${client.category}-mobile.webp`;
  })();
  const heroUrlMobile = client.hero_url_mobile ?? heroMobileFallback;
  const heroVideo = client.hero_video_url ?? VIDEO_CATS[client.category] ?? null;
  const gallery = placeholderGallery(client.category, client.accent);

  const cssVars = `:root{--accent:${client.accent};--accent-fg:${client.accent_fg};--bg:#FFFFFF;--bg-card:#FFFFFF;--bg-surface:#F9FAFB;--text-primary:#111111;--text-secondary:#4B5563;--text-muted:#9CA3AF;--border:#E5E7EB;--radius-lg:12px;}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <SiteLayout
        config={config}
        navLinks={dynamicNavLinks}
        ctaLabel={finalDefaults.ctaLabel}
        ctaHref={finalDefaults.ctaHref}
      >
        <SiteHero
          config={config}
          headline={client.headline ?? finalDefaults.heroHeadline}
          subline={client.subline ?? finalDefaults.heroSubline}
          bgImage={heroUrl}
          bgImageMobile={heroUrlMobile}
          bgVideo={heroVideo}
          ctaLabel={finalDefaults.ctaLabel}
          ctaHref={finalDefaults.ctaHref}
        />

        <ServicesGrid items={services} heading={["automotive", "tech-repair", "beauty", "florist", "events"].includes(client.category) ? "Our Services" : "What We Offer"} />

        <AnimatedStats stats={finalDefaults.stats} />

        <GalleryCarousel images={gallery} heading="Gallery" />

        <Testimonials reviews={finalDefaults.testimonials} />

        {BOOKING_CATS.has(client.category) && (
          <section id="booking" style={{ padding: "64px 24px", background: "var(--bg)" }}>
            <div style={{ maxWidth: 520, margin: "0 auto" }}>
              <BookingWidget
                services={finalDefaults.bookingServices ?? defaults.services.map((s) => s.title)}
                slug={slug}
                whatsapp={client.whatsapp}
              />
            </div>
          </section>
        )}

        {WHOLESALE_SLUGS.has(slug) ? (
          <WholesaleGrid
            slug={slug}
            products={wholesaleProducts}
            heading="Wholesale Catalogue"
            whatsapp={client.whatsapp}
            businessName={client.name}
          />
        ) : COMMERCE_CATS.has(client.category) ? (
          <ShopGrid
            config={config}
            products={shopProducts}
            heading="Shop Our Collection"
            whatsapp={client.whatsapp}
            slug={slug}
          />
        ) : FOOD_CATS.has(client.category) ? (
          <>
            <MenuGrid
              config={config}
              items={shopProducts}
              slug={slug}
              heading={CAKE_SLUGS.has(slug) ? "Our Menu" : "Order Now"}
              whatsapp={client.whatsapp ?? undefined}
            />
            {CAKE_SLUGS.has(slug) && (
              <CakeOrderForm
                businessName={client.name}
                slug={slug}
                whatsapp={client.whatsapp ?? undefined}
                accent={client.accent}
                accentFg={client.accent_fg}
              />
            )}
          </>
        ) : null}

        {QUOTE_CATS.has(client.category) && (
          <QuoteForm
            items={shopProducts.length > 0 ? shopProducts as QuoteItem[] : finalDefaults.services.map((s, i) => ({ id: String(i), name: s.title, description: s.description }))}
            clientSlug={slug}
            phone={client.phone ?? undefined}
            whatsapp={client.whatsapp ?? undefined}
            accent={client.accent}
            accentFg={client.accent_fg}
          />
        )}

        <ContactForm config={config} slug={slug} />
      </SiteLayout>

      {/* Admin CRM footer link — hidden from customers, visible to business owner */}
      {SLUG_TO_CRM[slug] && (
        <div style={{ padding: "12px 24px", background: "#111", textAlign: "center" }}>
          <a href={`/crm/${SLUG_TO_CRM[slug]}?slug=${slug}`}
            style={{ fontSize: 12, color: "#666", textDecoration: "none", fontWeight: 500, letterSpacing: 0.5 }}>
            ⚙ Admin Dashboard
          </a>
        </div>
      )}
    </>
  );
}
