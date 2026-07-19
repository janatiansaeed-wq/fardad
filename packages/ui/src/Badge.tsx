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
        "inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-dark",
        className
      )}
    >
      {children}
    </span>
  );
}
