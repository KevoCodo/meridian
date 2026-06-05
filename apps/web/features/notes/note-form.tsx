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
import type { Note } from "@/types/note";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Workspace } from "@/types/workspace";

const noteSchema = z.object({
  workspaceId: z.string().uuid(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  taskId: z.string().optional(),
  title: z.string().trim().min(1, "Title is required"),
  content: z.string().trim().min(1, "Note content is required"),
});

type NoteValues = z.infer<typeof noteSchema>;

export function NoteForm({
  clients,
  defaults,
  note,
  projects,
  tasks,
  workspaces,
}: {
  clients: Client[];
  defaults?: Partial<NoteValues>;
  note?: Note;
  projects: Project[];
  tasks: Task[];
  workspaces: Workspace[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<NoteValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      workspaceId: note?.workspaceId ?? defaults?.workspaceId ?? workspaces[0]?.id ?? "",
      clientId: note?.clientId ?? defaults?.clientId ?? "",
      projectId: note?.projectId ?? defaults?.projectId ?? "",
      taskId: note?.taskId ?? defaults?.taskId ?? "",
      title: note?.title ?? "",
      content: note?.content ?? "",
    },
  });

  async function onSubmit(values: NoteValues) {
    setFormError("");
    const response = await fetch(note ? `/api/notes/${note.id}` : "/api/notes", {
      method: note ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        clientId: emptyToNull(values.clientId),
        projectId: emptyToNull(values.projectId),
        taskId: emptyToNull(values.taskId),
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFormError(error?.message ?? "Unable to save note");
      return;
    }

    const saved = (await response.json()) as Note;
    router.push(`/notes/${saved.id}`);
    router.refresh();
  }

  return (
    <form
      className="space-y-6 rounded-md border border-border bg-white p-5 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
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
            <option value="">No client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Project" error={errors.projectId?.message}>
          <Select {...register("projectId")}>
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Task" error={errors.taskId?.message}>
          <Select {...register("taskId")}>
            <option value="">No task</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </Select>
        </Field>
      </div>
      <Field label="Title" error={errors.title?.message}>
        <Input {...register("title")} placeholder="Client meeting context" />
      </Field>
      <Field label="Content" error={errors.content?.message}>
        <Textarea
          className="min-h-56"
          {...register("content")}
          placeholder="Capture useful context, decisions, and follow-up information."
        />
      </Field>
      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
      <div className="flex gap-3">
        <Button disabled={isSubmitting} type="submit">
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving" : "Save note"}
        </Button>
        <Button asChild variant="secondary">
          <Link href={note ? `/notes/${note.id}` : "/notes"}>
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Cancel
          </Link>
        </Button>
      </div>
    </form>
  );
}

function Field({ children, error, label }: { children: ReactNode; error?: string; label: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function emptyToNull(value?: string) {
  return value ? value : null;
}
