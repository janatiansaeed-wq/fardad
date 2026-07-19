# PROJECT STRUCTURE

> Project: Fardad Handicraft E-Commerce Platform

> Version: 1.0

> Status: Architecture Approved

> Last Updated: 2026-07-19

> Owner: Software Architecture Team

---

# 1. Purpose

This document defines the recommended repository and application folder structure for the Fardad platform.

The objective:

- Maintain clean architecture.
- Separate responsibilities.
- Improve scalability.
- Provide clear guidance for developers and Codex.

---

# 2. Repository Architecture

The project follows a monorepo structure.

Recommended:
fardad-platform/

├── apps/
├── packages/
├── database/
├── docs/
├── infrastructure/
├── scripts/
├── tests/
├── configs/
└── README.md


---

# 3. Root Directory Explanation

## apps/

Contains deployable applications.

Example:


apps/

├── web/

└── api/


---

## packages/

Contains reusable shared libraries.

Examples:


packages/

├── ui/

├── config/

├── types/

├── utils/

└── validation/


---

## database/

Database-related resources.

Structure:


database/

├── migrations/

├── seeds/

├── schema/

└── backups/


---

## docs/

All project documentation.

Structure:


docs/

├── blueprint/

├── codex/

├── api/

├── database/

└── decisions/


---

## infrastructure/

Deployment and server configuration.

Structure:


infrastructure/

├── docker/

├── nginx/

├── ci-cd/

└── monitoring/


---

# 4. Frontend Application Structure

Location:


apps/web/


Architecture:


web/

├── app/
├── components/
├── features/
├── hooks/
├── services/
├── stores/
├── styles/
├── types/
└── utils/


---

# 5. Frontend App Router Structure

Recommended:


app/

├── (public)/

├── (customer)/

├── (admin)/

├── api/

├── layout.tsx

└── page.tsx


---

# 6. Frontend Feature Structure

Business features are isolated.

Example:


features/

├── products/

│ ├── components/

│ ├── hooks/

│ ├── services/

│ └── types/

├── orders/

├── customers/

└── dashboard/


---

# 7. Backend Application Structure

Location:


apps/api/


Structure:


api/

├── src/

│
├── modules/

│
├── common/

│
├── database/

│
├── config/

│
├── main.ts

└── tests/


---

# 8. Backend Module Architecture

Each module follows:


module/

├── controller/

├── service/

├── repository/

├── dto/

├── entities/

├── guards/

└── tests/


---

# 9. Business Modules

Backend modules:


modules/

├── auth/

├── users/

├── products/

├── categories/

├── inventory/

├── cart/

├── orders/

├── payments/

├── shipping/

├── invoices/

├── customers/

├── corporate/

├── content/

├── notifications/

├── search/

├── analytics/

└── audit/


---

# 10. Shared Backend Services

Location:


common/


Contains:


common/

├── errors/

├── logger/

├── security/

├── events/

├── queues/

└── helpers/


---

# 11. Database Structure

Recommended:


database/

├── prisma/

│ ├── schema.prisma

│ ├── migrations/

│ └── seed.ts


---

# 12. Package Structure

Reusable packages:


packages/

├── ui/

├── database/

├── types/

├── eslint-config/

├── ts-config/

└── utils/


---

# 13. Media Storage Structure

Application media is separated:


storage/

├── products/

├── articles/

├── users/

├── invoices/

└── temporary/


---

# 14. Testing Structure


tests/

├── unit/

├── integration/

├── e2e/

└── performance/


---

# 15. Documentation Structure

Final:


docs/

├── blueprint/

├── codex/

│ └── work-orders/

├── api/

├── database/

├── deployment/

├── decisions/

└── reports/


---

# 16. Forbidden Structure Patterns

Avoid:


One huge components folder

One huge services folder

Business logic inside UI

Database access inside controllers


---

# 17. Module Communication Rules

Allowed:


Module

↓

Service Interface

↓

Another Module


Forbidden:


Module A

↓

Direct Database Access

↓

Module B


---

# 18. Codex Implementation Rules

When creating files Codex must:

- Follow this structure.
- Avoid duplicate folders.
- Respect module boundaries.
- Update documentation when structure changes.

---

# 19. Initial Repository Creation Order

Order:

Root folders
Application folders
Shared packages
Database structure
Documentation structure
Testing structure

---

# 20. Success Criteria

The project structure is approved when:

☑ Frontend and backend are separated

☑ Business modules are isolated

☑ Shared code is reusable

☑ Documentation is maintained

☑ Codex can navigate the repository easily

---

# Action Items

- Create repository structure according to this document.
- Validate existing repository against this structure.
- Use this document as reference for WO-001.
- Do not create new folders without architectural review.