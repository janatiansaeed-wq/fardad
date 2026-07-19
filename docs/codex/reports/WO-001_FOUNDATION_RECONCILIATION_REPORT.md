# WO-001 Foundation Reconciliation Report

> Project: Fardad Enterprise Platform  
> Work Order: WO-001 Foundation Reconciliation  
> Completion date: 2026-07-19  
> Status: Completed — awaiting approval  
> Business features introduced: None

## Executive Summary

The repository has been reconciled into the approved pnpm/Turborepo monorepo layout. The storefront, administration shell, NestJS API, shared UI, shared configuration, shared types boundary, and pure utilities are now independently owned workspace packages.

The API application is the sole Prisma owner. Its canonical schema contains only the PostgreSQL datasource and Prisma client generator; it has no business models. Direct Prisma access from Next.js and the competing schemas were removed.

Existing presentation assets were preserved where they were reusable. Placeholder implementations, hard-coded dashboard data, direct database route prototypes, local upload helpers, and premature business contracts were intentionally not promoted into the new architecture.

## Package Structure

```text
apps/
├── web/                 # Next.js storefront shell, port 3000
├── admin/               # Next.js administration shell, port 3001
└── api/                 # NestJS API, /api/v1, port 4000

packages/
├── ui/                  # Reusable React presentation primitives
├── types/               # Empty public contract boundary for future WOs
├── config/              # Shared brand/site/navigation/SEO/theme config
└── utils/               # Pure shared utility functions
```

Workspace discovery now returns eight projects: the root plus `@fardad/web`, `@fardad/admin`, `@fardad/api`, `@fardad/ui`, `@fardad/types`, `@fardad/config`, and `@fardad/utils`.

### Ownership Boundaries

| Owner | Responsibilities | Forbidden dependencies |
|---|---|---|
| `apps/web` | Storefront routes, layout, frontend-only configuration consumption | Prisma, database access, NestJS internals |
| `apps/admin` | Administration application shell and dashboard presentation | Business modules until their work orders; Prisma |
| `apps/api` | NestJS bootstrap, backend configuration, Prisma schema/client ownership | Frontend components and Next.js routing |
| `packages/ui` | Reusable, business-agnostic React UI primitives | Database and application-specific services |
| `packages/types` | Approved cross-application contracts only | Premature domain/entity definitions |
| `packages/config` | Shared immutable brand and presentation configuration | Secrets and runtime credentials |
| `packages/utils` | Pure reusable functions | Framework/application state and infrastructure access |

## Files Moved

Git may display these as delete/add pairs until staged; the reconciliation mappings are:

### Storefront to `apps/web`

- `app/page.tsx` → `apps/web/app/page.tsx`
- `app/layout.tsx` → `apps/web/app/layout.tsx`
- `app/globals.css` → `apps/web/app/globals.css`
- `components/home/*` → `apps/web/components/home/*`
- `components/layout/*` → `apps/web/components/layout/*`
- `lib/constants.ts` and `lib/env.ts` → `apps/web/src/lib/*`

### Administration to `apps/admin`

- `app/dashboard/*` → `apps/admin/app/dashboard/*`
- Reusable dashboard layout and navigation components from `components/dashboard/*` → `apps/admin/components/dashboard/*`

### API to `apps/api`

- `app/backend/src/main.ts` → `apps/api/src/main.ts`
- `app/backend/src/app.module.ts` → `apps/api/src/app.module.ts`
- Backend environment validation/barrel files → `apps/api/src/config/*`
- Backend package, Nest CLI, and TypeScript ownership were recreated canonically under `apps/api`.

### Shared packages

- `components/ui/*` → `packages/ui/src/*`
- `config/*` → `packages/config/src/*`
- `lib/utils.ts` → `packages/utils/src/index.ts`
- The former root `types` boundary moved to `packages/types`; premature business interfaces were then deprecated, leaving an intentionally empty public boundary.

### Prisma

- The model-free root `database/schema.prisma` became `apps/api/prisma/schema.prisma`.
- The root seed entry point became `apps/api/prisma/seed.ts` and contains no business data.
- `database/README.md` now documents backend-only Prisma ownership.

## Files Preserved

- Storefront root layout, landing-page sections, global RTL styling, navigation, footer, and header.
- Reusable UI primitives: Badge, Button, Card, Container, Heading, Image, and Section.
- Brand/site/theme/SEO/navigation configuration.
- Pure `cn`, price formatting, and slug utilities.
- Administration route states: layout, page, loading, error, and not-found.
- Administration layout primitives and minimal navigation shell.
- Minimal NestJS bootstrap and empty application module.
- Backend environment parsing foundation.
- PostgreSQL datasource and Prisma client generator with no models.
- Root pnpm/Turborepo scripts, formatting, Git hooks, and governance documentation.

Preserved files were updated only where required for package imports, RTL-safe application shells, versioned API prefixing, or independent compilation.

## Files Deprecated

The following were removed from active source ownership because retaining them would misrepresent incomplete features or violate the approved boundaries:

- Root Next.js product/category API handlers that accessed Prisma directly.
- Root Next.js Prisma singleton.
- Local filesystem upload, media, and storage helpers; object storage belongs to a later media work order.
- Root authentication route constants/helper and middleware placeholder; authentication belongs to WO-003/WO-004.
- The root `modules/product` placeholder tree.
- Provisional Product, Order, User, and CMS TypeScript contracts; future contracts require their domain work orders.
- Backend auth/JWT placeholders.
- One-line placeholder cache, Redis, Prisma repository/service, health, logging, guards, filters, pipes, Swagger, and validation classes.
- Duplicate `app/backend/src/config/index (1).ts`.
- Competing `app/backend/prisma/schema.prisma`, including its premature CUID User entity.
- Hard-coded dashboard metric/activity/status widgets and unused menu/user components.
- Obsolete root Next.js, Tailwind, and PostCSS configurations after application-local configuration was established.
- Obsolete singular `app/backend` manifest/configuration and root application placeholders.

No deprecated business prototype was replaced with a new business feature.

## Workspace and Configuration Changes

- Added manifests and isolated TypeScript configurations for all three applications and four shared packages.
- Kept `pnpm-workspace.yaml` at the approved `apps/*` and `packages/*` globs; it now discovers all intended packages.
- Kept Turborepo's existing task graph because it correctly orchestrates the new package scripts.
- Converted root `tsconfig.json` into a no-source solution configuration and kept strict shared compiler defaults in `tsconfig.base.json`.
- Scoped Next.js ESLint compatibility rules to the two frontend applications and added TypeScript ESLint parsing for the API/shared source.
- Added app-local Next.js, Tailwind, and PostCSS configurations.
- Added `transpilePackages` for storefront consumption of source-owned shared packages.
- Updated root database scripts to target `@fardad/api`.
- Updated `.gitignore` for canonical Prisma paths and generated TypeScript build metadata.
- Updated `README.md` to describe the implemented package layout rather than planned applications.
- Updated `pnpm-lock.yaml` to contain all workspace importers and declared dependencies.

## Prisma Ownership Decision

Canonical location:

```text
apps/api/prisma/schema.prisma
```

Rules established by this reconciliation:

1. `apps/api` is the only Prisma client and schema owner.
2. Frontend applications and shared packages must not import Prisma.
3. The canonical schema has no models under WO-001.
4. Migrations and business seed data are deferred to WO-002 and later approved domain work orders.
5. The former nested User model was rejected because it was premature and used CUID instead of the approved UUID strategy.

## Dependencies

Only foundation dependencies required to build the selected stack were declared:

- Next.js 15 and React 19 for web/admin.
- NestJS 11, reflection metadata, and RxJS for the API bootstrap.
- Prisma 6 client/CLI for canonical schema generation.
- Zod for the preserved environment parsing foundation.
- Tailwind CSS 3/PostCSS/Autoprefixer for the preserved styles.
- ESLint, Next ESLint configuration, and TypeScript ESLint for workspace quality checks.
- `clsx` and `tailwind-merge` for the preserved shared UI utility.

No state manager, form library, authentication library, Redis client, Swagger package, test framework, business integration, or infrastructure dependency was added.

## Build Status

| Validation | Result | Notes |
|---|---|---|
| `pnpm -r list --depth -1` | Passed | Root plus all seven intended workspace packages discovered |
| `pnpm --filter @fardad/api prisma:generate` | Passed | Prisma Client 6.19.3 generated from model-free canonical schema |
| `pnpm lint` | Passed | Web, admin, and API lint tasks passed |
| `pnpm typecheck` | Passed | 7/7 package type-check tasks passed |
| `pnpm build` | Passed | NestJS API and both Next.js production builds succeeded |
| `pnpm test` | Command passed | Build prerequisites passed; no test tasks/suites exist under WO-001 |

Build outputs confirmed:

- Storefront static route `/` built successfully.
- Administration static route `/dashboard` built successfully.
- NestJS compiled successfully to `apps/api/dist`.

Next.js 15 emits a non-blocking build warning that its plugin auto-detection does not recognize the root-scoped flat ESLint configuration, although the explicit `pnpm lint` command loads the configuration and passes. This should be revisited when the testing/CI foundation is approved.

The local global pnpm 11 wrapper also attempted to verify/download the repository-pinned pnpm 10 executable on sandboxed invocations. Validation succeeded after registry access was allowed. This is an execution-environment behavior, not a workspace build failure.

## Remaining Risks

- No automated test suites exist; `pnpm test` currently proves only that build prerequisites succeed.
- The API contains only a bootstrap and empty application module. Health, validation, errors, logging, security, Redis, and Prisma service integration are intentionally not implemented.
- The admin shell has no authentication or authorization and must not be exposed as a production administration surface.
- The shared `packages/types` boundary is intentionally empty until domain contracts are approved.
- Existing landing-page content and configuration were preserved but have not undergone the future product, accessibility, localization, or brand acceptance work orders.
- No migrations, database connection verification, environment separation, or backup workflow exists yet.
- Docker, CI/CD, Nginx, monitoring, and deployment remain outside WO-001.
- Overlapping later work orders still require an authoritative supersession/precedence decision before their affected domains begin.
- Next.js ESLint plugin auto-detection warning remains during `next build`; standalone lint is clean.
- Existing architecture/governance documents and `.cursor` files were already untracked before WO-001 and remain outside this report's ownership.

## Next Recommended Work Order

Proceed only after review and approval to **WO-002 Database Foundation**.

WO-002 should establish the PostgreSQL environment strategy, Prisma migration workflow, schema documentation, connection verification, rollback process, and test database foundation at `apps/api/prisma`. It must keep business entities out of scope exactly as specified by WO-002.

Do not begin authentication, products, orders, payments, customers, media, Redis integration, or other business/cross-cutting modules until their explicit work orders are approved.
