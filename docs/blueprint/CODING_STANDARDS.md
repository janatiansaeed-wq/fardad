# CODING STANDARDS

> Project: Fardad Handicraft E-Commerce Platform

> Version: 1.0

> Status: Active

> Last Updated: 2026-07-19

> Owner: Software Architecture Team

---

# 1. Purpose

This document defines coding standards for the Fardad platform.

The purpose is to ensure:

- Maintainable code
- Consistent development practices
- Better collaboration
- Easier debugging
- Safer future expansion

---

# 2. General Principles

All code must follow:

- Clean Code principles
- SOLID principles
- Separation of concerns
- Single responsibility
- Explicit naming
- Minimal duplication

---

# 3. Architecture Rules

The project follows:

```
Presentation Layer

↓

Application Layer

↓

Domain Layer

↓

Infrastructure Layer

```

---

Rules:

Business logic must not exist inside UI components.

Database logic must not exist inside controllers.

---

# 4. Naming Convention

## General Rules

Names must be:

- Meaningful
- Descriptive
- Consistent


Avoid:

```
data

temp

item

value

```

Prefer:

```
customerOrder

productInventory

invoiceAmount

```

---

# 5. File Naming

Use:

```
feature-purpose-type

```

Examples:

```
product-card.component

order-service

invoice-generator

```

---

# 6. Component Standards

Components must:

- Have one responsibility.
- Remain reusable.
- Avoid business calculations.


Example:

Wrong:

```
ProductCard calculates discount
```

Correct:

```
DiscountService calculates discount

ProductCard displays result

```

---

# 7. Component Structure

Recommended:

```
Component

├── View

├── Logic

├── State

├── Styles

└── Tests

```

---

# 8. Function Standards

Functions should:

- Be small
- Do one task
- Have clear names


Bad:

```
processData()

```

Good:

```
calculateOrderShippingCost()

```

---

# 9. Function Size

Avoid:

- Large functions
- Deep nesting
- Complex conditions


Prefer:

- Small functions
- Helper functions
- Clear flow

---

# 10. Variable Standards

Variables must describe purpose.

Bad:

```
x

temp

a

```

Good:

```
customerId

totalPrice

shippingAddress

```

---

# 11. Error Handling

Errors must be:

- Controlled
- Logged
- Meaningful


Never:

```
Ignore error

```

---

Required:

```
Error Type

Message

Context

Timestamp

```

---

# 12. API Coding Standards

APIs must have:

- Consistent naming
- Validation
- Error responses
- Documentation


Example:

Good:

```
GET /api/products

POST /api/orders

```

---

# 13. Database Coding Standards

Rules:

- Use migrations.
- Never modify production manually.
- Use indexes when required.
- Avoid duplicate data.

---

# 14. Database Naming

Tables:

Plural form:

```
products

orders

customers

```

Columns:

Snake case:

```
created_at

customer_id

```

---

# 15. Security Coding Rules

Never:

Store:

```
Passwords

Secrets

API Keys

```

inside source code.

---

Required:

- Input validation
- Authorization checks
- Secure queries

---

# 16. Frontend Coding Standards

Frontend must:

- Separate UI from logic.
- Reuse components.
- Avoid duplicated styles.
- Handle loading states.

---

# 17. Backend Coding Standards

Backend must:

- Use service layer.
- Validate requests.
- Keep controllers thin.
- Handle exceptions centrally.

---

# 18. Documentation Standards

Important modules require documentation:

Examples:

- Payment
- Authentication
- Shipping
- Reporting
- Media

---

# 19. Comments Rules

Comments should explain:

Why something exists.

Avoid comments explaining obvious code.

Bad:

```
Increase counter by one

```

Good:

```
Retry required because payment gateway may delay callback

```

---

# 20. Environment Configuration

Rules:

Configuration must use:

```
Environment Variables

```

Never commit:

```
.env

Secrets

Credentials

```

---

# 21. Dependency Rules

Before adding a package:

Evaluate:

- Security
- Maintenance
- Performance
- License
- Long-term support

---

# 22. Testing Standards

Every important module requires:

- Unit tests
- Integration tests
- Edge case tests

---

# 23. Code Review Rules

Review checks:

## Quality

☐ Clean structure

☐ No duplication

☐ Correct naming


## Security

☐ Authorization checked

☐ Inputs validated


## Performance

☐ No unnecessary processing

---

# 24. Git Commit Standards

Commit format:

```
type(scope): description

```

Examples:

```
feat(product): add product gallery

fix(payment): resolve callback issue

docs(api): update API documentation

```

---

# 25. Branch Naming

Use:

```
feature/name

bugfix/name

hotfix/name

release/version

```

---

# 26. AI Generated Code Rules

For Codex generated code:

Required:

- Review architecture compatibility.
- Run tests.
- Verify security.
- Avoid unnecessary dependencies.

---

# 27. Refactoring Rules

Refactoring requires:

- Clear reason
- Testing before and after
- Documentation update

---

# 28. Production Quality Gate

Code cannot enter production if:

- Tests fail.
- Security issues exist.
- Documentation is missing.
- Architecture rules are violated.

---

# 29. Future Development Rules

All new modules must include:

- Architecture document
- API design
- Database changes
- Test plan

---

# 30. Success Criteria

Coding standards are successful when:

- Code remains maintainable.
- New developers understand the system.
- Features can be added safely.
- Technical debt stays controlled.

---

# Action Items

- Apply coding standards from the first implementation day.
- Review AI-generated code before merging.
- Keep architecture documents synchronized.
- Enforce naming and structure consistency.
- Link coding changes to Work Orders.