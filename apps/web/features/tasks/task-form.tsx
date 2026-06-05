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
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Workspace } from "@/types/workspace";

const optionalDate = z.union([
  z.literal(""),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
]);

const taskFormSchema = z.object({
  workspaceId: z.string().uuid(),
  projectId: z.string().uuid("Select a project"),
  title: z.string().trim().min(1, "Task title is required"),
  description: z.string().trim().optional(),
  status: z.enum(["todo", "in_progress", "blocked", "completed", "archived"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: optionalDate,
  assignedTo: z.string().trim().max(255).optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export function TaskForm({
  projects,
  task,
  workspaces,
}: {
  projects: Project[];
  task?: Task;
  workspaces: Workspace[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      workspaceId: task?.workspaceId ?? workspaces[0]?.id ?? "",
      projectId: task?.projectId ?? projects[0]?.id ?? "",
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "todo",
      priority: task?.priority ?? "medium",
      dueDate: task?.dueDate ?? "",
      assignedTo: task?.assignedTo ?? "",
    },
  });

  async function onSubmit(values: TaskFormValues) {
    setFormError("");
    const response = await fetch(task ? `/api/tasks/${task.id}` : "/api/tasks", {
      method: task ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        description: normalizeOptional(values.description),
        dueDate: normalizeOptional(values.dueDate),
        assignedTo: normalizeOptional(values.assignedTo),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFormError(error?.message ?? "Unable to save task");
      return;
    }

    const savedTask = (await response.json()) as Task;
    router.push(`/tasks/${savedTask.id}`);
    router.refresh();
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-md border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">A project is required first</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Tasks belong to projects. Create a project before adding actionable work.
        </p>
        <Button asChild className="mt-4">
          <Link href="/projects/new">Create project</Link>
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

        <Field label="Project" error={errors.projectId?.message}>
          <Select {...register("projectId")}>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Task title" error={errors.title?.message}>
          <Input {...register("title")} placeholder="Prepare client kickoff agenda" />
        </Field>

        <Field label="Assigned to" error={errors.assignedTo?.message}>
          <Input {...register("assignedTo")} placeholder="Team member name" />
        </Field>

        <Field label="Status" error={errors.status?.message}>
          <Select {...register("status")}>
            <option value="todo">Todo</option>
            <option value="in_progress">In progress</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </Select>
        </Field>

        <Field label="Priority" error={errors.priority?.message}>
          <Select {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </Field>

        <Field label="Due date" error={errors.dueDate?.message}>
          <Input {...register("dueDate")} type="date" />
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <Textarea
          {...register("description")}
          placeholder="Expected outcome, dependencies, and completion details."
        />
      </Field>

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving" : "Save task"}
        </Button>
        <Button asChild type="button" variant="secondary">
          <Link href={task ? `/tasks/${task.id}` : "/tasks"}>
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
