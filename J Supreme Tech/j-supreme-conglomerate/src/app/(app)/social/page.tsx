import { getOwnerClerkId } from "@/lib/session";
import { getSocialStats } from "@/lib/data/social-stats";
import { SocialStatsClient } from "@/components/social/social-stats-client";

export const metadata = { title: "Social Media Stats · J Supreme" };
export const dynamic = "force-dynamic";

export default async function SocialPage() {
  const ownerId = await getOwnerClerkId();
  const data = ownerId
    ? await getSocialStats(ownerId)
    : { instagram: [], facebook: [], fetchedAt: new Date().toISOString() };

  return <SocialStatsClient data={data} />;
}
