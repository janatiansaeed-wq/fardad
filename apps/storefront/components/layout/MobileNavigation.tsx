"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import type { MobileNavigationVariantId, NavigationItem } from "@fardad/types";

type MobileNavigationProps = {
  items: readonly NavigationItem[];
  ariaLabel: string;
  menuLabel: string;
  variant: MobileNavigationVariantId;
};

export default function MobileNavigation({
  items,
  ariaLabel,
  menuLabel,
  variant,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="lg:hidden" data-variant={variant}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-4 py-2 text-sm font-medium text-[var(--ui-color-text,#111827)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
      >
        {menuLabel}
      </button>
      {isOpen ? (
        <nav
          id={menuId}
          aria-label={ariaLabel}
          className="absolute inset-x-0 top-full border-b border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] p-4 shadow-lg"
        >
          <ul className="mx-auto grid w-full max-w-[var(--ui-content-max-width,90rem)] gap-1">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-[var(--ui-radius-small,0.375rem)] px-3 py-3 font-medium text-[var(--ui-color-text,#111827)] hover:bg-[var(--ui-color-background,#ffffff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
