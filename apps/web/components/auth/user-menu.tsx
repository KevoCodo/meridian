"use client";

import { LogOut, UserRound } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

export function UserMenu() {
  const { loading, logout, user } = useAuth();

  return (
    <div className="flex items-center gap-3 border-t border-border px-3 py-3 lg:mt-auto">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
        <UserRound className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="hidden min-w-0 flex-1 lg:block">
        <p className="truncate text-sm font-medium">
          {loading ? "Loading" : user?.name ?? "Signed in"}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Button
        aria-label="Log out"
        className="h-9 w-9 shrink-0 px-0"
        onClick={() => void logout()}
        title="Log out"
        variant="ghost"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
