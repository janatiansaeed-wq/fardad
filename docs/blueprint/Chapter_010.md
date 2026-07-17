\# MASTER BLUEPRINT

\*\*Project:\*\* Fardad Enterprise Commerce Platform    
\*\*Version:\*\* 1.0.0    
\*\*Chapter:\*\* 010    
\*\*Title:\*\* ER Diagram & Entity Relationships    
\*\*Status:\*\* Approved    
\*\*Owner:\*\* Architecture Team

\---

\# 1\. Purpose

این فصل ساختار موجودیت‌های اصلی سیستم و ارتباط بین آن‌ها را تعریف می‌کند.

هدف این سند:

\- طراحی ERD  
\- طراحی Prisma Schema  
\- طراحی Repository  
\- طراحی Service Layer  
\- طراحی API  
\- جلوگیری از وابستگی اشتباه بین موجودیت‌ها

\---

\# 2\. Core Entity Map

\`\`\`text  
Product  
│  
├── ProductVariant  
├── ProductLevel  
├── ProductPrice  
├── Inventory  
├── ProductAttribute  
├── ProductMedia  
├── ProductSEO  
├── ProductTag  
├── ProductCategory  
├── ProductCollection  
├── ProductService  
├── ProductRule  
├── ProductArticle  
└── ProductCampaign  
\`\`\`

\---

\# 3\. Global Entity Diagram

\`\`\`text  
Brand  
   │  
   ├────────────┐  
   │            │  
Artist      Collection  
   │            │  
   └──────┬─────┘  
          │  
       Product  
          │  
 ┌────────┼─────────┐  
 │        │         │  
Price  Inventory  SEO  
 │        │         │  
 │     Media     Attribute  
 │        │         │  
 └────────┼─────────┘  
          │  
        Category  
          │  
      Article  
          │  
      Campaign  
\`\`\`

\---

\# 4\. Product Relationships

یک Product دارای:

\- چند تصویر  
\- چند ویدئو  
\- چند فایل PDF  
\- چند ویژگی  
\- چند قیمت  
\- چند قانون  
\- چند مقاله  
\- چند دسته‌بندی  
\- چند برچسب  
\- چند کالکشن

است.

\---

\# 5\. Category Relationships

Category

دارای رابطه

One To Many

با:

\- Product  
\- Article  
\- Collection

است.

\---

\# 6\. Brand Relationships

Brand

دارای رابطه

One To Many

با:

\- Product

است.

در آینده

Many To Many

نیز پشتیبانی خواهد شد.

\---

\# 7\. Artist Relationships

هر هنرمند

دارای

چند محصول

و

چند مقاله

است.

\---

\# 8\. Collection Relationships

Collection

دارای:

\- چند محصول  
\- چند مقاله  
\- چند کمپین

خواهد بود.

\---

\# 9\. Media Relationships

Media

می‌تواند متعلق به:

\- Product  
\- Article  
\- Page  
\- Brand  
\- Artist  
\- Category  
\- Campaign

باشد.

\---

\# 10\. SEO Relationships

SEO

به صورت

One To One

به موجودیت‌های زیر متصل می‌شود.

\- Product

\- Category

\- Article

\- Brand

\- Artist

\- Collection

\- Page

\---

\# 11\. Customer Relationships

Customer

دارای:

\- چند آدرس  
\- چند سفارش  
\- چند علاقه‌مندی  
\- چند پرداخت  
\- چند اعلان

است.

\---

\# 12\. Order Relationships

Order

دارای:

\- چند Order Item

\- یک مشتری

\- یک آدرس ارسال

\- چند پرداخت

\- چند وضعیت

است.

\---

\# 13\. Campaign Relationships

Campaign

دارای:

\- چند محصول

\- چند قانون

\- چند بنر

\- چند Popup

است.

\---

\# 14\. Rule Engine Relationships

هر Rule

می‌تواند روی:

\- Product

\- Category

\- Customer Group

\- Campaign

\- Shipping

\- Payment

اعمال شود.

\---

\# 15\. User Relationships

User

دارای:

\- یک یا چند Role

هر Role

دارای:

\- چند Permission

است.

\---

\# 16\. Permission Diagram

\`\`\`text  
User

↓

Role

↓

Permission

↓

Resource

↓

Action  
\`\`\`

نمونه

\`\`\`text  
Product

↓

Create

↓

Allowed  
\`\`\`

\---

\# 17\. Entity Standards

تمام Entity ها باید شامل:

\`\`\`text  
id

createdAt

updatedAt

deletedAt

createdBy

updatedBy

deletedBy

version

status  
\`\`\`

باشند.

\---

\# 18\. Relationship Standards

قوانین:

\- Foreign Key الزامی

\- Restrict به صورت پیش‌فرض

\- Cascade فقط در موارد مستند

\- Many To Many فقط با Pivot Table

\---

\# 19\. Junction Tables

برای ارتباط

Many To Many

از جدول واسط استفاده می‌شود.

نمونه:

\`\`\`text  
product\_category

product\_tag

product\_collection

product\_artist

product\_media

product\_campaign

article\_product

role\_permission

user\_role  
\`\`\`

\---

\# 20\. Sample ER (Mermaid)

\`\`\`mermaid  
erDiagram

PRODUCT ||--o{ PRODUCT\_MEDIA : has

PRODUCT ||--o{ PRODUCT\_PRICE : has

PRODUCT ||--o{ PRODUCT\_ATTRIBUTE : has

PRODUCT ||--o{ INVENTORY : has

CATEGORY ||--o{ PRODUCT : contains

BRAND ||--o{ PRODUCT : owns

ARTIST ||--o{ PRODUCT : creates

CUSTOMER ||--o{ ORDER : places

ORDER ||--o{ ORDER\_ITEM : contains

PRODUCT ||--o{ ORDER\_ITEM : sold

ROLE }o--o{ PERMISSION : grants

USER }o--o{ ROLE : assigned  
\`\`\`

\---

\# 21\. Domain Events

هر Entity می‌تواند Event تولید کند.

نمونه:

ProductCreated

ProductUpdated

ProductPublished

OrderPaid

OrderCancelled

CustomerRegistered

MediaUploaded

ArticlePublished

CampaignStarted

CampaignEnded

\---

\# 22\. Repository Contracts

هر Entity باید Repository مستقل داشته باشد.

نمونه:

ProductRepository

CategoryRepository

OrderRepository

CustomerRepository

MediaRepository

هیچ Repository مجاز به دسترسی مستقیم به Repository دیگر نیست.

\---

\# 23\. Service Contracts

هر Entity دارای Service مستقل است.

نمونه:

ProductService

SEOService

MediaService

RuleService

OrderService

CustomerService

\---

\# 24\. Validation Rules

قبل از ذخیره هر Entity باید:

\- اعتبارسنجی داده  
\- اعتبارسنجی Business Rule  
\- اعتبارسنجی Permission

انجام شود.

\---

\# 25\. Architecture Decision 010

هیچ ارتباطی خارج از ERD رسمی پروژه مجاز نیست.

در صورت نیاز به Entity جدید:

1\. ثبت در Blueprint  
2\. طراحی ERD  
3\. طراحی Database  
4\. طراحی Repository  
5\. طراحی Service  
6\. طراحی API  
7\. پیاده‌سازی

\---

\# 26\. Acceptance Criteria

این فصل زمانی تکمیل شده تلقی می‌شود که:

\- تمام موجودیت‌های اصلی تعریف شده باشند.  
\- روابط One-to-One، One-to-Many و Many-to-Many مشخص شده باشند.  
\- جداول واسط تعیین شده باشند.  
\- استانداردهای Entity یکسان باشند.  
\- قوانین ارتباط بین Engineها رعایت شده باشد.  
\- Mermaid ERD قابل استفاده برای تولید Schema باشد.

\---

\*\*End of Chapter 010\*\*  
