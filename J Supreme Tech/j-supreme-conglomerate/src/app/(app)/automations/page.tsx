import { redirect } from "next/navigation";

/** Automations now live inside the Jarvis hub. */
export default function AutomationsPage() {
  redirect("/jarvis?tab=automations");
}
