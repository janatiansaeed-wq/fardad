\# MASTER BLUEPRINT

\*\*Project:\*\* Fardad Enterprise Commerce Platform  
\*\*Version:\*\* 1.0.0  
\*\*Chapter:\*\* 018  
\*\*Title:\*\* Pricing Engine Architecture  
\*\*Status:\*\* Approved  
\*\*Owner:\*\* Architecture Team

\---

\# 1\. Purpose

Pricing Engine مسئول مدیریت تمام منطق قیمت‌گذاری در پلتفرم فرداد است.

این موتور قیمت نهایی هر محصول را بر اساس قوانین کسب‌وکار، نوع مشتری، کمپین‌ها، خدمات جانبی، سطح محصول و سایر عوامل محاسبه می‌کند.

هیچ ماژولی اجازه محاسبه مستقل قیمت را ندارد.

\---

\# 2\. Objectives

اهداف اصلی:

\- قیمت‌گذاری پویا  
\- قیمت‌های چندگانه  
\- قیمت مشتریان سازمانی  
\- قیمت صادراتی  
\- تخفیف‌های ترکیبی  
\- قیمت بر اساس Variant  
\- قیمت بر اساس خدمات  
\- قیمت بر اساس کمپین  
\- آماده برای چند ارز

\---

\# 3\. Price Types

سیستم باید از قیمت‌های زیر پشتیبانی کند.

\- Base Price  
\- Sale Price  
\- Wholesale Price  
\- Corporate Price  
\- VIP Price  
\- Export Price  
\- Representative Price  
\- Marketplace Price  
\- Auction Price  
\- Dynamic Price

\---

\# 4\. Price Components

قیمت نهایی از اجزای زیر تشکیل می‌شود.

\- قیمت پایه  
\- Variant  
\- خدمات جانبی  
\- تخفیف  
\- کمپین  
\- مالیات  
\- هزینه بسته‌بندی  
\- هزینه حمل  
\- بیمه

\---

\# 5\. Pricing Formula

\`\`\`text  
Final Price

\=

Base Price

\+

Variant Price

\+

Services

\-

Discount

\+

Tax

\+

Shipping

\+

Insurance  
\`\`\`

\---

\# 6\. Customer Pricing

قیمت می‌تواند بر اساس موارد زیر تغییر کند.

\- گروه مشتری  
\- مشتری سازمانی  
\- نمایندگی  
\- صادرات  
\- سطح وفاداری  
\- قرارداد اختصاصی

\---

\# 7\. Product Level Pricing

هر سطح محصول می‌تواند قوانین قیمت‌گذاری مستقل داشته باشد.

\- Economic  
\- Standard  
\- Premium  
\- Luxury  
\- Super Luxury  
\- VIP  
\- Royal  
\- Limited Edition

\---

\# 8\. Discount Types

پشتیبانی از:

\- درصدی  
\- مبلغ ثابت  
\- پلکانی  
\- تعدادی  
\- خرید X دریافت Y  
\- هدیه  
\- کد تخفیف  
\- اعتبار کیف پول

\---

\# 9\. Price Validity

هر قیمت می‌تواند دارای:

\- تاریخ شروع  
\- تاریخ پایان  
\- ساعت شروع  
\- ساعت پایان  
\- اولویت

باشد.

\---

\# 10\. Currency Support

ساختار از ابتدا برای:

\- ریال  
\- تومان  
\- دلار  
\- یورو  
\- درهم

آماده است.

\---

\# 11\. Tax Rules

مالیات بر اساس:

\- کشور  
\- استان  
\- نوع مشتری  
\- نوع کالا

قابل تعریف است.

\---

\# 12\. Business Rules

\- قیمت منفی مجاز نیست.  
\- تخفیف نمی‌تواند از قیمت بیشتر باشد.  
\- قیمت نهایی همیشه توسط Pricing Engine محاسبه می‌شود.  
\- قیمت‌ها نسخه‌بندی می‌شوند.  
\- تمام تغییرات Audit می‌شوند.

\---

\# 13\. Data Dictionary

| Field | Type | Required | Description |  
|------|------|----------|-------------|  
| productId | UUID | Yes | شناسه محصول |  
| variantId | UUID | No | شناسه تنوع |  
| priceType | Enum | Yes | نوع قیمت |  
| amount | Decimal | Yes | مبلغ |  
| currency | String | Yes | واحد پول |  
| validFrom | DateTime | No | شروع اعتبار |  
| validTo | DateTime | No | پایان اعتبار |

\---

\# 14\. Permission Matrix

| Permission | Description |  
|-----------|-------------|  
| Pricing.Read | مشاهده قیمت‌ها |  
| Pricing.Create | ایجاد قیمت |  
| Pricing.Update | ویرایش قیمت |  
| Pricing.Delete | حذف منطقی |  
| Pricing.Publish | انتشار |

\---

\# 15\. API Contracts

\`\`\`text  
GET    /api/v1/prices

POST   /api/v1/prices

PATCH  /api/v1/prices/{id}

DELETE /api/v1/prices/{id}

POST   /api/v1/pricing/calculate  
\`\`\`

\---

\# 16\. Validation Rules

قبل از ثبت قیمت بررسی می‌شود:

\- وجود محصول  
\- وجود Variant  
\- معتبر بودن بازه زمانی  
\- عدم تداخل قیمت‌ها  
\- اعتبار واحد پول  
\- مجوز کاربر

\---

\# 17\. Error Codes

| Code | Description |  
|------|-------------|  
| PRC-001 | Product Not Found |  
| PRC-002 | Invalid Price |  
| PRC-003 | Currency Not Supported |  
| PRC-004 | Price Conflict |  
| PRC-005 | Discount Exceeds Price |

\---

\# 18\. State Machine

\`\`\`text  
Draft

↓

Scheduled

↓

Active

↓

Expired

↓

Archived  
\`\`\`

\---

\# 19\. Future Extensions

آماده برای:

\- AI Pricing  
\- Dynamic Market Pricing  
\- Competitor Price Monitoring  
\- Regional Pricing  
\- Loyalty Pricing  
\- Subscription Pricing  
\- Auction Pricing

\---

\# 20\. Architecture Decision 018

تمام محاسبات قیمت فقط توسط Pricing Engine انجام می‌شود.

هیچ Frontend، API یا Engine دیگری مجاز به محاسبه یا تغییر مستقیم قیمت نهایی نیست.

\---

\# 21\. Acceptance Criteria

این فصل زمانی کامل است که:

\- انواع قیمت مشخص شده باشند.  
\- فرمول قیمت نهایی تعریف شده باشد.  
\- قوانین تخفیف مستند شده باشند.  
\- APIها تعریف شده باشند.  
\- Validation و Error Codeها تکمیل شده باشند.  
\- پشتیبانی از چند ارز پیش‌بینی شده باشد.

\---

\*\*End of Chapter 018\*\*  
