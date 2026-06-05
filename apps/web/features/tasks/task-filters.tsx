import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { Project } from "@/types/project";
import type { TaskPriority, TaskStatus } from "@/types/task";

const statuses: TaskStatus[] = [
  "todo",
  "in_progress",
  "blocked",
  "completed",
  "archived",
];
const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

export function TaskFilters({
  projects,
  selectedPriority,
  selectedProjectId,
  selectedStatus,
}: {
  projects: Project[];
  selectedPriority?: string;
  selectedProjectId?: string;
  selectedStatus?: string;
}) {
  return (
    <form className="mb-5 flex flex-wrap items-end gap-3 rounded-md border border-border bg-white p-4 shadow-sm">
      <label className="grid min-w-56 gap-2 text-sm font-medium">
        Project
        <Select name="projectId" defaultValue={selectedProjectId ?? ""}>
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid min-w-48 gap-2 text-sm font-medium">
        Status
        <Select name="status" defaultValue={selectedStatus ?? ""}>
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid min-w-48 gap-2 text-sm font-medium">
        Priority
        <Select name="priority" defaultValue={selectedPriority ?? ""}>
          <option value="">All priorities</option>
          {priorities.map((priority) => (
            <option key={priority} value={priority}>
              {formatLabel(priority)}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" variant="secondary">
        <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
        Apply filters
      </Button>
    </form>
  );
}

function formatLabel(value: string) {
  const label = value.replace("_", " ");
  return label[0].toUpperCase() + label.slice(1);
}
