import { redirect } from "next/navigation";

/**
 * Legacy /my-dashboard route — redirect to portal login.
 * Handles old bookmarks/links that pointed to /my-dashboard.
 */
export default function MyDashboard() {
  redirect("/portal");
}
