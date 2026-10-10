import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intake — J Supreme",
  description: "Shareable client intake questionnaire.",
};

export default function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-grid bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-10">{children}</div>
    </div>
  );
}
