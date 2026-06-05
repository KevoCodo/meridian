import Link from "next/link";
import type { ReactNode } from "react";

import { MeridianMark } from "@/components/brand/meridian-mark";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold">
            <MeridianMark className="h-8 w-8 text-primary" />
            <span>Meridian</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/workspaces">Workspace</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/clients">Clients</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/projects">Projects</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/tasks">Tasks</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/notes">Notes</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/activity">Activity</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/automations">Automations</Link>
            </Button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </main>
  );
}
