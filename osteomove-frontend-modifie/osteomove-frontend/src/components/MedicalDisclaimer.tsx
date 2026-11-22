import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function MedicalDisclaimer({
  children,
  variant = "info",
  className,
}: {
  children: ReactNode;
  variant?: "info" | "warning";
  className?: string;
}) {
  const isWarning = variant === "warning";
  const Icon = isWarning ? ShieldAlert : ShieldCheck;
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-card border-2 p-5 text-base",
        isWarning ? "border-amber-600 bg-amber-50" : "border-primary/40 bg-secondary",
        className,
      )}
    >
      <Icon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
