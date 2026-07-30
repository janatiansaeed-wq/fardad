# WO-043A — Pre-Implementation Visual Design Review

> Project: Fardad Enterprise Platform  
> Work order: WO-043A — Fardad Visual Design & Homepage Experience Specification  
> Review type: Documentation-only pre-implementation review  
> Status: READY WITH CONTENT AND OWNER-APPROVAL BLOCKERS  
> Review date: 2026-07-23  
> Source-code change authority: None

## Executive Summary

The current Storefront has a suitable architecture seam for a controlled Fardad homepage evolution. The public application resolves an app-owned Fardad profile, renders an allowlisted homepage composition, and keeps the shell separate from page sections. The current experience and theme are explicitly provisional. Neutral shared packages do not own Fardad's concrete identity or content.

WO-043A preserves the existing fixed homepage foundation exactly as `Hero → Features → Categories`. It proposes additional sections only after Categories and retains Header/Footer as shell responsibilities. The resulting direction is Persian RTL, premium, minimal, artistic, corporate-gifting capable, and product-led. It uses discovery clarity from large commerce experiences without adopting a crowded marketplace style.

No logo, font, photograph, product fact, offer, statistic, testimonial, trust mark, business/contact detail, social link, legal statement, or SEO claim is treated as approved. The specification requires unsupported content to be omitted. It also keeps future routes, capabilities, data contracts, popups, motion, and analytics behind separate implementation and owner-approval gates.

## Files Inspected

### Current Homepage and Shell

- `apps/storefront/app/(public)/page.tsx`
- `apps/storefront/app/(public)/layout.tsx`
- `apps/storefront/components/composition/HomeSectionRenderer.tsx`
- `apps/storefront/components/composition/StorefrontShellRenderer.tsx`
- `apps/storefront/components/home/Hero.tsx`
- `apps/storefront/components/home/Features.tsx`
- `apps/storefront/components/home/Categories.tsx`
- `apps/storefront/components/layout/StorefrontHeader.tsx`
- `apps/storefront/components/layout/MobileNavigation.tsx`
- `apps/storefront/components/layout/StorefrontFooter.tsx`
- `apps/storefront/components/catalog/ProductCard.tsx`

### Storefront Profile, Content, Theme, and Navigation

- `apps/storefront/src/config/brands/fardad/brand-profile.ts`
- `apps/storefront/src/config/brands/fardad/content.fa.ts`
- `apps/storefront/src/config/brands/fardad/experience-profile.ts`
- `apps/storefront/src/config/brands/fardad/feature-profile.ts`
- `apps/storefront/src/config/brands/fardad/navigation.ts`
- `apps/storefront/src/config/fardad-navigation.ts`
- `apps/storefront/src/themes/presets/luxury-heritage.ts`
- `apps/storefront/src/themes/theme-preset-registry.ts`
- `apps/storefront/src/lib/navigation.ts`
- `apps/storefront/src/lib/storefront-config.ts`

### Shared Contracts

- `packages/types/src/theme.ts`
- `packages/types/src/experience.ts`
- `packages/types/src/navigation.ts`

### Prior Architecture and Storefront Evidence

- `docs/codex/reports/WO-008_PLATFORM_CONFIGURATION_STOREFRONT_FOUNDATION_REPORT.md`
- `docs/codex/reports/WO-009_PUBLIC_PRODUCT_CATALOG_STOREFRONT_DISCOVERY_REPORT.md`
- `docs/codex/reports/WO-011_PRE_IMPLEMENTATION_BRAND_ADAPTATION_REVIEW.md`
- `docs/codex/reports/WO-011_BRAND_ADAPTATION_FARDAD_EXPERIENCE_REPORT.md`
- `docs/codex/reports/WO-012_PRE_IMPLEMENTATION_PRODUCT_DETAIL_REVIEW.md`
- `docs/codex/reports/WO-042_PUBLIC_CART_EXPERIENCE_IMPLEMENTATION_REPORT.md`
- `docs/codex/sprint01-analysis.md`

## Current-State Findings

1. The homepage route delegates to `HomeSectionRenderer` and does not hard-code page sections directly.
2. `fardadExperienceProfile.home.sections` is exactly `["hero", "features", "categories"]`.
3. `HomeSectionId` and the current theme allowlist contain only `hero`, `features`, and `categories`.
4. Header and footer are composed by `StorefrontShellRenderer`, outside the homepage section list.
5. The current Luxury Heritage theme is versioned, app-owned, and explicitly provisional.
6. The current provisional palette already points toward ivory, emerald, gold, copper/focus, and restrained dark text.
7. Current typography uses system role IDs; no final licensed brand-font evidence is represented.
8. Navigation supports nested items and capability requirements, but the current public set is deliberately limited by implemented capabilities.
9. Corporate gifts, articles, contact, and account foundations are not all publishable public journeys. They cannot be exposed merely because the future information architecture names them.
10. The existing Product Card consumes a narrow public contract. Future prices, labels, recommendations, campaign membership, or offer states need authorized public data contracts rather than UI inference.

## Architecture Constraints Preserved

| Constraint | WO-043A decision |
| --- | --- |
| One public frontend | `apps/storefront` remains the only storefront owner |
| Fixed foundation | `Hero → Features → Categories` remains exact and uninterrupted |
| Shell separation | Header precedes the page; Footer follows it |
| Neutral shared packages | No Fardad copy, palette, facts, routes, or profile selection is proposed for shared ownership |
| App-owned brand values | Fardad values remain under Storefront brand/theme/content/profile configuration |
| Config/data-driven content | All copy, links, media, campaigns, labels, and section selection require validated configuration or API data |
| Capability separation | Visual selection cannot activate routes or business behavior |
| Public data minimization | UI consumes explicit public contracts, never raw database models |
| Provisional-state honesty | Existing theme/content values remain provisional until approved |
| No fabricated claims | Unsupported facts are omitted rather than replaced with placeholders |
| No Mobin-specific concepts | No Mobin-specific distinctive concept is included |

## Exact Proposed Homepage Order

1. Header and navigation
2. Hero
3. Features / trust strip
4. Visual categories
5. New arrivals
6. Verified special offers / campaign products
7. Luxury and VIP collections
8. Corporate gifting banner and consultation CTA
9. Authenticity / story / process
10. New articles and buying guides
11. Final CTA
12. Full footer

Interpretation:

- Items 2–4 are the fixed current page foundation.
- Items 5–11 are future optional sections and begin only after Categories.
- Items 1 and 12 remain shell concerns.
- Optional does not mean arbitrary: each section requires an allowlisted contract, publishable capability, valid destination, and complete verified dataset.

## Design Decision Summary

The proposed direction is “Luxury Heritage with Commercial Clarity”:

- Persian RTL typography and reading order are foundational.
- Ivory provides the calm canvas; emerald provides authority; dark ink ensures readability; gold and copper are restrained accents.
- Product/material photography and verified process storytelling establish luxury more effectively than ornament.
- Search, categories, transparent offers, and clear trust information support conversion.
- Editorial spacing and one dominant action per section prevent marketplace density.
- Cards, menus, motion, and overlays remain quiet, bounded, accessible, and performance-aware.
- Corporate gifting receives a distinct conversion path only after its workflow, service scope, privacy handling, and ownership are operational.

## Content and Asset Dependencies

### Production-Blocking Assets

- Approved logo suite and usage rules.
- Licensed Persian/Latin fonts, weights, web rights, fallback, and numeral behavior.
- Rights-cleared, art-directed hero/product/category/collection/process/corporate imagery with responsive crops and alt-text ownership.
- Approved palette/state matrix and real-content contrast validation.

### Production-Blocking Content and Facts

- Final Persian brand voice and homepage/CTA copy.
- Verified legal name, canonical domain, contact/business data, copyright, legal/privacy/returns content.
- Verified social accounts and operational newsletter decision.
- Approved SEO copy and indexing policy.
- Evidence-backed authenticity, provenance, material, service, delivery, guarantee, or other claims.

### Feature/Data Blockers

- Implemented and approved search journey.
- Public collection/new-arrival/campaign/price/label data contracts.
- Approved luxury/VIP semantics and manager-recommendation governance.
- Corporate gifting route/form, consultation owner/SLA, catalogue, privacy/CRM handling, and capability activation.
- Implemented article routes/data.
- Campaign governance, price authority, terms, dates/timezone, targeting, and expiry.
- Popup host, session policy, consent classification, and analytics implementation.

## Deliberately Excluded

| Excluded item | Reason |
| --- | --- |
| Multiple carousels/sliders | Hide content, increase interaction and media cost, and weaken calm hierarchy |
| Immediate or repeated popups | Interrupt orientation and damage trust |
| Crowded marketplace header/homepage | Conflicts with premium editorial clarity and increases cognitive load |
| Excessive banners, colors, gold, ornament, or shadows | Competes with craft/product and produces generic “luxury” decoration |
| False countdowns, scarcity, discounts, popularity, reviews, or testimonials | Misleading, unverifiable, and reputationally risky |
| Unverified trust marks/certifications | No evidence or usage authorization |
| Placeholder legal/contact/social/SEO content | Placeholder values can be mistaken for public facts |
| Final font/logo/photo assumptions | Assets and rights are not approved |
| Hard-coded Fardad values in shared components | Violates established ownership boundaries |
| Route/capability activation | WO-043A is documentation-only |
| Mobin-specific distinctive concepts | Explicitly prohibited from Fardad |
| Heavy/continuous motion and autoplay hero video | Distracting, inaccessible for some users, and inconsistent with performance goals |

## Decisions Requiring Owner or CTO Approval

1. Approve “Luxury Heritage with Commercial Clarity” as the visual direction.
2. Approve or revise the provisional ivory/emerald/gold/copper role system.
3. Approve the exact homepage order and the rule that optional sections start after Categories.
4. Approve the proposed WO-043B–WO-043E split before source work.
5. Decide which assets/facts are sufficiently verified for WO-043B.
6. Approve final typography, licensing, logo, imagery, and art direction.
7. Approve the public meaning and governance of New, Special, Luxury/VIP, and Manager Recommendation labels.
8. Approve search, corporate gifting, articles, gifts-by-budget, popup, analytics, and campaign scopes separately from visual presentation.
9. Approve campaign price/terms authority and corporate consultation operating ownership.
10. Approve performance test conditions and production acceptance evidence.

## Risks and Mitigations

| Risk | Severity | Mitigation / decision |
| --- | --- | --- |
| Final assets arrive late or conflict with provisional layout | High | Keep WO-043B bounded to approved assets/tokens; do not call provisional styling final |
| New sections outpace backend/public data contracts | High | Implement sections only after authoritative capability/data work |
| Unsupported labels or claims leak into UI | High | Require source/owner/effective-date validation and fail closed |
| Header promises dead routes | High | Capability-filter all destinations and test link integrity |
| Persian font causes layout/performance regressions | High | License verification, subset/weight discipline, preload budget, and real Persian QA |
| Weak metallic-color contrast | Medium | Accent-only role and automated/manual state-matrix tests |
| Homepage becomes too long/dense | Medium | Omit incomplete sections, one narrative/CTA each, and measure engagement without dark patterns |
| Popup harms trust/accessibility | Medium | Four allowed purposes, delayed trigger, once per session, accessible dialog/sheet |
| Motion harms performance or vestibular comfort | Medium | Restrained patterns, reduced-motion mode, measured budgets |
| Analytics captures sensitive data | High | Controlled IDs/enums, consent classification, no form/query PII |

## Validation Scope

Per WO-043A, validation is limited to the two approved Markdown deliverables:

1. Confirm only the two approved documentation paths were created or modified by this work order.
2. Run `git diff --check`.
3. Run `git status --short`.
4. Do not run build, tests, lint, typecheck, or repository formatting commands.
5. Do not commit or push.

## Validation Results

The final command results after document creation:

- `git diff --check`: **PASSED** (exit code 0; no output)
- `git status --short`: **PASSED FOR SCOPE** and returned only:

  ```text
  ?? docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md
  ?? docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md
  ```

- Changed-file scope: **PASSED** — only the two approved documentation paths are present.
- Build/tests/lint/typecheck/format: **NOT RUN — prohibited and unnecessary for Markdown-only scope**
- Commit/push: **NOT PERFORMED**

## Source-Code Change Confirmation

No application code, route, component, configuration, dependency, infrastructure, test, database, API, shared package, or asset file was changed by WO-043A. The only authorized changes are:

- `docs/codex/work-orders/WO-043A_FARDAD_VISUAL_DESIGN_SPECIFICATION.md`
- `docs/codex/reports/WO-043A_PRE_IMPLEMENTATION_VISUAL_DESIGN_REVIEW.md`

## Readiness and Suggested Next Work Order

WO-043A is **READY WITH CONTENT AND OWNER-APPROVAL BLOCKERS**. The specification is sufficient to make the outstanding decisions explicit, but final production styling is not ready without the listed assets, rights, facts, data contracts, and approvals.

Suggested next work order: **WO-043B — Fardad Visual Foundation and Storefront Shell**, limited to approved semantic tokens, licensed/fallback typography, header/navigation/search affordance, mobile navigation, and verified footer content. WO-043B must preserve capability filtering, keep Fardad values app-owned, avoid dead routes, and stop before homepage section expansion.
