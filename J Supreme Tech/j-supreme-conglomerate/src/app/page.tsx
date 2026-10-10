import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Command, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-x-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
      <main className="relative z-20 w-full max-w-2xl text-center pointer-events-auto">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Image
            src="/logo.svg"
            alt=""
            width={56}
            height={56}
            className="pointer-events-none h-14 w-14 rounded-2xl shadow-lg shadow-primary/10"
            priority
          />
          <div className="pointer-events-none inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground backdrop-blur-md">
            <Command className="h-3.5 w-3.5" />
            J Supreme Conglomerate
          </div>
        </div>

        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          The operating system for builders who run agencies, markets, and products.
        </h1>
        <p className="mt-5 text-pretty text-lg text-muted-foreground">
          One glass workspace for CRM, delivery, trading analytics, marketing performance, and AI workflows - tuned for
          velocity, not noise. Use the <strong className="text-foreground">Jarvis AI</strong> button (or Cmd+Shift+A /
          Ctrl+Shift+A) in the app to add tasks and reminders from chat.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open workspace
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background/40 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Sign in
          </Link>
          <Link
            href="/settings"
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-input bg-background/40 px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent/10 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Settings className="mr-2 h-4 w-4" />
            Keys & setup
          </Link>
        </div>

        <p className="mx-auto mt-6 max-w-lg text-pretty text-sm text-muted-foreground">
          Single-user workspace: data is scoped to an owner id (override with{" "}
          <code className="rounded bg-muted px-1 text-xs">OS_OWNER_ID</code> on the server). Connect{" "}
          <Link className="text-primary underline" href="/settings">
            Supabase
          </Link>{" "}
          to sync CRM and tasks in the cloud.
        </p>
      </main>
    </div>
  );
}
