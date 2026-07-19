# Database Schema Overview

## Canonical Ownership

The Fardad Prisma schema is owned exclusively by the API application:

```text
apps/api/prisma/schema.prisma
```

Only `apps/api` may create a Prisma client or connect to PostgreSQL. Frontend
applications and shared packages must access data only through the versioned API.

## Current Foundation

The schema contains the authentication and RBAC foundations plus PostgreSQL
datasource and Prisma client generator. No commerce, customer, content,
inventory, order, or payment model is present.

## Authentication Foundation

| Prisma model | PostgreSQL table | Purpose |
|---|---|---|
| `User` | `users` | Authentication identity; access is assigned through `user_roles` |
| `PasswordCredential` | `password_credentials` | Password hash, lock state, and password security metadata |
| `AuthSession` | `auth_sessions` | Device/session lifecycle and revocation state |
| `RefreshToken` | `refresh_tokens` | Hashed rotating refresh-token records |
| `OtpRequest` | `otp_requests` | Hashed OTP challenge preparation; delivery is not implemented |

## Authorization Foundation

| Prisma model | PostgreSQL table | Purpose |
|---|---|---|
| `Role` | `roles` | Reusable, code-addressable RBAC role definition |
| `Permission` | `permissions` | Reusable, code-addressable capability definition using `module.action` when a future module introduces one |
| `UserRole` | `user_roles` | Many-to-many user-to-role assignment with assignment timestamp |
| `RolePermission` | `role_permissions` | Many-to-many role-to-permission assignment with assignment timestamp |

`users.role` and the `UserRole` enum were replaced by normalized role
assignments in WO-004. A user may hold multiple roles. The migration preserves
the prior six system role values and maps every existing user to its equivalent
`user_roles` record. It creates no permissions or role-permission mappings.
Controlled role provisioning and audit workflow for future assignments must be
introduced by a later approved work order.

The authorization layer resolves current assignments from PostgreSQL when it
checks a protected route. JWT role codes are identity context only and are not
the source of an authorization decision, so access changes take effect without
waiting for a token to expire.

Business entities and business-specific permissions remain deferred to their
approved work orders.

## Future Entity Standard

When an approved work order introduces an entity, it must use PostgreSQL
`snake_case` mapping, UUID primary keys, appropriate indexes, and the approved
audit/soft-delete fields where applicable. Every schema change requires a
reviewed migration.
