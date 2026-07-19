# WORK ORDER 013

# SHIPPING SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-013

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سیستم مدیریت ارسال پلتفرم فرداد را مشخص می‌کند.

هدف ایجاد یک Shipping Engine مستقل است که بتواند:

- روش‌های مختلف ارسال
- محاسبه هزینه حمل
- اتصال به سرویس‌دهندگان حمل
- مدیریت وضعیت ارسال
- رهگیری سفارش

را پشتیبانی کند.

---

# 2. اهمیت Shipping در فرداد

محصولات فرداد:

- ارزش مالی بالا دارند
- بعضی محصولات شکننده هستند
- بسته‌بندی لوکس دارند
- ممکن است برای مشتری سازمانی ارسال شوند

بنابراین سیستم ارسال باید قابل کنترل و توسعه باشد.

---

# 3. اسناد مرجع


CHECKOUT_SYSTEM.md

ORDER_MANAGEMENT.md

PAYMENT_SYSTEM.md

DATABASE_ARCHITECTURE.md

NOTIFICATION_ARCHITECTURE.md

SECURITY_CHECKLIST.md


---

# 4. محدوده کار

## شامل:

- Shipping Service
- Shipping Methods
- Shipping Providers
- Cost Calculation
- Tracking Foundation
- Shipping Rules

---

## خارج از محدوده:

در این مرحله ساخته نمی‌شود:


انبارداری

مدیریت ناوگان

سیستم لجستیک داخلی

قراردادهای مالی شرکت حمل


---

# 5. معماری کلی Shipping

```mermaid
flowchart TD

ORDER[Order Service]

ORDER --> SHIPPING[Shipping Service]

SHIPPING --> RULES[Shipping Rules]

SHIPPING --> PROVIDER[Provider Adapter]

PROVIDER --> POST[Post Iran]

PROVIDER --> TIPAX[Tipax]

PROVIDER --> OTHER[Other Providers]

SHIPPING --> DATABASE[(Shipping Database)]

6. اصل طراحی

Shipping نباید مستقیم به یک شرکت حمل وابسته باشد.

ساختار:

Shipping Core

↓

Provider Interface

↓

Carrier Adapter

7. Shipping Methods

روش‌های اولیه:

POST

TIPAX

PRIVATE_COURIER

CORPORATE_DELIVERY

PICKUP

8. Shipping Provider Interface

هر سرویس‌دهنده باید:

توانایی:

Calculate Cost

Create Shipment

Get Tracking Code

Get Shipment Status


داشته باشد.

9. محاسبه هزینه ارسال

هزینه می‌تواند بر اساس:

Province

City

Weight

Package Size

Product Type

Order Amount

Customer Type


محاسبه شود.

10. Shipping Rules Engine

قوانین:

مثال:

اگر مبلغ سفارش بیشتر از X باشد:

ارسال رایگان


یا:

محصول شکننده:

فقط تیپاکس

11. Shipping Flow
12. Shipping Entity

اطلاعات:

id

order_id

method

provider

cost

tracking_code

status

created_at

13. Shipping Status

وضعیت‌ها:

PENDING

READY

PICKED_UP

SHIPPED

IN_TRANSIT

DELIVERED

FAILED

RETURNED

14. Tracking System

آماده برای:

Tracking Number

Provider Tracking URL

Status Updates

Customer Notifications

15. اتصال به سفارش

بعد از ایجاد ارسال:

Order باید اطلاعات زیر را داشته باشد:

Shipping Method

Shipping Cost

Tracking Number

Shipping Status

16. Database Entities

اصلی:

shipping_methods

shipping_providers

shipping_rates

shipments

tracking_events

17. Shipping Rate Model

مثال:

Province:

Tehran

Weight:

2kg

Cost:

500000

18. Corporate Shipping

برای مشتری سازمانی:

امکان:

Bulk Delivery

Multiple Addresses

Special Agreement


باید در آینده قابل توسعه باشد.

19. Notification Integration

رویدادها:

Shipment Created

Shipment Sent

Shipment Delivered

Shipment Failed

20. Frontend Components

ساختار:

shipping/

├── ShippingSelector

├── ShippingOption

├── TrackingView

├── DeliveryStatus

└── AddressShippingInfo

21. Backend Module Structure
shipping/

├── controllers/

├── services/

├── providers/

├── rules/

├── dto/

├── entities/

└── tests/

22. API Foundation

نمونه:

GET /shipping/options

POST /shipping/calculate

GET /shipping/tracking/:code

23. Security Requirements

کنترل:

Invalid Provider Response

Fake Tracking Code

Cost Manipulation

Unauthorized Update

24. Dashboard Preparation

اطلاعات مدیریتی:

Total Shipments

Delivered Orders

Failed Shipments

Shipping Cost Reports

Provider Performance

25. Testing Requirements
Unit Test
Cost Calculation
Rule Engine
Integration Test
Provider Adapter
Tracking Flow
26. مراحل اجرا توسط Codex
Step 1

Review Order Module


Step 2

Create Shipping Module


Step 3

Create Provider Interface


Step 4

Create Cost Calculator


Step 5

Create Tracking System


Step 6

Connect Checkout


Step 7

Create Tests


Step 8

Generate Report

27. اقدامات ممنوع

Codex نباید:

مستقیماً به یک شرکت حمل وابسته شود

API شرکت حمل را Hard Code کند

انبارداری ایجاد کند

28. معیار پذیرش

☑ Shipping Service مستقل باشد

☑ Provider Adapter آماده باشد

☑ محاسبه هزینه آماده باشد

☑ Tracking Foundation وجود داشته باشد

☑ Checkout Integration انجام شود

☑ تست‌ها موفق باشند

29. گزارش نهایی Codex

شامل:

خلاصه اجرا
فایل‌های ایجاد شده
APIها
Migrationها
تست‌ها
مشکلات