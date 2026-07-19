# Product Domain Summary

> Project: Fardad Enterprise Platform  
> Work Order: WO-005 Product Domain Foundation + Product Data Quality System  
> Completion date: 2026-07-19  
> Status: Completed — awaiting approval  
> Scope: Product domain foundation only

WO-005 introduces the first business-domain foundation under
`apps/api/src/product`. It adds no controller or public product endpoint; the
module provides internal repository, service, DTO, validation, media-reference,
and data-quality foundations for later approved management APIs.

Draft products may be incomplete. Product data becomes publication-ready only
when the data-quality evaluator finds no missing active critical rule. This
keeps publication readiness derived from current database state rather than
trusting a manually set status.

No cart, checkout, order, payment, inventory, customer-management, CMS, or
marketing-campaign workflow was added.

# Database Models

Canonical Prisma ownership remains `apps/api/prisma/schema.prisma`.

Added models:

| Model | Purpose |
|---|---|
| `Product` | Draft-capable product content, classification, lifecycle, publication, category, and SEO metadata foundation |
| `ProductCategory` | Hierarchical categories with unique slugs and display ordering |
| `ProductAttributeGroup` / `ProductAttribute` | Reusable, typed dynamic attribute definitions |
| `CategoryAttribute` | Category-specific attribute applicability, ordering, and requiredness |
| `ProductAttributeValue` | One JSONB value per product/attribute pair |
| `ProductLabel` | Product labels: New, Featured, Best Seller, Manager Recommendation, and Campaign |
| `ProductMedia` | Ordered media-service references with main, gallery, detail, packaging, lifestyle, and video-reference types |
| `ProductChecklistRule` | Weighted, active, required, and critical data-quality rules |
| `ProductChecklistStatus` | Per-product rule completion/evaluation status and optional completing-user reference |

Added enums for product status, publication state, level, label, media type,
attribute data type, checklist category, and checklist completion source.

Created migration:

```text
apps/api/prisma/migrations/20260719020000_product_domain_foundation/migration.sql
```

The migration seeds only fifteen reusable Product quality-rule definitions.
They total 100% and introduce no product, category, attribute, media, label,
price, inventory, or business-permission data.

# Product Architecture

`ProductModule` imports only `PrismaModule` and exports `ProductService` plus
`ProductDataQualityService`. Prisma access is isolated to `ProductRepository`.

DTO foundations validate product drafts, dynamic JSON attribute values, and
provider-neutral media references. There is deliberately no product controller
yet, so no unauthorised management surface or premature Product permission was
introduced. A future approved API work order must apply JWT authentication and
the existing RBAC policy guards to management routes.

Classification is flexible without hard-coded craft specifications:

- category tree via a self-referencing `ProductCategory`;
- typed reusable attributes and optional groups;
- category-to-attribute requirements; and
- JSONB product values supporting text, number, boolean, select, multi-select,
  color, measurement, and date data.

`ProductMedia` stores an external `mediaReference`, not file data or storage
provider state. This preserves the boundary for the independent Media Service.

# Data Quality System

The `ProductDataQualityService` calculates:

- weighted completion percentage;
- required checklist rules that are incomplete; and
- publication readiness.

Domain-intrinsic critical checks are product name, slug, short and full
description, active category, category-required attributes, and a main image.
The system also scores classification level, gallery/detail/packaging/lifestyle
media, alt text, and product SEO title/description.

Automated checks read the current product, category requirement, attribute, and
media state. Unknown future rules may use persisted checklist status records,
but automated rules cannot be overridden by a manual status. A product with any
missing critical active rule is not publication-ready.

Sales, price, inventory, shipping, corporate-gift, and campaign quality checks
were not seeded because their owning domains are out of scope for WO-005.

# Validation Results

| Validation | Result | Notes |
|---|---|---|
| `pnpm db:format` | Passed | Product schema formatted |
| `pnpm db:validate` | Passed | Used a process-local placeholder `DATABASE_URL`; no database connection was made |
| `pnpm db:generate` | Passed | Prisma Client 6.19.3 generated from the Product schema |
| `pnpm typecheck` | Passed | 7/7 workspace tasks passed |
| `pnpm lint` | Passed | API, web, and admin lint tasks passed |
| `pnpm build` | Passed | NestJS API and both Next.js production builds passed |

# Remaining Risks

- The Product migration has not been applied to a disposable PostgreSQL
  database. Before release, apply it with `pnpm db:migrate:dev` and verify the
  seeded rule weights and foreign-key behavior.
- There is intentionally no product management API, media upload service,
  category/attribute administration API, or publication transition command yet.
  Those future routes must enforce JWT plus RBAC and call the readiness
  evaluator before publishing.
- Checklist status persistence, administrative rule management, audit events,
  and automated tests for quality scoring and publication transitions remain
  future approved work.
- The existing non-blocking Next.js flat-ESLint-plugin detection warning remains
  during frontend builds; standalone lint passes.

No commit, staging operation, or database migration application was performed.
