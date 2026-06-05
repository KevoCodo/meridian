import { AppShell } from "@/components/app-shell";

export default function Loading() {
  return (
    <AppShell>
      <div aria-label="Loading page" className="animate-pulse space-y-6">
        <div className="space-y-3">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-8 w-52 rounded bg-muted" />
          <div className="h-4 w-full max-w-xl rounded bg-muted" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-28 rounded-md border border-border bg-white"
              key={index}
            />
          ))}
        </div>
        <div className="h-72 rounded-md border border-border bg-white" />
      </div>
    </AppShell>
  );
}
