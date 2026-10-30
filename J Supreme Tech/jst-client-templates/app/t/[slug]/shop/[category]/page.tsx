import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ShopPageClient from "@/app/t/[slug]/shop/ShopPageClient";
import type { ClientConfig } from "@shared/types/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Params { slug: string; category: string; }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, category } = await params;
  const { data: client } = await supabase.from("ct_clients").select("name").eq("slug", slug).single();
  const name = client?.name ?? slug;
  const label = decodeURIComponent(category);
  return { title: `${label} — ${name}`, description: `Browse ${label} from ${name}` };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug, category } = await params;
  const label = decodeURIComponent(category);

  const { data: client } = await supabase
    .from("ct_clients")
    .select("id, name, category, accent, accent_fg, logo_url, hero_url, phone, whatsapp, address")
    .eq("slug", slug)
    .single();

  if (!client) notFound();

  const { data: products } = await supabase
    .from("ct_products")
    .select("id, name, category, price, currency, description, image_url")
    .eq("client_id", client.id)
    .eq("active", true)
    .ilike("category", label);

  const config: ClientConfig = {
    name: client.name,
    slug,
    category: client.category,
    accent: client.accent ?? "#1A1A1A",
    accent_fg: client.accent_fg ?? "#FFFFFF",
    logo_url: client.logo_url,
    hero_url: client.hero_url,
    phone: client.phone,
    whatsapp: client.whatsapp,
    address: client.address,
  };

  return (
    <main>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "24px 16px 8px" }}>
        <a href={`/t/${slug}`} style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>← Back to {client.name}</a>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{label}</h1>
      </div>
      <ShopPageClient slug={slug} config={config} products={products ?? []} />
    </main>
  );
}
