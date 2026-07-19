# ARCHITECTURAL DECISION RECORDS (ADR)

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

This document records every significant architectural decision made during the lifecycle of the Fardad project.

Each decision must include:

- Context
- Problem
- Considered Options
- Final Decision
- Consequences
- Future Review

The purpose is to preserve architectural knowledge and prevent repeated discussions or undocumented changes.

---

# ADR Template

Every architectural decision must follow this template.

---

## ADR-XXX

### Title

Short descriptive title.

---

### Status

- Proposed
- Accepted
- Deprecated
- Superseded

---

### Date

YYYY-MM-DD

---

### Context

Why is this decision required?

What problem exists?

---

### Options Considered

Option A

Advantages

Disadvantages

---

Option B

Advantages

Disadvantages

---

Option C

Advantages

Disadvantages

---

### Decision

Clearly state the selected option.

---

### Rationale

Explain WHY this option was selected.

---

### Consequences

Positive impacts

Negative impacts

Trade-offs

---

### Related Blueprint Chapters

List all affected Blueprint chapters.

---

### Review Trigger

When should this decision be reviewed?

Examples:

- New technology
- Performance issue
- Business growth
- Major release

---

# ADR-001

## Architecture Style

Status

Accepted

---

### Decision

Use Modular Monolith Architecture.

---

### Context

The project requires:

- High maintainability
- Clear module boundaries
- Fast development
- Simple deployment

Microservices would introduce unnecessary operational complexity.

---

### Alternatives

Traditional MVC

Rejected

Too tightly coupled.

---

Microservices

Rejected

Not justified for current business scale.

---

Modular Monolith

Accepted

Provides modularity while remaining operationally simple.

---

### Consequences

Advantages

- Easier maintenance
- Easier testing
- Faster implementation
- Lower infrastructure cost

Disadvantages

- Future extraction may require additional work

---

# ADR-002

## Database

Status

Accepted

---

Decision

Use PostgreSQL.

---

Reason

Strong relational capabilities

Excellent indexing

JSON support

Reliable transactions

Long-term scalability

---

# ADR-003

## ORM

Status

Accepted

---

Decision

Use Prisma ORM.

---

Reason

Type safety

Migration support

Developer productivity

Readable schema

---

# ADR-004

## Frontend Framework

Status

Accepted

---

Decision

Use Next.js.

---

Reason

SEO

SSR

Performance

Routing

Image optimization

---

# ADR-005

## Backend Framework

Status

Accepted

---

Decision

Use NestJS.

---

Reason

Modular architecture

Dependency Injection

Scalability

Testing support

TypeScript-first

---

# ADR-006

## Authentication

Status

Accepted

---

Decision

JWT Authentication

with

Refresh Token Strategy

---

Reason

Stateless

Scalable

Industry standard

---

# ADR-007

## Media Strategy

Status

Accepted

---

Decision

All uploaded images must pass through the Media Pipeline.

Pipeline:

Upload

↓

Virus Scan

↓

Optimization

↓

WebP Conversion

↓

Thumbnail Generation

↓

Metadata Extraction

↓

Storage

---

Reason

Image quality

Performance

Security

SEO

---

# ADR-008

## Search Strategy

Status

Accepted

---

Decision

Database Search

↓

Dedicated Search Service

when scaling requires.

---

Reason

Avoid premature complexity.

---

# ADR-009

## Dashboard

Status

Accepted

---

Decision

Dashboard is a business intelligence tool,

not only an administration panel.

---

Includes:

Sales

Visitors

Products

Orders

Inventory

SEO

System Health

Media

Reports

---

# ADR-010

## Shipping Architecture

Status

Accepted

---

Decision

Provider Adapter Pattern.

Supported providers:

Iran Post

Tipax

Chapar

Future providers

---

Reason

Replace providers without changing business logic.

---

# ADR-011

## Notification Architecture

Status

Accepted

---

Decision

Unified Communication Service.

Channels:

SMS

Email

Internal Notification

Future Push Notification

---

Reason

Single communication layer.

---

# ADR-012

## Invoice Engine

Status

Accepted

---

Decision

Support both:

Individual Customers

Corporate Customers

Official Iranian Invoice Requirements

PDF Generation

Printable Format

---

Reason

Corporate sales are a strategic business goal.

---

# ADR-013

## SEO Philosophy

Status

Accepted

---

Decision

SEO is a core architectural concern,

not an afterthought.

Every public page must be SEO-ready by default.

---

# ADR-014

## Accessibility

Status

Accepted

---

Decision

Follow WCAG 2.2 AA Guidelines wherever practical.

Accessibility is mandatory.

---

# ADR-015

## Coding Philosophy

Status

Accepted

---

Decision

Architecture

↓

Business Rules

↓

Code

Never the opposite.

---

# Decision Lifecycle

Every ADR must be:

Proposed

↓

Reviewed

↓

Accepted

↓

Implemented

↓

Revisited if necessary

---

# Rules

Architecture changes require:

Blueprint Update

ADR Update

Dependency Review

Implementation Review

Approval

---

# Index

| ADR | Title | Status |
|------|-------|--------|
|001|Architecture Style|Accepted|
|002|Database|Accepted|
|003|ORM|Accepted|
|004|Frontend Framework|Accepted|
|005|Backend Framework|Accepted|
|006|Authentication|Accepted|
|007|Media Pipeline|Accepted|
|008|Search Strategy|Accepted|
|009|Dashboard Strategy|Accepted|
|010|Shipping Strategy|Accepted|
|011|Communication Service|Accepted|
|012|Invoice Engine|Accepted|
|013|SEO Strategy|Accepted|
|014|Accessibility|Accepted|
|015|Coding Philosophy|Accepted|

---

# Action Items

- Create a new ADR for every significant architectural decision.
- Never modify an accepted ADR without recording the change.
- Link every ADR to the affected Blueprint chapters and Work Orders.
- Review ADRs during major project milestones and before architectural refactoring.