import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { isClerkConfigured } from "@/lib/env/clerk";

export default function SignInPage() {
  if (!isClerkConfigured()) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center px-4 py-12 text-center">
        <h1 className="text-xl font-semibold">Sign-in unavailable</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Clerk is not configured on this deployment. Set Clerk environment variables
          and redeploy.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-grid px-4 py-12">
      <div className="mb-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          J Supreme Conglomerate
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Operator sign-in
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-400">
          Sign in with <strong className="text-white">jordanmorrisr@gmail.com</strong>{" "}
          (Google or email). New sign-ups are disabled.
        </p>
      </div>
      <SignIn
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "#A855F7",
            colorBackground: "#0f0f15",
            colorText: "#f5f5f7",
            colorTextSecondary: "#a1a1aa",
            colorInputBackground: "#1a1a22",
            colorInputText: "#ffffff",
            borderRadius: "0.75rem",
          },
          elements: {
            rootBox: "mx-auto",
            card: "border border-white/10 bg-[#0f0f15] shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton:
              "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]",
            socialButtonsBlockButtonText: "text-white font-medium",
            dividerLine: "bg-white/10",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300",
            formFieldInput:
              "bg-[#1a1a22] border border-white/10 text-white placeholder:text-zinc-500",
            formButtonPrimary:
              "bg-[#A855F7] hover:bg-[#9333EA] text-white shadow-lg shadow-purple-500/20",
            footerActionLink__signUp: "hidden",
            footerAction: "hidden",
            footer: "bg-transparent",
          },
        }}
        routing="path"
        path="/sign-in"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}
