import type { ReactNode } from "react";
import { cn } from "@fardad/utils";

type PageStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export default function PageState({ title, description, action, className }: PageStateProps) {
  return (
    <section className={cn("mx-auto flex min-h-64 max-w-xl flex-col items-center justify-center px-4 py-16 text-center", className)}>
      <h1 className="text-2xl font-bold text-[var(--ui-color-primary,#1f2937)]">{title}</h1>
      {description ? <p className="mt-3 text-[var(--ui-color-muted-text,#4b5563)]">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
