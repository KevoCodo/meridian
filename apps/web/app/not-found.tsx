import { ArrowLeft, FileQuestion } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <AppShell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-lg rounded-md border border-border bg-white p-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-muted text-primary">
            <FileQuestion className="h-5 w-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The page may have moved or the address may be incorrect.
          </p>
          <Button asChild className="mt-6 gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
