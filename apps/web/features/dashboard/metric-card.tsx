import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export function MetricCard({
  href,
  icon: Icon,
  label,
  supportingText,
  value,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  supportingText: string;
  value: number;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-colors hover:border-primary">
        <CardContent className="flex h-full items-start justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{supportingText}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
