# DEVELOPMENT GOVERNANCE

> Project: Fardad Handicraft E-Commerce Platform
>
> Version: 1.0
>
> Status: Active
>
> Last Updated: 2026-07-19

---

# Purpose

This document defines the mandatory rules for developing the Fardad project.

It is the highest authority for implementation after the Blueprint.

Every developer, reviewer and AI coding agent must comply with these rules.

---

# Development Philosophy

Business First

↓

Architecture First

↓

Documentation First

↓

Implementation

↓

Testing

↓

Review

↓

Merge

No implementation may bypass this order.

---

# Golden Rules

## Rule 1

Blueprint is the Single Source of Truth.

If Blueprint and implementation differ,

Blueprint wins.

---

## Rule 2

Never guess requirements.

If information is missing:

STOP.

Report the ambiguity.

Wait for clarification.

---

## Rule 3

One Work Order only.

Never implement multiple Work Orders together.

---

## Rule 4

Never modify files outside the active Work Order scope.

---

## Rule 5

Never perform architectural redesign during implementation.

Architecture changes require Blueprint updates first.

---

# Allowed Activities

Developers MAY:

- Create new files
- Modify approved files
- Refactor within scope
- Improve readability
- Add documentation
- Add tests

---

# Forbidden Activities

Developers MUST NOT:

- Change project architecture
- Rename modules without approval
- Change database design without Blueprint
- Change APIs without Blueprint
- Introduce new libraries without approval
- Remove existing functionality
- Add experimental features

---

# Blueprint Compliance

Every Work Order must reference:

- Blueprint Chapter(s)
- Dependency Matrix
- Work Order ID

Implementation without references is invalid.

---

# Dependency Validation

Before implementation verify:

- Required modules exist.
- Dependencies are complete.
- Previous Work Orders are approved.

If not,

STOP.

---

# Coding Rules

Implementation must:

- Follow project naming conventions.
- Be modular.
- Be reusable.
- Be testable.
- Avoid duplicated logic.
- Avoid hardcoded values.

---

# File Modification Policy

Every Work Order must define:

Allowed Files

Forbidden Files

Generated Files

Temporary Files

---

# Documentation Policy

If implementation changes architecture:

STOP.

Architecture must be updated first.

Implementation comes second.

---

# Reporting Policy

Every completed Work Order must generate a report containing:

- Work Order ID
- Objective
- Files changed
- Files created
- Tests executed
- Risks
- Remaining work

---

# Review Checklist

Before approval verify:

Architecture compliance

Business rule compliance

Naming conventions

Performance

Security

Accessibility

SEO impact

Documentation

Tests

No duplicated logic

---

# Error Handling

If unexpected situations occur:

Do not continue.

Create a report.

Explain:

- Problem
- Cause
- Possible solutions

Wait for approval.

---

# Refactoring Policy

Refactoring is allowed only if:

- Current Work Order requires it.
- No functionality changes.
- Tests continue to pass.

Otherwise:

STOP.

---

# Definition of Ready

A Work Order is Ready when:

- Blueprint exists.
- Dependencies approved.
- Acceptance Criteria defined.
- Scope defined.
- Files identified.

---

# Definition of Done

A Work Order is Done only if:

All Acceptance Criteria pass.

Documentation updated.

Implementation report created.

Review completed.

No known critical issues remain.

---

# Codex Mandatory Rules

Codex MUST:

Read MASTER_BLUEPRINT_INDEX first.

Read DEPENDENCY_MATRIX second.

Read assigned Blueprint chapters.

Read current Work Order.

Validate dependencies.

Implement only requested scope.

Generate implementation report.

Stop on ambiguity.

---

# Escalation Rules

Immediately stop implementation if:

Business rules conflict.

Architecture conflicts.

Missing dependency.

Undefined behavior.

Missing Blueprint chapter.

Security concerns.

---

# Quality Gates

Every Work Order must pass:

Architecture Gate

↓

Code Quality Gate

↓

Security Gate

↓

Performance Gate

↓

Accessibility Gate

↓

Documentation Gate

↓

Review Gate

↓

Approval

---

# Project Principles

Keep modules independent.

Keep business logic centralized.

Keep UI simple.

Keep APIs consistent.

Keep documentation updated.

Prefer maintainability over speed.

Prefer clarity over cleverness.

Prefer explicit behavior over hidden behavior.

---

# Action Items

Review this document before every implementation session.

Update whenever governance rules change.

Never start implementation without compliance.