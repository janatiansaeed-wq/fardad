# WO-042 Public Cart Experience Implementation Report

- Date: 2026-07-21
- Branch: `architecture-refactor`
- Status: **READY FOR HUMAN APPROVAL; NOT COMMITTED OR PUSHED**

## Entry Gate Evidence

| Check                              | Result                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Active branch                      | `architecture-refactor`                                                                                       |
| Initial `git status --short -uall` | clean (no output)                                                                                             |
| Required baseline ancestry         | `git merge-base --is-ancestor c028986 HEAD` passed                                                            |
| Initial HEAD                       | `c028986 feat(commerce): add multi-store offer and guest cart foundation`                                     |
| Pre-implementation review          | `docs/codex/reports/WO-042_PRE_IMPLEMENTATION_CART_EXPERIENCE_REVIEW.md` created before source implementation |

## Implemented Behavior

- Added the public, force-dynamic `/cart` App Router route with route-local loading and error boundaries, responsive empty and populated Cart states, continue-shopping links, accessible labels, keyboard-operable forms/buttons, polite live mutation feedback, busy states, and focus transfer to resulting status messages.
- The Cart view renders only the existing safe public Cart contract. Visitors can set a line quantity, remove a line, refresh a quote, and see only safe totals, availability notices, and generic recovery messages. No checkout or payment action is displayed.
- Product Detail resolves the safe purchasing option on the server through the existing server-only Commerce client. It shows the add control only for an online, priced, available option with its public min/max quantity bounds; all other options receive a generic customer-facing unavailable state.
- Add-to-Cart creates/resolves the guest Cart as necessary, then reads its current public revision server-side before adding. It sends the shopper to the real Cart route after a successful server-confirmed mutation.
- All Cart action results contain only a safe Cart snapshot plus a generic UI reason. On conflicts and other failed mutations, the action obtains a fresh safe Cart state where possible; the client refreshes the route without retrying a change, preventing duplicate line changes.

## Controlled Capability Publication

`catalog.shop` is now implemented for the Fardad profile because the Cart route and safe Product Detail entry point both exist. Publication remains controlled by `isShopPublished`, which requires the profile's entitlement, enabled availability, and implemented availability to intersect. The `/cart` navigation item requires `catalog.shop`, Product Detail suppresses purchasing controls when the gate is false, and the Cart route returns not found when the gate is false.

The present Fardad base profile is entitled and enabled for `catalog.shop`, so the Cart route is published. An operator can unpublish it by removing `catalog.shop` from either the profile's `enabled` or `implemented` set; no database or deployment setting was changed in this work order.

## Changed Files

- `apps/storefront/app/(public)/cart/{page,loading,error}.tsx` — private/no-store Cart page, loading skeleton, and generic retry boundary.
- `apps/storefront/components/commerce/CartExperience.tsx` — responsive Cart rendering and safe Server Action mutation UX.
- `apps/storefront/components/commerce/ProductPurchaseControl.tsx` — safe Product Detail quantity and add-to-Cart control.
- `apps/storefront/app/(public)/products/[slug]/page.tsx` and `components/catalog/ProductDetail.tsx` — server-side purchase-option resolution and composition without changing the public catalog contract.
- `apps/storefront/src/lib/commerce/cart-actions.ts` and `cart-session.ts` — wrap the approved actions in safe, server-confirmed UI results and map only the approved expired-Cart case into an empty/expired Cart state, while retaining same-origin checks, cookie handling, idempotency generation, and existing BFF-backed API calls.
- `apps/storefront/src/lib/shop-capability.ts`, `src/config/brands/fardad/feature-profile.ts`, and `src/config/brands/fardad/navigation.ts` — capability-gated publication and Cart navigation.
- `packages/types/src/content.ts` and `apps/storefront/src/config/brands/fardad/content.fa.ts` — profile-driven Cart and purchase copy; no Commerce API contract change.
- `apps/storefront/test/commerce-boundary.test.mjs` — focused structural tests for client/server boundaries, non-disclosure, Cart states, and capability publication.
- `docs/codex/reports/WO-042_PRE_IMPLEMENTATION_CART_EXPERIENCE_REVIEW.md` and this report — required review and implementation evidence.

## Security-Boundary Confirmation

- Browser components invoke only Server Actions; they do not import the Commerce API client, API configuration, BFF proof helper, or Cart cookie helper.
- API origin, Cart-token header, BFF header names/secrets, Cart token, Store and Offer identifiers, hashes, and diagnostics do not appear in client component source or built Storefront static assets.
- Existing same-origin Server Action validation, Secure/HttpOnly host-only cookie policy, server-generated idempotency keys, BFF HMAC proof, replay protection, API no-store behavior, rate limits, and generic API failures remain intact.
- UI maps permitted server error categories to generic localized messages and never renders raw internal codes or error details.

## Verification Results

| Check                                   | Result                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------- |
| Storefront focused structural tests     | PASS (`pnpm.cmd --filter @fardad/storefront test`)                        |
| Storefront typecheck                    | PASS                                                                      |
| Storefront lint                         | PASS                                                                      |
| Storefront production build             | PASS                                                                      |
| `@fardad/types` typecheck               | PASS                                                                      |
| API typecheck, lint, build, and tests   | PASS (no API source behavior was changed)                                 |
| Changed-file Prettier check             | PASS                                                                      |
| `git diff --check`                      | PASS                                                                      |
| Source/private-value scan               | PASS: private markers appear only in server-only modules                  |
| Built `.next/static` private-value scan | PASS: no API-origin, Cart-token-header, BFF-secret, or BFF-header markers |

## Explicit Exclusions

No checkout, Order, payment, gateway, invoice, shipping, tax, discount, coupon, inventory, reservation, warehouse, customer account/panel, Admin offer UI, Product Experience sale pricing, tenant/merchant model, analytics, external tracking, third-party package, migration, remote/production database access, Docker activity, deployment, commit, or push was performed.

## Final Git Status

```text
 M apps/storefront/app/(public)/products/[slug]/page.tsx
 M apps/storefront/components/catalog/ProductDetail.tsx
 M apps/storefront/src/config/brands/fardad/content.fa.ts
 M apps/storefront/src/config/brands/fardad/feature-profile.ts
 M apps/storefront/src/config/brands/fardad/navigation.ts
 M apps/storefront/src/lib/commerce/cart-actions.ts
 M apps/storefront/src/lib/commerce/cart-session.ts
 M apps/storefront/test/commerce-boundary.test.mjs
 M packages/types/src/content.ts
?? apps/storefront/app/(public)/cart/error.tsx
?? apps/storefront/app/(public)/cart/loading.tsx
?? apps/storefront/app/(public)/cart/page.tsx
?? apps/storefront/components/commerce/CartExperience.tsx
?? apps/storefront/components/commerce/ProductPurchaseControl.tsx
?? apps/storefront/src/lib/shop-capability.ts
?? docs/codex/reports/WO-042_PRE_IMPLEMENTATION_CART_EXPERIENCE_REVIEW.md
?? docs/codex/reports/WO-042_PUBLIC_CART_EXPERIENCE_IMPLEMENTATION_REPORT.md
```

## Commit Recommendation

`feat(storefront): publish safe guest cart experience`
