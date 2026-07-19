# Database Data Dictionary

## Authentication Foundation

| Table | Key columns | Purpose |
|---|---|---|
| `users` | `id`, `email`, `role`, `is_active`, audit fields | Authentication identity only; no customer profile data |
| `password_credentials` | `user_id`, `password_hash`, `failed_login_attempts`, `locked_until` | Password verification and brute-force lock state |
| `auth_sessions` | `user_id`, device metadata, expiry/revocation fields | Active-session tracking and invalidation |
| `refresh_tokens` | `session_id`, `token_hash`, expiry/revocation fields | Rotating refresh-token records; raw tokens are never stored |
| `otp_requests` | `mobile`, `code_hash`, purpose, attempts, expiry | OTP challenge preparation; raw codes are never stored |

All authentication IDs use UUIDs. Table and column mappings use `snake_case`.
Future approved work orders must extend this dictionary for every new model,
including indexes, relations, ownership, retention requirements, and
audit/soft-delete behavior.
