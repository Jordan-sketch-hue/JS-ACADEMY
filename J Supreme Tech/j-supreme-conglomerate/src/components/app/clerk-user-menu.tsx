"use client";

import { UserButton } from "@clerk/nextjs";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();

export function ClerkUserMenu() {
  if (!clerkPubKey) return null;
  return (
    <UserButton
      afterSignOutUrl="/sign-in"
      appearance={{
        elements: {
          avatarBox: "h-8 w-8",
        },
      }}
    />
  );
}
