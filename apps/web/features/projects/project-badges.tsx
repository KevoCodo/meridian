import type { ProjectPriority, ProjectStatus } from "@/types/project";

const statusClasses: Record<ProjectStatus, string> = {
  planning: "bg-sky-50 text-sky-700 ring-sky-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paused: "bg-amber-50 text-amber-700 ring-amber-200",
  completed: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};

const priorityClasses: Record<ProjectPriority, string> = {
  low: "bg-slate-100 text-slate-700 ring-slate-200",
  medium: "bg-blue-50 text-blue-700 ring-blue-200",
  high: "bg-red-50 text-red-700 ring-red-200",
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <Badge className={statusClasses[status]} label={status} />;
}

export function ProjectPriorityBadge({ priority }: { priority: ProjectPriority }) {
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
