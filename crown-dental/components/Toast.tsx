"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import * as Icons from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";
type Toast = { id: string; message: string; type: ToastType; detail?: string };
type ToastCtx = { toast: (msg: string, type?: ToastType, detail?: string) => void };

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export const useToast = () => useContext(Ctx);

const icons = {
  success: <Icons.CheckCircle2 className="h-4 w-4 text-teal shrink-0" />,
  error:   <Icons.XCircle className="h-4 w-4 text-alert shrink-0" />,
  info:    <Icons.Info className="h-4 w-4 text-ink-3 shrink-0" />,
  warning: <Icons.AlertTriangle className="h-4 w-4 text-gold-deep shrink-0" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "info", detail?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, message, type, detail }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto relative overflow-hidden flex items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-float toast-enter min-w-[260px]"
          >
            {icons[t.type]}
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{t.message}</p>
              {t.detail && <p className="text-xs text-slate mt-0.5">{t.detail}</p>}
            </div>
            <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="ml-2 text-mist hover:text-ink shrink-0">
              <Icons.X className="h-3.5 w-3.5" />
            </button>
            {/* Gold progress underline */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gold shimmer-gold" style={{ width: "100%" }} />
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
