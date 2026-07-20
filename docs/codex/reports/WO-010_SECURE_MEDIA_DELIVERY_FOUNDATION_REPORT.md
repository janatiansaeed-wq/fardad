# WO-010 Secure Media Delivery Foundation Report

> Project: Fardad Enterprise Platform
>
> Work order: WO-010 — Secure Media Delivery & Product Image Foundation
>
> Phase: Controlled Implementation
>
> Status: COMPLETED
>
> Date: 2026-07-20

## Executive Summary

WO-010 implements an additive, provider-independent Media foundation owned entirely by `apps/api`. It adds generic Media Asset and Media Rendition registries, a strict `media:v1:<lowercase UUID>` parser/formatter, fail-closed public media resolution, a development-only filesystem delivery route, safe public-catalog image mapping, and conditional Next Image rendering in Storefront.

Legacy `ProductMedia.mediaReference` remains required and unchanged. A new nullable `mediaAssetId` creates an opt-in link to the registry. Legacy or unlinked rows continue through the existing Product data-quality evaluation exactly as before and resolve to `image: null` in public catalog output.

No upload, provider SDK, cloud storage, production adapter, media processing, new dependency, seed, data rewrite, or production host was added. Runtime binary delivery was not executed because no approved database media record, configured local media root, or approved rendition file was provided.

## Approved Architecture Decisions

- `apps/api` is the sole database, storage-reference, and media-policy boundary.
- Product and future domains hold contextual associations; the generic Media registry holds technical asset/rendition identity and safety metadata.
- Internal references use `media:v1:<lowercase UUID>` and identify an API-owned Media Asset.
- Public delivery uses a separate 22-character URL-safe random `publicId`, integer content version, and enumerated rendition.
- Public catalog returns only the existing `{ src, alt } | null` shape.
- The public resolver is an internal API service; there is no HTTP endpoint that accepts a media reference or arbitrary URL.
- Local binary delivery accepts only public ID, content version, and a fixed variant.
- Production delivery remains disabled unless a separately approved HTTPS public origin is configured.
- Existing Product quality outcomes remain unchanged until the separate media inventory/backfill work order.

## Additive Migration Strategy

Migration `20260720010000_media_delivery_foundation` is additive:

- creates four Media enums;
- creates `media_assets` and `media_renditions`;
- adds only nullable `product_media.media_asset_id` to the existing table;
- adds indexes, checks, and restrictive foreign keys;
- contains no `UPDATE`, backfill, normalization, deletion, drop, rename, truncation, or existing-column rewrite; and
- does not apply itself to any database during this Work Order.

The nullable ProductMedia link uses a composite foreign key:

```text
(media_asset_id, media_reference) -> media_assets(id, reference)
```

PostgreSQL leaves the constraint satisfied for legacy rows whose `media_asset_id` is null. For a linked new row, the constraint guarantees that the selected asset ID and canonical reference belong to the same Media Asset.

Database checks enforce positive sizes/dimensions/versions, lowercase SHA-256 shape, UUID-v7 Media IDs, the internal reference syntax/identity, and the random public-ID shape. Prisma uses `uuid(7)` defaults for both new registry identities.

## Legacy Media Compatibility

- The existing `ProductMedia.mediaReference VARCHAR(500) NOT NULL` column remains present and was not altered.
- Existing values are not parsed as URLs, paths, keys, provider IDs, or safe assets.
- No legacy row is linked automatically.
- No row is backfilled, rewritten, normalized, deleted, or quarantined.
- A catalog candidate resolves media only when its deterministically selected main-image row has a non-null `mediaAssetId`.
- Legacy/unlinked, malformed, unsafe, or unresolved media returns `image: null`.
- `GiftBoxMedia` and Product Experience media relations are untouched.

## Media Reference Grammar

`apps/api/src/media/media-reference.ts` accepts exactly:

```text
media:v1:<lowercase UUID>
```

The parser returns only the UUID portion for an exact canonical value and returns null for empty values, whitespace, uppercase UUIDs, URLs, paths, filenames, query strings, provider identifiers, bucket-like paths, and arbitrary legacy strings. The formatter throws for a non-lowercase/non-UUID asset ID.

The migration additionally guarantees that a Media Asset reference equals `media:v1:` plus that row's UUID text. The reference never represents a public URL or storage location.

## Media Asset and Rendition Registry

`MediaAsset` contains:

- UUID-v7 internal ID;
- unique canonical reference and random public delivery ID;
- media kind, public/private visibility, and lifecycle status;
- verified MIME type, byte size, optional image dimensions, and checksum;
- private original storage reference;
- positive content version;
- created/updated/deleted timestamps and optional creator/updater audit relations; and
- indexes for kind/status, public eligibility, and audit references.

`MediaRendition` contains:

- UUID-v7 identity and restrictive Media Asset relation;
- enumerated `CARD`, `GALLERY`, `DETAIL`, or `THUMBNAIL` variant;
- content version and private storage reference;
- verified MIME, byte size, dimensions, checksum, and lifecycle status;
- created/updated/deleted timestamps and optional audit relations; and
- deterministic uniqueness on asset, variant, and content version.

No browser URL is stored on ProductMedia. No provider configuration or multitenant model was introduced.

## Public Resolver Boundary

`PublicMediaResolverService` is the only Media service exported to other API modules. It batch-resolves canonical references for a fixed purpose (`card` in WO-010) and returns only `{ src } | null`.

Resolution requires:

- enabled media delivery configuration;
- a syntactically canonical reference;
- a non-deleted `IMAGE` asset;
- `PUBLIC` visibility and `READY` status;
- supported verified raster MIME;
- valid asset size and dimensions;
- valid random public ID and positive content version; and
- a ready, non-deleted rendition for the same current content version and requested purpose, with allowlisted MIME, bounded positive size, positive dimensions, and a valid checksum shape.

Invalid configuration, query failure, invalid reference, missing/private/non-ready asset, unsupported MIME, or missing current rendition fails closed to null. Logs contain only a generic internal warning. The module performs no outbound HTTP request, accepts no caller origin/path/storage key, and follows no redirect.

## Local Development Delivery

The local route is:

```text
GET /api/v1/public/media/:publicId/v/:contentVersion/:variant
```

It is usable only when `NODE_ENV=development` and `MEDIA_DELIVERY_MODE=local`; otherwise it returns a generic 404. Input is limited to:

- exactly 22 URL-safe public-ID characters;
- a bounded positive decimal content version; and
- one of the fixed lowercase variant names.

The controller loads storage information only from an eligible registry record. The filesystem adapter rejects absolute/request-derived paths, parent traversal, null bytes, oversized/size-mismatched files, missing/non-file targets, symlink escapes after `realpath`, and any configured root inside `apps/storefront/public`.

Successful local responses stream the verified rendition MIME and length with:

- `X-Content-Type-Options: nosniff`;
- `Cache-Control: public, max-age=300, must-revalidate`;
- restrictive Content Security Policy; and
- cross-origin resource policy suitable for the Storefront image optimizer.

No raw storage reference is included in route parameters, responses, headers, or errors.

## Production Delivery Deferral

No production storage adapter, provider, CDN, DNS, credential, bucket, or hostname is implemented. `MEDIA_DELIVERY_MODE` defaults to `disabled`, so the resolver returns null when no approved origin exists.

The configuration foundation permits a future `public` mode only with an absolute HTTPS origin. Storefront likewise produces no remote image allowlist when its origin is absent and rejects HTTP outside development. A production origin supplied later must be explicitly approved and backed by a separately approved delivery/storage implementation.

## Catalog Integration

The public-catalog repository now selects one `MAIN_IMAGE` association by `sortOrder ASC`, then stable `id ASC`. Its API-internal selection is limited to `mediaAssetId`, `mediaReference`, and contextual `altText`.

After the unchanged lifecycle and Product quality checks pass, the service:

1. collects references only from selected main-image rows with a non-null asset link;
2. resolves all collected references in one Media service call for the `card` purpose;
3. maps a resolved descriptor to the existing public shape;
4. uses trimmed explicit ProductMedia alt text, falling back to product name; and
5. returns null for legacy, unlinked, invalid, unsafe, missing, or disabled delivery.

Public endpoint paths, pagination, visibility rules, and the shared catalog transport type are unchanged. No raw Media field is mapped into response objects.

## Product Quality Compatibility

`ProductDataQualityService` was not modified. Its current results remain:

- an existing `MAIN_IMAGE` association satisfies the current critical media association rule;
- explicit missing alt text remains the existing non-blocking warning; and
- using product name as a Storefront-accessibility fallback does not complete or suppress that warning.

Strict “public-ready linked rendition required for publication” enforcement remains deferred until existing references are inventoried and migrated explicitly.

## Storefront Rendering

`ProductCard` preserves its fixed 4:3 image area. When `image` is non-null, it uses the shared Next Image wrapper with:

- API-provided `src` and `alt` only;
- `fill` layout within the fixed aspect ratio;
- responsive one/two/three-column `sizes`; and
- lazy loading without broad preloading.

When `image` is null, the existing accessible Persian Fardad fallback remains. Storefront does not fetch or resolve media in the browser and receives no storage or registry information.

## Configuration Changes

API environment validation now supports non-secret:

- `MEDIA_DELIVERY_MODE=disabled|local|public`;
- `MEDIA_LOCAL_ROOT`; and
- `MEDIA_PUBLIC_ORIGIN`.

Local mode is restricted to development, requires an absolute root and loopback public origin, and permits local HTTP. Public mode requires HTTPS. Any origin rejects credentials, query strings, fragments, and non-HTTP(S) schemes.

The API example documents local configuration without a machine-specific path. The new Storefront example documents its server-only API base and local loopback Media origin without credentials or a fake production domain.

`apps/storefront/next.config.ts` derives one exact remote pattern from trusted environment configuration. The pattern pins protocol, host, port, empty search, and the `/public/media/**` path beneath the configured base. It has no wildcard hostname, keeps `dangerouslyAllowSVG: false`, and declares WebP/AVIF plus bounded qualities.

## Security Controls

- Raw references, internal asset IDs, storage keys, original paths, provider details, checksums, status, and audit data remain API-only.
- Composite referential integrity prevents mismatched linked ID/reference pairs.
- Resolver and local route default-deny on every eligibility/configuration failure.
- Only fixed rendition variants and allowlisted raster MIME types are accepted.
- Local byte size is bounded at 20 MiB and must equal verified registry size.
- Positive dimensions and checksum shapes are enforced by schema checks and rechecked where delivery needs them.
- Path resolution is registry-derived, root-confined, and symlink-safe.
- There is no arbitrary URL fetch/proxy, redirect following, open redirect, wildcard remote hostname, SVG delivery, or detailed browser error.
- Public/private state is explicit; private assets cannot enter the public query.
- Production local delivery is unavailable.
- No rate-limiting middleware was added because dependencies were forbidden; infrastructure/application rate limiting remains a production prerequisite.

## Accessibility and Alt Text

For a resolved non-decorative card image, trimmed explicit ProductMedia alt text wins. If it is absent/blank, the product name is returned as an accessible fallback. The original quality warning remains unchanged because the fallback is transport behavior rather than stored editorial completion.

The no-image fallback retains `role="img"` with a product-specific unavailable-image label. WO-010 does not infer decorative behavior or emit empty alt text for product card imagery.

## Files Created

| File | Reason |
| --- | --- |
| `apps/api/prisma/migrations/20260720010000_media_delivery_foundation/migration.sql` | Adds the registry and nullable legacy-safe ProductMedia link without data DML. |
| `apps/api/src/media/media.module.ts` | Owns providers/controller and exports only the public resolver service. |
| `apps/api/src/media/media-reference.ts` | Implements strict logical-reference parsing/formatting. |
| `apps/api/src/media/media.types.ts` | Defines narrow internal resolver/storage contracts. |
| `apps/api/src/media/media.repository.ts` | Owns minimal Prisma projections for batch resolution and local delivery. |
| `apps/api/src/media/public-media-resolver.service.ts` | Enforces public eligibility and builds safe configured URLs. |
| `apps/api/src/media/public-media-delivery.controller.ts` | Provides the development-only public-ID binary route and headers. |
| `apps/api/src/media/storage/media-storage.adapter.ts` | Defines the provider-independent local read boundary and DI token. |
| `apps/api/src/media/storage/local-filesystem-media-storage.adapter.ts` | Implements root-confined development filesystem streaming. |
| `apps/api/src/media/index.ts` | Exposes only controlled Media module/resolver types. |
| `apps/storefront/.env.example` | Documents non-secret API/media origin configuration. |
| `docs/codex/reports/WO-010_SECURE_MEDIA_DELIVERY_FOUNDATION_REPORT.md` | Records implementation, validation, limits, and follow-up gates. |

`docs/codex/reports/WO-010_PRE_IMPLEMENTATION_MEDIA_DELIVERY_REVIEW.md` was already present as the untracked approved architecture review before this controlled implementation and was preserved unchanged.

## Files Modified

| File | Reason |
| --- | --- |
| `apps/api/.env.example` | Documents provider-neutral disabled/local Media settings without secrets or machine paths. |
| `apps/api/prisma/schema.prisma` | Adds Media enums/models/audit relations and nullable composite ProductMedia link. |
| `apps/api/src/app.module.ts` | Registers `MediaModule`. |
| `apps/api/src/config/env.validation.ts` | Enforces mode/root/origin and development/HTTPS safety rules. |
| `apps/api/src/public-catalog/public-catalog.module.ts` | Imports the exported Media resolver boundary. |
| `apps/api/src/public-catalog/public-catalog.repository.ts` | Selects one deterministic main-image association internally. |
| `apps/api/src/public-catalog/public-catalog.service.ts` | Batch-resolves linked images and maps only safe image output/alt. |
| `apps/storefront/components/catalog/ProductCard.tsx` | Renders safe non-null Next images while preserving the null fallback. |
| `apps/storefront/next.config.ts` | Adds exact origin/path policy, HTTPS enforcement, and safe raster settings. |

No package manifest, lockfile, Product quality file, Product Experience file, shared public type, seed, or GiftBoxMedia file changed.

## Prisma Migration Summary

The new migration creates:

- `MediaKind`, `MediaVisibility`, `MediaLifecycleStatus`, and `MediaRenditionVariant` enums;
- `media_assets` with UUID-v7/reference/public-ID/metadata/visibility/status/version/audit constraints;
- `media_renditions` with versioned variant uniqueness and verified rendition metadata;
- nullable `product_media.media_asset_id`;
- composite linked-reference foreign key and supporting index; and
- restrictive audit/asset foreign keys and public-eligibility indexes.

The migration was created and statically validated but not applied. It contains no operation that changes the value of an existing ProductMedia row.

## Validation Commands and Results

| Validation | Result |
| --- | --- |
| `pnpm.cmd --filter @fardad/api db:format` | Environment blocked: package-manager registry signature/version-switch verification failed; no dependency change occurred. |
| Installed Prisma `format` on canonical schema | Passed. |
| Installed Prisma `validate` with process-local placeholder `DATABASE_URL` | Passed; validates schema only, not database connectivity. |
| Installed Prisma `generate` | Passed with Prisma Client 6.19.3. |
| Local TypeScript `--noEmit` for types/config/utils/ui/storefront/admin/api | Passed for all seven projects. |
| Local ESLint for Storefront, Admin, and API | Passed. |
| Storefront Next production build | Passed; catalog routes remain dynamic. Existing Next flat-ESLint-plugin warning remains non-blocking. |
| Admin Next production build | Passed. Existing Next flat-ESLint-plugin warning remains non-blocking. |
| API Nest build | Passed. |
| Compiled reference parser smoke checks | Passed for canonical input and URL/path/uppercase/query/legacy rejection. |
| Compiled environment-schema smoke checks | Passed for disabled production, invalid HTTP production, invalid relative local root, and valid loopback/absolute local setup. |
| Insecure production Storefront origin negative check | Passed: HTTP production media origin was rejected. |
| `git diff --check` and changed-file trailing-whitespace scan | Passed. |
| Required boundary/dependency/migration scans | Passed. |

There is no configured test runner in the current application packages, so no test files, runner, middleware, or dependency were added. Runtime-specific cases remain part of the next approved data-backed validation.

## Runtime Delivery Verification Status

**NOT EXECUTED — APPROVED MEDIA DATA AND LOCAL ROOT NOT AVAILABLE.**

No migration was applied, no registry rows were created, no ProductMedia row was linked, and no local rendition file/root was configured. The report therefore does not claim that binary streaming or a non-null runtime catalog image was exercised. Compilation and static/smoke validation prove the code and configuration boundaries, not storage/database behavior.

## Dependency and Leakage Scans

Confirmed:

- no internal media/storage field appears in Storefront, `packages/types`, or `packages/ui`;
- no Prisma import exists outside `apps/api`;
- no Storefront/Admin/shared package imports API source;
- Media performs no outbound fetch, URL proxy, or redirect following;
- Next Image has no wildcard hostname or deprecated broad domain allowlist;
- no fake production media hostname exists;
- the migration contains no data mutation/destructive/backfill statement;
- `ProductDataQualityService` has no diff;
- Product Experience and GiftBoxMedia have no diff;
- no provider SDK/configuration was introduced in the Media implementation;
- package manifests and lockfile have no diff; and
- catalog components contain no client-side media fetch/resolver.

## Known Limitations

- All existing products remain on `image: null` until a separate approved inventory/migration creates registry rows and links selected ProductMedia rows.
- Current publication readiness still proves only a main-image association, not a deliverable public rendition; this is intentionally unchanged for legacy compatibility.
- There is no upload/processing path to create or verify registry content.
- Local route behavior is compiled but not data-backed/runtime-tested.
- No production delivery adapter or origin is configured.
- No existing automated test harness is available.
- Rate limiting/edge abuse protection is not implemented in this dependency-restricted Work Order.
- Public ID generation is represented and constrained in the schema, but creation workflow/entropy generation belongs to future approved media management.
- Gallery/detail/thumbnail variants exist in the generic registry/route contract but are not integrated into Storefront UI.

## Explicit Out-of-Scope Confirmation

WO-010 did not implement file/direct uploads, cloud/object storage, provider selection, S3/R2/Cloudinary/Vercel Blob, CDN/DNS, credentials, production storage adapter, image processing/conversion/optimization workers, queues, crop/edit tooling, Admin library/picker/moderation/replacement/deletion, signed URLs, private-media UI, full DAM, gallery/product detail, Article/Catalog/Brand integration, GiftBoxMedia changes, automatic legacy migration/backfill, new dependencies, rate-limiting packages, seed data, price, cart, checkout, or any Plus feature.

## Git Status

- Active branch: `architecture-refactor`.
- The working tree contains the WO-010 files listed above plus the preserved untracked pre-implementation review.
- No unrelated user change was discarded.
- No commit, push, merge, rebase, branch creation/switch, or destructive Git command was performed.

## Follow-Up: Media Data Migration and Production Provider

The next Media Data Migration Work Order must use approved non-production data to:

1. inventory every legacy `mediaReference` without assuming meaning;
2. explicitly map valid references or quarantine invalid ones;
3. create verified Media Asset/Rendition records and cryptographically random public IDs;
4. link ProductMedia rows only after review and rehearsal;
5. runtime-test public/private/status/MIME/path/cache behavior; and
6. only then strengthen publication readiness to require an eligible public rendition.

A separate production-provider decision must approve storage, public origin/CDN, DNS/TLS, credentials, backups, monitoring, abuse controls, and the provider-specific adapter. That decision must not change the public catalog contract or expose provider/storage details.

## Action Items

1. Review the additive schema, composite legacy link, resolver boundary, and local delivery controls.
2. Provide an approved disposable PostgreSQL database, representative Media records, a local root, and validated raster fixture for runtime verification.
3. Approve a separate Media Data Migration Work Order before changing any existing ProductMedia data or quality outcome.
4. Approve production storage/public-origin architecture before enabling `public` delivery mode.
5. Review and approve separately before upload, Admin Media, private signing, article/catalog/brand integration, or product-detail/gallery work.
