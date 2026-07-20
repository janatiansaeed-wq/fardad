import { ReactNode } from "react";
import { cn } from "@fardad/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-surface,#ffffff)] shadow-[var(--ui-shadow-card,0_12px_32px_rgba(0,0,0,0.08))] transition-transform duration-200 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
