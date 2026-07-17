\# MASTER BLUEPRINT

\*\*Project:\*\* Fardad Enterprise Commerce Platform  
\*\*Version:\*\* 1.0.0  
\*\*Chapter:\*\* 021  
\*\*Title:\*\* Order Engine Architecture  
\*\*Status:\*\* Approved  
\*\*Owner:\*\* Architecture Team

\---

\# 1\. Purpose

Order Engine مسئول مدیریت چرخه کامل سفارش در پلتفرم فرداد است.

این موتور سفارش را از لحظه افزودن محصول به سبد خرید تا تحویل نهایی، مرجوعی و بایگانی مدیریت می‌کند.

تمام عملیات سفارش فقط از طریق Order Engine انجام می‌شود.

\---

\# 2\. Objectives

اهداف اصلی:

\- مدیریت سفارش  
\- مدیریت سبد خرید  
\- مدیریت وضعیت سفارش  
\- مدیریت اقلام سفارش  
\- مدیریت سفارش‌های سازمانی  
\- مدیریت سفارش‌های سفارشی  
\- مدیریت پیش‌فاکتور  
\- مدیریت مرجوعی  
\- مدیریت لغو سفارش

\---

\# 3\. Order Lifecycle

\`\`\`text  
Cart

↓

Draft Order

↓

Pending Payment

↓

Paid

↓

Processing

↓

Packing

↓

Ready To Ship

↓

Shipped

↓

Delivered

↓

Completed

↓

Archived  
\`\`\`

حالت‌های جانبی:

\`\`\`text  
Cancelled

Returned

Refunded

Failed  
\`\`\`

\---

\# 4\. Order Entity

هر سفارش شامل:

\- شماره سفارش  
\- مشتری  
\- وضعیت  
\- ارز  
\- مبلغ کل  
\- تخفیف  
\- مالیات  
\- هزینه حمل  
\- مبلغ نهایی  
\- تاریخ ثبت  
\- تاریخ پرداخت  
\- تاریخ ارسال  
\- تاریخ تحویل

\---

\# 5\. Order Items

هر سفارش شامل چند قلم کالا است.

هر قلم شامل:

\- محصول  
\- Variant  
\- تعداد  
\- قیمت واحد  
\- تخفیف  
\- مالیات  
\- خدمات جانبی  
\- قیمت نهایی

\---

\# 6\. Shopping Cart

سبد خرید دارای:

\- اقلام  
\- کوپن‌ها  
\- خدمات جانبی  
\- آدرس ارسال  
\- روش ارسال  
\- روش پرداخت  
\- جمع کل

است.

سبد خرید برای کاربران مهمان و کاربران ثبت‌نام‌شده پشتیبانی می‌شود.

\---

\# 7\. Corporate Orders

سفارش سازمانی شامل امکانات زیر است.

\- پیش‌فاکتور  
\- تأیید چندمرحله‌ای  
\- سقف اعتبار  
\- چاپ لوگو  
\- بسته‌بندی اختصاصی  
\- زمان‌بندی ارسال  
\- چند مقصد

\---

\# 8\. Order Status

وضعیت‌های استاندارد:

\- Draft  
\- Pending  
\- Paid  
\- Processing  
\- Packed  
\- Shipped  
\- Delivered  
\- Completed  
\- Cancelled  
\- Returned  
\- Refunded

\---

\# 9\. Business Rules

\- سفارش بدون موجودی ثبت نمی‌شود.  
\- قیمت نهایی فقط توسط Pricing Engine محاسبه می‌شود.  
\- موجودی فقط توسط Inventory Engine رزرو می‌شود.  
\- تخفیف فقط توسط Rule Engine اعمال می‌شود.  
\- پرداخت فقط توسط Payment Engine تأیید می‌شود.

\---

\# 10\. Order Number

شماره سفارش باید:

\- یکتا  
\- قابل جستجو  
\- غیرقابل حدس  
\- قابل چاپ

باشد.

نمونه:

\`\`\`text  
FD-2026-00001528  
\`\`\`

\---

\# 11\. Order Timeline

برای هر سفارش ثبت می‌شود.

\- ایجاد سفارش  
\- پرداخت  
\- تأیید  
\- بسته‌بندی  
\- ارسال  
\- تحویل  
\- مرجوعی  
\- بازپرداخت

\---

\# 12\. Data Dictionary

| Field | Type | Required | Description |  
|--------|------|----------|-------------|  
| orderNumber | String | Yes | شماره سفارش |  
| customerId | UUID | Yes | مشتری |  
| status | Enum | Yes | وضعیت |  
| totalPrice | Decimal | Yes | مبلغ کل |  
| finalPrice | Decimal | Yes | مبلغ نهایی |  
| currency | String | Yes | واحد پول |

\---

\# 13\. Permission Matrix

| Permission | Description |  
|------------|-------------|  
| Order.Read | مشاهده سفارش |  
| Order.Create | ایجاد سفارش |  
| Order.Update | ویرایش سفارش |  
| Order.Cancel | لغو سفارش |  
| Order.Refund | بازپرداخت |  
| Order.Export | خروجی |

\---

\# 14\. API Contracts

\`\`\`text  
GET    /api/v1/orders

GET    /api/v1/orders/{id}

POST   /api/v1/orders

PATCH  /api/v1/orders/{id}

POST   /api/v1/orders/{id}/cancel

POST   /api/v1/orders/{id}/refund

GET    /api/v1/orders/{id}/timeline  
\`\`\`

\---

\# 15\. Validation Rules

قبل از ثبت سفارش بررسی می‌شود:

\- موجودی کالا  
\- وضعیت محصول  
\- اعتبار قیمت  
\- قوانین Rule Engine  
\- اعتبار مشتری  
\- روش پرداخت  
\- روش ارسال

\---

\# 16\. Error Codes

| Code | Description |  
|------|-------------|  
| ORD-001 | Order Not Found |  
| ORD-002 | Invalid Order State |  
| ORD-003 | Payment Required |  
| ORD-004 | Stock Unavailable |  
| ORD-005 | Invalid Customer |  
| ORD-006 | Order Already Completed |

\---

\# 17\. State Machine

\`\`\`text  
Draft

↓

Pending Payment

↓

Paid

↓

Processing

↓

Packing

↓

Ready To Ship

↓

Shipped

↓

Delivered

↓

Completed  
\`\`\`

شاخه‌های جایگزین:

\`\`\`text  
Cancelled

Returned

Refunded  
\`\`\`

\---

\# 18\. Engine Integration

Order Engine با موتورهای زیر یکپارچه است.

\- Product Engine  
\- Pricing Engine  
\- Inventory Engine  
\- Payment Engine  
\- Shipping Engine  
\- Notification Engine  
\- Rule Engine  
\- Customer Engine  
\- Media Engine

\---

\# 19\. Future Extensions

معماری برای قابلیت‌های زیر آماده است.

\- Split Orders  
\- Partial Shipment  
\- Subscription Orders  
\- Marketplace Orders  
\- AI Fraud Detection  
\- Order Automation  
\- International Orders

\---

\# 20\. Architecture Decision 021

هیچ ماژولی اجازه تغییر مستقیم وضعیت سفارش را ندارد.

تمام تغییرات وضعیت فقط از طریق Order Engine و Workflow رسمی سیستم انجام می‌شود.

\---

\# 21\. Acceptance Criteria

این فصل زمانی کامل است که:

\- چرخه سفارش تعریف شده باشد.  
\- ساختار سفارش و اقلام آن مشخص شده باشد.  
\- وضعیت‌های سفارش مستند شده باشند.  
\- APIها تعریف شده باشند.  
\- قوانین کسب‌وکار و اعتبارسنجی ثبت شده باشند.  
\- ارتباط با سایر Engineها مشخص شده باشد.

\---

\*\*End of Chapter 021\*\*  
