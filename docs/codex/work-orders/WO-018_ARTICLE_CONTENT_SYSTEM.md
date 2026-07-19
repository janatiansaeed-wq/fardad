# WORK ORDER 018

# ARTICLE & CONTENT MANAGEMENT SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-018

> Version: 1.0

> Priority: P1 - High

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سیستم مدیریت محتوا و مقالات فرداد را مشخص می‌کند.

هدف ایجاد یک Content Engine حرفه‌ای برای مدیریت:

- مقالات
- آموزش‌ها
- داستان محصولات
- معرفی هنرها
- معرفی هنرمندان
- محتوای SEO

است.

---

# 2. نقش محتوا در فرداد

محتوا باید باعث:

- افزایش اعتماد مشتری
- آموزش مخاطب
- افزایش اعتبار برند
- جذب ورودی گوگل
- افزایش فروش

شود.

---

# 3. اسناد مرجع


SEO_SYSTEM.md

PRODUCT_CORE_MODULE.md

MEDIA_MANAGEMENT.md

SEARCH_SYSTEM.md

USER_MANAGEMENT.md

DATABASE_ARCHITECTURE.md


---

# 4. محدوده کار

## شامل:

- Article Module
- Content Categories
- Tags
- Authors
- Related Products
- Media Integration
- SEO Integration

---

## خارج از محدوده:

در این مرحله ساخته نمی‌شود:


AI Content Generator

Social Media Automation

Newsletter Marketing

Advanced CMS Builder


---

# 5. معماری کلی Content

```mermaid
flowchart TD

AUTHOR[Author]

AUTHOR --> ARTICLE[Article Service]

ARTICLE --> CATEGORY[Category]

ARTICLE --> TAG[Tags]

ARTICLE --> MEDIA[Media Service]

ARTICLE --> SEO[SEO Service]

ARTICLE --> PRODUCT[Related Products]

6. Article Entity

اطلاعات:

id

title

slug

excerpt

content

thumbnail_id

author_id

status

published_at

created_at

updated_at

7. Article Status

وضعیت‌ها:

DRAFT

REVIEW

PUBLISHED

ARCHIVED

8. Content Types

سیستم باید آماده:

آموزشی

مثال:

راهنمای شناخت فیروزه اصل
معرفی هنر

مثال:

تاریخچه میناکاری ایران
معرفی محصول

مثال:

داستان ساخت یک پک مدیریتی لوکس
معرفی هنرمند

مثال:

زندگی و آثار یک استاد صنایع دستی
9. Article Category

نمونه:

صنایع دستی ایران

├── فیروزه کوبی

├── خاتم کاری

├── میناکاری

├── قلمزنی

└── هدیه سازمانی

10. Tag System

برچسب‌ها:

مثال:

هدیه مدیریتی

لوکس

دست ساز

اصفهان

هنر ایرانی

11. Author Management

اطلاعات نویسنده:

name

avatar

bio

role

social_links

12. Related Product System

هر مقاله بتواند محصولات مرتبط داشته باشد.

مثال:

مقاله:

راهنمای خرید فیروزه کوبی


محصولات:

پک فیروزه VIP

ظرف فیروزه

13. Media Integration

مقاله پشتیبانی کند:

Thumbnail

Gallery

Embedded Images

Video

PDF

14. SEO Integration

هر مقاله:

دارای:

SEO Title

Meta Description

Schema Article

Canonical URL

Open Graph Image

15. Search Integration

مقالات باید قابل جستجو باشند:

Title

Content

Tags

Category

Author

16. Article Recommendation Foundation

آماده برای آینده:

Related Articles

Popular Articles

Latest Articles

17. Database Entities

اصلی:

articles

article_categories

article_tags

tags

authors

article_products

article_media

18. Frontend Components

ساختار:

articles/

├── ArticleList

├── ArticleDetail

├── ArticleCard

├── RelatedProducts

├── AuthorBox

└── ArticleCategory

19. Backend Module Structure
content/

├── articles/

├── categories/

├── tags/

├── authors/

├── services/

├── dto/

└── tests/

20. API Foundation

نمونه:

GET /articles

GET /articles/:slug

POST /articles

PATCH /articles/:id

DELETE /articles/:id

21. Admin Content Management

مدیر بتواند:

ایجاد مقاله
ویرایش مقاله
انتشار
مدیریت نویسندگان
اتصال محصول
مدیریت تصویر

را انجام دهد.

22. Dashboard Preparation

اطلاعات:

Articles Published Today

Article Views

Most Viewed Articles

Search Traffic

Related Product Clicks

23. Audit Events

ثبت:

Article Created

Article Updated

Article Published

Article Deleted

Author Changed

24. Performance Requirements

سیستم باید:

Pagination داشته باشد
Cache محتوا داشته باشد
تصاویر بهینه شوند
25. Security Requirements

کنترل:

Content Permission

HTML Injection

Unauthorized Publishing

Media Access

26. Testing Requirements
Unit Test
Article Validation
Slug Generation
Integration Test
Article SEO
Product Relation
Media Connection
27. مراحل اجرا توسط Codex
Step 1

Create Content Module


Step 2

Create Article Entity


Step 3

Create Category & Tag System


Step 4

Create Author System


Step 5

Connect Media


Step 6

Connect SEO


Step 7

Create Tests


Step 8

Generate Report

28. اقدامات ممنوع

Codex نباید:

CMS کامل مثل WordPress ایجاد کند

AI Writer اضافه کند

شبکه اجتماعی داخلی بسازد

29. معیار پذیرش

☑ Article Module ایجاد شده باشد

☑ Category و Tag آماده باشد

☑ Author Management وجود داشته باشد

☑ Product Relation فعال باشد

☑ SEO فعال باشد

☑ تست‌ها موفق باشند

30. گزارش نهایی Codex

شامل:

خلاصه اجرا
فایل‌های ایجاد شده
Migrationها
APIها
تست‌ها
مشکلات