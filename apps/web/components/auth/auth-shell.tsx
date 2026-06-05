import Link from "next/link";
import type { ReactNode } from "react";

import { MeridianMark } from "@/components/brand/meridian-mark";

export function AuthShell({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 text-xl font-bold">
          <MeridianMark className="h-9 w-9 text-primary" />
          <span>Meridian</span>
        </Link>
        <section className="rounded-md border border-border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          <div className="mt-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
