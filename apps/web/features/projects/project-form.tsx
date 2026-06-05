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
import type { Project } from "@/types/project";
import type { Workspace } from "@/types/workspace";

const optionalDate = z.union([
  z.literal(""),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
]);

const projectFormSchema = z.object({
  workspaceId: z.string().uuid(),
  clientId: z.string().uuid("Select a client"),
  name: z.string().trim().min(1, "Project name is required"),
  description: z.string().trim().optional(),
  status: z.enum(["planning", "active", "paused", "completed", "archived"]),
  priority: z.enum(["low", "medium", "high"]),
  startDate: optionalDate,
  dueDate: optionalDate,
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export function ProjectForm({
  clients,
  project,
  workspaces,
}: {
  clients: Client[];
  project?: Project;
  workspaces: Workspace[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      workspaceId: project?.workspaceId ?? workspaces[0]?.id ?? "",
      clientId: project?.clientId ?? clients[0]?.id ?? "",
      name: project?.name ?? "",
      description: project?.description ?? "",
      status: project?.status ?? "planning",
      priority: project?.priority ?? "medium",
      startDate: project?.startDate ?? "",
      dueDate: project?.dueDate ?? "",
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    setFormError("");
    const response = await fetch(
      project ? `/api/projects/${project.id}` : "/api/projects",
      {
        method: project ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          description: normalizeOptional(values.description),
          startDate: normalizeOptional(values.startDate),
          dueDate: normalizeOptional(values.dueDate),
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFormError(error?.message ?? "Unable to save project");
      return;
    }

    const savedProject = (await response.json()) as Project;
    router.push(`/projects/${savedProject.id}`);
    router.refresh();
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-md border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">A client is required first</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Projects belong to clients. Create a client before adding project work.
        </p>
        <Button asChild className="mt-4">
          <Link href="/clients/new">Create client</Link>
        </Button>
      </div>
    );
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

        <Field label="Client" error={errors.clientId?.message}>
          <Select {...register("clientId")}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Project name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Q3 implementation plan" />
        </Field>

        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>

        <Field label="Priority" error={errors.priority?.message}>
          <Select {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </Field>

        <Field label="Start date" error={errors.startDate?.message}>
          <Input {...register("startDate")} type="date" />
        </Field>

        <Field label="Due date" error={errors.dueDate?.message}>
          <Input {...register("dueDate")} type="date" />
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <Textarea
          {...register("description")}
          placeholder="Scope, outcome, and operating context for this project."
        />
      </Field>

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving" : "Save project"}
        </Button>
        <Button asChild type="button" variant="secondary">
          <Link href={project ? `/projects/${project.id}` : "/projects"}>
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
