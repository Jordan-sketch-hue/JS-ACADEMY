"use client";

import { useEffect, useRef, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eraser, PenLine, Type } from "lucide-react";
import type { SignatureValue } from "@/lib/contracts/signature";

const INK = "#1e2a3a";

/**
 * Capture an e-signature two ways:
 *   Type — name rendered live in the script font
 *   Draw — pointer/touch signature pad (PNG data-URL)
 * Emits the current SignatureValue (or null when empty).
 */
export function SignaturePad({
  onChange,
  initialName = "",
}: {
  onChange: (value: SignatureValue | null) => void;
  initialName?: string;
}) {
  const [tab, setTab] = useState<"typed" | "drawn">("typed");
  const [typedName, setTypedName] = useState(initialName);
  const [hasInk, setHasInk] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // A prefilled name is already a valid typed signature — emit it on mount so
  // the confirm button enables without the user retyping their own name.
  useEffect(() => {
    if (initialName.trim()) {
      onChange({ kind: "typed", name: initialName.trim() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount only
  }, []);

  // Size the canvas to its container at device-pixel resolution once mounted
  // (pads live inside dialogs, so the container width is stable).
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2.25;
      ctx.strokeStyle = INK;
    }
  }, []);

  const emit = (nextTab = tab, name = typedName, ink = hasInk) => {
    if (nextTab === "typed") {
      onChange(name.trim() ? { kind: "typed", name: name.trim() } : null);
      return;
    }
    const canvas = canvasRef.current;
    onChange(
      ink && canvas ? { kind: "drawn", dataUrl: canvas.toDataURL("image/png") } : null,
    );
  };

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    const prev = last.current;
    // Quadratic midpoint smoothing — strokes read as ink, not polylines.
    const mid = { x: (prev.x + p.x) / 2, y: (prev.y + p.y) / 2 };
    ctx.beginPath();
    ctx.moveTo(prev.x, prev.y);
    ctx.quadraticCurveTo(prev.x, prev.y, mid.x, mid.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (!hasInk) setHasInk(true);
  };

  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    emit("drawn", typedName, true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    setHasInk(false);
    emit("drawn", typedName, false);
  };

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => {
        const next = v as "typed" | "drawn";
        setTab(next);
        emit(next);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="typed" className="gap-1.5">
          <Type className="h-3.5 w-3.5" />
          Type
        </TabsTrigger>
        <TabsTrigger value="drawn" className="gap-1.5">
          <PenLine className="h-3.5 w-3.5" />
          Draw
        </TabsTrigger>
      </TabsList>

      <TabsContent value="typed" className="space-y-3">
        <Input
          value={typedName}
          onChange={(e) => {
            setTypedName(e.target.value);
            emit("typed", e.target.value);
          }}
          placeholder="Full name"
          autoComplete="name"
        />
        <div className="flex h-24 items-end rounded-lg border border-neutral-300 bg-white px-4 pb-3">
          {typedName.trim() ? (
            <span
              className="select-none whitespace-nowrap text-[2.4rem] leading-none text-neutral-900"
              style={{ fontFamily: "var(--font-signature), cursive" }}
            >
              {typedName.trim()}
            </span>
          ) : (
            <span className="pb-2 text-sm text-neutral-400">
              Signature preview
            </span>
          )}
        </div>
      </TabsContent>

      <TabsContent value="drawn" className="space-y-2">
        <div className="relative overflow-hidden rounded-lg border border-neutral-300 bg-white">
          <canvas
            ref={canvasRef}
            className="block h-36 w-full cursor-crosshair"
            style={{ touchAction: "none" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          />
          <div className="pointer-events-none absolute inset-x-6 bottom-7 border-b border-dashed border-neutral-300" />
          {!hasInk ? (
            <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-sm text-neutral-400">
              Sign above the line
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={clearCanvas}
          disabled={!hasInk}
        >
          <Eraser className="h-3.5 w-3.5" />
          Clear
        </Button>
      </TabsContent>
    </Tabs>
  );
}
