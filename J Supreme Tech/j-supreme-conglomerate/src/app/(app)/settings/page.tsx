import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IntegrationsSettings } from "@/components/settings/integrations-settings";
import { SupabaseStatusCard } from "@/components/settings/supabase-status-card";
import { PushNotificationsCard } from "@/components/settings/push-notifications-card";

export default async function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Workspace Settings</h2>
        <p className="text-sm text-muted-foreground">
          Integrations and keys: use the <strong className="text-foreground">Integrations</strong> tab first if you just deployed.
        </p>
      </div>

      <Tabs defaultValue="integrations" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
        </TabsList>
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <PushNotificationsCard />
          <SupabaseStatusCard />
          <IntegrationsSettings />
        </TabsContent>
        <TabsContent value="workspace" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Multi-workspace</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Maps to <code className="rounded bg-muted px-1">workspaces</code> and related tables in Postgres.
              </p>
              <Separator />
              <p>
                Roles: <code className="rounded bg-muted px-1">admin</code>,{" "}
                <code className="rounded bg-muted px-1">member</code>,{" "}
                <code className="rounded bg-muted px-1">viewer</code> on{" "}
                <code className="rounded bg-muted px-1">profiles.role</code>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
