"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUiStore } from "@/stores/ui-store";
import { Bot, Building2, Focus, Menu, Search, Settings } from "lucide-react";
import { EcosystemStatusBadge } from "@/components/app/ecosystem-status-badge";
import { ClerkUserMenu } from "@/components/app/clerk-user-menu";
import { ThemeSwitcher } from "@/components/app/theme-switcher";
import { InstallApp } from "@/components/app/install-app";

export function AppHeader({
  title,
  devAuth,
  setupModeNoClerk: _setupModeNoClerk = false,
}: {
  title: string;
  devAuth?: boolean;
  setupModeNoClerk?: boolean;
}) {
  const toggleAi = useUiStore((s) => s.toggleAiPanel);
  const focusMode = useUiStore((s) => s.focusMode);
  const toggleFocus = useUiStore((s) => s.toggleFocusMode);
  const toggleMobileNav = useUiStore((s) => s.toggleMobileNav);

  return (
    <header className="no-print sticky top-0 z-10 flex h-14 items-center gap-2 border-b border-border/60 bg-background/70 px-3 backdrop-blur-xl sm:gap-3 sm:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="-ml-1 shrink-0 lg:hidden"
        onClick={toggleMobileNav}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-muted-foreground">
          Operating picture
        </span>
        <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="hidden max-w-md flex-1 md:flex">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            readOnly
            onFocus={() => useUiStore.getState().setCommandOpen(true)}
            placeholder="Search everywhere… (⌘K)"
            className="cursor-pointer pl-9"
          />
        </div>
      </div>
      <InstallApp />
      <div className="hidden sm:block">
        <ThemeSwitcher />
      </div>
      <Button
        variant={focusMode ? "default" : "outline"}
        size="sm"
        className="hidden sm:inline-flex"
        onClick={toggleFocus}
      >
        <Focus className="mr-1 h-4 w-4" />
        Focus
      </Button>
      <Button variant="outline" size="sm" className="hidden gap-1.5 sm:inline-flex" asChild>
        <Link href="/backoffice" title="Client back offices — Aboo, BP Couriers, Solace">
          <Building2 className="h-4 w-4" />
          Back office
        </Link>
      </Button>
      <Button variant="glass" size="sm" onClick={toggleAi} title="Open Jarvis AI (⌘⇧A or Ctrl+Shift+A)">
        <Bot className="mr-1 h-4 w-4" />
        <span className="hidden sm:inline">Jarvis AI</span>
        <span className="sm:hidden">AI</span>
      </Button>
      <div className="hidden sm:flex">
        <EcosystemStatusBadge />
      </div>
      <ClerkUserMenu />
      {devAuth ? (
        <div
          className="hidden h-9 items-center rounded-full border border-amber-500/35 bg-amber-500/10 px-3 text-xs font-semibold text-amber-200 sm:flex"
          title="OS_DEV_AUTH_BYPASS — development only"
        >
          DEV
        </div>
      ) : (
        <Button variant="outline" size="sm" asChild className="hidden shrink-0 sm:inline-flex">
          <Link href="/settings">
            <Settings className="mr-1 h-4 w-4" />
            Settings
          </Link>
        </Button>
      )}
    </header>
  );
}
