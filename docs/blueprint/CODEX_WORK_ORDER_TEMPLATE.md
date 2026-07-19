# CODEX WORK ORDER TEMPLATE

> Project: Fardad Handicraft E-Commerce Platform

> Version: 1.0

> Status: Active

> Owner: Project Architecture Team

---

# 1. Work Order Information

## Work Order ID

Example:

```
WO-001
```

---

## Title

Short description of requested implementation.

Example:

```
Implement Product Management Core Module
```

---

## Priority

Allowed values:

```
P0 - Critical

P1 - High

P2 - Medium

P3 - Low

```

---

## Related Blueprint Documents

List all related architecture documents.

Example:

```
SYSTEM_ARCHITECTURE.md

DATABASE_ARCHITECTURE.md

API_ARCHITECTURE.md

```

---

# 2. Objective

Describe exactly what must be implemented.

Example:

```
Create the foundation of the product management system including database entities, APIs and basic administration capabilities.

```

---

# 3. Scope

## Included

List allowed changes.

Example:

```
- Product entity

- Category entity

- Product API

- Validation rules

```

---

## Not Included

Explicitly define forbidden changes.

Example:

```
- Payment system

- Dashboard analytics

- Search engine

```

---

# 4. Current System Context

Describe:

- Existing modules
- Existing dependencies
- Current limitations

---

Example:

```
Authentication module is already completed.

Product module must integrate with existing user permissions.

```

---

# 5. Technical Requirements

## Backend Requirements

Define:

- Services
- Controllers
- Database changes
- API endpoints


---

## Frontend Requirements

Define:

- Pages
- Components
- User interactions


---

## Database Requirements

Define:

- Tables
- Relations
- Indexes

---

# 6. Architecture Constraints

Codex must follow:

```
Approved Blueprint Documents

Clean Architecture

Existing Folder Structure

Coding Standards

```

---

Forbidden:

```
Creating duplicate systems

Changing architecture without approval

Adding unnecessary dependencies

```

---

# 7. Files Allowed To Modify

Explicit list.

Example:

```
src/modules/products/*

src/database/migrations/*

docs/*

```

---

# 8. Files Forbidden To Modify

Example:

```
Authentication module

Deployment configuration

Security configuration

```

---

# 9. Implementation Steps

Codex execution order:

```
Step 1:
Analyze existing code


Step 2:
Prepare implementation plan


Step 3:
Implement required changes


Step 4:
Run tests


Step 5:
Report result

```

---

# 10. Database Changes

Required format:

## New Tables

```
table_name

purpose

fields

```

---

## Modified Tables

```
table_name

changes

reason

```

---

## Migration Required

```
YES / NO

```

---

# 11. API Changes

Document:

## New Endpoints

Example:

```
POST /api/products

GET /api/products

```

---

## Request Format

```json
{
}
```

---

## Response Format

```json
{
}
```

---

# 12. Frontend Changes

Define:

Pages:

```
/products

/admin/products

```

Components:

```
ProductCard

ProductForm

ProductGallery

```

---

# 13. Security Requirements

Check:

☐ Authentication required

☐ Authorization required

☐ Input validation

☐ Sensitive data protection

---

# 14. Testing Requirements

Required tests:

## Unit Tests

```
Business logic validation

```

---

## Integration Tests

```
API behavior

Database interaction

```

---

## User Flow Tests

```
Complete scenario

```

---

# 15. Performance Requirements

Consider:

- Database queries
- Caching
- Image optimization
- API response time

---

# 16. Documentation Requirements

Update:

```
Architecture docs

API docs

Database docs

User docs

```

---

# 17. Completion Criteria

Work Order is complete when:

☐ Implementation finished

☐ Tests passed

☐ Documentation updated

☐ Security reviewed

☐ No architecture violation exists

---

# 18. Codex Final Report Format

Codex must report:

## Summary

What was implemented.

---

## Files Changed

List all modified files.

---

## Database Changes

List migrations.

---

## Tests

Results.

---

## Issues

Remaining problems.

---

## Recommendations

Future improvements.

---

# 19. Rollback Information

Describe:

- How to revert changes
- Database rollback steps
- Configuration rollback

---

# 20. Approval

Required before merge:

```
Architecture Review

Code Review

Testing Approval

```

---

# Action Items

- Create a Work Order before every major implementation task.
- Link every Work Order to Blueprint documents.
- Keep implementation history traceable.
- Never bypass architecture review.
- Use this template for all Codex tasks.