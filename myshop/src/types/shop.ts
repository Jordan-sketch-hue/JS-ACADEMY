export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price_jmd: number
  image_url: string | null
  category: string | null
  stock: number
  active: boolean
  created_at: string
}

export interface CartItem {
  product_id: string
  name: string
  price_jmd: number
  image_url: string | null
  quantity: number
}

export interface Order {
  id: string
  paypal_order_id: string
  paypal_capture_id: string | null
  payer_email: string | null
  payer_name: string | null
  amount_usd: string | null
  items: CartItem[]
  status: 'pending' | 'paid' | 'refunded' | 'cancelled'
  created_at: string
}
