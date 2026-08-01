# Current Micro Task

Status: `AUTHORIZED`

## Task identity

- Task ID: `MT-DB-001`
- Title: Reconcile Prisma product nullability drift
- Tracking issue: `#2`
- Base branch: `architecture-refactor`
- Task branch: `task/mt-db-001-prisma-nullability-drift`
- Authored against commit: `6beb5b19b997954bc24d8b3ba73d795494903194`
- Publication permission: Codex may create the task branch, commit, and push it with standard Git commands. Codex must not use `gh`, `github:yeet`, or any PR-creation skill. ChatGPT will create the Draft PR after the branch is pushed. Codex may not merge.

## Current problem

`apps/api/prisma/schema.prisma` and migration history disagree on two Product-domain columns:

1. `Product.name` is nullable in the canonical Prisma schema but `NOT NULL` in the historical migration.
2. `ProductCategory.name` is required in the canonical Prisma schema but nullable in the historical migration.

A fresh database created only from migration history therefore does not converge to the canonical schema.

## Canonical decisions

- `Product.name` remains nullable so incomplete product drafts can exist.
- `ProductCategory.name` is required and must be `NOT NULL` in the database.
- Do not invent, infer, transliterate, or backfill category names from slugs or other fields.
- If an existing database contains a category with a null name, the corrective migration must stop with a clear actionable error rather than silently altering business data.

These decisions explicitly authorize the narrow Prisma/migration changes required by this task.

## Goal

Create one safe forward-only corrective migration and an automated fresh-PostgreSQL convergence check proving that migration history and `schema.prisma` produce the same nullability contract.

## Allowed files

- `apps/api/prisma/schema.prisma`
- exactly one new directory under `apps/api/prisma/migrations/` containing `migration.sql`
- `.github/workflows/ci.yml`
- `docs/codex/status/latest.md`
- `docs/codex/decisions/pending.md`
- `docs/codex/reports/MT-DB-001_PRISMA_NULLABILITY_RECONCILIATION_REPORT.md`

`schema.prisma` should remain unchanged if it already expresses the canonical decisions.

## Forbidden files and actions

- No application feature code outside the allowlist
- No seed or fabricated Product/Category business data
- No dependency, package manifest, or lockfile changes
- No Auth, RBAC, Payment, Shipping, Admin, Storefront, or Product service changes
- No modification of historical migrations
- No production/staging database connection or deployment
- No destructive Git operation, force push, reset, clean, automatic stash, rebase, or merge
- No `git add .`, `git add -A`, or `git commit -a`
- No GitHub CLI (`gh`)
- No `github:yeet` or other PR-publication skill
- Do not stop merely because GitHub CLI is unavailable

## Execution steps

1. Synchronize `architecture-refactor` with `origin/architecture-refactor`; stop if the working tree is not clean or the branch diverges.
2. Read `AGENTS.md`, `docs/codex/CONTROL.md`, Issue `#2`, the Prisma schema, all migration SQL files, and database documentation.
3. Create `task/mt-db-001-prisma-nullability-drift` from the latest synchronized `architecture-refactor` that contains this task file.
4. Confirm exact SQL table and column identifiers from migration history; do not assume names.
5. Create one new forward-only migration that:
   - drops `NOT NULL` from the Product name column;
   - checks for existing ProductCategory rows whose name is null and raises a clear actionable database error if any exist;
   - sets the ProductCategory name column to `NOT NULL` only after that guard;
   - does not modify historical migration files or fabricate data.
6. Extend `.github/workflows/ci.yml` with a PostgreSQL service and a migration-convergence gate. Use repository-local Prisma 6.19 tooling. Inspect `prisma migrate diff --help` before selecting arguments; do not guess unsupported flags.
7. The CI migration gate must create a clean database from migration history, run Prisma validation/generation, and prove there is no schema drift after deployment.
8. Run local safe validations supported by the environment. If Docker/PostgreSQL is unavailable locally, record that limitation but do not weaken the GitHub CI gate.
9. Update the durable report and `docs/codex/status/latest.md`. Put only unresolved blocking decisions in `pending.md`; otherwise retain `Status: NONE`.
10. Explicitly stage only allowed paths and create one scoped commit.
11. Push the task branch using standard Git only:

```powershell
git push -u origin task/mt-db-001-prisma-nullability-drift
```

12. Do not attempt to create a PR. Return the pushed branch and commit SHA; ChatGPT will create the Draft PR through the connected GitHub service.

## Acceptance criteria

- Exactly one new corrective migration exists; historical migrations are untouched.
- Migration history on a fresh PostgreSQL database converges to `schema.prisma`.
- Product name is nullable after all migrations.
- ProductCategory name is `NOT NULL` after all migrations.
- Existing null category names are never silently backfilled; the migration emits a clear failure.
- Prisma validate and generate pass.
- Type-check, lint, tests, build, and `git diff --check` pass.
- GitHub CI includes the fresh-database migration-convergence gate; final pass will be verified after ChatGPT creates the Draft PR.
- No files outside the allowlist change.
- The durable report clearly documents rollback and operational implications.

## Required validation

- Prisma schema validation
- Prisma client generation
- Fresh PostgreSQL `prisma migrate deploy` when locally available
- A supported Prisma migration-diff/convergence command selected from local CLI help
- Verification queries for both affected column nullability states
- Type-check all workspaces
- Lint all applications
- Existing API and Storefront tests
- API, Admin, and Storefront builds
- `git diff --check`
- Explicit staged-file scope check

## Risks

- An existing database may contain null ProductCategory names. The migration must fail safely and report the exact cleanup query; it must not guess replacement values.
- Incorrect CI ordering can type-check before Prisma Client generation.
- A migration-diff command can vary by Prisma version; inspect the installed CLI help.
- Altering historical migrations would corrupt migration integrity and is prohibited.

## Rollback approach

This is a forward migration. Do not edit or delete it after publication. Before production deployment, take a verified backup and run the documented null-category preflight query. If deployment fails at the guard, leave the schema unchanged, remediate the identified business data manually under separate approval, then rerun deployment. Do not use destructive rollback or rewrite migration history.

## Completion output

Codex must update `docs/codex/status/latest.md`, push the task branch with standard Git, and return only:

- Task ID
- Branch
- Base commit
- Result commit
- Push result
- Changed files
- Migration verification result
- Type-check/lint/test/build results
- Working-tree status
- Pending decisions
- Final conclusion: `TASK BRANCH PUSHED — READY FOR CHATGPT PR CREATION`
