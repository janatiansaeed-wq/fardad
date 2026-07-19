# WO-002 Database Foundation Report

> Project: Fardad Enterprise Platform  
> Work Order: WO-002 Database Foundation  
> Completion date: 2026-07-19  
> Status: Completed — awaiting approval  
> Business entities introduced: None

# Database Foundation Summary

The database foundation is established around a single canonical Prisma owner:

```text
apps/api/prisma/schema.prisma
```

`apps/api` is the only application permitted to create a Prisma client or
connect to PostgreSQL. The schema remains model-free: no User, Product,
Category, Customer, Order, Payment, CMS, inventory, or other business entity
was created.

The NestJS API now provides a foundation-only `PrismaModule` and
`PrismaService`. The service connects when NestJS initializes and disconnects
during application shutdown. It does not implement repositories, queries,
domain services, or business behavior.

Created database foundation assets:

- `apps/api/src/database/prisma.module.ts`
- `apps/api/src/database/prisma.service.ts`
- `apps/api/src/database/index.ts`
- `apps/api/.env.example`
- `apps/api/prisma/migrations/.gitkeep`
- `docs/database/schema-overview.md`
- `docs/database/migration-policy.md`
- `docs/database/data-dictionary.md`

# Prisma Configuration

The canonical Prisma schema retains:

- the PostgreSQL datasource, configured by `DATABASE_URL`;
- the `prisma-client-js` generator; and
- zero Prisma models, enums, views, relations, or migrations.

The migration directory exists at `apps/api/prisma/migrations/` but contains no
generated migration, as required for a model-free foundation.

The root and API command surfaces now provide:

```text
pnpm db:format
pnpm db:validate
pnpm db:generate
pnpm db:migrate:dev -- --name <descriptive_migration_name>
pnpm db:migrate:status
pnpm db:migrate:deploy
pnpm db:studio
```

`db:migrate:dev` is for disposable development databases only.
`db:migrate:deploy` is for reviewed, committed migrations in staging/production.
No command was used to create, apply, or reset a migration during this work
order.

The model-free seed file remains available for future initialization and has no
Prisma client import, model reference, role assignment, or business data.

# Environment Strategy

`apps/api/.env.example` defines the API database runtime contract:

```text
NODE_ENV=development
API_PORT=4000
DATABASE_URL=postgresql://...
```

The API validates its environment at startup with Zod:

- `NODE_ENV` is restricted to development, test, staging, or production.
- `API_PORT` must be a valid TCP port and defaults to `4000`.
- `DATABASE_URL` is required and must be a valid URL.

Each environment must use a distinct database, distinct credentials, and a
separately supplied secret configuration. Only template URLs are committed; no
database credential or local `.env` file was created. Runtime deployments must
provide the environment variables through their approved secret-management
mechanism.

# Migration Workflow

The migration process is documented in
[`migration-policy.md`](../../database/migration-policy.md) and follows this
sequence:

1. Obtain approval through the relevant domain work order.
2. Update the canonical schema.
3. Format and validate the schema.
4. Create a descriptive migration against a disposable development database.
5. Review generated SQL, test it, and commit schema plus migration together.
6. Apply through staging before production deployment.

Rules established:

- Never edit an applied migration.
- Never use `migrate reset` in staging or production.
- Never use `db push` for controlled environments.
- Review and back up before production migration.
- Keep Prisma access in the API persistence layer only.

# Validation Results

| Validation | Result | Notes |
|---|---|---|
| `pnpm db:format` | Passed | Canonical schema formatted |
| `pnpm db:validate` | Passed | Used a process-local placeholder `DATABASE_URL`; no database connection or file write |
| `pnpm db:generate` | Passed | Prisma Client 6.19.3 generated from the model-free schema |
| Prisma formatting check | Passed | All Prisma files formatted |
| `pnpm typecheck` | Passed | 7/7 workspace package tasks passed |
| `pnpm lint` | Passed | Web, admin, and API lint tasks passed |
| `pnpm build` | Passed | NestJS API and both Next.js production builds passed |
| Schema/boundary search | Passed | Exactly one non-dependency schema; no model declarations or frontend/shared Prisma imports |

No PostgreSQL instance was started or modified. Connection success, migration
application, rollback, and seed execution remain environment-dependent checks
for a configured development database and the later approved database work.

# Remaining Risks

- No migration exists yet, by design. The first approved business model must
  introduce a reviewed migration and data-dictionary entry.
- No database connection test was run because no database credentials or local
  database service were supplied in this work order.
- Prisma CLI requires `DATABASE_URL` even for schema validation; developers
  must load a local `.env` from `apps/api/.env.example` or provide the variable
  through their shell/secret manager before running Prisma commands.
- `PrismaService` connects at API startup, so running the API without a valid,
  reachable PostgreSQL instance will correctly fail fast.
- No backup, restore, CI/CD, or production secret-management implementation was
  introduced; those remain separate operational work.
- The existing non-blocking Next.js flat-ESLint-plugin detection warning remains
  during frontend builds; standalone lint passes.

No staging or commit operation was performed.
