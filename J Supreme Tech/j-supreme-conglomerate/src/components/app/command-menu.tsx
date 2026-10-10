"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useUiStore } from "@/stores/ui-store";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  Boxes,
  Briefcase,
  ClipboardList,
  Compass,
  FileText,
  GalleryHorizontalEnd,
  Inbox,
  LayoutDashboard,
  Megaphone,
  MessagesSquare,
  Package,
  Palette,
  Globe2,
  Building2,
  Settings,
  CandlestickChart,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const routes = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vision", label: "Vision Board", icon: Compass },
  { href: "/backoffice", label: "Back office", icon: Building2 },
  { href: "/suite", label: "Supreme Suite Control", icon: Boxes },
  { href: "/todos", label: "Tasks", icon: ClipboardList },
  { href: "/crm", label: "CRM & Pipeline", icon: Users },
  { href: "/pipeline-intake", label: "Pipeline intake", icon: Inbox },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/projects", label: "Projects", icon: Briefcase },
  { href: "/client-showcase", label: "Client Showcase", icon: GalleryHorizontalEnd },
  { href: "/site-kit", label: "Site kit", icon: Package },
  { href: "/sites", label: "Vercel sites", icon: Globe2 },
  { href: "/trading", label: "Trading", icon: TrendingUp },
  { href: "/mt5-markups", label: "MT5 Markups", icon: CandlestickChart },
  { href: "/studio", label: "Creative Studio", icon: Palette },
  { href: "/marketing", label: "Marketing", icon: Megaphone },
  { href: "/scripts", label: "Scripts", icon: MessagesSquare },
  { href: "/market-pricing", label: "Market Pricing", icon: BarChart3 },
  { href: "/jarvis?tab=ai-workflows", label: "AI Workflows", icon: Sparkles },
  { href: "/jarvis?tab=automations", label: "Automations", icon: Zap },
  { href: "/assets", label: "Assets", icon: Activity },
  { href: "/need-to-know", label: "Need to know", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function CommandMenu() {
  const router = useRouter();
  const open = useUiStore((s) => s.commandOpen);
  const setOpen = useUiStore((s) => s.setCommandOpen);

  useEffect(() => {
    routes.forEach((r) => router.prefetch(r.href));
  }, [router]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search modules, records, actions…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {routes.map((r) => (
            <CommandItem
              key={r.href}
              onSelect={() => {
                router.push(r.href);
                setOpen(false);
              }}
            >
              <r.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              {r.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              useUiStore.getState().setAiPanelOpen(true);
              setOpen(false);
            }}
          >
            <Bot className="mr-2 h-4 w-4" />
            Open Jarvis AI
            <CommandShortcut>⇧⌘A</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/trading");
              setOpen(false);
            }}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Trading analytics
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
