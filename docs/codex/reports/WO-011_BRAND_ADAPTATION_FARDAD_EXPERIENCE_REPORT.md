# WO-011 Brand Adaptation and Fardad Experience Implementation Report

> Project: Fardad Enterprise Platform
>
> Work order: WO-011 — Brand Adaptation Framework & Fardad Experience Profile
>
> Phase: Controlled Implementation
>
> Status: COMPLETED
>
> Implementation date: 2026-07-20
>
> Active branch: `architecture-refactor`

## Executive Summary

WO-011 is complete within its approved controlled-implementation boundary. The Storefront now resolves five separately owned, versioned inputs—Theme Preset, Brand Profile, Experience Profile, Feature Profile, and Localized Content Profile—through one deterministic server-only registry into a backward-compatible `StorefrontProfile`.

Fardad is the only resolvable composition and the first app-owned reference profile. Its current Luxury Heritage palette, Persian RTL direction, home order, section rhythm, and catalog-card approach are retained as provisional source material. Unverified phone, mobile, address, email, canonical domain, legal name, copyright owner, export claims, SEO claims, font references, font assets, logo assets, and social URLs were removed or omitted from resolved public output.

Shared packages remain customer-neutral. No `packages/ui` change was required. No database schema, migration, API endpoint, catalog/media contract, dependency, lockfile, Admin source, worker, authentication, or commerce behavior was changed.

## Approved Architecture Decisions

- Keep one Storefront application and one existing route/API surface.
- Compose five independently owned inputs server-side.
- Retain `StorefrontProfile` as the WO-008 compatibility output.
- Keep all concrete presets and Fardad/customer values app-owned.
- Permit only closed, typed variant and section IDs.
- Keep Feature Profile entitlement and availability independent from visual profiles.
- Resolve only one allowlisted production profile; do not inspect requests or arbitrary environment values.
- Generate semantic CSS variables from typed tokens through code-owned mappings.
- Preserve current `Hero → Features → Categories` order and existing catalog/media behavior.
- Mark legacy-derived Theme, Brand, Experience, and Content values provisional.

## Five-Input Configuration Model

| Input                     | Owner                                      | Responsibility                                                                                                                                    | Explicit exclusions                                                                          |
| ------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Theme Preset              | `apps/storefront/src/themes`               | Customer-neutral semantic defaults, typography roles, density, rhythm, shape, elevation, motion/media limits, and allowed variants/compositions   | Identity, assets, content, domain, feature state, credentials, origins, raw CSS/classes/URLs |
| Brand Profile             | `apps/storefront/src/config/brands/fardad` | Identity, locale/direction, semantic overrides, bounded font references, voice, optional verified public facts, SEO identity, provenance/approval | UI implementation, origins, secrets, storage, commerce logic, arbitrary asset/font URLs      |
| Experience Profile        | Same app-owned Fardad folder               | Exact preset version and bounded shell/home/component/card/density/motion/mobile selections                                                       | HTML, JSX, CSS, JavaScript, classes, component imports, URLs, data access                    |
| Feature Profile           | Same app-owned Fardad folder               | Edition, entitlement, enabled capabilities, and implemented/publishable capabilities                                                              | Theme or visual activation of business behavior                                              |
| Localized Content Profile | Same app-owned Fardad folder               | Structured Persian navigation, shell, home, catalog, state, and SEO text                                                                          | Executable HTML, unbounded templates, verified-fact substitution, data access                |

The generic resolver validates and produces the compatibility output fields `identity`, `brand`, `design`, `seo`, `navigation`, and `capabilities`, plus references to all five resolved inputs.

## Shared Package Boundary Confirmation

`packages/types` contains only neutral contracts and finite engine IDs. `packages/config` contains neutral defaults, capability helpers, deterministic resolution, and validation. `packages/ui` remains unchanged and continues to consume semantic CSS variables and caller-owned content.

Structural scans returned zero customer/Fardad value, Persian copy, Fardad palette, customer font, domain, contact, logo, SEO-copy, or asset matches in `packages/config/src` and `packages/ui/src`. The `@fardad/*` package namespace is repository identity, not a customer configuration value.

## Theme Preset Foundation

The app-owned `luxury-heritage` preset is version 1 and explicitly provisional. It contains the current emerald, ivory, gold, and copper semantic direction, existing radii/content width, system-font role IDs, a closed raised-card elevation ID, spacious density, restrained motion, editorial media treatment, and one tested initial variant matrix.

It contains no Fardad identity or customer fact. Its palette is not duplicated in Tailwind or shared packages.

## Fardad Brand Profile

The provisional Brand Profile contains only the known Fardad display identity, `fa-IR`, Persian language, RTL direction, bounded system-font references, voice direction, and SEO site identity. It carries `legacy-reference` provenance and a provisional-field inventory.

The following are absent: legal name, canonical domain, timezone/currency assertions, logo, customer font, contacts, address, social links, copyright owner, and external asset URLs.

## Fardad Experience Profile

The versioned provisional Experience Profile selects `luxury-heritage@1`, the standard shell, centered hero, three-column features, card-grid categories, standard product card, spacious density, restrained motion, and disclosure mobile navigation. Its ordered home sections remain exactly:

```text
hero
features
categories
```

All choices are finite IDs checked against the preset. The profile contains no classes, CSS, component names, imports, URLs, or data-access logic.

## Fardad Feature Profile

The Feature Profile preserves the previous `base` edition, cumulative entitlement set, enabled capabilities, and `catalog.products` as the only implemented/publishable capability. Navigation still resolves visibility from the intersection of entitlement, enabled state, and implemented state. No capability ID or entitlement semantics changed.

## Fardad Localized Content Profile

Persian copy for navigation, shell, home, catalog, pagination, media fallback, loading, errors, empty states, not-found state, and SEO now lives in one structured app-owned profile. Text templates use named placeholders replaced by components and are never rendered as HTML.

The profile is explicitly provisional with legacy provenance. Export/international-shipping assertions, verified product-quality claims, contact/legal placeholders, and unverified SEO claims are absent. Existing thematic category/action copy remains identifiable as provisional pending final brand/content approval.

## Server-Only Profile Resolution

`storefront-profile-registry.ts` imports `server-only` and exposes one constant production ID, `fardad-production`. `resolve-storefront-profile.ts` imports `server-only`, resolves the registry composition through the generic package helper, and caches the immutable result.

Scans found no hostname, header, cookie, query, request, client state, uploaded input, `process.env`, or dynamic import selector. No Demo or second customer registry entry exists.

## Theme Token Resolution

The enforced order is:

1. neutral engine defaults;
2. Theme Preset tokens;
3. Brand semantic and typography overrides;
4. separately validated Experience selections; and
5. code-owned accessibility/performance mappings.

The resolver validates six-digit colors and checks text/background and primary/secondary contrast at 4.5:1 plus focus/background at 3:1. Font families and card shadows are closed IDs mapped to safe CSS values by `theme-css-variables.ts`. Tailwind now contains structural semantic-variable aliases only; global CSS uses the resolved font variables and no customer font name.

## Composition Renderer

`HomeSectionRenderer` exhaustively maps the three allowed section IDs to existing components and passes typed content/variant props. `StorefrontShellRenderer` maps the one allowed shell variant to the existing skip link, header, main landmark, and footer. Profiles cannot supply nesting, component names, dynamic imports, classes, or layout code.

No shared UI modification was necessary to render the approved initial matrix.

## Legacy Compatibility Adapters

The existing `fardad-store.ts`, `fardad-navigation.ts`, and `fardad-features.ts` remain as temporary compatibility exports. `getStorefrontProfile()` now delegates to the server-only resolver. Existing metadata, navigation filtering, root layout, routes, API clients, product catalog calls, and public media descriptors continue using their established interfaces.

## Brand Book Workflow Documentation

`docs/architecture/brand-adaptation-framework.md` defines controlled intake, evidence/provenance extraction, stakeholder reconciliation, confirmed/provisional/conflicting/missing classification, rights review, semantic mapping, validation, bounded review, specification freeze, and approved implementation. It also defines the required versioned Brand Implementation Specification and approval evidence.

## Demo Factory and Questionnaire Deferral

No Demo Profile, demo data, preview configuration, hosting, selector, onboarding flow, questionnaire UI, upload, automatic Brand Book analysis, or profile generator was created.

The architecture document defines future isolated synthetic/read-only demo data, distinct builds/caches/domains/access/expiry, no production services or secrets, visible preview/noindex controls, automated crossover scans, configuration-only promotion, and the nine required questionnaire output artifacts. Any implementation remains behind a separate approval gate.

## Provisional and Omitted Fardad Facts

| Category                                                   | Current handling                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Palette, experience variants, home/category copy, SEO copy | Versioned and explicitly provisional                                            |
| Font                                                       | Closed `system-sans` fallback only; no customer font name/file/license asserted |
| Logo/photography                                           | Omitted; no asset invented                                                      |
| Email/phone/mobile/address                                 | Omitted; former placeholders no longer resolve or render                        |
| Legal name/copyright owner                                 | Omitted                                                                         |
| Canonical domain                                           | Omitted; metadata helper tolerates absent `metadataBase`                        |
| Social links                                               | Empty; no URLs invented                                                         |
| Export/international shipping and product-quality claims   | Removed from public configuration copy                                          |
| Official Brand Book                                        | Not represented; legacy implementation is the recorded source                   |

## Files Created

| File                                                                      | Why it was created                                                                                                            |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `packages/types/src/theme.ts`                                             | Defines neutral semantic tokens, safe token IDs, finite variants/sections, and Theme Preset provenance.                       |
| `packages/types/src/brand.ts`                                             | Defines neutral Brand identity, approval, asset, contact, voice, palette, and typography contracts.                           |
| `packages/types/src/experience.ts`                                        | Defines the bounded Experience Profile and provisional-field contract.                                                        |
| `packages/types/src/content.ts`                                           | Defines structured localized shell/home/catalog/state/SEO content without executable content.                                 |
| `packages/types/src/storefront-composition.ts`                            | Defines the five-input Storefront composition contract.                                                                       |
| `packages/config/src/storefront-profile.ts`                               | Implements neutral deterministic merge, variant/section/capability checks, contrast guardrails, and compatibility output.     |
| `apps/storefront/src/themes/presets/luxury-heritage.ts`                   | Adds the provisional reusable customer-neutral preset.                                                                        |
| `apps/storefront/src/themes/theme-preset-registry.ts`                     | Adds the closed app-owned Theme Preset registry.                                                                              |
| `apps/storefront/src/config/brands/fardad/brand-profile.ts`               | Adds the provisional Fardad identity/profile without unverified optional facts.                                               |
| `apps/storefront/src/config/brands/fardad/experience-profile.ts`          | Adds Fardad's bounded Luxury Heritage selections and home order.                                                              |
| `apps/storefront/src/config/brands/fardad/feature-profile.ts`             | Moves the existing edition/capability state into an independent visual-neutral profile.                                       |
| `apps/storefront/src/config/brands/fardad/content.fa.ts`                  | Centralizes typed provisional Persian copy.                                                                                   |
| `apps/storefront/src/config/brands/fardad/navigation.ts`                  | Moves localized navigation into the app-owned Fardad profile boundary.                                                        |
| `apps/storefront/src/config/brands/fardad/index.ts`                       | Composes the five Fardad inputs and exact preset version.                                                                     |
| `apps/storefront/src/config/storefront-profile-registry.ts`               | Adds the one-entry server-only production allowlist.                                                                          |
| `apps/storefront/src/lib/resolve-storefront-profile.ts`                   | Resolves/caches the allowlisted composition server-side.                                                                      |
| `apps/storefront/src/lib/theme-css-variables.ts`                          | Maps typed tokens and closed IDs to semantic CSS variables.                                                                   |
| `apps/storefront/components/composition/HomeSectionRenderer.tsx`          | Exhaustively maps allowed home section IDs while preserving order.                                                            |
| `apps/storefront/components/composition/StorefrontShellRenderer.tsx`      | Maps the approved shell ID to existing accessible shell components.                                                           |
| `docs/architecture/brand-adaptation-framework.md`                         | Records long-lived ownership, security, Brand Book, demo, promotion, questionnaire, and validation rules.                     |
| `docs/codex/reports/WO-011_PRE_IMPLEMENTATION_BRAND_ADAPTATION_REVIEW.md` | Pre-existing uncommitted approved review retained as the implementation baseline; formatter normalization only in this phase. |
| `docs/codex/reports/WO-011_BRAND_ADAPTATION_FARDAD_EXPERIENCE_REPORT.md`  | Records this implementation, validations, boundaries, and follow-up gates.                                                    |

## Files Modified

| File                                                              | Why it changed                                                                                                                                            |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/types/src/storefront.ts`                                | Keeps the prior compatibility fields while referencing resolved Theme/Brand/Experience/Feature/Content inputs and allowing omitted canonical/legal facts. |
| `packages/types/src/capabilities.ts`                              | Adds the neutral Feature Profile wrapper without changing capability IDs.                                                                                 |
| `packages/types/src/index.ts`                                     | Exports the new neutral contracts.                                                                                                                        |
| `packages/config/src/storefront-defaults.ts`                      | Adds neutral system-font and closed elevation defaults required by the token pipeline.                                                                    |
| `packages/config/src/index.ts`                                    | Exports the generic resolver/validator.                                                                                                                   |
| `apps/storefront/src/config/fardad-store.ts`                      | Replaces the mixed value object with a server-only compatibility export.                                                                                  |
| `apps/storefront/src/config/fardad-navigation.ts`                 | Becomes a compatibility re-export from the Fardad profile folder.                                                                                         |
| `apps/storefront/src/config/fardad-features.ts`                   | Becomes compatibility exports from the independent Feature Profile.                                                                                       |
| `apps/storefront/src/lib/storefront-config.ts`                    | Delegates to the allowlisted server-only resolver.                                                                                                        |
| `apps/storefront/src/lib/navigation.ts`                           | Uses resolved Feature entitlement instead of a direct Fardad entitlement import.                                                                          |
| `apps/storefront/src/lib/metadata.ts`                             | Supports an omitted unverified canonical domain.                                                                                                          |
| `apps/storefront/src/lib/catalog-metadata.ts`                     | Uses resolved SEO identity rather than directly importing the legacy Fardad object.                                                                       |
| `apps/storefront/app/layout.tsx`                                  | Resolves language/direction/metadata/tokens from the compatibility profile and central CSS generator.                                                     |
| `apps/storefront/app/globals.css`                                 | Removes the unverified Fardad font name and uses semantic body/display font variables.                                                                    |
| `apps/storefront/tailwind.config.ts`                              | Removes the parallel customer palette/font system and retains semantic aliases.                                                                           |
| `apps/storefront/app/(public)/layout.tsx`                         | Uses the resolved localized shell renderer.                                                                                                               |
| `apps/storefront/app/(public)/page.tsx`                           | Uses the allowlisted home renderer instead of fixed component imports.                                                                                    |
| `apps/storefront/components/home/Hero.tsx`                        | Receives typed content/variant and uses semantic tokens rather than hard-coded customer copy/palette utilities.                                           |
| `apps/storefront/components/home/Features.tsx`                    | Receives typed content/variant and removes embedded claim/list copy.                                                                                      |
| `apps/storefront/components/home/Categories.tsx`                  | Receives typed content/variant and removes embedded localized list/copy.                                                                                  |
| `apps/storefront/components/layout/StorefrontHeader.tsx`          | Receives the resolved profile and localized navigation/mobile labels.                                                                                     |
| `apps/storefront/components/layout/StorefrontFooter.tsx`          | Renders only optional verified contact/legal facts and resolved localized description.                                                                    |
| `apps/storefront/components/layout/MobileNavigation.tsx`          | Receives localized menu text and a constrained mobile variant ID.                                                                                         |
| `apps/storefront/components/catalog/ProductCard.tsx`              | Receives product-card variant and localized safe missing-image text; media contract remains unchanged.                                                    |
| `apps/storefront/components/catalog/ProductGrid.tsx`              | Passes resolved content and variant to ProductCard.                                                                                                       |
| `apps/storefront/components/catalog/CategoryDiscovery.tsx`        | Receives localized landmark text.                                                                                                                         |
| `apps/storefront/components/catalog/CatalogEmptyState.tsx`        | Uses structured localized empty-state text/template.                                                                                                      |
| `apps/storefront/components/catalog/CatalogPagination.tsx`        | Uses structured localized pagination labels without changing URL behavior.                                                                                |
| `apps/storefront/app/(public)/products/page.tsx`                  | Uses resolved catalog/SEO copy and product-card variant while preserving API calls and route behavior.                                                    |
| `apps/storefront/app/(public)/products/category/[slug]/page.tsx`  | Uses resolved category/catalog copy and variant while preserving not-found/API behavior.                                                                  |
| `apps/storefront/app/(public)/products/loading.tsx`               | Uses localized loading text.                                                                                                                              |
| `apps/storefront/app/(public)/products/error.tsx`                 | Uses client-safe build-time Fardad localized error text.                                                                                                  |
| `apps/storefront/app/(public)/products/category/[slug]/error.tsx` | Uses client-safe build-time Fardad localized category-error text.                                                                                         |
| `apps/storefront/app/loading.tsx`                                 | Uses server-resolved localized loading text.                                                                                                              |
| `apps/storefront/app/error.tsx`                                   | Uses client-safe build-time Fardad localized global-error text.                                                                                           |
| `apps/storefront/app/not-found.tsx`                               | Uses server-resolved localized not-found text.                                                                                                            |

No `.env.example` change was needed because selection is a source-controlled one-entry registry, not an environment selector. No `packages/ui` file was modified because existing neutral components rendered the approved matrix.

## Validation Commands and Results

| Validation                 | Command/equivalent                                                               | Result                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Package-manager entrypoint | `pnpm.cmd --filter ... typecheck`                                                | Environment-blocked before scripts: pnpm registry signature/version verification timed out; no code diagnostic.        |
| Types                      | `node_modules/.bin/tsc.CMD -p packages/types/tsconfig.json --noEmit`             | Passed.                                                                                                                |
| Config                     | `node_modules/.bin/tsc.CMD -p packages/config/tsconfig.json --noEmit`            | Passed.                                                                                                                |
| Utils                      | `node_modules/.bin/tsc.CMD -p packages/utils/tsconfig.json --noEmit`             | Passed.                                                                                                                |
| UI                         | `node_modules/.bin/tsc.CMD -p packages/ui/tsconfig.json --noEmit`                | Passed.                                                                                                                |
| Storefront                 | `node_modules/.bin/tsc.CMD -p apps/storefront/tsconfig.json --noEmit`            | Passed.                                                                                                                |
| Admin                      | `node_modules/.bin/tsc.CMD -p apps/admin/tsconfig.json --noEmit`                 | Passed.                                                                                                                |
| API                        | `node_modules/.bin/tsc.CMD -p apps/api/tsconfig.json --noEmit`                   | Passed.                                                                                                                |
| Storefront lint            | `node_modules/.bin/eslint.CMD apps/storefront`                                   | Passed.                                                                                                                |
| Admin lint                 | `node_modules/.bin/eslint.CMD apps/admin`                                        | Passed.                                                                                                                |
| API lint                   | `node_modules/.bin/eslint.CMD apps/api/src --ext .ts`                            | Passed.                                                                                                                |
| Storefront build           | `apps/storefront/node_modules/.bin/next.CMD build`                               | Passed; `/`, `/products`, and `/products/category/[slug]` present. Existing Next ESLint-plugin detection warning only. |
| Admin build                | `apps/admin/node_modules/.bin/next.CMD build`                                    | Passed; existing Next ESLint-plugin detection warning only.                                                            |
| API build                  | `apps/api/node_modules/.bin/nest.CMD build`                                      | Passed.                                                                                                                |
| Formatting                 | `node node_modules/prettier/bin/prettier.cjs --write <WO-011 files>`             | Passed.                                                                                                                |
| Patch whitespace           | `git diff --check` plus trailing-space scan over tracked/untracked changed files | Passed.                                                                                                                |

The local binaries are the installed dependency equivalents of the package scripts and did not download, install, or modify dependencies.

## Dependency and Leakage Scans

| Assertion                                                                            | Result                                                                                 |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Customer/Fardad values or Persian copy in `packages/config/src` or `packages/ui/src` | Zero matches.                                                                          |
| Fardad palette/font/domain/contact/logo/SEO values in shared packages                | Zero matches.                                                                          |
| Executable HTML/CSS/JS/classes/URLs in profiles                                      | Zero prohibited matches; a broad initial regex matched only TypeScript generic syntax. |
| Request-derived or arbitrary environment profile selection                           | Zero matches.                                                                          |
| Prisma/API source imports from Storefront/shared packages                            | Zero matches.                                                                          |
| Unverified contact/legal/domain/export/shipping placeholders in Storefront source    | Zero matches.                                                                          |
| Demo/preview/customer source paths                                                   | Zero matches.                                                                          |
| Package manifest or lockfile changes                                                 | None.                                                                                  |
| `apps/api` changes                                                                   | None.                                                                                  |
| Public catalog/media contract or API-client changes                                  | None.                                                                                  |
| `packages/ui` changes                                                                | None.                                                                                  |
| Second Storefront application                                                        | None.                                                                                  |
| Home section order                                                                   | Exact `hero`, `features`, `categories`.                                                |
| Production registry                                                                  | One allowlisted `fardad-production` entry.                                             |

## Known Limitations

- Fardad visual/content values remain provisional until an approved Brand Book or signed specification exists.
- System fonts remain in use; no Persian customer font can be adopted without license, glyph, shaping, fallback, and performance evidence.
- No logo, photography, canonical domain, contacts, legal owner, copyright, or social URLs are available.
- Client error boundaries import the one build-time Fardad content constant because the approved registry contains only Fardad. Any future multi-profile deployment requires a separately approved client-safe content injection design.
- No new unit/visual test files were added because the Work Order allowed only bounded foundation files. Type, lint, production-build, resolver guardrail, and structural scans provide the current evidence.
- The implementation preserves the current composition and is not the final visual redesign.

## Explicit Out-of-Scope Confirmation

This Work Order did not implement or change the Demo Factory, three demos, preview deployment/hosting, customer onboarding, questionnaire UI, Brand Book upload/automatic analysis, customer profile generation, theme library/editor, page builder, multi-tenancy, second frontend, customer credential handling, API, Prisma, migrations, seeds, Media registry/safety, ProductDataQualityService, catalog transport, cart, checkout, order, payment, shipping, pricing, inventory, Gift Experience, authentication, Admin source, workers, dependencies, or lockfiles.

## Git Status

Active branch: `architecture-refactor`.

The worktree contains the WO-011 implementation, its architecture/reporting files, and the previously uncommitted approved pre-implementation review. There are no unrelated changes identified. No commit, push, merge, rebase, branch switch, branch creation, destructive Git command, or user-change discard was performed.

## Follow-Up Work

Final Fardad delivery remains blocked by an approved Brand Book/signed Brand Implementation Specification; approved logo/photography and rights; licensed Persian/Latin fonts; verified contacts, legal identity/copyright, domain, social URLs, and SEO/product claims; and completed visual, accessibility, RTL, mobile, font, asset, SEO, and performance acceptance.

Demo Factory, customer questionnaire, multi-brand deployment, and a final Fardad visual redesign require separate Work Orders and review before implementation.

## Action Items

1. Review the five-input ownership model, neutral shared boundary, one-entry registry, and compatibility adapters.
2. Review the provisional Luxury Heritage token/variant matrix and current content omissions.
3. Supply and approve Fardad Brand Book/specification, asset/font rights, verified public/legal facts, and final copy.
4. Define the component/contrast/mobile/RTL acceptance matrix for the final visual redesign.
5. Approve a separate Work Order before final Fardad redesign, Demo Factory, customer questionnaire, or multi-brand deployment work begins.
