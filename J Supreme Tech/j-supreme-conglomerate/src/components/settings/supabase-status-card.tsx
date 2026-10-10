import { checkSupabaseConnection } from "@/lib/supabase/check-connection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function SupabaseStatusCard() {
  const result = await checkSupabaseConnection();

  if (result.ok) {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/[0.07]">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-emerald-100">Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>
            <strong className="text-emerald-100">Connected.</strong> Responded in {result.pingMs}ms (
            <code className="rounded bg-muted/80 px-1 text-xs">todos</code> readable).
          </p>
          <p className="text-xs">Redeploy or restart is not required for this check to update after env changes.</p>
        </CardContent>
      </Card>
    );
  }

  const tone =
    result.code === "missing_env"
      ? "border-amber-500/30 bg-amber-500/[0.07]"
      : "border-destructive/30 bg-destructive/[0.07]";

  const titleColor =
    result.code === "missing_env" ? "text-amber-100" : "text-destructive";

  return (
    <Card className={tone}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-base ${titleColor}`}>Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Not connected:</strong> {result.message}
        </p>
        {result.code === "missing_env" && (
          <p className="text-xs">
            Use <strong className="text-foreground">Project URL</strong> and the{" "}
            <strong className="text-foreground">service_role</strong> JWT (starts with{" "}
            <code className="rounded bg-muted/80 px-1">eyJ</code>) — not the personal{" "}
            <code className="rounded bg-muted/80 px-1">sbp_</code> token.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
