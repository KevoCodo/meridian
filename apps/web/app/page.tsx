import { HealthCard } from "@/features/foundation/health-card";
import { MeridianMark } from "@/components/brand/meridian-mark";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stack = [
  "Next.js",
  "TypeScript",
  "React",
  "shadcn/ui-ready structure",
  "FastAPI",
  "Pydantic",
  "SQLAlchemy",
  "Alembic",
  "PostgreSQL",
  "Docker Compose",
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Project Status: Foundation Phase
            </p>
            <div className="mt-3 flex items-center gap-3">
              <MeridianMark className="h-14 w-14 text-primary" />
              <h1 className="text-4xl font-bold">Meridian</h1>
            </div>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Business Operations Platform
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/clients">View clients</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/projects">View projects</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/workspaces">Workspace overview</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[1fr_1.25fr]">
        <div className="rounded-md border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Technology Stack Summary</h2>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {stack.map((item) => (
              <li key={item} className="rounded-md bg-muted px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <HealthCard />
      </section>
    </main>
  );
}
