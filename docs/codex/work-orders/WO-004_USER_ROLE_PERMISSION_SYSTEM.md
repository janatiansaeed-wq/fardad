# WORK ORDER 004

# USER ROLE AND PERMISSION SYSTEM

> Project: Fardad Handicraft E-Commerce Platform

> شناسه Work Order: WO-004

> نسخه: 1.0

> اولویت: P0 - Critical

> وضعیت: Ready For Implementation

> مالک: Architecture Team

---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سیستم مدیریت کاربران، نقش‌ها و سطح دسترسی‌های پلتفرم فرداد را مشخص می‌کند.

هدف ایجاد یک سیستم حرفه‌ای برای مدیریت:

- مشتریان عادی
- مشتریان سازمانی
- مدیران
- کارکنان داخلی
- تیم فروش
- تیم محتوا
- مدیر سیستم

است.

این سیستم باید قابلیت توسعه در آینده را داشته باشد و محدود به یک فروشگاه ساده نباشد.

---

# 2. اسناد مرجع

این Work Order بر اساس اسناد زیر تهیه شده است:


AUTHENTICATION_AUTHORIZATION_DESIGN.md

SECURITY_CHECKLIST.md

DATABASE_ARCHITECTURE.md

AUDIT_LOG_ARCHITECTURE.md

SYSTEM_ARCHITECTURE.md

PROJECT_STRUCTURE.md


---

# 3. محدوده کار

## شامل:

- طراحی مدل کاربران
- طراحی نقش‌ها
- طراحی Permission System
- مدیریت دسترسی‌ها
- گروه‌بندی کاربران
- آماده‌سازی پنل مدیریت کاربران

---

## خارج از محدوده:

موارد زیر در این مرحله نباید ساخته شوند:


مدیریت محصول

مدیریت سفارش

پرداخت

فاکتور سازمانی

انبار

گزارش‌های فروش


این موارد در Work Orderهای بعدی انجام می‌شوند.

---

# 4. معماری کلی سیستم کاربران

```mermaid
flowchart TD

USER[User]

USER --> ROLE[Role]

ROLE --> PERMISSION[Permission]

PERMISSION --> MODULE[System Module]

MODULE --> ACTION[Allowed Action]

5. مدل مفهومی کاربران

سیستم کاربران از سه بخش تشکیل می‌شود:

Identity

+

Profile

+

Access Control

Identity

اطلاعات ورود:

موبایل
ایمیل
رمز عبور
وضعیت حساب
Profile

اطلاعات شخص:

نام
نام خانوادگی
اطلاعات تماس
آدرس‌ها
Access Control

اطلاعات دسترسی:

نقش
مجوزها
محدودیت‌ها
6. انواع کاربران سیستم

کاربران اولیه:

SUPER_ADMIN

ADMIN

MANAGER

CONTENT_MANAGER

SALES_MANAGER

STAFF

CUSTOMER

CORPORATE_CUSTOMER

7. سیستم Role Based Access Control

مدل دسترسی:

RBAC

(Role Based Access Control)

ساختار:

User

↓

Role

↓

Permission

↓

Action

8. نقش‌های پایه
SUPER_ADMIN

دسترسی کامل:

تنظیمات سیستم
مدیریت کاربران
مدیریت دسترسی‌ها
ADMIN

دسترسی مدیریتی:

مدیریت بخش‌های اصلی سایت
MANAGER

دسترسی مدیریتی محدود:

مشاهده گزارش‌ها
مدیریت تیم
CONTENT_MANAGER

دسترسی:

مقالات
صفحات
محتوای سایت
SALES_MANAGER

دسترسی:

مشتریان
سفارش‌ها
پیگیری فروش
CUSTOMER

دسترسی:

پنل شخصی
سفارش‌ها
اطلاعات حساب
9. ساختار Permission

مجوزها باید بر اساس عملیات تعریف شوند.

فرمت پیشنهادی:

module.action


مثال:

product.create

product.update

product.delete

order.view

order.update

user.manage

10. مدل دیتابیس

Entities اصلی:

users

profiles

roles

permissions

user_roles

role_permissions

11. جدول Users

وظیفه:

نگهداری اطلاعات اصلی حساب.

فیلدهای مهم:

id

mobile

email

password_hash

status

created_at

updated_at

12. جدول Roles

نمونه:

id

name

description

created_at

13. جدول Permissions

نمونه:

id

key

module

action

description

14. ارتباط کاربران و نقش‌ها

یک کاربر می‌تواند چند نقش داشته باشد.

مثال:

User:

محمد

Roles:

Manager

Content Manager

15. Permission Checking

تمام بخش‌های حساس باید Permission بررسی کنند.

مثال:

درخواست:

ویرایش محصول


بررسی:

Does user have:

product.update ?

16. مدیریت کاربران در پنل ادمین

امکانات مورد نیاز:

مشاهده کاربران
جستجوی کاربران
فعال/غیرفعال کردن حساب
تغییر نقش
مشاهده فعالیت‌ها
17. وضعیت کاربران

کاربر می‌تواند:

ACTIVE

INACTIVE

SUSPENDED

PENDING_VERIFICATION


باشد.

18. امنیت

سیستم باید جلوگیری کند از:

Privilege Escalation

Unauthorized Access

Role Abuse

19. Audit Integration

تمام تغییرات دسترسی باید ثبت شوند.

مثال:

Admin changed user role

Old:

Customer


New:

Manager

20. اتصال به Notification

اعلان‌های مهم:

ایجاد حساب
تغییر رمز
تغییر سطح دسترسی
ورود مشکوک
21. Frontend Components

ساختار پیشنهادی:

users/

├── UserTable

├── UserProfile

├── RoleSelector

├── PermissionMatrix

└── AccessGuard

22. Backend Module Structure

ساختار:

users/

├── controllers/

├── services/

├── repositories/

├── dto/

├── entities/

├── guards/

└── tests/

23. تست‌ها
Unit Test

بررسی:

Role validation
Permission checking
Integration Test

بررسی:

ایجاد کاربر
تخصیص نقش
محدودیت دسترسی
24. مراحل اجرا توسط Codex

Codex باید:

مرحله 1

بررسی Authentication موجود


مرحله 2

ایجاد مدل کاربران


مرحله 3

ایجاد Role System


مرحله 4

ایجاد Permission System


مرحله 5

اتصال به Audit Log


مرحله 6

نوشتن تست‌ها


مرحله 7

گزارش نهایی

25. اقدامات ممنوع

Codex نباید:

ساخت محصول

ساخت سفارش

ساخت پرداخت

تغییر معماری Authentication


را انجام دهد.

26. معیار پذیرش

این Work Order کامل است زمانی که:

☑ مدل کاربران ایجاد شده باشد

☑ Role System آماده باشد

☑ Permission System آماده باشد

☑ امنیت دسترسی‌ها بررسی شده باشد

☑ Audit ثبت تغییرات را انجام دهد

☑ تست‌ها موفق باشند

27. گزارش نهایی مورد انتظار

Codex باید ارائه دهد:

خلاصه اجرا

چه چیزهایی ساخته شد.

فایل‌های ایجاد شده

لیست کامل.

تغییرات دیتابیس

لیست Migrationها.

تست‌ها

نتایج تست.

مشکلات باقی‌مانده

موارد نیازمند بررسی.