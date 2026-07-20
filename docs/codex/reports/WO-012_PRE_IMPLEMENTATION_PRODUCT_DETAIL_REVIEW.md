# WO-012 Pre-Implementation Product Detail Review

> Project: Fardad Enterprise Platform
>
> Work order: WO-012 — Public Product Detail API & Storefront Product Page
>
> Phase: Pre-Implementation Architecture Review
>
> Status: READY WITH BLOCKERS
>
> Review date: 2026-07-20
>
> Change scope: Documentation only

## Executive Summary

The first public product-detail capability can be implemented without a Prisma schema or migration change. It belongs inside the existing `PublicCatalogModule`, reuses the exact WO-009 lifecycle-plus-publication-readiness policy, extends the closed WO-010 Media resolver purposes to existing `DETAIL` and `GALLERY` renditions, and adds one Server Component route at `/products/[slug]` through the existing Storefront HTTP boundary.

The recommended public API is:

```text
GET /api/v1/public/catalog/products/:slug
```

The first detail contract should include only product name, optional English name, slug, short/full plain-text descriptions, active category name/slug, optional mapped SEO title/description, one nullable `{ src, alt }` main image, and an ordered `{ src, alt }[]` gallery. Product attributes, labels, product level, product type, publication date, and every commerce, Product Experience, quality, lifecycle, audit, logistics, persistence, and raw Media field remain absent.

Implementation is **READY WITH BLOCKERS**. The API/page architecture is actionable after explicit approval. A complete production SEO release remains blocked by an approved canonical Storefront origin, and non-null detail/gallery runtime behavior requires approved linked public Media records and eligible renditions. Neither blocker requires a WO-012 schema change: canonical URL fields and JSON-LD must fail closed/omit until approved, while missing or unsafe media must render the intentional fallback.

## Repository and Branch State

The required repository checks were run before this report was created:

```text
$ git status --short
(no output)

$ git branch --show-current
architecture-refactor

$ git log -1 --oneline --decorate
7bdc806 (HEAD -> architecture-refactor, origin/architecture-refactor) Add reusable brand adaptation framework
```

WO-008 through WO-011 are committed in the reviewed checkout. The initial working tree was clean. This report is the only file created by the WO-012 review; no application, shared package, Prisma, migration, configuration, dependency, or Git-history file was modified.

## WO-005 Compatibility

WO-005 provides all Product-domain fields and the publication-readiness authority required for the first detail endpoint. `ProductDataQualityService.evaluate(product.id)` derives readiness from current database state and active checklist rules; there is no manually trusted public-ready flag.

Critical readiness checks include product name, slug, short description, full description, active category, category-required attribute completion, and a main-image association. WO-006 also added critical logistics completeness rules to the same evaluator. Product detail must invoke this evaluator unchanged even though attributes, logistics, and quality results are never transported publicly.

The repository query may select the internal product UUID solely to call the evaluator. The UUID must not enter the mapped response, logs, error text, Storefront contract, metadata, or URL.

## WO-009 Public Visibility Reuse

The existing WO-009 policy remains authoritative and must not be reimplemented in the Storefront or controller. A detail candidate is lifecycle-eligible only when the repository query proves all of the following at the time of lookup:

```text
deletedAt = null
status = ACTIVE
publicationState = PUBLISHED
publishedAt IS NOT NULL
publishedAt <= now
category.deletedAt = null
category.isActive = true
slug = requested slug
```

The service must then call `ProductDataQualityService.evaluate(candidate.id)` and return the product only when `isPublicationReady === true`. A missing candidate, inactive/deleted category, draft/inactive/archived/deleted/unpublished/future product, evaluator race/not-found, non-ready result, or defensive public-mapping failure must produce the same generic `NotFoundException("Product not found")` response. No response may distinguish “exists but private,” “incomplete,” “future,” “invalid category,” or any quality failure.

Database/query failures are server errors rather than fabricated 404s. They must remain generic and must not be converted into an empty or fake product.

## WO-010 Media Compatibility

WO-010 already provides the required registry, safe descriptor, batch resolver, and development delivery route. No Media schema, registry, storage adapter, controller route, provider, public origin, or Next remote pattern needs redesign.

The binary controller already allowlists `card`, `gallery`, `detail`, and `thumbnail` paths and maps them to the existing rendition enum. The exported resolver currently accepts only the `card` purpose; WO-012 should extend its closed `PublicMediaPurpose` and `renditionByPurpose` mapping to `gallery` and `detail`. It must not accept caller-supplied variants or arbitrary URLs.

Legacy/unlinked ProductMedia rows remain compatible. `mediaAssetId` is the explicit link indicator. An unlinked, malformed, private, deleted, non-ready, disabled, wrong-MIME, oversized, missing-current-rendition, or otherwise unsafe media reference resolves to null. No raw `mediaReference`, Media Asset ID, public ID, content version, storage key, checksum, status, dimension, provider field, or failure reason enters public transport.

The existing Storefront `next.config.ts` pattern already permits the exact configured `/api/v1/public/media/**` path (through the configured origin base path) and therefore covers fixed `detail` and `gallery` URLs without broadening host or pathname rules.

## WO-011 Brand/Experience Compatibility

The page remains inside the one Fardad Storefront and consumes `getStorefrontProfile()` for localized content, direction, semantic tokens, density, and existing Experience decisions. Product-detail labels, loading/error text, media-fallback text, breadcrumb labels, and section headings should be added to the app-owned Localized Content Profile contract/value—not hard-coded into shared UI.

No Brand, Theme Preset, font, logo, palette, contact, domain, or final visual change is required. The first product-detail composition should be a fixed app-owned accessible layout using current semantic variables; it does not need a new customer-selectable Experience variant. Fardad identity/content remain provisional under WO-011.

## Existing Product Field Classification

| Schema/source field                                                  | Classification                         | Public mapping and rationale                                                                                                                        |
| -------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Product.name`                                                       | **Include now**                        | Required by readiness; map as non-empty `name`.                                                                                                     |
| `Product.englishName`                                                | **Include now, optional**              | Plain editorial product content; trim and omit when blank. Never use as an identifier.                                                              |
| `Product.slug`                                                       | **Include now**                        | Validated public identifier and route segment; never return UUID.                                                                                   |
| `Product.shortDescription`                                           | **Include now**                        | Required by readiness; map as plain text and use as SEO fallback.                                                                                   |
| `Product.description`                                                | **Include now**                        | Required by readiness; render as text with preserved line breaks, never executable HTML.                                                            |
| `Product.metaTitle`                                                  | **Include now, optional mapped field** | Map to `seo.title`; non-critical quality rule means fallback to `name` when missing/blank.                                                          |
| `Product.metaDescription`                                            | **Include now, optional mapped field** | Map to `seo.description`; fall back to `shortDescription`.                                                                                          |
| Active `ProductCategory.name`                                        | **Include now**                        | Customer-facing category context.                                                                                                                   |
| Active `ProductCategory.slug`                                        | **Include now**                        | Safe category-link route value.                                                                                                                     |
| `ProductCategory.description`                                        | **Defer**                              | Not required by detail UI; data minimization favors name/slug. Already available from category endpoints if later justified.                        |
| `Product.productType`                                                | **Defer**                              | Free-form internal string with no approved public taxonomy/localized mapping.                                                                       |
| `Product.level`                                                      | **Defer**                              | Administrative enum has no approved public meaning/localization.                                                                                    |
| `Product.labels`                                                     | **Defer**                              | Mixed merchandising/internal enum; no public-visibility or approval rule.                                                                           |
| `Product.attributeValues` and definitions                            | **Defer**                              | No public visibility flag, option-label model, locale, or safe enum/unit mapping.                                                                   |
| `Product.publishedAt`                                                | **Defer**                              | No current customer/SEO requirement; exposing a lifecycle timestamp is unnecessary. A future public `publishedOn` mapping needs editorial approval. |
| `ProductMedia` main association                                      | **Include mapped only**                | One nullable safe descriptor from the first ordered `MAIN_IMAGE`, resolved for `detail`.                                                            |
| `ProductMedia` gallery associations                                  | **Include mapped only**                | Ordered safe descriptors from `GALLERY_IMAGE`, resolved for `gallery`; failed items omitted.                                                        |
| Detail/packaging/lifestyle/video associations                        | **Defer/prohibit in WO-012 output**    | Not required for the first gallery and may need distinct semantics or video safety.                                                                 |
| Product IDs/category IDs/attribute IDs/Media IDs                     | **Prohibit**                           | Persistence/internal identifiers.                                                                                                                   |
| Lifecycle, quality, audit, checklist, logistics, extension relations | **Prohibit**                           | Internal business/readiness data; Plus/commerce scope.                                                                                              |

## Public Detail Contract Proposal

The framework- and provider-independent contract should be added to `packages/types/src/catalog.ts` without Prisma or Nest imports:

```ts
type PublicProductImage = Readonly<{
  src: string;
  alt: string;
}>;

type PublicProductDetail = Readonly<{
  name: string;
  englishName?: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: Readonly<{
    name: string;
    slug: string;
  }>;
  mainImage: PublicProductImage | null;
  gallery: readonly PublicProductImage[];
  seo: Readonly<{
    title?: string;
    description?: string;
  }>;
}>;
```

`PublicProductCard.image` should reuse `PublicProductImage | null` to avoid duplicating the same safe shape. The contract intentionally has no `attributes`, `labels`, `level`, `productType`, `publishedAt`, price, stock, options, actions, IDs, raw enums, or Media registry fields.

Descriptions are plain strings. The API must not promise HTML, Markdown execution, embedded components, or arbitrary structured content.

## Prohibited/Internal Field List

The detail repository may select only fields required for lifecycle filtering, readiness invocation, explicit public mapping, and safe media resolution. The response must never contain:

- product/category/attribute/label/Media/checklist/user UUIDs;
- raw Prisma enums or internal mappings for status, publication state, level, labels, media type, attribute type, Media status/visibility/kind/rendition;
- `mediaReference`, `mediaAssetId`, public ID, content version, storage reference/key/path, checksum, MIME verification data, dimensions, byte sizes, provider data, or audit users;
- quality score, completion percentage, missing rules, checklist rules/status, criticality, or readiness boolean;
- `createdAt`, `updatedAt`, `deletedAt`, raw `publishedAt`, `createdBy`, or `updatedBy`;
- category IDs/tree internals, attribute IDs/codes/raw values, category requirement flags, or filterability;
- logistics dimensions/weights or shipping data;
- gift boxes, add-on services, configurations, bundle rules, event definitions, or personalization data;
- price, cost, currency, inventory, supplier, administration notes, or unpublished editorial data; and
- authentication, authorization, customer, session, analytics, or operational state.

## Product Attribute Public-Safety Analysis

Attributes cannot be safely exposed with the current schema. `ProductAttribute` has `code`, `name`, `dataType`, optional free-form `unit`, `isFilterable`, and ordering, while `ProductAttributeValue.value` is raw JSON. There is no `isPublic`, public label, localization, approved-value option dictionary, public unit registry, formatter, or per-category display approval.

`isFilterable` is not a public-visibility flag. Category requiredness proves data completeness only; it does not prove customer-facing appropriateness. Therefore even required attributes must remain internal in WO-012.

The current architecture does provide group and category/attribute ordering, but it is insufficient for safe rendering:

- `TEXT`, `NUMBER`, `BOOLEAN`, `COLOR`, `MEASUREMENT`, and `DATE` need type-specific validation and localized formatting;
- `SELECT` and `MULTI_SELECT` lack canonical option/value-to-label mappings;
- measurement units are free-form strings without canonical unit semantics or localization;
- attribute/group names are single-language administrative content;
- raw JSON may contain shapes not approved for public transport; and
- missing optional values can be omitted, but public/required distinction still cannot be established.

The correct WO-012 decision is to return no attributes and make no schema change. A separate future attribute-publication design must approve visibility, localized display labels, enum options, units, formatting, and ordering before extending the contract.

## Product Label and Level Analysis

Product labels and level are deferred. `ProductLabelType` mixes potentially public merchandising labels (`NEW`, `FEATURED`, `BEST_SELLER`) with manager/campaign concepts (`MANAGER_RECOMMENDATION`, `CAMPAIGN`). There is no per-label visibility, time window, localized copy, evidence rule, or approval state.

`ProductLevel` includes `ECONOMIC`, `STANDARD`, `LUXURY`, `SUPER_LUXURY`, `VIP`, and `LIMITED_EDITION`. Although level completeness is a non-critical quality check, no public semantics, claim evidence, localization, or brand treatment has been approved. Readiness use does not authorize transport use.

No raw label/level enum should be selected or returned. A future Work Order may define an explicit allowlisted public badge contract and mapping only after business/brand approval.

## Public API Endpoint Proposal

Use the existing module/controller namespace:

```text
Controller path: public/catalog
Method path:     products/:slug
Global prefix:   api/v1
Final endpoint:  GET /api/v1/public/catalog/products/:slug
```

The endpoint is read-only and belongs in `PublicCatalogModule`. It uses the same Product visibility, category, readiness, Media, and public mapping concerns as list/category discovery. A second public-detail module would duplicate policy and create drift without establishing a new bounded domain.

Use a dedicated product-slug DTO with the current lowercase kebab-case and 255-character boundary. Syntactically invalid inputs may be rejected by validation without querying persistence; every syntactically valid slug that is absent or fails public visibility receives the same generic 404.

## Repository/Service/Controller Plan

Repository responsibilities:

1. add a minimal `publicProductDetailCandidateSelect`;
2. select internal UUID, approved product content/SEO fields, active category name/slug, and only ordered `MAIN_IMAGE`/`GALLERY_IMAGE` associations with `mediaAssetId`, `mediaReference`, `altText`, type, and stable ordering;
3. apply the full lifecycle/category/time predicate and exact slug in one query; and
4. never fetch labels, level, type, attributes, logistics, Product Experience, checklist, price, or inventory relations.

Service responsibilities:

1. receive the candidate or throw generic 404;
2. call the existing `ProductDataQualityService.evaluate(candidate.id)` unchanged;
3. throw the same 404 when non-ready or defensively missing required mapped fields;
4. choose the first ordered main association;
5. collect only linked (`mediaAssetId !== null`) main/gallery references;
6. run `resolveMany(mainReferences, "detail")` and `resolveMany(galleryReferences, "gallery")` concurrently;
7. map trimmed explicit `altText`, otherwise product name;
8. return main image null when unresolved and omit unresolved gallery entries without reordering survivors; and
9. map only the approved public contract.

Controller responsibilities are limited to DTO validation and calling `getProductBySlug`. It contains no Prisma, visibility, readiness, Media, mapping, or reason-specific exception logic.

`PublicCatalogModule` already imports `ProductModule`, `MediaModule`, and `PrismaModule`; no module or `AppModule` change is required.

## Storefront HTTP Boundary

Extend the existing server-only `apps/storefront/src/lib/api/public-catalog.ts` with:

```text
getPublicProduct(slug): Promise<PublicProductDetail>
```

It should request `public/catalog/products/${encodeURIComponent(slug)}` through the configured API base, retain the existing bounded revalidation/tag convention, map API 404 to `PublicCatalogNotFoundError`, and map all other network/non-OK responses to `PublicCatalogRequestError`. It must not import API source, Prisma, Media internals, or expose the API origin to client code.

The page and `generateMetadata` may call the same function. Next.js documents that identical `fetch` calls in `generateMetadata` and Server Components are memoized for the render, avoiding a duplicate upstream request when URL/options match. [Next.js `generateMetadata` documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

## Storefront Route Plan

Create:

```text
apps/storefront/app/(public)/products/[slug]/page.tsx
apps/storefront/app/(public)/products/[slug]/loading.tsx
apps/storefront/app/(public)/products/[slug]/error.tsx
```

The page is a Server Component. It awaits `params`, calls `getPublicProduct(slug)`, translates only `PublicCatalogNotFoundError` to `notFound()`, and allows generic transport/server failures to reach the intentional segment error boundary. It must not convert failures into placeholder products or empty success pages.

The existing global not-found UI is sufficiently generic and does not reveal whether a product exists internally; no product-specific reason text is needed. Next.js documents that `notFound()` terminates the segment and injects `noindex`, including streamed 404 UI. [Next.js `notFound()` documentation](https://nextjs.org/docs/app/api-reference/functions/not-found)

Keep the page server-rendered and avoid client data effects. Validate both the API 404 and Storefront response/meta behavior at runtime because a streamed App Router not-found response can use a 200 transport status while still carrying `noindex`; the API endpoint remains the authoritative generic HTTP 404 boundary.

## Product Detail UI Plan

Use a semantic, mobile-first two-region presentation composed from existing shared primitives and semantic variables:

- breadcrumb/navigation: products, category, current product text;
- product `<article>` with exactly one `<h1>`;
- optional English name as secondary text, never a heading replacement;
- main-image region with safe fallback when `mainImage` is null;
- ordered gallery as a labelled list/grid of non-interactive images;
- category link to `/products/category/[slug]`;
- short description as introductory text;
- full description rendered as plain text with line breaks, never `dangerouslySetInnerHTML`; and
- no specifications section until attributes are public-safe.

Do not render price, stock, quantity, cart, wishlist, comparison, reviews, inquiry, shipping, payment, personalization, gift/add-on configuration, fake badges, or any non-functional action. Product detail is an informational Base capability, not commerce UI.

## Product Card Link Plan

Activate links only after the endpoint, Storefront route, metadata, loading/error/not-found behavior, and final validation all pass. If any portion remains partial or blocked, keep cards non-linked.

The safest initial card structure is one `next/link` around the card's image and textual content, targeting `/products/${encodeURIComponent(product.slug)}` and using visible product-name text as its accessible name. Preserve the outer `<article>`/title association and focus-visible styling. Do not place another link or button inside it. The category label should remain plain text inside the linked card; category navigation continues through the separate discovery controls.

No capability check is needed per card because the entire catalog list and detail route share the already implemented `catalog.products` capability.

## Loading/Error/Not-Found Plan

- **Loading:** route-level, layout-stable image/content skeleton; one localized screen-reader status; respects reduced motion.
- **Transport/server error:** client error boundary with generic localized description and a real retry/reset button; no internal message, slug, upstream URL, or status detail.
- **API 404/non-public:** call `notFound()` and reuse generic not-found UI; never say draft, unavailable, inactive, future, incomplete, deleted, or private.
- **Safe empty media:** render the localized intentional image fallback; an empty gallery omits the gallery region entirely.
- **Optional text:** omit English name and SEO fields when absent; required detail fields failing defensive mapping result in the same 404.

## Media Main/Gallery Plan

The repository orders ProductMedia rows by `sortOrder ASC`, then stable internal `id ASC`. The response preserves that order without returning either field.

Main image:

1. choose the first ordered `MAIN_IMAGE` association;
2. include its reference only in the API-internal resolver call when `mediaAssetId` is present;
3. resolve with fixed `detail` purpose;
4. map `{ src, alt }` only when safe; otherwise `mainImage: null`; and
5. alt precedence is trimmed explicit ProductMedia `altText`, then product name.

Gallery:

1. collect ordered `GALLERY_IMAGE` associations;
2. retain only linked references for a single batch `resolveMany(..., "gallery")` call;
3. iterate the original ordered associations, mapping only non-null descriptors;
4. apply the same explicit-alt/product-name precedence; and
5. return an empty array when every item fails closed.

The runtime product-name fallback improves accessible output but must not mutate ProductMedia or satisfy the internal `media.alt-text` checklist warning. No Storefront/browser Media lookup is introduced.

## SEO and Structured Data Plan

Initial metadata should use:

- title: trimmed public `seo.title`, otherwise product name, then the existing Brand title template;
- description: trimmed public `seo.description`, otherwise short description;
- canonical path: `/products/${slug}` only when an approved `metadataBase`/canonical origin exists;
- Open Graph title/description/type/url using the same safe values;
- Open Graph image only when `mainImage` is non-null, with its safe alt text; and
- `index,follow` only because the API has already proven public readiness.

WO-011 intentionally omits the unverified canonical domain. Next.js requires an absolute URL or configured `metadataBase` for relative URL-based metadata. Therefore WO-012 must not invent a host or derive it from an untrusted request. Until an approved Brand/deployment canonical origin is configured, omit canonical and Open Graph URL fields and record this as a production SEO blocker. [Next.js Metadata API documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase)

Product JSON-LD without `Offer`, price, inventory, availability, review, or rating is valid at the general Schema.org vocabulary level: `offers` is a property, not a universally required `Product` field. [Schema.org `Product`](https://schema.org/Product) However, Google product-snippet eligibility requires at least one of `offers`, `review`, or `aggregateRating`. [Google Product snippet requirements](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)

The recommended WO-012 decision is therefore to **defer Product JSON-LD**. A minimal object would not qualify for Google product snippets, and Fardad currently lacks an approved canonical origin, public product identifier policy, Offer data, or review data. Do not fabricate `Offer`, `AggregateRating`, `Review`, price, availability, shipping, returns, SKU, MPN, GTIN, or Brand claims. Reconsider JSON-LD only when verified eligible data and canonical identity exist.

## RTL, Mobile, Accessibility, and Performance Plan

- Preserve root `lang="fa"` and `dir="rtl"` from the resolved profile.
- Use logical alignment/spacing; do not reverse DOM, reading, breadcrumb, or keyboard order for RTL.
- Maintain one meaningful `<h1>`, an `<article>`, labelled breadcrumb/gallery regions, descriptive image alt text, visible focus, and 44px link targets.
- Treat gallery images as content, not controls; avoid fake thumbnail buttons without a functional client interaction.
- Render descriptions as text; support long Persian/English mixed strings, line wrapping, and 200% zoom.
- Use responsive `sizes`, stable aspect-ratio containers, `priority` only for the main above-the-fold image, and lazy gallery images.
- Keep the route server-first; no client fetch/effect, carousel library, lightbox, animation dependency, or hydration-heavy gallery.
- Use one minimal detail query, one existing quality evaluation, and at most two batch Media resolutions; avoid per-image resolver/database calls.
- Keep safe missing-media fallbacks and layout stability when every descriptor is null.
- Test reduced motion, keyboard navigation, screen readers, mobile portrait/landscape, mixed-script text, long content, absent optional fields, and failed media.

## Capability Impact

No capability ID, edition, entitlement, enablement, or implemented-state change is required. `catalog.products` is already entitled, enabled, and implemented for the Fardad Base profile. The detail endpoint/page is part of that capability, not a new `catalog.productDetail` capability and not `catalog.shop`.

No navigation item is required. ProductCard links become the discovery path only after successful completion. Theme/Experience selections must not activate the route or any business feature.

## Exact File-Level Implementation Plan

Stage 1 — neutral contract and API:

1. add the exact shared public-detail/image contract;
2. add validated product slug parameters;
3. add one lifecycle-eligible detail projection/query inside PublicCatalogRepository;
4. add generic-404 readiness orchestration, safe media batching, and explicit mapping in PublicCatalogService;
5. add one controller GET method;
6. extend only the closed Media purpose mapping to `detail` and `gallery`.

Stage 2 — Storefront server route and presentation:

7. add `getPublicProduct` to the existing server-only HTTP client;
8. add typed product-detail localized content to the WO-011 content contract/Fardad profile;
9. add server-rendered detail/media presentation components;
10. add page/loading/error route files and safe metadata helper;
11. keep JSON-LD absent and omit URL metadata until canonical origin exists; and
12. activate one accessible ProductCard detail link only after the complete route passes validation.

Stage 3 — validation:

13. prove all visibility failures produce indistinguishable API 404s;
14. prove no internal field appears in the contract/response;
15. prove media resolution order/alt/null behavior;
16. prove Storefront route, metadata, not-found, errors, RTL/mobile/accessibility, and card links; and
17. rerun all workspace type/lint/build and structural boundary scans.

## Files to Create

| Proposed file                                                              | Purpose                                                                                          |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `apps/api/src/public-catalog/dto/public-product-slug.params.dto.ts`        | Validates the public product slug format/bounds.                                                 |
| `apps/storefront/components/catalog/ProductDetail.tsx`                     | Server-rendered semantic product content using safe public fields only.                          |
| `apps/storefront/components/catalog/ProductMediaGallery.tsx`               | Renders nullable main/fallback and ordered safe gallery without client behavior.                 |
| `apps/storefront/src/lib/product-metadata.ts`                              | Builds title/description/conditional canonical and Open Graph metadata from public data/profile. |
| `apps/storefront/app/(public)/products/[slug]/page.tsx`                    | Server Component detail route, API-404 translation, resolved profile, and composition.           |
| `apps/storefront/app/(public)/products/[slug]/loading.tsx`                 | Accessible stable product-detail skeleton/status.                                                |
| `apps/storefront/app/(public)/products/[slug]/error.tsx`                   | Generic localized transport/server retry boundary.                                               |
| `docs/codex/reports/WO-012_PUBLIC_PRODUCT_DETAIL_IMPLEMENTATION_REPORT.md` | Future implementation evidence, per-file rationale, validation, and Git state.                   |

No new module, Prisma, migration, seed, dependency, JSON-LD helper, page-builder, or commerce component file is required.

## Files to Modify

| Proposed file                                              | Exact future change                                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `packages/types/src/catalog.ts`                            | Add `PublicProductImage` and `PublicProductDetail`; reuse image shape in cards.                       |
| `packages/types/src/content.ts`                            | Add neutral localized product-detail/breadcrumb/gallery/loading/error text fields.                    |
| `apps/api/src/public-catalog/public-catalog.repository.ts` | Add minimal lifecycle-eligible slug detail select/query and ordered main/gallery internal projection. |
| `apps/api/src/public-catalog/public-catalog.service.ts`    | Reuse readiness, return generic 404, batch-resolve media, and map exact public detail.                |
| `apps/api/src/public-catalog/public-catalog.controller.ts` | Add `GET products/:slug` using the product slug DTO.                                                  |
| `apps/api/src/media/media.types.ts`                        | Extend the closed purpose union from `card` to `card`, `gallery`, and `detail`.                       |
| `apps/api/src/media/public-media-resolver.service.ts`      | Map the two approved new purposes to existing Prisma rendition variants.                              |
| `apps/storefront/src/lib/api/public-catalog.ts`            | Add typed server-only detail fetch and retain generic 404/request errors.                             |
| `apps/storefront/src/config/brands/fardad/content.fa.ts`   | Add provisional Persian detail, breadcrumb, fallback, loading, and error copy.                        |
| `apps/storefront/components/catalog/ProductCard.tsx`       | Add one accessible detail link only after route validation; avoid nested controls.                    |

No change is required to `schema.prisma`, migrations, `ProductDataQualityService`, Product Experience, Media controller/repository/storage, PublicCatalogModule, AppModule, `next.config.ts`, Brand/Theme/Experience profiles, navigation, Admin, dependencies, or lockfiles.

## Validation Plan

Static and build validation:

- typecheck `packages/types`, `packages/config`, `packages/utils`, `packages/ui`, Storefront, Admin, and API;
- run configured Storefront/Admin/API lint;
- build Storefront, Admin, and API;
- confirm the build exposes `/products/[slug]` as a server route;
- run formatter/check and `git diff --check`;
- confirm no manifest/lockfile/schema/migration/seed/Admin/worker change.

API visibility matrix on an approved non-production database/fixture:

- visible/readiness-ready product returns 200 and exact contract;
- absent, deleted, draft, inactive, archived, pending-review, unpublished, future-published, category-missing/inactive/deleted, readiness-failing, and race-deleted product each returns the same 404 shape/message;
- invalid slug does not query by an unbounded value and exposes no internal existence data;
- database/Media failures expose no internal details and follow defined server/null behavior;
- response-key assertion rejects IDs, enums, status, quality, logistics, attributes, labels, level, Product Experience, price/inventory, raw Media, and timestamps.

Media validation:

- linked public ready current `DETAIL` main resolves; legacy/unlinked/private/non-ready/missing/wrong-version/wrong-MIME fails to null;
- gallery uses one batch per fixed purpose, preserves ProductMedia order, and omits failed descriptors;
- explicit trimmed alt wins; product-name runtime fallback is used otherwise without changing quality state;
- no raw reference/storage/registry field reaches API or Storefront;
- current Next remote pattern accepts exact detail/gallery URLs without wildcard changes.

Storefront validation:

- `generateMetadata` and page share the same fetch boundary;
- API 404 calls `notFound()` and missing pages carry `noindex`;
- generic error/retry works for non-404 failures;
- no empty-success masking, client fetch, dead CTA, price, inventory, or Plus feature;
- card link is present only after successful endpoint/page completion and has no nested interaction;
- safe metadata fallbacks and conditional OG image behavior;
- canonical/OG URL omitted while origin is unapproved;
- RTL, DOM/focus order, keyboard, screen reader, touch targets, 200% zoom, reduced motion, responsive images, long/missing content, and mobile layouts.

## Risks and Mitigations

| Risk                                            | Mitigation                                                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Detail policy drifts from list visibility       | Reuse one repository predicate pattern and the same `ProductDataQualityService`; add the full failure matrix. |
| Private product existence leaks                 | One generic 404 after every visibility/readiness/mapping failure; never return reason/status.                 |
| Quality evaluator creates extra queries         | One detail candidate only; acceptable initial cost, measure before any approved projection/cache work.        |
| Attribute JSON/admin fields leak                | Do not select or contract attributes until public-visibility/mapping architecture exists.                     |
| Labels/level become unsupported claims          | Defer; require explicit public badge mapping and brand/business approval.                                     |
| Unsafe or legacy media leaks                    | Link-gate, fixed purpose, existing fail-closed resolver, descriptor-only mapping, null/omit behavior.         |
| Gallery order changes after failures            | Iterate original ordered associations and flat-map resolved descriptors.                                      |
| Runtime alt fallback hides data-quality warning | Never persist or feed fallback into the evaluator; transport-only fallback.                                   |
| Product description contains markup             | Render as React text with preserved whitespace; never use raw HTML.                                           |
| Canonical host is invented                      | Omit URL metadata until approved profile/deployment origin exists.                                            |
| Incomplete Product JSON-LD misleads crawlers    | Defer; never fabricate Offer/review/identifier data.                                                          |
| Card link ships before page completion          | Make link activation the final implementation step after endpoint/route validation.                           |
| Streamed not-found has unexpected HTTP status   | Verify runtime status and `noindex`; API remains authoritative 404.                                           |
| Product detail expands into commerce            | Contract/UI assertions ban price, inventory, actions, configuration, and Plus relations.                      |

## Explicit Out-of-Scope Items

WO-012 implementation must not include a Prisma/schema/migration/seed/data change; Admin product UI; Product creation/editing; Media upload/management/provider/CDN/processing/signing/proxy/transformation; public attributes before a separate visibility design; labels/levels/badges; publication dates; price, inventory, cost, cart, checkout, orders, payment, shipping, discounts, wishlist, comparison, reviews, search, recommendation, inquiry/quotation, Gift Experience, boxes, add-ons, configuration, corporate sales, authentication, customer account, CMS, analytics/personalization, cookies, social integration, PWA, AI, final Fardad redesign, Demo Factory, questionnaire UI, multibrand selector, new dependency, or lockfile change.

## Approval Gate

Repository readiness is **READY WITH BLOCKERS**.

Core API/page implementation is ready for explicit approval with these decisions:

1. exact include/defer/prohibit field classification;
2. attributes, labels, level, product type, and publication date absent;
3. endpoint `GET /api/v1/public/catalog/products/:slug` inside PublicCatalogModule;
4. generic 404 for every lifecycle/category/readiness/mapping failure;
5. main `detail` and ordered `gallery` resolution through the closed WO-010 resolver;
6. no Product JSON-LD in WO-012;
7. card links activated last; and
8. no capability change beyond the existing `catalog.products` implementation.

Production blockers/conditions:

- an approved canonical Storefront origin is required before emitting absolute canonical/Open Graph URL fields or reconsidering JSON-LD;
- approved linked Media Assets and current `DETAIL`/`GALLERY` renditions are required to prove non-null runtime images, although safe null/empty rendering is release-valid; and
- runtime visibility/404/media behavior must be exercised against approved non-production data before release because prior builds did not prove database/storage behavior.

No schema change is needed. Attribute/label/level limitations are resolved by deferral, not by expanding WO-012.

## Action Items

1. Approve or amend the exact public detail contract and defer/prohibit table.
2. Approve the PublicCatalogModule endpoint/repository/service plan and generic-404 matrix.
3. Approve `detail`/`gallery` as the two added closed Media resolver purposes.
4. Confirm Product JSON-LD deferral and canonical omission until an approved origin exists.
5. Approve the server-rendered UI, no-commerce rule, and final-step ProductCard linking.
6. Provide an approved non-production product/media fixture for runtime validation during implementation.
7. Issue an explicit controlled implementation Work Order before modifying source.

Explicit answers:

| Question                                                             | Answer                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Can product detail be implemented without a schema change?        | **Yes.** Existing Product, category, quality, ProductMedia link, Media Asset/Rendition, and slug fields are sufficient; attributes are deferred.                                                                                                          |
| 2. What exact product fields are included now?                       | Name, optional English name, slug, short/full descriptions, category name/slug, optional mapped SEO title/description, nullable safe main image, ordered safe gallery.                                                                                    |
| 3. What fields are deferred or prohibited?                           | Product type, level, labels, attributes, publication date, category description, non-main/gallery media are deferred; all IDs, raw enums/Media, lifecycle, quality, audit, logistics, Product Experience, price/inventory/commerce fields are prohibited. |
| 4. Can product attributes be safely exposed with the current schema? | **No.** There is no public flag, localized/approved label, option mapping, canonical unit model, or safe raw-JSON transport rule; defer without changing schema in WO-012.                                                                                |
| 5. Are labels and product levels exposed or deferred?                | **Deferred.** Their public semantics, localization, evidence, visibility, and brand treatment are not approved.                                                                                                                                           |
| 6. What exact API endpoint is recommended?                           | `GET /api/v1/public/catalog/products/:slug`.                                                                                                                                                                                                              |
| 7. What exact Storefront route is recommended?                       | `/products/[slug]` as an App Router Server Component.                                                                                                                                                                                                     |
| 8. How are main/gallery images resolved safely?                      | Select only ordered internal main/gallery links; fixed `detail` and `gallery` batch resolver calls; map only `{src,alt}`; explicit alt then product name; main null and failed gallery items omitted.                                                     |
| 9. How is the existing publication-readiness policy reused?          | Repository lifecycle/category filter first, then unchanged `ProductDataQualityService.evaluate(id).isPublicationReady`; every failure becomes the same 404.                                                                                               |
| 10. Is Product JSON-LD appropriate without Offer data?               | Schema.org permits a Product without Offer, but Google product snippets require Offer, Review, or AggregateRating. Defer JSON-LD in WO-012; do not invent commerce/review data.                                                                           |
| 11. When can ProductCard links be activated?                         | Only as the final step after endpoint, page, metadata, not-found/error/loading, media, type/lint/build, and accessibility validation all pass.                                                                                                            |
| 12. What capability state changes, if any?                           | **None.** Product detail remains within the existing entitled/enabled/implemented `catalog.products` Base capability.                                                                                                                                     |
| 13. Is implementation READY, READY WITH BLOCKERS, or NOT READY?      | **READY WITH BLOCKERS.** Core implementation is ready after approval; production canonical SEO and non-null runtime Media evidence remain conditional.                                                                                                    |
