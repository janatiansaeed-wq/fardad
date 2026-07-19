# WORK ORDER 027

# SHIPPING MANAGEMENT SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-027

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری سیستم مدیریت ارسال فرداد را مشخص می‌کند.

هدف ایجاد Shipping Layer مستقل برای مدیریت:

- روش‌های ارسال
- هزینه ارسال
- مناطق ارسال
- رهگیری سفارش
- وضعیت تحویل
- اتصال شرکت‌های حمل

است.


---

# 2. اهمیت Shipping در فرداد

محصولات فرداد:

- ارزش مالی بالا دارند
- نیازمند بسته‌بندی امن هستند
- ممکن است سازمانی و حجمی باشند

بنابراین ارسال بخشی از تجربه برند است.


---

# 3. اسناد مرجع


ORDER_MANAGEMENT_SYSTEM.md

PAYMENT_GATEWAY_SYSTEM.md

CUSTOMER_MANAGEMENT_SYSTEM.md

RULE_ENGINE_SYSTEM.md

PRODUCT_SYSTEM.md



---

# 4. محدوده کار

## شامل:

- Shipping Service
- Shipping Methods
- Shipping Rules
- Tracking
- Delivery Status
- Shipping Cost Calculation


---

## خارج از محدوده:


Fleet Management

Own Delivery Network

Warehouse Robotics



---

# 5. معماری کلی Shipping


```mermaid
flowchart TD

ORDER[Order]

ORDER --> SHIPPING[Shipping Service]

SHIPPING --> METHOD[Shipping Method]

SHIPPING --> COST[Cost Calculator]

SHIPPING --> TRACK[Tracking]

TRACK --> CARRIER[Carrier]

SHIPPING --> STATUS[Delivery Status]

6. اصل طراحی

Shipping نباید داخل Order Hard Code شود.

ساختار:

Order

↓

Shipping Service

↓

Shipping Provider

↓

Carrier

7. Shipping Method

روش‌های ارسال:

POST

EXPRESS

COURIER

CORPORATE_DELIVERY

PICKUP

8. Shipping Entity

اطلاعات:

id

order_id

method

carrier

cost

status

tracking_code

created_at

updated_at

9. Shipping Status

وضعیت‌ها:

PENDING

PREPARING

READY_FOR_SHIPMENT

SHIPPED

IN_TRANSIT

DELIVERED

FAILED

RETURNED

10. Shipping Address

اطلاعات:

Country

Province

City

Address

Postal Code

Receiver Name

Receiver Phone

11. Cost Calculation

هزینه ارسال می‌تواند بر اساس:

Weight

Volume

Destination

Order Amount

Customer Type

Shipping Method

12. Free Shipping Rules

اتصال با Rule Engine:

مثال:

اگر مبلغ سفارش بیشتر از X باشد

ارسال رایگان شود

13. Geographic Management

مدیریت:

Countries

Provinces

Cities

Shipping Zones

14. Corporate Shipping

پشتیبانی:

Bulk Orders

Multiple Addresses

Scheduled Delivery

Special Packaging

15. Tracking System

ثبت:

Tracking Number

Carrier

Tracking URL

Last Status

Update Time

16. Carrier Integration

آماده برای:

Post

Tipax

Private Courier

Future Logistics API

17. Delivery Events

ثبت:

SHIPMENT_CREATED

SHIPMENT_SENT

SHIPMENT_UPDATED

SHIPMENT_DELIVERED

SHIPMENT_FAILED

18. Database Entities

اصلی:

shipping_methods

shipping_zones

shipping_rates

shipments

tracking_events

shipping_addresses

19. Backend Module Structure
shipping/

├── methods/

├── rates/

├── zones/

├── tracking/

├── carriers/

├── calculators/

├── dto/

└── tests/

20. Frontend Components
shipping/

├── ShippingSelector

├── AddressForm

├── ShippingEstimate

├── TrackingView

└── DeliveryStatus

21. Checkout Integration

کاربر هنگام خرید:

انتخاب آدرس

↓

انتخاب روش ارسال

↓

محاسبه هزینه

↓

ثبت سفارش

22. Admin Shipping Management

مدیر بتواند:

View Shipments

Update Status

Add Tracking Code

Manage Methods

Manage Costs

23. API Foundation

نمونه:

GET /shipping/methods

POST /shipping/calculate

POST /shipping/create

GET /shipping/:id/tracking

PATCH /shipping/:id/status

24. Analytics Integration

ثبت:

Shipping Cost

Delivery Time

Failed Delivery

Popular Shipping Method

25. Security Requirements

کنترل:

Tracking Data Access

Admin Permission

Customer Ownership

Invalid Status Change

26. Audit Events

ثبت:

Shipping Created

Status Changed

Tracking Added

Delivery Completed

27. Testing Requirements
Unit Test
Cost Calculation

Zone Matching

Status Transition

Integration Test
Checkout Shipping Flow

Tracking Flow

Corporate Delivery Flow

28. مراحل اجرا توسط Codex
Step 1

Create Shipping Module


Step 2

Create Shipping Entities


Step 3

Create Cost Calculator


Step 4

Create Tracking System


Step 5

Connect Checkout


Step 6

Connect Order


Step 7

Create Tests


Step 8

Generate Report

29. اقدامات ممنوع

Codex نباید:

Shipping Logic را داخل Order قرار دهد

هزینه ارسال را Static کند

Carrier را Hard Code کند

30. معیار پذیرش

☑ Shipping Module مستقل باشد

☑ روش‌های ارسال قابل مدیریت باشند

☑ هزینه ارسال محاسبه شود

☑ Tracking فعال باشد

☑ سفارش سازمانی پشتیبانی شود

☑ Rule Engine متصل باشد

☑ تست‌ها موفق باشند

31. گزارش نهایی Codex

شامل:

Shipping Entities
APIها
Providerها
Integrationها
تست‌ها
مشکلات