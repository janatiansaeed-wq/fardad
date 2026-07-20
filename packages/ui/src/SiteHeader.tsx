import type { ReactNode } from "react";
import { cn } from "@fardad/utils";

type SiteHeaderProps = {
  brand: ReactNode;
  navigation: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export default function SiteHeader({ brand, navigation, actions, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--ui-color-border,#d1d5db)] bg-[color:var(--ui-color-surface,#ffffff)]/95 backdrop-blur",
        className,
      )}
    >
      <div className="mx-auto flex min-h-20 w-full max-w-[var(--ui-content-max-width,90rem)] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
        {brand}
        <div className="hidden flex-1 justify-end lg:flex">{navigation}</div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
