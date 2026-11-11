export const dynamic = "force-dynamic"
import type { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/lib/types"
import AdultsClient from "./AdultsClient"

export const metadata: Metadata = {
  title: "Adult Collection — Mine & Yours Shop",
  description: "Premium adult wellness and intimacy products. Discreet packaging, fast delivery across Jamaica. Age 18+ only.",
  robots: { index: false, follow: false },
}

async function getAdultProducts(): Promise<Product[]> {
  try {
    const { data } = await supabase
      .from("myshop_products")
      .select("*")
      .eq("category", "Adult & Intimate")
      .eq("active", true)
      .order("created_at", { ascending: false })
    return (data ?? []) as Product[]
  } catch {
    return []
  }
}

export default async function AdultsPage() {
  const products = await getAdultProducts()
  return <AdultsClient products={products} />
}
