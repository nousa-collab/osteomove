import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "../lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

const buttonVariants: Record<ButtonVariant, string> = {
  // primary-dark (#1B7A6D) : contraste de 5,2:1 avec le texte blanc (AA). Le teal #239B8B seul n'atteint que 3,4:1.
  primary: "bg-primary-dark text-white hover:bg-[#15665B]",
  secondary: "bg-secondary text-ink hover:bg-[#cdeee2]",
  outline: "border-2 border-primary-dark text-primary-dark hover:bg-secondary",
  ghost: "text-ink hover:bg-secondary",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        buttonVariants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-card border border-secondary bg-white p-6 shadow-soft", className)}>
      {children}
    </div>
  );
}

type BadgeVariant = "teal" | "soft" | "danger" | "neutral";

const badgeVariants: Record<BadgeVariant, string> = {
  teal: "bg-primary-dark text-white",
  soft: "bg-secondary text-ink",
  danger: "bg-red-700 text-white",
  neutral: "border border-ink/20 bg-white text-ink",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", badgeVariants[variant], className)}>
      {children}
    </span>
  );
}

export function Input({
  label,
  id,
  error,
  hint,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; error?: string; hint?: string }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink/70">
          {hint}
        </p>
      )}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          "min-h-[48px] w-full rounded-xl border-2 bg-white px-4 text-base outline-none focus:border-primary",
          error ? "border-red-700" : "border-ink/20",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function Select({
  label,
  id,
  options,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  id: string;
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <select
        id={id}
        className={cn(
          "min-h-[48px] w-full rounded-xl border-2 border-ink/20 bg-white px-4 text-base outline-none focus:border-primary",
          className,
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
