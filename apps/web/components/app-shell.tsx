import Link from "next/link";
import type { ReactNode } from "react";

import { AppNavigation } from "@/components/app-navigation";
import { UserMenu } from "@/components/auth/user-menu";
import { MeridianMark } from "@/components/brand/meridian-mark";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex flex-col border-b border-border bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-16 items-center border-b border-border px-5">
          <Link href="/" className="flex items-center gap-2.5 text-lg font-bold">
            <MeridianMark className="h-8 w-8 text-primary" />
            <span>Meridian</span>
          </Link>
        </div>
        <AppNavigation />
        <UserMenu />
      </aside>
      <div className="min-w-0">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </div>
    </main>
  );
}
