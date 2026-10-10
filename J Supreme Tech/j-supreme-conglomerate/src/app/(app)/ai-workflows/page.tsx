import { redirect } from "next/navigation";

/** AI Workflows now live inside the Jarvis hub. */
export default function AiWorkflowsPage() {
  redirect("/jarvis?tab=ai-workflows");
}
