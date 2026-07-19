# WORK ORDER 015

# NOTIFICATION SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-015

> Version: 1.0

> Priority: P1 - High

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی سیستم اعلان پلتفرم فرداد را مشخص می‌کند.

هدف ایجاد یک Notification Engine مستقل برای ارسال:

- SMS
- Email
- In-App Notification
- Future Push Notification

است.

---

# 2. اهمیت Notification در فرداد

در فروشگاه حرفه‌ای، ارتباط با مشتری فقط هنگام خرید نیست.

سیستم باید بتواند:

- اعتماد ایجاد کند
- مشتری را از وضعیت سفارش مطلع کند
- ورود امن ایجاد کند
- ارتباط سازمانی را مدیریت کند

---

# 3. اسناد مرجع


AUTHENTICATION_SYSTEM.md

ORDER_MANAGEMENT.md

PAYMENT_SYSTEM.md

SHIPPING_SYSTEM.md

USER_MANAGEMENT.md

AUDIT_LOG_ARCHITECTURE.md


---

# 4. محدوده کار

## شامل:

- Notification Service
- SMS Provider Interface
- OTP System Foundation
- Email Foundation
- Notification Templates
- Notification Logs

---

## خارج از محدوده:

در این مرحله ساخته نمی‌شود:


Marketing Automation

Campaign Engine

Newsletter System

Advanced CRM Messaging


---

# 5. معماری کلی Notification

```mermaid
flowchart TD

EVENT[System Events]

EVENT --> NOTIFICATION[Notification Service]

NOTIFICATION --> TEMPLATE[Template Engine]

NOTIFICATION --> CHANNEL[Channel Manager]

CHANNEL --> SMS[SMS Provider]

CHANNEL --> EMAIL[Email Provider]

CHANNEL --> APP[In App]

NOTIFICATION --> LOG[Notification Logs]

6. اصل طراحی

هیچ ماژولی نباید مستقیم SMS ارسال کند.

غلط:

Order Service

↓

SMS API


صحیح:

Order Service

↓

Event

↓

Notification Service

↓

SMS Provider

7. Notification Channels

کانال‌ها:

SMS

EMAIL

IN_APP

PUSH

8. SMS Provider Architecture

ساختار:

SMS Interface

|

├── Provider Adapter 1

├── Provider Adapter 2

└── Future Provider

9. OTP System

کاربرد:

ورود
ثبت‌نام
تایید شماره موبایل
10. OTP Entity

اطلاعات:

id

mobile

code_hash

purpose

expires_at

attempts

status

created_at

11. OTP Rules

قوانین:

زمان اعتبار:

مثلاً 2 دقیقه


تعداد تلاش محدود باشد


کد قبلی بی‌اعتبار شود

12. Notification Templates

تمام پیام‌ها باید Template باشند.

مثال:

ORDER_CREATED

PAYMENT_SUCCESS

ORDER_SHIPPED

OTP_LOGIN

13. Template Entity

اطلاعات:

id

name

channel

content

variables

status

created_at

14. Variable System

نمونه:

پیام:

سفارش {{order_number}} ثبت شد.


متغیر:

customer_name

order_number

tracking_code

amount

15. Event Driven Architecture

رویدادها:

User Registered

OTP Requested

Order Created

Payment Completed

Shipment Created

Invoice Generated

16. Notification Log

ثبت شود:

Recipient

Channel

Template

Status

Provider Response

Created Date

17. Database Entities

اصلی:

notifications

notification_templates

notification_logs

otp_requests

sms_providers

18. Frontend Components

ساختار:

notifications/

├── NotificationCenter

├── NotificationList

├── NotificationItem

└── NotificationSettings

19. Backend Module Structure
notification/

├── controllers/

├── services/

├── channels/

├── templates/

├── providers/

├── dto/

└── tests/

20. API Foundation

نمونه:

POST /notifications/send

GET /notifications

POST /auth/request-otp

POST /auth/verify-otp

21. Admin Management

مدیر بتواند:

مشاهده پیام‌ها
مشاهده خطاها
مدیریت Templateها
تغییر Provider

را انجام دهد.

22. Security Requirements

کنترل:

OTP Abuse

SMS Spam

Rate Limiting

Sensitive Data Exposure

23. Dashboard Preparation

اطلاعات:

SMS Sent Today

OTP Requests

Failed Messages

Notification Success Rate

Provider Statistics

24. Testing Requirements
Unit Test
OTP Generation
Template Rendering
Notification Routing
Integration Test
Order Event To SMS
Payment Event To Notification
25. مراحل اجرا توسط Codex
Step 1

Review Existing Auth


Step 2

Create Notification Module


Step 3

Create Channel Interface


Step 4

Create SMS Adapter


Step 5

Create OTP Service


Step 6

Create Template Engine


Step 7

Create Logs


Step 8

Generate Report

26. اقدامات ممنوع

Codex نباید:

مستقیماً افزونه پیامکی وردپرس استفاده کند

SMS Logic داخل Order قرار دهد

Marketing Campaign بسازد

27. معیار پذیرش

☑ Notification Service مستقل باشد

☑ OTP Architecture آماده باشد

☑ SMS Provider قابل تعویض باشد

☑ Template System وجود داشته باشد

☑ Logs ثبت شوند

☑ تست‌ها موفق باشند

28. گزارش نهایی Codex

شامل:

خلاصه اجرا
فایل‌ها
APIها
Providerها
تست‌ها
مشکلات