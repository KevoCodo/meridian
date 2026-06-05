"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const authFormSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  name: z.string().trim().max(255).optional(),
  password: z.string().min(1, "Password is required"),
});

type AuthFormValues = z.infer<typeof authFormSchema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: { email: "", name: "", password: "" },
  });

  async function onSubmit(values: AuthFormValues) {
    setFormError("");
    if (mode === "register" && !values.name?.trim()) {
      setFormError("Name is required");
      return;
    }
    if (mode === "register" && values.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFormError(error?.detail ?? "Unable to continue");
      return;
    }
    window.location.assign(safeNextPath(searchParams.get("next")));
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {mode === "register" ? (
        <Field error={errors.name?.message} label="Name">
          <Input autoComplete="name" {...register("name")} />
        </Field>
      ) : null}
      <Field error={errors.email?.message} label="Email">
        <Input autoComplete="email" type="email" {...register("email")} />
      </Field>
      <Field error={errors.password?.message} label="Password">
        <Input
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          type="password"
          {...register("password")}
        />
      </Field>
      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      <Button className="w-full gap-2" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Please wait" : mode === "login" ? "Log in" : "Create account"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? "Need an account? " : "Already have an account? "}
        <Link
          className="font-medium text-primary hover:underline"
          href={mode === "login" ? "/register" : "/login"}
        >
          {mode === "login" ? "Register" : "Log in"}
        </Link>
      </p>
    </form>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}
