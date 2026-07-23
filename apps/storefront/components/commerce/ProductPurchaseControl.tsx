"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { LocalizedContentProfile, Money, PublicPurchasingOption } from "@fardad/types";
import Button from "@fardad/ui/Button";
import { addGuestCartLineAction } from "@/src/lib/commerce/cart-actions";

type ProductPurchaseControlProps = Readonly<{
  content: LocalizedContentProfile["productDetail"]["purchase"];
  isShoppingPublished: boolean;
  locale: string;
  purchasingOption: PublicPurchasingOption | null;
}>;

export default function ProductPurchaseControl({
  content,
  isShoppingPublished,
  locale,
  purchasingOption,
}: ProductPurchaseControlProps) {
  const [quantity, setQuantity] = useState(purchasingOption?.quantity.min ?? 1);
  const [message, setMessage] = useState<string>();
  const messageRef = useRef<HTMLParagraphElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const canAddToCart = isCartable(purchasingOption);

  useEffect(() => {
    if (message) {
      messageRef.current?.focus();
    }
  }, [message]);

  if (!isShoppingPublished) {
    return null;
  }

  if (!canAddToCart) {
    return (
      <section className="mt-10 border-t border-[var(--ui-color-border,#d1d5db)] pt-8">
        <p className="leading-8 text-[var(--ui-color-muted-text,#4b5563)]">
          {content.unavailableDescription}
        </p>
      </section>
    );
  }

  const { price, productSlug, quantity: quantityRange } = purchasingOption;

  return (
    <section
      aria-busy={isPending}
      className="mt-10 border-t border-[var(--ui-color-border,#d1d5db)] pt-8"
    >
      <p className="font-semibold text-[var(--ui-color-primary,#1f2937)]">
        {formatMoney(price, locale)}
      </p>
      <p className="mt-2 leading-8 text-[var(--ui-color-muted-text,#4b5563)]">
        {content.cartableDescription}
      </p>
      <div className="mt-5 flex flex-wrap items-end gap-4">
        <label className="grid gap-2 text-sm font-medium text-[var(--ui-color-text,#111827)]">
          <span>{content.quantityLabel}</span>
          <input
            type="number"
            inputMode="numeric"
            min={quantityRange.min}
            max={quantityRange.max}
            value={quantity}
            disabled={isPending}
            onChange={(event) => setQuantity(normalizeQuantity(event.target.value, quantityRange))}
            className="min-h-11 w-24 rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] px-3 text-[var(--ui-color-text,#111827)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
          />
        </label>
        <Button
          type="button"
          disabled={isPending}
          aria-describedby={message ? "product-purchase-status" : undefined}
          onClick={() => {
            setMessage(undefined);
            startTransition(async () => {
              const result = await addGuestCartLineAction({ productSlug, quantity });
              if (result.status === "success") {
                router.push("/cart");
                return;
              }

              setMessage(content.purchaseError);
            });
          }}
        >
          {content.addToCart}
        </Button>
        <Link
          href="/cart"
          className="inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] px-2 font-medium text-[var(--ui-color-primary,#1f2937)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
        >
          {content.viewCart}
        </Link>
      </div>
      <p
        id="product-purchase-status"
        ref={messageRef}
        tabIndex={-1}
        aria-live="polite"
        className="mt-4 text-sm text-[var(--ui-color-muted-text,#4b5563)] focus-visible:outline-none"
      >
        {isPending ? content.addingToCart : message}
      </p>
    </section>
  );
}

function isCartable(
  option: PublicPurchasingOption | null,
): option is PublicPurchasingOption & Readonly<{ mode: "online"; price: Money }> {
  return (
    option?.mode === "online" &&
    option.availability === "available-to-order" &&
    option.price !== null &&
    option.quantity.min > 0 &&
    option.quantity.max >= option.quantity.min
  );
}

function normalizeQuantity(value: string, range: PublicPurchasingOption["quantity"]): number {
  const parsed = Number(value);

  if (!Number.isSafeInteger(parsed)) {
    return range.min;
  }

  return Math.min(range.max, Math.max(range.min, parsed));
}

function formatMoney(money: Money, locale: string): string {
  return `${new Intl.NumberFormat(locale).format(BigInt(money.amount))} ریال`;
}
