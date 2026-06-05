import Link from "next/link";

import {
  ProjectPriorityBadge,
  ProjectStatusBadge,
} from "@/features/projects/project-badges";
import type { Client } from "@/types/client";
import type { Project } from "@/types/project";

export function ProjectList({
  clients,
  projects,
}: {
  clients: Client[];
  projects: Project[];
}) {
  const clientsById = new Map(clients.map((client) => [client.id, client]));

  if (projects.length === 0) {
    return (
      <div className="rounded-md border border-border bg-white p-6 text-sm text-muted-foreground">
        No projects match the current view.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Project</th>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Priority</th>
            <th className="px-4 py-3 font-medium">Due date</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const client = clientsById.get(project.clientId);
            return (
              <tr key={project.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">
                  <Link
                    className="text-primary hover:underline"
                    href={`/projects/${project.id}`}
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {client ? (
                    <Link
                      className="text-foreground hover:underline"
                      href={`/clients/${client.id}`}
                    >
                      {client.name}
                    </Link>
                  ) : (
                    "Unknown client"
                  )}
                </td>
                <td className="px-4 py-3">
                  <ProjectStatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3">
                  <ProjectPriorityBadge priority={project.priority} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {project.dueDate ? formatDate(project.dueDate) : "Not set"}
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
