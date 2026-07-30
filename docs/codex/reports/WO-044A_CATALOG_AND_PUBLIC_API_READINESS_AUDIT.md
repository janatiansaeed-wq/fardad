# WO-044A — Fardad Catalog & Public API Readiness Audit

**Audit date:** 2026-07-23
**Branch:** `architecture-refactor`
**Baseline commit:** `953a08ccd3b64ae397c8b12ac24bc5fa8158361a`
**Mode:** Read-only audit; no application code, configuration, schema, migration, seed,
dependency, lockfile, environment file, Git state, commit, or push was changed.

## 1. Executive decision

The repository has a substantial static catalog implementation, but it is **not
runtime-ready in the current checkout** and must not yet be treated as proof of a
real public catalog.

| Objective | Static capability | Runtime/data evidence in this audit | Readiness decision |
| --- | --- | --- | --- |
| Public products list | Implemented from Prisma repository through Nest GET endpoint, shared contract, server-only Storefront client, and `/products` SSR route | No API or PostgreSQL listener; no active environment files; direct HTTP probe timed out; business seed is empty | **Blocked for real data; compile-ready only** |
| Product detail | Implemented through `GET .../products/:slug`, detail contract, media resolver, metadata, loading/error/not-found states, and `/products/[slug]` | No verified product response or detail SSR against the API | **Blocked for runtime release** |
| Category navigation | `/products` already renders API-returned category slugs as links; category route and 404/empty behavior exist | Homepage categories are provisional labels with no slug/ID mapping; no category records were verified | **Catalog-page implementation exists; homepage navigation blocked** |
| Homepage featured products | `ProductLabelType.FEATURED` exists in Prisma/migration | No public featured query/endpoint/contract, no governed meaning/window/order, no homepage section, and no verified labeled records | **Not implemented** |

The highest-risk findings are:

1. **Prisma/migration nullability drift.** The canonical Prisma schema declares
   `ProductCategory.name` required and `Product.name` optional. The only product-domain
   migration creates `product_categories.name` nullable and `products.name` `NOT NULL`;
   no later migration alters either column. `prisma validate` checks the schema file but
   does not prove migration history converges to it.
2. **No real catalog data path is operational.** `apps/api/prisma/seed.ts` intentionally
   exports nothing, there is no category management service/controller, the product DTOs
   are unused by any product mutation service/controller, and no approved catalog fixture
   or active environment file exists.
3. **No HTTP/SSR catalog success was verified.** Ports 4000 and 5432 were not listening,
   Docker Desktop's daemon was unavailable, and
   `GET http://localhost:4000/api/v1/public/catalog/categories` timed out.
4. **Public response trust is compile-time only.** The Storefront casts
   `response.json()` to generic TypeScript types without runtime validation. The API
   separately duplicates its response types instead of compiling its return values
   directly against the shared contract.
5. **Homepage category labels cannot safely become links.** They contain display labels
   only. Inferring/transliterating Persian slugs is neither approved nor safe.
6. **Featured selection is only a persistence hint.** A `FEATURED` label exists, but
   public semantics, eligibility, deterministic merchandising order, effective dates,
   and an endpoint do not.

The current `/products` recovery remains a valid fail-closed demo behavior: only a known
`PublicCatalogRequestError` is converted to the existing no-products state, categories
become an empty array, and no product/category facts or links are fabricated. It is not,
however, production availability evidence and it does not distinguish an upstream outage
from a genuinely empty catalog.

## 2. Audit scope and evidence boundary

Inspected:

- `apps/api/prisma/schema.prisma`, all six migrations, and
  `apps/api/prisma/seed.ts`;
- Product, Product Data Quality, Media, Public Catalog, Commerce, and Store Context
  repositories/services/controllers;
- public catalog and public commerce DTOs and shared contracts;
- Storefront API clients, catalog/detail/category routes, metadata, components, and
  loading/error/empty/not-found states;
- active environment-file presence and example variable names without reading or
  exposing any secret;
- package scripts, local process/port state, Docker availability, tests, and TypeScript
  configuration.

No claim in this report treats compilation, Prisma schema validation, or historical
reports as current HTTP success. Current runtime success would require a reachable
approved database, applied migrations, a matching active Store, real publishable catalog
records, a running API, and HTTP/SSR evidence.

## 3. Exact current data flow

```text
PostgreSQL
  product_categories
  products
  product_media -> media_assets -> media_renditions
  product_checklist_rules/statuses + attributes + logistics
  product_offers + stores (detail purchasing option only)
        |
        v
PrismaService (apps/api only)
        |
        +--> PublicCatalogRepository
        |      - active category filter/order
        |      - product lifecycle filter/order
        |      - minimal explicit selects
        |
        +--> ProductRepository -> ProductDataQualityService
        |      - critical publication-readiness checks
        |
        +--> MediaRepository -> PublicMediaResolverService
        |      - fail-closed browser-safe rendition URL mapping
        |
        +--> CommerceRepository -> CommerceService
               - active/effective Store-scoped offer for detail purchase data
        |
        v
NestJS controllers under /api/v1
  /public/catalog/*
  /public/commerce/products/:slug/purchasing-option
  /public/media/*
        |
        v
Storefront server-only fetch clients
  src/lib/api/public-catalog.ts (60-second revalidation)
  src/lib/api/public-commerce.ts (no-store)
        |
        v
Next.js App Router SSR
  /products
  /products/category/[slug]
  /products/[slug]
        |
        v
CategoryDiscovery / ProductGrid / ProductCard / ProductDetail
```

### 3.1 Database to catalog repository

Public product eligibility is:

```text
Product.deletedAt IS NULL
Product.status = ACTIVE
Product.publicationState = PUBLISHED
Product.publishedAt IS NOT NULL AND <= now
Product.category exists
ProductCategory.deletedAt IS NULL
ProductCategory.isActive = true
ProductDataQualityService.evaluate(product.id).isPublicationReady = true
```

The readiness evaluator blocks a product when any active required **critical** rule is
missing. Current critical checks include product name, slug, short description, full
description, active category, required category attributes, and a `MAIN_IMAGE`
association. It does not prove that the main image has a linked public Media Asset or a
resolvable rendition; media resolution can still return `null`.

Category discovery filters only `isActive = true` and `deletedAt IS NULL`. Categories do
not have a separate publication state or publish date.

### 3.2 Repository to API mapping

The repository uses explicit Prisma selections. Internal product UUIDs are selected only
for readiness evaluation and are not mapped to public JSON. Internal category IDs,
lifecycle enums, readiness output, raw media references, labels, attributes, logistics,
and persistence timestamps are not returned.

Ordering is currently:

- categories: `sortOrder ASC`, then `name ASC`;
- products: `publishedAt DESC`, then `slug ASC`;
- selected media: `sortOrder ASC`, then `id ASC`;
- page size: fixed at 12 after readiness filtering.

The products query loads every lifecycle-eligible candidate, runs readiness evaluation
per candidate, then paginates in memory. This preserves exact public totals but creates a
query/latency scaling risk and is unsuitable as the basis of an unbounded homepage
featured scan.

### 3.3 API to Storefront

`apps/storefront/src/lib/api/public-catalog.ts` is server-only and fetches from:

```text
STOREFRONT_API_BASE_URL
or fallback http://localhost:4000/api/v1
```

Catalog requests use 60-second Next revalidation/tags. HTTP 404 becomes
`PublicCatalogNotFoundError`; transport and other non-2xx responses become
`PublicCatalogRequestError`.

The `/products` route catches only `PublicCatalogRequestError` and renders the existing
empty state with no categories. Category and detail routes map API 404 to `notFound()`;
other failures reach route-local retry error boundaries.

The detail route separately requests a purchasing option when `catalog.shop` is
published. That call exposes real offer price/availability only on the detail page. Its
failure is reduced to `null`, which produces the unavailable purchase presentation.

## 4. Available endpoints and response shapes

These shapes are **verified statically** against controllers, service mapping, and shared
contracts. They were **not verified by live HTTP in this audit**.

### 4.1 Public catalog

| Method and path | Status behavior from code | Static response shape |
| --- | --- | --- |
| `GET /api/v1/public/catalog/categories` | `200`; database/runtime failures propagate | `PublicCategorySummary[]` |
| `GET /api/v1/public/catalog/products?page=1` | `200`; `page` must be integer 1–1000; out-of-range/unknown query rejected by global validation | `PublicProductListResponse` |
| `GET /api/v1/public/catalog/products/:slug` | `200`; `404` if absent, lifecycle-ineligible, not publication-ready, or incomplete during mapping; slug must match lowercase ASCII kebab-case | `PublicProductDetail` |
| `GET /api/v1/public/catalog/categories/:slug/products?page=1` | `404` for absent/inactive/deleted category; `200` empty list for valid category without public products; same page/slug validation | `PublicProductListResponse` with `category` |

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
  category: { name: string; slug: string };
  image: { src: string; alt: string } | null;
};

type PublicProductListResponse = {
  category?: PublicCategorySummary;
  items: PublicProductCard[];
  pagination: {
    page: number;
    pageSize: 12;
    totalItems: number;
    totalPages: number;
  };
};

type PublicProductDetail = {
  name: string;
  englishName?: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: { name: string; slug: string };
  mainImage: { src: string; alt: string } | null;
  gallery: Array<{ src: string; alt: string }>;
  seo: { title?: string; description?: string };
};
```

### 4.2 Related detail-commerce and media endpoints

| Method and path | Purpose | Shape/behavior |
| --- | --- | --- |
| `GET /api/v1/public/commerce/products/:slug/purchasing-option` | Detail-only Store-scoped offer | `{ productSlug, mode, availability, price, quantity }`; `price` is `{ amount: decimal-integer string, currency: "IRR" } \| null` |
| `GET /api/v1/public/media/:publicId/v/:contentVersion/:variant` | Local-development rendition delivery | Streams an approved image only in development/local mode; otherwise 404 |

`availability` is `available-to-order | unavailable`; it is not physical stock.
`quantity.max` is an offer/store policy bound; it is not an inventory count.

### 4.3 Response-contract risks

- The API defines catalog response types locally while the Storefront consumes separate
  shared types. There is no direct compile-time assertion that the two remain identical.
- The Storefront's `response.json() as T` provides no runtime shape validation.
- The database does not constrain category or product slugs to the public DTO's ASCII
  kebab-case regex. Product create/update DTOs contain the regex, but those DTOs have no
  active mutation path; no category creation DTO/service exists.
- `GET categories` can therefore return a stored slug that its own category-route DTO
  later rejects with 400.
- The migration allows `product_categories.name` to be null although the Prisma model,
  local API type, shared contract, ordering, and UI assume a string.

## 5. Schema, migration, seed, and data-authoring findings

### 5.1 Confirmed persistence fields

**Category**

- UUID `id`;
- unique string `slug`;
- `name`, optional description, optional parent;
- `sortOrder`, `isActive`, soft deletion timestamps;
- category attribute requirements and checklist rules.

There is no category media/image relation, category publication state, public visibility
window, product count projection, or featured-category flag.

**Product**

- UUID `id`;
- optional Prisma fields for name, English name, slug, descriptions, product type, level,
  SEO, category, and publish date;
- lifecycle: status, publication state, publish date, soft deletion;
- labels including `FEATURED`;
- ordered typed Product Media;
- attributes, checklist status, logistics, Product Experience relations, and offers.

**Commerce**

- Store-scoped, versioned, effective-dated Product Offer;
- sales mode, availability, IRR price, min/max quantity;
- no inventory, stock ledger, reservation, warehouse, or on-hand quantity model.

### 5.2 Migration drift

| Field | Canonical Prisma schema | Applied by migration history | Risk |
| --- | --- | --- | --- |
| `ProductCategory.name` | `String` (required) | `VARCHAR(255)` nullable | Null can violate ordering, API contract, and UI assumptions |
| `Product.name` | `String?` (optional for incomplete domain records) | `VARCHAR(255) NOT NULL` | Fresh migrated DB cannot persist the incomplete state represented by Prisma/DTOs |

No migration contains `ALTER COLUMN`, `SET NOT NULL`, or `DROP NOT NULL` for these fields.
This must be reconciled before migration status or runtime data behavior can be accepted.

### 5.3 Data availability and authoring

- `apps/api/prisma/seed.ts` explicitly contains no business seed data.
- Product domain DTOs exist, but no controller/service/repository uses
  `CreateProductDto` or `UpdateProductDto`.
- No category create/update path exists.
- The Commerce Store bootstrap is separate and writes a fixed active Store; it does not
  create categories, products, media, labels, or offers.
- No approved catalog fixture, real catalog import, or active local database was found.

Therefore schema capability does not establish the existence, provenance, or correctness
of any real Fardad category or product.

## 6. Required public fields

Status legend:

- **Confirmed:** represented and explicitly mapped at the stated boundary.
- **Conditional:** represented but may legally be absent/null or depends on another
  endpoint/runtime subsystem.
- **Missing:** not present at the required public boundary.
- **Blocked:** representation exists, but real data/runtime integrity is unverified.

### 6.1 Category card

| Required field/behavior | Source | Public API | Status | Finding |
| --- | --- | --- | --- | --- |
| Stable key | `ProductCategory.id` / `slug` | slug only | **Blocked** | UUID intentionally hidden; real slug values not verified |
| Display name | `name` | `name` | **Blocked** | Contract confirmed; migration permits null |
| Destination | `/products/category/{slug}` | derived from slug | **Confirmed in code** | Route exists; homepage labels lack mapping |
| Description | optional `description` | optional | **Conditional** | Sufficient for text cards/metadata |
| Display order | `sortOrder`, then name | order applied, value hidden | **Confirmed in code** | Deterministic API order |
| Active/public state | `isActive`, `deletedAt` | filtered, hidden | **Confirmed in code** | No separate category publication workflow |
| Image + alt | no category media model | absent | **Missing** | Image-led category cards are unsupported |
| Product count | derivable only by expensive readiness scan | absent | **Missing** | Must not be inferred |
| Homepage mapping | provisional config labels only | none | **Missing** | No label-to-slug/ID binding |

### 6.2 Product card

| Required field/behavior | Source | Public API | Status | Finding |
| --- | --- | --- | --- | --- |
| Name | `Product.name` | `name` | **Blocked** | Readiness requires non-empty; real record unverified |
| Stable destination slug | `Product.slug` | `slug` | **Blocked** | DTO regex exists; no real data evidence |
| Short description | `shortDescription` | mapped | **Blocked** | Readiness requires it |
| Category name/slug | relation | mapped | **Blocked** | Category migration/name and slug integrity issues apply |
| Card image src/alt | main Product Media + CARD rendition | nullable mapped image | **Conditional** | Resolver fails closed; readiness does not prove resolvable rendition |
| Publication eligibility | lifecycle + quality evaluation | filtered, hidden | **Confirmed in code** | Correct fail-closed policy; no runtime proof |
| List order | `publishedAt DESC`, `slug ASC` | response order | **Confirmed in code** | Not a merchandising/featured order |
| Price | Product Offer | absent from catalog card | **Missing** | Available only through per-product commerce endpoint |
| Availability | Product Offer | absent from catalog card | **Missing** | Detail endpoint only |
| Stock | no inventory model | absent | **Missing** | Availability must not be presented as stock |
| Featured state/order | Product Label exists | absent | **Missing** | No public selection or ordering contract |

### 6.3 Product detail

| Required field/behavior | Source | Public API | Status | Finding |
| --- | --- | --- | --- | --- |
| Name and optional English name | Product | mapped | **Blocked** | Static mapping only |
| Slug | Product | mapped | **Blocked** | Static mapping only |
| Short/full description | Product | mapped | **Blocked** | Required by detail mapper/readiness |
| Category name/slug | Product Category | mapped | **Blocked** | Migration/slug integrity risks |
| Main image | Product Media + DETAIL rendition | nullable | **Conditional** | Fallback UI exists |
| Ordered gallery | gallery media + GALLERY renditions | array | **Conditional** | Unresolvable media omitted |
| Image alt | media alt or product name fallback | mapped | **Confirmed in code** | Quality alt rule is non-critical |
| SEO title/description | Product metadata | optional | **Conditional** | Falls back to product name/short description |
| Price/sales mode/availability | effective Product Offer | separate endpoint | **Conditional** | Requires active Store and published shop capability |
| Quantity bounds | Product Offer + Store | separate endpoint | **Conditional** | Policy bounds, not inventory |
| Stock | no inventory model | absent | **Missing** | Cannot claim “in stock” or stock count |
| Attributes/specifications | represented internally | absent | **Missing by approved design** | Public visibility/formatting contract not approved |

## 7. Storefront route-state audit

| Route | Loading | Error | Empty | Not found | Current honesty/readiness |
| --- | --- | --- | --- | --- | --- |
| `/products` | Accessible skeleton/status | Route-local retry exists for uncaught errors | Valid empty and API-unavailable both render the same no-products state | Not applicable | Fail-closed demo behavior; outage is not distinguishable from empty |
| `/products/category/[slug]` | Reuses catalog loading | Route-local category retry | Valid active category with zero publishable products has a category-specific empty heading | API 404 calls `notFound()` | Structurally complete; no live category verified |
| `/products/[slug]` | Detail skeleton/status | Route-local detail retry | No separate empty state, appropriately | API 404/readiness failure calls `notFound()` | Structurally complete; no live detail verified |

Additional findings:

- Product cards link to encoded `/products/{slug}`.
- API-derived category chips and detail breadcrumbs link to encoded category routes.
- Metadata uses product SEO fallbacks and category descriptions/templates.
- Page 1 is indexable; later catalog pages are `noindex, follow`.
- No route imports Prisma or backend source directly.
- Homepage `Categories` intentionally renders `ul/li/h3` cards with no `Link`, button,
  `href`, or inferred slug.

## 8. Local API and environment readiness

### 8.1 Current machine evidence

| Check | Result |
| --- | --- |
| Active `.env*` files in root/API/Storefront | None; only three `.env.example` files |
| Port 3000 | Not listening |
| Port 4000 | Not listening |
| Port 5432 | Not listening |
| Port 6379 | Not listening |
| Catalog category HTTP probe | Timed out; no response shape/status verified |
| Docker CLI | Installed |
| Docker daemon | Unavailable |
| Compose manifest in repository | Not found |
| Node | `v24.18.0` |
| Corepack | `0.35.0` |

### 8.2 Required API environment

The API parses all of these at module import/startup, even for catalog-only use:

- `DATABASE_URL`;
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`;
- `COMMERCE_STORE_KEY`, `COMMERCE_BFF_SHARED_SECRET`;
- optional/defaulted auth TTL/lock values, `API_PORT`, and `NODE_ENV`;
- optional media mode/root/origin values.

Media behavior:

- default/disabled mode returns null image descriptors;
- local mode requires development, an absolute local media root, and an exact loopback
  public origin;
- public mode requires HTTPS;
- the Storefront separately requires a matching approved `STOREFRONT_MEDIA_ORIGIN` to
  permit Next Image remote paths.

The API also constructs `StoreContextService` on module initialization. Startup fails
unless `COMMERCE_STORE_KEY` resolves to an active IRR Store. A migrated database alone is
not sufficient.

### 8.3 Is the local API runnable?

**As checked now: no.** The repository has compile-valid API source, but this checkout has
no active environment file, no listening PostgreSQL service, no running Docker daemon, no
verified applied migrations, no verified active Store, and no catalog records.

Once an approved non-production PostgreSQL database is already migrated, the required
active Store already exists, and required values are supplied through a secure process
environment, the exact non-migrating API start command is:

```powershell
corepack pnpm --filter @fardad/api dev
```

This is the safe start command because it does not itself run migrations, bootstrap a
Store, seed products, or invent data. It must not be represented as sufficient setup.
`db:migrate:deploy` and `commerce:bootstrap-store` both mutate the database and require
separate authorization/environment preparation; neither was run in this audit.

The matching Storefront expects:

```text
STOREFRONT_API_BASE_URL=http://localhost:4000/api/v1
```

plus matching server-only commerce binding/secret and, if real media is enabled, an exact
approved media origin. Values must come from a secure environment and must not be
committed.

## 9. Tests and validation

### 9.1 Existing coverage

- API unit tests cover Commerce BFF proof, Cart/controller behavior, Store Context,
  Commerce Service, offer policy, money, rate limiting, and migration structure.
- Storefront tests cover the server-only commerce boundary, cookie policy, capability
  gating, Cart route states, client/server separation, and the deliberate absence of
  price/availability/stock/cart fields from catalog contracts.
- There are **no focused Public Catalog repository/service/controller tests**, no public
  catalog HTTP integration tests, no response-key/runtime-schema tests, and no Storefront
  list/category/detail route tests against controlled API responses.

The normal API `test` script first emits compiled test files into `.test-dist`; it was not
run because this work order allows only read-only checks. The already-read-only `.cjs`
structure tests were run directly.

### 9.2 Commands run and results

| Read-only command/check | Result |
| --- | --- |
| API TypeScript: local `tsc -p apps/api/tsconfig.json --noEmit --incremental false` | Pass |
| Storefront TypeScript: local `tsc -p apps/storefront/tsconfig.json --noEmit --incremental false` | Pass |
| API ESLint with `--no-cache` | Pass |
| Storefront ESLint with `--no-cache` | Pass |
| `corepack pnpm --filter @fardad/api exec prisma validate --schema prisma/schema.prisma` with process-only placeholder URL | Pass; syntax/schema only, no DB connection |
| `node --test apps/api/test/*.test.cjs` | Pass, 5/5 |
| `node --test apps/storefront/test/*.test.mjs` | Pass, 6/6 |
| Active env-file name scan | Only example files found |
| Port/API probe | No listeners; HTTP unavailable |
| Catalog-focused test search | Only Storefront contract-absence assertion found |

No build was run because Next/Nest builds emit `.next`/`dist` artifacts and were
unnecessary for this read-only readiness decision. No database status command was run
because there was no approved/reachable database URL.

## 10. Blockers

### 10.1 Clickable homepage categories

1. Six homepage items are provisional display labels only; they have no category ID or
   slug.
2. No real API category records or homepage-to-record mapping were verified.
3. Inferring or transliterating Persian slugs is prohibited and would bypass source
   ownership.
4. Stored category slug validity is not enforced by the database/data-authoring path,
   while public route DTOs enforce ASCII kebab-case.
5. Category name nullability differs between Prisma and migration history.
6. No HTTP/SSR evidence proves any exact category destination returns 200.
7. The categories endpoint may intentionally return active categories with zero
   publishable products; the homepage inclusion policy is not defined.
8. If visual category cards require images, the category model and public contract have
   none.

### 10.2 Real product list/detail

1. No approved catalog data source, seed, admin mutation, or import path is operational.
2. No approved/reachable database or migration-status evidence exists.
3. API startup additionally requires a pre-existing active IRR Store.
4. Schema/migration nullability drift is unresolved.
5. No live endpoint response or Storefront SSR page against real API data was verified.
6. Storefront/API response shapes lack runtime validation.
7. Publication readiness can pass with a main-media association whose public rendition
   does not resolve; images are therefore legitimately nullable.
8. The root products page deliberately masks known upstream failure as the demo empty
   state; production observability/state distinction remains missing.

### 10.3 Featured products

1. `FEATURED` has no approved public meaning, localization, evidence/owner, effective
   window, expiry, or revocation behavior.
2. Public catalog queries do not select or filter labels.
3. No featured endpoint or shared response contract exists.
4. There is no deterministic featured merchandising order/priority.
5. A full current catalog readiness scan would be unnecessarily expensive for a small
   homepage section.
6. Product-card price/availability are intentionally absent; stock does not exist.
7. No real labeled products, browser-safe media, or homepage empty/unavailable policy was
   verified.

## 11. Minimal ordered proposal

These proposals are recommendations only. They are not authorization to implement.

### WO-044B — Catalog Runtime, Migration, and Public Contract Hardening

**Scope**

1. Reconcile canonical Prisma/migration nullability and prove a blank approved
   non-production database migrates to the canonical schema without drift.
2. Define and enforce one slug policy at data ingress and public response boundaries for
   both products and categories.
3. Establish an approved real catalog data-authoring/import source; do not add demo
   products, fake offers, or inferred slugs.
4. Make API/shared catalog shapes non-drifting and add runtime response validation at the
   Storefront boundary or an equivalent fail-closed mechanism.
5. Add focused repository/service/controller and HTTP integration coverage for the four
   existing catalog endpoints, including media fail-closed behavior.
6. Verify startup against the approved database, active Store, and media mode.

**Acceptance criteria**

- Prisma schema, full migration history, and migrated database agree on every
  catalog-critical column.
- Fresh migration deploy and migration status pass on an approved disposable/non-prod
  database.
- API starts with secure environment injection and a matching active IRR Store.
- Approved real categories/products—not repository demo seed data—exist and their
  provenance is documented.
- All returned slugs satisfy the same route policy; invalid stored values cannot produce
  public links.
- Exact HTTP responses match the approved public keys and omit UUIDs, raw enums,
  readiness, raw media references, internal labels, logistics, and other private fields.
- Media failure produces `image: null`/omitted gallery entries, never raw storage paths.
- No API success is claimed without recorded HTTP evidence.

**Required tests**

- Blank-database migration deploy plus schema-drift check.
- Category 200/order, invalid slug 400, inactive/deleted/absent 404 behavior.
- Product list lifecycle/readiness filtering, exact totals, page 1/last/beyond-last, and
  fixed page size.
- Detail 200 and 404 for every fail-closed lifecycle/readiness case.
- Null/blank/invalid category and product field rejection.
- Exact response-key allowlist and Storefront runtime-decoder rejection tests.
- Media disabled/unresolvable/valid rendition cases.

### WO-044C — Honest Storefront Catalog and Verified Category Navigation

**Depends on:** WO-044B runtime/contract acceptance.

**Scope**

1. Preserve distinct `success-empty`, `not-found`, and `upstream-unavailable` states;
   keep all unavailable behavior free of fabricated catalog facts.
2. Replace homepage label-only category cards with either API-owned category summaries or
   an explicit product-owner-approved label-to-record mapping.
3. Link only categories whose exact slug came from the verified source; never infer a
   Persian slug.
4. Define whether active zero-product categories appear on the homepage.
5. Keep text-only cards unless a separately approved category-media contract exists.

**Acceptance criteria**

- Every visible homepage category link uses a verified API slug and has an owner-approved
  label/mapping.
- No homepage category link is rendered when the API/mapping is unavailable or invalid.
- Each rendered destination has HTTP/SSR 200 evidence; invalid/inactive destinations
  produce the approved 404 behavior.
- `/products` distinguishes real empty data from upstream unavailability with honest
  Persian copy and correct monitoring/error behavior.
- Valid empty categories use the approved empty state; no counts, products, images,
  prices, stock, or availability are inferred.
- RTL, keyboard focus, semantic list/link structure, 320px layout, 200% zoom, and
  reduced-motion behavior pass.

**Required tests**

- Storefront client decoder: success, malformed JSON, 404, 5xx, and network failure.
- SSR route tests for list success/empty/unavailable, category success/empty/404/error,
  and product detail success/404/error.
- Homepage mapping allowlist tests proving no slug generation/transliteration.
- Link destination HTTP assertions for every rendered category.
- Accessibility and responsive browser tests at desktop, 320px, keyboard-only, and 200%
  zoom.

### WO-044D — Governed Featured Products Public Projection and Homepage Section

**Depends on:** WO-044B and WO-044C acceptance.

**Scope**

1. Approve the public semantics and ownership of featured selection, including start/end
   or revocation policy and deterministic order.
2. Add a bounded backend featured projection/endpoint that reuses the existing public
   product-card shape and the same lifecycle/readiness/media policy.
3. Query only the approved featured candidate set and enforce a small server-owned limit;
   do not scan or return the full catalog to the homepage.
4. Render a homepage section only from verified real responses. Omit/fail closed on empty
   or unavailable according to approved copy.
5. Do not add price, discount, availability, stock, badges, or purchase claims unless a
   separately approved public contract supplies them.

**Acceptance criteria**

- Featured membership has a named data owner, approved source, deterministic priority,
  and effective/revocation behavior.
- Only lifecycle-eligible and publication-ready featured products are returned.
- Response limit/order are server-owned and deterministic.
- Response reuses the exact public card contract and contains no internal label enum or
  persistence identifiers.
- Homepage renders only real products and real resolvable media or the already-approved
  nullable-image fallback.
- Empty/unavailable featured data creates no placeholder products or claims.

**Required tests**

- Featured membership, order, limit, lifecycle/readiness exclusion, and expiry/revocation
  tests.
- Exact response-key and no-leakage tests.
- Media valid/null cases.
- Homepage SSR success, empty, malformed, and unavailable cases.
- Product-card destination HTTP assertions and RTL/accessibility/responsive browser tests.

## 12. Git baseline before and after

### Before audit

```text
branch: architecture-refactor
HEAD:   953a08ccd3b64ae397c8b12ac24bc5fa8158361a

 M apps/storefront/app/(public)/products/page.tsx
 M apps/storefront/app/globals.css
 M apps/storefront/components/home/Categories.tsx
 M apps/storefront/components/home/Features.tsx
 M apps/storefront/components/home/Hero.tsx
 M apps/storefront/components/layout/MobileNavigation.tsx
 M apps/storefront/components/layout/StorefrontHeader.tsx
 M apps/storefront/src/config/brands/fardad/content.fa.ts
 M apps/storefront/src/config/brands/fardad/experience-profile.ts
 M apps/storefront/src/config/brands/fardad/index.ts
 M apps/storefront/src/themes/presets/luxury-heritage.ts
?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
?? docs/codex/reports/WO-043B-1_FARDAD_VISUAL_FOUNDATION_REPORT.md
?? docs/codex/reports/WO-043B-2_FARDAD_RTL_TYPOGRAPHY_AND_BASE_RHYTHM_REPORT.md
?? docs/codex/reports/WO-043B-3_FARDAD_HEADER_AND_NAVIGATION_REPORT.md
?? docs/codex/reports/WO-043B-4_FARDAD_HEADER_NAVIGATION_ACCESSIBILITY_VERIFICATION_REPORT.md
?? docs/codex/reports/WO-043C_FARDAD_HOMEPAGE_HERO_REPORT.md
?? docs/codex/reports/WO-043D_PRODUCTS_ROUTE_RECOVERY_REPORT.md
?? docs/codex/reports/WO-043E_FARDAD_HOMEPAGE_VALUE_PROPOSITION_REPORT.md
?? docs/codex/reports/WO-043F_FARDAD_HOMEPAGE_CATEGORIES_REPORT.md
?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
```

All entries above pre-existed WO-044A and were preserved.

### After audit

The actual final delta is the baseline above plus exactly:

```text
?? docs/codex/reports/WO-044A_CATALOG_AND_PUBLIC_API_READINESS_AUDIT.md
```

Final verification:

- `git diff --check`: pass with no output;
- `git status --short`: the pre-existing baseline plus only the WO-044A report;
- branch: unchanged at `architecture-refactor`;
- HEAD: unchanged at `953a08ccd3b64ae397c8b12ac24bc5fa8158361a`.

No application/config/schema/migration/seed/dependency/lockfile/env path was changed by
WO-044A.

## 13. Final audit verdict

The repository is **architecturally close but operationally unproven** for catalog list,
category list, category-product list, and product detail. It has the correct high-level
database → API → server-only Storefront separation and intentionally narrow public
contracts. It cannot safely publish real homepage category links or featured products
until migration drift, catalog data provenance/ingress, slug integrity, runtime contract
validation, an approved running database/API, and HTTP/SSR evidence are completed in the
ordered follow-up work.

Until then:

- retain non-interactive homepage categories;
- retain honest no-fabrication behavior on `/products`;
- do not create demo products or infer Persian slugs;
- do not present offer availability as stock;
- do not expose `FEATURED` merely because the enum exists; and
- do not claim catalog/API success from typecheck, lint, schema validation, or source
  inspection alone.
