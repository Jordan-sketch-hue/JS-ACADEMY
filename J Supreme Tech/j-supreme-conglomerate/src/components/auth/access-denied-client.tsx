"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { isClerkPublishableKeySet } from "@/lib/env/clerk";

export function AccessDeniedClient({ allowedEmail }: { allowedEmail: string }) {
  const [mounted, setMounted] = useState(false);
  const clerkEnabled = isClerkPublishableKeySet();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-grid px-6 py-16">
      <div className="max-w-md space-y-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Access restricted</h1>
        <p className="text-sm text-muted-foreground">
          This workspace is limited to{" "}
          <span className="font-medium text-foreground">{allowedEmail}</span>. Sign
          out and use that account.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {mounted && clerkEnabled ? (
            <SignOutButton signOutOptions={{ redirectUrl: "/sign-in" }}>
              <Button type="button" variant="default">
                Sign out
              </Button>
            </SignOutButton>
          ) : null}
          <Button type="button" variant="outline" asChild>
            <Link href="/sign-in">Back to sign-in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
