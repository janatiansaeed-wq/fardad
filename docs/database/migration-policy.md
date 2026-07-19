# Database Migration Policy

## Commands

Run all Prisma commands from the repository root:

```text
pnpm db:validate
pnpm db:generate
pnpm db:migrate:dev -- --name <descriptive_migration_name>
pnpm db:migrate:status
pnpm db:migrate:deploy
pnpm db:studio
```

`db:migrate:dev` is development-only. `db:migrate:deploy` applies committed
migrations in staging or production and must run through the approved deployment
process.

## Required Workflow

1. Obtain approval for the schema change through its work order.
2. Update `apps/api/prisma/schema.prisma`.
3. Run `pnpm db:format` and `pnpm db:validate`.
4. Create a descriptive development migration.
5. Review the generated SQL and test against a disposable development database.
6. Commit the schema and migration together.
7. Apply the reviewed migration through staging before production deployment.

## Safety Rules

- Do not edit an applied migration.
- Do not use `migrate reset` against staging or production.
- Do not use `db push` for controlled environments.
- Back up production data and verify rollback/recovery procedures before a
  production migration.
- The model-free WO-002 foundation must not create a migration.
