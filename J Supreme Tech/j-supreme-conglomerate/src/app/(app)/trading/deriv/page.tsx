import { DerivTradeDeskClient } from "@/components/trading/deriv-tradedesk-client";
import { requireOwnerClerkId } from "@/lib/session";

export const metadata = {
  title: "Deriv TradeDesk",
};

export default async function DerivTradeDeskPage() {
  await requireOwnerClerkId();
  return <DerivTradeDeskClient />;
}
