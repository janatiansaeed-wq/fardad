import type { ReactNode } from "react";
import { cn } from "@fardad/utils";

type SiteFooterProps = {
  identity: ReactNode;
  navigation?: ReactNode;
  legal: ReactNode;
  className?: string;
};

export default function SiteFooter({ identity, navigation, legal, className }: SiteFooterProps) {
  return (
    <footer className={cn("border-t border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] py-12", className)}>
      <div className="mx-auto grid w-full max-w-[var(--ui-content-max-width,90rem)] gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
        <div>{identity}</div>
        {navigation ? <div>{navigation}</div> : null}
        <div className="text-sm text-[var(--ui-color-muted-text,#4b5563)] lg:col-span-2">{legal}</div>
      </div>
    </footer>
  );
}
