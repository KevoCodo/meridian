import type { TaskPriority, TaskStatus } from "@/types/task";

const statusClasses: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700 ring-slate-200",
  in_progress: "bg-sky-50 text-sky-700 ring-sky-200",
  blocked: "bg-red-50 text-red-700 ring-red-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  archived: "bg-zinc-100 text-zinc-700 ring-zinc-200",
};

const priorityClasses: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-700 ring-slate-200",
  medium: "bg-blue-50 text-blue-700 ring-blue-200",
  high: "bg-amber-50 text-amber-700 ring-amber-200",
  urgent: "bg-red-50 text-red-700 ring-red-200",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={statusClasses[status]} label={status.replace("_", " ")} />;
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge className={priorityClasses[priority]} label={priority} />;
}

function Badge({ className, label }: { className: string; label: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${className}`}
    >
      {label}
    </span>
  );
}
