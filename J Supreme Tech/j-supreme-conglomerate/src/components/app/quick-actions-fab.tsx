"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUiStore } from "@/stores/ui-store";
import { Bot, ClipboardList, PanelLeft, Plus, Users } from "lucide-react";

/** Floating + control — opens a sheet so actions work reliably (focus, touch, E2E). */
export function QuickActionsFab() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      <Button
        type="button"
        size="icon"
        className="no-print pointer-events-auto fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-2xl"
        aria-label="Quick actions"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-testid="quick-actions-fab"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" aria-hidden />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="z-[100] flex max-h-[85vh] flex-col gap-4 rounded-t-2xl border-border/80"
        >
          <SheetHeader className="text-left">
            <SheetTitle>Quick actions</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Add work, jump to CRM, or open command / AI tools.
            </p>
          </SheetHeader>
          <div className="grid gap-2 pb-6">
            <Button
              type="button"
              variant="secondary"
              className="h-12 justify-start gap-3"
              data-testid="quick-action-new-task"
              onClick={() => {
                close();
                router.push("/todos#new-task");
              }}
            >
              <ClipboardList className="h-4 w-4 shrink-0 text-primary" />
              New task
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-12 justify-start gap-3"
              data-testid="quick-action-crm"
              onClick={() => {
                close();
                router.push("/crm");
              }}
            >
              <Users className="h-4 w-4 shrink-0 text-primary" />
              CRM &amp; leads
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start gap-3"
              data-testid="quick-action-command"
              onClick={() => {
                close();
                useUiStore.getState().setCommandOpen(true);
              }}
            >
              <PanelLeft className="h-4 w-4 shrink-0" />
              Command palette
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 justify-start gap-3"
              data-testid="quick-action-ai"
              onClick={() => {
                close();
                useUiStore.getState().setAiPanelOpen(true);
              }}
            >
              <Bot className="h-4 w-4 shrink-0" />
              Jarvis AI
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
