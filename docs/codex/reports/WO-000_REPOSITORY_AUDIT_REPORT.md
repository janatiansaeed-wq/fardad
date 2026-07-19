# WO-000 Repository Audit Report

> Project: Fardad Enterprise Platform  
> Audit date: 2026-07-19  
> Scope: Repository audit, architecture validation, and implementation preparation only  
> Source-code changes: None  
> Status: Awaiting approval

# Repository Summary

The repository contains a substantial architecture and governance library, a small root-level Next.js App Router implementation, and a largely skeletal NestJS backend. It does not yet conform to the approved monorepo layout and is not currently a buildable production foundation.

The intended monorepo locations (`apps/web`, `apps/api`, `apps/admin`, and shared packages) exist only as empty directories or are absent from pnpm's effective package graph. The implemented frontend remains at the repository root, while the backend is under the singular path `app/backend`. This conflicts with the workspace declaration (`apps/*`, `packages/*`), the Blueprint, and WO-001.

Repository state observed during the audit:

- Root application code: Next.js-style `app/`, `components/`, `config/`, `lib/`, `modules/`, and `types/`.
- Intended application containers: empty `apps/web`, `apps/api`, and `apps/admin` directories.
- Backend prototype: `app/backend`, including a manifest, Nest bootstrap files, a second Prisma schema, and numerous one-line placeholder classes.
- Shared packages: no implemented packages; only `packages/.gitkeep`.
- Database definitions: two conflicting Prisma locations (`database/schema.prisma` and `app/backend/prisma/schema.prisma`).
- Documentation: extensive Blueprint, governance, work-order, API-template, Cursor context/rules, and prior audit material.
- Infrastructure: no committed Docker Compose, Docker application definitions, Nginx, CI/CD, monitoring, backup, or deployment implementation.
- Tests: no unit, integration, or end-to-end test suites and no root test configuration.
- Git working tree: the architecture/governance/work-order documentation and `.cursor` material were already untracked before this report. These pre-existing files were not modified.

# Current Architecture

## Repository and build layout

The root declares pnpm 10, Node.js 22, and Turborepo. `package.json`, `pnpm-workspace.yaml`, and `turbo.json` consistently target packages under `apps/*` and `packages/*`. However, neither the root frontend nor `app/backend` matches those globs. The only lockfile importer is the repository root, and it contains development tooling only.

Consequences:

- Turborepo has no application package with `build`, `dev`, `lint`, `typecheck`, or `test` tasks to orchestrate.
- Root Next.js code has no root `next`, `react`, `react-dom`, Tailwind, Prisma client, `clsx`, or `tailwind-merge` dependency declarations.
- The nested backend manifest declares scripts but no dependencies or devDependencies.
- `pnpm -r`/Turborepo validation could not complete within the audit timeout; independent manifest and lockfile inspection already establishes that the application dependency graph is incomplete.

## Frontend

The frontend uses the App Router shape and has:

- A root layout, home page, global CSS, basic SEO metadata, and RTL document direction.
- Reusable UI primitives (`Button`, `Card`, `Container`, `Heading`, `Image`, `Section`, `Badge`).
- Home sections and shared header/footer/navigation components.
- An initial dashboard route with layout, loading, error, not-found, navigation, and widget components.
- Central brand/site/navigation/theme/SEO configuration and shared TypeScript interfaces.

The frontend is an early prototype rather than an application architecture:

- It is outside the approved `apps/web` package.
- There is no package manifest or resolvable framework dependency set.
- `app/dashboard/layout.tsx` imports `@/styles/dashboard.css`, but `styles/dashboard.css` does not exist.
- Root `tsconfig.json` includes all TypeScript recursively, so frontend type checking would also ingest the nested NestJS backend despite incompatible module assumptions.
- `next-env.d.ts` is absent.
- Root Next.js route handlers access Prisma directly, violating the approved API boundary and repository-layer rule.
- Middleware performs route-level logic without an implemented, verified JWT/RBAC system.
- Remote images allow every HTTPS hostname (`hostname: "**"`), which is too broad for a hardened production policy.
- Local filesystem upload/media utilities do not match the approved object-storage/CDN media architecture and require path, authorization, validation, and lifecycle controls.
- No localization framework, full multilingual routing, design-token package, frontend data-access layer, form architecture, accessibility tests, or SEO structured-data framework is present.

## Backend

`app/backend` resembles a NestJS foundation but is not an operational Nest application:

- `main.ts` creates an application, sets an `api` prefix, enables CORS, and listens on a port.
- `app.module.ts` imports several local modules.
- Folders exist for auth, cache, common concerns, configuration, database, health, Redis, Swagger, and feature modules.
- Most backend files are empty one-line class declarations without Nest decorators, providers, implementations, or exports required for dependency injection.
- `AuthModule`, guards, JWT strategy, Redis/cache services, Prisma service/module, health controller/module, validation pipe, exception filter, logging interceptor, logger, and Swagger setup are placeholders rather than working implementations.
- The backend manifest contains scripts only and declares none of NestJS, Prisma, Redis, validation, Swagger, testing, or build dependencies.
- API prefixing is `api`, not the approved versioned `/api/v1` contract.
- There are duplicate configuration barrel files, including the likely accidental `index (1).ts`.
- No domain feature module is implemented under `src/modules`.

## Database

Two Prisma schemas create competing sources of truth:

- `database/schema.prisma` configures PostgreSQL but has no models.
- `app/backend/prisma/schema.prisma` configures PostgreSQL and defines a minimal `User` with a CUID primary key.

The nested `User` conflicts with the approved UUID and standard audit/soft-delete field strategy. No migrations exist in either location. Seed files are empty or skeletal. There is no implemented environment separation, migration policy in executable configuration, connection verification, data dictionary, backup implementation, or test database setup.

The root Next.js API routes query `prisma.product` and `prisma.category`, but neither schema defines `Product` or `Category`; those routes cannot generate or type-check against the current schemas.

## Documentation and governance

Documentation is the repository's strongest asset. The audit covered:

- Root and database README files.
- `.cursor/context` business, project, and brand definitions.
- All `.cursor/rules` files for architecture, backend, frontend, coding, and Git policy.
- Blueprint chapters 001-040 and the topical Blueprint architecture documents.
- Governance documents, including implementation order, ADRs, coding standards, risk register, work-order index, changelog, and acceptance criteria.
- Work orders WO-001 through WO-041.
- API route examples and implementation/report/release/test/review templates.
- Existing sprint analysis and repository audit reports.

The approved direction is consistent at a high level: modular monorepo, Next.js App Router frontend, NestJS modular monolith backend, PostgreSQL through Prisma, Redis, JWT/RBAC, REST `/api/v1`, repository/service/controller layering, RTL-first UI, strong SEO/security/accessibility, object storage, asynchronous processing, and phased implementation.

Documentation itself requires governance cleanup before it can function as an unambiguous implementation contract:

- The Blueprint index marks chapters active, while its status vocabulary says `Approved` is implementation-ready; many documents use `Active`, `Ready For Implementation`, or no formal status.
- Chapters 004-006 and 030-040 are only short stubs, despite the index presenting the full sequence as active.
- The topical Blueprint set often contains the actual architecture missing from the numbered chapter stubs.
- There are overlapping work orders: search (008, 020, 030), media (005, 016, 032), notifications (015, 029), orders (011, 025), payments (012, 026), shipping (013, 027), invoices (014, 028), admin dashboards (019, 036), and SEO (017, 035). Their supersession relationship is not declared.
- Implementation ordering differs between Blueprint, governance, roadmap, and work-order numbering. For example, WO-002 forbids business entities while later domain documents assume a database domain model.
- The README describes applications and infrastructure that are planned, not implemented.
- `database/README.md` displays encoding corruption in the current console/read path and should be normalized/verified before relying on it.

# Technology Assessment

| Area | Approved target | Current state | Assessment |
|---|---|---|---|
| Monorepo | pnpm + Turborepo; `apps/*`, `packages/*` | Tooling declared; application paths not included | Critical foundation gap |
| Frontend | Next.js App Router, React 19, TypeScript, Tailwind, RTL-first | Early root-level components/routes; dependencies absent | Useful prototype assets, not build-ready |
| Backend | NestJS modular monolith | Skeleton under wrong path; most classes are placeholders | Not operational |
| Database | PostgreSQL + Prisma, UUID, migrations, audit fields | Duplicate schemas; no migrations; conflicting minimal User | Critical source-of-truth gap |
| Cache | Redis | Empty module/service placeholders | Missing implementation |
| Authentication | JWT access/refresh, RBAC/permissions | Constants and empty strategy/guards only | Missing and security-critical |
| API | REST `/api/v1`, DTO validation, consistent errors | Two direct-Prisma Next route handlers; skeletal Nest app | Architecture violation |
| Search | Blueprint allows staged PostgreSQL then Elasticsearch | Environment variable only | Missing; defer until prerequisites |
| Media | Object storage/MinIO + processing/CDN | Local filesystem helpers and env placeholders | Requires replacement through approved module |
| Testing | Unit, integration, E2E, security/performance checks | No tests/configuration | Critical quality gap |
| DevOps | Docker, CI/CD, Nginx, monitoring, backup | Scripts reference Docker Compose; files absent | Missing |
| Observability | Structured logging, health, metrics, audit | Mostly empty placeholders | Missing |
| SEO/accessibility | SSR/ISR metadata, JSON-LD, WCAG 2.2 | Basic metadata/semantic components only | Early partial foundation |

Dependency policy is presently impossible to validate at application level because runtime packages are not declared. No new dependency should be installed until application boundaries and package ownership are approved. The eventual dependency set should be the minimum required by an approved work order and pinned through the workspace lockfile.

# Existing Modules

## Implemented or partially implemented assets

- Frontend shell: root layout, landing page, dashboard shell, shared layout, and reusable UI components.
- Brand/configuration: company, navigation, SEO, site, theme, constants, and RTL defaults.
- Type definitions: product, user, order, CMS, plus a second product type inside `modules/product`.
- Product module shell: constants and type plus empty repository/service/validation/utility barrels.
- Root API prototypes: product and category GET handlers.
- Root utilities: API route constants, authorization role helper, environment access, Prisma singleton, local media/storage/upload helpers, formatting and slug utilities.
- Backend foundation shell: bootstrap/main, app module, configuration validation shell, database/repository abstractions, auth/RBAC shells, cache/Redis shells, logging/error/validation shells, health shell, and Swagger shell.
- Database foundation files: two Prisma schemas and two seed locations, without a completed migration foundation.
- Governance and architecture specifications for the full platform.

These assets should be evaluated and migrated selectively during an approved foundation work order. They should not be treated as production-complete modules.

# Missing Modules

## Foundation and platform

- Proper `apps/web` and `apps/api` packages with manifests and workspace participation.
- Approved shared packages (`ui`, `types`, `utils`, `config`) with clear public APIs and dependency boundaries.
- Environment configuration per development, test, staging, and production.
- Docker/local service orchestration, CI/CD, deployment, Nginx, monitoring, backup, disaster recovery, and operational runbooks.
- Unit, integration, E2E, accessibility, security, and performance test foundations.
- Working logging, metrics/tracing, health/readiness, rate limiting, error handling, API documentation, background jobs/events, and audit logging.

## Identity and business capabilities

- Authentication, refresh-token rotation/revocation, sessions, password/OTP flows, RBAC, permissions, user management, and corporate verification.
- Media/object-storage service and media management.
- Categories, attributes, brands/artisans, products, variants, pricing/rules, inventory/warehouse, and product experience.
- Search, recommendations, reviews/ratings, wishlist/engagement, and SEO services.
- Cart, checkout, orders, payments, shipping, invoices/finance, and notifications.
- Customer/CRM, corporate commerce, representatives, custom orders, and export/multi-currency capabilities.
- CMS/articles, administration, analytics/tracking, reporting/BI, and settings.

# Architecture Gaps

1. **Application placement:** implementation is outside the workspace paths mandated by WO-001 and the Blueprint.
2. **Package ownership:** root-level frontend and shared code blur application and package boundaries; the nested backend is also included by the root TypeScript glob.
3. **API boundary:** Next.js handlers access Prisma directly, bypassing NestJS, versioned REST contracts, DTOs, services, and repositories.
4. **Database ownership:** duplicate Prisma schemas and seed files create an immediate split-brain migration risk.
5. **Dependency graph:** application runtime dependencies are undeclared, so reproducible install/build/test is unavailable.
6. **Layering:** frontend business types, product module types, API handlers, local media functions, and backend placeholders do not yet form the approved presentation/application/domain/infrastructure/persistence layers.
7. **Security:** no working authentication, authorization, validation, sanitization, rate limiting, secret validation, CSRF/session strategy, or audit trail exists.
8. **Production operations:** deployment, recovery, monitoring, alerts, and service orchestration remain documentary only.
9. **Quality gates:** no test suites, coverage policy enforcement, build validation, or CI checks exist.
10. **Documentation authority:** duplicate and incomplete work orders need a supersession/precedence decision to prevent contradictory implementation.
11. **Frontend completeness:** RTL is initialized, but multilingual routing, accessible interaction patterns, responsive production states, structured data, canonical policy, and performance budgets are not implemented.
12. **Scalability mechanisms:** Redis, queues/events, search indexing, object storage, cache invalidation, idempotency, and transaction boundaries are not implemented.

# Technical Risks

| Severity | Risk | Impact | Preparation response |
|---|---|---|---|
| Critical | Moving code before approving the canonical application/package layout | Breaking imports and losing usable prototype work | Make WO-001 an explicit, reviewed migration plan with a file map and rollback point |
| Critical | Selecting the wrong Prisma schema as canonical | Divergent migrations, data loss, incompatible generated clients | Approve one database owner/location before any model or migration work |
| Critical | Implementing later work orders while duplicated work orders remain active | Conflicting module contracts and repeated/refactored work | Publish a work-order precedence and supersession matrix |
| Critical | Missing dependency manifests and lockfile importers | Non-reproducible builds and deployment failure | Establish package manifests and lockfile ownership in foundation phase |
| High | Direct database access from the Next.js application | Coupling, security inconsistency, bypassed authorization/audit rules | Route business operations through the NestJS API; define limited exceptions only by ADR |
| High | Placeholder classes being mistaken for completed infrastructure | False progress and runtime failures | Track each as a skeleton; require tests and acceptance criteria before marking implemented |
| High | Root TypeScript scope includes frontend and backend | Conflicting module resolution/decorator settings and misleading type checks | Give each application an isolated tsconfig within the approved workspace |
| High | No test/CI/security gates | Regression and vulnerability risk | Build quality gates during foundation, before business features |
| High | Local filesystem upload design | Unsafe paths, non-scalable storage, inconsistent deployments | Preserve only reusable validation ideas; implement approved object-storage media service |
| High | Broad remote image allowlist | Server-side fetch and content-governance exposure | Restrict to explicitly approved storage/CDN hosts during frontend foundation |
| High | Default credentials in `.env.example` copied beyond local development | Credential exposure or insecure environments | Document local-only values and require validated secrets per environment |
| Medium | Documentation stubs/status ambiguity | Architecture decisions made from incomplete sources | Ratify authoritative documents and mark drafts/stubs clearly |
| Medium | Duplicate configs/types/barrels | Drift and inconsistent contracts | Consolidate only after canonical package boundaries are approved |
| Medium | No migrations or backup restore test | Unverifiable database evolution/recovery | Establish migration and restore workflow before business entities |
| Medium | README overstates implemented applications | Incorrect onboarding and delivery expectations | Update documentation during the approved foundation work order |

# Recommended Implementation Order

No business feature work should begin from the current state. The safest order is dependency-driven:

1. **Architecture governance decision:** ratify the canonical repository layout, authoritative document set, work-order supersession map, API ownership, Prisma ownership, and version targets. Record conflicts through ADR/change control.
2. **WO-001 project foundation:** move or selectively migrate the existing root frontend and backend skeleton into approved workspace applications; create application/shared-package manifests; isolate TypeScript/ESLint/build configurations; preserve useful assets; avoid business implementation.
3. **Foundation verification:** achieve reproducible clean install, lint, typecheck, build, and test-command execution through Turborepo. Add minimal CI quality gates and environment validation.
4. **WO-002 database foundation:** establish exactly one Prisma schema/client owner, PostgreSQL environments, migration/seed workflow, database documentation, and connection/rollback verification without premature business entities.
5. **Backend cross-cutting foundation:** implement versioned API conventions, configuration, structured errors, validation, logging, health/readiness, Prisma integration, Redis connection, OpenAPI, security headers/rate limits, and test harnesses under explicit work orders.
6. **WO-003 and WO-004 identity:** implement authentication, refresh-token security, user/role/permission models, RBAC/guards, audit requirements, and frontend session boundary.
7. **Media and audit foundations:** implement object storage/media processing and audit/event capabilities required by domain modules.
8. **Catalog foundation:** categories/attributes, product core, variants/pricing, inventory, media relations, and product experience, resolving the scope of WO-005/006/007/016/032/041 first.
9. **Discovery and engagement:** search/indexing, SEO, reviews, wishlist, and recommendations after catalog contracts stabilize.
10. **Commerce flow:** cart, checkout, orders, payments, shipping, invoices, and notifications with transaction, idempotency, and failure-recovery design.
11. **Customer and operations:** customer/corporate modules, CMS, administration, CRM, analytics, reporting/BI, and settings.
12. **Production readiness:** accessibility, SEO, performance, security, observability, backup/restore, disaster recovery, load tests, staging validation, and controlled deployment.

# Suggested First Implementation Step

Issue an approved **WO-001 Foundation Reconciliation** work order before changing source code. Its first deliverable should be a decision-backed migration matrix—not code—that maps:

- Root Next.js files to `apps/web` (and clarifies whether administration is a route group in web or a separate `apps/admin`).
- `app/backend` files to the canonical `apps/api` NestJS package.
- Root `types`, `config`, reusable UI, and utilities to either application-owned folders or approved shared packages.
- Both Prisma schemas/seed files to one canonical database location and one generated-client owner.
- Every duplicate work order to `authoritative`, `superseded`, or `merged` status.

The approved work order should then authorize only foundation reconciliation, dependency declaration, configuration isolation, and reproducible quality gates. Existing frontend components and configuration should be preserved where they satisfy the approved design; placeholder backend files should be assessed individually rather than assumed complete. Database business models and feature modules must remain out of scope until their dedicated work orders are approved.

This audit is complete. No implementation should proceed until explicit approval and the next Work Order are provided.
