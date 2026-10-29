export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { getClient } from "@/lib/ct-client";
import { CRMLayout } from "@shared/components/layout/CRMLayout";
import { CustomersModule } from "@shared/components/crm/CustomersModule";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const client = await getClient(slug);
  if (!client) notFound();
  const { data = [] } = await supabase.from("ct_customers").select("*").eq("client_id", client.id).order("created_at", { ascending: false }).limit(50);
  const items = (data as Array<Record<string,unknown>>).map((c) => ({ id: c.id as string, name: c.name as string, phone: (c.phone as string) ?? null, email: (c.email as string) ?? null, notes: (c.notes as string) ?? null, created_at: c.created_at as string }));
  const css = `:root{--accent:${client.accent};--accent-fg:${client.accent_fg};}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <CRMLayout title={"Customers — " + client.name} nav={[{ href: `/c/${slug}`, label: "Overview" }]} brandColor={client.accent} brandName={client.name}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Customers</h2>
        <CustomersModule customers={items} accentColor={client.accent} clientId={client.id} />
      </CRMLayout>
    </>
  );
}