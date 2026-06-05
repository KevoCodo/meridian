"use client";

import {
  Activity,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  ListTodo,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigation: Array<{ href: string; icon: LucideIcon; label: string }> = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/clients", icon: Building2, label: "Clients" },
  { href: "/projects", icon: BriefcaseBusiness, label: "Projects" },
  { href: "/tasks", icon: ListTodo, label: "Tasks" },
  { href: "/notes", icon: FileText, label: "Notes" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/automations", icon: Workflow, label: "Automations" },
];

export function AppNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="flex gap-1 overflow-x-auto p-2 lg:flex-col lg:overflow-visible lg:p-3"
    >
      {navigation.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
