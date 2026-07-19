# Database Schema Overview

## Canonical Ownership

The Fardad Prisma schema is owned exclusively by the API application:

```text
apps/api/prisma/schema.prisma
```

Only `apps/api` may create a Prisma client or connect to PostgreSQL. Frontend
applications and shared packages must access data only through the versioned API.

## Current Foundation

The schema contains the authentication foundation plus PostgreSQL datasource and
Prisma client generator. No commerce, customer, content, inventory, order, or
payment model is present.

## Authentication Foundation

| Prisma model | PostgreSQL table | Purpose |
|---|---|---|
| `User` | `users` | Authentication identity and initial role value |
| `PasswordCredential` | `password_credentials` | Password hash, lock state, and password security metadata |
| `AuthSession` | `auth_sessions` | Device/session lifecycle and revocation state |
| `RefreshToken` | `refresh_tokens` | Hashed rotating refresh-token records |
| `OtpRequest` | `otp_requests` | Hashed OTP challenge preparation; delivery is not implemented |

RBAC role/permission tables are deferred to WO-004. Business entities remain
deferred to their approved work orders.

## Future Entity Standard

When an approved work order introduces an entity, it must use PostgreSQL
`snake_case` mapping, UUID primary keys, appropriate indexes, and the approved
audit/soft-delete fields where applicable. Every schema change requires a
reviewed migration.
