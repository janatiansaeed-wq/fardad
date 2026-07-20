# WO-009 Public Product Catalog & Storefront Discovery Report

> Project: Fardad Enterprise Platform  
> Work order: WO-009 — Public Product Catalog & Storefront Discovery  
> Status: Completed  
> Date: 2026-07-20

## Executive Summary

WO-009 implements the first public Fardad Base capability: a read-only catalog/category API and server-rendered Storefront discovery routes. The API returns only explicit public card/category fields, applies the approved lifecycle-plus-readiness policy, and never returns raw Prisma entities, IDs, lifecycle fields, quality data, prices, inventory, Plus features, or raw media references.

The Storefront now provides `/products` and `/products/category/[slug]`, category discovery, responsive RTL product cards, accessible pagination, catalog-specific loading/error/empty/not-found behavior, and catalog metadata. `catalog.products` is the only newly publishable capability. There is no shop alias, product detail route/link, cart, commerce UI, or Media Delivery implementation.

## Approved Gate Decisions

- `ProductMedia.mediaReference` remains internal and is never included in public API output. Product cards intentionally render a polished, labelled no-image fallback; `image` is always `null` in WO-009 transport.
- The approved public-visibility rule requires non-deleted, `ACTIVE`, `PUBLISHED`, already-published products with active/non-deleted categories and `ProductDataQualityService.evaluate(product.id).isPublicationReady === true`.
- Missing critical checklist rules block public visibility; non-critical required warnings do not. The existing WO-005/WO-006 evaluator remains the only readiness authority.
- No approved disposable database was supplied. Static validation is complete; runtime API/database verification is explicitly not executed.

## Repository and Branch State

- Active branch: `architecture-refactor`.
- The pre-existing uncommitted WO-008 migration/foundation work remains preserved in the working tree.
- `apps/storefront` remains the only public frontend; `apps/web` and `@fardad/web` references are absent from active source/configuration paths.
- No Prisma schema, migration, seed, Product Experience model, admin application, or worker file was changed.

## Shared Public Contracts

`packages/types/src/catalog.ts` now exports the approved framework/database-independent public transport shapes:

- `PublicCategorySummary` — name, stable slug, optional description;
- `PublicProductCard` — name, slug, short description, category summary, and forward-compatible nullable image;
- `CatalogPagination` — exact page, fixed page size, item total, and page total; and
- `PublicProductListResponse` — optional requested-category summary, cards, and pagination.

The Storefront consumes these contracts through the shared package boundary. The API maps the same approved shape explicitly from its selected records and exposes no persistence model directly.

## Public Catalog API

Created an isolated `PublicCatalogModule` in `apps/api/src/public-catalog`, imported by `AppModule`. It depends only on `PrismaModule` and `ProductModule`; it has no Product Experience, authentication, authorization, admin, or Storefront dependency.

Implemented endpoints:

- `GET /api/v1/public/catalog/categories`
- `GET /api/v1/public/catalog/products?page=1`
- `GET /api/v1/public/catalog/categories/:slug/products?page=1`

The controller is read-only, uses validated DTOs, contains no Prisma access or readiness logic, and has no authentication guard because these are intentionally public read endpoints. The repository owns Prisma selection; the service owns visibility orchestration, exact pagination, 404 behavior, and public-field mapping.

## Public Visibility Enforcement

The repository eliminates obvious lifecycle-ineligible records before they reach the service:

```text
deletedAt = null
status = ACTIVE
publicationState = PUBLISHED
publishedAt <= now and is not null
category is active and not deleted
```

For every remaining candidate, `PublicCatalogService` calls the existing `ProductDataQualityService.evaluate(candidate.id)` and accepts the product only if `isPublicationReady` is true. The controller and Storefront do not duplicate product readiness rules. The service then maps only the approved public fields.

## Product Data Quality Reuse

No quality rules, criticality, evaluator behavior, Product repository, Product service, schema, migration, or seed were changed. The public catalog invokes the current evaluator unchanged, so the WO-006 logistics critical rules also remain blocking even though logistics are never exposed publicly.

This preserves the intended distinction:

- critical missing rules: excluded from public listing;
- non-critical missing required rules: still eligible for public listing, with warnings retained internally only.

## Public Field Mapping

| Public response field | Source | Notes |
| --- | --- | --- |
| Product name | `Product.name` | Returned only after readiness passes. |
| Product slug | `Product.slug` | Stable public identifier; no internal UUID returned. |
| Short description | `Product.shortDescription` | Returned only after readiness passes. |
| Category name/slug | `ProductCategory.name` / `slug` | Category is active/non-deleted and no category ID is returned. |
| Category description | `ProductCategory.description` | Returned only in category discovery/requested category summary. |
| Image | Constant `null` | Forward-compatible contract field; no media value is selected or leaked. |

Full descriptions, SEO/admin fields, labels, attributes, quality state, timestamps, IDs, raw enums, logistics, price, inventory, gift/add-on/configuration relations, and raw `mediaReference` are absent from public transport mapping.

## Media Safety Decision

`ProductMedia.mediaReference` is not browser-safe under the approved gate decision. It is not selected by the public-catalog repository, not serialized by the service, and not passed to Storefront components. No image remote pattern, proxy, signed URL, media service, or invented URL was added.

Each product card renders an intentional Fardad fallback visual with an accessible `role="img"` label stating that the product image is unavailable. Existing main-image readiness remains mandatory through the existing evaluator; no-image delivery does not weaken publication requirements.

## Pagination Behavior

The only accepted query is `page`. `PublicCatalogPageQueryDto` transforms it to a number, requires an integer from 1 to 1,000, and defaults to 1. Page size is fixed server-side at 12.

The service evaluates readiness before calculating `totalItems`, `totalPages`, and the requested slice. It therefore cannot claim raw lifecycle candidate totals while returning fewer public cards. Pages beyond the final page return a valid empty item list with accurate totals rather than exposing non-ready products.

## Category Discovery Behavior

Category discovery returns only active, non-deleted categories ordered by `sortOrder`, then name. It intentionally may include a valid category that has no currently publishable products; no product count is fabricated and no second full readiness scan is added only to hide such categories.

The category product endpoint returns:

- `404` for an absent, inactive, or deleted category; and
- `200` with an empty listing for a valid category with no publishable products.

The Storefront uses API category discovery rather than the static craft-category seed. The static header now publishes only the single `/products` entry.

## Storefront HTTP Boundary

`apps/storefront/src/lib/api/public-catalog.ts` is `server-only` and uses HTTP fetch to the environment-configurable `STOREFRONT_API_BASE_URL`, falling back only to the local API development URL `http://localhost:4000/api/v1`.

It uses 60-second bounded revalidation/tags, returns typed shared contracts, maps 404 to `PublicCatalogNotFoundError`, and maps other transport/server failures to a generic server-only request error. It does not turn failed requests into an empty catalog, import API source, use client effects, or create a browser API client.

## Storefront Routes

Implemented under the existing public route group:

- `/products` — server-rendered root catalog and API category discovery;
- `/products/category/[slug]` — server-rendered category catalog using API-returned category copy;
- catalog/category loading routes — accessible skeleton/status output;
- catalog/category error boundaries — small Client Components with Persian retry actions.

Both catalog pages are dynamic server-rendered routes so production builds do not fabricate a catalog response while no approved runtime database exists. An API 404 triggers `notFound()` only for the category route. An empty root catalog or valid empty category renders a dedicated empty state.

## Product Card and Catalog UI

Created Storefront-domain-only components: `ProductCard`, `ProductGrid`, `CategoryDiscovery`, `CatalogPagination`, and `CatalogEmptyState`. They compose the generic WO-008 UI primitives but are not placed in `packages/ui`.

Cards show only the no-image fallback, category name, product name, and short description. They have no detail link, price, availability, discount, add-to-cart, label, gift/add-on/configuration option, or internal quality/admin state. Pagination is server-rendered and bounds the displayed page links around the current page while retaining first/last navigation.

## RTL and Accessibility

- Catalog pages retain Fardad profile `fa`/RTL configuration and semantic CSS variables.
- The grid is mobile-first one/two/three columns with preserved DOM reading order.
- Cards use article/list semantics and a meaningful fallback image label without nested interactive elements.
- Category and pagination controls use named navigation landmarks, Persian labels, visible focus styles, `aria-current="page"`, and comfortable touch targets.
- Loading has accessible status text and `aria-busy`; empty/error states use clear Persian messaging.

## SEO Behavior

Catalog metadata uses the Fardad metadata template and supplies catalog-specific title/description, canonical path, Open Graph details, and robots policy:

- `/products` page 1: canonical `/products`, `index, follow`.
- `/products?page=N` for N > 1: self-canonical with query, `noindex, follow`.
- Category routes: API-returned category name/description, stable slug canonical, and the same page-one/page-greater-than-one robots policy.
- Invalid categories call `notFound()`.

No sitemap, product JSON-LD, offer schema, detail metadata, or CMS SEO administration was added.

## Capability Activation

After static validation passed, `catalog.products` was added to Fardad's implemented capability state and the single `/products` navigation entry is now visible. `catalog.shop` remains unimplemented/hidden. Static craft-category children were removed from the public navigation until API-backed category discovery can determine valid links. All Plus, Pro, and Enterprise capabilities remain hidden.

## Files Created

| File | Why it changed |
| --- | --- |
| `packages/types/src/catalog.ts` | Defines the shared framework/database-independent public catalog transport contracts. |
| `apps/api/src/public-catalog/public-catalog.module.ts` | Adds the isolated read-only public catalog module. |
| `apps/api/src/public-catalog/public-catalog.controller.ts` | Defines exactly the three approved public GET endpoints. |
| `apps/api/src/public-catalog/public-catalog.service.ts` | Applies the approved visibility policy, readiness reuse, mapping, exact pagination, and category 404 behavior. |
| `apps/api/src/public-catalog/public-catalog.repository.ts` | Owns lifecycle prefiltering and minimal Prisma projections. |
| `apps/api/src/public-catalog/dto/public-catalog-page-query.dto.ts` | Validates and bounds the only allowed page query. |
| `apps/api/src/public-catalog/dto/public-category-slug.params.dto.ts` | Validates stable category slugs. |
| `apps/storefront/src/lib/api/public-catalog.ts` | Provides the server-only Storefront HTTP boundary and generic error mapping. |
| `apps/storefront/src/lib/catalog-metadata.ts` | Centralizes catalog/category canonical and robots metadata behavior. |
| `apps/storefront/components/catalog/ProductCard.tsx` | Renders the approved no-image product card without commerce/detail features. |
| `apps/storefront/components/catalog/ProductGrid.tsx` | Renders the responsive semantic product listing. |
| `apps/storefront/components/catalog/CategoryDiscovery.tsx` | Renders API-backed public category navigation. |
| `apps/storefront/components/catalog/CatalogPagination.tsx` | Renders accessible server pagination links. |
| `apps/storefront/components/catalog/CatalogEmptyState.tsx` | Renders intentional valid-empty catalog/category output. |
| `apps/storefront/app/(public)/products/page.tsx` | Implements the root catalog route and metadata. |
| `apps/storefront/app/(public)/products/loading.tsx` | Implements the accessible root catalog loading skeleton. |
| `apps/storefront/app/(public)/products/error.tsx` | Implements the root catalog retry boundary. |
| `apps/storefront/app/(public)/products/category/[slug]/page.tsx` | Implements the category route, metadata, and API-404-to-not-found behavior. |
| `apps/storefront/app/(public)/products/category/[slug]/loading.tsx` | Reuses the catalog loading state for category listings. |
| `apps/storefront/app/(public)/products/category/[slug]/error.tsx` | Implements the category retry boundary. |
| `docs/codex/reports/WO-009_PUBLIC_PRODUCT_CATALOG_STOREFRONT_DISCOVERY_REPORT.md` | Records implementation scope, validation, runtime status, and remaining limits. |

## Files Modified

| File | Why it changed |
| --- | --- |
| `packages/types/src/index.ts` | Exports the new shared catalog contracts. |
| `apps/api/src/app.module.ts` | Imports the new public catalog module. |
| `apps/storefront/src/config/fardad-features.ts` | Marks only `catalog.products` as implemented/publishable. |
| `apps/storefront/src/config/fardad-navigation.ts` | Publishes `/products` and removes static category children that are not API-derived. |

No package version, dependency, lockfile, schema, migration, seed, existing product-quality, Product Experience, or admin file was modified by WO-009.

## Validation Commands and Results

| Command/check | Result |
| --- | --- |
| Local `tsc --noEmit` for `packages/types`, `packages/config`, `packages/utils`, `packages/ui`, `apps/storefront`, `apps/admin`, `apps/api` | Passed for all seven workspaces. |
| Local standalone ESLint for Storefront, Admin, and API | Passed for all three applications. |
| Storefront local `next build` | Passed; `/products` and `/products/category/[slug]` are correctly dynamic server routes. Existing non-blocking Next flat-ESLint-plugin warning remains. |
| Admin local `next build` | Passed; existing non-blocking Next flat-ESLint-plugin warning remains. |
| API local `nest build` | Passed. |
| `git diff --check` | Passed. |
| Structural scan | Passed: no Prisma outside API, no API source imports outside API, no `apps/web`/`@fardad/web`, no shop route/link, no product-detail route, no catalog client fetch effect, no raw-media mapping, and exactly three public GET decorators. |

The repository-standard pnpm/Corepack command path remains unavailable from the accepted WO-008 environment limitation; no packages were installed or updated. Checked-in local binaries were used for the equivalent validations above.

## Runtime Verification Status

**NOT EXECUTED — APPROVED TEST DATA/DATABASE NOT AVAILABLE.**

No disposable database, seed, fixture, migration, production connection, or runtime API endpoint test was created or used. The successful builds validate compilation and route structure only; they do not prove a runtime catalog response against data. Runtime verification remains required before release on an approved non-production database.

## Dependency and Leakage Scans

- No Prisma or `@prisma/client` import exists outside `apps/api`.
- No Storefront/shared package imports API source.
- The controller has three GET methods only; no writes, auth guards, or Product Experience dependency exist.
- `mediaReference` is absent from public-catalog selections/mappings and Storefront catalog transport/components.
- Internal product/category IDs are selected only for API-internal readiness evaluation and are never mapped to responses.
- Public DTOs/components include no price, inventory, labels, gift, add-on, configuration, logistics, quality, or administrative field.
- No `/shop`, `/products/[slug]`, or product detail link was added.
- No catalog `useEffect`/client initial fetch exists.

## Known Limitations

- Dynamic readiness evaluation scans lifecycle-eligible candidates before calculating totals. It is correct but can become expensive as catalog volume grows; caching, a projection, or batch optimization is deferred to an approved future work order.
- Category discovery may include valid active categories with zero publishable products; no false count or duplicate full readiness scan is introduced.
- Media delivery is intentionally absent; cards always use the approved fallback until a Media Delivery work order provides browser-safe URLs.
- Runtime behavior has not been verified against an approved database.
- The existing non-blocking Next flat-ESLint-plugin detection warning remains during production builds.

## Out-of-Scope Confirmation

No product detail, `/shop`, search, filters, sorting, client-selectable page size, price, inventory, labels, cart, checkout, orders, payment, shipping, discounts, invoices, wishlists, recommendations, reviews, gift boxes, add-on services, product configuration, analytics, auth, customer panel, CMS, product/category admin, navigation administration, configuration persistence, media proxy/signing, database/schema/migration/seed, worker, support/AI, SaaS, marketplace, visual builder, subscription, or billing work was implemented.

## Git Status

The working tree contains the preserved WO-008 changes plus the WO-009 files listed above. No unrelated change was discarded. No commit, push, merge, rebase, branch creation, branch switch, or destructive Git command was performed.

## Risks and Follow-Up Work

- Verify endpoint behavior with approved non-production product/category data before release.
- Implement browser-safe media delivery in a separate work order before replacing the card fallback with actual images.
- Add an approved test harness for public visibility, category 404/empty behavior, DTO leakage, pagination totals, and accessibility regression tests.
- Consider a future approved public-read projection or readiness caching strategy when catalog volume requires it.
- Implement product detail independently; do not add detail links before that contract, route, SEO, and media scope are approved.

## Action Items

1. Review the catalog public-field mapping and the derived public-read policy implementation.
2. Provide an approved disposable database/test data for runtime API verification.
3. Approve a Media Delivery work order before exposing product images.
4. Review and approve separately before beginning product-detail work.
