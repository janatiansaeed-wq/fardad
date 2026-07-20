import Link from "next/link";
import type { NavigationItem } from "@fardad/types";
import { cn } from "@fardad/utils";

type NavigationProps = {
  items: readonly NavigationItem[];
  ariaLabel: string;
  className?: string;
  listClassName?: string;
  linkClassName?: string;
};

function NavigationList({ items, linkClassName }: Pick<NavigationProps, "items" | "linkClassName">) {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            target={item.target === "blank" ? "_blank" : undefined}
            rel={item.target === "blank" ? "noreferrer" : undefined}
            className={cn(
              "rounded-[var(--ui-radius-small,0.375rem)] text-sm font-medium text-[var(--ui-color-text,#111827)] outline-none transition-colors hover:text-[var(--ui-color-primary,#1f2937)] focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2",
              linkClassName,
            )}
          >
            {item.label}
          </Link>
          {item.children?.length ? <NavigationList items={item.children} linkClassName={linkClassName} /> : null}
        </li>
      ))}
    </ul>
  );
}

export default function Navigation({
  items,
  ariaLabel,
  className,
  listClassName,
  linkClassName,
}: NavigationProps) {
  return (
    <nav aria-label={ariaLabel} className={className}>
      <div className={listClassName}>
        <NavigationList items={items} linkClassName={linkClassName} />
      </div>
    </nav>
  );
}
