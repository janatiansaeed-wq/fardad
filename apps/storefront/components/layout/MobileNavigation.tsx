"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { MobileNavigationVariantId, NavigationItem } from "@fardad/types";

type MobileNavigationProps = {
  items: readonly NavigationItem[];
  ariaLabel: string;
  menuLabel: string;
  variant: MobileNavigationVariantId;
};

type MobileNavigationListProps = Readonly<{
  items: readonly NavigationItem[];
  level?: number;
  onNavigate: () => void;
}>;

function MobileNavigationList({
  items,
  level = 0,
  onNavigate,
}: MobileNavigationListProps) {
  return (
    <ul
      className={
        level === 0
          ? "grid gap-2"
          : "mt-2 grid gap-1 border-s border-[var(--ui-color-border,#d1d5db)] ps-3"
      }
    >
      {items.map((item) => (
        <li key={item.id}>
          <Link
            href={item.href}
            target={item.target === "blank" ? "_blank" : undefined}
            rel={item.target === "blank" ? "noreferrer" : undefined}
            onClick={onNavigate}
            className="flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] px-3 py-2 font-medium text-[var(--ui-color-text,#111827)] transition-colors hover:bg-[var(--ui-color-background,#ffffff)] hover:text-[var(--ui-color-primary,#1f2937)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
          >
            {item.label}
          </Link>
          {item.children?.length ? (
            <MobileNavigationList
              items={item.children}
              level={level + 1}
              onNavigate={onNavigate}
            />
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default function MobileNavigation({
  items,
  ariaLabel,
  menuLabel,
  variant,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openLabel = `باز کردن ${menuLabel}`;
  const closeLabel = `بستن ${menuLabel}`;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => closeRef.current?.focus());

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeMenu(restoreFocus: boolean) {
    setIsOpen(false);

    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  return (
    <div className="lg:hidden" data-variant={variant}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={openLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-3 py-2 font-medium text-[var(--ui-color-text,#111827)] transition-colors hover:bg-[var(--ui-color-background,#ffffff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ☰
        </span>
        <span>{menuLabel}</span>
      </button>
      {isOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-[70]"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label={closeLabel}
            onClick={() => closeMenu(true)}
            className="absolute inset-0 bg-[var(--ui-color-text,#111827)]/40"
          />
          <div
            ref={panelRef}
            className="absolute inset-y-0 end-0 flex h-dvh min-h-screen w-full max-w-sm flex-col border-s border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] shadow-[0_20px_60px_rgb(8_22_19_/_0.18)]"
          >
            <div className="flex min-h-20 items-center justify-between gap-4 border-b border-[var(--ui-color-border,#d1d5db)] px-4 sm:px-6">
              <h2
                id={titleId}
                className="text-xl font-semibold text-[var(--ui-color-primary,#1f2937)]"
              >
                {menuLabel}
              </h2>
              <button
                ref={closeRef}
                type="button"
                aria-label={closeLabel}
                onClick={() => closeMenu(true)}
                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-3 py-2 font-medium text-[var(--ui-color-text,#111827)] transition-colors hover:bg-[var(--ui-color-background,#ffffff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
              >
                <span aria-hidden="true" className="text-2xl leading-none">
                  ×
                </span>
                <span>{closeLabel}</span>
              </button>
            </div>
            <nav
              aria-label={ariaLabel}
              className="flex-1 overflow-y-auto overscroll-contain px-4 py-6 sm:px-6"
            >
              <MobileNavigationList items={items} onNavigate={() => closeMenu(false)} />
            </nav>
            <div className="border-t border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-background,#f8f4ec)] p-4 sm:p-6">
              <button
                type="button"
                disabled
                title="جست‌وجوی کاتالوگ پس از اتصال داده فعال می‌شود"
                className="mb-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[var(--ui-color-border,#8c8273)] px-4 text-sm font-semibold text-[var(--ui-color-muted-text,#4b5563)]"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ⌕
                </span>
                جست‌وجوی کاتالوگ
              </button>
              <Link
                href="#organizational-orders"
                onClick={() => closeMenu(false)}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--ui-color-primary,#0e3b2e)] px-5 font-semibold text-white transition-colors hover:bg-[var(--ui-color-text,#081613)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#a97142)] focus-visible:ring-offset-2"
              >
                سفارش سازمانی
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
