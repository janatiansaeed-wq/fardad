# Database Data Dictionary

## Authentication Foundation

| Table | Key columns | Purpose |
|---|---|---|
| `users` | `id`, `email`, `is_active`, audit fields | Authentication identity only; no customer profile data; roles are assigned through `user_roles` |
| `password_credentials` | `user_id`, `password_hash`, `failed_login_attempts`, `locked_until` | Password verification and brute-force lock state |
| `auth_sessions` | `user_id`, device metadata, expiry/revocation fields | Active-session tracking and invalidation |
| `refresh_tokens` | `session_id`, `token_hash`, expiry/revocation fields | Rotating refresh-token records; raw tokens are never stored |
| `otp_requests` | `mobile`, `code_hash`, purpose, attempts, expiry | OTP challenge preparation; raw codes are never stored |

## Authorization Foundation

| Table | Key columns | Purpose |
|---|---|---|
| `roles` | `id`, `code`, `description`, `is_system`, audit fields | Named reusable roles. `code` is unique and used by backend policy metadata. |
| `permissions` | `id`, `code`, `description`, audit fields | Named reusable permissions. `code` is unique; future business work orders may introduce codes in `module.action` form. |
| `user_roles` | `user_id`, `role_id`, `assigned_at` | Composite-key mapping that permits each user to hold multiple roles. |
| `role_permissions` | `role_id`, `permission_id`, `assigned_at` | Composite-key mapping that grants permissions to a role. |

The migration preserves the legacy six role values and migrates existing user
assignments into `user_roles`; it creates no permissions, role-permission
mappings, or business-specific permission codes. Assignment and mutation
workflows must be audited when introduced by a future approved work order.

All authentication IDs use UUIDs. Table and column mappings use `snake_case`.
Future approved work orders must extend this dictionary for every new model,
including indexes, relations, ownership, retention requirements, and
audit/soft-delete behavior.
