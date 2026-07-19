Final Architecture Map
This target map is aligned with the approved Fardad vision and existing blueprint. Moving folders or creating the missing application boundaries requires CTO structural approval before implementation.
fardad-platform/
│
├─ apps/
│  ├─ storefront/             # Public luxury Fardad website: RTL, SEO, storytelling, catalog
│  ├─ admin/                  # Internal management platform: products, corporate orders, media, CMS
│  ├─ api/                    # Authoritative NestJS API: domain modules, auth, commerce operations
│  └─ worker/                 # Background processing: media, search indexing, notifications, exports
│
├─ packages/
│  ├─ design-system/          # Reusable RTL luxury UI primitives and design tokens
│  ├─ contracts/              # Shared API/domain contracts; no persistence logic
│  ├─ config/                 # Shared validated configuration and constants
│  └─ database/               # Authoritative Prisma schema, migrations, seed, generated-client boundary
│
├─ docs/
│  ├─ blueprint/              # CTO-approved architecture and business decisions
│  ├─ adr/                    # Architecture decision records
│  └─ api/                    # API specifications—not executable route code
│
├─ infra/                     # Deployment, monitoring, environments, and operational definitions
│
└─ tooling/                   # Repository-wide quality and developer tooling, if approved
Product and Experience Boundaries
Area
Responsibility
Storefront
Premium Persian brand presence, product narrative, editorial content, catalog discovery, corporate-gift inquiry, authenticated customer journeys, and SEO.
Admin
Role-based management of products, pricing, inventory, orders, corporate accounts, media, CMS, campaigns, SEO, reporting, and operations.
API
The sole application boundary for storefront, admin, mobile, partners, and future channels. It owns business rules, authorization, transactional integrity, and auditability.
Worker
Non-request work: image processing, search indexing, notifications, scheduled jobs, exports, and integration retries.
Design system
Fardad’s luxury visual language: Persian RTL typography, spacing, color, imagery, cards, product-story modules, and accessible interaction patterns.
Database
One authoritative schema and migration history; no application may create a competing schema.

Folder Responsibilities
Current folder
Current responsibility
Final responsibility
app/
Root Next.js application mixed with dashboard, APIs, and backend.
Must be split by application ownership after CTO approval.
app/backend/
Incomplete NestJS scaffold.
Becomes the authoritative API application boundary.
app/dashboard/
Static dashboard shell.
Becomes part of the separate admin application.
app/api/
Next.js route handlers accessing Prisma directly.
Must not remain a parallel business API once the API boundary is active.
components/
Shared UI plus storefront and dashboard components.
Split into packages/design-system, storefront-specific, and admin-specific components.
config/
Site, brand, navigation, SEO, and theme configuration.
Retain as Fardad-specific configuration; shared technical configuration belongs in a shared config package.
database/
Empty Prisma datasource and incompatible seed.
Become the sole authoritative database boundary.
lib/
Mixed utilities, auth constants, Prisma access, media, and upload logic.
Separate by concern; persistence and domain logic must not remain generic root utilities.
modules/
Product feature scaffold with empty service/repository/validation layers.
Become API-owned domain modules, beginning with catalog/product.
types/
Frontend model interfaces.
Merge into shared contracts only where genuinely cross-application.
docs/blueprint/
Architecture blueprint.
Retain as controlled architecture documentation; repair encoding and complete placeholder chapters.
docs/api/
Executable route examples stored as documentation.
Retain only API contracts/specifications; executable code belongs to its owning application.
apps/
Empty intended workspace directories.
Retain as the application boundary.
packages/
Empty intended shared-package directory.
Retain as the shared-contract/design/config boundary.

Folders That Should Remain
apps/
packages/
docs/
database/ — only if formally designated as the authoritative data boundary; otherwise it should become a package, not be duplicated.
config/ — for Fardad brand and business configuration.
components/ — temporarily, until the approved application split is implemented.
modules/ — temporarily, until domain modules are placed under the authoritative API boundary.
Folders That Should Be Merged
Source
Merge target
Reason
Root app/ storefront pages
apps/storefront/
Public luxury website must be independently deployable and owned.
app/dashboard/ and dashboard components
apps/admin/
The operational platform is a separate user experience and security boundary.
app/backend/
apps/api/
Aligns the actual NestJS backend with the declared workspace.
components/ui/
packages/design-system/
Shared Fardad RTL/luxury visual primitives require a single source of truth.
types/ plus API-facing models
packages/contracts/
Prevents duplicated contracts across storefront, admin, and API.
Technical values in config/
packages/config/
Environment and cross-app configuration must be centralized and validated.
database/schema.prisma and app/backend/prisma/schema.prisma
One authoritative database location
Two Prisma schemas cannot coexist.
modules/product/
API product/catalog domain module
Business rules must be API-owned, not root-level frontend scaffolding.

Duplicate Structures
Two backend approaches
Next.js route handlers in app/api/
NestJS scaffold in app/backend/
Two Prisma schemas
database/schema.prisma
app/backend/prisma/schema.prisma
Two product API locations
Read handlers in app/api/
Create/update/delete handlers stored only in docs/api/
Two dashboard representations
app/dashboard/
components/dashboard/
Two configuration index files
app/backend/src/config/index.ts
app/backend/src/config/index (1).ts
Declared versus actual monorepo structure
Declared: apps/*, packages/*
Actual: root application and app/backend
Sprint 01 — Exact Implementation Order
Sprint 01 should establish a clean, runnable foundation for the Fardad public website and future enterprise platform. It should not attempt checkout, payments, inventory, or generic marketplace capability.
CTO approval gate
Approve the authoritative application topology: storefront, admin, API, worker, shared packages, and database location.
Approve NestJS as the sole business API boundary.
Approve one authoritative Prisma schema location.
Approve the initial bounded scope: Fardad public storefront, product storytelling, catalog foundation, and corporate-gifting lead capture.
Repository topology normalization
Align actual applications with the declared workspace structure.
Remove duplicate ownership of API and database boundaries through approved migration, not parallel replacement.
Preserve existing folders until their contents have an approved destination.
Build and dependency integrity
Make package manifests, lockfile, workspace configuration, scripts, and runtime dependencies consistent.
Resolve known source integrity issues, including the missing dashboard stylesheet import and schema/code mismatches.
Establish deterministic local build, lint, typecheck, and test commands.
Design-system foundation
Formalize Fardad’s luxury design tokens: typography, Persian RTL behavior, color, spacing, elevation, motion, responsive rules, and accessibility.
Preserve the existing premium palette as a starting point, subject to approved design direction.
Establish reusable product-story, editorial, and corporate-gifting presentation primitives.
Storefront information architecture
Implement approved public route ownership for:
Home
Product catalog
Product detail/storytelling
Categories and collections
Corporate gifts
About Fardad
Contact and inquiry
Editorial/blog
Ensure Persian RTL, SEO metadata, and premium content composition are first-class requirements.
Catalog domain foundation
Define and migrate the approved minimum Fardad catalog model: products, categories, collections, product media, descriptive storytelling content, product status, and SEO.
Use the approved audit, soft-delete, versioning, indexing, and identifier rules.
Do not introduce order/payment logic in this sprint.
API and admin foundation
Implement the first API module for catalog read/write operations through the authoritative API only.
Implement authentication and role foundations before exposing administration functions.
Connect the admin product-management foundation to the API; avoid direct database access from UI applications.
Media and corporate-gifting inquiry foundation
Establish approved object-storage-backed media handling for premium product imagery.
Implement a secure corporate-gifting inquiry flow with validation, persistence, auditability, and notification handoff.
Quality and operational baseline
Add unit, integration, and contract test foundations.
Add migration validation, structured logging, health/readiness endpoints, and baseline monitoring hooks.
Define Sprint 01 performance and accessibility acceptance criteria for RTL storefront pages.
Sprint 01 completion criterion: Fardad has a deployable Persian RTL luxury storefront and secure internal catalog-management foundation, backed by one authoritative API and database model, with corporate-gift inquiry capability and no duplicate runtime ownership.
—----------------------------------------------------------------------------------------------------
1. Files to move
app/page.tsx → apps/storefront/src/app/page.tsx
app/layout.tsx → apps/storefront/src/app/layout.tsx
app/globals.css → apps/storefront/src/app/globals.css
middleware.ts → apps/storefront/src/middleware.ts
next.config.ts → apps/storefront/next.config.ts
postcss.config.js → apps/storefront/postcss.config.js
tailwind.config.ts → apps/storefront/tailwind.config.ts
tsconfig.json → apps/storefront/tsconfig.json
app/dashboard/* → apps/admin/src/app/*
components/dashboard/* → apps/admin/src/components/*
components/home/* → apps/storefront/src/components/home/*
components/layout/* → apps/storefront/src/components/layout/*
components/ui/* → packages/design-system/src/components/*
config/theme.ts → packages/design-system/src/tokens/theme.ts
config/site.ts → apps/storefront/src/config/site.ts
config/company.ts → apps/storefront/src/config/company.ts
config/navigation.ts → apps/storefront/src/config/navigation.ts
config/seo.ts → apps/storefront/src/config/seo.ts
app/backend/package.json → apps/api/package.json
app/backend/nest-cli.json → apps/api/nest-cli.json
app/backend/tsconfig.json → apps/api/tsconfig.json
app/backend/src/* → apps/api/src/*
database/schema.prisma → packages/database/prisma/schema.prisma
database/seed.ts → packages/database/prisma/seed.ts
database/README.md → packages/database/README.md
lib/prisma.ts → apps/api/src/database/prisma.client.ts
lib/auth.ts → packages/contracts/src/auth/roles.ts
lib/api.ts → packages/contracts/src/api/routes.ts
lib/constants.ts → packages/config/src/constants.ts
lib/utils.ts → packages/shared/src/utils.ts
lib/storage.ts → apps/api/src/modules/media/infrastructure/storage.ts
lib/upload.ts → apps/api/src/modules/media/application/upload.service.ts
lib/media.ts → apps/api/src/modules/media/application/media.service.ts
modules/product/* → apps/api/src/modules/catalog/*
types/product.ts → packages/contracts/src/catalog/product.ts
types/order.ts → packages/contracts/src/orders/order.ts
types/user.ts → packages/contracts/src/identity/user.ts
types/cms.ts → packages/contracts/src/cms/content.ts
types/index.ts → packages/contracts/src/index.ts
2. Files to delete
app/api/products/route.ts
app/api/categories/route.ts
app/backend/prisma/schema.prisma
app/backend/prisma/seed.ts
app/backend/src/config/index (1).ts
docs/api/products-post-route.ts
docs/api/products-put-route.ts
docs/api/products-delete-route.ts
docs/api/upload-route.ts
project_tree.txt
app/.gitkeep
app/admin/.gitkeep
app/api/.gitkeep
app/backend/.gitkeep
app/corporate/.gitkeep
app/frontend/.gitkeep
app/backend/src/common/.gitkeep
app/backend/src/config/.gitkeep
app/backend/src/database/.gitkeep
app/backend/src/modules/.gitkeep
packages/.gitkeep
3. Files to keep
package.json
pnpm-workspace.yaml
pnpm-lock.yaml
turbo.json
tsconfig.base.json
eslint.config.mjs
.editorconfig
.gitattributes
.gitignore
.npmrc
.nvmrc
.prettierignore
.prettierrc
.prettierrc.json
.dockerignore
.env.example
README.md
LICENSE
.husky/*
docs/blueprint/*
4. New folders to create
apps/storefront/src/app
apps/storefront/src/components
apps/storefront/src/config
apps/storefront/src/features
apps/storefront/src/lib
apps/admin/src/app
apps/admin/src/components
apps/admin/src/features
apps/admin/src/lib
apps/api/src/modules
apps/api/src/modules/catalog
apps/api/src/modules/identity
apps/api/src/modules/media
apps/api/src/modules/corporate-gifting
apps/api/src/database
apps/api/src/common
apps/api/src/config
apps/api/src/health
apps/api/src/queue
apps/worker/src
apps/worker/src/jobs
apps/worker/src/consumers
packages/design-system/src/components
packages/design-system/src/tokens
packages/design-system/src/styles
packages/contracts/src/api
packages/contracts/src/auth
packages/contracts/src/catalog
packages/contracts/src/cms
packages/contracts/src/identity
packages/contracts/src/orders
packages/config/src
packages/shared/src
packages/database/prisma
packages/database/src
docs/adr
infra/docker
infra/compose
infra/kubernetes
infra/monitoring
5. Expected final repository tree
fardad-platform/
├─ apps/
│  ├─ storefront/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ components/
│  │  │  ├─ config/
│  │  │  ├─ features/
│  │  │  └─ lib/
│  │  ├─ middleware.ts
│  │  ├─ next.config.ts
│  │  ├─ postcss.config.js
│  │  ├─ tailwind.config.ts
│  │  ├─ tsconfig.json
│  │  └─ package.json
│  │
│  ├─ admin/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  ├─ components/
│  │  │  ├─ features/
│  │  │  └─ lib/
│  │  └─ package.json
│  │
│  ├─ api/
│  │  ├─ src/
│  │  │  ├─ common/
│  │  │  ├─ config/
│  │  │  ├─ database/
│  │  │  ├─ health/
│  │  │  ├─ modules/
│  │  │  │  ├─ catalog/
│  │  │  │  ├─ corporate-gifting/
│  │  │  │  ├─ identity/
│  │  │  │  └─ media/
│  │  │  └─ queue/
│  │  ├─ nest-cli.json
│  │  ├─ tsconfig.json
│  │  └─ package.json
│  │
│  └─ worker/
│     ├─ src/
│     │  ├─ consumers/
│     │  └─ jobs/
│     └─ package.json
│
├─ packages/
│  ├─ config/
│  │  ├─ src/
│  │  └─ package.json
│  ├─ contracts/
│  │  ├─ src/
│  │  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  ├─ catalog/
│  │  │  ├─ cms/
│  │  │  ├─ identity/
│  │  │  └─ orders/
│  │  └─ package.json
│  ├─ database/
│  │  ├─ prisma/
│  │  │  ├─ schema.prisma
│  │  │  └─ seed.ts
│  │  ├─ src/
│  │  ├─ README.md
│  │  └─ package.json
│  ├─ design-system/
│  │  ├─ src/
│  │  │  ├─ components/
│  │  │  ├─ styles/
│  │  │  └─ tokens/
│  │  └─ package.json
│  └─ shared/
│     ├─ src/
│     └─ package.json
│
├─ docs/
│  ├─ adr/
│  └─ blueprint/
│
├─ infra/
│  ├─ compose/
│  ├─ docker/
│  ├─ kubernetes/
│  └─ monitoring/
│
├─ .husky/
├─ .dockerignore
├─ .editorconfig
├─ .env.example
├─ .gitattributes
├─ .gitignore
├─ .npmrc
├─ .nvmrc
├─ .prettierignore
├─ .prettierrc
├─ .prettierrc.json
├─ eslint.config.mjs
├─ LICENSE
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ README.md
├─ tsconfig.base.json
└─ turbo.json
—-------------------------------------------------------------
App Router
Keep the App Router as the storefront rendering model.
Separate public storefront, account, corporate-gifting, and administrative route ownership into explicit route groups.
Keep business operations behind the authoritative API; avoid direct Prisma access from route handlers.
Use Server Components by default; introduce Client Components only for interactive controls such as filters, galleries, cart actions, forms, and dashboards.
Layout hierarchy
Establish a global RTL root layout for Persian language, typography, global metadata, and shared providers.
Use a storefront layout for premium navigation, footer, search, trust indicators, and responsive mobile navigation.
Use dedicated layouts for:
Product/catalog journeys
Corporate gifting
Customer account
Editorial/CMS content
Admin application
Keep admin layout and authentication boundaries isolated from public storefront layout.
Route groups
Introduce route groups without changing public URLs:
(storefront)
(catalog)
(corporate)
(content)
(account)
(admin)
Keep product and category URLs stable, human-readable, Persian SEO-ready, and independent of internal implementation.
Reserve dedicated route ownership for corporate-gifting inquiry, quotations, and future B2B account journeys.
Do not place NestJS API source inside the Next.js app directory.
Loading strategy
Add route-level loading boundaries for catalog, product detail, corporate-gifting, account, and editorial routes.
Use premium skeleton states that preserve layout dimensions and avoid visual instability.
Stream independent sections where beneficial: related products, recommendations, editorial blocks, reviews, and availability.
Use optimistic UI only for reversible customer interactions; do not use it for payment, stock allocation, or order confirmation.
Define revalidation and cache policies per content type:
Highly cacheable: editorial pages, categories, collections.
Controlled revalidation: product content and SEO metadata.
Dynamic: customer account, cart, inventory-sensitive availability, administration.
Error boundaries
Maintain a global error boundary and add route-level error boundaries for catalog, product, corporate, account, and admin areas.
Use Persian, brand-appropriate recovery messaging for storefront errors.
Ensure error boundaries expose a safe retry path without leaking backend, database, or infrastructure details.
Add not-found handling for products, categories, collections, editorial content, and corporate-gifting pages.
Send server-side failures to centralized observability with correlation identifiers.
SEO readiness
Make SEO a route-level responsibility, driven by approved CMS/catalog content rather than static configuration alone.
Support canonical URLs, robots directives, Open Graph, Twitter metadata, structured data, sitemap generation, and robots configuration.
Add structured data for:
Organization
Product
Breadcrumbs
Article
FAQ
Local business/contact details where applicable
Support Persian primary content with future multilingual alternates and hreflang strategy.
Ensure product storytelling pages include stable, indexable server-rendered content.
Image optimization
Restrict remote image domains to approved Fardad asset-storage/CDN hosts; remove wildcard remote image trust.
Use an object-storage/CDN media pipeline rather than local application filesystem uploads.
Define responsive image sizes for hero, catalog, product gallery, editorial, and mobile layouts.
Prioritize only above-the-fold imagery; lazy-load below-the-fold assets.
Require modern formats, width variants, alt text, focal-point metadata, and media lifecycle rules.
Preserve image quality suitable for luxury handcrafted products while enforcing byte-size budgets.
Metadata
Define a global metadata baseline for language, RTL identity, Fardad brand, icons, social sharing, and verification tags.
Generate page metadata dynamically for products, categories, collections, articles, and corporate-gifting pages.
Use a consistent title hierarchy: page intent, product/category name, then Fardad brand.
Make metadata fields part of catalog/CMS governance: title, description, canonical URL, robots policy, Open Graph image, and structured-data eligibility.
Remove duplicated static metadata ownership across components and centralize it at route/content level.
Performance
Establish Core Web Vitals budgets for Persian mobile storefront traffic before feature expansion.
Minimize client-side JavaScript in product storytelling and editorial pages.
Avoid unbounded catalog requests; require API pagination, filtering, cache headers, and query limits.
Use CDN caching for static assets, media, and cacheable rendered storefront pages.
Introduce cache invalidation tied to product publication, media changes, pricing changes, and CMS publication.
Defer non-critical scripts such as analytics, chat, heatmaps, and marketing tags until consent and page interactivity permit.
Measure real-user performance, server-rendering latency, API latency, image weight, cache hit ratio, and route-level error rate continuously.
—---------------------------------------------
NestJS Backend Production Review
Readiness: Not production-ready. The NestJS backend is currently a scaffold: it has a bootstrap entry point and placeholder classes, but no registered business modules, controllers, providers, persistence integration, or security enforcement.
Modules
Current state
AppModule imports no modules and registers no controllers or providers.
Auth, cache, Redis, database, health, and logger modules exist only as empty classes.
No catalog, corporate-gifting, CMS, media, customer, order, inventory, or identity module exists.
Production requirements
Make AppModule an application composition root only.
Organize business capabilities as bounded modules, beginning with:
Identity and access
Catalog
Media
Corporate gifting
Health and operational management
Keep infrastructure adapters—Prisma, Redis, object storage, queues, and notifications—outside domain/application logic.
Enforce module boundaries: modules may consume exported contracts, not internal persistence implementation details.
Services
Current state
No application or domain services are implemented.
Existing cache, Redis, and Prisma services are empty declarations.
Production requirements
Each use case must have a dedicated application service with explicit input, authorization, transactional, and audit responsibilities.
Keep controllers thin: validation, request context extraction, service invocation, and response mapping only.
Do not place business rules in controllers, Prisma queries, or shared utility files.
Define transaction boundaries for catalog publication, inventory reservations, corporate inquiries, payments, and order operations.
Introduce idempotency for all externally repeatable write operations.
Controllers
Current state
No NestJS controllers are registered.
The only working API handlers are currently Next.js route handlers, outside the NestJS backend.
Production requirements
Make NestJS the sole authoritative business API.
Version all API routes from inception, for example under /api/v1.
Use resource-oriented controllers with explicit DTOs and consistent pagination, filtering, sorting, errors, and correlation identifiers.
Separate public storefront endpoints from authenticated administration endpoints.
Publish OpenAPI documentation from the implemented API surface and validate it in CI.
Repository Pattern
Current state
BaseRepository and BaseEntity are empty abstractions.
Prisma exists in two competing schema locations and is not connected to a usable backend repository layer.
Production requirements
Define repository interfaces in the owning domain/application module.
Implement Prisma repositories in infrastructure code.
Keep Prisma models, queries, and generated client usage out of controllers and frontend applications.
Adopt one authoritative Prisma schema and migration history.
Require tenant/store scope, soft-delete filtering, audit fields, optimistic versioning, and pagination at repository boundaries where applicable.
Avoid generic repositories for complex aggregate behavior; use explicit repositories for important domain aggregates.
Dependency Injection
Current state
No providers are registered in AppModule.
No dependency graph, provider tokens, lifecycle handling, or infrastructure configuration is active.
Production requirements
Register infrastructure providers through dedicated modules with explicit exported interfaces.
Inject abstractions into application services rather than concrete Prisma, Redis, storage, or notification clients.
Use singleton lifecycle for stateless clients and services; scope request context only where required.
Establish a request context containing correlation ID, authenticated principal, tenant/store scope, locale, and audit actor.
Validate dependency wiring through module-level integration tests.
Authentication
Current state
AuthModule and JwtStrategy are empty.
No login flow, password hashing, OTP, MFA, JWT validation, refresh-token lifecycle, session persistence, or session revocation exists.
Production requirements
Implement the approved identity architecture before exposing administrative capabilities.
Use Argon2id for password storage.
Use short-lived access tokens and rotating refresh tokens with server-side session records.
Implement email/password and mobile OTP according to the approved identity plan.
Require MFA for privileged roles.
Track device, IP, session status, last activity, refresh-token rotation, revocation, and suspicious-login events.
Protect token secrets through managed secrets and strict startup validation.
Authorization
Current state
JWT and role guards are empty.
Middleware and API endpoints do not enforce access control.
Production requirements
Implement permission-based authorization, not role-name checks alone.
Authorize every administrative operation by resource, action, tenant/store scope, and ownership where applicable.
Separate public catalog visibility from administrative catalog management.
Record privileged actions in audit logs.
Prevent horizontal privilege escalation through mandatory tenant/store predicates in repositories and services.
Introduce policy tests for each privileged endpoint.
Validation
Current state
The validation pipe is empty.
Backend environment validation checks only NODE_ENV.
Existing Next.js handlers accept unvalidated request bodies.
Production requirements
Apply a global validation pipeline with transformation, whitelisting, forbidden unknown fields, and consistent validation errors.
Define DTO validation for every API input, including query parameters, path parameters, headers, and uploaded files.
Validate environment configuration at startup: database, Redis, JWT keys, object storage, allowed origins, application URLs, provider credentials, and operational limits.
Enforce request-size limits and file validation: MIME allowlists, content signature inspection, byte limits, malware scanning, metadata extraction, and media quotas.
Keep business validation inside application/domain services after DTO validation.
Logging
Current state
Logger module and service are empty.
No structured logging, request correlation, audit log, or operational event logging exists.
Production requirements
Use structured JSON logs with timestamp, severity, service, environment, correlation ID, request ID, actor ID, tenant/store ID, route, latency, and safe error classification.
Never log credentials, tokens, payment data, personal data beyond approved policy, or raw request bodies by default.
Distinguish application logs, security/audit logs, and infrastructure logs.
Add centralized error reporting and distributed tracing.
Emit metrics for request rate, latency, error rate, database calls, cache behavior, queue failures, authentication failures, and business events.
Caching
Current state
Cache and Redis services/modules are empty.
No cache policy, Redis connectivity, invalidation, metrics, or failure handling exists.
Production requirements
Define caching per domain, not as an indiscriminate global layer.
Cache public catalog, category, collection, and approved CMS reads with explicit invalidation on publication, pricing, availability, and media changes.
Do not cache authentication decisions, payment states, inventory reservations, or other correctness-critical state without an approved consistency model.
Use cache namespacing by environment, tenant/store, locale, and content version.
Protect cache operations with timeouts, circuit-breaking behavior, metrics, and safe fallback to source-of-truth reads.
Use Redis separately for caching, distributed locks where justified, rate limiting, session support, and queues; do not allow cache failure to compromise transactional correctness.
Immediate Production Priorities
Establish the authoritative API application and single Prisma schema.
Implement module composition, dependency injection, configuration validation, structured logging, health/readiness endpoints, and global validation.
Implement identity, authentication, authorization, audit context, and security middleware.
Implement the catalog, media, and corporate-gifting modules through controllers, application services, repositories, and tested API contracts.
Add Redis-backed caching and asynchronous worker integration only after the transactional and observability foundations are operational.
—---------------------------
Schema duplication
Designate packages/database/prisma/schema.prisma as the single authoritative Prisma schema after the approved repository refactor.
Retire both current schema locations only after their required definitions have been reconciled into the authoritative schema.
Keep generated Prisma client access behind the API/database package; storefront and admin applications must not instantiate Prisma directly.
Keep seed logic with the authoritative schema and make it environment-safe, idempotent, and free of production credentials.
Migrations
Introduce Prisma migrations immediately after schema authority is established.
Require every schema change to include a reviewed migration, rollback/recovery assessment, and migration test against a production-like PostgreSQL instance.
Never use development-only schema synchronization as a production deployment mechanism.
Apply migrations through CI/CD as a controlled deployment stage, before application rollout.
Maintain a migration policy for data backfills, large-table changes, index creation, lock avoidance, and zero-downtime rollout.
Add automated checks that prevent application code from referencing models or fields absent from the schema.
Naming
Use singular PascalCase model names and camelCase field names.
Use explicit database table mapping only where a stable database naming convention requires it.
Standardize relation field names around domain language, not generic names.
Use consistent names for identifiers and relationships:
tenantId
storeId
organizationId
productId
categoryId
createdById
updatedById
deletedById
Use domain-specific status enums rather than loosely typed strings.
Avoid ambiguous generic entities such as unnamed metadata, settings, content, or data tables.
UUID usage
Adopt UUIDv7 as the primary identifier strategy for all persisted aggregates and externally exposed records, consistent with the approved blueprint.
Do not use auto-increment identifiers for business entities.
Avoid mixed cuid and UUID identifiers across modules.
Generate identifiers at the database or approved application boundary consistently.
Preserve UUIDs as opaque identifiers; do not encode business meaning into IDs.
Ensure UUID indexes and foreign-key columns use matching types.
Soft delete
Add standard lifecycle/audit fields to business entities:
id
createdAt
updatedAt
deletedAt
createdById
updatedById
deletedById
version
Implement soft delete for recoverable business records such as products, categories, media, customers, organizations, and CMS content.
Require repository-level default filtering of soft-deleted records.
Do not use hard deletes for operational commerce, financial, audit, or customer records.
Define explicit retention and anonymization policies for personal data rather than treating soft delete as a privacy solution.
Use explicit archival states for records that must remain operationally visible but no longer active.
Indexes
Add unique indexes for stable identifiers and scoped business keys, including:
Product slug within its store/locale scope
SKU within its store scope
User email according to the approved identity scope
Category slug within its store/locale scope
Order number
Media storage key
Add indexes for common access patterns:
Tenant/store ownership
Publication/status
createdAt
updatedAt
deletedAt
Foreign-key columns
Product/category/collection relationships
Corporate organization and inquiry status
Use composite indexes that match actual query predicates and sort order.
Add partial indexes for active, published, or non-deleted PostgreSQL records where appropriate.
Treat catalog search indexes separately from transactional indexes; do not expect relational indexes alone to provide enterprise search.
Relations
Model tenancy/store/brand ownership explicitly and consistently across all tenant-scoped entities.
Use required foreign keys for mandatory ownership and lifecycle relationships.
Default deletion behavior to Restrict; allow cascading only for true dependent records with no independent lifecycle.
Model product relationships explicitly:
Product → variants
Product → media
Product → categories
Product → collections
Product → attributes
Product → prices
Product → SEO content
Product → inventory records
Keep financial and order-item snapshots immutable; do not rely on mutable product relations to reconstruct historical transactions.
Model media as a reusable asset aggregate with relation tables rather than embedding storage URLs directly across domain entities.
Use explicit join models for many-to-many relationships when ordering, metadata, auditability, publication state, or tenant scope is required.
Add relation integrity tests for tenancy, deletion behavior, product publication, catalog ownership, and corporate-gifting entities.
—-------------------------------
UI Review — Fardad Storefront
Overall verdict: the current frontend has a reasonable luxury color direction, but it is still a generic landing-page composition rather than a premium Persian handicraft experience. It does not yet provide the visual storytelling, product merchandising, Persian typographic quality, or mobile commerce behavior expected from Fardad.
Aghajani’s public presence emphasizes product merchandising, corporate gifting, production credibility, and the story of Iranian craftsmanship. Fardad should match that level of trust-building while establishing a more distinct luxury editorial identity. Aghajani official homepage
Hero
Current state
The hero is a centered text block over a dark green gradient.
It contains a generic English label, Persian headline/body copy, and two buttons.
No artisan, product, material, packaging, or brand photography is present.
Persian text is encoding-corrupted in source, which makes the experience unacceptable for production.
Review
The color palette is appropriate: deep green, ivory, copper, and restrained gold can communicate heritage and premium craft. However, gradient-only presentation does not create luxury. For handcrafted goods, luxury is established through tactile material, provenance, detail, light, scale, and restraint.
Recommendations
Make the hero image-led, using editorial-quality product or atelier photography with a controlled dark overlay.
Use one primary narrative per campaign: craftsmanship, a signature collection, Nowruz/occasion gifting, or corporate gifting.
Replace generic labels with Persian luxury messaging and concise proof points.
Add a high-value corporate-gifting path without competing with the main product-discovery action.
Include trust signals only where they are substantiated: artisan-made, heritage technique, premium packaging, custom engraving, export capability, or corporate service.
Ensure the hero has a dedicated mobile art direction rather than simply shrinking desktop imagery.
Navigation
Current state
Navigation includes the right high-level destinations: home, products, corporate gifts, about, blog, and contact.
Product navigation data includes child categories, but the rendered navigation does not expose them.
Navigation lacks search, account, wishlist/cart, catalogue request, corporate contact shortcut, and mobile behavior.
It is visually minimal but functionally incomplete.
Review
A luxury navigation should feel calm and deliberate, not sparse because key journeys are absent. Digikala-inspired utility should be selectively applied to discovery, search, and purchase confidence—not copied as dense marketplace navigation.
Recommendations
Add a refined category mega-menu with collection imagery, Persian craft categories, and editorial entry points.
Include prominent but unobtrusive search for catalog discovery.
Give corporate gifting a visually distinct but restrained call-to-action.
Add a utility layer for contact, catalogue request, account, and cart only when those journeys are implemented.
Use a mobile navigation pattern designed for RTL thumb reach, with clear hierarchy and no horizontal overflow.
Keep the header compact and stable on scroll; avoid visually heavy sticky behavior on small screens.
Product cards
Current state
There are no actual product cards.
Category cards are text-only white panels with a large radius and shadow.
No product imagery, price, material, technique, collection, availability, gifting context, or purchase/inquiry action is presented.
Review
This is the largest visual and commercial gap. Premium handicraft commerce depends on product cards that communicate craftsmanship before conversion. Product listings cannot rely on generic card primitives.
Recommendations
Establish a dedicated product-card system rather than reusing generic dashboard-style cards.
Prioritize imagery: multiple crop ratios, hover/secondary image, careful framing, and consistent product backgrounds.
Display only the information appropriate to the product context:
Product name
Craft technique/material
Collection or limited-edition status
Price or “request quotation” for corporate/custom work
Availability or made-to-order context
Use restrained badges for limited edition, corporate-ready, handmade, or signature collection—not promotional clutter.
Add quick actions only where they preserve the luxury experience: view details, save, compare, or request consultation.
Support catalog filters inspired by Digikala’s discovery utility, but present them as an elegant, low-noise drawer/sheet on mobile.
Typography
Current state
The interface declares IRANYekanX, but no font-loading implementation is present.
Persian strings in multiple source files are visibly corrupted.
Headings use generic bold/black weights and large utility-class sizing.
English and Persian content are mixed without a defined bilingual typographic system.
Review
Typography is currently the most serious brand-quality risk. Luxury Persian commerce requires excellent Persian rendering, disciplined line height, and a clear relationship between display, editorial, product, and utility text.
Recommendations
Resolve all source-content encoding issues before any visual review or production release.
Implement an approved Persian font strategy with self-hosted, licensed font files and reliable fallback behavior.
Define separate typography roles:
Display/editorial headline
Product title
Persian body copy
UI labels
Pricing and numeric data
English/Latin content
Use less extreme bold weight for most headings; luxury typography gains authority from proportion and spacing, not maximum weight.
Apply Persian-aware line height, punctuation, number formatting, and RTL handling consistently.
Avoid English labels in otherwise Persian-first storefront sections unless intentionally bilingual.
White space
Current state
The hero uses generous vertical padding.
Sections use a consistent centered-container layout.
Cards use large radius and high shadows.
Review
The foundation is directionally good, but current spacing reads as a standard modern SaaS/landing-page system. Luxury requires more intentional rhythm: spacious editorial moments, then dense detail where a product’s craftsmanship needs to be examined.
Recommendations
Use a documented spacing scale with distinct editorial, catalog, and utility density modes.
Create larger breathing room around hero narratives, collection transitions, and provenance content.
Tighten spacing inside product information blocks where comparison and scanability matter.
Use asymmetry and editorial grids selectively; do not make every section a centered heading over three equal cards.
Reduce repeated “large rounded white card with shadow” usage. It weakens the premium feel when applied everywhere.
Luxury feeling
Current state
The palette is compatible with a luxury Persian handicraft brand.
The interface lacks imagery, texture, provenance, collection framing, craft detail, and premium interaction design.
The homepage content is generic and does not distinguish Fardad’s story from other handicraft sellers.
Review
The current UI communicates “premium template” rather than “Fardad.” Aghajani demonstrates the importance of corporate gifting, production credibility, and craft heritage; Fardad should build its own expression through more curated editorial storytelling, not visual imitation. Aghajani official homepage
Recommendations
Build the brand around “object as story”: artist, technique, origin, material, process, packaging, and occasion.
Use large-format authentic photography and short cinematic video sparingly.
Introduce collection-led merchandising: signature pieces, executive gifts, seasonal gifting, custom corporate gifts, and museum/limited editions where approved.
Use subtle transitions, deliberate image reveals, and minimal motion; avoid generic hover lifts and opacity changes as the primary luxury signal.
Use packaging, certificates, artisan details, and service rituals to communicate premium value.
Build dedicated corporate-gifting experiences with consultation, custom branding, quotation, packaging, volume, and delivery storytelling.
Mobile experience
Current state
The layout uses responsive utility breakpoints.
The desktop navigation remains a horizontal list and has no visible mobile-specific interaction model.
Hero calls-to-action are arranged horizontally.
Category and feature grids collapse, but the journey is not mobile-commerce designed.
Review
Responsive layout alone is insufficient. The primary audience will likely discover catalog products and corporate gift options on mobile, where Persian RTL readability and fast product exploration are decisive.
Recommendations
Create a dedicated mobile header with menu, search, saved items/cart where applicable, and a persistent corporate-contact route.
Stack hero actions vertically or prioritize one action on narrow screens.
Make product cards optimized for vertical thumb scrolling: image-first, concise metadata, predictable actions, and no tiny controls.
Use sticky, accessible filter/sort controls for catalog browsing.
Ensure all tap targets meet mobile accessibility dimensions and maintain RTL ordering.
Optimize media delivery aggressively for Iranian mobile networks while preserving premium visual quality.
Test mobile behavior on small Android devices, iPhone widths, Persian keyboards, RTL form fields, and low-bandwidth conditions.
Priority Order
Fix Persian text encoding and establish production font loading.
Replace the gradient-only hero with approved Fardad visual storytelling.
Design and implement the product-card and catalog-discovery system.
Implement complete RTL desktop/mobile navigation.
Build a distinct corporate-gifting journey.
Establish the shared luxury design system: typography, spacing, grids, imagery, motion, and accessibility.
—------------------------------------

Feature
Current
Missing
Future
Homepage
Basic static hero, features, category cards, header, footer
Brand storytelling, real collections, product merchandising, trust content, corporate-gift conversion, responsive luxury experience
Personalized home, seasonal campaigns, editorial modules, recommendation blocks
Product Page
Not implemented
Product detail, gallery, pricing, material/technique, specifications, availability, story, related products, inquiry/purchase actions
360° media, AR preview, personalization, limited-edition lifecycle
Corporate Gifts
Navigation link and generic hero copy only
Dedicated landing page, inquiry form, consultation flow, custom branding, bulk quote, packaging and fulfillment presentation
Corporate account portal, quotation workflow, approval chains, credit terms
Special Offers
Not implemented
Collection/offer landing pages, merchandising rules, approved promotional presentation
Time-bound offers, targeted offers, personalized promotions
Popup System
Not implemented
Consent-aware newsletter, catalogue request, corporate consultation, exit-intent rules
Audience segmentation, campaign orchestration, A/B testing
Wishlist
Not implemented
Customer identity, save/remove products, guest-to-account migration
Shareable lists, corporate shortlist, availability/price alerts
Customer Dashboard
Not implemented
Account profile, addresses, preferences, saved products, inquiries, orders
Loyalty, referrals, corporate buyer accounts, support center
Order Tracking Workflow
Not implemented
Order status model, tracking page, notification integration, delivery milestones
Carrier integrations, delivery exception management, returns workflow
Coupons
Not implemented
Coupon model, eligibility, validation, redemption limits, admin management
Personalized, segmented, referral, partner, and corporate coupon rules
Campaigns
Not implemented
Campaign entities, publication dates, collection association, campaign landing pages
Rules engine, segmentation, attribution, experimentation, automation
Blog
Navigation link only
Article listing, article detail, category/tag pages, authoring, media, SEO
Editorial workflows, related products, content personalization
SEO
Static root metadata and configuration
Dynamic metadata, canonical URLs, sitemap, robots rules, schema markup, product/category SEO
SEO dashboard, redirects, keyword tracking, automated SEO checks
Search
Not implemented
Search interface, API endpoint, index, autocomplete, zero-result handling
Semantic search, ranking controls, search analytics, personalization
Advanced Filters
Not implemented
Category, collection, price, material, technique, availability, sort controls
Dynamic facets, saved filters, personalized ranking
Media Gallery
Not implemented
Product image galleries, zoom, image ordering, media metadata, responsive assets
Video, 360° assets, virtual showroom, DAM workflows
Admin Panel
Static dashboard shell and placeholder widgets
Authentication, RBAC, real metrics, product management, CMS, media, corporate inquiries
Configurable widgets, reporting, workflow/rules, full operational control center
CRM Integration
Not implemented
Lead/customer synchronization, corporate inquiry handoff, consent-aware contact records
Bi-directional CRM sync, lead scoring, account intelligence, sales automation



