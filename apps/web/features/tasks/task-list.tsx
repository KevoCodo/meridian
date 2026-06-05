import Link from "next/link";

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
      <div className="rounded-md border border-border bg-white p-6 text-sm text-muted-foreground">
        No tasks match the current view.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-sm">
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
