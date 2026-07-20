# WO-011 Pre-Implementation Brand Adaptation Review

> Project: Fardad Enterprise Platform
>
> Work order: WO-011 — Brand Adaptation Framework & Fardad Experience Profile
>
> Phase: Pre-Implementation Architecture Review
>
> Status: READY WITH BLOCKERS
>
> Review date: 2026-07-20
>
> Change scope: Documentation only

## Executive Summary

The current Storefront can evolve into a controlled Brand Adaptation Framework without a destructive rewrite. WO-008 already established the essential seam: framework-neutral contracts and shared UI live in shared packages, while Fardad values live in `apps/storefront`. WO-009 and WO-010 further preserve the same engine boundary by keeping catalog and media policy in `apps/api` and returning narrow public contracts.

The shared packages are not the current source of brand leakage. `packages/ui` contains no Fardad name, domain, Persian copy, Fardad palette, logo, or font reference; it uses semantic CSS variables and caller-provided content. `packages/config` contains only neutral defaults, capability registries, and generic helpers. Customer brands and concrete theme presets should not be moved into either package.

The remaining coupling is inside `apps/storefront`: the current `StorefrontProfile` mixes identity, brand, theme, SEO, navigation, deployment URL, and feature availability; root layout and catalog metadata import Fardad directly; typography and a second Fardad palette are hard-coded in global/Tailwind configuration; Persian copy and Fardad claims are embedded in pages/components; and home/shell/card composition is fixed in code. These are extractable seams, not reasons to create another frontend.

The recommended architecture uses five separately owned inputs:

1. **Theme Preset** — reusable visual defaults and constrained variant/composition rules;
2. **Brand Profile** — approved customer identity, assets, typography, voice, locale, and SEO identity;
3. **Experience Profile** — the customer's selected shell, page composition, component variants, density, motion, and mobile behavior;
4. **Feature Profile** — existing package/capability entitlement and activation, independent of visuals; and
5. **Localized Content Profile** — approved page/UI copy and content references, composed alongside the four required concepts rather than hard-coded in components.

A server-only Storefront composition resolver should merge these versioned profiles at build/deployment time through an allowlisted registry. It must never select a profile from an untrusted request host/query, execute customer HTML/CSS/JavaScript, activate a business feature because a theme selected it, or become a visual page builder.

Fardad should become the first reference profile under the provisional **Luxury Heritage** preset. Its current green/gold/ivory direction, Persian RTL identity, corporate-gift emphasis, and semantic tokens provide useful provisional input. Its logo, font licensing, official contact/legal information, photography, claims, SEO language, and final composition are not sufficiently evidenced in the repository and must remain provisional or absent until approved.

Implementation is **READY WITH BLOCKERS**. The contract/profile extraction is actionable after architecture approval. Final production Fardad adaptation is blocked by approved brand assets and rights, official identity/legal/contact/copy, typography licensing, a signed Brand Implementation Specification, and an approved component/contrast matrix.

## Repository and Branch State

The required checks were run before this report was created:

```text
$ git status --short
(no output; working tree clean)

$ git branch --show-current
architecture-refactor
```

`HEAD` was `e86e758` (`Add secure media delivery foundation`) and matched `origin/architecture-refactor`. WO-008, WO-009, and WO-010 are committed in the reviewed checkout.

Only this report is authorized in this phase. No application source, shared package, Storefront configuration, theme value, Prisma file, data, dependency, script, or Git history was modified.

## Existing WO-008 Compatibility

WO-008 provides the correct starting architecture:

- `apps/storefront` is the sole public frontend;
- customer-specific values belong in `apps/storefront/src/config`;
- shared contracts are framework- and persistence-neutral;
- `packages/ui` consumes semantic variables and caller-owned slots/content;
- `packages/config` owns generic helpers/defaults, not Fardad data;
- Storefront profile/navigation resolution is server-only;
- document `lang`/`dir`, CSS variables, and metadata already derive from configuration; and
- feature visibility is an intersection of entitlement, deployment enablement, and implemented availability.

WO-011 should extend these seams, not replace them. The existing `StorefrontProfile` can remain as a temporary resolved compatibility output while its mixed inputs are split. Existing routes, shared UI primitives, server-first rendering, navigation filtering, catalog HTTP boundary, and metadata helper can continue operating during staged extraction.

WO-009 remains compatible because product/category transport and business visibility do not depend on brand selection. WO-010 remains compatible because browser-safe media descriptors do not depend on Brand/Theme profiles; future logo/brand-asset integration must reuse its safe public-media boundary rather than adding raw paths or external URLs.

## Existing Configuration and Theme Analysis

Current values classify as follows:

| Current location/value                              | Correct category                         | Assessment                                                                               |
| --------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------- |
| `fardad-store.ts`: display/legal name               | Brand Profile                            | Fardad-specific; legal form requires confirmation.                                       |
| locale `fa-IR`, language `fa`, direction `rtl`      | Brand/localization profile               | Useful provisional Fardad values; future profile must support more than one locale.      |
| timezone `Asia/Tehran`, currency `IRT`              | Business/localization configuration      | Must not be treated as visual theme; currency must align with future pricing policy.     |
| `identity.url=https://fardad.ir`                    | Deployment/SEO configuration             | Currently mixed into identity; domain ownership/canonical environment requires approval. |
| slogan and description                              | Brand/content profile                    | Provisional brand voice and claims; require editorial/business approval.                 |
| email, zero-placeholder phones, address             | Brand contact content                    | Not production-approved; optional fields should be omitted until verified.               |
| social links                                        | Brand Profile                            | Empty and therefore safely unclaimed.                                                    |
| dynamic English copyright                           | Legal/content profile                    | Provisional; exact owner/name/language/legal wording requires approval.                  |
| green/gold/ivory palette                            | Brand primitives plus semantic overrides | Plausible Luxury Heritage direction; contrast and brand approval not recorded.           |
| radii/content width                                 | Theme Preset defaults                    | Visual-direction values, not brand identity.                                             |
| card shadow in root layout                          | Theme Preset/component token             | Missing from the typed token contract and coupled directly to layout.                    |
| SEO titles/descriptions/keywords/site name          | Brand SEO/content profile                | Several product/export/luxury claims require approval.                                   |
| `fardad-navigation.ts` labels/routes                | Localized content/navigation profile     | Persian/customer-specific; capability requirements remain generic.                       |
| `fardad-features.ts` edition and sets               | Feature Profile                          | Correctly app-owned, but currently embedded in the mixed Storefront profile.             |
| API/media origins                                   | Environment/deployment configuration     | Must remain server/deployment config, never Theme/Brand data.                            |
| `IRANYekanX` in CSS/Tailwind                        | Brand typography choice                  | No checked-in font or license evidence exists; currently falls back to sans-serif.       |
| Tailwind emerald/gold/copper/ivory values           | Parallel theme system                    | Duplicates semantic token intent and can drift from the profile.                         |
| Hero/Features/Categories Persian strings            | Localized content profile                | Currently hard-coded in components.                                                      |
| Hero/Features/Categories order                      | Experience Profile                       | Fixed in `page.tsx`; should use an allowlisted ordered section contract.                 |
| centered hero, sticky blurred header, text logo     | Experience Profile/component variants    | Fixed presentation choices; should be constrained variant IDs.                           |
| product grid columns, 4:3 image, fallback treatment | Experience Profile plus code guardrails  | Brand-selectable only within tested variants; semantics/performance stay code-owned.     |
| Persian route-state/catalog labels                  | Localized content profile                | Hard-coded across pages/components; blocks English/multilingual reuse.                   |

Three token sources currently overlap:

1. typed `fardadProfile.design` semantic values;
2. additional root-layout CSS variables such as card shadow; and
3. Fardad-specific Tailwind colors/fonts.

They should converge on one resolved semantic token map. Tailwind should provide structural utilities or semantic CSS-variable aliases, not a second customer palette.

## Brand Boundary Analysis

Current Storefront coupling that would make a future customer resemble “Fardad with another logo” includes:

- one mixed `StorefrontProfile` shape rather than four independently versioned concepts;
- direct `fardadProfile` imports in root layout and catalog metadata;
- a resolver that always returns Fardad and navigation logic that directly imports Fardad entitlement;
- Fardad palette/font values in Tailwind/global CSS;
- an unresolved `bg-hero` presentation assumption rather than an explicit hero-background token/variant;
- Fardad/Persian copy and business claims in home, catalog, errors, navigation, header/footer, and fallback UI;
- fixed home section order and fixed shell/card behavior;
- text-only header identity because no approved logo asset exists; and
- shared primitives with neutral but opinionated motion/layout defaults (sticky header, hover-lift card, fixed section rhythm) that do not yet expose constrained variants.

The correction is configuration extraction plus constrained variants—not customer-authored CSS and not duplicated applications.

Values that must never enter `packages/ui` or `packages/config` include:

- customer/Fardad names, logos, slogans, legal text, contacts, social links, domains, claims, or SEO copy;
- customer palettes, exact fonts/font files, photography, decorative motifs, or asset references;
- localized navigation/page/error/button copy;
- customer feature enablement/entitlement selections or Demo Profile data;
- credentials, API/media origins, analytics identifiers/consent, deployment IDs, or preview access settings; and
- arbitrary customer HTML, CSS, JavaScript, Tailwind class strings, remote component names, or storage references.

`packages/types` may define neutral contracts and enum/ID unions. `packages/config` may define pure resolution/validation helpers, neutral fallbacks, and platform capability registries. Concrete Theme Preset values and all Brand/Experience/Content profiles should stay app-owned.

## Shared UI Boundary Analysis

Static scans confirmed that `packages/ui` and `packages/config` source contain no Fardad name/domain, Persian copy, Fardad palette hex values, or `IRANYekanX` reference. Shared packages do not import Storefront/API/Prisma source. The `@fardad/*` package namespace is an internal repository/package identity, not runtime customer presentation.

`packages/ui` is brand-independent in content ownership: Header/Footer receive slots, Navigation receives labels/routes, state components receive text/actions, and primitives use semantic CSS variables with neutral fallbacks.

Its visual behavior is not yet fully theme-adaptable. The following should remain code-owned but become constrained, tested variants where needed:

- Button shape/emphasis variants;
- Card surface/elevation/border/motion variants;
- Section rhythm/density variants;
- Header sticky/static and surface treatments;
- Footer composition slots;
- Heading scale/alignment variants; and
- Navigation density/emphasis patterns.

Shared UI must implement semantics, keyboard/focus behavior, minimum target sizes, safe prop typing, and approved variant rendering. It must not receive raw class strings from a customer profile. Application composition renderers map profile variant IDs to these neutral props.

## Theme Preset Architecture Proposal

A `ThemePreset` is reusable and customer-neutral. Exact values/categories:

| Theme Preset field         | Contents                                                                                                                                                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity                   | stable preset ID, schema version, human label/description, status (`provisional`/`approved`/`retired`)                                                                    |
| Direction/language support | supported `rtl`/`ltr` modes and script compatibility notes—not a customer locale                                                                                          |
| Semantic token defaults    | background/surface/elevated surface, text/muted/inverse, primary/on-primary, secondary/on-secondary, accent/on-accent, border/divider, link, focus, success/warning/error |
| Typography defaults        | role structure, scale, weights, line-height, tracking, fallback class; no licensed customer font file                                                                     |
| Layout rhythm              | content widths, spacing scale, section density, grid gaps, readable-line width                                                                                            |
| Shape/elevation            | radii, borders, shadows/elevation levels                                                                                                                                  |
| Media treatment            | allowed aspect-ratio families, crop behavior, frame/background treatment                                                                                                  |
| Motion policy              | none/subtle/expressive defaults, durations/easing limits, reduced-motion requirement                                                                                      |
| Component defaults         | neutral variant IDs for Button/Card/Header/Footer/Navigation/Hero/ProductCard/Section/Heading                                                                             |
| Composition rules          | allowed section IDs, repetition/cardinality rules, compatible variant combinations                                                                                        |

Initial reusable directions may be `luxury-heritage`, `modern-minimal`, `warm-artisan`, `corporate-prestige`, and `editorial-gallery`, but only `luxury-heritage` should be implemented first. Names do not imply production-ready designs; each preset requires a tested token/variant matrix.

Theme Presets must not contain a customer name/logo/contact/domain, legal copy, product data, navigation labels, credentials, entitlement, customer font asset, or customer-specific SEO.

Resolution order should be deterministic:

```text
neutral engine defaults
  -> approved Theme Preset defaults
  -> approved Brand semantic overrides
  -> Experience variant selections
  -> code-enforced accessibility/performance guardrails
```

Later layers may override only fields explicitly allowed by the contract. They cannot override semantics, DOM behavior, security, data access, or arbitrary CSS.

## Brand Profile Architecture Proposal

A versioned `BrandProfile` contains customer-specific, evidence-backed identity:

| Brand Profile field     | Exact content                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Metadata                | brand ID, schema/profile version, lifecycle, source brief/spec version, approval record                           |
| Identity                | display name, approved legal name if supplied, short/long description, slogan if approved                         |
| Marks/assets            | safe public logo/wordmark/icon references, alt/accessibility intent, light/dark usage rules; never storage keys   |
| Brand primitives        | named approved palette with source/evidence and allowed semantic token overrides                                  |
| Typography              | role-to-approved-family references, script coverage, allowed weights/styles, fallbacks, license/provenance record |
| Voice                   | tone attributes, audience, terminology to use/avoid, language style, claims restrictions                          |
| Contact/social          | only verified public contact/address/social values, with optional omission                                        |
| Localization            | default locale, supported locales, direction per locale, numeral/date conventions                                 |
| SEO identity            | approved site name, title template, default description/keywords policy, organization identity                    |
| Visual/content guidance | photography, illustration, iconography, logo clear-space, imagery do/don't rules                                  |
| Approval state          | confirmed/provisional/missing/rejected fields, approver/date, unresolved decisions                                |

Actual canonical URLs, API/media origins, secrets, deployment IDs, preview credentials, and environment-specific analytics configuration remain deployment settings. Brand fonts/assets must be safe public references produced by an approved asset process; WO-010 raw internal references never enter this profile or the browser.

## Experience Profile Architecture Proposal

A versioned `ExperienceProfile` chooses only approved/tested experience options:

| Experience Profile field | Exact content                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Preset reference         | exact Theme Preset ID and approved version                                                                                                                        |
| Shell                    | Header, Footer, desktop navigation, mobile navigation, announcement-bar variant IDs                                                                               |
| Home composition         | ordered allowlisted section descriptors (`hero`, `trust`, `featured-categories`, `editorial-story`, `corporate-gifting`, etc.) with content keys, not JSX/classes |
| Catalog                  | ProductCard variant, grid density, image-ratio ID, category-navigation variant                                                                                    |
| Hero/CTA                 | constrained hero and CTA treatment IDs                                                                                                                            |
| Editorial density        | concise/balanced/editorial enum controlling approved copy/layout variants                                                                                         |
| Motion                   | allowed motion level within preset and reduced-motion guardrails                                                                                                  |
| Mobile behavior          | approved menu, section stacking, media crop, CTA placement preferences                                                                                            |
| Compatibility            | minimum component contract version and explicit allowed preset/variant matrix                                                                                     |

The profile must not contain JSX, HTML, Markdown interpreted as HTML, JavaScript, CSS, Tailwind class strings, arbitrary component import names, data-fetching URLs, or business logic.

## Feature Profile Separation

Feature Profile remains independent from Brand/Theme/Experience.

Exact Feature Profile values:

- `edition`: Base/Plus/Pro/Enterprise entitlement package;
- explicitly enabled deployment capabilities;
- engine-implemented/publishable capability state; and
- optional preview-only capability markers that cannot grant production entitlement or authorization.

The current `fardadEdition`, entitled set, enabled set, and implemented set are the starting Fardad Feature Profile. Visual presets cannot enable features. Experience sections/navigation items declare required capabilities and are filtered against the resolved Feature Profile. The API remains the security authority even when UI is hidden.

A demo may visually describe a desired module only through a labelled, non-functional preview component. It must not alter entitlement, expose private APIs, or claim that an unimplemented capability is production-ready.

## Fardad Luxury Heritage Direction

The Fardad reference implementation should be split without leaking into shared packages.

Provisional values already available:

- brand/display name `فرداد` / `Fardad`;
- `fa-IR`, Persian, RTL, Tehran timezone, and provisional IRT currency context;
- emerald/ivory/gold/copper visual primitives;
- premium Persian handicrafts and corporate-gifting positioning;
- provisional slogan, description, SEO copy, keywords, navigation, and home copy;
- current semantic background/surface/text/action/focus values;
- generous radius, elevation, wide container, centered hero, 4:3 cards, and editorial section rhythm; and
- `luxury-heritage` as the provisional selected Theme Preset.

Values that require approval or supply:

- Brand Book and source-of-truth identity rules;
- primary/alternate logo, favicon, wordmark, safe-area/minimum-size rules, and accessible usage;
- final color values and contrast-approved semantic pairings;
- licensed Persian/Latin font files, weights, usage rights, fallback/metrics strategy;
- approved photography/art direction and usable asset rights;
- official legal name, copyright owner/text, address, email, phone/mobile, social links, and domain ownership;
- verified business/product/export/quality claims;
- final Persian wording, terminology, English/multilingual scope, and SEO approvals;
- mobile/desktop composition and motion approval; and
- component visual QA and accessibility sign-off.

The zero-placeholder phone/mobile and generic address must remain provisional and should be omitted from any future production-resolved profile until verified. `IRANYekanX` is referenced but no font asset/license evidence is present; it must not be packaged or claimed as approved. No logo/image/font asset is currently checked into Storefront.

Fardad becomes a reference implementation by residing under a clearly app-owned `brands/fardad` folder and referencing reusable preset/variant IDs. Shared contracts and components may know what a `luxury-heritage`-compatible variant is, but never that Fardad selected it or what Fardad's values are.

## Design Token Taxonomy

Recommended token layers:

| Layer            | Examples                                                                              | Owner                                   |
| ---------------- | ------------------------------------------------------------------------------------- | --------------------------------------- |
| Brand primitives | emerald-700, warm-ivory, approved font family names                                   | Brand Profile                           |
| Semantic color   | canvas, surface, text, muted, action, on-action, accent, border, focus, status colors | Resolved Theme                          |
| Typography roles | display, heading, body, label, caption; size/weight/line-height/tracking              | Theme plus approved Brand font mapping  |
| Space/layout     | spacing scale, section rhythm, content/readable widths, gutters, grid gaps            | Theme Preset                            |
| Shape            | radius scale, border widths                                                           | Theme Preset                            |
| Elevation        | surface shadows/overlays                                                              | Theme Preset                            |
| Motion           | duration/easing/translation/opacity limits                                            | Theme/Experience within code guardrails |
| Media            | aspect-ratio IDs, crop/object-position policy                                         | Theme/Experience                        |
| Component alias  | button/card/header/product-card semantic variables                                    | Resolver output, never customer CSS     |

Semantic tokens—not palette names—are exposed to shared UI. Contrast-sensitive pairs are resolved/validated together. CSS variables should be generated from the typed resolved profile in one helper. Global CSS/Tailwind must not separately repeat customer hex codes or font names.

## Page Composition and Variant Strategy

Page variation should use a typed registry, not a builder:

```text
Experience Profile ordered section IDs
  -> server-only composition validator
  -> exhaustive Section Renderer registry
  -> approved section component + localized content key
```

Controls:

- finite section IDs and component variant unions;
- per-page allowlist and min/max cardinality;
- no arbitrary nesting beyond the approved schema;
- no user-authored styles/scripts/HTML or dynamic imports from profile text;
- content values separate from component/section IDs;
- required capability declaration on sections/navigation;
- compatible preset/variant matrix checked before build;
- semantic DOM and source order controlled by renderer code;
- mobile order may differ only through approved variants without corrupting reading/focus order; and
- invalid production composition fails validation/build rather than silently improvising.

The current Fardad home order `Hero -> Features -> Categories` can be represented as the first allowed composition and rendered with unchanged visual output during extraction. Future customers choose another approved order/variant set in the same app. Header/Footer/ProductCard similarly use small exhaustive renderers or neutral variant props.

Values that remain code-level include data fetching, API contracts, visibility/authorization, route structure, semantic landmarks, heading-level rules, keyboard/focus behavior, sanitization, error/loading mechanics, minimum touch targets, responsive guardrails, safe image behavior, and component registry membership.

## Brand Book Analysis Workflow

Brand Book material must never flow directly into code. Required workflow:

1. **Intake and provenance** — record source files, version/date, owner, supplied permissions, confidentiality, and missing pages/assets.
2. **Evidence extraction** — extract explicit facts/rules with page/source references; do not “complete” missing values creatively.
3. **Business/context interview** — capture audience, offer, market, goals, languages, channels, operational constraints, and desired modules.
4. **Classification** — mark each value `confirmed`, `provisional`, `missing`, `conflicting`, `rejected`, or `not applicable`.
5. **Rights and safety review** — verify logo/font/photography licenses, public-use permission, privacy, claims, and asset safety.
6. **Technical mapping** — map approved primitives to semantic tokens, typography roles, content rules, variant IDs, and allowed compositions.
7. **Automated/manual validation** — contrast, font/script coverage, responsive behavior, performance, SEO, and component compatibility.
8. **Direction proposals** — prepare up to three bounded Demo Profiles with explicit differences and shared unknowns.
9. **Customer review** — capture chosen direction, requested bounded changes, rejected alternatives, and approvals.
10. **Specification freeze** — issue a versioned Brand Implementation Specification before production profile changes.

Every interpretation must be traceable to evidence or clearly identified as a team proposal. Unapproved customer values must not be silently hard-coded.

## Brand Implementation Specification Output

The specification should contain:

- document/profile IDs, versions, dates, customer/approver, source material register, and decision log;
- confirmed/provisional/missing value matrix;
- identity, logo/asset, palette, typography/license, voice, photography, iconography, and localization rules;
- semantic token mapping and contrast evidence;
- chosen Theme Preset/version and approved overrides;
- chosen Experience Profile with shell/component/section/mobile/motion decisions;
- separate Feature Profile/package/capability selection;
- localized content inventory, terminology, claims/legal approval, and asset checklist;
- SEO identity, canonical-domain/deployment requirements, social metadata, and indexing rules;
- accessibility/performance/browser/responsive acceptance criteria;
- demo-to-production changes and excluded demo content;
- unresolved blockers/risks and owner/due decision; and
- explicit customer/technical approval record.

The signed/approved specification is the input to implementation. A Brand Book alone is not.

## Demo Factory Architecture

Three demos should be three configurations/build outputs from one Storefront codebase, not three applications or branches.

Each `DemoProfile` should reference:

- one provisional/approved Brand Profile version;
- one Theme Preset version;
- one bounded Experience Profile;
- a non-authoritative preview Feature Profile;
- one isolated localized Demo Content bundle;
- preview metadata/banner/watermark and `noindex, nofollow`; and
- lifecycle/expiry/customer-engagement identifiers with no credentials.

The internal team can use a build/deployment matrix with an allowlisted server-only profile ID. Profile selection must occur at build/deployment configuration, never from a browser query, arbitrary hostname, cookie, or uploaded config. Preview hosting/publishing remains outside WO-011.

The three directions should vary meaningful approved axes—such as composition, density, typography treatment, imagery framing, navigation, and motion—not merely logo/color. They reuse the same business components, API contracts, accessibility rules, and variant registry.

A chosen demo becomes production through promotion, not copying:

1. freeze the selected Demo Profile/version;
2. record customer approval and bounded amendments;
3. create/approve the final Brand Implementation Specification;
4. create an approved production Brand/Experience profile referencing the selected preset/variants;
5. discard demo-only content/preview flags and connect only approved production content/data sources;
6. resolve official deployment/SEO/assets/features separately; and
7. run the full production validation matrix.

No Demo component or business logic is copied into a parallel frontend.

## Demo Data Isolation Rules

Demo data must be structurally and operationally isolated:

- synthetic/licensed demonstration content only, clearly labelled as preview;
- no production database, customer/order/account/payment/CRM/admin API, or private network access;
- no customer credentials, secrets, analytics IDs, marketing tags, or production environment variables;
- read-only local/server-only fixture adapter implementing only approved public display contracts;
- no checkout/payment/order writes, forms that transmit personal data, authentication, or Admin access;
- `noindex, nofollow`, no sitemap/structured offers, and no production canonical domain;
- preview banner/watermark and expiry/owner metadata;
- assets copied only with documented preview rights and no raw Media storage reference;
- distinct build/deployment variables, cache namespace, logs, and telemetry policy; and
- automated scans preventing production origins/secrets/customer IDs from entering demo builds.

Demo content is never “promoted” into production data by changing an environment flag. It is replaced through an approved production content/data process.

## Client Questionnaire Output Requirements

The future progressive questionnaire must output structured, reviewable artifacts—not raw free-form answers directly consumed by code.

Essential output categories:

1. **Brand Implementation Brief** — identity, audience, positioning, differentiators, voice, markets/languages, brand-book/reference evidence, constraints, approvals, and unknowns.
2. **Theme/Experience direction** — preferred visual qualities, selected/rejected preset directions, layout/density/motion/mobile preferences, accessibility needs, and reference-site interpretation.
3. **Feature/Package selection** — desired edition/modules, must-have/later/not-needed classification, entitlement assumptions, and dependency warnings.
4. **Content and asset checklist** — logos, fonts/licenses, colors, photography rights, icons, legal/contact/social copy, translations, owners, status, and due dates.
5. **Product/catalog requirements** — product counts/types, categories, attributes, imagery, variants/configuration, import source, readiness/ownership, and update frequency.
6. **Sales/pricing/shipment/payment requirements** — sales model, price/tax/currency, inventory, shipping regions/methods, payment intent/providers, corporate sales, returns, and compliance requirements.
7. **Social/marketing/analytics consent** — channels, tracking/consent requirements, advertising tools, email/SMS, cookie policy, data controller/processor decisions, and explicit approval.
8. **Technical deployment/access checklist** — domains/DNS, environments, API/provider accounts, asset delivery, email, access owners, security contacts, backups, monitoring, and credential handoff policy (never credentials in questionnaire output).
9. **Scope confirmation and approval record** — included/excluded phases, assumptions, dependencies, demos requested, selected direction, acceptance criteria, decision makers, dates, and sign-off.

Conditional behavior examples:

- no online payment -> skip provider/settlement/payment-flow detail;
- no shipping -> skip carrier/zone/package detail;
- no multilingual scope -> skip translation workflow while retaining locale/direction confirmation;
- no supplied Brand Book -> deepen identity/visual evidence questions;
- no analytics consent -> skip tool-specific setup and record disabled state;
- no corporate sales -> skip quotation/bulk-approval questions; and
- content not ready -> produce a gap/owner/due-date checklist rather than invented copy.

## Accessibility, RTL, Font, Asset, SEO, and Performance Requirements

Accessibility:

- target WCAG 2.2 AA;
- validate every semantic foreground/background/action/focus/status pairing, including hover/disabled states;
- minimum 4.5:1 normal text, 3:1 large text and relevant non-text UI, with visible focus;
- preserve semantic landmarks, headings, labels, keyboard operation, focus order, reduced motion, and minimum touch targets regardless of profile;
- customer preference cannot waive core accessibility behavior; exceptions require explicit risk/approval and remediation.

RTL/localization:

- derive `lang`/`dir` per active locale; use logical properties and DOM reading order;
- test navigation, icons, mixed Persian/Latin text, email/phone/numerals, pagination, forms, media, and bidirectional isolation;
- do not reverse semantic/data order merely to create an RTL appearance;
- support LTR presets/components without separate implementations; multilingual routing/content loading remains a future approved scope.

Fonts:

- use only approved licensed web fonts with documented source, permitted domains/usage, script/glyph coverage, weights/styles, and expiry/renewal owner;
- self-host through an approved asset path when licensing permits; do not fetch arbitrary third-party fonts;
- prefer WOFF2, subset only after Persian/Arabic shaping and Latin/numeral coverage tests;
- use metric-compatible fallbacks and `font-display` policy to limit layout shift; preload only critical faces;
- test missing font, slow network, zoom, bold synthesis, mixed script, and all selected component variants.

Assets:

- require provenance, license/public-use approval, dimensions/formats, accessible purpose, and responsive variants;
- use WO-010 safe public descriptors; never profile storage keys/paths/provider URLs;
- SVG logos require a separately approved sanitized brand-asset path because WO-010 product delivery rejects SVG;
- Demo assets remain isolated and cannot imply production rights.

SEO:

- derive site identity/title templates/descriptions/Open Graph from approved Brand/Content plus deployment canonical origin;
- keep route/product metadata data-driven and brand-aware without changing public catalog contracts;
- support future locale alternates/hreflang only with real localized routes;
- Demo Profiles are `noindex, nofollow` and must not emit production canonical/organization/product claims;
- structured data, claims, addresses, and social identities require verified production facts.

Performance/mobile:

- set budgets for font files, hero/card images, JavaScript, CSS, LCP, CLS, and interaction latency before profile approval;
- test every approved preset/experience at supported mobile/tablet/desktop breakpoints;
- keep server-first composition and minimize client components;
- lazy-load non-critical media, preserve image aspect ratios, and constrain motion/effects;
- reject theme combinations that require excessive font faces, unbounded assets, or inaccessible/mobile-incompatible layout.

## Exact File-Level Implementation Plan

The proposed implementation is staged and compatibility-first. It does not create another frontend, database, API endpoint, tenant system, or page builder.

Stage 1 — contracts/resolution:

1. Add framework-neutral Theme, Brand, Experience, Content, and composition contracts.
2. Add generic pure profile/token resolution and validation helpers; no customer data in shared packages.
3. Keep the current `StorefrontProfile` as the resolved compatibility output so existing callers remain operational.

Stage 2 — Fardad extraction:

4. Create the app-owned provisional `luxury-heritage` preset and Fardad Brand/Experience/Feature/Content profiles.
5. Keep existing `fardad-*` files as temporary compatibility re-exports during migration.
6. Change the server-only profile resolver, root layout, navigation, and metadata to consume resolved composition rather than direct Fardad imports.
7. Generate all CSS variables from the resolved theme; remove duplicate Fardad palette/font constants from Tailwind/global CSS.

Stage 3 — constrained composition:

8. Add exhaustive app-owned renderer registries for shell/home/catalog variant IDs.
9. Move hard-coded localized copy into Fardad content configuration.
10. Preserve existing visual order/output as the first Luxury Heritage profile; no home redesign.
11. Add neutral constrained variant props only where shared UI cannot express the approved matrix.
12. Validate profile compatibility, contrast, RTL/LTR behavior, typography/assets, SEO, mobile, performance, and dependency boundaries.

Demo Factory profiles, questionnaire UI, hosting, production customer profiles, and automated profile generation remain future Work Orders.

### Files to Create

| File                                                                 | Purpose                                                                                   |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `packages/types/src/theme.ts`                                        | Theme Preset/token/variant ID contracts only.                                             |
| `packages/types/src/brand.ts`                                        | Versioned Brand identity/assets/typography/voice/localization/approval contracts.         |
| `packages/types/src/experience.ts`                                   | Constrained shell/page/component/mobile/motion selection contracts.                       |
| `packages/types/src/content.ts`                                      | Localized content-key/bundle contracts without customer values.                           |
| `packages/types/src/storefront-composition.ts`                       | Composition/profile references, lifecycle, compatibility, and resolved-profile contracts. |
| `packages/config/src/storefront-profile.ts`                          | Pure generic merge/default/validation helpers; no preset/customer registry.               |
| `apps/storefront/src/themes/presets/luxury-heritage.ts`              | Provisional reusable customer-neutral preset values.                                      |
| `apps/storefront/src/themes/theme-preset-registry.ts`                | Closed app-owned preset registry with explicit versions.                                  |
| `apps/storefront/src/config/brands/fardad/brand-profile.ts`          | Provisional/approved Fardad identity facts and approval state.                            |
| `apps/storefront/src/config/brands/fardad/experience-profile.ts`     | Fardad Luxury Heritage composition/variant selection.                                     |
| `apps/storefront/src/config/brands/fardad/feature-profile.ts`        | Fardad edition/capability selection, visually independent.                                |
| `apps/storefront/src/config/brands/fardad/content.fa.ts`             | Fardad Persian shell/home/catalog/state copy and content keys.                            |
| `apps/storefront/src/config/brands/fardad/navigation.ts`             | Fardad Persian navigation and capability requirements.                                    |
| `apps/storefront/src/config/brands/fardad/index.ts`                  | Fardad composition export only.                                                           |
| `apps/storefront/src/config/storefront-profile-registry.ts`          | Server-only allowlisted production profile registry; no request-derived selection.        |
| `apps/storefront/src/lib/resolve-storefront-profile.ts`              | Validate/resolve composition into current Storefront-compatible output.                   |
| `apps/storefront/src/lib/theme-css-variables.ts`                     | Map the resolved token contract to a complete CSS-variable record.                        |
| `apps/storefront/components/composition/HomeSectionRenderer.tsx`     | Exhaustive allowlisted section renderer.                                                  |
| `apps/storefront/components/composition/StorefrontShellRenderer.tsx` | Maps approved shell variant IDs to existing layout components.                            |
| `docs/architecture/brand-adaptation-framework.md`                    | Long-lived profile ownership/workflow/validation architecture after approval.             |

The first implementation should not create `config/demos`, preview deployments, questionnaire files, or additional customer folders.

### Files to Modify

| File                                                             | Exact change                                                                                                |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `packages/types/src/storefront.ts`                               | Preserve current output while referencing/splitting the new neutral concepts; do not embed customer values. |
| `packages/types/src/capabilities.ts`                             | Add only the neutral Feature Profile wrapper/lifecycle if required; preserve capability IDs/semantics.      |
| `packages/types/src/index.ts`                                    | Export new contracts.                                                                                       |
| `packages/config/src/storefront-defaults.ts`                     | Expand only neutral semantic fallbacks needed by the typed token map.                                       |
| `packages/config/src/index.ts`                                   | Export generic profile resolver/validator.                                                                  |
| `packages/ui/src/Button.tsx`                                     | Add approved neutral visual variants if required by the first matrix.                                       |
| `packages/ui/src/Card.tsx`                                       | Move fixed hover/elevation into neutral constrained variants/tokens.                                        |
| `packages/ui/src/Heading.tsx`                                    | Add only approved neutral scale/treatment variants.                                                         |
| `packages/ui/src/Section.tsx`                                    | Add neutral density/rhythm variants.                                                                        |
| `packages/ui/src/SiteHeader.tsx`                                 | Make sticky/surface treatment a neutral constrained variant.                                                |
| `packages/ui/src/SiteFooter.tsx`                                 | Support approved neutral footer composition variants via slots/props.                                       |
| `apps/storefront/src/config/fardad-store.ts`                     | Become a temporary compatibility re-export of the resolved Fardad composition.                              |
| `apps/storefront/src/config/fardad-navigation.ts`                | Become a temporary compatibility re-export; remove after a separately approved cleanup.                     |
| `apps/storefront/src/config/fardad-features.ts`                  | Become a temporary compatibility re-export of Fardad Feature Profile.                                       |
| `apps/storefront/src/lib/storefront-config.ts`                   | Delegate to the allowlisted server-only resolver rather than importing one mixed profile directly.          |
| `apps/storefront/src/lib/navigation.ts`                          | Consume the resolved Feature/Navigation profiles; remove direct Fardad entitlement import.                  |
| `apps/storefront/src/lib/metadata.ts`                            | Compose approved Brand/Content identity with deployment canonical origin.                                   |
| `apps/storefront/src/lib/catalog-metadata.ts`                    | Remove direct `fardadProfile` import and consume resolved brand/content context.                            |
| `apps/storefront/app/layout.tsx`                                 | Use the resolved profile/theme-variable helper and approved font variables.                                 |
| `apps/storefront/app/globals.css`                                | Remove hard-coded customer font and retain structural/semantic global rules.                                |
| `apps/storefront/tailwind.config.ts`                             | Remove duplicate Fardad palette/font literals; retain structure/semantic CSS-variable aliases.              |
| `apps/storefront/app/(public)/layout.tsx`                        | Resolve localized skip-link copy and approved shell composition.                                            |
| `apps/storefront/app/(public)/page.tsx`                          | Render the allowlisted section order; preserve current order initially.                                     |
| `apps/storefront/components/home/Hero.tsx`                       | Receive typed localized content and approved hero variant; no hard-coded Fardad copy/classes from profiles. |
| `apps/storefront/components/home/Features.tsx`                   | Receive typed content/variant; remove embedded claims/list.                                                 |
| `apps/storefront/components/home/Categories.tsx`                 | Receive approved content/data source and variant; remove embedded category claims.                          |
| `apps/storefront/components/layout/StorefrontHeader.tsx`         | Use Brand assets/name, localized label, and approved shell variant.                                         |
| `apps/storefront/components/layout/StorefrontFooter.tsx`         | Use verified optional Brand/Content fields and footer variant.                                              |
| `apps/storefront/components/layout/MobileNavigation.tsx`         | Receive localized button text and approved mobile variant while preserving behavior.                        |
| `apps/storefront/components/catalog/ProductCard.tsx`             | Map approved ProductCard variant and localized fallback; keep public contract unchanged.                    |
| `apps/storefront/components/catalog/CategoryDiscovery.tsx`       | Resolve localized landmark text and constrained treatment.                                                  |
| `apps/storefront/components/catalog/CatalogEmptyState.tsx`       | Move Persian state copy to content profile.                                                                 |
| `apps/storefront/components/catalog/CatalogPagination.tsx`       | Move Persian labels to content profile; preserve pagination behavior.                                       |
| `apps/storefront/app/(public)/products/page.tsx`                 | Use localized profile content/SEO and approved composition without changing API calls.                      |
| `apps/storefront/app/(public)/products/category/[slug]/page.tsx` | Use localized fallback/SEO copy and resolved Brand identity.                                                |
| Storefront loading/error/not-found route files                   | Replace hard-coded copy with the resolved localized content bundle; preserve semantics/retry behavior.      |
| `apps/storefront/.env.example`                                   | Document a non-secret build/deployment profile selector and keep API/media origin ownership separate.       |

No API, Prisma, migration, seed, Media, catalog transport, Product quality, Admin, or dependency file is required for this architecture.

## Validation Plan

Contract/profile validation:

- every profile/preset has stable ID, schema version, lifecycle, and exact referenced version;
- production resolution rejects missing/provisional required facts, unknown fields, unknown variant/section IDs, incompatible combinations, duplicate sections, and unapproved arbitrary values;
- Theme resolution is deterministic and Feature Profile cannot be changed by Theme/Experience;
- production selector is server/build-only and allowlisted; no request-based profile selection;
- existing resolved Fardad output remains compatible during extraction.

Shared-boundary scans:

- no customer/Fardad names, Persian copy, palette, font, assets, domain, contact, or Demo data in `packages/ui`/`packages/config`;
- no customer class strings/HTML/JS in profile contracts;
- no Prisma/API source imports outside allowed boundaries;
- no catalog/media public-contract widening or raw media references;
- no second frontend/customer application and no dependency addition unless separately approved.

Visual/component matrix:

- render every approved Theme Preset × component variant × supported direction × breakpoint combination;
- automated contrast-pair checks plus manual focus/hover/disabled review;
- RTL/LTR logical alignment, DOM/focus order, mixed-script/numeral/icon tests;
- keyboard/screen-reader/zoom/reduced-motion/touch-target checks;
- missing/long/translated content and missing optional asset/contact states;
- snapshot/visual regression only after an approved existing/new test harness.

Font/asset validation:

- license/provenance approval, WOFF2/font metadata, Persian shaping/glyph/weight coverage, fallback and CLS tests;
- logo/image MIME/dimension/rights/alt checks and safe public delivery;
- no raw path/provider URL or unapproved SVG behavior.

Performance/SEO/mobile:

- Storefront production build, all workspace type/lint checks, and `git diff --check`;
- page-weight/font/image/Core Web Vitals budgets on representative mobile and desktop profiles;
- metadata/canonical/Open Graph/robots per production/demo lifecycle;
- Demo build scans for production origin, credentials, analytics, customer/private data, mutations, and indexing.

Business regression:

- public catalog endpoints/contracts, visibility, pagination, media null/safe descriptor behavior, and capability filtering remain unchanged;
- no profile enables unavailable or unauthorized business behavior.

## Risks and Mitigations

| Risk                                                         | Mitigation                                                                                                                 |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| New brands still look like recolored Fardad                  | Require meaningful composition/typography/density/media/shell differences through approved variants and customer sign-off. |
| Profile becomes an unsafe page builder                       | Finite IDs, exhaustive registries, typed content keys, no HTML/CSS/JS/classes/dynamic imports.                             |
| Customer data leaks into shared packages                     | Automated scans and app-owned brand/theme/content registries.                                                              |
| Theme activates business capability                          | Hard separation; capability filter and API authorization remain authoritative.                                             |
| One mixed config continues to grow                           | Split source profiles but retain a resolved compatibility adapter during migration.                                        |
| Token systems drift                                          | One typed resolver and CSS-variable generator; remove duplicate app palette/font constants.                                |
| Invalid contrast after Brand overrides                       | Validate semantic pairs after complete resolution; reject production profile.                                              |
| Fonts cause license, glyph, privacy, or CLS failures         | Evidence/approval registry, self-host policy, coverage/fallback/metric tests, bounded preload.                             |
| Fardad placeholders become treated as facts                  | Per-field approval state; omit unverified production fields and block claims/legal metadata.                               |
| Demo reaches real services/data                              | Static read-only fixtures, separate builds/config/cache, no secrets/API mutations, automated isolation scans.              |
| Demo is indexed or mistaken for production                   | Visible preview marker, noindex/nofollow, no production canonical/schema/claims, expiry.                                   |
| Arbitrary profile selection creates tenant/security behavior | Server/build-only allowlist; no request host/query/cookie selector.                                                        |
| Component variant matrix becomes unbounded                   | Start with Luxury Heritage and a minimal approved matrix; add presets only through reviewed Work Orders.                   |
| Multilingual scope becomes a hidden rewrite                  | Contracts support locale/direction now; routing/translation workflow remains separately approved work.                     |

## Explicit Out-of-Scope Items

This review does not authorize or implement a home redesign, product detail/gallery, Theme Library UI, visual/page builder, multitenancy, multiple client apps, demo/profile hosting, preview deployment, customer onboarding/questionnaire UI, CMS/Admin theme editor, media upload/brand-asset pipeline, AI design generation, arbitrary theme scripting, new dependency, database/API/migration/worker, payment/order/cart/pricing/shipping, production client profile, external analytics/marketing integration, or changes to WO-009/WO-010 business contracts.

The first controlled implementation must not create three demos, publish previews, ingest a customer Brand Book automatically, add final Fardad claims/assets/contacts, or enable a production feature based on visual configuration.

## Approval Gate

Repository readiness is **READY WITH BLOCKERS**.

This pre-implementation review was **READ ONLY**. No application source code was modified. WO-011 implementation is awaiting explicit approval.

Architecture implementation requires approval of:

1. the five-input composition model and exact contract ownership;
2. app-owned Theme Preset registry rather than customer data in shared packages;
3. the compatibility-first file/migration plan and initial neutral variant matrix;
4. the build/server-only allowlisted profile selection rule;
5. Fardad's provisional Luxury Heritage direction and which existing values must be omitted pending proof; and
6. accessibility/contrast/font/asset/performance acceptance criteria.

Final Fardad production readiness is blocked by:

- approved Brand Book or signed Brand Implementation Specification;
- official logo/brand assets and usage rights;
- licensed Persian/Latin font assets and coverage/hosting approval;
- verified contacts, legal identity/copyright, domain, claims, and SEO copy;
- approved imagery/photography guidance and safe asset delivery; and
- completed mobile/component/contrast/accessibility/performance review.

Demo work is additionally blocked by an approved synthetic data source, preview security/indexing policy, deployment ownership, expiry/access policy, and customer approval workflow. Those do not block the core contract/Fardad extraction.

## Action Items

1. Review and approve or amend the Theme/Brand/Experience/Feature/Content boundaries.
2. Confirm the app-owned preset/profile registry and single-Storefront strategy.
3. Provide/approve Fardad Brand Book, asset/font rights, official identity/contact/legal/SEO facts, and claim ownership.
4. Approve a minimal Luxury Heritage component/section matrix and validation criteria.
5. Issue a controlled implementation Work Order limited to contract extraction and the Fardad reference profile.
6. Keep Demo Factory, questionnaire, hosting, additional customers, and production provider/data work behind separate approval gates.

Explicit answers:

| Question                                                                                          | Answer                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| What exact values belong to Theme Preset, Brand Profile, Experience Profile, and Feature Profile? | Theme owns reusable semantic/layout/type/motion/variant/composition defaults; Brand owns approved identity/assets/palette/font references/voice/contact/localization/SEO guidance; Experience owns selected preset, shell/page/section/card/hero/density/motion/mobile variant IDs; Feature owns edition/entitled/enabled/implemented capability state independently. |
| What values must never enter `packages/ui` or `packages/config`?                                  | Any customer identity, logo/assets, palette/font, copy/contact/legal/domain/SEO, customer capability selection, Demo/customer data, credentials/origins, or arbitrary HTML/CSS/JS/class/config values.                                                                                                                                                                |
| How does Fardad remain specific while reusable components remain neutral?                         | Fardad profiles/content live under `apps/storefront/src/config/brands/fardad`; shared packages expose only neutral contracts/helpers/variants and semantic variables.                                                                                                                                                                                                 |
| Can current Storefront configuration evolve without a destructive rewrite?                        | Yes. Keep `StorefrontProfile` as a resolved compatibility output, split inputs behind the server-only resolver, then migrate direct imports/copy/styles in stages while retaining one app/routes/contracts.                                                                                                                                                           |
| What exact contracts/configuration files would be created or modified?                            | The Files to Create/Modify tables above define the exact proposed contract, resolver, preset, Fardad profile, renderer, layout/style, content, and compatibility files. No API/database file is required.                                                                                                                                                             |
| How can three demos be created without three production codebases?                                | Build up to three allowlisted Demo Profiles from one Storefront/component registry using isolated read-only demo content and separate preview build configuration.                                                                                                                                                                                                    |
| How does a selected Demo Profile become production?                                               | Freeze/version/approve it, issue the final specification, create approved production Brand/Experience profiles, remove preview/demo content, connect approved production sources, and revalidate; never copy the app/business code.                                                                                                                                   |
| How should a Brand Book be analyzed and approved before code changes?                             | Provenance intake, evidence extraction, contextual interview, confirmed/provisional/missing classification, rights/safety review, technical semantic mapping, validation, bounded demos, customer choice, and signed specification freeze.                                                                                                                            |
| Which questionnaire outputs are essential?                                                        | Brand Implementation Brief; theme/experience selection; feature/package selection; content/assets; product/catalog; sales/pricing/shipping/payment; social/marketing/analytics consent; deployment/access checklist; and scope/approval record.                                                                                                                       |
| What remains out of scope?                                                                        | Redesign/detail/gallery, library/builder, tenancy/multiple apps, demos/hosting/onboarding/questionnaire UI, CMS/Admin, upload/AI, database/API/worker/dependencies, commerce flows, and production customer assets/profiles without approval.                                                                                                                         |
| Is implementation READY, READY WITH BLOCKERS, or NOT READY?                                       | **READY WITH BLOCKERS.** The compatibility-first framework is actionable after approval; final Fardad production and Demo work require the evidence/assets/rights/decisions listed above.                                                                                                                                                                             |
