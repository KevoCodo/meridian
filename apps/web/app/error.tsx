"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-md border border-border bg-white p-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-xl font-semibold">This page could not load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Check that the API is running, then try loading the page again.
          </p>
          <Button className="mt-6 gap-2" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
