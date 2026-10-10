"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ExpandableTextareaProps = Omit<
  ComponentProps<typeof Textarea>,
  "onDoubleClick"
> & {
  expandTitle?: string;
  expandDescription?: string;
  showExpandHint?: boolean;
};

function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): (instance: T | null) => void {
  return (instance) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(instance);
      else ref.current = instance;
    }
  };
}

export const ExpandableTextarea = forwardRef<
  HTMLTextAreaElement,
  ExpandableTextareaProps
>(function ExpandableTextarea(
  {
    expandTitle = "Edit",
    expandDescription,
    showExpandHint = true,
    className,
    onBlur,
    onChange,
    defaultValue,
    value,
    ...props
  },
  forwardedRef,
) {
  const hintId = useId();
  const inlineRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLTextAreaElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const isControlled = value !== undefined;

  const readInlineValue = useCallback(() => {
    if (isControlled) return String(value ?? "");
    return inlineRef.current?.value ?? String(defaultValue ?? "");
  }, [defaultValue, isControlled, value]);

  const openExpand = useCallback(() => {
    setDraft(readInlineValue());
    setOpen(true);
  }, [readInlineValue]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      dialogRef.current?.focus();
      const len = dialogRef.current?.value.length ?? 0;
      dialogRef.current?.setSelectionRange(len, len);
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const applyToInline = useCallback(
    (text: string) => {
      if (isControlled) {
        onChange?.({
          target: { value: text },
          currentTarget: { value: text },
        } as ChangeEvent<HTMLTextAreaElement>);
        return;
      }
      const el = inlineRef.current;
      if (!el) return;
      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        "value",
      )?.set;
      setter?.call(el, text);
      el.dispatchEvent(new Event("input", { bubbles: true }));
    },
    [isControlled, onChange],
  );

  const commitAndClose = useCallback(() => {
    applyToInline(draft);
    setOpen(false);
    requestAnimationFrame(() => {
      const el = inlineRef.current;
      if (!el) return;
      const blurEvent = {
        target: el,
        currentTarget: el,
      } as FocusEvent<HTMLTextAreaElement>;
      onBlur?.(blurEvent);
    });
  }, [applyToInline, draft, onBlur]);

  const discardAndClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <div className="group relative">
        <Textarea
          ref={mergeRefs(inlineRef, forwardedRef)}
          className={cn(className, showExpandHint && "cursor-text")}
          title={showExpandHint ? "Double-click to expand" : undefined}
          aria-describedby={showExpandHint ? hintId : undefined}
          defaultValue={defaultValue}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onDoubleClick={(e) => {
            e.preventDefault();
            openExpand();
          }}
          {...props}
        />
        {showExpandHint ? (
          <span
            id={hintId}
            className="pointer-events-none absolute bottom-1 right-1.5 text-[9px] leading-none text-muted-foreground/75 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            Double-click to expand
          </span>
        ) : null}
      </div>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) discardAndClose();
          else setOpen(true);
        }}
      >
        <DialogContent
          className="flex max-h-[min(92vh,900px)] max-w-3xl flex-col gap-0 p-0 sm:max-w-3xl"
          onEscapeKeyDown={(e) => {
            e.preventDefault();
            discardAndClose();
          }}
        >
          <DialogHeader className="border-b border-border/60 px-6 py-4">
            <DialogTitle>{expandTitle}</DialogTitle>
            {expandDescription ? (
              <DialogDescription>{expandDescription}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">
                Expanded editor. Press Escape to close without saving.
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-hidden px-6 py-4">
            <Textarea
              ref={dialogRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[min(60vh,520px)] resize-y text-sm leading-relaxed"
              disabled={props.disabled}
              aria-label={props["aria-label"]}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.stopPropagation();
                  discardAndClose();
                }
              }}
            />
          </div>
          <DialogFooter className="border-t border-border/60 px-6 py-4 sm:justify-end">
            <Button type="button" variant="outline" onClick={discardAndClose}>
              Cancel
            </Button>
            <Button type="button" onClick={commitAndClose} disabled={props.disabled}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});
ExpandableTextarea.displayName = "ExpandableTextarea";
