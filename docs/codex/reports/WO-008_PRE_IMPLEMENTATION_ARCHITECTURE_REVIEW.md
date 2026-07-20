# WO-008 Pre-Implementation Architecture Review

> Project: Fardad Enterprise Platform  
> Requested work order: WO-008 — Platform Configuration & Storefront Foundation  
> Review date: 2026-07-20  
> Scope: Read-only architecture review and implementation planning  
> Status: Awaiting explicit implementation approval

> Identifier reconciliation: This review was originally prepared as WO-007. It is superseded as WO-008 to avoid collision with the pre-existing `WO-007_CATEGORY_ATTRIBUTE_SYSTEM.md`; that existing work order remains unchanged.

## Executive Summary

The repository is technically buildable today, but it is **READY WITH BLOCKERS** for the requested WO-007. The existing `apps/web` public application, shared packages, admin application, and API all type-check; the three application production builds also complete successfully. The requested target has two unresolved ownership conflicts that must be approved before implementation: the canonical public frontend is presently `apps/web`, not `apps/storefront`, and the repository already assigns `WO-007` to the category and attribute system.

WO-007 can establish a reusable internal commerce-foundation layer without turning Fardad into a multi-tenant SaaS. The safe approach is to migrate the existing public app to the approved `apps/storefront` boundary, separate generic contracts and primitives from Fardad values, and keep all business/data operations behind the Nest API. It must not add Prisma models, migrations, checkout, pricing, inventory, orders, analytics collection, or public package/billing flows.

## Strategic Scope Confirmation

The reviewed platform vision in `docs/architecture/product/platform/fardad-modular-platform-architecture.md` supports reusable modules, store-specific configuration, and capability activation. It does not require a marketplace, visual builder, public SaaS control plane, or current multi-tenancy. Fardad remains the first independently deployable Persian handicrafts storefront.

The intended WO-007 deliverable is therefore limited to:

- reusable presentation/configuration contracts and primitives;
- one Fardad profile configured by the storefront application;
- a server-first RTL storefront shell with responsive, accessible header/footer/layout and route-state boundaries; and
- a configuration-shaped navigation adapter that can later use an authenticated admin-managed API source without changing the presentation contract.

`apps/api` remains the sole business-logic and authoritative data-access boundary. No frontend application or shared package may import Prisma, `@prisma/client`, API repositories, API services, or API source files.

## Repository State

### Git and workspace state

- Active branch: `architecture-refactor`.
- `git status --short` was empty before this review report was created; no pre-existing tracked or untracked changes were observed.
- Repository instructions: no `AGENTS.md` file exists in the repository tree. The applicable reporting location is established by `docs/codex/implementation/reporting-policy-setup.md` as `docs/codex/reports/`.
- Workspace globbing is `apps/*` and `packages/*` in `pnpm-workspace.yaml`.
- Declared workspaces are currently `apps/api`, `apps/admin`, `apps/web`, `packages/config`, `packages/types`, `packages/ui`, and `packages/utils`. `apps/storefront` and `apps/worker` do not exist.

### Validation performed

The local `pnpm` launcher could not be used because PowerShell blocks `pnpm.ps1`; the `pnpm.cmd` retry was refused by Corepack because it could not verify/fetch the locked pnpm 10.0.0 signature. No packages were installed or changed. The checked-in local toolchain was used directly instead.

| Check | Result | Notes |
| --- | --- | --- |
| `tsc --noEmit -p packages/config/tsconfig.json` | Passed | Local TypeScript binary |
| `tsc --noEmit -p packages/types/tsconfig.json` | Passed | Local TypeScript binary |
| `tsc --noEmit -p packages/utils/tsconfig.json` | Passed | Local TypeScript binary |
| `tsc --noEmit -p packages/ui/tsconfig.json` | Passed | Local TypeScript binary |
| `tsc --noEmit -p apps/web/tsconfig.json` | Passed | Current public frontend |
| `tsc --noEmit -p apps/admin/tsconfig.json` | Passed | Current admin app |
| `tsc --noEmit -p apps/api/tsconfig.json` | Passed | Current API |
| `next build` in `apps/web` | Passed | The current storefront-equivalent build; emits the known non-blocking flat-ESLint Next-plugin warning |
| `next build` in `apps/admin` | Passed | Emits the same non-blocking warning |
| `nest build` in `apps/api` | Passed | API compilation passed |

There is no `apps/storefront` workspace to build. Thus the current `apps/web` is buildable but cannot yet validate the requested canonical path. The root Turbo commands are declared, but cannot currently be exercised through the locked package manager in this environment; their prior WO-005/WO-006 reports record successful workspace commands.

### Existing implementation inventory

| Area | Existing reusable or related files | Assessment |
| --- | --- | --- |
| Public application | `apps/web/app/layout.tsx`, `page.tsx`, `globals.css`, home and layout components | A small RTL Fardad landing page; currently the only public frontend |
| Shared configuration | `packages/config/src/{company,navigation,seo,site,theme}.ts` | Contains Fardad values and a navigation type; not reusable store configuration |
| Shared UI | `packages/ui/src/{Badge,Button,Card,Container,Heading,Image,Section}.tsx` | Reusable intent, but token names such as `primary`, `luxury`, and Fardad styling assumptions leak into the package |
| Shared types | `packages/types/src/index.ts` | Empty placeholder; no cross-application contracts yet |
| Shared utilities | `packages/utils/src/index.ts` | `cn`, Persian price formatting, and slug generation; only `cn` is clearly general-purpose as currently designed |
| API data boundary | `apps/api/prisma/schema.prisma`, `apps/api/src/database/*` | Prisma ownership is correctly centralized in API |
| Product foundations | `apps/api/src/product/*` | WO-005 product/data-quality foundation; no public controller |
| Product experience | `apps/api/src/product-experience/*` | WO-006 backend-only gift, add-on, configuration, bundle-rule, logistics, and event-definition foundation |
| Admin | `apps/admin/app/*`, `apps/admin/components/dashboard/*` | Separate buildable dashboard shell; no storefront/API integration yet |

## Existing Work Order Compatibility

The reports and available implementation files for WO-000 through WO-006 were reviewed, as were the available associated work orders. Compatibility findings follow.

- WO-000 describes the pre-monorepo state and its original duplicate Prisma/frontend issues. WO-001 reconciliation completed the workspace migration: current authoritative Prisma ownership is now `apps/api/prisma/schema.prisma`, public frontend code is `apps/web`, and shared packages exist.
- WO-002 establishes the database foundation. WO-003 and WO-004 establish authentication and RBAC in the API. WO-007 must not bypass these layers or move database ownership from the API.
- WO-005 owns the product core, typed attributes/categories, publication readiness, and product data-quality system. It deliberately contains no public product controller. WO-007 must not recreate product/category/attribute types, media storage, publication rules, or data-quality logic.
- WO-006 owns the backend-only Product Experience extension foundation: gift boxes, add-on services, product configurations, bundle-rule contracts, logistics, and anonymous event definitions. It explicitly does not include frontend UI, pricing execution, checkout, order flow, inventory workflow, or analytics collection. WO-007 may define only capability visibility contracts and must not expose these incomplete extensions.
- Existing `docs/codex/work-orders/WO-007_CATEGORY_ATTRIBUTE_SYSTEM.md` independently labels itself `WO-007` and requests a category/attribute implementation. Its broad intended domain is already substantially represented by WO-005. The newly requested document uses the same work-order ID for a distinct configuration/storefront foundation. This is a documentation/approval collision, not a code collision.

## Architecture Validation

### Review questions and answers

1. **Is the repository currently ready to implement WO-007 safely?** **READY WITH BLOCKERS.** Builds/type checks pass and API/Prisma ownership is sound, but the public-app rename/migration and WO identifier collision need an explicit decision first.
2. **Is `apps/storefront` the canonical public frontend?** **No.** It does not exist. `apps/web` (`@fardad/web`) is the current buildable public frontend.
3. **Are there legacy or parallel frontend/API paths that could create duplicate ownership?** There is no second current frontend/API implementation path. Creating `apps/storefront` beside `apps/web` would create parallel public ownership; WO-007 must migrate rather than clone. The legacy root prototype noted in WO-000 is no longer present as active source.
4. **Is `packages/config` currently appropriate for reusable store configuration?** **No.** It is a Fardad profile masquerading as a shared package: company identity, brand SEO, navigation labels/routes, theme values, currency, and site URL are hard-coded there.
5. **Is `packages/ui` currently free of Fardad-specific assumptions?** **No.** It references Fardad-named Tailwind tokens (`primary`, `secondary`, `luxury`) and visual effects, so it renders only when a consuming app defines the Fardad palette/shadow/radius conventions.
6. **Are shared package dependency directions valid?** Only partially. `@fardad/ui -> @fardad/utils` is valid. `@fardad/config` has no dependency on a contracts package and declares its own navigation interface. `@fardad/types` is unused. Apps depend on packages correctly, but the public app still carries the brand implementation under a generic `web` name.
7. **Can current build/test commands validate all affected workspaces?** Type checks and production builds can be run from the checked-in local binaries and passed. Root `pnpm`/Turbo validation is currently blocked by the Windows policy/Corepack signature verification issue. There are no test scripts in the application/package manifests, so no automated test suite exists to validate the future foundation.
8. **What exact blockers must be resolved before implementation?** See the approval gate below.
9. **What exact implementation sequence should be followed?** See Implementation Sequence below.
10. **What must explicitly remain outside WO-007?** See Explicit Out-of-Scope Items below.

### API and database boundary

The current frontend has no direct Prisma import; its content is static/config-driven. `PrismaService`, API repositories, and the sole schema are correctly within `apps/api`. A future storefront API client must call versioned HTTP endpoints using environment-provided origins and typed transport contracts only. It must never import `apps/api` source or share database-generated types.

## Current Gaps

1. The approved target names `apps/storefront`, but the actual public app is `apps/web`; a clone would duplicate ownership.
2. The approved target includes `apps/worker`; it is absent. No worker is needed for the shell itself, so operational worker scaffolding should remain outside WO-007 unless an explicit architecture decision requires an empty workspace now.
3. Shared configuration is Fardad-specific and shared UI is style-token-coupled to Fardad.
4. No store, brand, theme-token, feature-capability, navigation, or SEO-default contracts exist in `packages/types`.
5. Navigation is static and direct-imported into a Client Component. It has no visibility/capability rules, source adapter, or admin-management migration path.
6. The public shell lacks reusable responsive/mobile navigation, full route loading/error/not-found coverage, metadata helpers, canonical/robots defaults, semantic skip navigation, and accessibility behavior.
7. No API endpoint exists for store settings or managed navigation. WO-007 must not invent database models or a competing configuration domain to solve this.
8. There is no automated test task. The web/admin builds warn that the Next.js ESLint plugin is not detected in the flat ESLint configuration.
9. Shared UI has an incomplete export model for organized subpaths and no component tests or accessibility checks.

## Conflict and Duplication Check

| Finding | Risk | Required resolution |
| --- | --- | --- |
| Requested `WO-007` conflicts with `WO-007_CATEGORY_ATTRIBUTE_SYSTEM.md` | Reports, approvals, and implementation claims could refer to two unrelated changes | Approve a superseding identity, e.g. record this as `WO-007A`/a new WO number, or explicitly mark the existing document superseded. Do not overwrite it. |
| `apps/web` versus approved `apps/storefront` | Two public frontends could diverge | Approve a one-time move/rename of `apps/web` to `apps/storefront` and package rename to `@fardad/storefront`; do not retain two live applications. |
| Fardad values in `packages/config` and `packages/ui` | Future storefronts inherit Fardad branding and cannot vary safely | Move values to the Fardad app profile; make packages contract- and token-driven. |
| Backend product-experience definitions exist without public flows | Disabled/incomplete capabilities might appear in navigation or shell | Model capabilities separately from implementation availability; default all unimplemented UI capabilities to hidden. |
| `apps/worker` absent | Target directory set is incomplete | Decide whether an empty worker workspace belongs in this foundation or defer it until a queue/job work order. No worker logic belongs here. |

## Proposed File-Level Change Plan

No items in this section are changed by this review. Paths marked **move** happen only after the approval gate and preserve the current implementation before refactoring it.

### Application migration and storefront files

| Action | File or path | Responsibility |
| --- | --- | --- |
| Move | `apps/web/` → `apps/storefront/` | Make the existing public Next.js app the sole canonical storefront; preserve history and avoid a parallel frontend. |
| Modify after move | `apps/storefront/package.json` | Rename package to `@fardad/storefront`; retain only storefront dependencies and scripts. |
| Modify after move | `apps/storefront/app/layout.tsx` | Server root layout: resolve Fardad profile, emit RTL document attributes and shared metadata defaults. |
| Modify after move | `apps/storefront/app/page.tsx` | Compose the existing home content inside the new server-rendered storefront shell; no commerce page implementation. |
| Modify after move | `apps/storefront/app/globals.css` | Establish only application-level CSS variable assignments, global reset/focus styling, and RTL-safe defaults from the Fardad token profile. |
| Create | `apps/storefront/app/(public)/layout.tsx` | Server public shell composing `StorefrontHeader`, main landmark, and `StorefrontFooter`. |
| Create | `apps/storefront/app/loading.tsx` | Server route loading-state foundation using generic UI primitives. |
| Create | `apps/storefront/app/not-found.tsx` | Server accessible not-found foundation. |
| Create | `apps/storefront/app/error.tsx` | Required Client Component error boundary with a localized retry action. |
| Create | `apps/storefront/src/config/fardad-store.ts` | The only Fardad profile: identity, locales, URL, SEO defaults, navigation seed, Fardad token values, and explicitly enabled capability set. |
| Create | `apps/storefront/src/config/fardad-navigation.ts` | Fardad-specific static navigation seed that satisfies the shared contract; contains Persian labels and routes, not reusable UI. |
| Create | `apps/storefront/src/config/fardad-features.ts` | Fardad deployment's enabled and publishable capability settings; incomplete product-experience UI remains false/hidden. |
| Create | `apps/storefront/src/lib/storefront-config.ts` | Server-only composition/validation of the app profile with generic defaults; no database access. |
| Create | `apps/storefront/src/lib/navigation.ts` | Server-side navigation resolver; starts from Fardad static configuration and later delegates to the same HTTP contract. |
| Create | `apps/storefront/src/lib/metadata.ts` | Pure conversion from shared SEO/store contracts to Next.js Metadata; canonical and robots defaults remain app-owned. |
| Create | `apps/storefront/src/lib/api/server-client.ts` | `server-only` API fetch boundary; typed HTTP request/response decoding, request tags/revalidation policy, no Prisma. |
| Create | `apps/storefront/src/lib/api/browser-client.ts` | Minimal browser fetch boundary for a future approved interactive feature; not used unless client interaction requires it. |
| Create | `apps/storefront/components/layout/StorefrontHeader.tsx` | Server component that receives profile/navigation data and composes generic header primitives. |
| Create | `apps/storefront/components/layout/StorefrontFooter.tsx` | Server component using profile-provided legal/contact/social data. |
| Create | `apps/storefront/components/layout/MobileNavigation.tsx` | Small Client Component for disclosure state, focus handling, Escape, and mobile navigation behavior. |
| Modify after move | `apps/storefront/components/layout/{Header,Navbar,Footer}.tsx` | Replace or retire their direct imports of shared Fardad config; do not leave duplicate shell components. |
| Modify after move | `apps/storefront/{tailwind.config.ts,next.config.ts,tsconfig.json}` | Update moved paths, package scan paths, remote-image policy and aliases only as required by the approved migration. |

### Shared contracts, configuration, UI, and helpers

| Action | File | Responsibility |
| --- | --- | --- |
| Create | `packages/types/src/storefront.ts` | Store identity, brand profile, locale/direction, contact, social, logo reference, design-token, SEO-default, and navigation-source contracts. |
| Create | `packages/types/src/navigation.ts` | Framework-free `NavigationItem`, visibility, target, nesting, and capability-requirement contracts. |
| Create | `packages/types/src/capabilities.ts` | Capability identifiers and Base/Plus/Pro/Enterprise entitlement shape; no price, subscription, or billing data. |
| Create | `packages/types/src/api.ts` | Framework-neutral HTTP envelope/error and future managed-navigation response contracts; no database/generated types. |
| Modify | `packages/types/src/index.ts` | Explicitly export the public contracts above. |
| Create | `packages/config/src/capabilities.ts` | Generic capability registry, package-to-capability mapping, and capability-resolution defaults. It contains no Fardad enabled values. |
| Create | `packages/config/src/storefront-defaults.ts` | Generic language/direction, SEO, and token fallback factories/validators; no brand names, routes, Persian copy, or domain URL. |
| Create | `packages/config/src/navigation.ts` | Generic static-navigation source adapter and validation helpers; replaces the current Fardad navigation data file. |
| Modify | `packages/config/src/{company,site,seo,theme}.ts` | Remove/migrate Fardad data into `apps/storefront/src/config`; retain only generic factories if useful, otherwise delete only after imports are updated and migration is approved. |
| Create | `packages/ui/src/SkipLink.tsx` | Generic accessible skip-to-content primitive. |
| Create | `packages/ui/src/Navigation.tsx` | Generic semantic navigation/list/link rendering from contract-supplied labels and destinations; no brand copy or route definitions. |
| Create | `packages/ui/src/SiteHeader.tsx` | Generic header layout slots for brand, desktop navigation, and actions. |
| Create | `packages/ui/src/SiteFooter.tsx` | Generic footer layout slots for identity, navigation groups, legal, and social links. |
| Create | `packages/ui/src/ResponsiveContainer.tsx` | Token-neutral width/gutter layout primitive. |
| Create | `packages/ui/src/PageState.tsx` | Generic loading, empty/not-found, and error-state presentation primitives. |
| Modify | `packages/ui/src/{Badge,Button,Card,Container,Heading,Section}.tsx` | Replace Fardad palette/radius/shadow assumptions with semantic CSS variables, neutral defaults, documented variants, and supplied content. |
| Modify | `packages/ui/package.json` | Add only required package dependency on `@fardad/types` if component props use contracts; revise exports for all public entry points. |
| Create | `packages/utils/src/capabilities.ts` | Pure capability intersection/visibility predicates (`entitled ∩ enabled ∩ implemented`). |
| Create | `packages/utils/src/navigation.ts` | Pure tree/filter helpers that omit disabled, unauthorized, or unavailable navigation items. |
| Create | `packages/utils/src/locale.ts` | Direction/locale-safe pure formatting and text-direction helper functions. |
| Modify | `packages/utils/src/index.ts` | Export only the public pure helpers. Review `formatPrice` and `generateSlug` for store-specific assumptions before retaining them. |
| Modify | `packages/config/package.json`, `packages/types/package.json`, `packages/utils/package.json` | Declare only workspace dependencies required by the final one-way graph and add appropriate public exports. |

### Repository manifests and supporting files

| Action | File | Responsibility |
| --- | --- | --- |
| Modify | `pnpm-lock.yaml` | Update only as a consequence of the approved app move/package dependency changes; no package installation. |
| Modify if required | root `package.json` | Update any explicit package filter/name reference only if one exists after the rename. |
| Create only if approved separately | `apps/worker/package.json`, `apps/worker/tsconfig.json` | Empty future worker workspace boundary; no queue, processor, database, or runtime implementation in WO-007. |

## Dependency Rules

The implementation must enforce this direction:

```text
apps/storefront ─┬─> packages/ui ───> packages/types
                 ├─> packages/config ─> packages/types
                 ├─> packages/utils ──> packages/types (only if needed)
                 └─> HTTP /api/v1 ────> apps/api ───> Prisma/PostgreSQL

apps/admin ──────┬─> packages/ui/config/types/utils
                 └─> HTTP /api/v1 ────> apps/api

apps/worker ──────────────────────────> apps/api public application contracts or
                                         dedicated future infrastructure boundary
```

Rules:

- `packages/types` is framework-, database-, and brand-independent.
- `packages/utils` is framework-, database-, and brand-independent; it may consume types but not configuration values.
- `packages/config` may consume types and provide generic defaults/validation; it must not consume UI, application packages, Prisma, or Fardad copy.
- `packages/ui` may consume types/utils but not config, application packages, API code, database code, Fardad assets, or hard-coded brand values.
- Applications own their profiles, copy, asset references, environment values, and Next.js integration. They may consume shared packages and communicate with the API over HTTP only.
- `apps/api` owns controllers, services, repositories, Prisma client/schema/migrations, persistence models, validation of managed configuration, and eventual settings/navigation administration.

## Store Configuration Design

`packages/config` should define generic configuration structure and defaults, while `packages/types` owns the serializable contracts. A profile is a value supplied by a consuming application, not a global mutable store record:

```ts
type StorefrontProfile = {
  identity: StoreIdentity;
  brand: BrandProfile;
  design: DesignTokenSet;
  seo: SeoDefaults;
  navigation: NavigationSource;
  capabilities: CapabilityAvailability;
};
```

The Fardad profile belongs in `apps/storefront/src/config`. It contains `Fardad`, Persian copy, `fa-IR`, `rtl`, `fardad.ir`, contact/social data, logo/asset references, its token values, and its static initial navigation. Reusable components consume semantic tokens or data props, never `Fardad`, an Iranian craft category, `fa-IR`, a Fardad color hex, or a Fardad route.

Navigation starts as `NavigationSource = { kind: "static", items }`. The resolver returns a normalized `NavigationItem[]`. Later, an API-owned CMS/settings work order may expose `GET /api/v1/storefront/navigation` (or an approved equivalent); the source changes to `{ kind: "managed", endpoint }` while `StorefrontHeader`, `Navigation`, and page composition continue to receive the identical normalized contract. Management, persistence, authorization, audit logging, and cache invalidation are API responsibilities and are not implemented in WO-007.

## Fardad Brand Boundary

The following data moves from shared configuration into the Fardad storefront profile: `company`, `site`, `seo`, `theme`, and `navigation` values currently in `packages/config/src`. The move includes Persian display copy, domain/currency/timezone, SEO keywords, social/contact information, palette, radius/shadow choices, and the existing public route list.

The following can be shared: type definitions, capability IDs, generic default factories, semantic layout primitives, CSS-variable-based component contracts, and pure navigation/capability filtering. The shared UI package must receive labels, hrefs, logo slots, legal text, token variables, and navigation items as props or slots.

## Feature Flag Strategy

Capability flags are a deployment configuration concern, not a pricing or UI concern. Define stable identifiers grouped by package boundaries:

- **Base:** `catalog.products`, `catalog.shop`, `content.articles`, `content.news`, `content.digitalCatalog`, `pages.about`, `pages.contact`, `account.foundation`.
- **Plus:** `product.intelligence`, `gift.experience`, `gift.boxes`, `gift.addonServices`, `product.configuration`.
- **Pro:** `marketing.intelligence`, `crm.foundation`, `analytics.advanced`.
- **Enterprise:** `corporate.sales`, `intelligence.aiBi`, `platform.multiWebsite`.

The generic registry maps edition labels to allowed capability identifiers. It does not contain prices, checkout/subscription flows, customer entitlements, or UI components. The Fardad profile expresses which capabilities are intentionally enabled. Presentation visibility is the intersection of: (1) edition entitlement, (2) Fardad deployment enablement, and (3) implemented/publishable storefront support. This third condition prevents the UI from displaying WO-006 data foundations that have no public API or user flow. The API independently enforces all authorization and business policy; a navigation flag is never a security control.

## Storefront Foundation Plan

### Server and Client Components

- Server Components: root/public layouts, home composition, profile loading, metadata conversion, navigation resolution, static header/footer composition, loading and not-found views, and API server client. They keep configuration and HTTP credentials/server-only concerns out of the browser bundle.
- Client Components: only interactive boundaries such as `MobileNavigation` and the required Next.js `error.tsx` boundary. They receive already-normalized data and contain disclosure/focus/retry state only.
- Do not add a global client provider for static configuration or navigation. Do not fetch initial navigation from a client effect.

### RTL, SEO, accessibility, and mobile behavior

- The root layout sets `lang="fa"` and `dir="rtl"`; component CSS uses logical properties (`margin-inline`, `padding-inline`, `text-align: start/end`) and avoids directional left/right assumptions.
- Fardad profile tokens are emitted as scoped CSS custom properties. Shared UI uses semantic variables and supports consuming applications with a different visual identity.
- Metadata is generated from the Fardad profile through a single app helper. Include title templates, descriptions, canonical/base URL, Open Graph locale/site name, robots defaults, and a future-compatible schema-data seam. Sitemap, robots route, JSON-LD content models, and SEO management remain separate work.
- Header uses landmark semantics, an accessible name, keyboard-operable mobile disclosure, visible focus styles, Escape-to-close, and a skip link to a unique main landmark. Footer uses semantic navigation groups and accessible link labels.
- Responsive primitives use mobile-first fluid gutters and constrained content width. The mobile navigation client boundary must be touch-friendly and must not duplicate desktop links in the accessibility tree when closed.

## Validation Plan

After approval and implementation, run the following without database migration actions:

```powershell
pnpm --filter @fardad/config typecheck
pnpm --filter @fardad/types typecheck
pnpm --filter @fardad/utils typecheck
pnpm --filter @fardad/ui typecheck
pnpm --filter @fardad/storefront typecheck
pnpm --filter @fardad/admin typecheck
pnpm --filter @fardad/api typecheck
pnpm --filter @fardad/storefront lint
pnpm --filter @fardad/storefront build
pnpm --filter @fardad/admin build
pnpm --filter @fardad/api build
pnpm lint
pnpm typecheck
pnpm build
git status --short
```

Add focused tests as part of implementation only if the test runner foundation is approved: pure capability visibility tests; navigation normalization/filtering tests; profile/default validation tests; and an accessibility-oriented component test for header keyboard/mobile behavior. In manual browser verification, check RTL desktop/tablet/mobile widths, keyboard traversal, focus visibility, mobile menu behavior, no capability-gated link leakage, title/canonical metadata, loading/not-found/error routes, and absence of Prisma/API-source imports outside `apps/api`.

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Public app rename breaks deployment/import paths | Treat as a single `git mv`-style migration; update package name/configuration in one review; do not retain an `apps/web` clone. |
| Work-order collision produces ambiguous audit history | Obtain a written supersession/new-ID decision before code changes; retain the old document unchanged. |
| Shared UI remains dependent on Tailwind names defined only by Fardad | Use semantic CSS variables/neutral classes and test the package through the storefront build with a distinct token fixture where practical. |
| Static settings grow into unauthorized frontend business logic | Keep static values in the app profile; move only persisted/admin-managed settings into an approved API module later. |
| Flags accidentally expose incomplete Plus features | Default to hidden; require explicit implementation/publishability in addition to enabled capability. |
| Server/client boundary leaks secrets or makes shell slow | Keep profile/navigation server-rendered and send only normalized public data to the small interactive component. |
| No automated tests / package-manager validation is blocked locally | Use direct local binaries for this phase, remediate Corepack/PowerShell policy outside WO-007, and add focused tests only when the harness is approved. |
| Existing Next ESLint-plugin warning becomes overlooked | Treat the warning as non-blocking but resolve flat ESLint integration in a dedicated tooling-quality scope or explicitly include it in an approved change. |

## Explicit Out-of-Scope Items

- Public SaaS, tenant onboarding, tenant isolation, marketplace features, visual website builder, subscriptions, billing, package purchase, or package pricing.
- Prisma schema/model changes, migrations, seeds, database connections, direct frontend Prisma access, or a competing configuration persistence model.
- API business endpoints, admin settings UI, navigation management API, authorization changes, audit-log implementation, or cache invalidation implementation.
- Product/category/attribute reimplementation; product data-quality changes; media service; gift box/add-on/configuration data changes; bundle evaluation; pricing/taxes/discounts; cart, checkout, orders, payments, inventory, shipping, invoices, or customer workflows.
- Analytics event collection/identity linkage/pipeline/dashboard, CRM, marketing automation, corporate sales, AI/BI, search engine, recommendations, or multi-website runtime support.
- Full Base-package page implementation (shop, product details, search, article/news/catalog/about/contact/cart/auth/account); WO-007 creates only foundations they can consume.
- Worker runtime, queues, processors, scheduled jobs, or database/background-task integration.
- Package installation, lockfile-only dependency upgrades, commits, pushes, branches, rebases, and unrelated cleanup.

## Implementation Sequence

1. Resolve the two mandatory approval-gate decisions: work-order identity and public-app migration (`apps/web` → `apps/storefront`). Decide whether an empty `apps/worker` workspace is required now.
2. Move/rename the public app as one controlled change; update its package name and only necessary workspace/lockfile references; verify no `apps/web` duplicate remains.
3. Add brand-independent contracts to `packages/types`, then generic defaults/capability registry/navigation adapter to `packages/config`, and pure filters to `packages/utils`.
4. Refactor/create token-neutral shared layout/navigation/state primitives in `packages/ui`; remove Fardad visual/data assumptions from all exported primitives.
5. Create the Fardad profile/navigation/capability configuration in `apps/storefront`, migrate existing values from shared config, and update existing home/layout components to consume the profile.
6. Add server-first root/public layouts, metadata helper, navigation resolver, isolated API client boundary, and minimal client mobile/error boundaries.
7. Add route-state foundation and validate responsive RTL, keyboard/accessibility, SEO metadata, capability hiding, type checks, lint, and builds.
8. Write the implementation report, review the exact diff, and stop for review. Do not expand scope into business/API/database work.

## Approval Gate

Implementation must not begin until an authorized approver resolves all of the following in writing:

1. The requested work order may use `WO-007` despite the existing category/attribute WO-007, **or** it is assigned a new/suffixed identity with a corresponding report filename.
2. `apps/web` is approved to move/rename to `apps/storefront` and `@fardad/web` to `@fardad/storefront`, with no parallel public application retained.
3. `apps/worker` is either explicitly deferred to a worker/job work order or an empty workspace scaffold is explicitly included.
4. The project accepts the reported local package-manager validation limitation or provides a verified pnpm/Corepack path for the implementation validation run.

## Action Items

- Architecture owner: resolve the work-order identifier collision and record the decision without replacing the existing WO-007 document.
- Architecture/deployment owner: approve the canonical public-app move and confirm the storefront deployment/package name.
- Architecture owner: decide whether `apps/worker` is a current structural prerequisite or a deferred operational boundary.
- Tooling owner: repair/approve the local pnpm/Corepack verification path so repository-standard Turbo commands can run reliably.
- Implementation owner: begin only after the gate above is approved; use this plan as the bounded file-level scope.
