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
        "container mx-auto w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
