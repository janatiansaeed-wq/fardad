"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { LocalizedContentProfile, Money, PublicCart } from "@fardad/types";
import Button from "@fardad/ui/Button";
import {
  refreshGuestCartQuoteAction,
  removeGuestCartLineAction,
  setGuestCartLineQuantityAction,
  type CartActionResult,
} from "@/src/lib/commerce/cart-actions";

type CartExperienceProps = Readonly<{
  content: LocalizedContentProfile["cart"];
  initialCart: PublicCart | null;
  initialMessage?: string;
  locale: string;
}>;

export default function CartExperience({
  content,
  initialCart,
  initialMessage,
  locale,
}: CartExperienceProps) {
  const [cart, setCart] = useState(initialCart);
  const [message, setMessage] = useState<string | undefined>(initialMessage);
  const [isPending, startTransition] = useTransition();
  const messageRef = useRef<HTMLParagraphElement>(null);
  const shouldFocusMessage = useRef(false);
  const router = useRouter();

  useEffect(() => {
    setCart(initialCart);
    setMessage(initialMessage);
  }, [initialCart, initialMessage]);
  useEffect(() => {
    if (message && shouldFocusMessage.current) {
      messageRef.current?.focus();
      shouldFocusMessage.current = false;
    }
  }, [message]);

  const applyResult = (result: CartActionResult) => {
    setCart(result.cart);
    setMessage(messageFor(result, content));
    shouldFocusMessage.current = true;
    router.refresh();
  };

  const runMutation = (operation: () => Promise<CartActionResult>) => {
    setMessage(undefined);
    startTransition(async () => applyResult(await operation()));
  };

  if (!cart || cart.status === "expired" || cart.lines.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
        <h1 className="text-3xl font-black text-[var(--ui-color-primary,#1f2937)]">
          {content.emptyTitle}
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-8 text-[var(--ui-color-muted-text,#4b5563)]">
          {content.emptyDescription}
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex min-h-11 items-center rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-primary,#1f2937)] px-6 py-3 font-medium text-[var(--ui-color-primary-contrast,#ffffff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
        >
          {content.continueShopping}
        </Link>
        <StatusMessage
          content={content}
          isPending={isPending}
          message={message}
          messageRef={messageRef}
        />
      </section>
    );
  }

  return (
    <section
      aria-busy={isPending}
      className="mx-auto w-full max-w-[var(--ui-content-max-width,90rem)] px-4 py-10 sm:py-14 lg:py-16"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-black text-[var(--ui-color-primary,#1f2937)] sm:text-4xl">
          {content.heading}
        </h1>
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] px-2 font-medium text-[var(--ui-color-primary,#1f2937)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
        >
          {content.continueShopping}
        </Link>
      </div>
      <StatusMessage
        content={content}
        isPending={isPending}
        message={message}
        messageRef={messageRef}
      />
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section aria-labelledby="cart-lines-heading">
          <h2 id="cart-lines-heading" className="sr-only">
            {content.linesHeading}
          </h2>
          <ul className="divide-y divide-[var(--ui-color-border,#d1d5db)] border-y border-[var(--ui-color-border,#d1d5db)]">
            {cart.lines.map((line) => (
              <li key={line.reference} className="py-5 sm:py-6">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div>
                    <h3 className="font-bold text-[var(--ui-color-primary,#1f2937)]">
                      {line.product.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--ui-color-muted-text,#4b5563)]">
                      {formatMoney(line.unitPrice, locale)}
                    </p>
                    {line.availability === "unavailable" ? (
                      <p className="mt-2 text-sm text-[var(--ui-color-muted-text,#4b5563)]">
                        {content.lineUnavailable}
                      </p>
                    ) : null}
                    {line.availability === "requires-refresh" ? (
                      <p className="mt-2 text-sm text-[var(--ui-color-muted-text,#4b5563)]">
                        {content.lineNeedsRefresh}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-semibold text-[var(--ui-color-text,#111827)]">
                    {formatMoney(line.subtotal, locale)}
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap items-end gap-3">
                  <form
                    className="flex flex-wrap items-end gap-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      const quantity = Number(new FormData(event.currentTarget).get("quantity"));
                      runMutation(() =>
                        setGuestCartLineQuantityAction(line.reference, { quantity }, cart.revision),
                      );
                    }}
                  >
                    <label className="grid gap-2 text-sm font-medium text-[var(--ui-color-text,#111827)]">
                      <span>{content.quantityLabel}</span>
                      <input
                        name="quantity"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        defaultValue={line.quantity}
                        disabled={isPending}
                        aria-label={`${content.quantityLabel}: ${line.product.name}`}
                        className="min-h-11 w-24 rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] px-3 text-[var(--ui-color-text,#111827)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
                      />
                    </label>
                    <Button type="submit" variant="outline" disabled={isPending}>
                      {content.updateQuantity}
                    </Button>
                  </form>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPending}
                    onClick={() =>
                      runMutation(() => removeGuestCartLineAction(line.reference, cart.revision))
                    }
                  >
                    {content.removeLine}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <aside className="rounded-[var(--ui-radius-medium,0.75rem)] border border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] p-5 shadow-[var(--ui-shadow-card,0_12px_32px_rgba(0,0,0,0.08))] sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-bold text-[var(--ui-color-primary,#1f2937)]">
              {content.subtotalLabel}
            </h2>
            <p className="font-semibold text-[var(--ui-color-text,#111827)]">
              {formatMoney(cart.subtotal, locale)}
            </p>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--ui-color-muted-text,#4b5563)]">
            {cart.quote.status === "fresh" ? content.quoteFresh : content.quoteNeedsRefresh}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="mt-6 w-full"
            onClick={() => runMutation(() => refreshGuestCartQuoteAction(cart.revision))}
          >
            {content.refreshQuote}
          </Button>
        </aside>
      </div>
    </section>
  );
}

function StatusMessage({
  content,
  isPending,
  message,
  messageRef,
}: Readonly<{
  content: LocalizedContentProfile["cart"];
  isPending: boolean;
  message: string | undefined;
  messageRef: React.RefObject<HTMLParagraphElement | null>;
}>) {
  return (
    <p
      ref={messageRef}
      tabIndex={-1}
      aria-live="polite"
      className="mt-5 text-sm leading-7 text-[var(--ui-color-muted-text,#4b5563)] focus-visible:outline-none"
    >
      {isPending ? content.workingMessage : message}
    </p>
  );
}

function messageFor(result: CartActionResult, content: LocalizedContentProfile["cart"]): string {
  if (result.status === "success") {
    return content.updatedMessage;
  }

  switch (result.reason) {
    case "cart-expired":
      return content.expiredMessage;
    case "unavailable":
      return content.unavailableMessage;
    case "quantity":
      return content.quantityMessage;
    case "revision-conflict":
      return content.conflictMessage;
    default:
      return content.failureMessage;
  }
}

function formatMoney(money: Money, locale: string): string {
  return `${new Intl.NumberFormat(locale).format(BigInt(money.amount))} ریال`;
}
