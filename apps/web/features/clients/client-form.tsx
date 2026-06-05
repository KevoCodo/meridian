"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/types/client";
import type { Workspace } from "@/types/workspace";

const clientFormSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().trim().min(1, "Client name is required"),
  status: z.enum(["active", "inactive", "archived"]),
  contactName: z.string().trim().max(255).optional(),
  contactEmail: z.union([
    z.literal(""),
    z.string().trim().email("Enter a valid email address"),
  ]),
  companyWebsite: z.union([
    z.literal(""),
    z.string().trim().url("Enter a valid website URL"),
  ]),
  notes: z.string().trim().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

export function ClientForm({
  client,
  workspaces,
}: {
  client?: Client;
  workspaces: Workspace[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      workspaceId: client?.workspaceId ?? workspaces[0]?.id ?? "",
      name: client?.name ?? "",
      status: client?.status ?? "active",
      contactName: client?.contactName ?? "",
      contactEmail: client?.contactEmail ?? "",
      companyWebsite: client?.companyWebsite ?? "",
      notes: client?.notes ?? "",
    },
  });

  async function onSubmit(values: ClientFormValues) {
    setFormError("");
    const response = await fetch(
      client ? `/api/clients/${client.id}` : "/api/clients",
      {
        method: client ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          contactName: normalizeOptional(values.contactName),
          contactEmail: normalizeOptional(values.contactEmail),
          companyWebsite: normalizeOptional(values.companyWebsite),
          notes: normalizeOptional(values.notes),
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFormError(error?.message ?? "Unable to save client");
      return;
    }

    const savedClient = (await response.json()) as Client;
    router.push(`/clients/${savedClient.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-md border border-border bg-white p-5 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Workspace" error={errors.workspaceId?.message}>
          <Select {...register("workspaceId")}>
            {workspaces.map((workspace) => (
              <option key={workspace.id} value={workspace.id}>
                {workspace.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>

        <Field label="Client name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Acme Operations" />
        </Field>

        <Field label="Contact name" error={errors.contactName?.message}>
          <Input {...register("contactName")} placeholder="Jordan Lee" />
        </Field>

        <Field label="Contact email" error={errors.contactEmail?.message}>
          <Input
            {...register("contactEmail")}
            placeholder="jordan@example.com"
            type="email"
          />
        </Field>

        <Field label="Company website" error={errors.companyWebsite?.message}>
          <Input
            {...register("companyWebsite")}
            placeholder="https://example.com"
            type="url"
          />
        </Field>
      </div>

      <Field label="Notes" error={errors.notes?.message}>
        <Textarea
          {...register("notes")}
          placeholder="Relationship context, operating notes, or onboarding details."
        />
      </Field>

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving" : "Save client"}
        </Button>
        <Button asChild type="button" variant="secondary">
          <Link href={client ? `/clients/${client.id}` : "/clients"}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Cancel
          </Link>
        </Button>
      </div>
    </form>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: ReactNode;
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

function normalizeOptional(value: string | undefined) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}
