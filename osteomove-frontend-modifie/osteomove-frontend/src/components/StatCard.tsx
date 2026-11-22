import type { LucideIcon } from "lucide-react";
import { Card } from "./ui";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary-dark">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium text-ink/80">{label}</p>
        <p className="font-heading text-3xl font-semibold">{value}</p>
        {hint && <p className="text-sm text-ink/70">{hint}</p>}
      </div>
    </Card>
  );
}
