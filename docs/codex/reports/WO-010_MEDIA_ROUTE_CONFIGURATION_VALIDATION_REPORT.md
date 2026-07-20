# WO-010 Media Route Configuration Validation Report

> Project: Fardad Enterprise Platform
>
> Work order: WO-010 — Media Route Configuration Validation and Correction
>
> Phase: Focused Post-Implementation Validation
>
> Status: PASSED — NO CORRECTION REQUIRED
>
> Date: 2026-07-20

## Executive Summary

The suspected route mismatch does not exist. With the documented local configuration, `PublicMediaResolverService` emits URLs under `/api/v1/public/media/...`; the Nest global prefix and controller decorators mount the binary route at that same path; and Storefront derives the exact `/api/v1/public/media/**` Next Image pathname from the same configured base path.

A valid local development image URL is accepted by the exact configured Next Image protocol, hostname, port, pathname, and empty-search policy. No source correction was necessary or made. Only this validation report was created in the focused correction phase.

## Repository State

Required checks before validation:

```text
$ git status --short
 M apps/api/.env.example
 M apps/api/prisma/schema.prisma
 M apps/api/src/app.module.ts
 M apps/api/src/config/env.validation.ts
 M apps/api/src/public-catalog/public-catalog.module.ts
 M apps/api/src/public-catalog/public-catalog.repository.ts
 M apps/api/src/public-catalog/public-catalog.service.ts
 M apps/storefront/components/catalog/ProductCard.tsx
 M apps/storefront/next.config.ts
?? apps/api/prisma/migrations/20260720010000_media_delivery_foundation/
?? apps/api/src/media/
?? apps/storefront/.env.example
?? docs/codex/reports/WO-010_PRE_IMPLEMENTATION_MEDIA_DELIVERY_REVIEW.md
?? docs/codex/reports/WO-010_SECURE_MEDIA_DELIVERY_FOUNDATION_REPORT.md

$ git branch --show-current
architecture-refactor
```

These are the uncommitted WO-010 foundation changes that existed before this focused validation. They were preserved. No branch or Git-history operation was performed.

## API Resolver URL

The API example configures:

```text
MEDIA_PUBLIC_ORIGIN=http://localhost:4000/api/v1
```

`PublicMediaResolverService` parses that URL, removes only a trailing slash from its pathname, and appends:

```text
/public/media/<publicId>/v/<contentVersion>/<purpose>
```

Therefore, for a card rendition, the exact emitted local URL shape is:

```text
http://localhost:4000/api/v1/public/media/<publicId>/v/<contentVersion>/card
```

The exact emitted pathname is:

```text
/api/v1/public/media/<publicId>/v/<contentVersion>/card
```

The static assertion used a valid 22-character public ID and produced:

```text
http://localhost:4000/api/v1/public/media/AbCdEfGhIjKlMnOpQrStUv/v/1/card
```

## API Controller Route

The route is composed from:

```text
Global prefix:  api/v1
Controller:     public/media
GET template:   :publicId/v/:contentVersion/:variant
```

The exact mounted route is therefore:

```text
/api/v1/public/media/:publicId/v/:contentVersion/:variant
```

For the resolver's `card` purpose, `variant=card`, so its emitted URL addresses this route exactly.

## Storefront Next Image Pattern

The Storefront example configures the same base URL:

```text
STOREFRONT_MEDIA_ORIGIN=http://localhost:4000/api/v1
```

`apps/storefront/next.config.ts` derives its pattern by preserving the configured `/api/v1` base pathname and appending `/public/media/**`.

The resulting local pattern is:

```text
protocol: http
hostname: localhost
port: 4000
pathname: /api/v1/public/media/**
search: ""
```

There is no wildcard hostname. The wildcard is confined to descendants of the exact media-route pathname and is required for the public ID, version, and fixed variant segments.

## Exact Path Matching Result

| Boundary | Exact value |
| --- | --- |
| Resolver pathname | `/api/v1/public/media/<publicId>/v/<contentVersion>/card` |
| Mounted controller route | `/api/v1/public/media/:publicId/v/:contentVersion/:variant` |
| Next Image allowed pathname | `/api/v1/public/media/**` |
| Origin | `http://localhost:4000` in local development |
| Match | **TRUE** |

The static assertion verified that the concrete resolver pathname begins with the exact allowed media-route prefix and that its segments match the controller template. A valid local resolver URL is accepted by Next Image.

## Correction Applied or No Correction Required

**No correction required.**

The implementation already derives the correct pathname dynamically and safely from the complete configured base URL. Changing the pattern to `/public/media/**` would remove the required `/api/v1` prefix and create the mismatch described in the Work Order. Broadening it beyond `/api/v1/public/media/**` is unnecessary and was not done.

No API, Storefront, Prisma, migration, catalog, Product, quality, storage-adapter, environment, or dependency source file was modified in this focused validation. Only this report was created.

## Production Fail-Closed Confirmation

- API media delivery defaults to `MEDIA_DELIVERY_MODE=disabled`.
- With production mode, no configured media origin, and the default disabled mode, a compiled resolver assertion returned null before repository access.
- The resolver does not invent a hostname or fallback URL.
- Storefront produces an empty `remotePatterns` array when `STOREFRONT_MEDIA_ORIGIN` is absent.
- Outside development, Storefront rejects a non-HTTPS configured media origin.
- API `public` delivery mode likewise requires an HTTPS origin.
- HTTP and loopback origins are allowed only by the explicit local-development policies.
- No production media hostname appears in configuration or examples.

## Validation Commands and Results

| Validation | Result |
| --- | --- |
| `git status --short` | Passed; existing uncommitted WO-010 scope recorded. |
| `git branch --show-current` | Passed; `architecture-refactor`. |
| Static resolver/controller/Next configuration assertion | Passed; exact paths and local origin match. |
| Storefront TypeScript `--noEmit` | Passed. |
| API TypeScript `--noEmit` | Passed. |
| Storefront ESLint | Passed. |
| API ESLint | Passed. |
| Storefront Next production build | Passed; existing non-blocking flat-ESLint-plugin warning remains. |
| API Nest build | Passed. |
| Compiled production resolver fail-closed assertion | Passed; null returned without repository access. |
| Exact-host/HTTPS/empty-allowlist static policy scan | Passed. |
| Browser leakage scan | Passed; no raw media/storage field in Storefront or shared packages. |
| Arbitrary media URL proxy scan | Passed; no outbound fetch/request in Media module. |
| `git diff --check` | Passed before report creation and repeated in final scope validation. |

The focused validation did not connect to a database or exercise binary delivery, because neither was required to prove route-string/configuration equivalence.

## Files Modified

Created in this focused validation:

- `docs/codex/reports/WO-010_MEDIA_ROUTE_CONFIGURATION_VALIDATION_REPORT.md` — records the exact route derivation, matching assertion, validation results, and no-correction decision.

No application source or configuration file was modified. All other working-tree entries are preserved WO-010 foundation changes from before this focused validation.

## Explicit Out-of-Scope Confirmation

No Prisma schema/model, migration, database, ProductMedia value, Product quality rule, Media registry, storage adapter, provider/CDN, dependency, route, public contract, catalog behavior, or new feature was changed. No migration/database command, upload, binary media runtime test, provider setup, commit, push, merge, rebase, branch switch/creation, deletion, reset, or destructive Git command was performed.

## Git Status

- Active branch: `architecture-refactor`.
- Existing uncommitted WO-010 foundation changes remain intact.
- This report is the only new working-tree file from the focused route validation.
- No source correction was added because the exact runtime paths already match.
- No commit or push was performed.

## Action Items

1. Review and approve this no-correction validation result with the uncommitted WO-010 foundation.
2. Keep API and Storefront media base-origin values aligned, including `/api/v1`, in local development.
3. Do not broaden the exact `/api/v1/public/media/**` Storefront pathname.
4. Continue to require separate approval before Media Data Migration, production provider/origin, upload, or product-detail work.
