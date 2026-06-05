import { Suspense } from "react";

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      description="Access your business operations workspace."
      title="Log in"
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading form...</p>}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthShell>
  );
}
