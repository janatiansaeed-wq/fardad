# WO-008 Platform Configuration & Storefront Foundation Report

> Project: Fardad Enterprise Platform  
> Work order: WO-008 — Platform Configuration & Storefront Foundation  
> Status: Completed  
> Date: 2026-07-20

## Executive Summary

WO-008 is complete. The public frontend was moved—not copied—from `apps/web` to `apps/storefront`, which is now the sole canonical storefront package (`@fardad/storefront`). The implementation establishes framework-free store/navigation/capability contracts, generic configuration and utility foundations, token-neutral shared UI primitives, a Fardad-owned profile, and an RTL server-first storefront shell.

No Prisma schema, migration, seed, API business endpoint, worker, checkout, pricing, order, inventory, or analytics pipeline was changed. Existing WO-005 and WO-006 backend foundations remain untouched and their incomplete public capabilities are not exposed.

## Approved Architecture Decisions

- The storefront foundation uses **WO-008** to avoid collision with the existing category/attribute WO-007.
- `apps/web` was migrated to `apps/storefront`; no active `apps/web` remains.
- `apps/worker` remains explicitly deferred; no worker directory, runtime, queue, or database access was added.
- The local pnpm/Corepack limitation was accepted. No package was installed, upgraded, or fetched; checked-in local binaries were used for equivalent validation.

## Work Order Identity Reconciliation

`docs/codex/reports/WO-007_PRE_IMPLEMENTATION_ARCHITECTURE_REVIEW.md` was renamed to `docs/codex/reports/WO-008_PRE_IMPLEMENTATION_ARCHITECTURE_REVIEW.md`.

Only its work-order heading/identity was updated and a short reconciliation note was added: the review is now WO-008 because `docs/codex/work-orders/WO-007_CATEGORY_ATTRIBUTE_SYSTEM.md` already owns WO-007. The existing category/attribute work order was not modified, renamed, or deleted.

## Public Application Migration

The entire `apps/web/` application was moved to `apps/storefront/`. The package is now named `@fardad/storefront`; no source package or importer references `@fardad/web`, and `apps/web` does not exist.

The migration retained the existing Fardad home content and Next/Tailwind/PostCSS configuration. Obsolete header/footer/navbar implementations and the root `app/page.tsx` were replaced by the new route-group shell so `/` is defined once at `app/(public)/page.tsx` and cannot bypass the public layout.

Root workspace paths remain wildcard-based, so no workspace manifest change was needed. `pnpm-lock.yaml` was changed only for the approved importer rename and new internal workspace dependencies.

## Implemented Shared Contracts

`packages/types` now exports framework-independent contracts for:

- store identity, locale/direction, contact/social details, public assets, brand profile, semantic design tokens, SEO defaults, and storefront profile;
- normalized navigation items/groups and static/future-managed sources;
- Base/Plus/Pro/Enterprise capability identifiers and availability; and
- a minimal framework-neutral API envelope/error shape.

The contracts contain no Prisma, persistence, Next.js, NestJS, billing, tenant, or generated API types.

## Implemented Configuration Foundation

`packages/config` no longer contains the Fardad company, site, SEO, theme, or route values. Its exported content is now generic only:

- edition-to-capability registry and entitlement resolver;
- static-navigation source helper; and
- neutral locale/direction and semantic-token defaults.

The prior Fardad-specific configuration files were removed after their values were moved into `apps/storefront/src/config`. There is now one active Fardad configuration source in the Storefront application.

## Capability Strategy

Stable identifiers were added for every approved Base, Plus, Pro, and Enterprise boundary. The generic registry defines package entitlement only; it contains no price, subscription, billing, package-purchase, or authorization logic.

Visibility is calculated as the intersection of edition entitlement, deployment enablement, and implemented/publishable availability. Fardad currently declares its Base entitlement/enabled capabilities but has an empty publishable capability set because the related Base pages are intentionally outside WO-008. The only navigation item exposed is the implemented home route. All Plus/Pro/Enterprise navigation, including WO-006 gift/configuration extensions, remains hidden. The API remains responsible for all real security and authorization decisions.

## Shared UI Changes

`packages/ui` now exposes generic `SkipLink`, `Navigation`, `SiteHeader`, `SiteFooter`, `ResponsiveContainer`, and `PageState` primitives. They use semantic CSS variables with neutral fallbacks and receive content, labels, routes, and layout slots from consuming applications.

Existing `Badge`, `Button`, `Card`, `Container`, `Heading`, and `Section` were adjusted only to remove Fardad-specific `primary`/`secondary`/`luxury` Tailwind assumptions, use visible focus styles, and maintain compatibility with existing consumers. The shared package imports only types/utilities/Next/React; it contains no Fardad identity, routes, colors, SEO, API, or Prisma import.

## Fardad Brand Boundary

Fardad values now live only in `apps/storefront/src/config`:

- `fardad-store.ts` owns identity, language/direction, approved placeholder contact data, domain, SEO defaults, design tokens, and profile composition;
- `fardad-navigation.ts` owns Persian labels and future route seed data; and
- `fardad-features.ts` owns Fardad edition, deployment enablement, and deliberately empty publishable capability state.

No environment-dependent or sensitive value was added. The profile uses existing approved URL/contact defaults and does not invent final customer information.

## Storefront Shell

The Storefront uses a server-first structure:

- root layout applies profile-derived document language/direction, semantic token variables, and metadata defaults;
- `app/(public)/layout.tsx` supplies the skip link, header, stable main landmark (`main-content`), and footer;
- `app/(public)/page.tsx` preserves the existing home sections under that shell;
- root `loading.tsx`, `not-found.tsx`, and `error.tsx` provide route-state foundations; and
- server configuration/navigation resolvers keep profile/navigation loading out of client effects and avoid global configuration providers.

The current resolver supports the static source and deliberately throws for a managed source until a future approved API work order implements its endpoint. No unused browser API client was created.

## Server and Client Component Boundary

Server Components own profile composition, navigation normalization/filtering, metadata, layouts, header/footer composition, home composition, loading, and not-found output. `src/lib/storefront-config.ts` and `src/lib/navigation.ts` are explicitly `server-only`.

Client Components are limited to `MobileNavigation.tsx` for disclosure state/Escape handling and Next.js `app/error.tsx` for retry behavior. The storefront is not converted into a client-rendered application.

## RTL and Responsive Behavior

The document is `lang="fa"` and `dir="rtl"` from the Fardad profile. Global styling uses semantic tokens and avoids hard-wiring shared components to a direction. Shared alignment uses logical `start`/`end` values; containers use responsive inline gutters and a profile-defined content width.

The header uses a desktop navigation at large widths and a touch-sized mobile disclosure below that breakpoint. Closed mobile links are not mounted in the accessibility tree.

## SEO Foundation

The Storefront metadata helper converts the profile into Next.js metadata: `metadataBase`, default title/template, description, keywords, robots defaults, Open Graph locale, and site name. The foundation does not add a sitemap, CMS SEO management, route-specific SEO, or JSON-LD.

## Accessibility Foundation

- A skip link targets the unique main landmark.
- Header/footer/navigation use semantic landmarks and caller-supplied accessible labels.
- Focus-visible styling is present globally and on interactive UI primitives.
- Mobile navigation sets `aria-expanded`/`aria-controls`, responds to Escape, and removes closed links from the DOM.
- The error/not-found/loading states use descriptive Persian copy and a retry/home action where appropriate.

## Dependency Boundary Validation

The intended dependency direction is enforced in source:

```text
apps/storefront -> packages/config, packages/types, packages/ui, packages/utils
apps/storefront -> HTTP seam only (no current request) -> apps/api -> Prisma/PostgreSQL
packages/config -> packages/types
packages/ui -> packages/types, packages/utils
packages/utils -> packages/types
```

Scans found no `@fardad/web` reference in active source/manifest/config paths, no Prisma/`@prisma/client` import outside `apps/api`, no `apps/api`/`@fardad/api` import in shared packages, and no Fardad name/domain/palette value in `packages/config` or `packages/ui`.

## Files Created

| File | Why |
| --- | --- |
| `packages/types/src/{api,capabilities,navigation,storefront}.ts` | Defines the brand/framework/database-independent contracts used by the new foundation. |
| `packages/config/src/{index,capabilities,storefront-defaults}.ts` | Provides generic exports, capability entitlement mapping, and neutral configuration defaults. |
| `packages/ui/src/{index,SkipLink,Navigation,SiteHeader,SiteFooter,ResponsiveContainer,PageState}.tsx` | Adds the minimum token-neutral shell and route-state primitives. |
| `packages/utils/src/{capabilities,locale,navigation}.ts` | Adds pure visibility, locale, navigation filtering, and normalization helpers. |
| `apps/storefront/src/config/{fardad-store,fardad-navigation,fardad-features}.ts` | Establishes the application-owned Fardad brand/profile/capability values. |
| `apps/storefront/src/lib/{storefront-config,navigation,metadata}.ts` | Establishes server-owned configuration, navigation, and metadata composition. |
| `apps/storefront/components/layout/{StorefrontHeader,StorefrontFooter,MobileNavigation}.tsx` | Composes generic UI with Fardad profile data and isolates mobile interaction. |
| `apps/storefront/app/(public)/{layout,page}.tsx` | Implements the public shell and single home route. |
| `apps/storefront/app/{loading,not-found,error}.tsx` | Adds required application route-state foundations. |
| `docs/codex/reports/WO-008_PLATFORM_CONFIGURATION_STOREFRONT_FOUNDATION_REPORT.md` | Records this implementation, scope, and validation. |

## Files Modified

| File | Why |
| --- | --- |
| `README.md` | Replaces the now-incorrect current public app path with `apps/storefront`. |
| `eslint.config.mjs` | Applies the shared Next ESLint configuration to the moved Storefront path. |
| `pnpm-lock.yaml` | Renames the workspace importer and records required internal workspace dependencies only. |
| `tsconfig.base.json` | Adds monorepo source-path resolution for local equivalent validation while package-manager workspace links are unavailable. |
| `apps/admin/tsconfig.json` | Sets its local base URL so its existing `@/*` alias remains valid after the shared base configuration gained workspace paths. |
| `apps/storefront/{package.json,next.config.ts,tsconfig.json}` | Renames the package, declares types dependency, transpiles shared types, and maintains Storefront/source alias resolution. |
| `apps/storefront/app/{layout.tsx,globals.css}` | Applies profile tokens/metadata/RTL document attributes and global focus-safe styling. |
| `packages/{config,ui,utils}/package.json` | Declares only the internal workspace dependencies now used by each package. |
| `packages/types/src/index.ts` | Explicitly exports the new public contracts. |
| `packages/ui/src/{Badge,Button,Card,Container,Heading,Section}.tsx` | Removes Fardad token coupling and adds semantic/focus-safe behavior. |
| `packages/ui/tsconfig.json` | Includes the new TypeScript public barrel. |
| `packages/utils/src/index.ts` | Exports the new pure helpers and makes `formatPrice` locale-parametric rather than Persian-specific. |
| `docs/codex/reports/WO-008_PRE_IMPLEMENTATION_ARCHITECTURE_REVIEW.md` | Minimal identity reconciliation from WO-007 to WO-008. |

## Files Moved

| From | To | Why |
| --- | --- | --- |
| `apps/web/` | `apps/storefront/` | Approved controlled migration making Storefront the sole canonical public app. Existing home, Next, Tailwind, PostCSS, and TypeScript files were retained and adapted in place. |
| `docs/codex/reports/WO-007_PRE_IMPLEMENTATION_ARCHITECTURE_REVIEW.md` | `docs/codex/reports/WO-008_PRE_IMPLEMENTATION_ARCHITECTURE_REVIEW.md` | Resolves the approved work-order identifier collision without touching the existing category/attribute WO-007. |

## Files Removed

| File/path | Why |
| --- | --- |
| `apps/web/` | Removed by the approved move; retaining it would create a parallel public frontend. |
| `apps/storefront/app/page.tsx` | Replaced by the only `/` route at `app/(public)/page.tsx` so all public content uses the shell. |
| `apps/storefront/components/layout/{Header,Navbar,Footer}.tsx` | Replaced by profile-driven Storefront shell components; removes direct imports of retired shared Fardad configuration. |
| `apps/storefront/src/lib/{constants,env}.ts` | Unused legacy configuration, including stale frontend database/auth environment fields; profile/server boundaries replace their valid concerns. |
| `packages/config/src/{company,seo,site,theme}.ts` | Retired Fardad-specific shared configuration after migration into the app profile. |

## Validation Commands and Results

| Command/check | Result |
| --- | --- |
| `pnpm.cmd --version` | Timed out after 30 seconds (exit 124); no package-manager command was used for validation. PowerShell/Corepack remains unavailable as accepted by this work order. |
| `node_modules/.bin/tsc.cmd --noEmit -p packages/{types,config,utils,ui}/tsconfig.json` | Passed for all four packages. |
| `node_modules/.bin/tsc.cmd --noEmit -p apps/{storefront,admin,api}/tsconfig.json` | Passed for all three applications. |
| `node_modules/.bin/eslint.cmd apps/storefront` | Passed. |
| `node_modules/.bin/eslint.cmd apps/admin` | Passed. |
| `apps/api` local ESLint binary against `src --ext .ts` | Passed. |
| `apps/storefront` local `next build` | Passed. The known non-blocking Next flat-ESLint-plugin detection warning remains. |
| `apps/admin` local `next build` | Passed. The same known non-blocking warning remains. |
| `apps/api` local `nest build` | Passed. |
| App/package boundary scans | Passed: no active `apps/web`, one Storefront `/` page, no active `@fardad/web`, no Prisma outside API, no API application imports in shared packages, and no Fardad values in shared config/UI. |
| `git diff --check` | Passed; no whitespace errors. |

During implementation, the first Storefront build exposed path-alias resolution after the move and the second surfaced a readonly keywords-to-Next metadata type mismatch. Both were corrected before the passing final Storefront build. An initial local package type-check could not resolve the not-yet-installed workspace links for the new types dependency; source-path aliases were added to the shared base configuration, after which all final type checks passed. No dependency installation was performed.

## Known Limitations

- The standard pnpm/Turbo commands cannot run in this environment because `pnpm.ps1` is blocked and `pnpm.cmd`/Corepack does not complete verification. Local checked-in binaries provided equivalent type/lint/build validation.
- Next production builds emit the pre-existing non-blocking warning that the Next ESLint plugin is not detected by the flat ESLint configuration; standalone lint passes.
- Navigation is static configuration only. A future API/CMS work order must implement managed navigation, authorization, persistence, audit, cache invalidation, and the HTTP source implementation.
- Only the implemented home route is publishable. Base/Plus/Pro/Enterprise page capability values remain hidden until their approved pages and API support exist.
- No automated test harness was added because none is currently configured and introducing one exceeds this work order.

## Out-of-Scope Confirmation

No product listing/detail/shop/search/cart/checkout/order/payment/shipping/inventory/pricing/discount/invoice/auth/customer/account/content/admin settings/navigation administration/configuration persistence/API endpoint/database/worker/analytics/CRM/marketing/corporate/AI-BI/multi-site/SaaS/marketplace/builder/subscription/billing work was implemented.

## Git Status

The working tree contains only the WO-008 implementation changes described in this report: the approved `apps/web` to `apps/storefront` migration, shared foundation refactor, Storefront shell/profile, required configuration/lockfile/tooling updates, README correction, and the two WO-008 reports. No commit, push, merge, rebase, branch change, or unrelated user-change discard was performed.

## Risks and Follow-up Work

- Resolve the local pnpm/Corepack verification path before relying on root Turbo commands in CI or developer onboarding.
- Add a test harness in an approved quality/tooling work order, then cover capability intersection, navigation filtering, profile validation, and mobile navigation keyboard behavior.
- Implement Base pages incrementally through approved work orders. Each page must explicitly move its capability into Fardad's `implemented` set only when the route and its public data contract are ready.
- Implement persisted/admin-managed navigation only through the API business boundary; it must retain the normalized navigation contract used by this shell.

## Action Items

1. Review the migration and shared-boundary diff.
2. Approve the Storefront foundation before starting any Base-page work.
3. Address the pnpm/Corepack local verification limitation separately from this feature work.
4. Schedule the next approved Base-page work order; do not expose capability-gated routes until implemented.
