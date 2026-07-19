# Database Schema Overview

## Canonical Ownership

The Fardad Prisma schema is owned exclusively by the API application:

```text
apps/api/prisma/schema.prisma
```

Only `apps/api` may create a Prisma client or connect to PostgreSQL. Frontend
applications and shared packages must access data only through the versioned API.

## Current Foundation

The schema contains only:

- a PostgreSQL datasource configured by `DATABASE_URL`;
- a Prisma client generator; and
- no data models, relations, enums, migrations, or seed data.

Business entities are intentionally deferred to their approved work orders.

## Future Entity Standard

When an approved work order introduces an entity, it must use PostgreSQL
`snake_case` mapping, UUID primary keys, appropriate indexes, and the approved
audit/soft-delete fields where applicable. Every schema change requires a
reviewed migration.
