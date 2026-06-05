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
import type { AutomationRule } from "@/types/automation-rule";
import type { Workspace } from "@/types/workspace";

const ruleFormSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().trim().min(1, "Rule name is required"),
  description: z.string().trim().optional(),
  triggerType: z.enum(["task_completed", "project_created", "client_created"]),
  actionType: z.enum([
    "create_follow_up_task",
    "add_activity_log",
    "create_note_stub",
  ]),
  isActive: z.boolean(),
});

type RuleFormValues = z.infer<typeof ruleFormSchema>;

export function AutomationRuleForm({
  rule,
  workspaces,
}: {
  rule?: AutomationRule;
  workspaces: Workspace[];
}) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<RuleFormValues>({
    resolver: zodResolver(ruleFormSchema),
    defaultValues: {
      workspaceId: rule?.workspaceId ?? workspaces[0]?.id ?? "",
      name: rule?.name ?? "",
      description: rule?.description ?? "",
      triggerType: rule?.triggerType ?? "task_completed",
      actionType: rule?.actionType ?? "create_follow_up_task",
      isActive: rule?.isActive ?? false,
    },
  });

  async function onSubmit(values: RuleFormValues) {
    setFormError("");
    const response = await fetch(
      rule ? `/api/automation-rules/${rule.id}` : "/api/automation-rules",
      {
        method: rule ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          description: values.description?.trim() || null,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      setFormError(error?.message ?? "Unable to save automation rule");
      return;
    }

    const savedRule = (await response.json()) as AutomationRule;
    router.push(`/automations/${savedRule.id}`);
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

        <Field label="Rule name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Follow up after task completion" />
        </Field>

        <Field label="Trigger" error={errors.triggerType?.message}>
          <Select {...register("triggerType")}>
            <option value="task_completed">Task completed</option>
            <option value="project_created">Project created</option>
            <option value="client_created">Client created</option>
          </Select>
        </Field>

        <Field label="Action" error={errors.actionType?.message}>
          <Select {...register("actionType")}>
            <option value="create_follow_up_task">Create follow-up task</option>
            <option value="add_activity_log">Add activity log</option>
            <option value="create_note_stub">Create note stub</option>
          </Select>
        </Field>
      </div>

      <Field label="Description" error={errors.description?.message}>
        <Textarea
          {...register("description")}
          placeholder="Describe the intended business workflow."
        />
      </Field>

      <label className="flex items-center gap-3 rounded-md border border-border p-4">
        <input className="h-4 w-4 accent-primary" type="checkbox" {...register("isActive")} />
        <span>
          <span className="block text-sm font-medium">Active rule</span>
          <span className="block text-xs text-muted-foreground">
            Marks this definition as active. Rules are not executed in this phase.
          </span>
        </span>
      </label>

      {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button disabled={isSubmitting} type="submit">
          <Save className="mr-2 h-4 w-4" aria-hidden="true" />
          {isSubmitting ? "Saving" : "Save rule"}
        </Button>
        <Button asChild type="button" variant="secondary">
          <Link href={rule ? `/automations/${rule.id}` : "/automations"}>
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
