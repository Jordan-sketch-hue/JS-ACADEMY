import { buildVercelSitesHub } from "@/lib/vercel-portfolio/build-hub";
import { VercelSitesHub } from "@/components/sites/vercel-sites-hub";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SitesPage() {
  const hub = await buildVercelSitesHub();
  return <VercelSitesHub initial={hub} />;
}
