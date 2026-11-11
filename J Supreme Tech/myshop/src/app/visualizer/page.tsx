export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"
import VisualizerClient from "./VisualizerClient"

export const metadata: Metadata = {
  title: "Visualize Your Space — Mine & Yours Shop",
  description: "Browse real products from our catalog by room type and category. Shop what fits your space.",
}

const VISUAL_CATEGORIES = [
  "Home & Living",
  "Furniture",
  "Patio & Garden",
  "Home Improvement",
  "Office Products",
  "Electronics & Tech",
  "Lifestyle Finds",
]

async function getVisualProducts(): Promise<Product[]> {
  try {
    const { data } = await supabase
      .from("myshop_products")
      .select("*")
      .in("category", VISUAL_CATEGORIES)
      .eq("active", true)
      .not("image_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(120)
    return (data ?? []) as Product[]
  } catch {
    return []
  }
}

export default async function VisualizerPage() {
  const products = await getVisualProducts()
  return <VisualizerClient products={products} categories={VISUAL_CATEGORIES} />
}
