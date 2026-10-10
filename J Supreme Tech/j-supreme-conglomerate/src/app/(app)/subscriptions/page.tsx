import { isSupabasePersistenceEnabled } from "@/lib/env/storage-mode";
import { requireOwnerClerkId } from "@/lib/session";
import {
  listSubscriptionCards,
  listSubscriptions,
  type Subscription,
  type SubscriptionCard,
} from "@/lib/data/subscriptions";
import { SubscriptionsClient } from "@/components/subscriptions/subscriptions-client";
import { seedStatementSubscriptionsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const owner = await requireOwnerClerkId();
  const persistLocally = !isSupabasePersistenceEnabled();

  let initialSubscriptions: Subscription[] = [];
  let initialCards: SubscriptionCard[] = [];

  if (!persistLocally) {
    const [subs, cards] = await Promise.all([
      listSubscriptions(owner),
      listSubscriptionCards(owner),
    ]);

    // Auto-seed from bank statements on first visit (no user action required)
    if (subs.length === 0) {
      await seedStatementSubscriptionsAction();
      const [seededSubs, seededCards] = await Promise.all([
        listSubscriptions(owner),
        listSubscriptionCards(owner),
      ]);
      initialSubscriptions = seededSubs;
      initialCards = seededCards;
    } else {
      initialSubscriptions = subs;
      initialCards = cards;
    }
  }

  return (
    <SubscriptionsClient
      ownerId={owner}
      persistLocally={persistLocally}
      initialSubscriptions={initialSubscriptions}
      initialCards={initialCards}
    />
  );
}
