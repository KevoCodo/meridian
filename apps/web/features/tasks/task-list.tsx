import { ListTodo } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { TaskPriorityBadge, TaskStatusBadge } from "@/features/tasks/task-badges";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export function TaskList({
  projects,
  tasks,
}: {
  projects: Project[];
  tasks: Task[];
}) {
  const projectsById = new Map(projects.map((project) => [project.id, project]));

  if (tasks.length === 0) {
    return (
      <EmptyState
        actionHref="/tasks/new"
        actionLabel="Create task"
        description="Create a task or adjust the current filters to find actionable work."
        icon={ListTodo}
        title="No tasks match this view"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Task</th>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Due date</th>
            <th className="px-4 py-3 font-medium">Assigned to</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const project = projectsById.get(task.projectId);
            return (
              <tr key={task.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">
                  <Link className="text-primary hover:underline" href={`/tasks/${task.id}`}>
                    {task.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {project ? (
                    <Link
                      className="text-foreground hover:underline"
                      href={`/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                  ) : (
                    "Unknown project"
                  )}
                </td>
                <td className="px-4 py-3">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <TaskPriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {task.dueDate ? formatDate(task.dueDate) : "Not set"}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {task.assignedTo || "Unassigned"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(`${value}T00:00:00`));
}
