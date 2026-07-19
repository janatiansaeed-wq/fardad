# WO-003 Authentication System Report

> Project: Fardad Enterprise Platform  
> Work Order: WO-003 Authentication System  
> Completion date: 2026-07-19  
> Status: Completed — awaiting approval  
> Scope: Authentication foundation only

# Authentication Summary

WO-003 implements the API authentication foundation without introducing any
commerce, customer, CMS, payment, inventory, or other business module.

The new `apps/api/src/auth` module provides:

- registration and email/password login;
- short-lived access JWT issuance;
- rotating, server-revocable refresh JWTs;
- device/session tracking and logout of the current authenticated session;
- JWT Bearer strategy and authentication guard;
- global request DTO validation with whitelisting;
- password login lock state; and
- OTP challenge data-model preparation without an SMS provider or placeholder
  delivery endpoint.

The authenticated API surface is versioned under `/api/v1/auth`:

| Endpoint | Purpose |
|---|---|
| `POST /auth/register` | Create an authentication identity and issue a session/token pair |
| `POST /auth/login` | Validate email/password and issue a session/token pair |
| `POST /auth/refresh` | Rotate a valid refresh token and issue a new pair |
| `POST /auth/logout` | Revoke the authenticated current session |
| `GET /auth/me` | Return the identity represented by a valid access token |

No frontend authentication UI was added, and no frontend package accesses Prisma.

# Database Changes

Canonical Prisma ownership remains `apps/api/prisma/schema.prisma`.

Added authentication-only schema elements:

| Element | Purpose |
|---|---|
| `User` / `users` | UUID authentication identity, email, initial role value, active/soft-delete state |
| `PasswordCredential` / `password_credentials` | Per-user password hash, failed-attempt count, and lock timestamp |
| `AuthSession` / `auth_sessions` | Revocable device/session lifecycle |
| `RefreshToken` / `refresh_tokens` | SHA-256 hash of a rotating refresh token; raw values are never persisted |
| `OtpRequest` / `otp_requests` | Hashed OTP challenge preparation, expiry, attempt count, and optional requesting IP |
| `UserRole` enum | Authentication role claim foundation; role/permission tables remain deferred to WO-004 |
| `OtpPurpose` enum | OTP intent foundation, initially limited to login |

Created migration:

```text
apps/api/prisma/migrations/20260719000000_authentication_foundation/migration.sql
```

The migration was generated from Prisma's `migrate diff --from-empty` output
because no disposable PostgreSQL instance was supplied. It has not been applied
to any database. `migration_lock.toml` now records PostgreSQL as the provider.

`docs/database/schema-overview.md` and `docs/database/data-dictionary.md` were
updated with the authentication tables, mappings, and deferred-domain boundary.

# Security Decisions

- Passwords use Node.js scrypt with a unique 16-byte random salt and a 64-byte
  derived key. Plain passwords are never stored or logged.
- Password policies require a minimum of 12 characters, at least one lowercase
  letter, uppercase letter, and digit.
- Login failures are tracked in `password_credentials`; configurable failed
  attempt limits trigger a configurable temporary lock.
- Access and refresh tokens use separate environment-supplied secrets and
  lifetimes. Access tokens contain only identity, role, and token type.
- Refresh JWTs include token and session identifiers, are stored only as
  SHA-256 hashes, rotate at refresh, and are invalidated when their session is
  revoked. Conditional revocation prevents concurrent refresh attempts from
  rotating the same refresh token twice.
- Session records retain bounded device-name/user-agent metadata, expiry,
  last-use, and revocation state.
- The JWT strategy accepts access tokens only; refresh tokens cannot authenticate
  protected routes.
- DTO validation rejects unknown fields and transforms only validated input.
- `DATABASE_URL`, JWT secrets, token lifetimes, and login-lock settings are
  validated from environment variables at API startup.

The API `.env.example` contains only placeholder secrets. Real secrets must be
unique per environment, at least 32 characters, and supplied by the deployment
secret-management mechanism.

# API Changes

Added `AuthModule`, `AuthController`, `AuthService`, `AuthRepository`, JWT
strategy/guard, DTOs, password/token hashing helpers, and token payload types
under `apps/api/src/auth`.

`PrismaModule` remains the sole Prisma access point. `AuthRepository` is the
only authentication-layer class that queries Prisma; controllers remain thin
and services contain token/password business rules.

The root application module imports `AuthModule`. Startup now enables NestJS's
strict global `ValidationPipe` with transformation, whitelisting, and rejection
of unexpected request fields.

Added authentication runtime variables to `apps/api/.env.example`:

```text
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
JWT_ACCESS_TTL_SECONDS
JWT_REFRESH_TTL_SECONDS
AUTH_MAX_LOGIN_ATTEMPTS
AUTH_LOGIN_LOCK_MINUTES
```

# Validation Results

| Validation | Result | Notes |
|---|---|---|
| `pnpm db:format` | Passed | Authentication schema formatted |
| `pnpm db:validate` | Passed | Used a process-local placeholder `DATABASE_URL`; no connection was made |
| `pnpm db:generate` | Passed | Prisma Client 6.19.3 generated from the authentication schema |
| `pnpm typecheck` | Passed | 7/7 workspace package tasks passed |
| `pnpm lint` | Passed | Web, admin, and API lint tasks passed |
| `pnpm build` | Passed | NestJS API and both Next.js production builds passed |
| Migration SQL derivation | Passed | Prisma generated the migration SQL from the model set without a database connection |
| Boundary scan | Passed | No frontend/shared Prisma imports and no non-auth business models/modules introduced |

# Remaining Risks

- The authentication migration has not been applied to a real development
  database. Before any runtime/API verification, provision a disposable
  PostgreSQL database and apply it with `pnpm db:migrate:dev`.
- Authentication unit, integration, rate-limit, token-theft, and concurrent
  refresh-rotation tests are not yet present. They must be added before a
  production release.
- OTP persistence is prepared, but OTP generation, delivery, IP/mobile rate
  limiting, and notification/audit integrations are intentionally deferred
  until their approved service work orders exist.
- Role values are an authentication claim foundation only. Role/permission
  tables, role assignment workflows, and authorization policy checks belong to
  WO-004.
- The global API rate limiter, structured audit logging, secure refresh-token
  transport policy (such as HTTP-only cookies for browser clients), password
  reset, and account recovery are not part of this work order.
- The existing non-blocking Next.js flat-ESLint-plugin detection warning remains
  during frontend builds; standalone lint passes.

No staging or commit operation was performed.
