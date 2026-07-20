# WO-013 Pre-Implementation Cart, Order, Pricing, Payment Boundary, and Invoice Architecture Review

> Project: Fardad Enterprise Commerce Platform
> Phase: Documentation and architecture review only
> Date: 2026-07-20
> Status: REVIEW COMPLETE — COMMERCE IMPLEMENTATION BLOCKED PENDING APPROVALS

## Executive Summary and Readiness Status

The repository is **ready for a controlled commerce architecture decision, but not ready for Cart, Order, Pricing, Payment, Invoice, or customer-panel implementation**.

The current platform provides a strong informational-product foundation: API-owned Prisma access, Product lifecycle and publication state, derived Product data quality, safe public catalog/detail contracts, fail-closed Media resolution, server-only Storefront HTTP access, Fardad-owned brand/content profiles, reusable semantic UI, JWT authentication, and default-deny RBAC foundations. WO-006 also provides isolated Product Experience availability records, configuration validation, and logistics measurements.

Those foundations do not establish purchasability. Product has no authoritative sell price, inventory/availability/reservation state, tax class, or order-line snapshot policy. There is no Cart, Checkout, Customer, Address, Order, Payment, Refund, Return, Shipment, Invoice, audit-event, idempotency, tenant, reconciliation, or customer-access aggregate. The two existing `GiftBox.price` and `AddonService.price` columns are explicitly non-authoritative base-price data and cannot be treated as a pricing engine.

The smallest safe decision is therefore:

1. preserve `PublicProductCard` and `PublicProductDetail` unchanged;
2. establish one API-owned canonical Money/Pricing boundary before exposing any commerce UI;
3. keep Cart, Order, Payment, Fulfilment, and Document state separate;
4. treat all client amounts, totals, ownership identifiers, state transitions, and provider results as untrusted;
5. make payment providers adapters behind central orchestration, with one ordinary gateway chosen only in a later approved work order;
6. make customer receipts and branded commercial invoices immutable documents derived from order/payment snapshots, without claiming tax-invoice compliance; and
7. resolve the blocking human decisions in this report before proposing a Prisma schema.

No source code, schema, migration, seed, dependency, lockfile, configuration, test, existing report, route, UI, payment integration, invoice PDF, commit, or push was created or changed.

## Exact Repository and Branch State

Initial inspection established:

- Repository: `D:\fardad\fardad`
- Active branch: `architecture-refactor`
- `HEAD`: `380c898` — `Add public product detail storefront`
- Remote decoration: `origin/architecture-refactor` points to the same commit.
- Tracked diff at baseline: clean (`git diff --quiet` passed).
- Worktree: not clean because three pre-existing WO-012 route files are untracked.

Initial `git status --short -uall`:

```text
?? apps/storefront/app/(public)/products/[slug]/error.tsx
?? apps/storefront/app/(public)/products/[slug]/loading.tsx
?? apps/storefront/app/(public)/products/[slug]/page.tsx
```

The three paths were not present in commit `380c898`, although the commit contains the WO-012 API, contracts, components, metadata helper, and reports. A clean checkout of `380c898` therefore does not contain the App Router product-detail segment. This is a repository-completeness issue to resolve before building commerce on top of the product page; this review did not alter or stage those files.

Baseline SHA-256 evidence for the preserved files:

```text
error.tsx   A894547C50FEB17625DAD4F48EB912D00A12690B994CFD02C57F4EF930EBD9D9
loading.tsx FC08563AFC14FCB5756EF111972B935AC882F5C3842D5E65D00B8CD2B385FAAE
page.tsx    3978A09FB506ECAA0B9253277EA0F048A86A73839DB9F4283938B37126DC08BA
```

### Work-order identity collision

`docs/codex/work-orders/WO-013_SHIPPING_SYSTEM.md` already claims the identifier WO-013 for an older implementation brief. This requested review is a different WO-013. The required report is created at its exact approved path without modifying the legacy document. Before future implementation work orders are numbered, a human must decide which naming/identity series is authoritative.

The older shopping-cart, checkout, order, payment, shipping, customer, and invoice work-order documents were reviewed as historical intent only. They predate the implemented WO-005–WO-012 boundaries, contain overlapping identifiers, and are not sufficient authorization to create current schema or code.

## Validation and Repository Inspection Evidence

The review inspected:

- WO-005 Product domain and Product data-quality implementation report;
- WO-006 Product Experience implementation report;
- WO-008 configuration/Storefront architecture review and implementation report;
- WO-009 public catalog architecture review and implementation report;
- WO-010 Media architecture, implementation, and route-validation reports;
- WO-011 brand adaptation architecture and implementation reports;
- WO-012 product-detail architecture and implementation reports;
- the canonical Prisma schema and migration inventory;
- active API modules, controllers, services, repositories, auth/RBAC boundaries, and environment ownership;
- shared catalog, configuration, Storefront, brand, content, experience, and capability contracts;
- Storefront server-only API and profile composition boundaries;
- Admin application separation; and
- historical commerce work-order documents for conflict/gap analysis.

Key static findings:

| Inspection                                          | Result                                                                                  |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Canonical Prisma owner                              | `apps/api/prisma/schema.prisma` only                                                    |
| Current Prisma models                               | Auth/RBAC, Product, Product Experience, Media, and checklist models only                |
| Cart/Order/Payment/Invoice/Shipment/Customer models | None                                                                                    |
| Tenant/store key on persisted aggregates            | None                                                                                    |
| Audit-event or idempotency persistence              | None                                                                                    |
| API modules                                         | Auth, Authorization, Media, Product, Product Experience, Public Catalog, infrastructure |
| Public business routes                              | Auth, public Media delivery, and read-only public Catalog only                          |
| Commerce HTTP endpoints                             | None                                                                                    |
| Public price/stock/cart fields                      | None                                                                                    |
| Current capability published                        | `catalog.products` only                                                                 |
| Current Fardad currency in resolved brand profile   | Omitted/unapproved                                                                      |
| Existing generic price formatter                    | Locale-only numeric formatter; not a Money or currency policy                           |
| Database/runtime mutation during review             | None                                                                                    |

No build, typecheck, lint, migration, database, or runtime command was necessary for this documentation-only review. The evidence is repository inspection, report reconciliation, status/hash checks, report formatting, and final diff/status checks.

## Current Capability Inventory

### Product and Product readiness

Current Product provides customer-facing content candidates (`name`, optional English name, slug, short/full descriptions, category, SEO metadata), lifecycle/publication fields, category/attributes/labels, and contextual media associations. Product has no price, cost, currency, inventory, reservation, tax class, sellability window, purchase limit, or sales-channel offer.

`ProductDataQualityService.evaluate(product.id)` is the existing publication-completeness authority. It checks critical content, active category, required attributes, main media, and logistics completeness. It does not calculate price, inventory, legal sale eligibility, customer eligibility, tax, delivery availability, or payment availability.

Decision: **publication readiness and commerce readiness remain separate predicates**. A product can be publicly informative but not purchasable. Commerce must never weaken or rewrite the WO-009 lifecycle/readiness rule.

### Product Media

ProductMedia and the API-owned Media registry provide contextual image association, strict internal references, fixed public rendition purposes, and fail-closed `{ src, alt }` resolution. They are suitable for future order-line display snapshots only as sources at order creation time. Raw Media identifiers, references, versions, storage keys, or provider data must not enter public Cart/Order contracts.

### Product Experience

WO-006 provides:

- active gift-box and add-on definitions;
- product-to-option availability relations;
- `ProductConfiguration` with optional gift box, add-ons, personalization JSON, status, and expiry;
- availability-only `validateConfiguration` behavior; and
- product/package logistics measurements.

It does not price a configuration, prove customer ownership, reserve it, persist a Cart decision, or make it order-safe. `GiftBox.price` and `AddonService.price` are base-price inputs only. `ProductBundleRule` stores generic JSON conditions/actions but has no approved evaluation semantics. Future commerce may consume these domains through explicit service contracts after validation, but must not treat their current fields as a finished quote, discount, or order snapshot.

### Public API and shared contracts

The public Catalog applies the exact product lifecycle/category predicate and derived data-quality gate, then returns explicit safe projections. Current shared public product contracts intentionally contain no price, stock, cart action, IDs, raw enums, configuration data, or diagnostics.

Decision: **do not expand `PublicProductCard` or `PublicProductDetail` during commerce foundation work**. A later pricing availability response or purchase quote should be a separate commerce contract. This avoids making an informational product representation carry volatile, customer-specific, or channel-specific sale data.

### Storefront and Admin

The Storefront is RTL-first, server-rendered, profile-owned, and communicates with the API through server-only HTTP clients and framework-independent shared contracts. Admin is a separate shell with no commerce management surface. Neither application may calculate authoritative price, create trusted totals, select internal ownership IDs, or determine payment success.

### Authentication and authorization

The API has email/password registration, login, refresh/logout, JWT identity, and default-deny RBAC foundations. The `User` record contains email and security/session relations only. There is no customer profile, address book, guest ownership, tenant membership, order ownership policy, or customer-versus-administrator authorization model.

RBAC is appropriate for staff operations. Customer access also requires resource-ownership checks; possessing a role or knowing an order number is insufficient.

### Configuration, editions, and brand adaptation

Shared capability contracts separate edition entitlement from enabled and implemented/publishable availability. The Fardad Base profile currently publishes only `catalog.products`; `catalog.shop` and `account.foundation` are entitled/enabled but not implemented.

Brand, content, experience, theme, and feature profiles are composition inputs, not persisted tenant commerce identity. The current one-entry production profile and missing tenant/store persistence are not enough to isolate future multi-brand orders, provider credentials, numbering sequences, or invoices.

## Exact Missing Capabilities Before Add-to-Cart and Order Placement

At minimum, the following must exist before an add-to-cart control can be truthful and safe:

1. **Store/tenant commerce context** — server-derived store identity on every aggregate, price list, provider configuration, number sequence, and audit record.
2. **Authoritative product offer/sell price** — API-owned, currency-specific, effective-dated, status-controlled, and independent of public Product content.
3. **Purchasability policy** — publication readiness plus price availability, channel/store eligibility, purchase limits, and current product/configuration availability.
4. **Inventory or availability authority** — even if initially a simple in-stock/available-to-order policy, with an explicit reservation/oversell decision before submitted orders.
5. **Money and rounding policy** — canonical IRR storage/calculation, explicit Toman input/display conversion, deterministic allocation, and overflow-safe arithmetic.
6. **Pricing orchestration** — base sell price, option adjustments, discounts, tax, shipping, and totals calculated server-side with versioned quote evidence.
7. **Cart ownership/lifecycle** — guest token, authenticated ownership, merge behavior, expiry, quantity validation, stale quote handling, and abuse controls.
8. **Customer/guest checkout identity** — minimal buyer/recipient information, verified access method, address rules, retention, and consent/legal review.
9. **Shipping quote/selection policy** — delivery eligibility and server-calculated cost before final order total.
10. **Order aggregate and immutable snapshots** — line description, pricing/tax/discount, buyer/recipient, configuration, and policy-version snapshots.
11. **Idempotency and audit persistence** — order submission, payment creation, provider event ingestion, state transitions, refunds, and documents.
12. **Payment orchestration** — provider-neutral attempts, verification, callbacks/webhooks, reconciliation, and refund boundary.
13. **Document boundary** — order confirmation, payment receipt, branded commercial invoice, numbering, access, and correction policy.
14. **Operational ownership** — monitoring, reconciliation, stuck-state handling, support escalation, and data-retention policies.

Until these foundations are approved and implemented, the existing product detail must remain informational and no public product contract should imply a purchasable offer.

## Proposed Domain Boundaries

```text
Product/Public Catalog
  owns: descriptive content, lifecycle/publication, public discovery
  does not own: sell price, stock, cart, order, payment, invoice

Pricing
  owns: canonical Money rules, price lists/offers, adjustments, quote calculation
  consumes: Product/configuration references and approved sales policies

Availability/Inventory
  owns: available-to-sell decision, purchase limits, reservation/commit/release

Cart
  owns: guest/customer cart lifecycle, line intent, quote reference, merge/expiry
  never owns: final authoritative order totals or payment truth

Checkout
  orchestrates: cart revalidation, customer/recipient, address, shipping quote,
  tax/discount recalculation, and order submission

Order
  owns: immutable purchase snapshot, commercial state, order numbering,
  customer ownership, and references to payments/fulfilments/documents

Payment Orchestration
  owns: method eligibility, attempts, provider adapters, verification,
  normalized events, reconciliation, refunds, and payment audit

Fulfilment/Shipping
  owns: shipment lifecycle, delivery method, tracking, return movement

Documents
  owns: order confirmation, payment receipt, branded invoice,
  document numbering/version/hash, rendering, and authorized delivery
```

The Order domain coordinates verified outcomes but must not embed provider-specific payment logic, carrier-specific shipping logic, or mutable product/catalog objects.

## Pricing and Monetary Model Decision

### Canonical Money representation

Recommend a provider-independent value contract conceptually equivalent to:

```text
Money = {
  amount: canonical integer encoded as a decimal string,
  currency: "IRR"
}
```

Rules:

- The canonical accounting unit is the Iranian Rial (`IRR`), subject to explicit business/finance approval before implementation. Unicode CLDR identifies Iran's tender currency as IRR, and ISO 4217 defines standardized alphabetic currency codes and their unit relationships. See [Unicode CLDR territory/currency data](https://unicode.org/cldr/charts/43/supplemental/detailed_territory_currency_information.html) and [ISO 4217](https://www.iso.org/standard/64758.html).
- Amounts are non-floating-point integers in canonical rials. Database design should use an overflow-safe integer or zero-scale decimal chosen during schema review; transport uses a decimal string to avoid JavaScript precision loss.
- A transaction/order has one currency. No implicit currency conversion is allowed.
- `TOMAN`, `IRT`, or a localized Toman label must not be used as an invented persistence or provider currency code.
- Toman is a presentation/input unit only. Every field and control must state its unit. A Toman input is converted server-side under one approved conversion rule; no endpoint infers the unit from locale, digit count, or provider name.
- If a rial amount cannot be represented exactly under the approved whole-Toman display rule, the UI must display rials or an explicitly approved fractional-Toman representation; it must never silently round a payable amount.
- Localized display formatting belongs in Storefront/application presentation using locale data and bidi-safe formatting. The existing `formatPrice(number, locale)` is not safe for authoritative Money because it accepts a JavaScript number and has no currency/unit semantics.

### Authoritative ownership

| Concern                             | Owning boundary                                              | Required behavior                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Product sell price                  | Pricing                                                      | Versioned/effective-dated store/channel offer; not a Product content field                                          |
| Gift/add-on price contribution      | Pricing, consuming Product Experience inputs                 | Validate option availability, then map approved adjustments; do not trust current base-price fields as final totals |
| Discount eligibility and amount     | Pricing/Promotion policy                                     | Server-side, deterministic, versioned, auditable; no client coupon result is trusted                                |
| Tax classification/rate/calculation | Tax policy behind Pricing/Checkout                           | Legal/finance-approved rules and effective dates; server-side only                                                  |
| Shipping amount                     | Shipping quote/calculator                                    | Based on approved address/method/logistics and returned to Pricing/Checkout                                         |
| Cart estimated total                | Pricing quote                                                | Recalculable and expiring; not final purchase evidence                                                              |
| Order total                         | Order creation transaction using current authoritative quote | Persisted immutable components and invariants                                                                       |
| Captured/refunded amount            | Payment                                                      | Derived from verified provider/manual events and constrained by order financial totals                              |

### Calculation and rounding rules

The future pricing engine must declare, test, and version these rules before money is exposed:

1. use arbitrary-precision/integer arithmetic only;
2. reject negative prices except explicit signed adjustment/credit types;
3. represent percentage rates as an exact rational or approved integer scale, never binary floating point;
4. delay rounding until an explicitly named component boundary;
5. round to the canonical payable rial using one approved rule (recommended default for review: half-up, but tax/legal rules take precedence);
6. allocate order-level discount/tax remainders deterministically across lines, using a documented largest-remainder/tie-break method;
7. enforce `line gross - line discount + line tax = line payable` and the corresponding order-sum invariants;
8. persist every allocated component so invoices/refunds do not recompute from current catalog data;
9. cap/validate arithmetic and quantities before multiplication; and
10. version the calculator/policy inputs on each quote and order.

### Immutable order-line snapshot

Each submitted order line later needs an immutable snapshot containing at least:

- internal product/configuration references for traceability, never used alone for public access;
- public slug or safe display reference;
- product display name and approved short line description at purchase time;
- selected configuration/gift/add-on display descriptions, with safe structured values;
- quantity and canonical currency;
- list/base unit amount, unit discount allocation, unit net amount, tax allocation, and payable line total;
- discount/tax rule identifiers and versions as internal audit references, not raw public diagnostics;
- pricing quote/version and calculation-policy version;
- any fulfilment-relevant product/configuration snapshot needed after catalog changes; and
- created/submitted timestamps.

The snapshot is copied into the Order transaction. It is not a mutable relation view, and it is not replaced when Product name, price, tax, media, configuration, or publication state later changes.

### Price visibility versus publication readiness

Define separate decisions:

```text
publiclyVisible = existing WO-009 lifecycle/category predicate
                  AND ProductDataQualityService.isPublicationReady

purchasable = publiclyVisible
              AND active store/channel offer exists
              AND configuration is valid
              AND availability/purchase-limit policy passes
              AND a current server quote can be produced
```

Price visibility is a third policy: a product may be publicly visible but price-hidden/inquiry-only, or have a valid price but be temporarily unavailable. No state should be inferred by exposing a zero price.

## Cart Model and Lifecycle Decision

### Cart types and ownership

| Journey                     | Ownership                                                                                                  | Recommended behavior                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Guest cart                  | High-entropy opaque token in a Secure, HttpOnly, SameSite cookie; only a hash stored server-side           | Shorter retention, rate limited, no exposed owner/internal UUID                                                  |
| Authenticated customer cart | Server-derived customer/account ownership                                                                  | Persistent within approved retention; never selected by client-supplied customer ID                              |
| Login/registration merge    | Transactional server operation from the verified guest token into the authenticated customer's active cart | Revalidate every line, merge exact equivalent line keys, cap quantities, return explicit conflicts/price changes |

Do not use browser session IDs, email addresses, sequential IDs, product IDs, or client-selected user IDs as authorization secrets.

### Cart and line identity

- Cart has an internal non-public identifier and a separately generated opaque access token for guest ownership.
- Cart line has an opaque public operation key unrelated to Product or persistence IDs.
- Equivalent-line identity should be a server-generated fingerprint over canonical product/configuration/options, not client JSON ordering.
- A cart carries server-derived `storeId`, currency, lifecycle status, last activity, expiry, revision/version, and quote metadata.
- A line stores purchase intent (`product/configuration`, quantity) and a display/quote snapshot for UX. The snapshot remains non-authoritative until order submission.

### Lifecycle

```text
ACTIVE
  -> CHECKOUT_LOCKED        temporary optimistic/transactional submission lock
  -> CONVERTED              successful Order creation
  -> ABANDONED              policy/analytics classification only
  -> EXPIRED                retention/idle timeout

CHECKOUT_LOCKED
  -> ACTIVE                 validation/checkout failure or lock timeout
  -> CONVERTED              exactly one successful Order
```

Merge creates or updates one authenticated ACTIVE cart and marks the guest cart MERGED/CONVERTED-to-cart so the token cannot be replayed.

### Quantity, expiry, price, and availability rules

- Quantity is a positive bounded integer. Minimum, maximum, per-product, per-order, and future corporate limits are server policy.
- Add/update operations re-check public lifecycle, Product readiness, current configuration availability, purchase limits, and current offer.
- Cart reads may lazily refresh expired quotes; checkout must always perform a full authoritative revalidation.
- Each quote has `calculatedAt`, `validUntil`, and policy/version evidence.
- If a reprice increases payable total or changes/remove lines, require explicit customer review/acknowledgement before order submission. The policy for decreases also needs approval, but totals must still be disclosed.
- Inventory availability must be checked on cart mutation and again atomically/reservationally at submission. Cart presence alone never reserves inventory unless an explicit reservation policy says so.
- Expired/merged/converted cart tokens fail generically and cannot be revived by the client.

### Storefront versus API authority

Storefront may submit only customer intent: product public key, approved configuration token/reference, quantity, coupon text if later supported, and an idempotency key. It may render the API's quote and warnings.

The API alone resolves store/customer/cart ownership, Product/configuration references, sell price, discount, tax, shipping, availability, totals, quote validity, state transitions, and snapshots. It must ignore or reject client-supplied price, currency, unit totals, discount results, tax, shipping amount, order total, product description snapshot, customer/tenant ID, cart owner, status, provider transaction result, or invoice number.

## Order Domain and Lifecycle Decision

### Separate state dimensions

Do not create one enum that mixes commercial order, payment attempt, fulfilment, and return states. Persist separate state machines and expose a derived customer-facing summary.

#### Cart/order commercial lifecycle

```text
Cart.ACTIVE
  -> Order.DRAFT
  -> Order.SUBMITTED
  -> Order.AWAITING_PAYMENT
  -> Order.PAID
  -> Order.COMPLETED

Order.DRAFT | SUBMITTED | AWAITING_PAYMENT
  -> Order.CANCELLED

Order.PAID | COMPLETED
  -> Order.PARTIALLY_REFUNDED
  -> Order.REFUNDED
```

`DRAFT` is an API-owned order preparation state; Cart remains a separate aggregate. `SUBMITTED` means immutable customer/order snapshots and totals were accepted. `PAID` requires verified payment evidence or an approved manual-payment settlement event, never a browser redirect alone.

#### Payment-attempt lifecycle

```text
CREATED
  -> AWAITING_CUSTOMER | PENDING_PROVIDER | VERIFYING
  -> SUCCEEDED
  -> FAILED | CANCELLED | EXPIRED

FAILED | CANCELLED | EXPIRED
  -> a new attempt (never rewrite the old attempt)
```

The required “payment failed” customer state is the composition `Order.AWAITING_PAYMENT + latest PaymentAttempt.FAILED`. The Order remains retryable until expiry/cancellation policy; a failed attempt does not erase the Order or become payment truth.

#### Fulfilment/shipping lifecycle

```text
UNFULFILLED
  -> PREPARING
  -> READY_TO_SHIP
  -> SHIPPED
  -> IN_TRANSIT
  -> DELIVERED

PREPARING | READY_TO_SHIP | SHIPPED | IN_TRANSIT
  -> FULFILMENT_FAILED

Any eligible physical stage
  -> CANCELLED (only under explicit compensation policy)
```

#### Return and refund lifecycle

```text
RETURN_REQUESTED
  -> RETURN_AUTHORIZED | RETURN_REJECTED

RETURN_AUTHORIZED
  -> RETURN_IN_TRANSIT
  -> RETURN_RECEIVED
  -> INSPECTED
  -> RETURN_CLOSED

Refund.REQUESTED
  -> APPROVED | REJECTED
  -> SUBMITTED_TO_PROVIDER
  -> SUCCEEDED | FAILED
```

A return is a physical/customer-service process; a refund is a financial process. They reference each other but neither state machine substitutes for the other. Partial returns/refunds require per-line quantities and original allocation snapshots.

### Idempotency

- Order creation requires a client-generated high-entropy idempotency key scoped to store, verified owner/guest cart, and operation.
- Persist key, canonical request hash, outcome reference, status, and expiry under a unique constraint.
- Same key + same request returns the original result; same key + different request is a conflict.
- Cart conversion and order creation occur transactionally so one cart cannot create multiple orders.
- Payment-attempt creation, manual settlement, refund request, and document issuance each require separate idempotency scopes.
- Provider callback/webhook processing deduplicates by provider account + provider event/reference, retains normalized event history, and performs compare-and-set state transitions.
- Browser refreshes use GET/result lookup and never create a new Order or mark payment successful.
- Network retries use the original idempotency key and do not mutate a completed historical attempt.

### Order numbers and identifiers

- Internal aggregate IDs are opaque UUID-style values and are not customer authorization secrets.
- Human-readable order numbers are separate, immutable, unique within store/series, and suitable for support/document display.
- A sequential human number may be acceptable operationally, but must never grant access. If enumeration sensitivity matters, add a non-semantic random/check segment without embedding PII.
- Public routes use an opaque access reference. Authenticated access additionally checks customer ownership. Guest access uses a separately revocable, expiring signed/magic-link token plus a verification step approved by security/product.

### Customer/order access

- Guest: receive confirmation via the approved in-session/verified channel; access only that Order through an expiring, revocable capability token and rate-limited verification.
- Authenticated customer: query only Orders whose server-derived customer ownership matches the authenticated account and store.
- Staff: JWT + explicit commerce permissions + tenant/store scope + audit logging.
- Provider callbacks: dedicated machine boundary, never customer authentication.
- Order number, email, phone, provider reference, or internal UUID alone never authorizes access.

## Payment Orchestration and Provider Adapter Decision

### Central orchestration contract

Conceptual responsibilities:

```text
PaymentOrchestrator
  listEligibleMethods(orderContext)
  createAttempt(orderId, methodKey, idempotencyKey)
  processBrowserReturn(attemptReference, untrustedReturnData)
  processProviderEvent(providerAccount, signedEvent)
  verifyAttempt(attemptId)
  requestRefund(paymentId, amount, reason, idempotencyKey)
  reconcile(providerAccount, timeWindow)
```

The orchestrator owns normalized state, eligibility filtering, attempt persistence, Order notifications, duplicate protection, and audit. It does not contain provider-specific request signing, endpoint paths, field names, or response codes.

### Provider adapter contract

```text
PaymentProviderAdapter
  capabilities()
  createPayment(canonical request)
  parseAndValidateCallback(raw request)
  verifyPayment(provider reference, expected Money)
  queryPayment(provider reference)
  requestRefund(provider reference, Money)
  mapProviderError(error) -> normalized safe result
```

Adapters receive credentials/configuration from a secret-managed server-side provider account scoped to store/tenant. They return normalized provider-neutral results. Order records may retain adapter/account keys and provider references for audit, but the Order domain must not branch on provider names.

### Supported method categories

The boundary must be capable of representing:

- ordinary online/card gateway;
- installment/BNPL provider;
- wallet-like provider;
- bank transfer; and
- manual/offline settlement.

These are method categories, not one common workflow. Manual/bank settlement needs staff approval evidence and dual-control policy; it must not fake a successful online attempt. Installment/BNPL eligibility and credit approval remain provider-side. Fardad may hide a method when product/order/store/currency/amount rules make it unavailable, but must never claim that a customer is credit-approved before the provider confirms it.

An ordinary gateway and future providers such as SnappPay, Digipay, and TorobPay must be separate future adapters. This review neither selects a provider nor claims provider eligibility, fees, settlement terms, API capability, or contractual availability.

### Verification, callbacks, and reconciliation

- Browser return parameters are untrusted UX signals only.
- Only server-to-server verification or an approved manual settlement event may produce `SUCCEEDED`/paid state.
- Validate callback/webhook signatures where the provider supports them, bind events to the configured provider account, compare expected currency/amount/order, and reject replay/out-of-window events.
- If signatures are unavailable, require server verification and stricter reference/account/amount correlation; document the residual risk during provider selection.
- Record every normalized attempt/event/state transition with timestamps, correlation IDs, actor/source, and safe reason codes.
- Duplicate success events are idempotent. Conflicting results enter reconciliation/manual review; they do not silently rewrite paid/refunded Orders.
- Reconciliation compares provider settlement/status data with local attempts, payments, refunds, and order financial summaries. Differences create actionable cases.
- Provider outage/timeouts leave attempts pending/unknown until verified; they do not mark failure or success prematurely.
- Public errors are generic and retry-safe; raw provider payloads, URLs, credentials, account identifiers, and diagnostics remain internal/redacted.

Prefer a provider-hosted redirect/payment surface so Fardad does not collect card credentials. Sensitive authentication data such as card verification values must not be retained after authorization, even encrypted, under PCI DSS guidance. See the [PCI Security Standards Council FAQ](https://www.pcisecuritystandards.org/faqs/1533/) and its [redirect/iFrame scope explanation](https://www.pcisecuritystandards.org/faqs/1291/). Provider/acquirer and legal review remains mandatory for the selected Iranian payment flow.

No provider SDK, credential, callback route, webhook route, payment UI, provider configuration, or adapter is implemented in this review.

## Invoice, Receipt, and Customer-Panel Boundary

### Three distinct documents

| Document                         | Meaning                                           | Minimum immutable source snapshot                                                                                                                                                       | Must not claim                                                         |
| -------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Order confirmation/receipt       | Confirms an order was accepted/submitted          | Store/brand identity version, order number/time, line snapshots, totals, buyer/recipient summary, delivery choice, order state                                                          | Payment success or tax-invoice compliance                              |
| Payment receipt                  | Records one verified settlement/refund event      | Receipt number, payment/order references, verified amount/currency/time, method category, safely redacted provider reference, event/result                                              | Final invoice status, full card data, provider credit terms            |
| Final branded commercial invoice | Stable commercial document for the completed sale | Invoice series/number, issue time, seller/buyer snapshot, line and allocation snapshots, totals, tax/discount components, linked payment/credit-note references, template/brand version | Legal tax-invoice compliance unless separately approved and integrated |

An order may have multiple payment receipts and refund receipts, but normally one active final commercial invoice plus immutable correction/credit documents. Issued documents are never edited in place.

### Snapshot, numbering, and audit requirements

- Documents copy immutable order/payment/customer/seller data; they do not render directly from mutable current profiles or Product records.
- Persist document type, store/series, human document number, issue timestamp, source aggregate/version, template/brand version, locale/direction, content hash, rendering status, and supersession/correction references.
- Number allocation is server-side, concurrency-safe, store/series-scoped, auditable, and never accepted from a client.
- Number gaps, cancellation, reissue, duplicate rendering, and credit-note rules need legal/finance approval.
- Every view/download/reissue/cancellation by staff is authorized and audited; customer reads are ownership checked.
- A PDF is a rendition of the immutable document record, not the record of truth.

### Display, PDF, and panel access

Future delivery may provide accessible HTML and branded PDF renditions generated asynchronously or on demand from the same immutable snapshot. PDFs require RTL/Persian font licensing, shaping, accessibility, pagination, checksum/storage, and visual verification before release.

Customer-panel order history, invoice list, payment receipts, and downloads require a separate customer identity/access work order. Guest document access requires expiring, revocable, purpose-scoped links and secondary verification. Email delivery, PDF generation, customer authentication changes, and the panel are not part of this review.

### Commercial versus legal tax invoice

A Fardad-branded commercial invoice is a customer document. It must not be labelled or represented as a legally compliant tax invoice until Iranian legal/tax specialists approve required seller/buyer identifiers, numbering, signing, tax treatment, retention, correction, electronic reporting, and any government-system integration. That legal/tax review is a release gate, not a styling task.

## Include, Defer, and Prohibit Data Classification

### Include in a future approved commerce foundation

- canonical `Money` with integer-string amount and ISO currency code;
- server-derived store/tenant context;
- opaque Cart/line/access references;
- positive bounded quantity;
- server-generated quote components, version, calculation time, and expiry;
- product/configuration references internally plus safe display snapshots;
- order, payment, fulfilment, return/refund, and document states as separate types;
- immutable line/totals/customer/address/seller/policy snapshots on submitted Orders/documents;
- idempotency keys/hashes/outcomes and state-transition audit;
- provider-neutral method/attempt/refund/reconciliation references; and
- customer-safe status summaries and document access references.

### Defer until a separately approved design

- public price display and add-to-cart contracts;
- inventory sourcing, reservations, backorders, preorder, and oversell policy;
- promotions/coupons/bundle-rule execution;
- gift/add-on/configuration pricing and public selection UI;
- customer profile/address book and corporate buyer data;
- shipping providers/rates/tracking;
- tax rates, exemptions, official invoice/e-reporting integration;
- partial capture, split tender, wallet balance, installment UX, bank/manual settlement;
- multi-address, subscription/recurring, marketplace, multi-seller, quotation, and corporate credit;
- customer panel, PDF/email delivery, notification, support/ticket/chat; and
- analytics events, BI, accounting/ERP, fraud tooling, and advanced reconciliation.

### Prohibit from client trust or public disclosure

- client-supplied price, currency, total, discount, tax, shipping, refund amount, snapshot, or calculator result;
- client-supplied tenant/store/customer/cart/order/payment owner ID;
- raw internal UUIDs as access authorization;
- raw Product lifecycle/readiness, quality rules, cost, supplier, margin, inventory internals, or administrative notes;
- raw Product Experience JSON schemas/rules or unvalidated personalization data;
- raw Media references, asset IDs, storage keys, checksums, or provider data;
- payment credentials, secrets, signature keys, raw provider payloads, internal provider account IDs, PAN, CVV, PIN, full bank credentials, or unredacted sensitive references;
- client-declared payment success, callback validity, refund success, order state, fulfilment state, or invoice number;
- publicly enumerable guest/customer Orders or documents;
- internal audit/security diagnostics in customer errors; and
- tax/legal compliance claims without formal approval.

## Editions, Modules, and Feature Flags

### Minimal Base commerce capabilities once implemented

Commerce cannot be marketed as a functional shop unless the Base deployment includes a coherent minimum:

- authoritative single-currency pricing and quote calculation;
- product purchasability/availability decision;
- guest Cart and safe checkout;
- Order creation/history access for the buyer;
- one ordinary payment method through orchestration;
- basic payment verification, reconciliation queue/case handling, cancellation, and refund recording;
- one basic shipping/fulfilment selection/status path where physical delivery applies;
- order confirmation, payment receipt, and branded commercial invoice; and
- secure guest receipt access plus basic authenticated order/document history when accounts are offered.

The existing `catalog.shop` and `account.foundation` identifiers are too broad to express staged commerce readiness safely. A future capability-contract review should approve granular stable identifiers, for example pricing/cart/checkout/orders/standard-payment/documents, before implementation. This report does not add identifiers.

### Paid or separately entitled modules

- branded live chat;
- advanced ticketing/customer support workflow;
- advanced or multiple payment-provider adapters, including installment/BNPL and wallet integrations;
- loyalty and referral;
- corporate credit and quotation/proforma workflows;
- advanced corporate sales terms;
- ERP/accounting/tax-system integration;
- advanced settlement/reconciliation automation, chargeback/fraud tooling, and finance reporting; and
- advanced fulfilment/carrier integrations.

Basic safe operations required to accept an ordinary payment cannot be paywalled out of a commerce-enabled Base deployment. “Advanced payment provider” packaging must not compromise verification, audit, refunds, or reconciliation safety.

Branded live chat is a future paid module, not Base. Ticketing belongs in a future customer panel. No chat, ticket, WhatsApp, Bale, Telegram, social, AI, PWA, loyalty, referral, personalization, or support-channel integration is designed or implemented here.

### Visibility invariant

Preserve the current rule:

```text
visible/publishable capability
  = entitled
  AND deployment-enabled
  AND implemented
  AND publishable for the active store/profile
```

Navigation/UI visibility remains presentation only. The API independently enforces store scope, customer ownership, staff permissions, state transitions, monetary policy, and provider security. No package price or public SaaS billing is proposed.

## Security, Privacy, and Operations

### Tenant and brand isolation

- Every future commerce aggregate, price/discount policy, provider account, numbering series, document template, audit record, and idempotency scope must carry a server-derived store/tenant key.
- Unique constraints and repository queries must include that key where applicable.
- Never accept a tenant/store ID from an untrusted Storefront payload to choose ownership, price list, provider credentials, or documents.
- Background jobs/events carry explicit store context and reject missing/mismatched context.
- Provider callbacks resolve the store through a configured provider account/callback binding, not a public request parameter alone.
- Brand profile/template version is snapshotted on documents; visual branding never changes legal/financial ownership.

The current schema and one-entry Storefront registry do not provide this persistence isolation. The tenant/store strategy is a blocking decision before schema implementation.

### Authorization and PII

- Customer operations require authenticated ownership or a purpose-scoped guest capability; staff operations require JWT, explicit permissions, store scope, and audit.
- Minimize buyer/recipient fields to checkout, fulfilment, legal, support, and invoice needs approved for the journey.
- Separate account profile, order snapshot, shipping recipient, and invoice buyer; copying is explicit and immutable where required.
- Encrypt sensitive PII at rest where threat/legal review requires it; restrict logs, exports, support views, and backups.
- Redact phone, email, address, provider references, tokens, and document links from routine logs/errors.
- Define retention/deletion/anonymization by data class. Legal/financial records may have different retention and erasure constraints from abandoned carts or failed attempts.
- Never collect/store card credentials in Fardad; prefer provider-hosted payment collection.

### Abuse controls

- Rate limit cart creation/mutation, guest lookup, login merge, checkout validation, order submission, payment initiation/status polling, coupon attempts, guest document access, and support searches.
- Bind guest tokens to purpose and rotate/revoke on merge/conversion; use Secure/HttpOnly/SameSite cookies and CSRF protection where cookie authentication mutates state.
- Apply payload/quantity/line-count/address/text limits and canonical validation.
- Detect idempotency-key abuse, token enumeration, repeated payment initiation, webhook replay, and provider-reference probing.
- Use generic non-disclosing errors for missing/unauthorized resources and payment failures; retain safe internal correlation IDs.

### Audit requirements

Audit at least:

- price/policy publication and calculation version;
- Cart merge/conversion and checkout validation outcome;
- Order submission and every state transition;
- payment attempt/event/verification/reconciliation transition;
- manual payment/refund approvals with actor and reason;
- shipment/return transitions;
- document number allocation, issue, download, correction, and cancellation; and
- staff/customer access to sensitive Order/document records where required.

Audit records are append-oriented, tamper-evident by operational design, access controlled, and separated from public API responses.

### Operational monitoring and reconciliation

Monitor and alert on:

- submitted Orders without expected payment attempts;
- attempts stuck pending/unknown beyond provider-specific thresholds;
- provider success without local paid Order, or local paid state without verified provider evidence;
- amount/currency/order/provider-account mismatches;
- duplicate/conflicting callbacks and idempotency conflicts;
- refund totals exceeding captured amounts;
- inventory reservations not committed/released;
- fulfilments stuck or conflicting with cancellation/refund;
- failed invoice/receipt generation, duplicate document numbers, and number-sequence gaps requiring review;
- guest access abuse and staff permission denials;
- reconciliation backlog, manual overrides, provider outage/error rates, and settlement discrepancies; and
- PII/secret leakage in logs and dead-letter/error payloads.

Every alert needs an owner, severity, runbook, correlation IDs, safe replay/retry procedure, and audit outcome. No monitoring code or infrastructure is added here.

## Failure-Mode Analysis

| Failure                                          | Safe behavior                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Product becomes unpublished/non-ready            | Existing public visibility fails; Cart revalidation flags/removes line; submitted Order snapshot remains intact    |
| Price changes in Cart                            | Mark quote stale, recalculate server-side, disclose delta, require approved acknowledgement policy                 |
| Inventory disappears                             | Reject/adjust before Order submission; release locks/reservations deterministically                                |
| Checkout request repeats                         | Idempotency returns the original Order or a key/request conflict                                                   |
| Browser closes after payment                     | Provider/server reconciliation completes state; return page is not required for truth                              |
| Provider times out                               | Attempt remains pending/unknown; query/reconcile; do not infer success/failure                                     |
| Callback repeats                                 | Deduplicate and replay prior normalized result without duplicate Order/refund transition                           |
| Callback amount/currency differs                 | Quarantine/manual reconciliation; never mark Order paid                                                            |
| Payment succeeds after Order cancellation/expiry | Compensation/reconciliation case; do not silently reopen Order                                                     |
| Partial payment/refund                           | Apply explicit policy and persisted allocations; no current-price recomputation                                    |
| Return accepted but refund fails                 | Keep physical return and financial refund states distinct; retry/escalate refund                                   |
| Document rendering fails                         | Preserve issued document record/number; retry rendition without reallocating number                                |
| Customer changes profile/address                 | Existing Order/invoice snapshots do not change                                                                     |
| Cross-tenant reference supplied                  | Generic not-found/unauthorized result, audit, no existence disclosure                                              |
| Provider unavailable                             | Hide/disable only from server eligibility policy, preserve existing Orders/attempts, expose generic retry guidance |

## Recommended Future Work-Order Sequence

Do not assign final WO numbers until the existing WO-013 identifier collision is resolved.

### 1. Commerce Money, Pricing, Availability, and Cart Foundation

Dependencies/approvals:

- tenant/store scope;
- canonical IRR/Toman input/display/rounding policy;
- authoritative price-list/offer ownership;
- initial inventory/available-to-sell and reservation decision;
- guest/authenticated Cart/merge/expiry policy; and
- quantity/price-change rules.

Deliverables after a separate schema review: framework-independent Money/quote/Cart contracts, API-owned pricing and availability services, Cart aggregate, idempotent mutation API, guest ownership, authenticated merge, focused tests, and no payment/order UI until validated.

Explicit non-goals: checkout address, shipping provider, tax invoice, Order submission, payment, provider adapter, invoice, support/chat, analytics.

### 2. Checkout and Order Creation

Dependencies:

- validated Cart/Pricing foundation;
- customer/guest identity and PII/retention policy;
- shipping quote/selection ownership;
- tax/legal calculation policy; and
- immutable snapshot/order numbering/state/idempotency approvals.

Deliverables: server-side checkout validation, customer/recipient/address snapshots, shipping/tax integration contracts, idempotent Order creation, separate commercial/fulfilment states, secure guest/authenticated Order access, and tests.

Explicit non-goals: gateway/provider implementation, marking paid from browser, final invoice/PDF, advanced returns, customer panel.

### 3. Payment Orchestration and One Ordinary Gateway

Dependencies:

- approved Order contract/states;
- selected ordinary provider, merchant contract, credentials, callback/verification documentation, and legal/security review;
- provider account/secret management;
- reconciliation ownership/runbooks; and
- refund/cancellation rules.

Deliverables: provider-neutral orchestration, one adapter, attempts/events, server verification, secure callback/webhook route, idempotency, duplicate protection, basic refund recording, reconciliation, operational tests, and minimal Storefront result flow.

Explicit non-goals: SnappPay, Digipay, TorobPay, other installment/BNPL, wallets, multiple gateways, provider terms claims, loyalty, corporate credit, advanced reconciliation.

### 4. Branded Documents and Customer Order History

Dependencies:

- stable Order/Payment snapshots;
- approved seller/buyer/document fields, numbering, retention, correction, and legal/tax classification;
- Brand Book/logo/font rights and RTL PDF acceptance; and
- customer/guest access model.

Deliverables: order confirmation, payment/refund receipts, branded commercial invoice, accessible HTML, verified PDF rendition if separately approved, authorized downloads, basic customer order/document history, and audit.

Explicit non-goals: claim of tax-invoice compliance without legal approval, ERP/accounting integration, advanced finance reports, email if not separately approved.

### 5. Paid Support, Ticketing, and Advanced Commerce Modules

Dependencies:

- customer panel and commerce ownership model;
- separate entitlement/capability review;
- retention/privacy/support-operating model; and
- independently approved provider/product requirements.

Deliver separately: advanced ticketing, branded live chat, advanced payment adapters, loyalty, referral, corporate credit, quotations, ERP/accounting, and advanced reconciliation. Each remains hidden unless entitled, enabled, implemented, and publishable.

Explicit non-goals: bundling social messaging, WhatsApp, Bale, Telegram, AI, PWA, personalization, or unrelated channels into the first support module.

## Exact Questions Requiring Human Approval

1. Which work-order numbering series is authoritative, given the existing `WO-013_SHIPPING_SYSTEM.md` collision?
2. Should the three untracked WO-012 product route files be reviewed and committed before any commerce branch/work begins?
3. Is canonical accounting/payment currency `IRR`, with all persisted/calculated amounts in integer rials?
4. Is Toman allowed for Storefront/Admin input/display, and is the explicit conversion policy exactly 1 Toman = 10 IRR? Which screens/providers require Rial display instead?
5. What is the approved rounding/allocation rule for discounts, tax, shipping, invoices, and partial refunds?
6. Is the engine multi-tenant/store-scoped in the first commerce schema, and what is the authoritative store/merchant identity source?
7. Who owns sell prices, price publication, price lists/channels, scheduling, and approval? Are price-hidden/inquiry-only products allowed?
8. What is the initial availability model: simple available-to-order, tracked stock, reservation, preorder/backorder, or manual confirmation? What is the oversell policy?
9. What quantity limits apply per line/product/order/customer, including corporate purchases?
10. Are guest checkout and guest Order/document lookup allowed? What verification and retention are acceptable?
11. On login, how should duplicate guest/customer lines merge, which Cart wins, and how are unavailable items/price changes disclosed?
12. How long do carts and quotes remain valid? Must customers acknowledge every increase, every change, or both increases and decreases?
13. Which buyer, recipient, address, contact, corporate, consent, and retention fields are required for the first checkout?
14. Which shipping method/calculator is in Base, and when is shipping reserved/confirmed relative to payment?
15. What tax rules apply, who approves rates/classification/rounding, and is any government electronic-invoice integration required?
16. What are cancellation, payment-expiry, late-success, return, partial-return, and refund policies?
17. What human-readable Order, payment-receipt, invoice, and credit-note numbering formats/series are approved?
18. Is the initial invoice only a branded commercial invoice, or must launch wait for legally compliant tax-invoice integration?
19. Which ordinary online gateway will be evaluated in the later provider-selection work order, and what merchant credentials/test environment will be supplied?
20. Which payment method categories are Base versus paid modules? Confirm that installment providers remain separate advanced adapters.
21. Which granular commerce capability identifiers should replace reliance on broad `catalog.shop`/`account.foundation` visibility?
22. Which staff roles/permissions may view PII, settle manual payments, cancel Orders, approve returns/refunds, reissue documents, and reconcile providers?
23. What are the retention, anonymization, export, audit, and incident-response policies for carts, Orders, payment events, provider payloads, PII, and documents?
24. What operational team owns payment reconciliation, stuck Orders, refunds, fulfilment exceptions, document failures, and customer escalation?

## Explicit Scope Exclusions

This review did not create or modify:

- application source, shared contracts, configuration, capability IDs, tests, dependencies, manifests, or lockfiles;
- Prisma schema, migration, seed, generated client, database data, or database connection;
- Product, ProductMedia, ProductDataQualityService, Product Experience, Media, Auth, RBAC, Public Catalog, Storefront, or Admin implementation;
- price display, product actions, Cart, checkout, customer/address, Order, payment, callback, webhook, refund, return, shipping, invoice, PDF, email, customer panel, or Admin UI;
- payment provider selection, SDK, credential, route, terms, eligibility claim, or adapter;
- SnappPay, Digipay, TorobPay, wallet, bank, manual-payment, or ordinary-gateway integration;
- chat, ticketing, WhatsApp, Bale, Telegram, social, AI, PWA, loyalty, referral, personalization, analytics, ERP/accounting, monitoring, or infrastructure;
- package/SaaS prices, public billing, subscription, edition entitlements, or navigation publication; or
- Git history, staging, commit, push, merge, rebase, branch, tag, or destructive command.

No existing report was modified. The only created path is this report.

## Final Git Status

Final verification showed the same three pre-existing untracked WO-012 route files with identical SHA-256 hashes, plus this one new report, and no tracked diff.

Verified final `git status --short -uall`:

```text
?? apps/storefront/app/(public)/products/[slug]/error.tsx
?? apps/storefront/app/(public)/products/[slug]/loading.tsx
?? apps/storefront/app/(public)/products/[slug]/page.tsx
?? docs/codex/reports/WO-013_PRE_IMPLEMENTATION_CART_ORDER_PAYMENT_INVOICE_REVIEW.md
```

## Final Architecture Decision

**Status: REVIEW COMPLETE; NOT APPROVED FOR IMPLEMENTATION.**

The next action is human approval of the blocking questions, beginning with work-order identity, WO-012 route completeness, canonical Money/Toman rules, tenant/store scope, price and availability ownership, guest/customer policy, tax/shipping/legal invoice rules, and the future capability sequence. No schema or implementation should begin until those decisions are recorded in a controlled follow-up work order.
