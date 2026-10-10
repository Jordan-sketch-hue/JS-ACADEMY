import { LyraFeedbackClient } from "@/components/lyra-feedback/lyra-feedback-client";
import { listLyraNotes } from "@/lib/data/lyra-notes";
import { requireOwnerClerkId } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Client feedback · Lyra · J Supreme" };

export default async function ClientFeedbackPage() {
  await requireOwnerClerkId();
  const summary = await listLyraNotes();
  return <LyraFeedbackClient summary={summary} />;
}
