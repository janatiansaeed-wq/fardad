# Authorization Summary

> Project: Fardad Enterprise Platform  
> Work Order: WO-004 Authorization & RBAC  
> Completion date: 2026-07-19  
> Status: Completed — awaiting approval  
> Scope: RBAC and authorization foundation only

WO-004 adds a database-backed, default-deny authorization foundation without
adding a business module, business permission, management endpoint, or
frontend access-control implementation.

The new `apps/api/src/authorization` module provides policy decorators,
database-backed access checks, and three guards:

- `RolesGuard` allows an authenticated active user with at least one required role.
- `PermissionsGuard` allows an authenticated active user with every required permission.
- `AuthorizationGuard` evaluates a complete role/permission policy. If both
  criteria are supplied, both must pass; if no policy metadata is present, it
  denies access.

`@Roles(...)`, `@Permissions(...)`, and `@RequireAccess({...})` provide the
route/controller metadata foundation. Protected routes must apply
`JwtAuthGuard` before the applicable authorization guard, for example:

```ts
@UseGuards(JwtAuthGuard, AuthorizationGuard)
@RequireAccess({ permissions: ["future-module.action"] })
```

No protected business route was added in this work order.

# Database Changes

Canonical Prisma ownership remains `apps/api/prisma/schema.prisma`.

Added the authorization-only models and PostgreSQL tables:

| Model | Table | Purpose |
|---|---|---|
| `Role` | `roles` | Unique, reusable RBAC role codes |
| `Permission` | `permissions` | Unique, reusable permission codes |
| `UserRole` | `user_roles` | Composite-key user-to-role assignments |
| `RolePermission` | `role_permissions` | Composite-key role-to-permission assignments |

Created migration:

```text
apps/api/prisma/migrations/20260719010000_authorization_rbac/migration.sql
```

The migration safely reconciles the previous authentication-only design: it
creates the six existing system role codes, copies each existing `users.role`
value into `user_roles`, then removes the legacy enum column. It creates no
permissions, role-permission mappings, Product, Order, Payment, Inventory, or
CMS data.

Authentication identities now load their assigned role codes from
`user_roles`. JWT access and refresh payloads expose `roles: string[]` rather
than the former single `role` enum claim. This is the documented interface
change required to support multi-role identity. The authorization decision does
not trust this claim; it reads current database assignments.

`docs/database/schema-overview.md` and `docs/database/data-dictionary.md` now
describe the normalized RBAC tables, migration behavior, and deferred
provisioning boundary.

# RBAC Design

- A user may hold multiple roles through `UserRole`.
- A role may hold multiple permissions through `RolePermission`.
- Codes are unique and designed for future `module.action` permission naming.
- Role checks use any-of semantics; permission checks use all-of semantics.
- Role and permission policy criteria combine with AND semantics.
- `roles.is_system` identifies the legacy system roles retained by the
  migration. It does not grant implicit or privileged bypass access.
- No role/permission assignment controller or workflow was introduced. Future
  assignment mutation must be audited by its approved work order.

# Security Decisions

- Authentication and authorization remain separate modules. The existing
  `JwtAuthGuard` establishes the authenticated principal; authorization guards
  reject requests without it.
- All authorization checks query role/permission mappings for an active,
  non-deleted user. Role revocation therefore takes effect immediately rather
  than waiting for a JWT to expire.
- No frontend claim is trusted for authorization, and no JWT role claim is
  used as the authorization source of truth.
- Routes without authorization metadata are denied by `AuthorizationGuard`.
- Empty decorators and empty access policies fail at application definition
  time; empty runtime code sets also deny.
- There is no super-admin bypass and no implicit permission grant.

# API Changes

No controller, endpoint, business workflow, or frontend API was added.

The existing authentication endpoints continue to use JWT authentication. Their
identity and token payload contract now uses a `roles` array to represent
multi-role identities. Existing valid access tokens remain authentication-valid
until expiry; authorization uses the database instead of any legacy token role
claim.

New internal API exports are available from `apps/api/src/authorization` for
future approved modules: `AuthorizationModule`, `AuthorizationService`, guards,
and policy decorators.

# Validation Results

| Validation | Result | Notes |
|---|---|---|
| `pnpm db:format` | Passed | Prisma schema formatted |
| `pnpm db:validate` | Passed | Used a process-local placeholder `DATABASE_URL`; no database connection was made |
| `pnpm db:generate` | Passed | Prisma Client 6.19.3 generated from the RBAC schema |
| `pnpm typecheck` | Passed | 7/7 workspace tasks passed |
| `pnpm lint` | Passed | API, web, and admin lint tasks passed |
| `pnpm build` | Passed | NestJS API and both Next.js production builds passed |
| `git diff --check` | Passed | No whitespace errors |
| Business-boundary scan | Passed | No business models, business permissions, or business modules were added |

# Remaining Risks

- The RBAC migration has not been applied to a disposable PostgreSQL database.
  Before release, apply it to a development database using
  `pnpm db:migrate:dev` and verify the legacy-role copy against representative
  user records.
- There is intentionally no audited role/permission provisioning API yet. Until
  an approved management work order delivers one, new assignments must not be
  introduced through an ad hoc application path.
- No automated authorization guard, role-revocation, or migration integration
  tests exist yet. They are required before production release.
- Existing Next.js builds continue to emit the known non-blocking flat-ESLint
  Next.js-plugin detection warning; standalone lint passes.

No commit, staging operation, or database migration application was performed.
