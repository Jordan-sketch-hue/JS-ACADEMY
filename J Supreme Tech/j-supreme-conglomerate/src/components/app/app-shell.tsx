"use client";

import Link from "next/link";
import { AppSidebar } from "@/components/app/app-sidebar";
import { AppHeader } from "@/components/app/app-header";
import { CommandMenu } from "@/components/app/command-menu";
import { AiAssistantPanel } from "@/components/app/ai-assistant-panel";
import { KeyboardShortcuts } from "@/components/app/keyboard-shortcuts";
import { QuickActionsFab } from "@/components/app/quick-actions-fab";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

const titles: Record<string, string> = {
  "/dashboard": "Mission Control",
  "/vision": "Vision Board",
  "/todos": "Task Command",
  "/crm": "CRM & Pipeline",
  "/pipeline-intake": "Pipeline intake",
  "/invoices": "Invoices",
  "/contracts": "Contracts",
  "/projects": "Project Command",
  "/client-showcase": "Client Showcase",
  "/site-kit": "Client site kit",
  "/backoffice": "Back office",
  "/suite": "Supreme Suite Control",
  "/sites": "Vercel sites",
  "/trading": "Trading Analytics",
  "/mt5-markups": "MT5 Markups",
  "/analytics": "Site Analytics",
  "/marketing": "Marketing Command Center",
  "/scripts": "Sales & Lead Scripts",
  "/market-pricing": "Competitive Pricing",
  "/ai-workflows": "AI Workflow Library",
  "/automations": "Automation Fabric",
  "/assets": "Creative Assets",
  "/need-to-know": "Need to know",
  "/settings": "Workspace Settings",
};

export function AppShell({
  children,
  devAuth = false,
  setupModeNoClerk = false,
  persistLocally = false,
}: {
  children: React.ReactNode;
  devAuth?: boolean;
  setupModeNoClerk?: boolean;
  /** True when Supabase is not configured — tasks persist in this browser (localStorage). */
  persistLocally?: boolean;
}) {
  const pathname = usePathname();
  const focusMode = useUiStore((s) => s.focusMode);

  const title = useMemo(() => {
    for (const key of Object.keys(titles)) {
      if (pathname === key || pathname.startsWith(`${key}/`)) {
        return titles[key] ?? "J Supreme Conglomerate";
      }
    }
    return "J Supreme Conglomerate";
  }, [pathname]);

  return (
    <div className="flex h-svh w-full overflow-hidden bg-grid text-foreground">
      <KeyboardShortcuts />
      <CommandMenu />
      <AiAssistantPanel />
      {!focusMode && <AppSidebar />}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {setupModeNoClerk && !focusMode && (
          <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-50">
            <strong className="font-semibold">Setup</strong> — finish configuration in{" "}
            <Link href="/settings" className="underline underline-offset-2">
              Settings → Integrations
            </Link>
            .
          </div>
        )}
        {persistLocally && !focusMode && (
          <div className="border-b border-sky-500/25 bg-sky-500/10 px-4 py-2 text-center text-xs text-sky-50">
            <strong className="font-semibold">Local save mode</strong> — Tasks are stored in{" "}
            <strong className="font-semibold">this browser</strong> (localStorage). They survive refresh and
            redeploys, but not clearing site data or switching devices. Add{" "}
            <strong className="font-semibold">Supabase</strong> under{" "}
            <Link href="/settings#integrations" className="underline underline-offset-2">
              Settings → Integrations
            </Link>{" "}
            to sync a cloud database across devices.
          </div>
        )}
        {!focusMode && (
          <AppHeader
            title={title}
            devAuth={devAuth}
            setupModeNoClerk={setupModeNoClerk}
          />
        )}
        {focusMode && (
          <button
            type="button"
            onClick={() => useUiStore.getState().toggleFocusMode()}
            className="no-print fixed right-4 top-4 z-50 rounded-full border border-border bg-card/90 px-4 py-2 text-xs font-medium text-foreground shadow-lg backdrop-blur"
          >
            Exit focus (⇧⌘F)
          </button>
        )}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "min-h-0 flex-1 overflow-auto scroll-smooth p-4 md:p-6 lg:p-8",
              focusMode && "pt-8",
            )}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        {!focusMode && <QuickActionsFab />}
      </div>
    </div>
  );
}
