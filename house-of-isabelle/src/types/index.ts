// House of Isabelle — Shared TypeScript Types

export type CustomerSegment = "retail" | "stylist" | "wholesale";
export type OrderStatus = "pending_payment" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
export type DeliveryMethod = "islandwide" | "knutsford" | "pickup";
export type CartStatus = "active" | "abandoned" | "converted";
export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
export type HairTexture = "Straight" | "Body Wave" | "Burmese Curly" | "Coloured Hair" | "Tape-in" | "Crochet" | "Deep Wave" | "Kinky Curly";
export type HairColour = "Natural Black" | "1B Off Black" | "#2 Darkest Brown" | "#4 Dark Brown" | "#27 Honey Blonde" | "#30 Medium Auburn" | "#613 Platinum Blonde" | "Ombre" | "Custom";

export const HAIR_LENGTHS = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30] as const;
export type HairLength = typeof HAIR_LENGTHS[number];

export const DELIVERY_LABELS: Record<DeliveryMethod, string> = {
  islandwide: "Islandwide Delivery",
  knutsford:  "Knutsford Express",
  pickup:     "In-Store Pickup",
};

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  active: boolean;
}

export interface Product {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  base_price_jmd: number;
  image_url: string | null;
  image_urls: string[];
  active: boolean;
  featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  category?: ProductCategory;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  texture: HairTexture;
  length_in: HairLength;
  colour: HairColour;
  price_jmd: number;
  sku: string | null;
  stock: number;
  low_stock_threshold: number;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  duration_min: number;
  price_jmd: number;
  image_url: string | null;
  active: boolean;
  sort_order: number;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp_phone: string | null;
  segment: CustomerSegment;
  verified_stylist: boolean;
  referral_source: string | null;
  notes: string | null;
  tags: string[];
  total_spent_jmd: number;
  order_count: number;
  last_order_at: string | null;
  marketing_consent: boolean;
  consent_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WholesaleTier {
  id: string;
  segment: CustomerSegment;
  discount_pct: number;
  min_order_jmd: number;
  description: string | null;
}

export interface Cart {
  id: string;
  session_id: string;
  customer_id: string | null;
  email: string | null;
  phone: string | null;
  status: CartStatus;
  total_jmd: number;
  created_at: string;
  updated_at: string;
  items?: CartItem[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  variant_id: string;
  quantity: number;
  price_jmd: number;
  variant?: ProductVariant & { product?: Product };
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  status: OrderStatus;
  delivery_method: DeliveryMethod;
  delivery_address: string | null;
  delivery_branch: string | null;
  subtotal_jmd: number;
  discount_jmd: number;
  delivery_fee_jmd: number;
  total_jmd: number;
  fygaro_payment_id: string | null;
  fygaro_payment_link: string | null;
  paid_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  product_name: string;
  variant_desc: string;
  quantity: number;
  unit_price_jmd: number;
}

export interface Appointment {
  id: string;
  service_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  scheduled_at: string;
  duration_min: number;
  status: BookingStatus;
  notes: string | null;
  deposit_paid: boolean;
  created_at: string;
  updated_at: string;
  service?: Service;
}

export interface AdminNote {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  content: string;
  created_by: string;
  created_at: string;
}

// ---- Checkout / payment types ----

export interface CheckoutPayload {
  cartId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryMethod: DeliveryMethod;
  deliveryAddress?: string;
  deliveryBranch?: string;
}

export interface FygaroInitiateResponse {
  orderId: string;
  orderNumber: string;
  paymentLink: string;
}

// ---- Analytics event types ----

export interface MetaPixelEvent {
  eventName: "Purchase" | "AddToCart" | "ViewContent" | "InitiateCheckout" | "Lead";
  eventId: string;
  value?: number;   // USD equivalent (approximate)
  currency?: string;
  contentIds?: string[];
  contentType?: string;
  numItems?: number;
}

export interface GA4PurchaseEvent {
  transactionId: string;
  value: number;    // JMD
  currency: "JMD";
  items: { item_id: string; item_name: string; price: number; quantity: number }[];
}

// ---- API response wrappers ----
export type ApiOk<T> = { ok: true; data: T };
export type ApiErr   = { ok: false; error: string };
export type ApiResponse<T> = ApiOk<T> | ApiErr;
