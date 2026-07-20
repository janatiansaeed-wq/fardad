# WO-010 Pre-Implementation Media Delivery Review

> Project: Fardad Enterprise Platform
>
> Work order: WO-010 — Secure Media Delivery & Product Image Foundation
>
> Phase: Pre-Implementation Architecture Review
>
> Status: READY WITH BLOCKERS
>
> Review date: 2026-07-20
>
> Change scope: Documentation only

## Executive Summary

The existing public catalog has the correct browser contract—`image: { src, alt } | null`—and correctly withholds `ProductMedia.mediaReference`. The missing boundary is a provider-independent Media module inside `apps/api` that can turn a validated internal media identity into a deliberately public, versioned URL without returning a storage key, provider URL, filesystem path, or private original.

The current `ProductMedia` model is not sufficient for the production-grade foundation requested. Its `mediaReference` is only a required `VARCHAR(500)` and has no defined grammar, referential integrity, access state, validation state, file metadata, public identity, or rendition metadata. A narrow URL-building adapter could be written without a schema change only if every existing reference were already trusted and normalized; the repository cannot prove that precondition. Treating the existing string as browser-safe would violate the WO-009 gate.

The recommended architecture is:

1. Add a reusable API-owned Media Asset/Rendition registry.
2. Use `media:v1:<lowercase-uuid>` as the internal logical reference.
3. Store provider/storage keys only in the Media registry and never in public projections.
4. Give approved public assets a separate, random `publicId` and immutable content version.
5. Resolve public image descriptors inside `apps/api`; do not expose a raw-reference resolver endpoint.
6. Return only an absolute safe URL and resolved accessible alt text to Storefront.
7. Use an approved public origin in production and a development-only filesystem delivery adapter locally.
8. Preserve `image: null` as the safe failure mode when no eligible rendition can be resolved.

Implementation is **READY WITH BLOCKERS**. Architecture can proceed after explicit approval, but production rollout also needs an approved schema migration/backfill policy, a public media origin/storage decision, and representative non-production data/assets.

## Repository and Branch State

The required repository checks were run before creating this report.

```text
$ git status --short
(no output; working tree clean)

$ git branch --show-current
architecture-refactor
```

`HEAD` was `d70106b` (`Build storefront foundation and public product catalog`) and matched `origin/architecture-refactor` at review time. WO-008 and WO-009 are therefore present in the reviewed commit rather than as uncommitted work.

Only this report is authorized in the present review phase. No application source, configuration, Prisma schema, migration, seed, dependency, storage, environment secret, or product-media data was changed.

## Existing Media Model Analysis

`apps/api/prisma/schema.prisma` currently defines `ProductMedia` with:

- UUID primary key and owning product UUID;
- `mediaReference: String @db.VarChar(500)`;
- `ProductMediaType` role;
- optional `altText` and `title`;
- `sortOrder` and timestamps;
- uniqueness on `(productId, mediaReference)`; and
- an index on `(productId, type, sortOrder)`.

`ProductMediaType` distinguishes `MAIN_IMAGE`, `GALLERY_IMAGE`, `DETAIL_IMAGE`, `PACKAGING_IMAGE`, `LIFESTYLE_IMAGE`, and `VIDEO_REFERENCE`. `GiftBoxMedia` independently repeats the string-reference pattern with optional alt text and ordering.

The attachment DTO validates only that `mediaReference` is a string no longer than 500 characters. It does not trim it, define a scheme, reject URLs/paths, or verify that an asset exists. There is currently no Product controller or media write endpoint, so the DTO is a foundation rather than an active, secured management surface.

The quality evaluator selects only `type` and `altText`. It considers any `MAIN_IMAGE` association sufficient for the critical main-image check. It does not prove that the reference resolves, the file is an image, the asset passed validation, a safe public rendition exists, or delivery is healthy. The existing `media.alt-text` rule remains a separate warning based on explicit stored alt text.

Current data capabilities are:

| Concern | Distinguishable now? | Evidence and consequence |
| --- | --- | --- |
| Storage key | No | The string could contain one, but no type or grammar identifies it. |
| Public URL | No | A URL can fit in the column, but is neither classified nor approved. |
| Local path | No | A path can fit in the column, with no traversal/path policy. |
| External URL | No | Scheme/host are not validated or allowlisted. |
| Provider | No | No provider field or adapter identity exists. |
| MIME type | No | No stored or verified MIME/magic-byte metadata exists. |
| Image dimensions | No | Width and height are absent. |
| File size | No | Byte size is absent. |
| Checksum | No | Integrity/content identity is absent. |
| Alt text | Partly | Optional contextual `altText` is stored on the relation. |
| Image role/type | Yes | `ProductMediaType` identifies the product-context role. |
| Ordering | Yes | `sortOrder` exists; ties still need a deterministic secondary order. |
| Public/private state | No | No visibility or authorization classification exists. |
| Processing/safety state | No | No pending, ready, quarantined, failed, or retired state exists. |
| Rendition/version | No | Original and optimized variants cannot be distinguished. |

No approved database was connected during this review, so actual stored values were not inventoried. The schema cannot establish their meaning by inspection alone.

## Current mediaReference Semantics

The approved WO-005 and WO-006 reports describe media references as provider-neutral/external references and assign file ownership to an independent Media Service. WO-009 tightens the public boundary: the value is internal, is not selected by the public-catalog repository, and is not browser-safe.

The exact current semantic is therefore: **an opaque, internal, provider-neutral pointer whose concrete syntax and referent are not yet defined**. It is not presently valid to interpret it as a URL, object key, filesystem path, or provider identifier.

For the approved implementation, the exact canonical form should be:

```text
media:v1:<lowercase UUID>
```

Example:

```text
media:v1:018f6f8a-55ca-7d2a-a2e6-1d0ed7ef64f1
```

Rules:

- `media` identifies the logical namespace, not a provider.
- `v1` versions the reference grammar.
- the UUID addresses an API-owned Media Asset record, not a file or bucket;
- no slash, hostname, filename, query string, storage prefix, or credential is permitted; and
- parsing must be strict and default-deny.

The target schema should enforce a relation from domain media records to the Media Asset registry. Existing unknown strings must be inventoried and explicitly mapped, quarantined, or rejected during migration; they must not be automatically converted into public URLs.

## Public Media Safety Gap

The repository currently lacks all of the controls between “a product has a main-image row” and “a browser may fetch an approved image”:

- a canonical logical-reference grammar;
- a generic Media Asset registry and referential integrity;
- a separate non-sensitive public identity;
- public/private and processing status;
- verified MIME, byte size, dimensions, and checksum;
- approved public rendition metadata;
- an allowlisted delivery origin and URL builder;
- immutable versioning and invalidation rules;
- a local delivery strategy with traversal protection;
- batch resolution for catalog results;
- a rule that publication requires a deliverable public main image; and
- tests proving that internal fields cannot enter transport output.

The correct current behavior remains `image: null`. Concatenating `mediaReference` with a hostname, returning it directly, or proxying it as a URL would create a storage-leakage and SSRF boundary violation.

## Existing Media Pipeline Compatibility

`docs/blueprint/MEDIA_IMAGE_PIPELINE.md` already requires original preservation, upload validation, processing, optimized variants, metadata, object/application delivery, alt text, responsive images, browser caching, and future CDN integration. It also sketches a reusable Media entity containing MIME, size, dimensions, format, and path metadata. The older media work-order documents similarly separate application, Media Service, storage provider, and file delivery.

The recommendation in this report is compatible with those principles while narrowing the immediate scope to safe delivery:

- originals stay private and are never returned by the catalog;
- only validated web renditions become public;
- domain-specific roles and alt text stay on ProductMedia/article/brand relations;
- technical file metadata belongs to generic Media Asset/Rendition records;
- processing and upload workflows remain future work; and
- a CDN can be added at the public-origin boundary without changing public catalog contracts.

There is one documentation/repository drift to resolve: the active pipeline document says media architecture should precede catalog completion, while WO-009 intentionally completed catalog discovery with a safe fallback. This is not a security defect because WO-009 exposes no media reference, but Media Delivery is now required before real images can replace that fallback.

## Storage/Delivery Architecture Options

| Option | Strengths | Risks/limitations | Decision |
| --- | --- | --- | --- |
| Public CDN URL | Fast, cacheable, low API load, globally scalable | Requires intentional public renditions, stable versioned paths, origin policy, and operational provider choice | Recommended production delivery once an origin is approved |
| API media-resolution endpoint | Central policy point | A public endpoint accepting raw references invites enumeration and leaks abstraction; extra request per image if used naively | Do not expose; resolve internally during catalog mapping |
| Signed URLs | Appropriate for private/time-limited assets | Poor public caching and SEO; expiry churn; unnecessary credentials/tokens for public product images | Reserve for future authorized private media only |
| Same-origin image proxy | Hides upstream and simplifies browser origin | Can create SSRF, bandwidth, memory, decompression-bomb, and cache-abuse risks | Not the primary production strategy; local/fallback endpoint may accept public IDs only |
| Local filesystem | No cloud dependency; deterministic development | Not horizontally scalable; path safety and MIME headers must be enforced | Recommended behind a development-only storage adapter |
| Arbitrary external URL | Easy initial integration | Origin drift, tracking, SSRF through optimizers, hotlink failure, no validation/ownership | Prohibited |

## Recommended Production Architecture

The production design is a provider-independent **Media registry plus public-origin resolver** owned by `apps/api`.

```text
ProductMedia / future domain relation
  -> media:v1:<internal asset UUID>
  -> API Media registry (status, visibility, metadata, renditions)
  -> internal PublicMediaResolver
  -> approved public origin + publicId + contentVersion + rendition
  -> { src, alt }
  -> Storefront Next Image
```

The Media Asset registry should have:

- an internal UUID and unique canonical `media:v1:<uuid>` reference;
- a separate random, URL-safe `publicId` used only for public delivery;
- media kind, visibility, lifecycle/validation status, MIME, byte size, width, height, and checksum;
- original storage reference kept private;
- content version and timestamps; and
- one or more rendition rows containing variant name, storage reference/public path, MIME, dimensions, size, and checksum.

The public resolver accepts only a parsed internal reference and an allowed rendition purpose such as `card` or `gallery`. It verifies that the asset is `PUBLIC` and `READY`, is a supported raster image, and has the required verified rendition. It then builds an absolute URL from trusted configuration and stored safe public path components. It never accepts a caller-supplied origin or arbitrary URL.

The exact browser form should be:

```text
https://<approved-public-media-origin>/media/<publicId>/v/<contentVersion>/<variant>/<safe-seo-name>.<format>
```

Example shape:

```text
https://media.example.invalid/media/7Qm3x.../v/3/card/fardad-turquoise-box.webp
```

`publicId` is a non-sensitive random delivery identity distinct from the internal Media Asset UUID. `contentVersion` changes whenever bytes change. The optional SEO filename is sanitized display text and is never used as a storage key. The URL contains no bucket, provider account, internal UUID, filesystem path, signed secret, checksum, or moderation state.

The CDN itself is not required to implement or test the logical boundary. It is recommended before production traffic and can be introduced later in front of the approved public origin. An HTTPS public media origin is required before production images can be released.

## Recommended Local Development Architecture

Local development should use the same Media Asset/Rendition records and public contract, with a development-only filesystem storage adapter:

- files live under one configured absolute media root outside Storefront `public` assets;
- storage paths are generated from registry data, never from request text;
- a local API delivery route accepts only `publicId`, numeric content version, and a fixed rendition enum;
- the route rechecks `PUBLIC` + `READY`, uses resolved paths constrained beneath the configured root, sets verified content type and cache headers, and streams with size limits;
- local `src` values use an absolute URL such as `http://localhost:4000/api/v1/public/media/<publicId>/v/<version>/<variant>`; and
- cloud credentials, buckets, external URLs, and signed URLs are unnecessary.

This is a binary delivery route, not a resolver endpoint: it never accepts or returns `mediaReference`, a storage key, or an arbitrary URL. Production can disable the filesystem adapter/route and resolve the same public identity to the approved origin/CDN.

Local fixture files and database rows must be explicitly approved test data. They must not be fabricated or added during this review.

## Schema Sufficiency Assessment

**Can safe public media delivery be implemented without a Prisma schema change? No—not to the production-grade, reusable standard required by WO-010.**

A limited adapter could generate an allowlisted URL from a trusted canonical string without changing Prisma. That would require an external guarantee that every reference represents a validated, public image rendition. No such guarantee, registry, validation workflow, or data classification exists in the reviewed repository. Runtime provider inspection would be slow, provider-coupled, difficult to cache, and still would not provide a stable public identity or lifecycle policy.

A schema change is therefore genuinely necessary. The minimum target is a generic `MediaAsset` plus `MediaRendition` registry, with status/visibility/metadata/public identity, and a relation from `ProductMedia.mediaReference` to the canonical Media Asset reference. It should not become a full DAM.

The migration cannot be safely finalized until existing `mediaReference` values are inventoried on an approved non-production database. Unknown values need an explicit backfill table or quarantine outcome. Automatic interpretation by prefix/URL shape is prohibited.

## Required Public Media Contract

The existing shared catalog contract remains correct and should not grow internal metadata:

```ts
image: {
  src: string;
  alt: string;
} | null
```

`src` must be an absolute HTTP(S) URL generated by the API Media resolver from trusted configuration, except that a same-origin relative URL may be normalized to absolute by the API in local test environments. `alt` must be a resolved, non-null string.

The contract must never expose media references, storage or public bucket names, provider credentials, internal Media/ProductMedia IDs, filesystem paths, original/private URLs, checksums, upload metadata, moderation status, quality rules, or signing details. Technical dimensions remain internal for validation; the card can prevent layout shift using a fixed aspect-ratio container and `fill` rendering without widening this approved contract.

## API Boundary Proposal

Create a reusable `MediaModule` in `apps/api`. Its exported `PublicMediaResolver` should accept internal logical references and purpose/context, and return either a safe internal descriptor `{ src }` or `null`. It must support batch resolution to avoid a per-card database query.

The public catalog repository may select only the chosen main-image relation's `mediaReference` and `altText` for API-internal use. It should select deterministically by `sortOrder`, then stable ID, and avoid selecting storage fields. `PublicCatalogService` should batch-resolve those references, derive alt text, and map only `{ src, alt }`.

No HTTP endpoint that accepts `mediaReference` is required or recommended. The catalog endpoint already is the correct public resolution boundary. A local binary-delivery route may accept only `publicId` and fixed rendition/version path parameters.

Resolution failures must fail closed:

- invalid/private/not-ready/missing rendition -> `image: null` plus structured internal telemetry without the raw key;
- never fall back to returning the input string;
- never follow redirects to unapproved origins; and
- never weaken public product lifecycle/readiness checks.

Before publication, the main-image quality rule should require a linked `PUBLIC`, `READY`, validated image with a card-capable rendition—not merely a `MAIN_IMAGE` row. The explicit-alt warning remains separate and non-critical unless a later policy changes its criticality.

## Storefront Rendering Proposal

`ProductCard` should branch on the existing nullable contract:

- non-null image: render `@fardad/ui/Image`/Next Image in the current 4:3 aspect-ratio area with `fill`, `sizes`, object-cover styling, and API-provided alt text;
- null image or safe resolution failure: retain the current accessible Fardad fallback;
- preserve server rendering and do not add a browser media resolver call; and
- do not expose or log the original media reference in HTML, React props, browser errors, or analytics.

The catalog grid may mark only the actual above-the-fold LCP candidate for preload/priority. Other card images should retain native lazy loading. The fixed aspect ratio must remain to avoid layout shift.

Gallery images should later use the same public descriptor mechanism with a gallery rendition purpose and ordered ProductMedia relations. Product-detail/gallery UI is not part of WO-010.

## Next.js Image Configuration Proposal

`apps/storefront/next.config.ts` currently has no `images` policy. The approved implementation should add:

- `remotePatterns` for exactly one configured public media protocol, hostname, port, and `/media/**` pathname;
- no broad wildcard hosts and no deprecated `domains` allowlist;
- `dangerouslyAllowSVG: false`;
- explicit WebP and AVIF output formats if compatible with the chosen single optimization owner;
- a bounded quality set and device/image sizes based on measured Fardad layouts; and
- a cache TTL that does not undermine immutable source versioning.

Configuration must fail the production build for a missing/invalid media origin and must reject HTTP in staging/production. Localhost HTTP may be accepted only in development. The Storefront must not accept media origins from request query parameters or catalog data.

## Caching and Invalidation Strategy

Public media URLs must be content-versioned and immutable:

- never overwrite bytes at an existing `<publicId>/<contentVersion>/<variant>` URL;
- public renditions: `Cache-Control: public, max-age=31536000, immutable`;
- private responses: `Cache-Control: private, no-store` unless a future signed-media design proves a narrower safe policy;
- validation failures/404s: short bounded negative caching, not immutable caching;
- include format/width in cache keys if a future optimizer negotiates them; and
- prevent cache-key explosion by accepting only enumerated variants/qualities/sizes.

Replacing an asset creates a new content version/public path. This avoids reliance on purging browser or Next Image optimizer caches. A future approved publish/replace workflow should revalidate the existing `public-catalog` and per-category tags after the Media association changes. Metadata-only alt changes require catalog cache revalidation but do not require binary invalidation.

## Image Optimization Strategy

There must be one explicit owner per transformation stage:

- the future ingestion pipeline validates originals and creates a safe web master/renditions;
- originals remain private;
- the initial Storefront can use Next Image to produce responsive display sizes from the approved web rendition; and
- a future image CDN may take over responsive transformations behind the same public URL/contract after performance measurement.

Do not simultaneously stack uncontrolled provider transformations and Next optimization. Allowed input MIME types should initially be JPEG, PNG, and WebP; AVIF may be accepted only when decoder/tooling validation is approved. Product images should reject SVG. Future SVG brand assets require a separate sanitize-and-deliver policy with script/external-reference rejection and strict content headers.

Variant targets should be driven by actual card/gallery layouts, not arbitrary copies. The pipeline documentation's large/medium/small/thumbnail concept is compatible, but exact widths, quality, chroma, and color-profile policy require representative luxury product photography and visual QA before approval.

## Alt Text and Accessibility Strategy

Alt text is contextual and should remain on the domain relation rather than being inferred solely from the file:

1. Use trimmed, explicit `ProductMedia.altText` when present.
2. For a non-decorative product card with missing explicit alt, return the product name as the accessible fallback.
3. Do not mark the internal `media.alt-text` quality rule complete because a runtime fallback was used; the missing-alt warning must remain visible to content operations.
4. Use `alt=""` only when the rendering context explicitly declares an image decorative and adjacent content already conveys the same meaning. Missing text must never silently imply decoration.
5. The current no-image visual retains its accessible unavailable-image label when `image` is null.

Alt text should describe the product/content in the page language, avoid keyword stuffing and “image of” boilerplate, and stay independent of RTL direction.

## SEO Strategy

- Serve public images at stable crawlable HTTPS URLs with accurate `Content-Type`, dimensions known internally, and no authentication/cookie requirement.
- Use a sanitized meaningful filename segment for readability while resolving solely by the non-sensitive public ID/version.
- Preserve descriptive alt text and the structured relation between image and product.
- Avoid signed/expiring URLs for public product images.
- Ensure robots/CDN policies do not block approved public renditions.
- Keep image URLs stable until content changes, then version them rather than overwriting.
- Product JSON-LD, image sitemaps, product detail Open Graph images, and article structured data remain separate future scopes.

## Security and Abuse Prevention

Required controls are:

- never serialize raw storage keys, paths, provider identifiers, credentials, internal IDs, checksums, or private URLs;
- strict parser for `media:v1:<uuid>` and fixed public route parameters;
- random public IDs with sufficient entropy; no sequential enumeration;
- default-deny visibility/status checks and separate public/private code paths;
- exact allowlisted source origin and path for Next Image;
- no endpoint or optimizer that accepts an arbitrary remote URL;
- storage path canonicalization and proof that resolved local paths remain under the configured root;
- magic-byte/decode validation in addition to claimed MIME/extension;
- allowlisted raster MIME types and `X-Content-Type-Options: nosniff`;
- file-byte, decoded-pixel, width/height, frame-count, processing-time, and decompression-ratio limits;
- reject executables, polyglots, malformed images, and product SVGs; strip unsafe metadata during future processing;
- immutable public caching and no-store private/error responses as appropriate;
- rate limits and request concurrency/bandwidth limits on API-delivered media;
- no open redirects and no unbounded redirect following;
- safe generic public errors and redacted structured logs;
- authorization/RBAC before any future private lookup or signed-URL issuance; and
- short-lived, audience/scope-bound signatures only for future private assets, never reused as public catalog URLs.

The current API has a strict global validation pipe but no visible global rate limiter, security-header middleware, or media-specific controls. Those gaps must be addressed for any API-delivery route rather than assumed to exist.

## Product Catalog Integration Plan

1. Add and migrate the generic Media registry after data inventory approval.
2. Normalize/backfill ProductMedia references to canonical Media Asset references; quarantine unknown values.
3. Strengthen the critical main-image quality check to require an eligible, validated public rendition while keeping explicit-alt absence as the current warning.
4. Extend the catalog candidate projection with only the ordered main-image relation fields needed internally.
5. Batch-resolve safe card image URLs inside `PublicCatalogService`.
6. Resolve alt as explicit ProductMedia alt, otherwise product name; do not suppress the internal warning.
7. Continue returning `image: null` on safe resolution failure and never return the input reference.
8. Render the non-null contract through Next Image; keep the fallback for null.
9. Add the exact public-origin allowlist and local-development origin.
10. Verify transport leakage, private/not-ready rejection, cache behavior, image rendering, accessibility, and performance.

The shared `PublicProductCard` transport shape does not need to change.

## Future Reuse for Articles, Catalogs and Brand Assets

The Media module owns technical asset identity, safety state, renditions, storage mapping, and public URL resolution. Each consuming domain owns only its contextual relation:

- ProductMedia: product role, order, product-specific alt/title;
- future ArticleMedia: article placement, caption, article-context alt;
- future CatalogMedia: page/export role and print/web rendition intent;
- future BrandAsset: logo/banner role, locale/theme, and brand-context alt/decorative policy.

Consumers pass the same internal logical media reference plus an allowed rendition purpose to the resolver. They do not import a storage SDK, know provider configuration, or share Product-specific enums. This prevents Product from becoming a media service and allows future client brands to use separate public origins/namespaces through trusted server configuration rather than hard-coded URLs.

Tenant/client isolation is future work; if introduced, public identity and resolver queries must be scoped to tenant/brand and cache keys must include that scope.

## Exact File-Level Implementation Plan

The following is the proposed controlled implementation scope after approval. File names are intentionally provider-neutral.

### Files to Create

| File | Purpose |
| --- | --- |
| `apps/api/src/media/media.module.ts` | Own and export the reusable Media boundary. |
| `apps/api/src/media/media-reference.ts` | Strictly parse/format `media:v1:<uuid>` references. |
| `apps/api/src/media/media.types.ts` | Internal public-media purpose/descriptor and adapter types; no Prisma types in public/shared packages. |
| `apps/api/src/media/media.repository.ts` | Batch-load only registry fields required for public eligibility and URL resolution. |
| `apps/api/src/media/public-media-resolver.service.ts` | Enforce status/visibility/type/rendition rules and build safe URLs. |
| `apps/api/src/media/public-media-delivery.controller.ts` | Development-only public-ID binary delivery route; no raw-reference or arbitrary-URL input. |
| `apps/api/src/media/storage/media-storage.adapter.ts` | Provider-independent read interface used by controlled delivery. |
| `apps/api/src/media/storage/local-filesystem-media-storage.adapter.ts` | Development/test adapter with root confinement and streaming limits. |
| `apps/api/src/media/index.ts` | Controlled Media module exports. |
| `apps/api/src/media/media-reference.spec.ts` | Canonical parser rejection/acceptance tests. |
| `apps/api/src/media/public-media-resolver.service.spec.ts` | Public/private/status/variant/leakage/URL tests. |
| `apps/api/src/media/public-media-delivery.controller.spec.ts` | Local route traversal, headers, size, MIME, cache, and abuse tests. |
| `apps/api/prisma/migrations/20260720010000_media_delivery_foundation/migration.sql` | Add the approved Media Asset/Rendition registry, constraints, and controlled ProductMedia reference migration. |
| `apps/storefront/.env.example` | Document non-secret API/media origins and local-development values. |

No production provider adapter file should be created until a provider/storage origin is approved. That later adapter must implement the same internal interface.

### Files to Modify

| File | Exact change |
| --- | --- |
| `apps/api/prisma/schema.prisma` | Add generic asset/rendition/status/visibility structures and referential integrity for canonical media references; do not store a public URL as ProductMedia. |
| `apps/api/src/config/env.validation.ts` | Validate public media origin, delivery mode, and non-production local root; require HTTPS/non-local origin in production. |
| `apps/api/.env.example` | Document non-secret media configuration without credentials or an assumed provider. |
| `apps/api/src/app.module.ts` | Import `MediaModule`. |
| `apps/api/src/product/dto/attach-product-media.dto.ts` | Replace arbitrary string acceptance with canonical logical-reference validation. |
| `apps/api/src/product/product.repository.ts` | Include linked asset eligibility fields required by the main-image quality rule, not storage keys. |
| `apps/api/src/product/product-data-quality.service.ts` | Require a valid public-ready main-image rendition while preserving the explicit-alt warning. |
| `apps/api/src/public-catalog/public-catalog.module.ts` | Import the exported Media resolver boundary. |
| `apps/api/src/public-catalog/public-catalog.repository.ts` | Select one deterministic main-image association's reference and alt text for internal mapping. |
| `apps/api/src/public-catalog/public-catalog.service.ts` | Batch-resolve the safe URL and map only `{ src, alt }`, defaulting safely to null. |
| `apps/storefront/next.config.ts` | Add exact media `remotePatterns`, raster/SVG policy, formats, qualities, and cache policy. |
| `apps/storefront/components/catalog/ProductCard.tsx` | Render non-null images with the shared Next Image wrapper and retain the accessible null fallback. |
| `apps/storefront/components/catalog/ProductGrid.tsx` | Pass any measured above-fold/preload intent without preloading every card. |
| `package.json`, `apps/api/package.json`, `pnpm-lock.yaml` | Only if explicit approval includes adding the currently absent test runner/security middleware needed by the validation plan; otherwise leave dependencies unchanged and use the approved existing harness. |

`packages/types/src/catalog.ts` should remain unchanged because its existing shape is the required public contract. `packages/ui/src/Image.tsx` already forwards Next Image props and requires `alt`; it should be reused unless implementation testing finds a concrete generic defect.

## Validation Plan

Documentation/structure checks:

- `git diff --check`;
- confirm the implementation diff is restricted to the approved list;
- scan for `mediaReference`, storage-key fields, Prisma, API-source imports, bucket names, and provider SDK imports outside allowed API files;
- verify exactly the existing public catalog shape is serialized.

Database checks on an approved disposable database:

- inventory every current reference and classify it without guessing;
- migration dry run, rollback/restore rehearsal, constraint verification, and orphan detection;
- `pnpm.cmd db:format`, `pnpm.cmd db:validate`, `pnpm.cmd db:generate`, and migration status;
- verify unknown/private/not-ready media cannot satisfy publication readiness.

API tests:

- canonical reference parser accepts only the exact grammar;
- resolver returns only approved public image renditions;
- private, pending, quarantined, retired, wrong-MIME, missing-variant, and unknown media return null/deny;
- batch catalog resolution introduces no N+1 query pattern;
- catalog JSON contains `{src, alt}` only and no raw/internal field substring;
- explicit alt, product-name fallback, and missing-alt quality warning coexist;
- local delivery rejects traversal, arbitrary URLs, invalid variants, spoofed MIME, oversized payloads, redirects, and range/cache abuse;
- response headers include accurate MIME, `nosniff`, cache policy, and bounded content length.

Storefront tests:

- production build fails for invalid/missing production media origin;
- exact origin/path allowlist accepts approved URLs and rejects others;
- product cards render responsive images with stable aspect ratio and fallback safely on null;
- no client-side resolver fetch or raw reference reaches rendered HTML;
- keyboard/screen-reader checks, Persian alt behavior, and decorative empty-alt behavior;
- Lighthouse/Web Vitals checks with representative mobile images, including LCP, CLS, total bytes, lazy loading, and cache reuse.

Workspace validation:

- `pnpm.cmd typecheck`;
- `pnpm.cmd lint`;
- `pnpm.cmd build`;
- focused API/media tests; and
- runtime catalog/local-media verification against approved non-production data.

No migration should be applied to production as part of ordinary validation.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Existing references have mixed/unknown meanings | Inventory first; explicit mapping or quarantine; never infer public safety. |
| Schema migration breaks Product/GiftBox data | Back up, dry-run, detect orphans, stage ProductMedia first, and plan GiftBox migration separately if not included. |
| Main-image row exists but binary is unsafe/missing | Publication readiness checks linked asset status and required rendition. |
| Raw keys leak through logs/errors/DTOs | Narrow projections, redaction, negative transport tests, generic errors. |
| Next optimizer becomes an SSRF proxy | Exact origin/path allowlist; API-generated URLs only; no arbitrary URL parameter. |
| Public-ID enumeration | Random high-entropy IDs plus status checks and rate limits. |
| Stale image after replacement | Immutable versioned URLs and catalog tag revalidation. |
| Cache explosion/resource abuse | Enumerated variants/qualities/sizes, request limits, concurrency controls, CDN quotas. |
| Double optimization harms luxury image quality | One owner per stage, representative visual QA, measured quality settings. |
| CDN/provider lock-in | Stable Media interfaces and public contract; provider adapter/config confined to API/deployment. |
| Local/production behavior diverges | Same registry/status/resolver contract; only delivery adapter/origin differs. |
| Alt fallback hides editorial debt | Return accessible fallback but leave explicit-alt quality warning incomplete. |

## Explicit Out-of-Scope Items

The following must remain deferred:

- upload endpoints, direct-to-storage uploads, multipart orchestration, and credentials;
- provider selection, bucket creation, cloud connection, DNS, CDN provisioning, or production secrets;
- image processing workers, queues, crop/edit UI, automatic transformations, or background jobs;
- Admin media library, picker, moderation, replacement, deletion, and audit UI;
- full DAM, search/tagging, duplicate detection, licensing/copyright workflow, and analytics;
- product gallery/detail page implementation;
- article, catalog, brand, gift-box, user-upload, and document UI/integration;
- private-media product requirements and signed-URL implementation;
- SVG brand pipeline;
- tenant/brand isolation model;
- image sitemap, Product JSON-LD, product Open Graph images, and CMS SEO management;
- price, inventory, cart, checkout, payment, orders, or unrelated Product Experience changes; and
- production migration execution or current ProductMedia data mutation.

## Approval Gate

Repository readiness is **READY WITH BLOCKERS**.

Before implementation begins, the CTO must approve:

1. the canonical internal reference and separate public-ID/versioned-URL design;
2. the minimal Media Asset/Rendition Prisma schema and controlled backfill approach;
3. the non-production filesystem delivery strategy and local path policy;
4. whether the test/security dependency changes listed in the file plan are included; and
5. the exact WO-010 implementation file scope.

Before production release, the project additionally needs:

- an approved public media origin and storage/provider adapter;
- HTTPS/DNS/cache/backup/monitoring ownership;
- approved allowed formats and byte/pixel/dimension limits;
- an inventory and migration rehearsal using approved data; and
- representative validated product assets for performance and visual QA.

No provider decision or CDN provisioning is required to approve the interface and local foundation. A CDN is **later/recommended before production scale**, not required for local development and not a prerequisite for defining the safe contract.

## Action Items

1. Approve or amend this architecture and its file-level scope.
2. Provide an approved non-production database export/query path for `mediaReference` inventory.
3. Approve the minimal Media Asset/Rendition schema and migration/backfill policy.
4. Approve local media root, fixture ownership, and security limits.
5. Select an HTTPS public media origin/provider before production rollout; keep provider details behind the adapter.
6. Issue explicit authorization before any implementation, dependency, schema, migration, seed, configuration, storage, or data change.

Explicit answers:

| Question | Answer |
| --- | --- |
| Can safe public media delivery be implemented without a Prisma schema change? | Not to the requested production-grade standard. Only a narrow resolver for independently trusted/prevalidated references could; the repository cannot prove those preconditions. |
| What exact form should `mediaReference` have internally? | `media:v1:<lowercase UUID>`, resolving to an API-owned Media Asset—not a URL, path, provider ID, or storage key. |
| What exact form should the browser receive? | Only `{ src: "https://<approved-origin>/media/<publicId>/v/<contentVersion>/<variant>/<safe-name>.<format>", alt: "<resolved text>" }` or `null`. |
| Which provider-independent architecture is recommended? | API-owned Media Asset/Rendition registry, internal batch resolver, public-origin URL builder, and pluggable storage/delivery adapters. |
| Is an API resolver endpoint required? | No. Resolve inside API services. A local binary-delivery route keyed only by public ID/version/variant is distinct and may be enabled for development. |
| Is a CDN required now, later, or optional? | Later: not required for contract/local implementation, strongly recommended before production scale. An approved HTTPS public origin is required for production. |
| How does local development work without cloud storage? | A root-confined filesystem adapter and local API binary-delivery route use the same registry/public IDs and return absolute localhost URLs. |
| How are public, private and future signed media separated? | Explicit visibility/status plus separate delivery paths: immutable public origin URLs for public-ready renditions; authorized, no-store, short-lived signed delivery only for future private assets. |
| How are image alt text and data-quality warnings preserved? | Explicit ProductMedia alt wins; product name is the accessible transport fallback; fallback does not complete the existing explicit-alt warning; decoration must be explicit. |
| Which files must change to replace the catalog fallback with real images? | The exact create/modify tables above: Prisma Media registry/migration; API Media/config/Product-quality/catalog files; Storefront environment/Next config/ProductCard/ProductGrid; shared catalog shape remains unchanged. |
| What must remain deferred? | Upload/admin/DAM, provider/CDN provisioning, transformations/workers, private signing, other domain integrations/UI, SVG pipeline, detailed SEO, and unrelated commerce. |
| Is implementation READY, READY WITH BLOCKERS, or NOT READY? | **READY WITH BLOCKERS.** Architecture is actionable after approval; schema/data migration and production-origin/provider decisions remain blockers. |
