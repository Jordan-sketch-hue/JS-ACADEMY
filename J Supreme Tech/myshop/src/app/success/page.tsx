import { redirect } from "next/navigation"

// Orphan page — redirect to canonical checkout success route
export default function LegacySuccessPage() {
  redirect("/checkout/success")
}
