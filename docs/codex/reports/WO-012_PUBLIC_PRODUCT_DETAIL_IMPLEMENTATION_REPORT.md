# WO-012 Public Product Detail Implementation Report

## Implementation Summary

WO-012 is implemented within the existing Public Catalog, media-resolution, Storefront profile, and App Router architecture. The implementation adds a framework-independent public detail contract, a lifecycle- and readiness-gated API endpoint, fixed-purpose detail/gallery media resolution, a server-only Storefront client method, an RTL mobile-first product route with loading and error states, safe metadata, and one accessible product-detail link on each product card.

No database schema, migration, seed, dependency, lockfile, Admin, Product Experience, commerce, capability, entitlement, or Next image configuration change was made.

## Repository State

- Active branch: `architecture-refactor`
- Baseline commit: `7bdc806`
- Baseline state: the approved pre-implementation report was already untracked before WO-012 implementation.
- Implementation state: uncommitted, as required.
- The pre-existing untracked pre-implementation report remained present and was included only in the formatting pass; its substantive review content was not changed.

## Exact Files Changed and Rationale

### Shared contracts

- `packages/types/src/catalog.ts` — adds `PublicProductImage` and `PublicProductDetail`; reuses `PublicProductImage` for product cards.
- `packages/types/src/content.ts` — adds the typed, app-owned localized product-detail content group.

### API

- `apps/api/src/media/media.types.ts` — extends the closed `PublicMediaPurpose` union with only `detail` and `gallery`.
- `apps/api/src/media/public-media-resolver.service.ts` — maps fixed detail/gallery purposes to the existing `DETAIL` and `GALLERY` rendition enums.
- `apps/api/src/public-catalog/dto/public-product-slug.params.dto.ts` — validates the product slug with the existing lowercase kebab-case boundary.
- `apps/api/src/public-catalog/public-catalog.controller.ts` — registers `GET products/:slug` under the existing `public/catalog` controller.
- `apps/api/src/public-catalog/public-catalog.repository.ts` — centralizes and reuses the exact WO-009 lifecycle/category predicate and adds the minimal ordered detail projection.
- `apps/api/src/public-catalog/public-catalog.service.ts` — applies unchanged readiness evaluation, generic 404 normalization, defensive mapping, fixed-purpose media resolution, stable gallery omission, and the approved public response projection.

### Storefront

- `apps/storefront/src/lib/api/public-catalog.ts` — adds the server-only `getPublicProduct(slug)` method using existing typed not-found/request failures.
- `apps/storefront/src/lib/product-metadata.ts` — adds approved-field metadata fallbacks and gates canonical/Open Graph URLs on an approved Storefront origin.
- `apps/storefront/src/config/brands/fardad/content.fa.ts` — supplies localized product-detail content through the app-owned Fardad profile.
- `apps/storefront/components/catalog/ProductMediaGallery.tsx` — renders the nullable main-image fallback and stable, non-interactive gallery.
- `apps/storefront/components/catalog/ProductDetail.tsx` — renders the accessible informational detail page, breadcrumb, category link, single `h1`, optional English name, and plain-text descriptions.
- `apps/storefront/app/(public)/products/[slug]/page.tsx` — adds server-rendered data loading, metadata, and typed 404-to-`notFound()` handling.
- `apps/storefront/app/(public)/products/[slug]/loading.tsx` — adds an accessible reduced-motion-aware loading state.
- `apps/storefront/app/(public)/products/[slug]/error.tsx` — adds the localized client error boundary with a functional native retry button.
- `apps/storefront/components/catalog/ProductCard.tsx` — adds exactly one focus-visible product-detail link without nested interactive content.

### Reporting

- `docs/codex/reports/WO-012_PUBLIC_PRODUCT_DETAIL_IMPLEMENTATION_REPORT.md` — records implementation, security, validation, production conditions, and repository state.
- `docs/codex/reports/WO-012_PRE_IMPLEMENTATION_PRODUCT_DETAIL_REVIEW.md` — pre-existing untracked baseline input; formatting-only handling during this work order.

## Public Contract Confirmation

`PublicProductDetail` exposes only:

- `name`
- optional `englishName`
- `slug`
- `shortDescription`
- `description`
- category `name` and `slug`
- nullable `mainImage` with `src` and `alt`
- ordered `gallery` entries with `src` and `alt`
- optional SEO `title` and `description`

The compiled response assertion confirmed those exact top-level keys. A structural scan confirmed the shared contract contains no ID, raw enum, lifecycle, audit, readiness, diagnostic, attribute, label, level, logistics, Product Experience, price, stock, or raw media/storage field.

## Visibility and Security Evidence

- Final route: `GET /api/v1/public/catalog/products/:slug`, formed by the existing global `/api/v1` prefix, controller base `public/catalog`, and method path `products/:slug`.
- Both public list and detail repository methods call the same `publicProductLifecycleWhere` helper.
- The captured predicate requires a non-deleted active product, `PUBLISHED` publication state, non-null publication time not later than the request time, and a non-deleted active category.
- Detail readiness calls `ProductDataQualityService.evaluate(candidate.id)` and reads the existing `isPublicationReady` result without modifying the service.
- A compiled service/repository harness confirmed the same generic status/message for nine paths: absent, private, inactive, unpublished, future publication, invalid category, non-ready, readiness lookup not-found, and defensively unmappable product.
- Every tested rejection returned HTTP status `404` with message `Product not found`.
- Serialized response assertions confirmed no internal product ID, media asset ID, canonical media reference, readiness result, or raw media field escaped mapping.
- Invalid slug syntax remains a transport validation error; valid but unavailable slugs use the generic product 404.

## Media Behavior Evidence

- The public media purpose set is exactly `card`, `detail`, and `gallery`.
- `detail` maps only to the existing `DETAIL` rendition; `gallery` maps only to the existing `GALLERY` rendition.
- The repository orders candidate media by `sortOrder ASC`, then `id ASC` for deterministic ties.
- Only linked media references are submitted to the existing resolver.
- Main media returns either one `{ src, alt }` descriptor or `null`.
- Gallery mapping retains repository order and omits unlinked or unresolved entries.
- Explicit trimmed alt text is preferred; product name is the fallback.
- The compiled harness verified fixed purposes, stable omission, main alt trimming, gallery alt fallback, and null resolution from the real resolver mapping.
- No arbitrary URL input, client-selected variant, storage key, or raw media reference was added to a public contract.

## Storefront Behavior and Accessibility Evidence

- The route is an App Router server component and performs no client-side data fetch.
- API 404 is translated to the existing typed `PublicCatalogNotFoundError`, then to Next `notFound()`; other API/network failures remain `PublicCatalogRequestError` and reach `error.tsx`.
- `notFound()` supplies the framework's not-found response and noindex behavior; source assertions confirmed the route calls it for typed API 404s.
- The page inherits `dir="rtl"` from the resolved Storefront identity at the root layout.
- The page has one product `h1`, a labelled breadcrumb navigation, a category link, and an optional English name marked `lang="en"` and `dir="ltr"`.
- Links and the retry button use native keyboard semantics; links include visible focus-ring styles.
- The layout is mobile-first and introduces multi-column layout only at responsive breakpoints.
- Descriptions are rendered as text, preserve line breaks, and are not truncated or inserted as HTML.
- The gallery is a semantic list with no button, link, carousel, lightbox, or click handler.
- Missing main media produces an accessible localized fallback; an empty gallery is omitted.
- Loading content is announced and respects reduced-motion preferences.
- ProductCard contains exactly one link and no nested interactive element.

## Metadata Evidence

- Title falls back from approved SEO title to public product name.
- Description falls back from approved SEO description to public short description.
- The current Fardad profile has no approved canonical URL, so the implementation emits neither a canonical nor an Open Graph URL.
- URL fields are emitted only if `profile.identity.url` is resolved from an approved canonical origin in the future.
- No Product JSON-LD, offer, price, inventory, review, rating, SKU, GTIN, or new brand claim is emitted.

## Validation Commands and Results

All commands ran from `D:\fardad\fardad` unless a package directory is stated.

### Type checks — PASS

- `node_modules\.bin\tsc.CMD -p packages/types/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.CMD -p packages/config/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.CMD -p packages/utils/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.CMD -p packages/ui/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.CMD -p apps/storefront/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.CMD -p apps/admin/tsconfig.json --noEmit`
- `node_modules\.bin\tsc.CMD -p apps/api/tsconfig.json --noEmit`

### Lint — PASS

- `node_modules\.bin\eslint.CMD apps/storefront`
- `node_modules\.bin\eslint.CMD apps/admin`
- `node_modules\.bin\eslint.CMD apps/api/src --ext .ts`

### Production builds — PASS

- `node_modules\.bin\nest.CMD build` from `apps/api`
- `node_modules\.bin\next.CMD build` from `apps/storefront`; `/products/[slug]` was emitted as a dynamic server-rendered route.
- `node_modules\.bin\next.CMD build` from `apps/admin`

Both Next builds retained the existing non-failing warning that the Next.js ESLint plugin was not detected. Standalone ESLint and Next's build-time lint/type checks passed.

### Behavioral and structural validation — PASS

- Compiled API behavior harness: exact contract keys, generic 404 matrix, shared lifecycle predicate, quality gate, internal-field non-disclosure, fixed media purposes, gallery order/omission, null resolution, and alt fallback.
- Static configuration/source assertions: exact route composition, typed Storefront error translation, `notFound()`, retry control, loading state, canonical-origin gating, no commerce metadata, non-interactive gallery, exact one-link ProductCard, and prohibited-field/path scans.
- UX source assertions: profile-owned RTL, focus visibility, native keyboard controls, mobile-first breakpoints, long plain-text content, reduced motion, and accessible missing-media behavior.
- `node node_modules\prettier\bin\prettier.cjs --check -- <changed-and-untracked-paths>` over all changed and untracked WO-012 source/report files: PASS. The direct Node entrypoint safely preserves App Router paths containing parentheses on Windows.
- `git diff --check`: PASS.

No database connection, migration execution, external media request, or release-data mutation was performed. The behavior matrix used compiled application classes with deterministic repository/resolver doubles; the real resolver's closed purpose-to-enum mapping was exercised directly.

## Known Production Conditions

1. Approved canonical origin: canonical and Open Graph URL fields intentionally remain absent until an approved canonical origin is added to the Storefront profile.
2. Real linked media fixtures: end-to-end image rendering requires production-valid linked media registry/rendition records and an approved media origin. No fixture, storage record, or database state was invented in this work order.

These conditions do not weaken the fail-closed behavior: absent or unsafe media remains `mainImage: null`, unsafe gallery entries are omitted, and the Storefront renders its localized fallback.

## Explicit Out-of-Scope Confirmation

- No Prisma schema, migration, migration execution, seed, or database data was changed.
- No dependency, package manifest, or lockfile was changed.
- No Admin or Product Experience file was changed.
- No pricing, stock, cart, checkout, payment, attribute, label, level, review, search, personalization, analytics, capability, edition, or entitlement feature was added.
- No `next.config.ts` or broad image remote pattern was changed.
- No public internal identifier or diagnostic field was added.
- No commit, push, merge, rebase, or branch operation was performed.

## Git Status

At final reporting, the branch is `architecture-refactor` at baseline commit `7bdc806`. Exact `git status --short -uall` output after formatter and diff validation:

```text
 M apps/api/src/media/media.types.ts
 M apps/api/src/media/public-media-resolver.service.ts
 M apps/api/src/public-catalog/public-catalog.controller.ts
 M apps/api/src/public-catalog/public-catalog.repository.ts
 M apps/api/src/public-catalog/public-catalog.service.ts
 M apps/storefront/components/catalog/ProductCard.tsx
 M apps/storefront/src/config/brands/fardad/content.fa.ts
 M apps/storefront/src/lib/api/public-catalog.ts
 M packages/types/src/catalog.ts
 M packages/types/src/content.ts
?? apps/api/src/public-catalog/dto/public-product-slug.params.dto.ts
?? apps/storefront/app/(public)/products/[slug]/error.tsx
?? apps/storefront/app/(public)/products/[slug]/loading.tsx
?? apps/storefront/app/(public)/products/[slug]/page.tsx
?? apps/storefront/components/catalog/ProductDetail.tsx
?? apps/storefront/components/catalog/ProductMediaGallery.tsx
?? apps/storefront/src/lib/product-metadata.ts
?? docs/codex/reports/WO-012_PRE_IMPLEMENTATION_PRODUCT_DETAIL_REVIEW.md
?? docs/codex/reports/WO-012_PUBLIC_PRODUCT_DETAIL_IMPLEMENTATION_REPORT.md
```

## Commit Recommendation

Do not commit automatically. After human review, create one scoped WO-012 commit containing the implementation and both WO-012 reports. Before production release, validate with an approved canonical origin and real linked media fixtures in the target environment; do not invent either value merely to satisfy local validation.
