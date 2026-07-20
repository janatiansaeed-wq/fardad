import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@fardad/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export default function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-[var(--ui-radius-medium,0.75rem)] px-6 py-3 font-medium transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2",

        variant === "primary" &&
          "bg-[var(--ui-color-primary,#1f2937)] text-[var(--ui-color-primary-contrast,#ffffff)] hover:opacity-90",

        variant === "secondary" &&
          "bg-[var(--ui-color-secondary,#e5e7eb)] text-[var(--ui-color-secondary-contrast,#111827)] hover:opacity-90",

        variant === "outline" &&
          "border border-[var(--ui-color-primary,#1f2937)] text-[var(--ui-color-primary,#1f2937)] hover:bg-[var(--ui-color-primary,#1f2937)] hover:text-[var(--ui-color-primary-contrast,#ffffff)]",

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
