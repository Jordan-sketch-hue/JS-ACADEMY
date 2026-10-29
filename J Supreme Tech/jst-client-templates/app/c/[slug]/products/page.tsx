export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getClient } from "@/lib/ct-client";
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { ProductsModule } from "@shared/components/crm/ProductsModule";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();
  const { data = [] } = await supabase.from("ct_products").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(50);
  const items = (data as Array<Record<string,unknown>>).map((p) => ({ id: p.id as string, name: p.name as string, category: (p.category as string) ?? null, sku: (p.sku as string) ?? null, price: Number(p.price), currency: (p.currency as string) ?? "JMD", active: Boolean(p.active), created_at: p.created_at as string }));
  const css = `:root{--accent:${client.accent};--accent-fg:${client.accent_fg};}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title={"Products — " + client.name} nav={[{ href: `/c/${slug}`, label: "Overview" }]} brandColor={client.accent} brandName={client.name}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Products</h2>
        <ProductsModule products={items} accentColor={client.accent} clientId={client.id} currency={items[0]?.currency} />
      </CRMLayout>
    </>
  );
}