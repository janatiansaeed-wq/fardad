# WORK ORDER TEMPLATE

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-XXX

> Version: 1.0

> Status: Planned

> Created Date:

> Owner:

---

# 1. Work Order Information

| Field | Value |
|---|---|
| Work Order ID | |
| Title | |
| Priority | Critical / High / Medium / Low |
| Phase | |
| Related Blueprint Chapter | |
| Related ADR | |
| Dependencies | |
| Estimated Complexity | |
| Status | |

---

# 2. Objective

## Purpose

Describe exactly what this Work Order should achieve.

---

## Business Value

Explain why this task is important for the business.

---

# 3. Scope Definition

## Included

List all features and changes included.

---

## Excluded

List everything that is intentionally outside this Work Order.

---

# 4. Architecture Reference

## Affected Layers

☐ Database

☐ Backend

☐ API

☐ Frontend

☐ Dashboard

☐ Security

☐ SEO

☐ Media

☐ Deployment

---

## Dependencies

Required completed Work Orders:

```
WO-XXX
WO-XXX
```

---

# 5. Technical Specification

## Functional Requirements

FR-001:

Description:

Acceptance:

---

## Non Functional Requirements

Performance:

Security:

Scalability:

Accessibility:

SEO:

---

# 6. File Scope

## Allowed Files

```
example/path/*
```

---

## Forbidden Files

```
example/path/*
```

---

# 7. Database Changes

Required changes:

Tables:

Fields:

Relations:

Indexes:

Migration required:

YES / NO

---

# 8. API Specification

## Endpoints

Example:

```
GET /api/resource

POST /api/resource
```

---

## Request

```json

```

---

## Response

```json

```

---

# 9. Frontend Specification

Components:

Pages:

States:

Loading:

Empty:

Error:

Success:

---

# 10. Security Requirements

Required:

☐ Authentication

☐ Authorization

☐ Validation

☐ Sanitization

☐ Rate Limiting

☐ Audit Logging

---

# 11. Testing Requirements

## Unit Tests

Required:

---

## Integration Tests

Required:

---

## Manual Tests

Required:

---

# 12. Acceptance Criteria

The Work Order is accepted only when:

☐ Requirements implemented

☐ Tests passed

☐ Documentation updated

☐ No critical bugs

☐ Review approved

---

# 13. Implementation Rules For Codex

Before coding:

1. Read MASTER_BLUEPRINT_INDEX.
2. Read DEPENDENCY_MATRIX.
3. Read DEVELOPMENT_GOVERNANCE.
4. Read related Blueprint chapter.
5. Validate dependencies.

During coding:

- Do not exceed scope.
- Do not modify forbidden files.
- Do not create undocumented architecture.

After coding:

Generate:

- Implementation Report
- Test Report
- Changed Files List
- Remaining Risks

---

# 14. Implementation Report

## Completed

---

## Files Created

---

## Files Modified

---

## Tests Executed

---

## Known Issues

---

## Future Improvements

---

# Action Items

- Complete this document before starting every Work Order.
- Link it to Blueprint and ADR documents.
- Update after review.