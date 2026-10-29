export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getClient } from "@/lib/ct-client";
import type { Metadata } from "next";
import type { ClientConfig } from "@shared/types/config";
import { SiteLayout } from "@shared/components/layout/SiteLayout";
import { SiteHero } from "@shared/components/sections/SiteHero";
import { ServicesGrid } from "@shared/components/sections/ServicesGrid";
import { AnimatedStats } from "@shared/components/sections/AnimatedStats";
import { GalleryCarousel } from "@shared/components/sections/GalleryCarousel";
import { Testimonials } from "@shared/components/sections/Testimonials";
import { BookingWidget } from "@shared/components/sections/BookingWidget";
import { ContactForm } from "@shared/components/sections/ContactForm";
import type { ServiceItem } from "@shared/components/sections/ServicesGrid";
import type { Stat } from "@shared/components/sections/AnimatedStats";

type GalleryImage = { src: string; alt: string };
type Review = { name: string; rating: number; text: string };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
  beauty: [
    { src: "/gallery/beauty-1.jpg", alt: "Gel nail art" },
    { src: "/gallery/beauty-2.jpg", alt: "Nail application" },
    { src: "/gallery/beauty-3.jpg", alt: "Polish display" },
    { src: "/gallery/beauty-4.jpg", alt: "Pedicure spa" },
    { src: "/gallery/beauty-5.jpg", alt: "Salon interior" },
    { src: "/gallery/beauty-6.jpg", alt: "Nail art design" },
  ],
  automotive: [
    { src: "/gallery/auto-1.jpg", alt: "Engine work" },
    { src: "/gallery/auto-2.jpg", alt: "Diagnostics" },
    { src: "/gallery/auto-3.jpg", alt: "Tire mounting" },
    { src: "/gallery/auto-4.jpg", alt: "Spray booth" },
    { src: "/gallery/auto-5.jpg", alt: "Car on lift" },
    { src: "/gallery/auto-6.jpg", alt: "Turbo engine" },
  ],
  furniture: [
    { src: "/gallery/furniture-1.jpg", alt: "Living room set" },
    { src: "/gallery/furniture-2.jpg", alt: "Bedroom set" },
    { src: "/gallery/furniture-3.jpg", alt: "Home office" },
    { src: "/gallery/furniture-4.jpg", alt: "Outdoor patio" },
    { src: "/gallery/furniture-5.jpg", alt: "Woodworking" },
    { src: "/gallery/furniture-6.jpg", alt: "Showroom floor" },
  ],
};

function placeholderGallery(category: string, _accent: string, count = 6): GalleryImage[] {
  const known = GALLERY_IMAGES[category];
  if (known) return known.slice(0, count);
  // No category-specific gallery yet — return empty to avoid broken images
  return [];
}

const CATEGORY_DEFAULTS: Record<string, Omit<CategoryDefaults, "gallery">> = {
  beauty: {
    heroHeadline: "Feel Beautiful, Inside and Out",
    heroSubline: "Professional hair, nails, skincare, and spa services. By appointment.",
    ctaLabel: "Book Now",
    ctaHref: "#booking",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Book", href: "#booking" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Hair Services", description: "Relaxers, naturals, braids, weaves, colour, and treatments.", image: "/services/beauty-1.jpg" },
      { icon: "", title: "Nail Services", description: "Gel, acrylic, pedicures, and nail art.", image: "/services/beauty-2.jpg" },
      { icon: "", title: "Skincare & Spa", description: "Facials, waxing, brow design, and relaxation treatments.", image: "/services/beauty-3.jpg" },
    ],
    stats: [
      { value: 3000, suffix: "+", label: "Clients Served" },
      { value: 15, label: "Years Experience" },
      { value: 5, label: "Avg Rating" },
      { value: 100, suffix: "%", label: "Licensed Professionals" },
    ],
    testimonials: [
      { name: "Tamara W.", rating: 5, text: "My hair has never looked better. The team is professional and caring." },
      { name: "Nicole B.", rating: 5, text: "Got my nails done for my wedding -- perfection. Highly recommend!" },
      { name: "Kareema J.", rating: 5, text: "Best facial I've ever had. My skin glowed for weeks." },
    ],
    bookingServices: ["Hair Services", "Nail Services", "Skincare & Spa", "Waxing & Brow Design", "Pedicure"],
  },
  automotive: {
    heroHeadline: "Expert Auto Service You Can Trust",
    heroSubline: "Diagnostics, repairs, and performance upgrades for all makes and models.",
    ctaLabel: "Book a Service",
    ctaHref: "#booking",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Book", href: "#booking" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Engine Diagnostics", description: "Full computerised diagnosis for all vehicle systems.", image: "/services/auto-1.jpg" },
      { icon: "", title: "Performance Upgrades", description: "Turbos, exhausts, suspension tuning, and more.", image: "/services/auto-2.jpg" },
      { icon: "", title: "Electrical & A/C", description: "Wiring repairs, A/C regas, and electrical fault finding.", image: "/services/auto-3.jpg" },
      { icon: "", title: "Bodywork & Paint", description: "Panel repairs, custom paint, and detailing.", image: "/services/auto-4.jpg" },
      { icon: "", title: "Routine Maintenance", description: "Oil changes, brakes, tyres, and scheduled services.", image: "/services/auto-5.jpg" },
    ],
    stats: [
      { value: 5000, suffix: "+", label: "Vehicles Serviced" },
      { value: 12, label: "Years Experience" },
      { value: 98, suffix: "%", label: "Customer Satisfaction" },
      { value: 3, label: "Certified Technicians" },
    ],
    testimonials: [
      { name: "Damion P.", rating: 5, text: "They diagnosed a fault three other shops missed. Car runs perfect now." },
      { name: "Sasha T.", rating: 5, text: "Fast turnaround, honest pricing, and brilliant work on my engine." },
      { name: "Andre M.", rating: 4, text: "Brought my JDM import here for a full service. Very impressed." },
    ],
    bookingServices: ["Engine Diagnostics", "Performance Upgrade", "Electrical Repair", "A/C Service", "Bodywork & Paint", "Routine Maintenance"],
  },
  furniture: {
    heroHeadline: "Furniture Built to Last a Lifetime",
    heroSubline: "Custom and ready-made pieces for every space. Quality craftsmanship, honest prices.",
    ctaLabel: "Request a Quote",
    ctaHref: "#contact",
    navLinks: [
      { label: "Products", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Living Room", description: "Sofas, sectionals, coffee tables, TV stands, and shelving.", image: "/services/furniture-1.jpg" },
      { icon: "", title: "Bedroom", description: "Beds, dressers, wardrobes, and nightstands.", image: "/services/furniture-2.jpg" },
      { icon: "", title: "Office & Study", description: "Desks, chairs, bookshelves, and custom fit-outs.", image: "/services/furniture-3.jpg" },
      { icon: "", title: "Custom Pieces", description: "Bespoke furniture built to your exact specifications.", image: "/services/furniture-4.jpg" },
      { icon: "", title: "Outdoor", description: "Patio sets, garden chairs, and weather-resistant pieces.", image: "/services/furniture-5.jpg" },
    ],
    stats: [
      { value: 1200, suffix: "+", label: "Pieces Delivered" },
      { value: 8, label: "Years in Business" },
      { value: 50, suffix: "+", label: "Custom Designs" },
      { value: 100, suffix: "%", label: "Solid Wood Options" },
    ],
    testimonials: [
      { name: "Yvonne A.", rating: 5, text: "Ordered a custom dining set -- exceeded every expectation. Stunning work." },
      { name: "Darren C.", rating: 5, text: "Best furniture store I have dealt with. Delivery was on time, quality is top tier." },
      { name: "Marcia T.", rating: 4, text: "Furnished my whole living room here. Great prices for the quality." },
    ],
  },
  fashion: {
    heroHeadline: "Style That Speaks for Itself",
    heroSubline: "Curated fashion for women who know what they want. New drops every week.",
    ctaLabel: "Shop Now",
    ctaHref: "#services",
    navLinks: [
      { label: "Collections", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Tops & Blouses", description: "Casual, formal, and evening styles for every occasion." },
      { icon: "", title: "Dresses", description: "Minis, midis, maxis, and custom-fit gowns." },
      { icon: "", title: "Bottoms", description: "Jeans, skirts, shorts, and tailored trousers." },
      { icon: "", title: "Sets & Co-ords", description: "Matching two-piece and three-piece sets." },
      { icon: "", title: "Footwear", description: "Heels, flats, sneakers, and statement boots." },
    ],
    stats: [
      { value: 2000, suffix: "+", label: "Happy Customers" },
      { value: 500, suffix: "+", label: "Styles Available" },
      { value: 7, label: "Years in Business" },
      { value: 4, label: "Collections Per Year" },
    ],
    testimonials: [
      { name: "Brianna L.", rating: 5, text: "Everything fits perfectly and the quality is amazing for the price." },
      { name: "Khadija N.", rating: 5, text: "I get compliments every time I wear something from here." },
      { name: "Simone H.", rating: 5, text: "Fast delivery and packaging was beautiful. Will order again." },
    ],
  },
  accessories: {
    heroHeadline: "The Right Accessory Changes Everything",
    heroSubline: "Bags, jewellery, sunglasses, and more. Elevate any outfit instantly.",
    ctaLabel: "Shop Collection",
    ctaHref: "#services",
    navLinks: [
      { label: "Shop", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Handbags & Purses", description: "Totes, clutches, crossbodies, and backpacks." },
      { icon: "", title: "Jewellery", description: "Necklaces, earrings, bracelets, and rings." },
      { icon: "", title: "Sunglasses", description: "Fashion and UV-protective eyewear." },
      { icon: "", title: "Hair Accessories", description: "Clips, headbands, scarves, and bonnets." },
      { icon: "", title: "Belts & Wallets", description: "Leather and faux-leather everyday essentials." },
    ],
    stats: [
      { value: 1500, suffix: "+", label: "Orders Shipped" },
      { value: 300, suffix: "+", label: "Products in Stock" },
      { value: 5, label: "Years Established" },
      { value: 99, suffix: "%", label: "Positive Reviews" },
    ],
    testimonials: [
      { name: "Renee K.", rating: 5, text: "My bag arrived in perfect condition and looks even better in person." },
      { name: "Audrey M.", rating: 5, text: "Quality jewellery at unbeatable prices. My go-to accessory shop." },
      { name: "Tricia V.", rating: 4, text: "Love the variety. Always something new and unique." },
    ],
  },
  food: {
    heroHeadline: "Fresh, Flavourful, and Made with Love",
    heroSubline: "Home-cooked meals, catering, and baked goods for every occasion.",
    ctaLabel: "Order Now",
    ctaHref: "#contact",
    navLinks: [
      { label: "Menu", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Daily Meals", description: "Freshly prepared breakfast, lunch, and dinner options." },
      { icon: "", title: "Catering", description: "Corporate events, parties, weddings, and private functions." },
      { icon: "", title: "Baked Goods", description: "Cakes, pastries, bread, and custom celebration cakes." },
      { icon: "", title: "Meal Prep", description: "Weekly meal prep packages for individuals and families." },
    ],
    stats: [
      { value: 800, suffix: "+", label: "Meals Delivered" },
      { value: 50, suffix: "+", label: "Events Catered" },
      { value: 6, label: "Years Cooking" },
      { value: 100, suffix: "%", label: "Fresh Ingredients" },
    ],
    testimonials: [
      { name: "Paulette G.", rating: 5, text: "The jerk chicken was absolutely delicious. Best I've had in years." },
      { name: "Winston R.", rating: 5, text: "Catered our office party -- everyone raved about the food all week." },
      { name: "Andrea S.", rating: 5, text: "The birthday cake was stunning and tasted even better than it looked." },
    ],
  },
  florist: {
    heroHeadline: "Flowers That Say What Words Cannot",
    heroSubline: "Fresh arrangements, event florals, and same-day delivery.",
    ctaLabel: "Order Flowers",
    ctaHref: "#booking",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Order", href: "#booking" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Fresh Bouquets", description: "Hand-tied arrangements for any occasion." },
      { icon: "", title: "Wedding Florals", description: "Bridal bouquets, centrepieces, and venue decor." },
      { icon: "", title: "Event Styling", description: "Corporate events, birthdays, and special celebrations." },
      { icon: "", title: "Sympathy Flowers", description: "Wreaths, tributes, and condolence arrangements." },
      { icon: "", title: "Subscription", description: "Weekly or monthly fresh flower deliveries." },
    ],
    stats: [
      { value: 4000, suffix: "+", label: "Arrangements Made" },
      { value: 200, suffix: "+", label: "Weddings Styled" },
      { value: 10, label: "Years Established" },
      { value: 5, label: "Avg Rating" },
    ],
    testimonials: [
      { name: "Monique F.", rating: 5, text: "My wedding florals were breathtaking. Every guest commented on them." },
      { name: "Sandra L.", rating: 5, text: "I get a weekly bouquet delivery -- it brightens my whole home." },
      { name: "Keith B.", rating: 5, text: "Ordered a birthday surprise bouquet. My wife was in tears. Perfect." },
    ],
    bookingServices: ["Fresh Bouquet", "Wedding Florals", "Event Styling", "Sympathy Arrangement", "Subscription Delivery"],
  },
  events: {
    heroHeadline: "Your Event, Executed Flawlessly",
    heroSubline: "End-to-end event planning, coordination, and production for every occasion.",
    ctaLabel: "Request a Quote",
    ctaHref: "#booking",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Quote", href: "#booking" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Corporate Events", description: "Conferences, product launches, team events, and award nights." },
      { icon: "", title: "Weddings", description: "Full-service wedding planning and day-of coordination." },
      { icon: "", title: "Birthday Parties", description: "Kids and adults -- intimate or large-scale celebrations." },
      { icon: "", title: "Brand Activations", description: "Pop-ups, experiential events, and trade shows." },
    ],
    stats: [
      { value: 300, suffix: "+", label: "Events Produced" },
      { value: 8, label: "Years in Events" },
      { value: 1000, suffix: "+", label: "Guests Served" },
      { value: 100, suffix: "%", label: "On-Time Execution" },
    ],
    testimonials: [
      { name: "Denise A.", rating: 5, text: "Our product launch was seamless. Every detail was handled perfectly." },
      { name: "Marcus J.", rating: 5, text: "They planned our wedding from start to finish. Absolutely unforgettable." },
      { name: "Tanya R.", rating: 5, text: "Best party planner on the island. My daughter talked about it for months." },
    ],
    bookingServices: ["Corporate Event", "Wedding", "Birthday Party", "Brand Activation", "Private Function"],
  },
  "tech-repair": {
    heroHeadline: "Fast, Reliable Tech Repairs",
    heroSubline: "Phone, laptop, and tablet repairs with genuine parts and a quality guarantee.",
    ctaLabel: "Book a Repair",
    ctaHref: "#booking",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Book", href: "#booking" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Screen Replacement", description: "iPhone, Samsung, iPad, and laptop screen repairs." },
      { icon: "", title: "Battery Replacement", description: "Fast battery swaps for all major phone brands." },
      { icon: "", title: "Water Damage Repair", description: "Component-level cleaning and part replacement." },
      { icon: "", title: "Laptop Repairs", description: "Keyboard, charging port, motherboard, and storage." },
      { icon: "", title: "Software & Recovery", description: "Data recovery, OS reinstalls, and virus removal." },
    ],
    stats: [
      { value: 6000, suffix: "+", label: "Devices Repaired" },
      { value: 98, suffix: "%", label: "Success Rate" },
      { value: 9, label: "Years in Business" },
      { value: 24, label: "Hour Turnaround" },
    ],
    testimonials: [
      { name: "Leroy T.", rating: 5, text: "Fixed my phone in two hours. Cheaper than the official store and better service." },
      { name: "Claudia M.", rating: 5, text: "They recovered all my data from a water-damaged phone. I thought it was gone." },
      { name: "Jerome P.", rating: 4, text: "Laptop screen replaced same day. No issues since." },
    ],
    bookingServices: ["Screen Repair", "Battery Replacement", "Water Damage", "Laptop Repair", "Data Recovery", "Software Fix"],
  },
  packaging: {
    heroHeadline: "Packaging That Sells Before It Opens",
    heroSubline: "Custom boxes, bags, labels, and branded packaging for every product.",
    ctaLabel: "Request a Quote",
    ctaHref: "#contact",
    navLinks: [
      { label: "Products", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Custom Boxes", description: "Folding cartons, mailer boxes, rigid gift boxes." },
      { icon: "", title: "Bags & Pouches", description: "Paper bags, poly bags, stand-up pouches." },
      { icon: "", title: "Labels & Stickers", description: "Product labels, logo stickers, and seal labels." },
      { icon: "", title: "Branded Tissue & Wraps", description: "Custom tissue paper, ribbons, and wrapping." },
      { icon: "", title: "Food Packaging", description: "Takeaway containers, cups, and food-grade wraps." },
    ],
    stats: [
      { value: 500, suffix: "+", label: "Brands Served" },
      { value: 1000000, suffix: "+", label: "Units Produced" },
      { value: 7, label: "Years in Business" },
      { value: 14, label: "Day Turnaround" },
    ],
    testimonials: [
      { name: "Kezia F.", rating: 5, text: "The custom boxes for my skincare line look absolutely luxurious." },
      { name: "Omar S.", rating: 5, text: "Fast production, affordable pricing, and the print quality is superb." },
      { name: "Nadine W.", rating: 4, text: "My food packaging looks professional now. Sales definitely increased." },
    ],
  },
  lighting: {
    heroHeadline: "Light That Transforms Every Space",
    heroSubline: "Indoor, outdoor, commercial, and decorative lighting solutions.",
    ctaLabel: "Shop Lighting",
    ctaHref: "#services",
    navLinks: [
      { label: "Products", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Indoor Lighting", description: "Pendants, chandeliers, recessed, and wall fixtures." },
      { icon: "", title: "Outdoor & Security", description: "Floodlights, pathway lights, and smart security lighting." },
      { icon: "", title: "Commercial", description: "Office, retail, and hospitality lighting projects." },
      { icon: "", title: "LED & Smart Lighting", description: "Energy-efficient bulbs, strips, and smart home systems." },
      { icon: "", title: "Installation", description: "Professional installation and wiring services." },
    ],
    stats: [
      { value: 800, suffix: "+", label: "Projects Completed" },
      { value: 3000, suffix: "+", label: "Products in Catalogue" },
      { value: 11, label: "Years in Business" },
      { value: 40, suffix: "%", label: "Energy Savings Avg" },
    ],
    testimonials: [
      { name: "Colette B.", rating: 5, text: "Completely transformed our living room with their pendant lights." },
      { name: "Devon K.", rating: 5, text: "Best selection of outdoor lighting I found anywhere. Fast delivery too." },
      { name: "Natalie C.", rating: 4, text: "The commercial installation for our office was done neatly and on schedule." },
    ],
  },
  variety: {
    heroHeadline: "Everything You Need, In One Place",
    heroSubline: "Wholesale and retail. Fashion, homeware, tools, gifts, and more.",
    ctaLabel: "Shop Products",
    ctaHref: "#services",
    navLinks: [
      { label: "Products", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Fashion & Clothing", description: "Men's, women's, and children's clothing at wholesale prices." },
      { icon: "", title: "Homeware & Kitchen", description: "Cookware, storage, bedding, and decor." },
      { icon: "", title: "Gifts & Toys", description: "Birthday, holiday, and novelty gift items." },
      { icon: "", title: "Tools & Hardware", description: "Hand tools, power tools, and fixings." },
      { icon: "", title: "Stationery & School", description: "Books, pens, bags, and school supplies." },
    ],
    stats: [
      { value: 5000, suffix: "+", label: "Products in Store" },
      { value: 10000, suffix: "+", label: "Customers Served" },
      { value: 15, label: "Years Trading" },
      { value: 7, label: "Days a Week" },
    ],
    testimonials: [
      { name: "Pauline H.", rating: 5, text: "Best variety store around. I find something new every visit." },
      { name: "Clinton R.", rating: 5, text: "Wholesale prices you cannot beat. Perfect for my small business." },
      { name: "Ingrid W.", rating: 4, text: "Great selection of kids clothes. Good quality for the price." },
    ],
  },
  crafts: {
    heroHeadline: "Handmade with Heart",
    heroSubline: "Unique handcrafted items and custom commissions. One-of-a-kind pieces you will treasure.",
    ctaLabel: "Shop Handmade",
    ctaHref: "#services",
    navLinks: [
      { label: "Shop", href: "#services" },
      { label: "Gallery", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Home Decor", description: "Wall art, macrame, candles, and handmade ornaments." },
      { icon: "", title: "Jewellery & Accessories", description: "Handcrafted earrings, bracelets, and hair pieces." },
      { icon: "", title: "Custom Gifts", description: "Personalised items for birthdays, weddings, and anniversaries." },
      { icon: "", title: "Crochet & Knitting", description: "Bags, hats, blankets, and fashion accessories." },
      { icon: "", title: "Commissions", description: "Custom orders built exactly to your vision." },
    ],
    stats: [
      { value: 700, suffix: "+", label: "Items Sold" },
      { value: 4, label: "Years Creating" },
      { value: 200, suffix: "+", label: "Custom Orders" },
      { value: 100, suffix: "%", label: "Handmade" },
    ],
    testimonials: [
      { name: "Kezia L.", rating: 5, text: "Ordered a custom wreath for Christmas. Absolutely gorgeous, will order again." },
      { name: "Abigail P.", rating: 5, text: "The earrings I got are so unique. Got so many compliments." },
      { name: "Christine O.", rating: 5, text: "Commissioned a birthday gift -- she cried happy tears. Perfect work." },
    ],
  },
};

// ── Appointment-based categories ─────────────────────────────────────────────
const BOOKING_CATS = new Set(["beauty", "florist", "events", "automotive", "tech-repair"]);

// ── Categories with generated hero videos (Wan 3.0) ──────────────────────────
const VIDEO_CATS: Record<string, string> = {
  beauty: "/videos/hero-beauty.mp4",
  events: "/videos/hero-events.mp4",
  food: "/videos/hero-food.mp4",
  automotive: "/videos/hero-automotive.mp4",
  florist: "/videos/hero-florist.mp4",
};

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) return { title: "Not Found" };
  return { title: client.name, description: client.subline ?? client.headline ?? undefined };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await getClient(slug) as (Awaited<ReturnType<typeof getClient>> & { hero_url?: string | null; hero_url_mobile?: string | null; hero_video_url?: string | null });
  if (!client) notFound();

  const defaults = CATEGORY_DEFAULTS[client.category] ?? CATEGORY_DEFAULTS.variety;

  // Fetch real products from Supabase
  const { data: productsRaw } = await supabase
    .from("ct_products")
    .select("id,name,price,currency,description,active")
    .eq("client_id", client.id)
    .eq("active", true)
    .limit(12);

  // Map real products to ServiceItem format if available
  const realServices: ServiceItem[] = (productsRaw ?? []).map((p) => ({
    icon: "",
    title: String(p.name ?? ""),
    description: p.description ? String(p.description) : `${String(p.currency ?? client.currency ?? "JMD")} ${Number(p.price).toLocaleString()}`,
  }));
  const services = realServices.length > 0 ? realServices : defaults.services;

  // Build ClientConfig from Supabase client row
  const config: ClientConfig = {
    name: client.name,
    category: client.category as ClientConfig["category"],
    logo: client.logo_url ?? "",
    colors: {
      accent: client.accent,
      accentFg: client.accent_fg,
    },
    contact: {
      phone: client.phone ?? "",
      whatsapp: client.whatsapp ?? "",
      address: client.address ?? undefined,
    },
  };

  const heroUrl = client.hero_url ?? `/heroes/hero-${client.category}-desktop.png`;
  const heroUrlMobile = client.hero_url_mobile ?? `/heroes/hero-${client.category}-mobile.png`;
  const heroVideo = client.hero_video_url ?? VIDEO_CATS[client.category] ?? null;
  const gallery = placeholderGallery(client.category, client.accent);

  const cssVars = `:root{--accent:${client.accent};--accent-fg:${client.accent_fg};--bg:#FFFFFF;--bg-card:#FFFFFF;--bg-surface:#F9FAFB;--text-primary:#111111;--text-secondary:#4B5563;--text-muted:#9CA3AF;--border:#E5E7EB;--radius-lg:12px;}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      <SiteLayout
        config={config}
        navLinks={defaults.navLinks}
        ctaLabel={defaults.ctaLabel}
        ctaHref={defaults.ctaHref}
      >
        <SiteHero
          config={config}
          headline={client.headline ?? defaults.heroHeadline}
          subline={client.subline ?? defaults.heroSubline}
          bgImage={heroUrl}
          bgImageMobile={heroUrlMobile}
          bgVideo={heroVideo}
          ctaLabel={defaults.ctaLabel}
          ctaHref={defaults.ctaHref}
        />

        <ServicesGrid items={services} heading={["automotive", "tech-repair", "beauty", "florist", "events"].includes(client.category) ? "Our Services" : "What We Offer"} />

        <AnimatedStats stats={defaults.stats} />

        <GalleryCarousel images={gallery} heading="Gallery" />

        <Testimonials reviews={defaults.testimonials} />

        {BOOKING_CATS.has(client.category) && (
          <section id="booking" className="py-16 px-6 bg-[var(--bg)]">
            <div className="mx-auto max-w-xl">
              <BookingWidget
                services={defaults.bookingServices ?? defaults.services.map((s) => s.title)}
                slug={slug}
                whatsapp={client.whatsapp}
              />
            </div>
          </section>
        )}

        <ContactForm config={config} />
      </SiteLayout>
    </>
  );
}
