import { ReactNode } from "react";
import { cn } from "@fardad/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[var(--ui-content-max-width,90rem)] px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
