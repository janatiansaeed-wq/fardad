# WO-009 Pre-Implementation Architecture Review

> Project: Fardad Enterprise Platform  
> Work order: WO-009 — Public Product Catalog & Storefront Discovery  
> Phase: Read-only review  
> Status: Awaiting explicit implementation approval

## Executive Summary

WO-009 can establish the first public Fardad Base capability without Prisma changes: read-only catalog/category endpoints and the `/products` plus `/products/category/[slug]` storefront routes. The existing Product, ProductCategory, ProductMedia, lifecycle, and data-quality foundations are sufficient as data sources. They are not yet sufficient as a persisted public-read model, so the public API must derive visibility from the existing lifecycle fields and the existing `ProductDataQualityService` rather than trust a raw Prisma query or expose a raw entity.

The repository is **READY WITH BLOCKERS**. Two decisions must be recorded before implementation: (1) whether `ProductMedia.mediaReference` is already a safe public browser URL/path or requires a future media-resolution boundary, and (2) confirmation that the catalog's derived visibility condition is the approved interim public-publication rule until an administrative publication-transition workflow is built. Neither decision requires a schema change.

## Repository State

- Active branch: `architecture-refactor`.
- `git status --short` contains the uncommitted WO-008 implementation and its reports. These are expected current-worktree changes and must be preserved; no unrelated changes were observed or modified in this review.
- Canonical public application is `apps/storefront` (`@fardad/storefront`); `apps/web` is absent.
- `apps/api` owns the only Prisma schema/client, repositories, services, and database access.
- `packages/types`, `packages/config`, `packages/ui`, and `packages/utils` have the WO-008 boundaries described in its implementation report.
- `apps/api/src/main.ts` applies `/api/v1` globally and uses `ValidationPipe` with transformation, whitelisting, and rejection of unknown properties.
- The API has authentication controller/DTO conventions but no product controller, public response envelope, pagination convention, global exception filter, or existing catalog query DTO.

## WO-005 Compatibility Review

WO-005 owns `Product`, `ProductCategory`, `ProductAttribute*`, `ProductMedia`, product lifecycle fields, and `ProductDataQualityService`. It intentionally added no product controller or public endpoint. WO-009 must add a distinct read-only public-catalog controller/service/repository projection and reuse—not replace—the Product data-quality evaluator.

The real existing fields safe to consider for public transport are:

| Entity | Public-safe candidate fields | Conditions |
| --- | --- | --- |
| Product | `name`, `slug`, `shortDescription` | All are existing critical quality requirements; only return after the derived public-visibility check passes. |
| Product | `englishName`, `productType`, `level`, `publishedAt` | Existing fields but not required for the initial card. Do not expose by default; `level` is only a non-blocking quality field. |
| ProductCategory | `name`, `slug`, `description`, `sortOrder` | Only when `isActive = true` and `deletedAt IS NULL`; do not expose internal IDs. |
| ProductMedia | main-image `mediaReference`, `altText`, `title`, `sortOrder` | Main image is required for readiness. `mediaReference` needs the public-URL decision below; use `altText` with product-name fallback. |
| ProductLabel | enum labels | Technically safe but excluded from WO-009 because label display is not necessary for the initial catalog and could imply campaign/marketing behavior. |

Do not expose `id`, `categoryId`, raw status/publication enum values, `description`, `metaTitle`, `metaDescription`, attributes, checklist statuses/rules, logistics, gift/add-on relations, configurations, bundle rules, prices, currency, or any administrative timestamps. Product detail data is deliberately deferred.

## WO-006 Non-Exposure Confirmation

WO-006 added backend-only gift boxes, add-on services, product configurations, bundle rules, logistics, and anonymous event definitions. Its report explicitly excludes frontend UI, pricing execution, checkout, orders, inventory, and analytics collection.

WO-009 must not select, serialize, link, display, or activate any WO-006 relation/capability. The public catalog's data-quality check will continue to respect WO-006-added critical logistics readiness rules because it reuses the existing evaluator, but no logistics or Plus feature data is returned to the browser.

## Existing Public Product Data Analysis

There are no public product/category endpoints, no public product read repository, and no sample/seed product data. The only product service method currently delegates to `ProductDataQualityService.getDataQuality(productId)`. `ProductRepository` has a quality-context query and active checklist-rule query, but no list/category projection.

The product model supports an initial card through title, slug, short summary, associated category, and a `MAIN_IMAGE`. It does not contain price/inventory/purchasing data. `ProductMedia.mediaReference` is explicitly provider-neutral; it is not documented as a public URL, CDN URL, signed URL, or local path. Therefore an image source must not be assumed safe merely because a main image exists.

## Publication and Data-Quality Rule Analysis

### Existing readiness logic

`ProductDataQualityService.evaluate` returns `isPublicationReady: true` only when no active, required, **critical** checklist rule is missing. It currently treats these as critical:

- name, slug, short description, full description, active/non-deleted category, required category attributes, and main image (WO-005); and
- product/package dimensions, product/package weight, and final shipping weight (WO-006).

The active required but non-critical fields are level, gallery/detail/packaging/lifestyle media, media alt text, and SEO title/description. They produce quality warnings through `missingRequiredFields`, but do not make `isPublicationReady` false. This exactly supplies the requested distinction: missing critical rules are blocking errors; missing required non-critical rules are non-blocking quality warnings. WO-009 must not change rule weights, rule criticality, models, or the admin workflow.

### Proposed derived public-visibility condition

The public catalog must return a product only when all of the following are true:

```text
product.deletedAt === null
AND product.status === ACTIVE
AND product.publicationState === PUBLISHED
AND product.publishedAt !== null
AND product.publishedAt <= now
AND product.category exists, isActive, and deletedAt === null
AND ProductDataQualityService.evaluate(product.id).isPublicationReady === true
```

The first five lifecycle checks are an intentionally conservative public-read policy. The final condition is the existing backend domain logic that confirms completeness. The existing code does not yet enforce this compound predicate at a publication transition or persist a public-read projection; WO-009 must derive it in the public-catalog service. It must not equate `PUBLISHED` alone with public safety.

## Public API Boundary Proposal

Create a read-only `PublicCatalogModule` under `apps/api/src/public-catalog/`, imported by `AppModule`. It may depend on `ProductModule` and `PrismaModule`, but must have no dependency on Product Experience or authorization modules. Its controller has no authentication guard because the routes are intentionally public and it offers no write or internal data surface.

The module should contain:

- `public-catalog.controller.ts` — HTTP-only routing, DTO validation, and typed public response return;
- `public-catalog.service.ts` — derived visibility policy, category existence handling, pagination orchestration, and mapping; and
- `public-catalog.repository.ts` — Prisma projection/query ownership for active categories and lifecycle-eligible product candidates.

The existing `ProductDataQualityService` remains the single readiness authority. To avoid duplicating its checks, factor only its existing non-mutating evaluation input/method as necessary so the public service can evaluate candidate products. Do not recreate the logic in a second static Prisma `where` clause.

## API Endpoint Proposal

Use the global prefix already configured in `main.ts`:

| Endpoint | Purpose | Query/path contract |
| --- | --- | --- |
| `GET /api/v1/public/catalog/categories` | Category discovery/navigation data | No query initially; return active, non-deleted categories ordered by `sortOrder`, then name. |
| `GET /api/v1/public/catalog/products?page=1` | Root public catalog | `page` only; default 1, integer, minimum 1, bounded maximum 10,000. |
| `GET /api/v1/public/catalog/categories/:slug/products?page=1` | A category's public catalog | Lowercase kebab-case `slug` path DTO and same bounded `page`; 404 only for absent/inactive/deleted category, not for an empty valid category. |

Use one catalog route, `/products`, rather than duplicate `/shop` and `/products` routes. `/shop` must not be created or redirected in WO-009; it would duplicate discovery, metadata, navigation, and future canonical SEO ownership. Product detail routes are also excluded: a card can link only after a separately approved product-detail contract/route exists, so WO-009 cards should be non-purchasing discovery cards without a detail link.

## Public Response Contract Proposal

Add framework-independent transport contracts to `packages/types/src/catalog.ts` and export them through `packages/types/src/index.ts`. The API may consume the package through a workspace dependency, and the Storefront may consume the same contract; neither may share Prisma types.

```ts
type PublicCategorySummary = {
  name: string;
  slug: string;
  description?: string;
};

type PublicProductCard = {
  name: string;
  slug: string;
  shortDescription: string;
  category: Pick<PublicCategorySummary, "name" | "slug">;
  image: { src: string; alt: string } | null;
};

type CatalogPagination = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type PublicProductListResponse = {
  category?: PublicCategorySummary;
  items: PublicProductCard[];
  pagination: CatalogPagination;
};
```

Successful endpoint bodies should return the direct typed payload, matching the current Auth controller's direct-success convention. The Storefront server HTTP adapter maps non-OK responses to the existing framework-neutral `ApiError` shape; do not introduce a global API envelope or error-filter refactor in WO-009. Responses must be mapped explicitly from selected fields, never returned from Prisma directly.

## Pagination and Query Validation Proposal

No existing pagination/filter/search convention exists in the API. WO-009 should introduce only a narrow, documented catalog convention:

- query DTO with `@Type(() => Number)`, integer validation, `@Min(1)`, and `@Max(10_000)` for `page`;
- fixed server-side page size of 12 for this initial Base catalog (not caller-selectable); and
- strict slug DTO/parameter validation matching the existing Product slug regex (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) and bounded to 255 characters.

Do not add arbitrary filters, price filters, attributes, sort controls, query search, full-text search, or client-driven page sizes. Category is represented by the stable route slug, not an unbounded query filter.

Because readiness is dynamically evaluated, exact pagination requires filtering lifecycle-eligible candidates by `ProductDataQualityService` before calculating totals and slicing. The implementation must not return underfilled pages while claiming raw database totals. For the initial catalog this can be done with a batched quality-context/readiness evaluation; the report's risk section records the scaling cost and the need for a later public-read projection/caching strategy.

## Category Route Proposal

- `/products` is the only global catalog route.
- `/products/category/[slug]` is the only category listing route.
- The root catalog can display category discovery links from `GET /public/catalog/categories`.
- The category route uses `GET /public/catalog/categories/:slug/products`; unknown, inactive, or deleted categories result in `notFound()`; valid categories with zero publishable products render an intentional empty state.
- Category navigation must contain only returned public active category summaries. It must not reuse the static Fardad craft-category seed because those links can refer to unimplemented or nonexistent catalog categories.

## Storefront Route Proposal

Create the routes under the existing public group so they inherit the server-first shell:

- `apps/storefront/app/(public)/products/page.tsx` — server component for root catalog;
- `apps/storefront/app/(public)/products/loading.tsx` — catalog skeleton/loading state;
- `apps/storefront/app/(public)/products/error.tsx` — client retry boundary for catalog requests;
- `apps/storefront/app/(public)/products/category/[slug]/page.tsx` — server component for category catalog;
- `apps/storefront/app/(public)/products/category/[slug]/loading.tsx` and `error.tsx` — category route states.

The route page reads `page` server-side from `searchParams`, calls a `server-only` Storefront public-catalog HTTP client, and renders the response. It must not fetch initial data in a Client Component or import any API source. The client boundary remains limited to error retry and, only if separately necessary, progressive pagination interaction; initial pagination links can be ordinary server-rendered links.

## Product Card Data Contract

Create Storefront-local `ProductCard` and `ProductGrid` domain components that accept `PublicProductCard` from `packages/types`. Keep domain presentation in the Storefront, not `packages/ui`; the reusable package remains responsible only for generic `Card`, `Container`, `PageState`, and image primitives.

Product cards render only:

- primary image or a visually clear non-decorative fallback state;
- image alt text from media `altText`, falling back to product `name` only when the source is absent/blank;
- name;
- short description; and
- category name.

They must not render a product detail link, price, availability, labels, discount, add-to-cart action, gift/service/configuration options, or administrative/product-quality state. The image `src` can be emitted only after the public media-reference policy is resolved.

## Product Listing UI Plan

Create a catalog page composition that uses `ResponsiveContainer`, page heading, category-discovery links, `ProductGrid`, and server-rendered pagination controls. Use plain links preserving the bounded `page` parameter. The category route uses the API's returned category heading/description; do not derive title text from an untrusted raw slug.

No client-side search, filter drawer, query-string synchronizer, or product detail interaction belongs in this work order. A small static/in-page category navigation is sufficient for discovery; attributes/filters and full-text search remain deferred.

## Empty / Loading / Error / Not-Found Plan

- Root catalog, valid category without publishable products: render a `PageState` empty state with no purchase call to action.
- Loading: render a catalog-specific server loading skeleton with `aria-busy`/accessible status text; do not use a generic spinner alone.
- API failure: route `error.tsx` is a Client Component with a retry button and no server error leakage.
- Unknown/inactive/deleted category: the server page calls `notFound()` after an API 404, allowing the existing application not-found behavior.
- Root `/products` is never a 404 merely because no products are publishable.

## SEO Plan

- `/products`: metadata title from Fardad SEO template plus catalog title, default description from a Fardad catalog configuration value, canonical `/products`, and index/follow only for the unfiltered first page.
- `/products/category/[slug]`: use API-returned category name/description, canonical route slug, `notFound()` for invalid category, and index/follow only for page 1.
- Paginated `?page>1` routes should be self-canonicalized with their page query and marked `noindex, follow` to avoid duplicate listing indexing while retaining crawlable links.
- Do not add sitemap generation, product JSON-LD, price/offer schema, or product-detail metadata in WO-009.

## RTL and Accessibility Plan

- Maintain the profile-driven `fa`/RTL document and semantic token styling from WO-008.
- Use logical properties and grid layouts that collapse from one to two/three columns responsively without changing reading order.
- Product cards use article/list semantics, a meaningful image or labelled fallback, heading hierarchy, and no nested interactive controls.
- Category/pagination controls use semantic nav landmarks, descriptive Persian labels, `aria-current="page"` for the active page, and visible keyboard focus.
- Empty/loading/error states use clear Persian copy and announced status where content changes; touch targets remain at least comfortably tappable.

## Capability Activation Plan

After successful WO-009 implementation and validation only:

- add `catalog.products` to Fardad's `implemented` capability set;
- retain `catalog.shop` as hidden because no separate shop route is implemented;
- update the Fardad static navigation item for products to `/products` only after the capability is publishable;
- do not expose static child craft links until corresponding API-backed category routes exist; and
- keep all Plus/Pro/Enterprise capabilities hidden, including `gift.experience`, `gift.boxes`, `gift.addonServices`, and `product.configuration`.

## Exact File-Level Implementation Plan

### Files to Create

| File | Responsibility |
| --- | --- |
| `packages/types/src/catalog.ts` | Framework/database-independent public category, card, pagination, and list contracts. |
| `apps/api/src/public-catalog/public-catalog.module.ts` | Isolated read-only catalog module wiring. |
| `apps/api/src/public-catalog/public-catalog.controller.ts` | The three public GET routes only. |
| `apps/api/src/public-catalog/public-catalog.service.ts` | Derived visibility policy, readiness reuse, pagination, mapping, and 404 behavior. |
| `apps/api/src/public-catalog/public-catalog.repository.ts` | Prisma-selected category/candidate queries with no raw entity transport. |
| `apps/api/src/public-catalog/dto/public-catalog-page-query.dto.ts` | Bounded page validation. |
| `apps/api/src/public-catalog/dto/public-category-slug.params.dto.ts` | Safe category-slug parameter validation. |
| `apps/api/src/public-catalog/public-catalog.types.ts` | API-internal selected Prisma projection types, if required. |
| `apps/storefront/src/lib/api/public-catalog.ts` | `server-only` HTTP adapter using `fetch`, typed payload decoding, cache/revalidation policy, and 404/error mapping. |
| `apps/storefront/components/catalog/ProductCard.tsx` | Fardad domain presentation from a public card contract only. |
| `apps/storefront/components/catalog/ProductGrid.tsx` | Semantic responsive listing composition. |
| `apps/storefront/components/catalog/CategoryDiscovery.tsx` | API-backed category links without static seed duplication. |
| `apps/storefront/components/catalog/CatalogPagination.tsx` | Accessible server-rendered pagination links. |
| `apps/storefront/components/catalog/CatalogEmptyState.tsx` | Intentional root/category empty state. |
| `apps/storefront/app/(public)/products/page.tsx` | Root server-rendered catalog route. |
| `apps/storefront/app/(public)/products/loading.tsx` | Root catalog loading state. |
| `apps/storefront/app/(public)/products/error.tsx` | Root catalog retry boundary. |
| `apps/storefront/app/(public)/products/category/[slug]/page.tsx` | Category server-rendered catalog route. |
| `apps/storefront/app/(public)/products/category/[slug]/loading.tsx` | Category loading state. |
| `apps/storefront/app/(public)/products/category/[slug]/error.tsx` | Category retry boundary. |

### Files to Modify

| File | Responsibility |
| --- | --- |
| `packages/types/src/index.ts` | Export catalog contracts. |
| `packages/types/package.json` | Add explicit catalog subpath export only if the existing wildcard does not cover the final import style. |
| `apps/api/package.json` | Add only `@fardad/types: workspace:*` if API consumes the shared public transport contracts. |
| `apps/api/src/app.module.ts` | Import `PublicCatalogModule`. |
| `apps/api/src/product/product-data-quality.service.ts` | Extract/reuse its existing read-only evaluation input only if needed for batch catalog readiness; do not alter rules or outcomes. |
| `apps/api/src/product/product.repository.ts` | Add/reuse read-only quality-context batch support only if it prevents duplicating current readiness logic. |
| `apps/storefront/src/config/fardad-features.ts` | Mark only `catalog.products` implemented after validation. |
| `apps/storefront/src/config/fardad-navigation.ts` | Publish the single `/products` navigation entry and remove/keep hidden unresolved static children. |
| `apps/storefront/src/config/fardad-store.ts` | Add catalog-specific static SEO copy only if no existing approved profile field can express it. |
| `apps/storefront/package.json` and `pnpm-lock.yaml` | Record only the internal types workspace dependency if required by final imports; no version change/install. |
| `apps/storefront/next.config.ts` | Add a narrowly approved image remote pattern only if the public media-reference decision requires it. |

No Prisma schema, migration, seed, Product Experience, shared generic UI redesign, admin, auth, or worker file is in the implementation plan.

## Validation Plan

After explicit approval and implementation:

1. Run local-equivalent type checks for `packages/types`, `packages/config`, `packages/utils`, `packages/ui`, `apps/storefront`, `apps/admin`, and `apps/api`; use checked-in local binaries if pnpm/Corepack remains unavailable.
2. Run standalone lint for Storefront, Admin, and API, then production builds for Storefront, Admin, and API.
3. Run focused API tests if the approved test harness exists: lifecycle exclusion, deleted/inactive category exclusion, readiness blocking exclusion, non-critical warning inclusion, category 404 versus empty category, bounded query validation, projection/field non-leakage, and pagination totals.
4. Run Storefront component/route tests if the harness is approved: server-first initial request, image-alt fallback, empty/loading/error/not-found behavior, RTL keyboard navigation, and pagination links.
5. Manual API checks with a disposable/non-production database only: no draft/inactive/archived/unpublished/deleted/non-ready product is returned; valid category with no public products is `200` empty; invalid category is `404`; no price/Plus fields appear.
6. Manual browser checks: `/products`, valid category, invalid category, page bounds, desktop/tablet/mobile RTL layout, keyboard focus, screen-reader labels, metadata/canonical/robots behavior, and no disabled feature navigation leakage.
7. Re-run boundary scans for Prisma imports outside API, API-source imports outside API, `apps/web`/`@fardad/web`, plus unimplemented capability links. Finish with `git diff --check` and `git status --short`.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| No persisted/enforced public-read projection | Derive the explicit conservative lifecycle-plus-readiness predicate in one public service; later add an approved publication workflow/projection rather than duplicating it in clients. |
| Dynamic readiness creates N+1 or full-candidate pagination cost | Batch quality contexts and rules by category where possible; preserve exact totals; defer caching/materialization to an approved performance work order. |
| Opaque media reference is not a safe browser source | Block card-image implementation until the public media URL/path policy is confirmed; never expose private storage references. |
| No seed/catalog data or disposable DB verification | Do not seed in WO-009; require controlled test fixtures/DB in validation before release. |
| API has no current pagination/response convention | Limit this convention to public catalog, use validated DTOs and direct typed success payloads consistent with current controllers; do not refactor global errors. |
| Static category seed causes dead links | Use API category discovery and keep unresolved static children hidden. |

## Explicit Out-of-Scope Items

Product detail pages, shop alias, prices, inventory, labels, cart, checkout, orders, payments, shipping, discounts, gift boxes, add-on services, product configuration, search/full-text infrastructure, attribute filters, recommendations, reviews, wishlists, analytics, authentication, customer panel, CMS, admin management, navigation administration, API persistence/settings, Prisma/schema/migrations/seeds, worker, SaaS/multi-tenancy/marketplace/builder, dependencies, and package-version changes remain outside WO-009.

## Approval Gate

Before implementation, an authorized approver must resolve:

1. **Public media policy:** confirm `ProductMedia.mediaReference` is a safe public URL/path for browser delivery, or specify the approved existing media-resolution mechanism. Without this, cards must use an intentional no-image fallback and the main-image public transport field cannot be finalized.
2. **Interim public visibility policy:** approve the conservative lifecycle-plus-`isPublicationReady` predicate above as the public catalog rule until a later admin publication-transition workflow persists/enforces it.
3. **Runtime verification data:** provide/approve a disposable database with product/category/media data for endpoint verification. No production data, seed, or migration will be created by WO-009.

## Action Items

1. Confirm the public media-reference policy.
2. Approve the proposed public-visibility predicate and three endpoint paths.
3. Approve WO-009 implementation only after the gates above are resolved.
4. Keep product detail, shop alias, commerce, and Plus capabilities deferred after catalog delivery.
