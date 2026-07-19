# WORK ORDER 009

# SHOPPING CART SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-009

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سیستم سبد خرید پلتفرم فرداد را مشخص می‌کند.

هدف ایجاد یک Cart Engine مستقل، قابل توسعه و آماده اتصال به:

- Checkout
- Payment
- Order
- Shipping

است.

---

# 2. اسناد مرجع

این Work Order بر اساس:


PRODUCT_CORE_MODULE.md

AUTHENTICATION_SYSTEM.md

DATABASE_ARCHITECTURE.md

SEARCH_ARCHITECTURE.md

SYSTEM_ARCHITECTURE.md


طراحی شده است.

---

# 3. محدوده کار

## شامل:

- ایجاد Cart Service
- مدیریت آیتم‌های سبد
- سبد مهمان
- سبد کاربر
- Merge Cart
- محاسبه اولیه قیمت
- ذخیره وضعیت سبد

---

## خارج از محدوده:

در این مرحله ساخته نمی‌شود:


Checkout

Payment Gateway

Shipping Calculation

Invoice

Order Creation

Discount Engine


---

# 4. معماری کلی Cart

```mermaid
flowchart TD

USER[Customer]

USER --> CART[Cart Service]

CART --> PRODUCT[Product Service]

CART --> PRICE[Pricing Service]

CART --> DATABASE[(Cart Database)]

CART --> CHECKOUT[Checkout Service]

5. اصول طراحی Cart

Cart باید:

مستقل از Order باشد
قابل بازیابی باشد
برای مهمان و کاربر کار کند
قابلیت توسعه داشته باشد
6. انواع سبد خرید

سیستم دو نوع سبد دارد:

Guest Cart

برای کاربر بدون ورود:

Browser Session

↓

Temporary Cart

Customer Cart

برای کاربر ثبت‌نام‌شده:

User Account

↓

Persistent Cart

7. انتقال Guest Cart به User Cart

سناریو:

Guest Adds Product

↓

Login

↓

Merge Cart

↓

Customer Cart Created

8. Cart Entity

اطلاعات:

id

user_id

session_id

status

created_at

updated_at

9. Cart Item Entity

اطلاعات:

id

cart_id

product_id

quantity

unit_price

total_price

created_at

updated_at

10. Cart Status

وضعیت‌ها:

ACTIVE

ABANDONED

CONVERTED

EXPIRED

11. عملیات اصلی Cart

سیستم باید پشتیبانی کند:

Add Item

افزودن محصول

Remove Item

حذف محصول

Update Quantity

تغییر تعداد

Clear Cart

خالی کردن سبد

View Cart

مشاهده سبد

12. قوانین تعداد محصول

قبل از افزودن:

بررسی شود:

موجود بودن محصول
محدودیت خرید
وضعیت انتشار
13. Price Calculation Foundation

Cart باید آماده دریافت:

Base Price

Product Level Price

Corporate Price

Future Discount


باشد.

14. Product Snapshot

برای جلوگیری از مشکل تغییر قیمت:

Cart Item باید Snapshot داشته باشد.

مثال:

Product Price At Add Time

Product Name At Add Time

15. Database Architecture

Entities:

carts

cart_items

cart_sessions

cart_events

16. Cart Events

ثبت رویدادها:

Item Added

Item Removed

Quantity Updated

Cart Created

Cart Abandoned

17. Abandoned Cart Preparation

سیستم باید آماده ثبت:

سبدهای رها شده
زمان آخرین فعالیت
تعداد محصولات

باشد.

18. Notification Integration

در آینده:

Abandoned Cart Reminder

Purchase Reminder

19. Frontend Components

ساختار:

cart/

├── CartDrawer

├── CartPage

├── CartItem

├── QuantitySelector

├── CartSummary

└── EmptyCart

20. Backend Module Structure
cart/

├── controllers/

├── services/

├── repositories/

├── dto/

├── entities/

└── tests/

21. API Foundation

نمونه API:

GET /cart

POST /cart/items

PATCH /cart/items/:id

DELETE /cart/items/:id

DELETE /cart

22. Security Requirements

کنترل:

دسترسی به Cart دیگران
Session Abuse
Invalid Product Reference
23. Performance Requirements

Cart باید:

سریع پاسخ دهد
Queryهای اضافی نداشته باشد
Cache را در آینده پشتیبانی کند
24. Testing Requirements
Unit Test
Add Item
Remove Item
Quantity Update
Integration Test
Guest Cart
Login Merge
Product Validation
25. مراحل اجرا توسط Codex
Step 1

Review Product Module


Step 2

Create Cart Module


Step 3

Create Cart Entities


Step 4

Implement Cart Operations


Step 5

Create API Layer


Step 6

Add Validation


Step 7

Create Tests


Step 8

Generate Report

26. اقدامات ممنوع

Codex نباید:

Checkout ایجاد کند

Payment اضافه کند

Order بسازد

Shipping اضافه کند

27. معیار پذیرش

☑ Cart Service مستقل ایجاد شده باشد

☑ Guest Cart کار کند

☑ User Cart کار کند

☑ Merge Cart آماده باشد

☑ API آماده باشد

☑ تست‌ها موفق باشند

28. گزارش نهایی Codex

شامل:

خلاصه اجرا
فایل‌های ایجاد شده
Migrationها
APIها
تست‌ها
مشکلات