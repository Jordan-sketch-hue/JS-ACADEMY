"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isClerkProviderEnabled } from "@/lib/env/clerk";
import { ClerkProvider } from "@clerk/nextjs";
import { useState } from "react";

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const inner = (
    <QueryClientProvider client={client}>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </QueryClientProvider>
  );

  if (!isClerkProviderEnabled() || !clerkPubKey) {
    return inner;
  }

  return <ClerkProvider publishableKey={clerkPubKey}>{inner}</ClerkProvider>;
}
