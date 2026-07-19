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

## Product Domain Foundation

| Table | Key columns | Purpose |
|---|---|---|
| `products` | `name`, `slug`, descriptions, `level`, `status`, `publication_state`, `category_id` | Draft-capable product content and publication foundation. Publication-critical fields remain nullable while a product is in progress. |
| `product_categories` | `name`, `slug`, `parent_id`, `sort_order`, `is_active` | Hierarchical product classification. |
| `product_attribute_groups` | `code`, `name`, `sort_order` | Ordered groups of reusable product attributes. |
| `product_attributes` | `code`, `data_type`, `unit`, `is_filterable` | Dynamic attribute definitions; supports text, numeric, boolean, select, multi-select, color, measurement, and date values. |
| `category_attributes` | `category_id`, `attribute_id`, `is_required`, `sort_order` | Defines which attributes apply to a category and which are required. |
| `product_attribute_values` | `product_id`, `attribute_id`, `value` | One JSONB value per product attribute; supports category-dependent specifications without schema changes. |
| `product_labels` | `product_id`, `label` | Product labels: New, Featured, Best Seller, Manager Recommendation, and Campaign. |
| `product_media` | `product_id`, `media_reference`, `type`, `alt_text`, `sort_order` | Product-to-media relation with main, gallery, detail, packaging, lifestyle, and video-reference types. `media_reference` is provider-neutral and has no direct file-storage dependency. |
| `product_checklist_rules` | `code`, `category`, `weight`, required/critical flags | Active weighted rules for product data quality. |
| `product_checklist_statuses` | `product_id`, `rule_id`, completion metadata | Persisted per-product rule status, evaluation time, and optional completing user. |

The Product migration seeds only the reusable quality-rule definitions. It does
not seed product, category, attribute, media, label, price, inventory, or
business-permission data. The default active weights total 100% and exclude
sales/inventory checks until those domains are approved.

All authentication IDs use UUIDs. Table and column mappings use `snake_case`.
Future approved work orders must extend this dictionary for every new model,
including indexes, relations, ownership, retention requirements, and
audit/soft-delete behavior.
