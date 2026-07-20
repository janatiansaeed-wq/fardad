import type { ReactNode } from "react";

type SkipLinkProps = {
  href: string;
  children: ReactNode;
};

export default function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="sr-only z-[100] rounded-[var(--ui-radius-small,0.375rem)] bg-[var(--ui-color-primary,#1f2937)] px-4 py-3 text-[var(--ui-color-primary-contrast,#ffffff)] focus:not-sr-only focus:fixed focus:inset-x-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-[var(--ui-color-focus,#2563eb)] focus:ring-offset-2 sm:focus:right-auto sm:focus:left-4"
    >
      {children}
    </a>
  );
}
