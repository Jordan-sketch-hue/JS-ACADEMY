import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase-server";

type DbProduct = {
  id: string; sku: string; slug: string; name: string; description: string;
  category: string | null; price: number; sale_price: number | null;
  stock_quantity: number; image_url: string | null; ingredients: string | null;
  benefits: string | null; usage_instructions: string | null; warnings: string | null;
  shipping_eligibility: string | null; featured: boolean; active: boolean;
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("tcj_products")
      .select(
        "id, sku, slug, name, description, category, price, sale_price, stock_quantity, image_url, ingredients, benefits, usage_instructions, warnings, shipping_eligibility, featured, active",
      )
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message, products: [] }, { status: 500 });
    }

    const products = (data as DbProduct[] | null)?.map((p) => ({
      id: p.id,
      sku: p.sku,
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category ?? "Wellness",
      price: Number(p.sale_price ?? p.price),
      regularPrice: Number(p.price),
      onSale: p.sale_price !== null,
      stock: p.stock_quantity,
      benefits: p.benefits ?? p.description,
      ingredients: p.ingredients ?? "",
      usage: p.usage_instructions ?? "",
      warnings: p.warnings ?? "",
      shipping: p.shipping_eligibility ?? "Worldwide",
      image: p.image_url,
      featured: p.featured,
    })) ?? [];

    return NextResponse.json({ ok: true, products });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e as Error).message, products: [] },
      { status: 500 },
    );
  }
}
