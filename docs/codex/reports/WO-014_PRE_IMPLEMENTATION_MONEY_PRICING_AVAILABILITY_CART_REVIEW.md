# WO-014 Pre-Implementation Money, Pricing, Availability, and Cart Foundation Review

- Date: 2026-07-20
- Branch: `architecture-refactor`
- Baseline commit: `aae9ef2` (`Normalize commerce review formatting`)
- Review type: focused architecture and schema-design review
- Implementation status: not started

## Executive Summary and Readiness

The repository prerequisite gate passed: the worktree was clean, the three WO-012 product-detail route files were tracked, and the WO-013 review was committed at the inspected baseline. This review therefore proceeded without modifying application source, Prisma schema, migrations, seeds, tests, dependencies, lockfiles, or configuration.

The smallest safe commerce foundation is:

1. one persisted, server-owned `Store` boundary;
2. an exact integer-IRR `Money` transport contract backed by PostgreSQL `bigint` / Prisma `BigInt`;
3. a store-scoped, effective-dated, versioned `ProductOffer` that keeps descriptive `Product` records store-neutral;
4. the single initial availability state `AVAILABLE_TO_ORDER`, plus `UNAVAILABLE` for explicit withdrawal;
5. a guest `Cart` with opaque bearer ownership, optimistic concurrency, idempotent mutation records, persisted price snapshots, bounded quote validity, and append-only commerce audit events.

No checkout, order, payment, invoice, stock, reservation, warehouse, tax, shipping, discount, gift-box pricing, add-on pricing, or authenticated-cart merge belongs in the first implementation.

**Readiness decision:** `READY FOR A CONTROLLED IMPLEMENTATION WORK ORDER AFTER THE APPROVAL GATES IN THIS REPORT ARE ACCEPTED.` The architecture is not blocked by the current repository. Implementation must not begin merely from this review because policy values, the exact bootstrap procedure, and the proposed schema/API contract remain CTO approval points.

## Repository State

### Entry gate evidence

| Check                              | Result                                                                                                       |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Active branch                      | `architecture-refactor`                                                                                      |
| HEAD                               | `aae9ef2 (HEAD -> architecture-refactor, origin/architecture-refactor) Normalize commerce review formatting` |
| Initial `git status --short -uall` | no output; clean                                                                                             |
| WO-012 `page.tsx`                  | tracked                                                                                                      |
| WO-012 `loading.tsx`               | tracked                                                                                                      |
| WO-012 `error.tsx`                 | tracked                                                                                                      |
| WO-013 review report               | tracked and committed                                                                                        |

Verified paths:

- `apps/storefront/app/(public)/products/[slug]/page.tsx`
- `apps/storefront/app/(public)/products/[slug]/loading.tsx`
- `apps/storefront/app/(public)/products/[slug]/error.tsx`
- `docs/codex/reports/WO-013_PRE_IMPLEMENTATION_CART_ORDER_PAYMENT_INVOICE_REVIEW.md`

### Current architectural facts

- `apps/api/prisma/schema.prisma` is the canonical Prisma owner and targets PostgreSQL.
- The schema has no persisted Store, Tenant, Merchant, Offer, Cart, Order, Payment, Invoice, pricing-rule, document-series, or provider-account model.
- `Product` is a descriptive/catalog aggregate. It has no authoritative sale price or inventory field.
- `GiftBox.price` and `AddonService.price` are `Decimal(18,2)` extension inputs from WO-006. They are not a product offer, checkout price, or authorization to build extension pricing into this foundation.
- `ProductConfiguration` validates extension availability only. It does not own carts, quotes, or totals.
- The Prisma schema already uses `BigInt` for media byte sizes, so generated-client BigInt handling is not new to the repository; commerce still requires an explicit transport mapper.
- The existing `PublicProductCard` and `PublicProductDetail` contracts contain no price, availability, stock, cart, internal identifier, or readiness data.
- Public lifecycle eligibility and `ProductDataQualityService.evaluate(product.id)` already define the catalog publication boundary and must be reused unchanged.
- The Storefront has one app-owned production composition, `fardad-production`, and only `catalog.products` is currently implemented/publishable. That static composition is presentation configuration, not a persisted commerce Store.
- `catalog.shop` entitlement/enabling does not authorize publishing commerce UI. Capability visibility remains entitlement intersected with enabled, implemented, and publishable behavior.
- No live database connection or migration execution was authorized or attempted.

## Approved Binding Decisions

This review treats the following decisions as fixed:

1. The first commerce schema is reusable across brands and stores.
2. Every commerce aggregate, offer, cart, pricing rule, document series, provider account, and audit record is server-derived and store-scoped.
3. IRR is canonical. Monetary values are exact integer rials. Toman is an input/presentation unit only, with exactly `1 Toman = 10 IRR`.
4. The initial sellability concept is “available to order.” Stock, reservation, backorder, preorder, and warehouse logic do not exist in this phase.
5. Guest cart and later guest checkout are allowed. Login is optional.
6. A future Fardad document is a branded commercial invoice, not a legal tax invoice.
7. The Base edition may later use one ordinary payment gateway. Installments, multi-gateway routing, wallet, corporate credit, loyalty, referral, chat, and ticketing remain deferred paid/separate capabilities.
8. Existing public product contracts remain informational and do not acquire price, stock, or cart fields.

## Current Gaps

| Area                         | Current state                                                | Required foundation                                           |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| Store ownership              | Static Storefront composition only                           | Persisted `Store` security and commerce partition             |
| Money                        | Generic `formatPrice(number)` and extension `Decimal` fields | Canonical integer-IRR contract and BigInt-safe mapper         |
| Product selling              | Informational Product only                                   | Separate store-scoped Product offer                           |
| Availability                 | No selling availability                                      | `AVAILABLE_TO_ORDER` / `UNAVAILABLE`; no inventory inference  |
| Guest ownership              | No cart                                                      | High-entropy opaque cookie token; only a digest at rest       |
| Pricing snapshot             | No quote                                                     | Line price snapshots, aggregate subtotal, fingerprint, expiry |
| Concurrent mutations         | No cart revision                                             | Compare-and-increment optimistic revision in one transaction  |
| Retry safety                 | No cart idempotency                                          | Store-scoped mutation-key and request-digest record           |
| Commerce audit               | No commerce events                                           | Store-scoped, server-derived, append-only audit event         |
| Storefront commerce boundary | Public catalog client only                                   | Server-only commerce client and Server Action/BFF boundary    |

## Precise Domain and Schema Proposal

### 1. Store is the minimum persistent boundary

Create `Store`; do not create `Tenant` or `Merchant` yet.

- `Store` is the commerce/security partition used on every query and write.
- `Tenant` would only add value when one organizational owner groups multiple stores. That requirement is not approved.
- `Merchant` or legal-entity ownership is required when payment provider accounts and commercial documents are implemented. It is premature here.
- Future Tenant/Merchant models may own stores, but future commerce records must continue to carry `storeId`; scoping must not become an indirect join.
- The static `fardad-production` composition remains app-owned presentation configuration. A stable server-only commerce key maps it to the persisted Store; a request-supplied database ID never does.
- For the initial one-store deployment, API environment validation binds the API instance to exact key `fardad`. A future multi-host gateway may use a server-owned allowlist from verified host to store key. Neither request bodies nor query strings choose a Store.

Recommended bootstrap record:

| Field         | Value                                                |
| ------------- | ---------------------------------------------------- |
| `key`         | `fardad`                                             |
| `profileKey`  | `fardad-production`                                  |
| `displayName` | `Fardad` or approved Persian legal/presentation name |
| `status`      | `ACTIVE`                                             |
| `currency`    | `IRR`                                                |

The migration must not hard-code this brand row. An explicit idempotent operator bootstrap command should create it after the additive migration and before commerce is enabled. Startup must fail closed for commerce if the configured Store key has no active database row.

### 2. Exact Money contract and database representation

Framework-independent shared transport contract:

```ts
export type Money = Readonly<{
  amount: string;
  currency: "IRR";
}>;
```

`amount` is a base-10 rial integer string because JSON cannot safely carry arbitrary JavaScript BigInt values and JavaScript `number` cannot preserve all PostgreSQL `bigint` integers.

Canonical input grammar:

```text
0 | [1-9][0-9]*
```

Therefore transport values reject signs, decimals, exponent notation, separators, Persian/Arabic digits, whitespace, and leading zeros other than the single value `0`. UI may localize digits only after the canonical Money value has reached presentation code.

For a future trusted back-office input only, use a distinct intent type:

```ts
type MoneyInput = Readonly<{
  amount: string;
  unit: "IRR" | "TOMAN";
}>;
```

Toman input is validated as a canonical non-negative integer and multiplied by exactly `10n` on the server with a preflight overflow check. `TOMAN` is never persisted as a currency. Toman display is exact only when rial amount modulo `10n` is zero; otherwise the UI displays IRR and must not round.

Database representation:

- Prisma: `BigInt @db.BigInt`.
- PostgreSQL: `bigint`.
- Application arithmetic: native `bigint` only.
- Transport: explicit decimal-string mapper only.
- Forbidden: `number`, `parseFloat`, binary floating point, implicit `Number(bigint)`, and locale strings in domain logic.

Prisma officially maps `BigInt` to PostgreSQL `bigint`; PostgreSQL documents `bigint` as an exact 8-byte integer with maximum `9,223,372,036,854,775,807`. See [Prisma PostgreSQL type mapping](https://www.prisma.io/docs/orm/v6/overview/databases/postgresql) and [PostgreSQL numeric types](https://www.postgresql.org/docs/15/datatype-numeric.html). This matches the approved integer-rial invariant more directly than a scale-bearing decimal. A business ceiling of `9_000_000_000_000_000_000` IRR is proposed so multiplication and aggregation can be rejected before the database limit. The exact lower commercial ceiling remains an approval gate.

There is no rounding policy in this foundation. Unit price times quantity and the sum of line subtotals are exact integer operations. Percentage discounts, taxes, allocations, proration, and fractional calculations are deferred together with their rounding rules.

### 3. Exact Prisma model proposal

This is a design specification, not schema code applied by this review.

```prisma
enum StoreStatus {
  ACTIVE
  INACTIVE
}

enum CommerceCurrency {
  IRR
}

enum ProductOfferStatus {
  DRAFT
  ACTIVE
  INACTIVE
  ARCHIVED
}

enum ProductOfferSalesMode {
  ONLINE
  PRICE_HIDDEN
  INQUIRY_ONLY
}

enum ProductOfferAvailability {
  AVAILABLE_TO_ORDER
  UNAVAILABLE
}

enum CartStatus {
  ACTIVE
  EXPIRED
}

enum CartMutationKind {
  ADD_LINE
  SET_LINE_QUANTITY
  REMOVE_LINE
  REFRESH_QUOTE
}

enum CommerceAuditActorType {
  SYSTEM
  GUEST
}

enum CommerceAuditEventType {
  STORE_CREATED
  OFFER_CREATED
  OFFER_ACTIVATED
  OFFER_DEACTIVATED
  CART_CREATED
  CART_LINE_ADDED
  CART_LINE_QUANTITY_SET
  CART_LINE_REMOVED
  CART_QUOTE_REFRESHED
  CART_EXPIRED
}

enum CommerceAuditSubjectType {
  STORE
  PRODUCT_OFFER
  CART
  CART_LINE
}

model Store {
  id                          String                 @id @default(uuid()) @db.Uuid
  key                         String                 @unique @db.VarChar(100)
  profileKey                  String                 @map("profile_key") @db.VarChar(100)
  displayName                 String                 @map("display_name") @db.VarChar(255)
  status                      StoreStatus            @default(INACTIVE)
  currency                    CommerceCurrency       @default(IRR)
  quoteTtlSeconds             Int                    @default(900) @map("quote_ttl_seconds")
  guestCartIdleTtlSeconds     Int                    @default(2592000) @map("guest_cart_idle_ttl_seconds")
  guestCartAbsoluteTtlSeconds Int                    @default(7776000) @map("guest_cart_absolute_ttl_seconds")
  maxCartLines                Int                    @default(50) @map("max_cart_lines")
  maxLineQuantity             Int                    @default(99) @map("max_line_quantity")
  version                     Int                    @default(1)
  createdAt                   DateTime               @default(now()) @map("created_at")
  updatedAt                   DateTime               @updatedAt @map("updated_at")
  offers                      ProductOffer[]
  carts                       Cart[]
  auditEvents                 CommerceAuditEvent[]

  @@index([status])
  @@map("stores")
}

model ProductOffer {
  id              String                   @id @default(uuid()) @db.Uuid
  storeId         String                   @map("store_id") @db.Uuid
  productId       String                   @map("product_id") @db.Uuid
  version         Int
  status          ProductOfferStatus       @default(DRAFT)
  salesMode       ProductOfferSalesMode    @map("sales_mode")
  availability    ProductOfferAvailability @default(UNAVAILABLE)
  priceAmountRial BigInt?                  @map("price_amount_rial") @db.BigInt
  currency        CommerceCurrency         @default(IRR)
  minQuantity     Int                      @default(1) @map("min_quantity")
  maxQuantity     Int                      @map("max_quantity")
  effectiveFrom   DateTime                 @map("effective_from")
  effectiveUntil  DateTime?                @map("effective_until")
  createdAt       DateTime                 @default(now()) @map("created_at")
  updatedAt       DateTime                 @updatedAt @map("updated_at")
  store           Store                    @relation(fields: [storeId], references: [id], onDelete: Restrict)
  product         Product                  @relation(fields: [productId], references: [id], onDelete: Restrict)
  cartLines       CartLine[]

  @@unique([id, storeId])
  @@unique([storeId, productId, version])
  @@index([storeId, productId, status])
  @@index([storeId, status, effectiveFrom, effectiveUntil])
  @@map("product_offers")
}

model Cart {
  id                String                   @id @default(uuid()) @db.Uuid
  storeId           String                   @map("store_id") @db.Uuid
  tokenHash         Bytes                    @unique @map("token_hash") @db.ByteA
  status            CartStatus               @default(ACTIVE)
  revision          Int                      @default(1)
  currency          CommerceCurrency         @default(IRR)
  subtotalAmountRial BigInt                  @default(0) @map("subtotal_amount_rial") @db.BigInt
  quoteFingerprint  Bytes?                   @map("quote_fingerprint") @db.ByteA
  quotedAt          DateTime?                @map("quoted_at")
  quoteExpiresAt    DateTime?                @map("quote_expires_at")
  lastActivityAt    DateTime                 @default(now()) @map("last_activity_at")
  expiresAt         DateTime                 @map("expires_at")
  absoluteExpiresAt DateTime                 @map("absolute_expires_at")
  createdAt         DateTime                 @default(now()) @map("created_at")
  updatedAt         DateTime                 @updatedAt @map("updated_at")
  store             Store                    @relation(fields: [storeId], references: [id], onDelete: Restrict)
  lines             CartLine[]
  mutations         CartMutationRecord[]

  @@unique([id, storeId])
  @@index([storeId, status, expiresAt])
  @@index([storeId, lastActivityAt])
  @@map("carts")
}

model CartLine {
  id                    String       @id @default(uuid()) @db.Uuid
  publicReference       String       @unique @map("public_reference") @db.VarChar(22)
  storeId               String       @map("store_id") @db.Uuid
  cartId                String       @map("cart_id") @db.Uuid
  productId             String       @map("product_id") @db.Uuid
  offerId               String       @map("offer_id") @db.Uuid
  offerVersion          Int          @map("offer_version")
  equivalenceKey        Bytes        @map("equivalence_key") @db.ByteA
  quantity              Int
  productSlugSnapshot   String       @map("product_slug_snapshot") @db.VarChar(255)
  productNameSnapshot   String       @map("product_name_snapshot") @db.VarChar(255)
  unitPriceAmountRial   BigInt       @map("unit_price_amount_rial") @db.BigInt
  lineSubtotalAmountRial BigInt      @map("line_subtotal_amount_rial") @db.BigInt
  quoteExpiresAt        DateTime     @map("quote_expires_at")
  createdAt             DateTime     @default(now()) @map("created_at")
  updatedAt             DateTime     @updatedAt @map("updated_at")
  cart                  Cart         @relation(fields: [cartId, storeId], references: [id, storeId], onDelete: Cascade)
  product               Product      @relation(fields: [productId], references: [id], onDelete: Restrict)
  offer                 ProductOffer @relation(fields: [offerId, storeId], references: [id, storeId], onDelete: Restrict)

  @@unique([cartId, equivalenceKey])
  @@index([storeId, cartId])
  @@index([storeId, offerId])
  @@index([productId])
  @@map("cart_lines")
}

model CartMutationRecord {
  id                String           @id @default(uuid()) @db.Uuid
  storeId           String           @map("store_id") @db.Uuid
  cartId            String           @map("cart_id") @db.Uuid
  kind              CartMutationKind
  keyHash           Bytes            @map("key_hash") @db.ByteA
  requestHash       Bytes            @map("request_hash") @db.ByteA
  resultingRevision Int              @map("resulting_revision")
  createdAt         DateTime         @default(now()) @map("created_at")
  expiresAt         DateTime         @map("expires_at")
  cart              Cart             @relation(fields: [cartId, storeId], references: [id, storeId], onDelete: Cascade)

  @@unique([storeId, keyHash])
  @@index([storeId, cartId, createdAt])
  @@index([expiresAt])
  @@map("cart_mutation_records")
}

model CommerceAuditEvent {
  id               String                      @id @default(uuid()) @db.Uuid
  storeId          String                      @map("store_id") @db.Uuid
  eventType        CommerceAuditEventType      @map("event_type")
  subjectType      CommerceAuditSubjectType    @map("subject_type")
  subjectReference String                      @map("subject_reference") @db.VarChar(64)
  actorType        CommerceAuditActorType      @map("actor_type")
  requestId        String?                     @map("request_id") @db.VarChar(100)
  cartRevision     Int?                        @map("cart_revision")
  occurredAt       DateTime                    @default(now()) @map("occurred_at")
  store            Store                       @relation(fields: [storeId], references: [id], onDelete: Restrict)

  @@index([storeId, occurredAt])
  @@index([storeId, subjectType, subjectReference, occurredAt])
  @@index([requestId])
  @@map("commerce_audit_events")
}
```

Required existing-model relation-only changes:

```prisma
model Product {
  // Existing fields and relations remain unchanged.
  offers    ProductOffer[]
  cartLines CartLine[]
}
```

These relation fields do not add columns to `products`. No existing Product field is repurposed, and no price or store identifier is added to the public product contract.

### 4. Required database constraints not expressible by the Prisma model alone

The migration SQL must add named checks and one partial unique index:

```sql
CHECK (quote_ttl_seconds BETWEEN 60 AND 86400)
CHECK (guest_cart_idle_ttl_seconds BETWEEN 3600 AND 7776000)
CHECK (guest_cart_absolute_ttl_seconds >= guest_cart_idle_ttl_seconds)
CHECK (max_cart_lines BETWEEN 1 AND 200)
CHECK (max_line_quantity BETWEEN 1 AND 1000)
CHECK (version >= 1)

CHECK (product_offers.version >= 1)
CHECK (min_quantity >= 1)
CHECK (max_quantity >= min_quantity)
CHECK (effective_until IS NULL OR effective_until > effective_from)
CHECK (price_amount_rial IS NULL OR price_amount_rial >= 0)
CHECK (
  (sales_mode = 'ONLINE' AND price_amount_rial IS NOT NULL AND price_amount_rial > 0)
  OR sales_mode IN ('PRICE_HIDDEN', 'INQUIRY_ONLY')
)

CHECK (carts.revision >= 1)
CHECK (carts.subtotal_amount_rial >= 0)
CHECK (carts.expires_at <= carts.absolute_expires_at)
CHECK (carts.quote_expires_at IS NULL OR carts.quoted_at IS NOT NULL)

CHECK (cart_lines.quantity >= 1)
CHECK (cart_lines.offer_version >= 1)
CHECK (cart_lines.unit_price_amount_rial > 0)
CHECK (cart_lines.line_subtotal_amount_rial > 0)
CHECK (octet_length(cart_lines.equivalence_key) = 32)
CHECK (octet_length(carts.token_hash) = 32)
CHECK (carts.quote_fingerprint IS NULL OR octet_length(carts.quote_fingerprint) = 32)
CHECK (octet_length(cart_mutation_records.key_hash) = 32)
CHECK (octet_length(cart_mutation_records.request_hash) = 32)

CREATE UNIQUE INDEX product_offers_one_active_per_store_product
ON product_offers (store_id, product_id)
WHERE status = 'ACTIVE';
```

Service validation must additionally enforce rules that a row-local database check cannot:

- Store must be active and its currency must match the Offer and Cart.
- Offer maximum quantity must not exceed Store maximum line quantity.
- `lineSubtotalAmountRial` must equal `unitPriceAmountRial * quantity` without overflow.
- Cart subtotal must equal the exact sum of its current lines.
- Quote expiry must be the earliest of Store quote TTL and Offer effective end.
- `offerVersion` must match the referenced Offer version when a line is quoted.
- All cart and offer reads include `storeId`; composite foreign keys prevent cross-store Cart/Offer attachment.

### 5. Offer meaning and predicates

`ProductOffer` is a store-specific commercial assertion, not part of Product editorial data.

- A new semantic price or availability version creates a new Offer row with the next per-store/per-product version.
- Only one row may have `ACTIVE` status per Store/Product. Activation deactivates the previous row and activates the target row in one transaction.
- An active row is effective only when `effectiveFrom <= now` and (`effectiveUntil` is null or `now < effectiveUntil`).
- `ONLINE` requires a strictly positive IRR price and is the only mode cartable in this foundation.
- `PRICE_HIDDEN` and `INQUIRY_ONLY` are never represented as zero-price or null-price online offers and cannot be added to a Cart.
- `AVAILABLE_TO_ORDER` means the merchant is willing to accept an order subject to the current offer and public-product predicates. It is not evidence of physical inventory.
- `UNAVAILABLE` disables cart addition and makes a quoted line fail conversion readiness.

Keep four predicates separate:

```text
publicProductEligible = exact WO-009 lifecycle/category predicate
                        AND ProductDataQualityService.evaluate(product.id).isReady

offerEffective        = correct store
                        AND ACTIVE
                        AND within effective interval
                        AND currency IRR

priceVisible          = publicProductEligible
                        AND offerEffective
                        AND salesMode ONLINE

purchasable           = priceVisible
                        AND availability AVAILABLE_TO_ORDER
                        AND quantity within offer/store limits
```

No catalog repository predicate is weakened or duplicated. A commerce service composes the existing lifecycle predicate and unchanged ProductDataQuality service with Offer checks. Any defensive mapping failure returns the same non-disclosing outcome as absence.

## Include, Defer, and Prohibit

### Include in the smallest implementation WO

- Persisted `Store` boundary and exact deployment-to-Store resolution.
- Shared Money contract, strict parser, IRR/Toman conversion helper, BigInt transport mapper, overflow checks, and tests.
- `ProductOffer` persistence, versioning, activation transaction, effective-window checks, public purchasing-option query, and tests.
- `AVAILABLE_TO_ORDER` / `UNAVAILABLE` only.
- Guest Cart, CartLine, mutation-idempotency record, quote snapshots, audit event, expiry, revision checks, and tests.
- A server-only Storefront commerce client and cookie utilities, without publishing cart UI.
- Additive migration and an idempotent Fardad Store bootstrap command.

### Defer

- Checkout, Order, OrderLine, OrderStatusHistory, Payment, PaymentAttempt, refunds, callbacks, provider accounts, commercial-invoice documents, numbering series, and PDFs.
- Tax/legal-invoice behavior, VAT, shipping charges, delivery methods, addresses, discounts, promotions, coupon rules, allocation, rounding, and totals beyond subtotal.
- Stock, inventory, reservation, backorder, preorder, warehouses, sourcing, and fulfillment.
- Gift-box/add-on pricing and Product Experience configuration pricing.
- Authenticated Cart ownership, guest-to-user merge, customer profiles, saved carts, cart sharing, and account UI.
- Installments, multi-gateway routing, wallet, corporate credit, loyalty, referral, chat, ticketing, reviews, analytics, and personalization.
- Admin or Storefront visual UI, add-to-cart controls, cart page, header count, and capability publication.
- Multi-currency and foreign-exchange conversion.
- Tenant grouping and Merchant/legal-entity ownership until their concrete requirements exist.

### Prohibit

- Client-supplied `storeId`, Store database ID, Offer ID/version, price, currency, subtotal, availability, owner ID, quote fingerprint, token hash, or audit fields.
- Adding commerce fields to `PublicProductCard` or `PublicProductDetail`.
- Treating `GiftBox.price` or `AddonService.price` as an authoritative Product price.
- Floating-point money, implicit rounding, negative money, a zero sentinel for hidden/inquiry price, or persisted Toman.
- An unscoped Store query or a CartLine relation that can cross Store boundaries.
- Logging or returning raw cart tokens, token hashes, internal IDs, request hashes, or defensive eligibility diagnostics.
- Inferring inventory from `AVAILABLE_TO_ORDER`.
- Publishing `catalog.shop` until an implementation and publishability review explicitly authorizes it.

## Cart Lifecycle, Trust, Quoting, and Conversion Readiness

### Guest token

- Generate 32 random bytes from a cryptographically secure operating-system source.
- Encode base64url without padding for the browser bearer token.
- Store only its 32-byte SHA-256 digest in `Cart.tokenHash`; high token entropy makes an offline digest search infeasible.
- Use the exact Storefront cookie name `__Host-fardad-cart` for the Fardad deployment.
- Cookie requirements: `Secure`, `HttpOnly`, `SameSite=Lax`, `Path=/`, no `Domain`, and maximum age no later than Cart idle/absolute expiry.
- Rotate the token after suspected fixation or ownership transition. Future authenticated merge must rotate it transactionally.
- The Storefront BFF/Server Action layer generates and owns the browser token. It passes the raw value only as a server-to-server credential; the API creates or resolves the Cart by its digest and never needs to return or recover the raw value. The BFF installs the same value as the cookie after success. The value is redacted from errors, traces, analytics, and logs.
- Cart creation is naturally idempotent on the unique token digest. If the browser response is lost before the cookie is installed, the committed Cart is unreachable and expires normally; the API never weakens one-way token storage to recover it. Ordinary Cart mutations use the explicit idempotency records below.

### Lifecycle

The initial persisted state machine is deliberately small:

```text
ACTIVE -- idle expiry or absolute expiry --> EXPIRED
```

- Idle expiry starts at 30 days and slides on successful Cart activity.
- Absolute expiry is fixed at 90 days from creation and never slides.
- `expiresAt = min(lastActivityAt + idle TTL, absoluteExpiresAt)`.
- Reads and mutations lazily mark an overdue Cart expired in a transaction. A bounded cleanup job may later purge expired Cart data under an approved retention policy.
- No `LOCKED`, `CHECKOUT`, `CONVERTED`, `MERGED`, or `ABANDONED` state is introduced before the Order/checkout boundary exists.

### Line equivalence

The client never supplies an equivalence key. The server hashes a versioned canonical identity. For the first phase:

```text
v1 | storeId | productId | offerId
```

Adding the same equivalence key increments the existing line, subject to quantity ceilings. Gift box, add-on, personalization, and other configuration components are absent; a later approved schema version may extend the canonical identity without changing historical keys.

### Quote persistence and validity

There is no separate Quote aggregate initially. A Cart is a persisted quote snapshot:

- CartLine stores Product display snapshots, Offer version, exact unit price, quantity, exact line subtotal, and line quote expiry.
- Cart stores exact subtotal, quote time, quote expiry, and a 32-byte fingerprint of canonical Store policy version plus sorted line Offer versions and quantities.
- The quote expiry is the earliest applicable Offer end or `quotedAt + Store.quoteTtlSeconds`.
- Every successful line mutation re-evaluates every line, recomputes exact totals and fingerprint, sets quote times, and increments the Cart revision once.
- Refresh quote performs the same re-evaluation without trusting old client values.
- Product name/slug snapshots are display evidence only; current eligibility still uses the Product and Offer sources of truth.

### Conversion readiness

No checkout conversion is implemented. The Cart service can compute, but does not persist, readiness for a later Order WO:

```text
READY = Cart ACTIVE
        AND not expired
        AND has at least one line
        AND quote is unexpired
        AND every Product remains publicly eligible
        AND every Offer remains effective, ONLINE, AVAILABLE_TO_ORDER, and version-matched
        AND every quantity remains valid
        AND all exact totals reconcile without overflow
```

Any failed term yields a safe `STALE`, `EMPTY`, or `UNAVAILABLE` public result. It does not reveal whether internal lifecycle, category, readiness, price, or audit state caused the failure. A future Order conversion must reprice and revalidate inside the Order transaction; a Cart quote is not an indefinite price guarantee.

### Concurrency and idempotency

- Every line or quote mutation carries `If-Match: "<revision>"` and `Idempotency-Key`. Cart create-or-resolve instead uses the unique server-generated token digest.
- Idempotency keys are 128–512 bits of caller randomness in canonical base64url form; the database stores SHA-256 only.
- The server hashes a canonical operation name, Cart identity, path reference, and normalized intent body as `requestHash`.
- Same Store/key and same request hash returns the original mutation’s `204 No Content` result. Same key with different request hash returns generic `409 IDEMPOTENCY_CONFLICT`.
- Idempotency lookup occurs before revision conflict evaluation so a retry of an already-successful request remains successful.
- The mutation transaction performs a compare-and-increment update against the expected Store, Cart, status, expiry, and revision. Zero updated rows returns `409 CART_REVISION_CONFLICT` or generic `404 Cart not found` after a non-disclosing ownership check.
- The transaction then modifies/combines the line, re-evaluates all offers, persists totals and quote, appends its audit event, writes the mutation record, and increments revision exactly once.
- Use PostgreSQL serializable transactions or an explicit locked-row implementation selected and proven against Prisma 6.19 in an integration test. Automatic retry is bounded and applies only to serialization failures; idempotency prevents duplicate intent.

## API and Storefront Boundary

### Store resolution

The first deployment uses validated server environment `COMMERCE_STORE_KEY=fardad`. API startup resolves exactly one active Store and caches only its stable internal ID/key association. Browser input cannot override it. A later multi-store deployment may replace this with a server-owned verified-host registry; it must not add body/query `storeId` selection.

### Separate public commerce contracts

Add contracts under a commerce-owned shared module. Do not modify the public catalog types.

```ts
type PublicMoney = Money;

type PublicPurchasingOption = Readonly<{
  productSlug: string;
  mode: "online" | "price-hidden" | "inquiry-only";
  availability: "available-to-order" | "unavailable";
  price: PublicMoney | null;
  quantity: Readonly<{ min: number; max: number }>;
}>;

type PublicCart = Readonly<{
  revision: number;
  status: "active" | "expired";
  expiresAt: string;
  quote: Readonly<{
    status: "fresh" | "stale";
    validUntil: string | null;
  }>;
  subtotal: PublicMoney;
  lines: readonly Readonly<{
    reference: string;
    product: Readonly<{ slug: string; name: string }>;
    quantity: number;
    unitPrice: PublicMoney;
    subtotal: PublicMoney;
    availability: "available" | "requires-refresh" | "unavailable";
  }>[];
}>;
```

Raw Prisma enums are mapped to explicit lowercase public values. No internal IDs, Store fields, Offer references/version, Product readiness, token/token hash, quote fingerprint, request hash, or audit details appear.

### API endpoints

| Method and path                                                | Intent                                                          | Success                                                       |
| -------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| `GET /api/v1/public/commerce/products/:slug/purchasing-option` | Resolve safe current store offer after exact public eligibility | `200 PublicPurchasingOption`; generic `404 Product not found` |
| `POST /api/v1/public/cart`                                     | Resolve or create by the trusted BFF-generated opaque token     | `204`; API returns no token body                              |
| `GET /api/v1/public/cart`                                      | Resolve token-bound current Cart                                | `200 PublicCart`; generic `404 Cart not found`                |
| `POST /api/v1/public/cart/lines`                               | Add `{ productSlug, quantity }`                                 | `204`                                                         |
| `PATCH /api/v1/public/cart/lines/:lineReference`               | Set `{ quantity }`                                              | `204`                                                         |
| `DELETE /api/v1/public/cart/lines/:lineReference`              | Remove line                                                     | `204`                                                         |
| `POST /api/v1/public/cart/quote/refresh`                       | Revalidate and reprice all lines                                | `204`                                                         |

Mutation inputs contain intent only. They do not contain a Store, owner, Offer, price, currency, or total. The line reference is 128 bits of random base64url data and has no database semantics.

### Error contract

| HTTP  | Public meaning                                                                         |
| ----- | -------------------------------------------------------------------------------------- |
| `400` | malformed header, token, slug, quantity, or body                                       |
| `404` | generic `Product not found` or `Cart not found`; includes wrong Store/owner/line       |
| `409` | `CART_REVISION_CONFLICT`, `IDEMPOTENCY_CONFLICT`, or `QUOTE_CHANGED`                   |
| `422` | `PRODUCT_UNAVAILABLE`, `QUANTITY_NOT_ALLOWED`, `CART_LIMIT_REACHED`, or `CART_EXPIRED` |
| `429` | rate limit exceeded                                                                    |
| `5xx` | generic request failure with correlation ID only                                       |

Public errors do not distinguish private, inactive, unpublished, future, invalid-category, not-ready, withdrawn Offer, or defensive mapping failure. They never echo amounts supplied by a client or expose internal diagnostics.

### Storefront boundary

- Extend the existing `server-only` HTTP-client pattern with `getPublicPurchasingOption`, `getCart`, `createGuestCart`, `addCartLine`, `setCartLineQuantity`, `removeCartLine`, and `refreshCartQuote`.
- The browser does not receive the API origin and does not call Nest directly.
- Server Actions or an equivalent same-origin BFF read/write `__Host-fardad-cart`, validate Origin/Referer on every cookie-authenticated mutation, generate idempotency keys, forward revision, and translate typed errors.
- Current server-rendered Product routes and ProductCard remain unchanged in the foundation WO. No button, Cart page, count, or Client Component fetch is added.
- All Cart responses set `Cache-Control: private, no-store`; no CDN, ISR, or shared Next cache may store them. Informational catalog caching remains independent.
- A later UI WO must receive a separate accessibility, RTL, focus, no-JavaScript degradation, and publishability review before `catalog.shop` becomes implemented.

## Security, Race, and Failure Analysis

### Security controls

- Scope every repository method by the server-resolved `storeId`; make unscoped methods private or impossible by signature.
- Enforce composite Store foreign keys for Cart-to-Line-to-Offer joins.
- Keep Store keys non-secret but server-derived; database IDs remain internal.
- Treat the guest token as a bearer credential. Use OS CSPRNG, digest at rest, constant-time digest comparison where performed in application code, Secure/HttpOnly host-only cookie, bounded TTL, rotation, and full redaction.
- Require Origin/Referer validation plus `SameSite=Lax` for mutation CSRF defense. If a non-form cross-site flow is later approved, add a synchronizer/double-submit token rather than weakening origin checks.
- Rate-limit creation by Store plus IP/device risk signal and mutations by Store plus token digest plus IP. Use separate tighter limits for quote refresh.
- Reject oversized bodies, excessive line counts, excessive quantities, malformed decimal strings, and BigInt overflow before transaction work.
- Never cache or log Cart responses/tokens. Audit events contain an allowlisted event type and references only; they have no arbitrary JSON payload.
- Do not accept arbitrary callback URLs, media URLs, provider names, price selectors, or client-selected variants.

### Race conditions and required behavior

| Race/failure                           | Required outcome                                                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Two adds at same revision              | one commits; one gets `409`, unless it is an idempotent replay                                                     |
| Same idempotency key concurrently      | unique constraint elects one result; loser reads and validates the stored request digest                           |
| Offer changes during mutation          | transaction sees a consistent Offer version; mismatch aborts or produces freshly quoted state, never a mixed total |
| Offer expires after read               | later mutation/refresh marks line unavailable; eventual Order conversion rechecks again                            |
| Product becomes non-public             | generic unavailable result; no lifecycle/readiness reason leaks                                                    |
| Cart idle/absolute expiry during write | guarded update fails; Cart becomes or is treated as expired                                                        |
| Quantity aggregation exceeds limit     | reject whole transaction with `422`; no partial line update                                                        |
| Amount multiplication/sum overflows    | reject whole transaction and emit an operational alert; never clamp/wrap                                           |
| Audit insert fails                     | commerce transaction fails; state and audit do not diverge                                                         |
| Store is missing/inactive              | commerce startup/request fails closed; catalog can remain independent                                              |
| Database unavailable                   | generic request failure; no local/unsigned Cart fallback                                                           |
| Duplicate active Offer                 | partial unique index rejects activation; transaction preserves prior active Offer                                  |

### Operational implications

- Alert on repeated revision conflicts, idempotency conflicts, rate limits, overflow defenses, missing Store bindings, audit failures, and quote refresh failures.
- Metrics and traces use Store key, event type, result class, latency, and correlation ID only. Do not tag raw token, token digest, product/customer PII, or money intent bodies.
- Expired Cart and mutation-record retention requires an approved policy and bounded cleanup command. Deletion must remain store-scoped and auditable; it is not part of this review.
- Offer activation is an operator/internal service operation initially. No Admin UI or public write endpoint is authorized.

## Exact Migration and Implementation Plan

### Proposed migration

One additive migration, proposed name:

```text
20260720_add_store_offer_guest_cart_foundation
```

It must perform, in order:

1. Create the ten enums listed in the proposed Prisma schema.
2. Create `stores` with its primary key, unique key, status index, policy checks, and timestamps.
3. Create `product_offers` with Store/Product restrictive foreign keys, version unique constraint, query indexes, row checks, and partial unique active-Offer index.
4. Create `carts` with Store restrictive foreign key, unique token digest, Store composite uniqueness, expiry/query indexes, and consistency checks.
5. Create `cart_lines` with composite Cart/Store and Offer/Store foreign keys, Product restrictive foreign key, random public-reference uniqueness, equivalence uniqueness, indexes, and exact-money checks.
6. Create `cart_mutation_records` with composite Cart/Store foreign key, Store/key uniqueness, retention indexes, and fixed digest checks.
7. Create `commerce_audit_events` with Store restrictive foreign key and subject/time/request indexes.
8. Add no Product column. Prisma adds only the `Product.offers` and `Product.cartLines` relation fields in generated schema metadata.

### Backfill and deployment

- Existing Product, Product Experience, media, auth, and RBAC rows require no backfill.
- Do not derive Offers from `GiftBox.price`, `AddonService.price`, Product level, label, configuration, or any other current field.
- Migration creates empty tables only and can deploy while current catalog/API code continues to run.
- Deploy domain/services dark: no commerce capability becomes implemented and no UI becomes visible.
- Run an explicit, idempotent, operator-approved bootstrap command for Store key `fardad` and profile `fardad-production`.
- Create and validate ProductOffer records through a controlled internal/operator path; no generic seed and no public write endpoint.
- Validate on a disposable PostgreSQL instance before production. A live database was not inspected by this review.
- Enable the API purchasing option/cart foundation only after Store binding, rate limiting, cookie/BFF security, integration tests, and observability pass.
- Keep Storefront commerce UI unpublished. Its later activation is a separate work order.

### No-downtime and rollback posture

- The migration is additive and does not lock/rewrite existing Product rows for a data backfill.
- Create normal indexes with the empty new tables. The partial unique index is also on an empty new table.
- A failed application deploy is rolled back by disabling/unrouting commerce services, not by dropping tables.
- Existing informational catalog behavior remains available if commerce is disabled.
- Schema rollback by destructive table drop is not a routine production rollback and requires a separately approved data-retention procedure.

### Proposed implementation sequence

1. Add framework-independent Money and commerce transport contracts plus exhaustive unit tests.
2. Add Store/Offer/Cart Prisma schema and hand-reviewed SQL migration with named constraints.
3. Generate Prisma client only; validate migration on disposable PostgreSQL.
4. Add server-derived Store context and fail-closed environment validation.
5. Add Money parser/converter/mapper and overflow-safe arithmetic.
6. Add Store and Offer repositories/services, exact public eligibility composition, activation transaction, and audit events.
7. Add guest Cart token/cookie boundary, Cart repository/service, quote engine, idempotency, revision transaction, expiry, and audit events.
8. Add the separate public commerce controller and DTO mapping with generic errors and rate limits.
9. Add the Storefront server-only commerce client and cookie/Server Action infrastructure without visual UI.
10. Run the full validation matrix and write an implementation report. Do not enable `catalog.shop`, commit, or push without explicit authorization.

## Validation Evidence and Required Future Tests

### Review-time validation

| Command/check                                                 | Result                                                                              |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `git branch --show-current`                                   | PASS: `architecture-refactor`                                                       |
| `git log -1 --oneline --decorate`                             | PASS: `aae9ef2 ... Normalize commerce review formatting`                            |
| `git status --short -uall` before review                      | PASS: empty                                                                         |
| `git ls-files` for three WO-012 route files and WO-013 report | PASS: all tracked                                                                   |
| Prisma schema inspection                                      | PASS: canonical PostgreSQL schema; no current Store/Offer/Cart/Order/Payment models |
| Public contract scan                                          | PASS: current Product Card/Detail have no commerce fields                           |
| Storefront profile/capability scan                            | PASS: one app-owned profile; only `catalog.products` implemented                    |
| Local Prettier check of this report                           | PASS: all matched files use Prettier code style                                     |
| `git diff --check`                                            | PASS: no tracked-file whitespace errors                                             |
| Untracked-report whitespace check                             | PASS after replacing Markdown hard-break whitespace                                 |
| Final `git status --short -uall`                              | only the new WO-014 report is untracked                                             |
| Database/migration execution                                  | NOT RUN: prohibited by scope                                                        |
| Source typecheck/lint/build                                   | NOT RUN: review-only; no source changed                                             |

The package-manager-mediated Prettier invocation could not verify the pinned pnpm executable because its registry signature fetch failed. The already-installed repository-local Prettier binary was used directly and passed; no dependency or lockfile operation was attempted.

### Mandatory tests for the implementation WO

#### Money

- Accept `0`, positive canonical IRR strings, and boundary values.
- Reject signs, leading zeros, whitespace, separators, decimals, exponent notation, localized digits, negatives, and over-limit values.
- Prove exact Toman-to-IRR multiplication by ten and reject overflow.
- Prove BigInt-to-Money serialization never uses JSON BigInt or JavaScript number.
- Property-test quantity multiplication and aggregation against database/business limits.

#### Store and Offer

- Resolve only the configured active Store; missing/inactive/mismatched profile fails closed.
- Prove all Offer repositories require Store context.
- Prove database rejection of duplicate active Offer and duplicate version.
- Cover start/end boundary instants, UTC behavior, all statuses, all sales modes, both availability values, and invalid quantity limits.
- Reuse the exact WO-009 lifecycle/category predicate and unchanged `ProductDataQualityService.evaluate(product.id)`.
- Run the absent/private/inactive/unpublished/future/invalid-category/non-ready/defensively-unmappable matrix and prove generic not-found/unavailable behavior.
- Prove hidden/inquiry modes never expose a zero-price online offer and cannot enter Cart.

#### Cart and concurrency

- Verify 256-bit token generation, fixed 32-byte digest persistence, cookie flags, rotation, and log/error redaction.
- Prove wrong token, wrong Store, random line reference, and expired ownership return generic Cart not found/expired behavior.
- Prove composite foreign keys reject attaching a CartLine to an Offer from another Store.
- Cover create, empty read, add, equivalent-line combine, set quantity, remove, refresh quote, idle expiry, absolute expiry, and lazy expiry.
- Prove exact line/Cart totals and quote fingerprint/expiry invariants.
- Prove stale Offer version, price change, withdrawal, publication loss, and Product readiness loss produce safe refresh/unavailable behavior.
- Race two different mutations at one revision and prove exactly one commit.
- Race identical idempotent mutations and prove one logical effect.
- Replay same key/same request and same key/different request.
- Force a serialization failure, bounded retry, audit failure, and amount overflow; prove atomic rollback.
- Prove mutation records and audit events are Store-scoped and contain no raw bearer credential.

#### HTTP and Storefront

- Validate DTO allowlists and structural scans for IDs, raw enums, price inputs, Store fields, token/hash, Offer fields, readiness, audit, stock, and internal diagnostics.
- Verify `If-Match`, idempotency key, Origin/Referer validation, content type, body size, rate limiting, and `private, no-store` headers.
- Verify the browser never receives or imports the API origin and no Client Component performs the API fetch.
- Verify the raw token is installed only as the approved cookie and inaccessible to browser JavaScript.
- Verify public Product Card/Detail type snapshots remain byte-for-byte unchanged in commerce field shape.
- Run API/Storefront/unit/integration typecheck, lint, build, formatter check, migration validation on disposable PostgreSQL, and `git diff --check`.

## Approval Gates

Before an implementation WO is authorized, approve or revise these exact proposals:

1. Use one `Store` model now; defer Tenant and Merchant.
2. Map `fardad-production` to persisted Store key `fardad` through server-only deployment configuration.
3. Use Prisma `BigInt @db.BigInt`, decimal-string Money transport, IRR-only currency enum, and no rounding.
4. Approve the business maximum money amount; the technical proposal is `9_000_000_000_000_000_000` IRR or a lower commercial ceiling.
5. Approve Store policy defaults: 15-minute quote TTL, 30-day idle Cart TTL, 90-day absolute Cart TTL, 50 lines, and 99 units per line.
6. Approve immutable Offer versions, one partial-unique active Offer per Store/Product, and transactionally deactivating the predecessor.
7. Approve `ONLINE` price strictly greater than zero; `PRICE_HIDDEN` and `INQUIRY_ONLY` are not cartable.
8. Approve `__Host-fardad-cart`, 256-bit token, SHA-256 digest, `Secure`/`HttpOnly`/`SameSite=Lax`/host-only cookie policy.
9. Approve revision through `If-Match`, mandatory mutation idempotency, `204` mutation responses, and the proposed error codes.
10. Approve the public purchasing-option endpoint as a separate commerce contract while Product Card/Detail remain unchanged.
11. Approve the six new models, ten enums, Product relation-only additions, checks, indexes, and composite Store foreign keys.
12. Approve the idempotent operator bootstrap mechanism; do not put Fardad data in the generic migration or seed.
13. Approve append-only `CommerceAuditEvent` without arbitrary JSON payload.
14. Approve that no commerce UI or `catalog.shop` publication is part of the foundation implementation.

## Final Status

**Review status:** `COMPLETED — READY FOR APPROVAL, NOT AUTHORIZED FOR IMPLEMENTATION BY THIS REPORT.`

The proposed next work order is limited to Store, Money, ProductOffer, available-to-order semantics, guest Cart, server-only commerce transport, security controls, and their migration/tests. Checkout, Order, Payment, commercial invoice, inventory, extension pricing, and visual Storefront commerce remain explicitly outside it.

Only this report was created. No application source, Prisma schema, migration, seed, test, dependency, lockfile, configuration, or existing report was modified. No database was connected to or changed. No commit or push was performed.
