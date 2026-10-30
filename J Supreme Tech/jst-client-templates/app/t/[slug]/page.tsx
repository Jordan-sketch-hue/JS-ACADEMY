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
import { ShopGrid } from "@shared/components/sections/ShopGrid";
import { QuoteForm } from "@shared/components/sections/QuoteForm";
import type { ShopProduct } from "@shared/components/sections/ShopGrid";
import type { ServiceItem } from "@shared/components/sections/ServicesGrid";
import type { Stat } from "@shared/components/sections/AnimatedStats";
import { MenuGrid } from "@shared/components/sections/MenuGrid";
import { ServiceGrid } from "@shared/components/sections/ServiceGrid";
import type { MenuItem } from "@shared/components/sections/MenuGrid";
import type { ServiceCard } from "@shared/components/sections/ServiceGrid";

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
  florist: [
    { src: "/gallery/florist/florist-1.webp", alt: "Floral arrangement 1" },
    { src: "/gallery/florist/florist-2.webp", alt: "Floral arrangement 2" },
    { src: "/gallery/florist/florist-3.webp", alt: "Floral arrangement 3" },
    { src: "/gallery/florist/florist-4.webp", alt: "Floral arrangement 4" },
    { src: "/gallery/florist/florist-5.webp", alt: "Floral arrangement 5" },
    { src: "/gallery/florist/florist-6.webp", alt: "Floral arrangement 6" },
  ],
  food: [
    { src: "/gallery/food/food-1.webp", alt: "Food presentation 1" },
    { src: "/gallery/food/food-2.webp", alt: "Food presentation 2" },
    { src: "/gallery/food/food-3.webp", alt: "Food presentation 3" },
    { src: "/gallery/food/food-4.webp", alt: "Food presentation 4" },
    { src: "/gallery/food/food-5.webp", alt: "Food presentation 5" },
    { src: "/gallery/food/food-6.webp", alt: "Food presentation 6" },
  ],
  lighting: [
    { src: "/gallery/lighting/lighting-1.webp", alt: "Lighting product 1" },
    { src: "/gallery/lighting/lighting-2.webp", alt: "Lighting product 2" },
    { src: "/gallery/lighting/lighting-3.webp", alt: "Lighting product 3" },
    { src: "/gallery/lighting/lighting-4.webp", alt: "Lighting product 4" },
    { src: "/gallery/lighting/lighting-5.webp", alt: "Lighting product 5" },
    { src: "/gallery/lighting/lighting-6.webp", alt: "Lighting product 6" },
  ],
  packaging: [
    { src: "/gallery/packaging/packaging-1.webp", alt: "Packaging design 1" },
    { src: "/gallery/packaging/packaging-2.webp", alt: "Packaging design 2" },
    { src: "/gallery/packaging/packaging-3.webp", alt: "Packaging design 3" },
    { src: "/gallery/packaging/packaging-4.webp", alt: "Packaging design 4" },
    { src: "/gallery/packaging/packaging-5.webp", alt: "Packaging design 5" },
    { src: "/gallery/packaging/packaging-6.webp", alt: "Packaging design 6" },
  ],
  "tech-repair": [
    { src: "/gallery/tech-repair/tech-repair-1.webp", alt: "Tech repair 1" },
    { src: "/gallery/tech-repair/tech-repair-2.webp", alt: "Tech repair 2" },
    { src: "/gallery/tech-repair/tech-repair-3.webp", alt: "Tech repair 3" },
    { src: "/gallery/tech-repair/tech-repair-4.webp", alt: "Tech repair 4" },
    { src: "/gallery/tech-repair/tech-repair-5.webp", alt: "Tech repair 5" },
    { src: "/gallery/tech-repair/tech-repair-6.webp", alt: "Tech repair 6" },
  ],
  variety: [
    { src: "/gallery/variety/variety-1.webp", alt: "Variety store 1" },
    { src: "/gallery/variety/variety-2.webp", alt: "Variety store 2" },
    { src: "/gallery/variety/variety-3.webp", alt: "Variety store 3" },
    { src: "/gallery/variety/variety-4.webp", alt: "Variety store 4" },
    { src: "/gallery/variety/variety-5.webp", alt: "Variety store 5" },
    { src: "/gallery/variety/variety-6.webp", alt: "Variety store 6" },
  ],
  beauty: [
    { src: "/gallery/beauty-1.jpg", alt: "Nail art service" },
    { src: "/gallery/beauty-2.jpg", alt: "Gel manicure" },
    { src: "/gallery/beauty-3.jpg", alt: "Acrylic nails" },
    { src: "/gallery/beauty-4.jpg", alt: "Nail art design" },
    { src: "/gallery/beauty-5.jpg", alt: "Pedicure service" },
    { src: "/gallery/beauty-6.jpg", alt: "French tips" },
  ],
  automotive: [
    { src: "/gallery/auto-1.jpg", alt: "Auto repair service" },
    { src: "/gallery/auto-2.jpg", alt: "Engine diagnostics" },
    { src: "/gallery/auto-3.jpg", alt: "Brake service" },
    { src: "/gallery/auto-4.jpg", alt: "Oil change" },
    { src: "/gallery/auto-5.jpg", alt: "Tyre service" },
    { src: "/gallery/auto-6.jpg", alt: "Car wash and detailing" },
  ],
  furniture: [
    { src: "/gallery/furniture-1.jpg", alt: "Living room furniture" },
    { src: "/gallery/furniture-2.jpg", alt: "Bedroom set" },
    { src: "/gallery/furniture-3.jpg", alt: "Dining furniture" },
    { src: "/gallery/furniture-4.jpg", alt: "Office furniture" },
    { src: "/gallery/furniture-5.jpg", alt: "Outdoor furniture" },
    { src: "/gallery/furniture-6.jpg", alt: "Custom furniture" },
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
      { icon: "", title: "Gel Polish", description: "Long-lasting gel colour in hundreds of shades. Chip-free finish.", image: "/services/beauty-1.jpg" },
      { icon: "", title: "Acrylic Nails", description: "Full sets, infills, and extensions sculpted to your style.", image: "/services/beauty-2.jpg" },
      { icon: "", title: "Nail Art & Design", description: "Chrome, ombre, 3D art, foils, and hand-painted designs.", image: "/services/beauty-3.jpg" },
      { icon: "", title: "Manicure", description: "Classic, spa, and luxury manicures with cuticle care.", image: "/services/beauty-1.jpg" },
      { icon: "", title: "Pedicure", description: "Foot soak, exfoliation, cuticle care, and polish.", image: "/services/beauty-2.jpg" },
      { icon: "", title: "French Tips", description: "Classic French, reverse French, and coloured tip variations.", image: "/services/beauty-3.jpg" },
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
      { icon: "", title: "Dine In", description: "Fresh, flavourful plates made to order in a welcoming space." },
      { icon: "", title: "Takeout & Delivery", description: "Order online or by phone -- ready when you are." },
      { icon: "", title: "Catering", description: "Corporate events, birthdays, and private functions catered on demand." },
      { icon: "", title: "Baked Goods", description: "Pastries, custom cakes, and baked-to-order desserts." },
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

  design: {
    heroHeadline: "Design That Makes People Stop",
    heroSubline: "Logos, branding, print, and digital graphics that set your business apart.",
    ctaLabel: "Get a Quote",
    ctaHref: "#contact",
    navLinks: [
      { label: "Services", href: "#services" },
      { label: "Portfolio", href: "#gallery" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#contact" },
    ],
    services: [
      { icon: "", title: "Logo Design", description: "Original, scalable logos built around your brand identity." },
      { icon: "", title: "Branding & Identity", description: "Full brand kits including colours, fonts, and brand guidelines." },
      { icon: "", title: "Print Design", description: "Flyers, brochures, posters, and business stationery." },
      { icon: "", title: "Banners & Signage", description: "Roll-up banners, billboard designs, and event signage." },
      { icon: "", title: "Social Media Graphics", description: "Posts, stories, ads, and branded templates for every platform." },
      { icon: "", title: "Business Cards", description: "Premium business card designs in standard and custom formats." },
    ],
    stats: [
      { value: 500, suffix: "+", label: "Projects Delivered" },
      { value: 150, suffix: "+", label: "Brands Created" },
      { value: 8, label: "Years in Design" },
      { value: 100, suffix: "%", label: "Client Satisfaction" },
    ],
    testimonials: [
      { name: "Marcia L.", rating: 5, text: "Our new logo completely transformed how clients see us. Phenomenal work." },
      { name: "Devon H.", rating: 5, text: "Fast turnaround, great communication, and the designs were top notch." },
      { name: "Simone T.", rating: 5, text: "The branding package was worth every dollar. My business looks professional now." },
    ],
    bookingServices: ["Logo Design", "Brand Identity", "Print Design", "Social Media Graphics", "Business Cards", "Signage"],
  },  crafts: {
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
const COMMERCE_CATS = new Set(["fashion", "food", "variety", "accessories", "crafts", "baby", "bar", "pizza", "baker", "florist"]);
const QUOTE_CATS = new Set(["events", "packaging", "lighting", "furniture", "design", "ceiling"]);

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
  return {
    title: `${client.name} | Jamaica`,
    description: client.subline ?? client.headline ?? undefined,
    openGraph: {
      title: client.name,
      description: client.subline ?? client.headline ?? undefined,
      images: client.hero_url ? [{ url: client.hero_url, width: 1280, height: 720 }] : [],
      siteName: client.name,
      type: "website",
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await getClient(slug) as (Awaited<ReturnType<typeof getClient>> & { hero_url?: string | null; hero_url_mobile?: string | null; hero_video_url?: string | null });
  if (!client) notFound();

  const defaults = CATEGORY_DEFAULTS[client.category] ?? CATEGORY_DEFAULTS.variety;

  // Slug-level overrides for businesses whose DB category does not match their trade
  const slugDefaults: Record<string, Partial<typeof defaults>> = {
    "ecm-graphics": CATEGORY_DEFAULTS.design ?? defaults,

    // Bar supplies — was keyed to wrong slug
    "cassie-bar": {
      ...CATEGORY_DEFAULTS.packaging,
      heroHeadline: "Everything Your Bar Needs",
      heroSubline: "Straws, cups, cocktail tools, bar accessories, and beverage supplies for events and businesses.",
      services: [
        { icon: "", title: "Bar Straws & Cups", description: "Paper straws, reusable cups, and cocktail glasses for every occasion." },
        { icon: "", title: "Cocktail Tools", description: "Shakers, jiggers, muddlers, bar spoons, and mixing equipment." },
        { icon: "", title: "Beverage Supplies", description: "Syrups, bitters, garnish picks, and bar essentials." },
        { icon: "", title: "Event Bar Kits", description: "Full bar setup kits for weddings, parties, and corporate events." },
        { icon: "", title: "Custom Branding", description: "Branded cups, straws, and packaging for bars and restaurants." },
      ],
    },

    // Hair salons mis-categorised as beauty (nail defaults) or fashion
    "sincerely-sparks": {
      ...CATEGORY_DEFAULTS.beauty,
      heroHeadline: "The Hairdresser to Vibe With",
      heroSubline: "Walk-ins welcome. Cuts, colour, styling, and braids by skilled hands.",
      services: [
        { icon: "", title: "Haircut & Trim", description: "Precision cuts for all hair types -- relaxed, natural, and transitioning.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Colour & Highlights", description: "Single-process colour, balayage, highlights, and colour corrections.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Blow Dry & Styling", description: "Sleek blow-outs, roller sets, and finish styling.", image: "/services/beauty-3.jpg" },
        { icon: "", title: "Braids & Protective Styles", description: "Box braids, knotless braids, cornrows, and loc maintenance.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Natural Hair", description: "Twist-outs, wash-and-gos, and deep conditioning treatments.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Relaxer & Texturiser", description: "Professional relaxer application with conditioning care.", image: "/services/beauty-3.jpg" },
      ],
      bookingServices: ["Haircut & Trim", "Colour Treatment", "Blow Dry & Style", "Braids & Protective", "Natural Hair Treatment", "Relaxer"],
    },

    "westside-mandeville": {
      ...CATEGORY_DEFAULTS.beauty,
      heroHeadline: "The Hairdresser Mandeville Trusts",
      heroSubline: "Cuts, colour, and styling in the heart of Mandeville.",
      services: [
        { icon: "", title: "Haircut & Trim", description: "Precision cuts tailored to your face shape and style goals.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Colour & Highlights", description: "Balayage, single-process colour, highlights, and colour corrections.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Blow Dry & Styling", description: "Smooth blow-outs, roller sets, and special occasion styling.", image: "/services/beauty-3.jpg" },
        { icon: "", title: "Braids & Loc Styles", description: "Box braids, knotless braids, cornrows, and starter locs.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Natural Hair Care", description: "Twist-outs, bantu knots, wash-and-gos, and deep treatments.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Relaxer & Texturiser", description: "Professional relaxer application with nourishing aftercare.", image: "/services/beauty-3.jpg" },
      ],
      bookingServices: ["Haircut & Trim", "Colour Treatment", "Blow Dry & Style", "Braids", "Natural Hair", "Relaxer"],
    },

    // General beauty salon (hair + nails + skincare)
    "beauty-lounge-sydz": {
      ...CATEGORY_DEFAULTS.beauty,
      heroHeadline: "Feel Beautiful, Inside and Out",
      heroSubline: "Hair, nails, skincare, and spa services by appointment.",
      services: [
        { icon: "", title: "Hair Services", description: "Cuts, colour, blow-dry, braids, and natural hair styling.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Gel & Acrylic Nails", description: "Gel polish, acrylic sets, nail art, and infills.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Manicure & Pedicure", description: "Classic and luxury mani-pedi with exfoliation and massage.", image: "/services/beauty-3.jpg" },
        { icon: "", title: "Facial & Skincare", description: "Deep cleanse, exfoliation, and brightening facials.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Waxing & Brow Design", description: "Brow shaping, tinting, and full-body waxing.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Lash & Makeup", description: "Lash extensions, lash lifts, and full makeup application.", image: "/services/beauty-3.jpg" },
      ],
      bookingServices: ["Hair Services", "Nail Services", "Manicure & Pedicure", "Facial & Skincare", "Waxing & Brows", "Lash & Makeup"],
    },

    // Cosmetics retail -- products, not salon services
    "blye-beauty": {
      ...CATEGORY_DEFAULTS.beauty,
      heroHeadline: "Cosmetics, Skincare & Beauty Tools",
      heroSubline: "Two convenient locations. Everything you need for your beauty routine.",
      ctaLabel: "Shop Now",
      ctaHref: "#services",
      services: [
        { icon: "", title: "Makeup & Cosmetics", description: "Foundations, concealers, eyeshadow, lipstick, and full face products.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Skincare", description: "Cleansers, serums, moisturisers, SPF, and treatment products.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Haircare", description: "Shampoos, conditioners, deep treatments, and styling products.", image: "/services/beauty-3.jpg" },
        { icon: "", title: "Nail Products", description: "Gel polishes, base coats, nail tools, and nail art supplies.", image: "/services/beauty-1.jpg" },
        { icon: "", title: "Beauty Tools", description: "Brushes, sponges, lash curlers, and professional-grade accessories.", image: "/services/beauty-2.jpg" },
        { icon: "", title: "Fragrances & Body", description: "Perfumes, body lotions, scrubs, and bath essentials.", image: "/services/beauty-3.jpg" },
      ],
      bookingServices: [],
    },

    // Ceiling installation -- mis-categorised as furniture
    "atelier-luxridge": {
      ...CATEGORY_DEFAULTS.furniture,
      heroHeadline: "Premium PVC Ceiling Panels",
      heroSubline: "Installed across Jamaica. Durable, stylish, and low-maintenance interior solutions.",
      ctaLabel: "Request a Quote",
      ctaHref: "#contact",
      navLinks: [
        { label: "Services", href: "#services" },
        { label: "Gallery", href: "#gallery" },
        { label: "Reviews", href: "#testimonials" },
        { label: "Contact", href: "#contact" },
      ],
      services: [
        { icon: "", title: "PVC Ceiling Panels", description: "Lightweight, waterproof ceiling panels in dozens of finishes and textures.", image: "/services/furniture-1.jpg" },
        { icon: "", title: "Ceiling Installation", description: "Full installation service -- residential, commercial, and rental properties.", image: "/services/furniture-2.jpg" },
        { icon: "", title: "Wall Cladding", description: "PVC wall panels for kitchens, bathrooms, and living spaces.", image: "/services/furniture-3.jpg" },
        { icon: "", title: "Cornice & Moulding", description: "Decorative cornices and trim to finish any ceiling installation.", image: "/services/furniture-4.jpg" },
        { icon: "", title: "Supply Only", description: "Bulk panel supply for contractors and large-scale projects.", image: "/services/furniture-5.jpg" },
      ],
      stats: [
        { value: 800, suffix: "+", label: "Rooms Installed" },
        { value: 10, label: "Years Experience" },
        { value: 100, suffix: "+", label: "Finishes Available" },
        { value: 100, suffix: "%", label: "Waterproof Product" },
      ],
      testimonials: [
        { name: "Delroy W.", rating: 5, text: "They installed ceilings throughout my entire house. Clean work, great finish." },
        { name: "Pauline S.", rating: 5, text: "Used them for a rental property. Tenants love the look. Highly recommend." },
        { name: "Mark C.", rating: 4, text: "Fast installation, no mess, and the panels look premium. Will use again." },
      ],
    },

    // Mobile auto detailing -- automotive defaults are for mechanical repair
    "buff-n-beam": {
      ...CATEGORY_DEFAULTS.automotive,
      heroHeadline: "Mobile Auto Detailing, Done Right",
      heroSubline: "We come to you. Full interior and exterior detailing at your doorstep.",
      services: [
        { icon: "", title: "Full Detail Package", description: "Complete interior and exterior detail -- wash, wax, vacuum, and clean.", image: "/services/auto-1.jpg" },
        { icon: "", title: "Exterior Wash & Polish", description: "Hand wash, clay bar, machine polish, and UV wax protection.", image: "/services/auto-2.jpg" },
        { icon: "", title: "Interior Deep Clean", description: "Vacuum, steam clean, leather condition, and odour treatment.", image: "/services/auto-3.jpg" },
        { icon: "", title: "Engine Bay Clean", description: "Safe degreasing and detailing of the engine compartment.", image: "/services/auto-4.jpg" },
        { icon: "", title: "Ceramic Coating", description: "Long-lasting ceramic paint protection for showroom shine.", image: "/services/auto-5.jpg" },
      ],
      bookingServices: ["Full Detail Package", "Exterior Wash & Polish", "Interior Deep Clean", "Engine Bay Clean", "Ceramic Coating"],
    },

    // Bakers -- food defaults lead with Dine In which is wrong for home bakers
    "keke-the-baker": {
      ...CATEGORY_DEFAULTS.food,
      heroHeadline: "Designer Cakes & Mini Desserts",
      heroSubline: "Custom celebration cakes, cupcakes, dessert boards, and mini treats.",
      ctaLabel: "Order a Cake",
      ctaHref: "#contact",
      services: [
        { icon: "", title: "Custom Cakes", description: "Birthday, wedding, graduation, and anniversary cakes designed to order." },
        { icon: "", title: "Mini Desserts", description: "Cupcakes, cake pops, brownie bites, and dessert shooters." },
        { icon: "", title: "Dessert Boards", description: "Grazing boards, sweet charcuterie, and dessert spreads for events." },
        { icon: "", title: "Flavours & Tiers", description: "Vanilla, red velvet, carrot cake, marble, and more -- single or tiered." },
        { icon: "", title: "Catering & Events", description: "Dessert tables and bulk orders for weddings, parties, and corporates." },
      ],
    },

    "sweet-face-pastries": {
      ...CATEGORY_DEFAULTS.food,
      heroHeadline: "Custom Cakes & Pastries",
      heroSubline: "Handmade pastries and celebration cakes baked with love.",
      ctaLabel: "Order Now",
      ctaHref: "#contact",
      services: [
        { icon: "", title: "Custom Cakes", description: "Celebration cakes designed to your theme -- birthday, wedding, or corporate." },
        { icon: "", title: "Pastries & Bakes", description: "Croissants, tarts, cheesecakes, and daily baked goods." },
        { icon: "", title: "Cupcakes", description: "Classic and specialty cupcakes in custom flavours and designs." },
        { icon: "", title: "Dessert Boxes", description: "Assorted dessert gift boxes for any occasion." },
        { icon: "", title: "Catering Orders", description: "Bulk pastry orders and dessert stations for events." },
      ],
    },

      "velvet-vault": {
        ...CATEGORY_DEFAULTS.fashion ?? defaults,
        heroHeadline: "Luxury Wholesale, Redefined",
        heroSubline: "Premium fashion, accessories, and luxury goods at wholesale prices. Shop the collection.",
        services: [
          { icon: "", title: "Luxury Handbags", description: "Designer-inspired and premium branded handbags at wholesale prices." },
          { icon: "", title: "Fashion Accessories", description: "Jewellery, scarves, belts, sunglasses, and statement pieces in bulk." },
          { icon: "", title: "Clothing & Apparel", description: "Dresses, tops, sets, and co-ords -- curated luxury styles at trade prices." },
          { icon: "", title: "Beauty & Fragrance", description: "Wholesale beauty products, perfumes, and luxury body care." },
          { icon: "", title: "Wholesale Bundles", description: "Mixed product bundles for resellers, boutiques, and event vendors." },
        ],
        ctaLabel: "Shop Wholesale",
        ctaHref: "#contact",
        bookingServices: [],
      },

      "chichaven": {
        ...CATEGORY_DEFAULTS.fashion ?? defaults,
        heroHeadline: "Fashion That Speaks for You",
        heroSubline: "Curated styles, bold looks, and pieces that make a statement -- for the woman who owns every room.",
        services: [
          { icon: "", title: "Dresses & Sets", description: "Party dresses, co-ords, and occasion sets for every event." },
          { icon: "", title: "Tops & Bodysuits", description: "On-trend tops, bodysuits, and statement blouses." },
          { icon: "", title: "Bottoms", description: "Trousers, skirts, shorts, and jeans in fresh season styles." },
          { icon: "", title: "Accessories", description: "Bags, jewellery, and accessories to complete any look." },
          { icon: "", title: "New Arrivals", description: "Weekly drops -- fresh styles added every week." },
        ],
        ctaLabel: "Shop Now",
        ctaHref: "#services",
        bookingServices: [],
      },
  };
  const finalDefaults = { ...defaults, ...(slugDefaults[slug] ?? {}) };
  // Build real inner-page nav links (replace anchor-only links with routed pages)
  const COMMERCE_NAV_SLUGS = ["fashion","food","variety","accessories","crafts","baby","bar","pizza","baker","florist"];
  const BOOKING_NAV_SLUGS = ["beauty","automotive","tech-repair","events","florist","furniture","design"];
  const QUOTE_NAV_SLUGS = ["events","packaging","lighting","furniture","design","ceiling"];
  const MENU_NAV_SLUGS = ["food","pizza","baker","bar"];

  const dynamicNavLinks: { label: string; href: string }[] = [
    { label: "Home", href: "/t/" + slug },
  ];
  if (MENU_NAV_SLUGS.includes(client.category)) {
    dynamicNavLinks.push({ label: "Menu", href: "/t/" + slug + "/menu" });
  } else if (COMMERCE_NAV_SLUGS.includes(client.category)) {
    dynamicNavLinks.push({ label: "Shop", href: "/t/" + slug + "/shop" });
  }
  if (BOOKING_NAV_SLUGS.includes(client.category)) {
    dynamicNavLinks.push({ label: "Book", href: "/t/" + slug + "/book" });
  }
  if (QUOTE_NAV_SLUGS.includes(client.category)) {
    dynamicNavLinks.push({ label: "Quote", href: "/t/" + slug + "/quote" });
  }
  dynamicNavLinks.push(
    { label: "Services", href: "/t/" + slug + "/services" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  );

  // Fetch real products from Supabase
  const { data: productsRaw } = await supabase
    .from("ct_products")
    .select("id,name,price,currency,description,image_url,active,category")
    .eq("client_id", client.id)
    .eq("active", true)
    .limit(12);

  // Map real products to ServiceItem format if available
  const realServices: ServiceItem[] = (productsRaw ?? []).map((p) => ({
    icon: "",
    title: String(p.name ?? ""),
    description: p.description ? String(p.description) : `${String(p.currency ?? client.currency ?? "JMD")} ${Number(p.price).toLocaleString()}`,
  }));
  // Build ShopProduct array for commerce grid
  const shopProducts: ShopProduct[] = (productsRaw ?? []).map((p) => ({
    id: String(p.id),
    name: String(p.name ?? ""),
    price: Number(p.price ?? 0),
    currency: String(p.currency ?? client.currency ?? "JMD"),
    description: p.description ? String(p.description) : null,
    image_url: p.image_url ? String(p.image_url) : null,
    category: p.category ? String(p.category) : null,
  }));
  const services = realServices.length > 0 ? realServices : finalDefaults.services;

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

  const heroUrl = client.hero_url ?? `/heroes/hero-${client.category}-desktop.webp`;
  // If hero_url is a /heroes/hero-*-desktop.webp, derive mobile from its stem; else fall back to category
  const heroMobileFallback = (() => {
    if (client.hero_url) {
      const m = client.hero_url.match(/\/heroes\/hero-(.+)-desktop\.webp$/);
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
          <section id="booking" className="py-16 px-6 bg-[var(--bg)]">
            <div className="mx-auto max-w-xl">
              <BookingWidget
                services={finalDefaults.bookingServices ?? defaults.services.map((s) => s.title)}
                slug={slug}
                whatsapp={client.whatsapp}
              />
            </div>
          </section>
        )}

        {COMMERCE_CATS.has(client.category) && (
          ["food", "pizza", "baker"].includes(client.category)
            ? <MenuGrid config={config} items={shopProducts as unknown as MenuItem[]} heading="Our Menu" whatsapp={client.whatsapp ?? undefined} />
            : ["beauty", "automotive", "tech-repair", "events"].includes(client.category)
              ? <ServiceGrid config={config} services={shopProducts as unknown as ServiceCard[]} heading="Our Services" slug={slug} whatsapp={client.whatsapp ?? undefined} />
              : <ShopGrid config={config} products={shopProducts} heading="Shop Our Collection" slug={slug} whatsapp={client.whatsapp ?? undefined} />
        )}

        {QUOTE_CATS.has(client.category) && (
          <QuoteForm
            items={shopProducts.map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price ?? undefined,
              currency: p.currency,
              description: p.description ?? undefined,
              image_url: p.image_url ?? undefined,
              category: p.category ?? undefined,
            }))}
            clientSlug={slug}
            phone={client.phone ?? undefined}
            whatsapp={client.whatsapp ?? undefined}
            accent={client.accent ?? "#111"}
            accentFg={client.accent_fg ?? "#fff"}
          />
        )}

        <ContactForm config={config} slug={slug} />
      </SiteLayout>
    </>
  );
}
