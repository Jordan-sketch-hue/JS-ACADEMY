import { redirect } from "next/navigation";

/** Public sign-up is disabled — operator access is invite-only. */
export default function SignUpPage() {
  redirect("/sign-in");
}
