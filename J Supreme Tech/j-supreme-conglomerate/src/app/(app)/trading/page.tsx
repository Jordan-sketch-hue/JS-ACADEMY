import { TradingClient } from "@/components/trading/trading-client";
import { listTradesWithSync } from "@/lib/data/trades";
import { requireOwnerClerkId } from "@/lib/session";

export default async function TradingPage() {
  const owner = await requireOwnerClerkId();
  const bundle = await listTradesWithSync(owner);
  return <TradingClient bundle={bundle} ownerId={owner} />;
}
