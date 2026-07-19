# WORK ORDER 002

# DATABASE FOUNDATION SETUP

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-002

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team

---

# 1. Objective

Establish the database foundation of the Fardad platform according to approved architecture.

This Work Order prepares:

- PostgreSQL database structure
- Prisma ORM foundation
- Migration strategy
- Database standards
- Initial infrastructure

---

# 2. Related Documents

This Work Order follows:


DATABASE_ARCHITECTURE.md

SYSTEM_ARCHITECTURE.md

PROJECT_STRUCTURE.md

CODING_STANDARDS.md

SECURITY_CHECKLIST.md


---

# 3. Scope

## Included

- Database environment preparation
- Prisma configuration
- Schema organization
- Migration workflow
- Database documentation
- Naming conventions

---

## Not Included

Forbidden:


Product tables

Order tables

Payment tables

Customer business logic

Inventory implementation


Business entities will be created in later Work Orders.

---

# 4. Database Technology

Primary database:


PostgreSQL


ORM:


Prisma ORM


---

# 5. Database Architecture

Structure:


Application Layer

    |

Prisma ORM

    |

PostgreSQL Database


---

# 6. Database Folder Structure

Required:


database/

├── prisma/

│ ├── schema.prisma

│ ├── migrations/

│ └── seed.ts

├── docs/

├── backups/

└── scripts/


---

# 7. Prisma Configuration

Required:

- Database connection
- Schema location
- Migration configuration
- Development workflow

---

# 8. Environment Separation

Required environments:


Development

Testing

Staging

Production


Each environment must have:

- Separate database
- Separate credentials
- Separate configuration

---

# 9. Naming Convention

## Tables

Use:


snake_case


Example:


user_accounts

product_items

order_records


---

## Columns

Use:


snake_case


Example:


created_at

updated_at

deleted_at


---

# 10. Primary Key Strategy

Recommended:


UUID


Reason:

- Distributed systems
- Security
- Scalability

---

# 11. Standard Fields

Major entities should support:


id

created_at

updated_at

deleted_at

created_by

updated_by


---

# 12. Migration Strategy

Rules:

- Every database change requires migration.
- Migration files must be committed.
- Production migrations require review.

---

Flow:


Schema Change

↓

Migration Creation

↓

Testing

↓

Review

↓

Production Apply


---

# 13. Database Documentation

Required:


docs/database/

├── schema-overview.md

├── migration-policy.md

└── data-dictionary.md


---

# 14. Backup Strategy

Database backup must support:

- Daily backup
- Recovery testing
- Production restore

---

# 15. Security Requirements

Database security:

Required:

- Strong credentials
- Restricted access
- Encrypted connections
- No database exposure publicly

---

Forbidden:


Database password in source code

Public database ports

Shared production credentials


---

# 16. Performance Foundation

Prepare:

- Index strategy
- Query optimization rules
- Connection management

---

# 17. Testing Requirements

Database foundation must verify:

- Connection success
- Migration execution
- Rollback capability
- Seed execution

---

# 18. Execution Steps

Codex must execute:


Step 1

Audit existing database setup

Step 2

Prepare PostgreSQL foundation

Step 3

Configure Prisma

Step 4

Create migration workflow

Step 5

Create database documentation

Step 6

Generate completion report


---

# 19. Forbidden Actions

Codex must NOT:

- Create business tables
- Add product schema
- Add order schema
- Change business architecture
- Install unrelated packages

---

# 20. Acceptance Criteria

Work Order is complete when:

☑ PostgreSQL foundation exists

☑ Prisma is configured

☑ Migration workflow works

☑ Database standards are documented

☑ Environment separation is prepared

☑ No business entities are created

---

# 21. Expected Final Report

Codex must provide:

## Database Status

Current condition.


## Created Files

List.


## Configuration Changes

List.


## Migration Status

Current state.


## Issues

Detected problems.


---

# 22. Next Work Order

After approval:


WO-003_AUTHENTICATION_SYSTEM.md


---

# Action Items

- Review database foundation before creating entities.
- Keep schema changes controlled.
- Document every migration.
- Protect production database credentials.