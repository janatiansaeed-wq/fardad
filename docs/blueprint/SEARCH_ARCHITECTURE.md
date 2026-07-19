# SEARCH ARCHITECTURE

> Project: Fardad Handicraft E-Commerce Platform

> Version: 1.0

> Status: Active

> Last Updated: 2026-07-19

> Owner: Software Architecture Team

---

# 1. Purpose

This document defines the search architecture of the Fardad platform.

The objective is to provide a powerful search system for:

- Products
- Categories
- Articles
- Pages
- Corporate gifts
- Handmade collections

---

# 2. Search Philosophy

The search system must understand that customers search based on:

- Product name
- Art technique
- Material
- Usage
- Budget
- Audience
- Gift purpose

---

# 3. Search Architecture Overview

```mermaid
flowchart TD

USER[Customer Search]

USER --> SEARCH_API[Search API]

SEARCH_API --> ENGINE[Search Engine]

ENGINE --> INDEX[Index Database]

INDEX --> PRODUCT[Products]

INDEX --> CONTENT[Articles]

INDEX --> CATEGORY[Categories]

SEARCH_API --> FILTER[Filtering System]

FILTER --> RESULT[Search Result]
Commerce

Examples:

Order confirmation
Payment result
Shipping status
Marketing

Examples:

Promotions
Campaign messages
7. SMS Provider Abstraction

The platform should not depend on one provider.

Architecture:

Notification Service

↓

SMS Adapter

↓

Provider


Example providers:

Iranian SMS gateways
Corporate SMS services
8. OTP Notification Flow
9. Order Notifications

Order events:

Order Created

Payment Successful

Payment Failed

Order Processing

Order Shipped

Order Completed

Order Cancelled

10. Customer Notifications

Customers receive:

Account creation
Login alerts
Order updates
Invoice availability
Support messages
11. Corporate Customer Notifications

Corporate users receive:

Registration confirmation
Verification status
Quote requests
Corporate orders
Invoice notifications
12. Admin Notifications

Administrators receive:

New order
Failed payment
Low inventory
Security alerts
Important system errors
13. Notification Templates

Templates must be managed separately.

Example:

Order Confirmation:

سلام {customer_name}

سفارش شما با شماره {order_id} ثبت شد.


Templates contain:

Title
Content
Variables
Channel
Language
14. Notification Database Model

Main entities:

Notification

NotificationTemplate

NotificationProvider

NotificationLog

NotificationPreference

15. Notification Status

Each message tracks:

Created

Queued

Sent

Delivered

Failed

Retrying

16. Retry Strategy

Failed notifications require:

Automatic retry
Maximum retry limit
Failure reason logging

Example:

Attempt 1

↓

Failure

↓

Retry

↓

Success / Final Failure

17. User Notification Preferences

Users can control:

Marketing messages
Email notifications
Promotional alerts

Mandatory notifications:

Security
Order status

cannot be disabled.

18. Security Requirements

Must protect:

Phone numbers
Email addresses
Message content

Never expose:

OTP codes
Private customer information
19. Audit Integration

Notification events must connect with:

Audit Log Service

Tracked:

Who triggered notification
When sent
Recipient
Result
20. Performance Strategy

Notification sending should use:

Background jobs
Queue processing
Asynchronous delivery

Avoid:

Sending messages during main user request.

21. Implementation Priority

Order:

1. Notification Core Service

2. SMS Provider Adapter

3. OTP System

4. Order Notifications

5. Email System

6. Admin Notifications

7. Marketing Automation

22. Future Expansion

Possible features:

WhatsApp integration
Telegram integration
Push notifications
AI personalized campaigns
23. Success Criteria

Notification architecture is successful when:

Messages are reliable.
Providers can be replaced easily.
Delivery status is traceable.
Business events trigger correct notifications.
Action Items
Define notification events before coding.
Create message templates before implementation.
Keep provider integration isolated.
Test failed delivery scenarios.
Link notification tasks to Codex Work Orders.

---

## وضعیت Blueprint:

```text
/docs/blueprint/

✅ MASTER_BLUEPRINT_INDEX.md
✅ DEPENDENCY_MATRIX.md
✅ SYSTEM_ARCHITECTURE.md
✅ DATABASE_ARCHITECTURE.md
✅ API_ARCHITECTURE.md
✅ FRONTEND_ARCHITECTURE.md
✅ BACKEND_ARCHITECTURE.md
✅ COMPONENT_HIERARCHY.md
✅ STATE_MANAGEMENT_STRATEGY.md
✅ AUTHENTICATION_AUTHORIZATION_DESIGN.md
✅ MEDIA_IMAGE_PIPELINE.md
✅ SEO_ARCHITECTURE.md
✅ PERFORMANCE_STRATEGY.md
✅ SECURITY_CHECKLIST.md
✅ ACCESSIBILITY_CHECKLIST.md
✅ DEPLOYMENT_ARCHITECTURE.md
✅ TESTING_STRATEGY.md
✅ CODING_STANDARDS.md
✅ GIT_WORKFLOW.md
✅ DEVELOPMENT_ROADMAP.md
✅ IMPLEMENTATION_ORDER.md
✅ CODEX_WORK_ORDER_TEMPLATE.md
✅ MODULE_DEPENDENCY_MAP.md
✅ REPORTING_ANALYTICS_ARCHITECTURE.md
✅ NOTIFICATION_ARCHITECTURE.md

⏳ باقی:

1. SEARCH_ARCHITECTURE.md
2. AUDIT_LOG_ARCHITECTURE.md
3. INTEGRATION_ARCHITECTURE.md
4. FINAL_BLUEPRINT_REVIEW.md

مرحله بعدی:

/docs/blueprint/SEARCH_ARCHITECTURE.md

این سند مشخص می‌کند جستجوی فرداد چگونه طراحی شود:

جستجوی محصول
فیلترهای صنایع دستی
رنگ، جنس، تکنیک ساخت
جستجوی مقالات
پیشنهاد هوشمند
آماده‌سازی برای Search پیشرفته در آینده

این بخش برای سایت صنایع دستی لوکس فرداد بسیار مهم است، چون مشتری معمولاً بر اساس نوع هنر، متریال، کاربرد هدیه و بودجه جستجو می‌کند، نه فقط نام محصول.

سند بعدی

مرحله بعدی طبق مسیر Blueprint، تولید سند SEARCH ARCHITECTURE است.

این سند برای فرداد اهمیت ویژه‌ای دارد، چون جستجوی یک فروشگاه صنایع دستی لوکس با فروشگاه‌های عمومی متفاوت است.

مشتری ممکن است جستجو کند:

خاتم کاری
فیروزه کوبی
قلمزنی
هدیه سازمانی
پک مدیریتی
هدیه زیر ۵ میلیون تومان
محصولات مسی
صنایع دستی اصفهان
ست هدیه مدیران

بنابراین Search باید فقط یک جستجوی متنی ساده نباشد، بلکه قابلیت فیلتر و توسعه هوشمند داشته باشد.

فایل
/docs/blueprint/SEARCH_ARCHITECTURE.md
# SEARCH ARCHITECTURE

> Project: Fardad Handicraft E-Commerce Platform

> Version: 1.0

> Status: Active

> Last Updated: 2026-07-19

> Owner: Software Architecture Team

---

# 1. Purpose

This document defines the search architecture of the Fardad platform.

The objective is to provide a powerful search system for:

- Products
- Categories
- Articles
- Pages
- Corporate gifts
- Handmade collections

---

# 2. Search Philosophy

The search system must understand that customers search based on:

- Product name
- Art technique
- Material
- Usage
- Budget
- Audience
- Gift purpose

---

# 3. Search Architecture Overview

```mermaid
flowchart TD

USER[Customer Search]

USER --> SEARCH_API[Search API]

SEARCH_API --> ENGINE[Search Engine]

ENGINE --> INDEX[Index Database]

INDEX --> PRODUCT[Products]

INDEX --> CONTENT[Articles]

INDEX --> CATEGORY[Categories]

SEARCH_API --> FILTER[Filtering System]

FILTER --> RESULT[Search Result]

4. Searchable Entities

The search system indexes:

Products

Fields:

Product name
Description
Category
Material
Technique
Price
Tags
Categories

Examples:

Gift Packs
Copper Products
Turquoise Work
Enamel Work
Khatam Work
Content

Includes:

Articles
Landing pages
Educational content
5. Search Modes

The platform supports:

Exact Search

Example:

فیروزه کوبی

Partial Search

Example:

فیروزه


Returns:

فیروزه کوبی

سنگ فیروزه

Semantic Search (Future)

Understanding meaning:

Example:

هدیه برای مدیرعامل


Results:

Luxury corporate gift packages

6. Product Search Filters

Required filters:

Category

Examples:

Gift Pack
Decorative Item
Corporate Gift
Material

Examples:

Copper
Silver
Turquoise
Wood
Technique

Examples:

Engraving
Enamel
Khatam
Turquoise Inlay
Price Range

Example:

0 - 5M

5M - 20M

20M+

Usage

Examples:

Corporate Gift
Home Decoration
Executive Gift
7. Search Ranking Strategy

Results should be ranked by:

Priority:

1. Exact product match

2. Product title match

3. Category match

4. Tags match

5. Popularity

6. Customer behavior

8. Search Suggestions

The system should provide:

Auto completion
Popular searches
Recent searches

Example:

User types:

فیرو


System suggests:

فیروزه کوبی

پک فیروزه

هدیه فیروزه ای

9. Search Analytics

Track:

Search keywords
No-result searches
Popular searches
Conversion after search

Example:

Keyword:

پک مدیریتی

Search:

2000 times

Purchase:

120

Conversion:

6%

10. Search Database Model

Entities:

SearchIndex

SearchQuery

SearchHistory

SearchSuggestion

SearchAnalytics

11. Search Performance

Requirements:

Fast response
Indexed data
Cached popular searches

Target:

Search response < 300ms

12. Search Security

Protect against:

Injection attacks
Malicious queries
Data exposure
13. Frontend Search Components

Required components:

SearchBox

SearchResults

FilterPanel

ProductSuggestion

SearchHistory

14. Mobile Search

Mobile experience:

Required:

Large search input
Easy filtering
Fast loading
Clear results
15. SEO Integration

Search system must support:

Search-friendly URLs
Category landing pages
Structured filtering

Avoid:

Creating unlimited indexable filter URLs.

16. Admin Search Management

Admin should manage:

Search keywords
Synonyms
Hidden keywords
Featured results
17. Synonym System

Examples:

مدیریتی

=

سازمانی

=

هدیه مدیران

18. Implementation Strategy

Phase 1:

Basic database search

Phase 2:

Advanced filtering

Phase 3:

Search analytics

Phase 4:

AI semantic search

19. Technology Direction

Initial:

Application database indexing

Future:

Dedicated search engine

Examples:

Elasticsearch
Meilisearch
OpenSearch
20. Integration With Other Modules

Search connects with:

Product

Category

Content

SEO

Analytics

Recommendation

21. Success Criteria

Search architecture is successful when:

Customers find products quickly.
Search results are relevant.
Zero-result searches decrease.
Search improves sales conversion.
Action Items
Define product search attributes before implementation.
Create searchable fields in database design.
Track search behavior from first release.
Prepare for future AI search expansion.
Link search tasks to Codex Work Orders.

---

## وضعیت Blueprint:

```text
/docs/blueprint/

✅ MASTER_BLUEPRINT_INDEX.md
✅ DEPENDENCY_MATRIX.md
✅ SYSTEM_ARCHITECTURE.md
✅ DATABASE_ARCHITECTURE.md
✅ API_ARCHITECTURE.md
✅ FRONTEND_ARCHITECTURE.md
✅ BACKEND_ARCHITECTURE.md
✅ COMPONENT_HIERARCHY.md
✅ STATE_MANAGEMENT_STRATEGY.md
✅ AUTHENTICATION_AUTHORIZATION_DESIGN.md
✅ MEDIA_IMAGE_PIPELINE.md
✅ SEO_ARCHITECTURE.md
✅ PERFORMANCE_STRATEGY.md
✅ SECURITY_CHECKLIST.md
✅ ACCESSIBILITY_CHECKLIST.md
✅ DEPLOYMENT_ARCHITECTURE.md
✅ TESTING_STRATEGY.md
✅ CODING_STANDARDS.md
✅ GIT_WORKFLOW.md
✅ DEVELOPMENT_ROADMAP.md
✅ IMPLEMENTATION_ORDER.md
✅ CODEX_WORK_ORDER_TEMPLATE.md
✅ MODULE_DEPENDENCY_MAP.md
✅ REPORTING_ANALYTICS_ARCHITECTURE.md
✅ NOTIFICATION_ARCHITECTURE.md
✅ SEARCH_ARCHITECTURE.md

⏳ باقی:

1. AUDIT_LOG_ARCHITECTURE.md
2. INTEGRATION_ARCHITECTURE.md
3. FINAL_BLUEPRINT_REVIEW.md