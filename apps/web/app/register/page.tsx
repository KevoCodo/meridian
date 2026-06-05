import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export default function RegisterPage() {
  return (
    <AuthShell
      description="Create your Meridian account to begin."
      title="Create account"
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
