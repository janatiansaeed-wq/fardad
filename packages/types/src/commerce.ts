export type Money = Readonly<{
  amount: string;
  currency: "IRR";
}>;

export type PublicPurchasingOption = Readonly<{
  productSlug: string;
  mode: "online" | "price-hidden" | "inquiry-only";
  availability: "available-to-order" | "unavailable";
  price: Money | null;
  quantity: Readonly<{
    min: number;
    max: number;
  }>;
}>;

export type PublicCart = Readonly<{
  revision: number;
  status: "active" | "expired";
  expiresAt: string;
  quote: Readonly<{
    status: "fresh" | "stale";
    validUntil: string | null;
  }>;
  subtotal: Money;
  lines: readonly Readonly<{
    reference: string;
    product: Readonly<{
      slug: string;
      name: string;
    }>;
    quantity: number;
    unitPrice: Money;
    subtotal: Money;
    availability: "available" | "requires-refresh" | "unavailable";
  }>[];
}>;

export type AddCartLineInput = Readonly<{
  productSlug: string;
  quantity: number;
}>;

export type SetCartLineQuantityInput = Readonly<{
  quantity: number;
}>;

export type PublicCommerceErrorCode =
  | "CART_EXPIRED"
  | "CART_LIMIT_REACHED"
  | "CART_REVISION_CONFLICT"
  | "IDEMPOTENCY_CONFLICT"
  | "PRODUCT_UNAVAILABLE"
  | "QUANTITY_NOT_ALLOWED"
  | "QUOTE_CHANGED";
