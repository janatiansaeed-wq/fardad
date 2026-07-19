# WORK ORDER 007

# CATEGORY AND ATTRIBUTE SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-007

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team

---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سیستم دسته‌بندی و ویژگی‌های پویا برای پلتفرم فرداد را مشخص می‌کند.

هدف:

ایجاد یک سیستم انعطاف‌پذیر که بتواند محصولات صنایع دستی متنوع را بدون تغییر در کد مدیریت کند.

---

# 2. اهمیت این ماژول در فرداد

محصولات صنایع دستی دارای ویژگی‌های متنوع هستند:

مثال:


فیروزه کوبی

جنس: مس

سنگ: فیروزه نیشابور

رنگ: آبی فیروزه‌ای

تکنیک: دست‌ساز

سطح: VIP


یا:


خاتم کاری

نوع چوب

رنگ

ابعاد

هنرمند

زمان ساخت


بنابراین Attributeها نباید ثابت و Hard Code باشند.

---

# 3. اسناد مرجع


PRODUCT_CORE_MODULE.md

SEARCH_ARCHITECTURE.md

SEO_ARCHITECTURE.md

DATABASE_ARCHITECTURE.md

SYSTEM_ARCHITECTURE.md


---

# 4. محدوده کار

## شامل:

- Category Engine
- Dynamic Attributes
- Attribute Groups
- Attribute Values
- Product Filters
- Faceted Search Preparation

---

## خارج از محدوده:

ساخته نمی‌شود:


Search Engine Implementation

Product Recommendation

Order Filtering

Customer Segmentation


---

# 5. معماری کلی

```mermaid
flowchart TD

PRODUCT[Product]

PRODUCT --> CATEGORY[Category System]

PRODUCT --> ATTRIBUTE[Attribute System]

ATTRIBUTE --> GROUP[Attribute Group]

ATTRIBUTE --> VALUE[Attribute Value]

CATEGORY --> FILTER[Filter Engine]

FILTER --> SEARCH[Search Service]

6. Category Architecture

سیستم دسته‌بندی باید Hierarchical باشد.

مثال:

صنایع دستی

|

├── ظروف تزئینی

│

├── فیروزه کوبی

│

├── میناکاری

│

├── خاتم کاری

│

└── قلمزنی

7. Category Entity

اطلاعات:

id

name

slug

description

parent_id

image_id

seo_id

status

sort_order

created_at

updated_at

8. Category Rules

هر دسته باید:

والد داشته باشد
URL مستقل داشته باشد
SEO مستقل داشته باشد
تصویر معرفی داشته باشد
قابلیت نمایش در منو داشته باشد
9. Dynamic Attribute System

ویژگی‌ها باید مستقل باشند.

مثال:

Attribute:

جنس

Values:

مس

نقره

چوب

10. Attribute Groups

برای نظم بیشتر:

مثال:

گروه فنی

- ابعاد
- وزن
- جنس


گروه هنری

- تکنیک ساخت
- هنرمند
- سبک


گروه فروش

- سطح محصول
- کاربرد هدیه

11. Attribute Types

سیستم باید پشتیبانی کند:

Text

Number

Boolean

Select

Multi Select

Color

Measurement

Date

12. نمونه ویژگی‌های فرداد
مشخصات هنری
نوع هنر

تکنیک ساخت

هنرمند

کشور سازنده

مشخصات فیزیکی
طول

عرض

ارتفاع

وزن

مشخصات محصول
رنگ

جنس

متریال

سطح کیفیت

13. Database Architecture

Entities:

categories

category_relations

attributes

attribute_groups

attribute_values

product_attributes

14. Category Tree

پشتیبانی از:

15. Product Attribute Relation

رابطه:

Product

|

Product Attribute

|

Attribute Value

16. Filtering Strategy

آماده برای:

Filter By Material

Filter By Price

Filter By Level

Filter By Color

Filter By Category

17. SEO Integration

هر Category:

دارای:

SEO Title

Meta Description

Slug

Schema Data

Landing Content


است.

18. Frontend Components

ساختار:

categories/

├── CategoryTree

├── CategoryMenu

├── FilterPanel

├── AttributeSelector

└── AttributeDisplay

19. Backend Module Structure
catalog/

├── category/

├── attributes/

├── filters/

├── services/

├── repositories/

└── tests/

20. Validation Rules

Category:

نام الزامی
Slug یکتا
والد معتبر

Attribute:

نوع مشخص
مقدار معتبر
21. Audit Events

ثبت:

Category Created

Category Updated

Attribute Added

Attribute Removed

Value Changed

22. Performance Requirements

سیستم باید:

Cache دسته‌ها
Cache Attributeها
Query Optimization

را پشتیبانی کند.

23. Testing Requirements
Unit Test
Category Tree
Attribute Validation
Integration Test
Product Attribute Assignment
Category Navigation
24. مراحل اجرا توسط Codex
Step 1

Review Product Module


Step 2

Create Category Module


Step 3

Create Attribute Engine


Step 4

Create Database Relations


Step 5

Prepare Filtering API


Step 6

Connect SEO Layer


Step 7

Create Tests


Step 8

Generate Report

25. اقدامات ممنوع

Codex نباید:

Search Engine کامل ایجاد کند

Order Module بسازد

Payment اضافه کند

UI فروشگاه کامل ایجاد کند

26. معیار پذیرش

☑ دسته‌بندی چندسطحی آماده باشد

☑ ویژگی‌های Dynamic آماده باشد

☑ Attribute Group وجود داشته باشد

☑ Product Relation آماده باشد

☑ SEO Integration آماده باشد

☑ تست‌ها موفق باشند

27. گزارش نهایی Codex

شامل:

خلاصه اجرا
فایل‌ها
Migrationها
تست‌ها
مشکلات