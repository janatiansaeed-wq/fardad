# CODING STANDARDS

> Project: Fardad Handicraft E-Commerce Platform
>
> Version: 1.0
>
> Status: Active
>
> Last Updated: 2026-07-19
>
> Owner: Software Architecture Team

---

# Purpose

This document defines the mandatory coding standards for the Fardad project.

Every developer and AI coding agent must follow these standards.

Consistency is more important than personal preference.

---

# General Principles

Code must be:

- Readable
- Predictable
- Testable
- Reusable
- Maintainable
- Documented
- Secure
- Performant

---

# Golden Rules

1. Readability over cleverness.
2. Simplicity over complexity.
3. Explicit over implicit.
4. Composition over inheritance.
5. Reuse over duplication.
6. Business logic must never exist in UI components.
7. Never hardcode values that belong in configuration.

---

# Naming Conventions

## Files

Use kebab-case.

Examples:

product-card.tsx

shopping-cart.service.ts

order.repository.ts

---

## Components

Use PascalCase.

Example:

ProductCard

CheckoutForm

DashboardWidget

---

## Variables

Use camelCase.

Examples:

productPrice

userAddress

inventoryCount

---

## Constants

Use UPPER_SNAKE_CASE.

Example:

MAX_IMAGE_SIZE

DEFAULT_PAGE_SIZE

ORDER_TIMEOUT

---

## Database Tables

Plural.

Examples:

products

orders

categories

users

---

## Database Columns

snake_case

Examples:

created_at

updated_at

order_status

company_name

---

## API Endpoints

RESTful.

Examples:

GET /products

POST /products

PATCH /products/{id}

DELETE /products/{id}

---

# Folder Structure

One responsibility per folder.

Example

products/

components/

hooks/

services/

repositories/

validators/

types/

tests/

---

# Component Rules

Every component must:

Have one responsibility.

Receive typed props.

Avoid business logic.

Avoid database logic.

Be reusable.

---

# Service Rules

Services contain business logic.

Services must not render UI.

Services must be independently testable.

---

# Repository Rules

Repositories:

Only communicate with database.

Never contain business logic.

---

# Validation Rules

Validate:

Input

Business Rules

Authorization

Output

Never trust client input.

---

# Error Handling

Never ignore errors.

Always:

Log

Classify

Return meaningful messages

Avoid exposing internal implementation.

---

# Logging Rules

Log:

Errors

Warnings

Security events

Critical business events

Do NOT log:

Passwords

Tokens

Secrets

Payment credentials

---

# Security Standards

Always:

Validate input.

Sanitize output.

Escape HTML.

Use parameterized queries.

Verify permissions.

Protect secrets.

---

# Performance Standards

Avoid:

N+1 queries

Repeated calculations

Large payloads

Unnecessary renders

Duplicate requests

Prefer:

Pagination

Caching

Lazy Loading

Compression

---

# Accessibility Standards

Every UI must support:

Keyboard navigation

Screen readers

Proper labels

Semantic HTML

Visible focus

Sufficient contrast

---

# SEO Standards

Every public page must include:

Title

Meta Description

Canonical URL

Structured Data

Open Graph

Twitter Card

Breadcrumbs

Alt text

---

# Image Standards

Every image must include:

Alt text

Optimized format

Responsive sizes

Lazy loading

Meaningful filename

Compression

---

# Testing Standards

Every feature requires:

Unit tests

Integration tests where applicable

Manual verification

Regression validation

---

# Documentation Standards

Every module must include:

Purpose

Dependencies

Usage

Limitations

Future considerations

---

# Git Standards

Branch names:

feature/product-module

fix/order-status

refactor/dashboard

docs/blueprint

---

Commit Messages

Use Conventional Commits.

Examples:

feat(products): add product gallery

fix(auth): correct login validation

refactor(order): simplify checkout flow

docs(blueprint): update inventory architecture

test(payment): add payment service tests

---

# Code Review Checklist

Reviewers verify:

Architecture compliance

Business rules

Naming conventions

Performance

Security

Accessibility

SEO impact

Documentation

Tests

No duplicated code

---

# Prohibited Practices

Never:

Use magic numbers

Duplicate business logic

Mix UI with business logic

Create circular dependencies

Bypass validation

Bypass authorization

Commit temporary debugging code

Leave commented-out code

Leave TODOs in production code

---

# Definition of Clean Code

Clean code is:

Easy to read.

Easy to test.

Easy to change.

Easy to debug.

Easy to extend.

---

# AI Coding Agent Rules

Before generating code:

Read Blueprint.

Read Dependency Matrix.

Read Work Order.

Read Acceptance Criteria.

Read this Coding Standards document.

Follow project architecture exactly.

Never invent architecture.

Never change naming conventions.

Never introduce undocumented dependencies.

---

# Exceptions

Any deviation from this document requires:

Architecture approval

Blueprint update

Documentation update

Review approval

---

# Action Items

Review this document before every implementation session.

Update whenever project standards evolve.

Ensure all contributors and AI agents comply with these standards.