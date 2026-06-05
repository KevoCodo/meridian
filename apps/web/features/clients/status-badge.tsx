import type { ClientStatus } from "@/types/client";

const statusClasses: Record<ClientStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-700 ring-slate-200",
  archived: "bg-amber-50 text-amber-700 ring-amber-200",
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize ring-1 ring-inset ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}
