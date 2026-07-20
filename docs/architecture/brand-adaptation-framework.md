# Brand Adaptation Framework

## Purpose

The Brand Adaptation Framework lets one Storefront codebase express approved customer experiences without turning configuration into executable UI or a tenant runtime. It separates visual defaults, customer identity, bounded experience choices, business capability availability, and localized content while preserving existing Storefront routes and API contracts.

WO-011 establishes one provisional reference composition: Fardad using the customer-neutral `luxury-heritage` Theme Preset. It does not establish a final Fardad visual system, another customer, a Demo Factory, or runtime multi-brand selection.

## Five-Input Configuration Model

The resolved Storefront profile is composed from five independently owned, versioned inputs.

### Theme Preset

A Theme Preset is reusable and customer-neutral. It owns:

- semantic visual defaults;
- typography role defaults using closed font-family IDs;
- layout density and section rhythm;
- shape and elevation tokens;
- motion limits and media treatment; and
- allowed shell, section, component, product-card, mobile, and composition IDs.

A preset never owns customer identity, assets, copy, contacts, domains, legal or SEO copy, feature entitlement, credentials, API/media origins, arbitrary CSS, or remote font URLs.

### Brand Profile

A Brand Profile is app-owned and customer-specific. It owns:

- identity and locale/direction;
- approved or provisional semantic color overrides;
- closed typography references;
- voice direction;
- optional approved public asset, contact, social, legal, and canonical facts;
- SEO identity; and
- approval state, source version, and provisional-field inventory.

Optional facts are absent until verified. A Brand Profile cannot contain API origins, secrets, storage references, component implementation, commerce logic, raw CSS, Tailwind classes, or arbitrary font/asset URLs.

### Experience Profile

An Experience Profile selects one exact Theme Preset ID/version and closed variant IDs for:

- Storefront shell;
- ordered home sections;
- hero, features, and categories treatments;
- product cards;
- density and motion; and
- mobile navigation.

It cannot contain HTML, JSX, CSS, JavaScript, Tailwind classes, arbitrary component names, dynamic imports, URLs, or data-access rules. The resolver rejects variants and sections not allowed by the referenced preset.

### Feature Profile

A Feature Profile owns edition, entitlement, enabled capability, and implemented/publishable capability state. Visual profiles never activate capabilities. Navigation visibility remains the intersection of entitlement, enabled availability, and implementation availability; API authorization and publication rules remain authoritative.

### Localized Content Profile

A Localized Content Profile owns typed, localized navigation, shell, home, catalog, loading, error, empty-state, and SEO copy. Content is plain structured text. Templates use named text placeholders replaced by components; content is never treated as executable HTML.

## Package and Application Ownership

`packages/types` contains only neutral contracts and finite platform IDs. `packages/config` contains only neutral defaults, deterministic merge/validation logic, and generic capability helpers. `packages/ui` remains customer-neutral and consumes semantic CSS variables and caller-owned content.

Concrete Theme Presets and every Brand, Experience, Feature, and Localized Content profile are owned by `apps/storefront`. Customer names, logos, colors, fonts, copy, contacts, domains, assets, customer feature selections, demo data, credentials, origins, and executable configuration never enter shared packages.

## Resolution and Selection

Resolution is server-only:

1. a closed production registry returns the single allowlisted composition;
2. the generic resolver validates identity, preset ID/version, locale agreement, variants, home sections, capability entitlement, and semantic contrast;
3. neutral engine defaults are overlaid by Theme Preset tokens;
4. approved Brand semantic overrides and font-role references are applied;
5. Experience variant selections remain separate from business capabilities;
6. code-enforced accessibility and performance mappings produce CSS variables; and
7. a compatibility `StorefrontProfile` exposes the prior identity/brand/design/SEO/navigation/capability shape plus the five source profiles.

The initial registry resolves only `fardad-production`. It does not read hostnames, query parameters, cookies, request headers, client state, uploaded configuration, or arbitrary environment values. Adding another registry entry, profile-selection mechanism, or deployment topology requires a separate architecture approval.

## Semantic Token Safety

Profiles select typed values only. Colors use validated six-digit hexadecimal values; font families and card elevations are closed IDs mapped to CSS by application code. Raw shadows, font URLs, Tailwind class strings, arbitrary CSS, and remote assets are not accepted.

The resolver checks at minimum:

- body text against background at 4.5:1;
- primary foreground against primary background at 4.5:1;
- secondary foreground against secondary background at 4.5:1; and
- focus indication against background at 3:1.

Tailwind retains structural utilities and semantic CSS-variable aliases. It is not a second palette or font registry.

## Composition Safety

`HomeSectionRenderer` exhaustively maps allowed section IDs to existing home components. The initial order is `hero`, `features`, `categories`. `StorefrontShellRenderer` maps the approved shell ID to existing accessible header, main, footer, and skip-link behavior.

Profiles cannot name imports, nest arbitrary sections, load components dynamically, submit classes, or access data. Components own implementation and accessibility. Profiles own only bounded selection and plain content.

## Fardad Reference Profile

Fardad is provisional and app-owned. Current approved implementation inputs are limited to:

- Fardad identity;
- Persian `fa-IR` and RTL document behavior;
- the Luxury Heritage emerald, ivory, gold, and copper direction;
- premium Persian-handicraft and gift-oriented experience direction;
- existing home order, layout rhythm, and catalog-card approach; and
- existing capability and navigation behavior.

No logo, font asset/license, contact, address, legal name, copyright owner, social URL, canonical domain, export claim, product claim, SEO claim, photography right, or Brand Book fact is inferred. Missing optional fields remain absent from resolved output. System fonts are used until approved licensed font assets exist.

## Brand Book Analysis Workflow

A future Brand Book workflow must remain human-reviewed and evidence-based:

1. **Controlled intake** — identify document owner, version, date, intended channels, rights, and authority.
2. **Evidence extraction** — inventory identity, marks, palette, typography, imagery, voice, layout, localization, accessibility, legal, and channel rules with page-level provenance.
3. **Context interview** — reconcile the Brand Book with customer goals, audiences, catalogue, content, operations, and technical constraints.
4. **Classification** — mark every candidate value as confirmed, provisional, conflicting, missing, or prohibited.
5. **Rights and safety review** — verify logo, image, font, claim, privacy, trademark, and data-processing permissions.
6. **Semantic mapping** — map evidence to Brand Profile facts, Theme tokens, Experience variants, Localized Content, and Feature Profile decisions without copying executable design instructions.
7. **Validation matrix** — test contrast, RTL/LTR, type coverage, assets, mobile, performance, SEO, and content extremes.
8. **Bounded customer review** — present only tested variants and record explicit selections/rejections.
9. **Specification freeze** — issue a versioned Brand Implementation Specification signed by authorized stakeholders.
10. **Controlled implementation** — update profiles only under an approved Work Order and retain provenance.

## Brand Implementation Specification

The specification must identify:

- customer, approvers, source material, versions, evidence status, and effective date;
- identity, assets and rights, palette, typography and licenses, voice, imagery, iconography, locale, and direction;
- semantic token mapping and approved contrast pairs;
- shell, page, section, component, product-card, density, motion, media, and mobile variant selections;
- localized navigation, content, SEO, contact, social, legal, and claim approvals;
- Feature Profile selections independently from visual choices;
- accessibility, font, asset, SEO, mobile, and performance acceptance evidence;
- provisional/omitted/conflicting facts and named owners for resolution;
- deployment/profile IDs, cache/version rules, rollback target, and expiry/review date; and
- explicit scope exclusions and final approval signatures.

## Future Demo Profile Isolation

Demo Factory implementation is deferred. If separately approved, each Demo Profile must be an isolated composition/build output from this one Storefront codebase, not a branch or copied application.

Demo isolation must enforce:

- synthetic, customer-approved, read-only content and catalog fixtures;
- distinct profile IDs, build outputs, caches, domains, access controls, analytics settings, and expiry;
- no production database, write-capable API, secrets, customer/private data, orders, payments, email, or storage paths;
- visible preview identification and `noindex,nofollow` behavior;
- no production canonical URL, structured-data claim, legal/contact placeholder, or production provider account;
- closed Theme/Experience variants from the same reviewed component registry; and
- automated scans for secrets, production origins, mutations, indexing, and data crossover.

Three demos, if authorized, are three configurations of one engine. They should vary meaningful composition, density, typography treatment, imagery framing, shell, and motion within tested bounds—not merely recolor one design.

## Demo-to-Production Promotion

Promotion is configuration approval, not code copying:

1. freeze and version the selected Demo Profile;
2. record customer selection and rejected alternatives;
3. complete rights, accessibility, content, legal, SEO, security, and performance review;
4. issue the signed Brand Implementation Specification;
5. create approved production Brand, Experience, Feature, and Content profiles referencing an approved Theme Preset version;
6. replace synthetic content and omitted facts only with verified production sources;
7. remove preview markers, demo access policy, demo origins, and demo-only fixtures;
8. run the complete validation matrix and stakeholder acceptance; and
9. deploy through the normal production release and rollback process.

The Storefront application, shared components, API contracts, and business rules are never copied from a demo.

## Future Client Questionnaire Outputs

Questionnaire UI and automatic profile generation are deferred. A future progressive questionnaire must produce reviewable artifacts, never executable configuration or credentials:

1. Brand Implementation Brief and stakeholder/approval map;
2. Theme and Experience selection brief;
3. Feature/package selection record independent from visuals;
4. localized content, navigation, asset, rights, legal, contact, and SEO inventory;
5. product/catalog structure and data-readiness inventory;
6. sales, pricing, shipping, tax, payment, and operational requirements for separate commerce scoping;
7. social, marketing, analytics, privacy, and consent requirements;
8. deployment/access checklist covering domain/DNS, environments, providers, ownership, security, backups, monitoring, and credential handoff policy without collecting credentials; and
9. scope, assumptions, exclusions, risks, unresolved facts, owners, acceptance criteria, and signed approval record.

Answers must be classified by evidence and translated into a draft specification for human review. They must never write a production profile automatically.

## Accessibility, RTL, Assets, SEO, and Performance

Every approved profile must preserve semantic landmarks, keyboard operation, visible focus, logical RTL/LTR layout, readable source/focus order, 200% zoom, 44px touch targets, reduced-motion preferences, and WCAG contrast. Persian font candidates require license/provenance, WOFF2 metadata, shaping, glyph, numeral, weight, fallback, and layout-shift validation before use.

Assets require approved rights, type/size/dimension limits, alt text, safe public delivery, and missing-asset fallbacks. SEO requires verified canonical origins, localized metadata, robots policy, Open Graph identity, structured-data evidence, and no unsupported claims. Performance review covers server-first rendering, client-JavaScript limits, font/image budgets, responsive media, Core Web Vitals, and representative mobile networks.

## Change Control

Future presets, variants, customer profiles, demos, selectors, assets, claims, or deployment modes require explicit approval and the same validation gates. Theme or Experience changes can never widen API contracts, activate capabilities, expose raw media/storage data, or bypass business authorization.
