import { ToastProvider } from "@/components/Toast";
import { PlatformShell } from "@/components/PlatformShell";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PlatformShell>{children}</PlatformShell>
    </ToastProvider>
  );
}
