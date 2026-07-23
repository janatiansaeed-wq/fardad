# WO-042 Pre-Implementation Cart Experience Review

- Date: 2026-07-21
- Branch: `architecture-refactor`
- Baseline: `c028986 feat(commerce): add multi-store offer and guest cart foundation`

## Entry Gate Evidence

| Check                                            | Result                                             |
| ------------------------------------------------ | -------------------------------------------------- |
| Active branch                                    | `architecture-refactor`                            |
| `git status --short -uall` before implementation | clean (no output)                                  |
| Required baseline ancestry                       | `git merge-base --is-ancestor c028986 HEAD` passed |
| Current HEAD                                     | `c028986`                                          |

## Actual Extension Points

- The App Router public shell is `apps/storefront/app/(public)/layout.tsx`; product routes use route-local `page.tsx`, `loading.tsx`, and client error boundaries.
- `apps/storefront/src/lib/api/public-commerce.ts` is the only Storefront Commerce API client and begins with `import "server-only"`; its requests are private/no-store.
- `apps/storefront/src/lib/commerce/cart-actions.ts` provides the approved same-origin Server Action boundary for Cart create, add, quantity, removal, and quote refresh. `cart-session.ts` provides the safe current-Cart read.
- Product Detail currently receives the unchanged public catalog product contract. The purchase option can be loaded separately on the server and passed only as the already-safe `PublicPurchasingOption` contract.
- `apps/storefront/src/lib/navigation.ts` computes visible navigation by intersecting entitlement, enabled capability, and implemented capability. Fardad already entitles and enables `catalog.shop`, but only `catalog.products` is implemented, so shop is not published.
- Brand text, RTL direction, and generic visual tokens are profile-driven through `LocalizedContentProfile`, the Fardad profile, and `@fardad/ui` primitives.

## Security Boundaries to Preserve

- No browser code may import the server-only Commerce client, Cart session helper, BFF proof helper, or API configuration.
- The opaque Cart token stays only in the existing Secure, HttpOnly, host-only cookie; it must not be returned in action results or client props.
- Cart mutations must continue through Server Actions, retaining same-origin verification, server-generated idempotency keys, BFF HMAC proof, replay prevention, and API-side rate limits.
- UI receives only safe public Cart, purchasing-option, and generic message data. Store/Offer identifiers, revisions beyond the approved public Cart contract, token, API origin, BFF headers, proofs, diagnostics, and internal error details remain server-only.

## Acceptance Criteria

1. A reachable public Cart route has loading, error, empty, and populated states, responsive and keyboard-accessible mutations, and a continue-shopping route.
2. Product Detail resolves the safe purchasing option server-side and exposes an add control only for online, available, priced options with validated safe quantity bounds.
3. UI mutations serialize through the existing Server Actions, prevent duplicate submission, render only server-confirmed Cart state, and use generic recovery messages for expiry, availability, quantities, conflicts, and transient failures.
4. `catalog.shop` is marked implemented only after the route and safe product entry point exist; publication remains gated by entitlement and enablement.
5. Focused structural tests cover server-only boundaries, non-disclosure, safe state handling, Cart states, capability gating, and public catalog compatibility.

## Explicitly Out of Scope

Checkout, Orders, payment, gateways, invoices, shipping, tax, discounts, coupons, inventory/reservations/warehouse, customer identity or panel, Admin offer UI, Product Experience prices as sale prices, tenant/merchant modelling, analytics/tracking, new third-party packages, database/migration execution, Docker, deployment, commit, and push.
