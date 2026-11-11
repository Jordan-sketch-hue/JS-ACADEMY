export interface ProductVariant {
  label: string          // e.g. "Color", "Size"
  options: string[]      // e.g. ["Red","Blue","Black"] or ["S","M","L","XL"]
}

export interface ShippingOption {
  label: string          // e.g. "Free Delivery", "Express"
  daysMin: number
  daysMax: number
  priceCents: number     // 0 = free
  carrier?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  price_jmd: number
  category: string
  image_url: string | null
  stock: number
  active: boolean
  created_at: string
  variants?: ProductVariant[]
  shipping_info?: { options: ShippingOption[] }
  free_delivery?: boolean
  delivery_days_min?: number
  delivery_days_max?: number
  supplier_url?: string
  supplier_name?: string
  cost_usd?: number
  markup_pct?: number
  is_promo?: boolean
  promo_price_jmd?: number | null
  promo_ends_at?: string | null
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  name: string
  price_jmd: number
  image_url: string | null
  quantity: number
}

export interface Order {
  id: string
  cart_id: string
  total_jmd: number
  status: 'pending' | 'paid' | 'failed'
  handypay_session_id: string | null
  created_at: string
}