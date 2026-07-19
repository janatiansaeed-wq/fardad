# WORK ORDER 031

# CONTENT MANAGEMENT SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-031

> Version: 1.0

> Priority: P1

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری سیستم مدیریت محتوای فرداد را مشخص می‌کند.

هدف ایجاد Content Layer مستقل برای مدیریت:

- مقالات
- صفحات
- محتوای تبلیغاتی
- محتوای SEO
- ارتباط محتوا و محصول

است.


---

# 2. اهمیت Content Management

برای برند فرداد محتوا نقش مهمی دارد:

- افزایش اعتماد مشتری
- معرفی هنر ایرانی
- افزایش رتبه گوگل
- ایجاد اعتبار برند
- افزایش فروش محصولات


---

# 3. اسناد مرجع


PRODUCT_SYSTEM.md

SEO_ARCHITECTURE.md

SEARCH_RECOMMENDATION_SYSTEM.md

ANALYTICS_TRACKING_SYSTEM.md

CUSTOMER_MANAGEMENT_SYSTEM.md



---

# 4. محدوده کار

## شامل:

- Article Management
- Page Management
- Categories
- Tags
- Authors
- Content SEO
- Product Relation


---

## خارج از محدوده:


Social Network Management

External Publishing Automation

Video Platform



---

# 5. معماری کلی Content


```mermaid
flowchart TD

ADMIN[Admin]

ADMIN --> CMS[Content Service]

CMS --> ARTICLE[Articles]

CMS --> PAGE[Pages]

CMS --> MEDIA[Media]

CMS --> SEO[SEO Layer]

CMS --> PRODUCT[Product Relation]

6. اصل طراحی

محتوا نباید داخل Product یا Frontend Hard Code شود.

ساختار:

Content Service

↓

Content API

↓

Frontend Presentation

7. Article Entity

اطلاعات:

id

title

slug

excerpt

content

thumbnail

author_id

status

published_at

created_at

updated_at

8. Article Categories

نمونه:

صنایع دستی ایران

راهنمای خرید

هدایای سازمانی

معرفی هنرمندان

اخبار برند

9. Tag System

برای ارتباط محتوا:

فیروزه

میناکاری

خاتم

قلمزنی

هدیه مدیریتی

10. Author Management

اطلاعات:

Name

Avatar

Biography

Articles

Social Links

11. Content Status

وضعیت‌ها:

DRAFT

REVIEW

PUBLISHED

ARCHIVED

12. Page Management

مدیریت صفحات:

About Us

Contact

Brand Story

Corporate Services

Landing Pages

13. Product Content Relation

ارتباط:

Article

↓

Related Products

↓

Purchase Opportunity


مثال:

مقاله:

"راهنمای انتخاب هدیه مدیریتی"

محصولات مرتبط:

پک‌های VIP

14. SEO Content System

برای هر محتوا:

Meta Title

Meta Description

Canonical URL

Schema Data

Focus Keyword

15. Content Blocks

پشتیبانی:

Text Block

Image Block

Gallery Block

Product Block

Quote Block

CTA Block

16. Landing Page System

برای کمپین‌ها:

Campaign Page

Seasonal Page

Corporate Landing

Product Collection

17. Media Integration

اتصال با:

MEDIA_MANAGEMENT_SYSTEM.md


برای:

تصاویر
فایل‌ها
ویدئوها
18. Content Analytics

ثبت:

Article Views

Reading Time

Related Product Clicks

Conversion

19. Database Entities

اصلی:

articles

article_categories

article_tags

authors

pages

content_blocks

content_relations

20. Backend Module Structure
content/

├── articles/

├── pages/

├── categories/

├── tags/

├── authors/

├── seo/

├── relations/

└── tests/

21. Frontend Components
content/

├── ArticlePage

├── ArticleCard

├── CategoryPage

├── LandingPage

└── RelatedProducts

22. Admin CMS Panel

مدیر بتواند:

Create Article

Edit Article

Publish Content

Manage Categories

Assign Products

Manage SEO

23. API Foundation

نمونه:

GET /articles

GET /articles/:slug

POST /articles

PATCH /articles/:id

GET /pages/:slug

24. Search Integration

محتوا باید وارد Search شود:

Article Title

Content

Tags

Categories

25. Recommendation Integration

استفاده از:

Article Interest

Viewed Content

Related Products

26. Security Requirements

کنترل:

Content Permission

Author Permission

Publishing Access

Admin Roles

27. Audit Events

ثبت:

Article Created

Article Updated

Article Published

Article Deleted

SEO Changed

28. Testing Requirements
Unit Test
Content Validation

Slug Generation

SEO Data

Relation Logic

Integration Test
Article Publish Flow

Product Relation

Search Index Update

29. مراحل اجرا توسط Codex
Step 1

Create Content Module


Step 2

Create Article System


Step 3

Create Page Builder Foundation


Step 4

Create SEO Fields


Step 5

Connect Products


Step 6

Connect Search


Step 7

Create Tests


Step 8

Generate Report

30. اقدامات ممنوع

Codex نباید:

Content را داخل Product ذخیره کند

SEO را فقط در Frontend قرار دهد

صفحات را Hard Code کند

31. معیار پذیرش

☑ CMS مستقل باشد

☑ مقاله قابل مدیریت باشد

☑ SEO قابل تنظیم باشد

☑ محصول و محتوا مرتبط شوند

☑ صفحات فرود پشتیبانی شوند

☑ Analytics فعال باشد

32. گزارش نهایی Codex

شامل:

Content Architecture
Database Schema
APIها
SEO Fields
Tests
Problems