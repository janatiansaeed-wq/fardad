# Fardad Codex Operating Rules

## Scope

This repository is the custom Fardad Next.js/NestJS platform. It is unrelated to any WordPress or LocalWP project.

## Execution model

- Read `docs/codex/CONTROL.md` and `docs/codex/queue/current-task.md` before making changes.
- Work on one Micro Task at a time.
- Do not broaden scope, perform opportunistic refactors, or modify files outside the task allowlist.
- Preserve RTL-first Persian UX, strict TypeScript, application boundaries, and server-only data access.
- `apps/api` exclusively owns Prisma, database access, authentication, authorization, commerce rules, and business logic.
- `apps/storefront` and `apps/admin` must not import Prisma or access the database directly.
- Shared packages under `packages/` must remain brand-neutral unless the task explicitly changes that architecture.

## Mandatory stop conditions

Stop and report a blocker before changing any of the following unless the current task explicitly authorizes it:

- Prisma schema or migrations
- authentication, authorization, payment, security, secrets, or environment files
- dependencies, package manifests, or lockfiles
- deletion or renaming of files
- deployment configuration
- merge to `main`

Also stop when the working tree contains unrelated changes, conflicts, deleted files, or unexpected staged content.

## Validation

Use repository-local binaries and existing scripts. At minimum, run the validations required by the current task. For application changes, the default gate is:

- type-check affected workspaces
- lint affected applications
- relevant tests
- affected builds
- `git diff --check`

Do not change source code merely to hide a failing validation. Report the root cause.

## Git policy

- Never use `git add .`, `git add -A`, `git commit -a`, force push, destructive reset, clean, or automatic stash.
- Stage explicit paths only.
- Use one scoped branch per Micro Task unless instructed otherwise.
- Create a local commit only after validation passes.
- Push and create a Draft PR only when the task explicitly allows publication.
- Never merge a PR without explicit human approval.

## Reporting

At task completion update `docs/codex/status/latest.md` with:

- Task ID and title
- branch and commit SHA
- changed files
- validation results
- known limitations
- blockers or pending decisions
- exact next recommended action

If a decision is required, record it in `docs/codex/decisions/pending.md` and stop before crossing that decision boundary.
