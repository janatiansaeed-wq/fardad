# WORK ORDER 005

# MEDIA SERVICE IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-005

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team

---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سرویس مدیریت فایل و رسانه (Media Service) پلتفرم فرداد را مشخص می‌کند.

هدف ایجاد یک سیستم حرفه‌ای برای مدیریت:

- تصاویر محصولات
- تصاویر مقالات
- تصاویر صفحات سایت
- تصاویر کاربران
- فایل‌های فاکتور
- فایل‌های سازمانی
- فایل‌های تبلیغاتی

است.

---

# 2. اهمیت Media Service در فرداد

با توجه به ماهیت پلتفرم:

- صنایع دستی لوکس
- محصولات دارای جزئیات ظریف
- نیاز به تصاویر با کیفیت بالا
- نمایش حرفه‌ای در موبایل و دسکتاپ

مدیریت رسانه باید یک سرویس مستقل باشد.

---

# 3. اسناد مرجع

این Work Order بر اساس:


MEDIA_IMAGE_PIPELINE.md

SEO_ARCHITECTURE.md

PERFORMANCE_STRATEGY.md

SECURITY_CHECKLIST.md

PRODUCT_ARCHITECTURE.md

PROJECT_STRUCTURE.md


طراحی شده است.

---

# 4. محدوده کار

## شامل:

- مدیریت Upload
- ذخیره‌سازی فایل
- پردازش تصویر
- تولید نسخه‌های مختلف
- مدیریت Metadata
- اتصال به محصولات
- امنیت فایل‌ها

---

## خارج از محدوده:

در این مرحله نباید ساخته شود:


Product Management

Article Management

Order Attachments

Marketing Campaign System


فقط زیرساخت Media ایجاد می‌شود.

---

# 5. معماری Media Service

```mermaid
flowchart TD

USER[User/Admin]

USER --> UPLOAD[Upload Service]

UPLOAD --> VALIDATION[File Validation]

VALIDATION --> PROCESSOR[Image Processor]

PROCESSOR --> STORAGE[Media Storage]

STORAGE --> CDN[CDN Layer]

CDN --> CLIENT[Frontend]

UPLOAD --> DATABASE[(Media Database)]

6. انواع فایل پشتیبانی شده
تصاویر

پشتیبانی:

JPEG

PNG

WEBP

AVIF

فایل‌ها

در آینده:

PDF

Documents

Certificates

Invoices

7. Storage Architecture

ساختار:

Storage

├── products/

├── articles/

├── users/

├── invoices/

├── campaigns/

└── temporary/

8. Image Processing Pipeline

فرآیند:

Upload

↓

Validation

↓

Virus Check

↓

Optimization

↓

Resize

↓

Format Conversion

↓

Storage

↓

Database Record

9. Image Versions

برای هر تصویر نسخه‌های مختلف تولید می‌شود:

مثال:

original

large

medium

thumbnail

mobile

10. استاندارد تصاویر محصول

برای محصولات لوکس:

نسخه اصلی:

High Resolution


نمایش سایت:

Optimized WebP


موبایل:

Responsive Image

11. Image Metadata

اطلاعات ذخیره شده:

filename

original_name

mime_type

size

width

height

alt_text

caption

uploaded_by

created_at

12. Database Model

Entities:

media_files

media_variants

media_relations

media_folders

13. Media File Entity

اطلاعات:

id

filename

path

storage_type

mime_type

size

created_at

created_by

14. ارتباط Media با سایر ماژول‌ها

Media نباید به Product وابسته باشد.

ساختار:

Media Service

        |

Relation Layer

        |

Product / Article / User

15. Upload Security

کنترل‌ها:

File type validation
File size limitation
Malware scanning
Permission checking

ممنوع:

Executable Upload

Unknown File Type

Unsafe Filename

16. Naming Convention

نام فایل نباید وابسته به نام کاربر باشد.

نمونه:

product-uuid-image.webp

17. CDN Architecture

آماده برای:

Cloud CDN
Object Storage
Edge Delivery

Flow:

User

↓

CDN

↓

Storage

18. Performance Strategy

Media Service باید:

Lazy Loading
Responsive Images
Compression
Caching

را پشتیبانی کند.

19. SEO Requirements

هر تصویر باید امکان:

Alt Text

Title

Caption

Structured Metadata


داشته باشد.

20. Frontend Components

ساختار:

media/

├── ImageUploader

├── MediaPicker

├── GalleryManager

├── ImagePreview

└── UploadProgress

21. Backend Module Structure
media/

├── controllers/

├── services/

├── processors/

├── storage/

├── dto/

├── entities/

└── tests/

22. Integration With Other Services

اتصال:

SEO Service

Product Service

Content Service

Audit Service

Storage Provider

23. Audit Events

ثبت شود:

Image Uploaded

Image Deleted

Image Replaced

Image Metadata Updated

24. Testing Requirements
Unit Test
File validation
Image processing
Integration Test
Upload workflow
Storage connection
Performance Test
Large image handling
25. مراحل اجرا توسط Codex
Step 1

Audit existing media handling


Step 2

Create Media module


Step 3

Create storage abstraction


Step 4

Create upload pipeline


Step 5

Create image processing system


Step 6

Create database models


Step 7

Add security controls


Step 8

Generate final report

26. اقدامات ممنوع

Codex نباید:

Product Module ایجاد کند

صفحات فروش ایجاد کند

منطق سفارش اضافه کند

Storage را به یک Provider خاص قفل کند

27. معیار پذیرش

Work Order کامل است زمانی که:

☑ Media Service مستقل وجود داشته باشد

☑ Upload امن باشد

☑ Image Processing آماده باشد

☑ Metadata ذخیره شود

☑ Storage قابل توسعه باشد

☑ Audit فعال باشد

☑ تست‌ها موفق باشند

28. گزارش نهایی Codex

باید شامل:

خلاصه اجرا
فایل‌های ایجاد شده
ساختار Media
Migrationها
تست‌ها
مشکلات باقی‌مانده

باشد.