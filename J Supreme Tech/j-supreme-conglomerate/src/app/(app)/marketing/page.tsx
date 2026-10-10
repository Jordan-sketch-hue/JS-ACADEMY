import { getMarketingData } from "@/lib/data/marketing-campaigns";
import { MarketingCommandCenter } from "@/components/marketing/marketing-command-center";

export const metadata = { title: "Marketing Command Center · J Supreme" };

export default function MarketingPage() {
  const data = getMarketingData();
  return <MarketingCommandCenter data={data} />;
}
