import { ReactNode } from "react";
import { cn } from "@fardad/utils";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export default function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[var(--ui-color-secondary,#e5e7eb)] px-3 py-1 text-xs font-semibold text-[var(--ui-color-secondary-contrast,#111827)]",
        className
      )}
    >
      {children}
    </span>
  );
}
