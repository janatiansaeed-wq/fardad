# Database Ownership

The canonical Prisma schema for the Fardad platform is:

```text
apps/api/prisma/schema.prisma
```

Prisma belongs to the API application because database access is restricted to
the backend persistence layer. Frontend applications and shared packages must
not instantiate Prisma or access PostgreSQL directly.

Business models and migrations are intentionally deferred to approved database
and domain work orders. This directory remains documentation-only.
