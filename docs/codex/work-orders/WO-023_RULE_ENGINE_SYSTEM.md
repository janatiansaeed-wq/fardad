# WORK ORDER 023

# RULE ENGINE SYSTEM IMPLEMENTATION

> Project: Fardad Handicraft E-Commerce Platform

> Work Order ID: WO-023

> Version: 1.0

> Priority: P0 - Critical

> Status: Ready For Implementation

> Owner: Architecture Team


---

# 1. هدف سند

این Work Order معماری و پیاده‌سازی Rule Engine پلتفرم فرداد را مشخص می‌کند.

هدف ایجاد یک موتور قوانین مستقل برای مدیریت رفتارهای تجاری بدون نیاز به تغییر کد اصلی سیستم است.

---

# 2. اهمیت Rule Engine در فرداد

فرداد یک فروشگاه ساده نیست.

نیازهای آینده:

- مشتری عادی
- مشتری VIP
- مشتری سازمانی
- سفارش عمده
- کمپین مناسبتی
- تخفیف تعداد
- شرایط خاص ارسال

نباید باعث تغییر مداوم کد شوند.

---

# 3. اسناد مرجع


PRODUCT_SYSTEM.md

ORDER_MANAGEMENT.md

PAYMENT_SYSTEM.md

SHIPPING_SYSTEM.md

CUSTOMER_MANAGEMENT.md

PRICING_ARCHITECTURE.md


---

# 4. محدوده کار

## شامل:

- Rule Engine Core
- Rule Definition
- Rule Evaluation
- Conditions
- Actions
- Priority Management
- Rule History

---

## خارج از محدوده:


AI Decision Engine

Machine Learning Pricing

Autonomous Business Agent


---

# 5. معماری کلی Rule Engine

```mermaid
flowchart TD

EVENT[Business Event]

EVENT --> ENGINE[Rule Engine]

ENGINE --> CONDITION[Condition Evaluator]

CONDITION --> ACTION[Action Executor]

ACTION --> RESULT[Business Result]

ENGINE --> LOG[Rule Execution Log]

6. اصل طراحی

قوانین نباید Hard Code شوند.

غلط:

if(customer.vip)
discount=20

صحیح:

Business Event

↓

Rule Engine

↓

Execute Action

7. Business Events

رویدادهای قابل بررسی:

ORDER_CREATED

CART_UPDATED

PAYMENT_STARTED

CUSTOMER_REGISTERED

PRODUCT_VIEWED

CHECKOUT_STARTED

8. Rule Entity

اطلاعات:

id

name

description

event_type

priority

status

start_date

end_date

created_at

updated_at

9. Rule Condition

شرایط:

مثال:

Customer Type = VIP

Order Amount > 10000000

Product Category = Gift

Quantity >= 5

10. Condition Types

پشتیبانی:

EQUAL

NOT_EQUAL

GREATER_THAN

LESS_THAN

IN

CONTAINS

BETWEEN

11. Rule Action

اقدامات:

APPLY_DISCOUNT

FREE_SHIPPING

CHANGE_PRICE

ADD_GIFT

CHANGE_PRIORITY

SEND_NOTIFICATION

12. Discount Rules

نمونه:

اگر تعداد خرید بیشتر از 10 عدد باشد

20 درصد تخفیف

13. Customer Rules

نمونه:

اگر مشتری سازمانی باشد

قیمت همکاری نمایش داده شود

14. Shipping Rules

نمونه:

اگر مبلغ سفارش بیشتر از X باشد

هزینه ارسال صفر شود

15. VIP Rules

قابلیت:

VIP Customer

VIP Pricing

VIP Support

VIP Delivery

16. Rule Priority

در صورت چند قانون:

مثال:

Priority 1

Corporate Discount


Priority 2

Season Discount


قانون مهم‌تر اجرا شود.

17. Rule Conflict Management

کنترل:

Multiple Discounts

Conflicting Rules

Duplicate Actions

18. Rule Execution Log

ثبت:

rule_id

event

input_data

result

executed_at

19. Database Entities

اصلی:

rules

rule_conditions

rule_actions

rule_executions

rule_versions

20. Backend Module Structure
rules/

├── engine/

├── conditions/

├── actions/

├── evaluators/

├── logs/

├── dto/

└── tests/

21. Frontend Admin Components
rules/

├── RuleList

├── RuleBuilder

├── ConditionEditor

├── ActionEditor

└── RuleHistory

22. Rule Builder

مدیر بتواند:

قانون ایجاد کند
شرط انتخاب کند
اقدام انتخاب کند
زمان فعال بودن تعیین کند

بدون برنامه‌نویسی.

23. API Foundation

نمونه:

GET /rules

POST /rules

PATCH /rules/:id

POST /rules/evaluate

GET /rules/logs

24. Integration Points

اتصال با:

Product Service

Cart Service

Order Service

Payment Service

Shipping Service

Notification Service

25. Dashboard Integration

نمایش:

Active Rules

Executed Rules

Applied Discounts

Rule Performance

26. Security Requirements

کنترل:

Unauthorized Rule Change

Invalid Action Execution

Permission Bypass

27. Audit Requirements

ثبت:

Rule Created

Rule Updated

Rule Activated

Rule Disabled

Rule Executed

28. Testing Requirements
Unit Test
Condition Evaluation

Action Execution

Priority Handling

Integration Test
Order Discount Flow

Shipping Rule Flow

VIP Rule Flow

29. مراحل اجرا توسط Codex
Step 1

Create Rule Module


Step 2

Create Rule Entities


Step 3

Create Condition Engine


Step 4

Create Action Engine


Step 5

Create Admin Builder


Step 6

Connect Business Modules


Step 7

Create Tests


Step 8

Generate Report

30. اقدامات ممنوع

Codex نباید:

قوانین فروش را داخل Order Hard Code کند

Discount Logic را داخل Product قرار دهد

قوانین بدون Audit ایجاد کند

31. معیار پذیرش

☑ Rule Engine مستقل باشد

☑ Condition System فعال باشد

☑ Action System فعال باشد

☑ تخفیف‌ها قابل مدیریت باشند

☑ ارسال رایگان قابل قانون‌گذاری باشد

☑ قوانین Audit شوند

☑ تست‌ها موفق باشند

32. گزارش نهایی Codex

شامل:

Rules ایجاد شده
Database Schema
APIها
Integrationها
تست‌ها
مشکلات