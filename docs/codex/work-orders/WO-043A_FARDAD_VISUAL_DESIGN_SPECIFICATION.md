# WO-043A — Fardad Visual Design & Homepage Experience Specification

> Project: Fardad Enterprise Platform  
> Deliverable type: Documentation-only visual and experience specification  
> Status: PROPOSED — owner approval and verified content are required before production styling  
> Date: 2026-07-23  
> Storefront locale/direction: `fa-IR` / RTL  
> Implementation authority: None; future source changes require separately approved work orders

## 1. Scope and Control Rules

### 1.1 Purpose

This document defines an implementation-ready visual direction and homepage experience for Fardad, a luxury Iranian handicrafts and corporate-gifting storefront. It translates the approved strategic direction into bounded layout, content, interaction, accessibility, data, and acceptance rules without changing any application code.

The intended character is Persian, premium, minimal, artistic, and credible for both individual gift discovery and organizational purchasing. Fardad should reach a stronger level of refinement and distinction than the useful reference principles observed in Aghajani, without copying another brand's expression. Digikala contributes only discovery principles: fast category access, prominent search, transparent offers, trust before conversion, and efficient product discovery. Its dense marketplace presentation is explicitly excluded.

### 1.2 In Scope

- Brand positioning and provisional visual direction.
- Persian RTL typography, color roles, layout, imagery, iconography, surfaces, responsive behavior, accessibility, and motion rules.
- Homepage information architecture and section-level behavior.
- Header, navigation, product-card, campaign, popup, and footer specifications.
- International UX and ethical conversion principles.
- Future component boundaries, configuration needs, analytics events, work-order acceptance criteria, and production asset dependencies.

### 1.3 Exclusions

WO-043A does not authorize:

- changes to application code, routes, components, shared packages, configurations, dependencies, infrastructure, tests, database, API, or analytics runtime;
- a visual page builder, arbitrary remote HTML/CSS/JavaScript, or unbounded component variants;
- new commerce, checkout, payment, pricing, inventory, account, search, CMS, campaign, consultation, newsletter, or corporate-sales behavior;
- activation of a route or capability merely because it appears in this specification;
- hard-coded Fardad copy or visual values in neutral shared packages;
- a final logo, font, photograph, claim, discount, badge, testimonial, legal statement, contact detail, social link, or SEO statement;
- Mobin-specific distinctive concepts, naming, compositions, motifs, or interaction ideas;
- imitation of Aghajani, Digikala, or another identifiable storefront.

### 1.4 Existing Architecture Invariants

1. `apps/storefront` remains the only public storefront owner.
2. Fardad-specific identity, content, profile choices, and concrete visual values remain app-owned.
3. Neutral shared packages may expose constrained contracts and reusable behavior, but must not contain Fardad values or copy.
4. The existing homepage foundation remains exactly `Hero → Features → Categories`. No later work order may remove, reorder, or insert a section inside that sequence without a new architecture decision.
5. Header and footer remain shell concerns around the page. Additional homepage sections begin only after Categories.
6. Content, links, labels, media descriptors, campaigns, and visual data remain configuration- or API-driven.
7. Navigation and sections must be filtered by entitled, enabled, implemented, and publishable capability state. A visual profile cannot enable business behavior.
8. Public facts and claims must be omitted until their source, owner, approval state, and effective dates are recorded.
9. Current theme, content, and experience values remain provisional unless explicitly approved through the brand/content workflow.

### 1.5 Dependencies and Assumptions

| Dependency | Required state | Rule until verified |
| --- | --- | --- |
| Final logo and lockups | Approved files, clear-space/minimum-size rules, and usage rights | Render an approved text identity only; do not fabricate a mark |
| Persian display/body fonts | Licensed web files, weight matrix, fallback, and redistribution evidence | Use the approved system fallback; do not name or package an unlicensed font |
| Product and atelier photography | Rights-cleared masters, alt-text source, crops, focal points, and responsive derivatives | Omit image-led modules or use the existing intentional no-image state |
| Product/category/collection data | Public API fields, publishability, stable slugs, ordering, and empty-state behavior | Do not create static product facts or counts |
| Price and offer data | Authoritative current/base price, currency, validity, eligibility, and campaign source | Omit offer/discount treatment |
| Corporate gifting | Implemented capability, approved route, consultation owner/SLA, catalogue asset, and privacy copy | Hide CTA and popup; do not imply operational readiness |
| Articles and guides | Implemented content capability, approved route, publish state, author/date policy, and images | Hide the section |
| Business, legal, and contact data | Verified public values with named owner and approval date | Omit each missing value independently |
| Social links and newsletter | Verified accounts, operating owner, consent/legal basis, and delivery workflow | Omit |
| Claims and trust evidence | Evidence source, exact wording, scope, owner, review/expiry date | Omit; never replace with generic trust badges |
| SEO copy and canonical identity | Approved copy, legal name, canonical domain, indexation policy | Keep provisional content out of final production metadata |
| Analytics | Approved event taxonomy, consent policy, retention, and implementation owner | Specification only; no tracking is implied |

Assumptions in this document are design proposals, not verified facts. The provisional palette is based on the existing app-owned Luxury Heritage direction. The eventual data contracts may reuse existing product/category/media capabilities, but every new public field and route requires its own approved work order.

### 1.6 Principal Risks

| Risk | Design control |
| --- | --- |
| A premium template is mistaken for a distinctive Fardad identity | Require final brand assets, art direction, Persian typography QA, and owner sign-off before production styling |
| Unverified statements become public claims | Model verification metadata and fail closed by omitting unsupported content |
| Visual configuration enables unavailable features | Capability-gate navigation, sections, CTAs, and popups independently of visual selection |
| Gold/copper use causes weak contrast | Treat metallic colors as restrained accents; validate every foreground/background/state pairing |
| Homepage becomes crowded | One narrative per section, one primary CTA, no stacked promotions, and a strict section order |
| Images degrade performance or crop craft detail | Require responsive derivatives, focal points, aspect-ratio reservation, and measured media budgets |
| RTL works visually but fails semantically | Preserve logical DOM order, native direction, bidi isolation, keyboard order, and Persian-language QA |
| Popup or motion damages trust | Delayed/frequency-limited popup, reduced-motion support, and no urgency mechanics |

## 2. Brand Positioning and Visual Principles

### 2.1 Positioning

Fardad presents Iranian craft as a considered contemporary gift and lasting cultural object. The experience must support two complementary intentions:

- **Luxury heritage:** material, technique, provenance, care, and restrained editorial storytelling.
- **Corporate gifting:** efficient discovery, budget/occasion guidance, consultation access, and professional confidence without becoming visually bureaucratic.

The interface should feel calm, precise, warm, and culturally grounded. Luxury is communicated through proportion, typography, photography, information quality, and restraint—not excessive gold, darkness, ornament, animation, or grandiose claims.

### 2.2 Visual Principles

1. **Persian first:** typography, hierarchy, spacing, and navigation are designed for Persian reading patterns rather than mirrored from an LTR composition.
2. **Product and craft lead:** imagery and verified product information outrank decorative interface elements.
3. **Trust precedes conversion:** show provenance, price/offer clarity, service facts, and operating details only when verified.
4. **Editorial calm, commercial clarity:** generous storytelling moments coexist with fast category, search, and product routes.
5. **One dominant action:** every content block has one primary CTA; secondary actions are visually quieter and never compete.
6. **Progressive disclosure:** reveal deeper navigation, technical detail, and organizational purchasing information when requested.
7. **Honest absence:** hide unavailable content or render an intentional empty state; never fill gaps with fabricated proof.
8. **Bounded distinctiveness:** Persian materiality may be expressed through approved photography, crop, composition, fine rules, and subtle texture. Unapproved ornamental motifs are not assumed.

### 2.3 RTL Typography Hierarchy

Final family names and weight files are a **verified-content dependency**. Until licensing and rendering tests pass, use the existing approved system fallback. Persian and Latin/numeric runs must share compatible cap/x-height, baseline, weight, and numeral behavior.

| Role | Provisional responsive scale | Line height | Weight guidance | Usage |
| --- | --- | --- | --- | --- |
| Display 1 | `clamp(2.5rem, 5vw, 5.5rem)` | 1.15–1.25 | Medium/Semibold | Hero narrative only; preferably no more than two Persian lines |
| Display 2 | `clamp(2rem, 3.5vw, 3.75rem)` | 1.2–1.3 | Medium/Semibold | Major editorial/corporate section |
| Heading 2 | `clamp(1.625rem, 2.5vw, 2.5rem)` | 1.3–1.4 | Semibold | Section title |
| Heading 3 | `clamp(1.25rem, 1.8vw, 1.625rem)` | 1.4 | Semibold | Card/group title |
| Body large | `1.125rem` | 1.9–2.1 | Regular | Editorial introduction |
| Body | `1rem` | 1.8–2 | Regular | Product/service content |
| Utility | `0.875rem` | 1.6–1.8 | Medium | Navigation, price context, metadata |
| Caption | `0.75rem` | 1.6 | Regular/Medium | Supporting metadata, never critical instructions alone |

Typography rules:

- Avoid extreme bold weights, compressed lines, artificial letter spacing in Persian, and long centered paragraphs.
- Center alignment is limited to short hero or transition copy. Body copy and lists align to the logical start.
- Keep line length near 45–75 Persian characters for reading content.
- Use native punctuation and approved Persian/Latin numeral policy consistently. Isolate mixed-direction values such as SKUs, domains, prices, and phone numbers with appropriate bidi semantics.
- Never bake text into images. Text must remain selectable, zoomable, localizable, and readable at 200% zoom.
- Truncation may protect card rhythm only when the complete name remains available on the destination and accessible naming is not damaged.

### 2.4 Color-Role System

The following values are a **provisional mapping of the existing app-owned theme**, not final brand approval:

| Semantic role | Provisional value | Intended use | Restrictions |
| --- | --- | --- | --- |
| Canvas / ivory | `#F8F4EC` | Main page background, editorial warmth | Do not layer low-contrast gold text on it |
| Surface | `#FFFFFF` | Cards, menus, sheets, focused reading areas | Separate with border or restrained elevation |
| Ink / dark accent | `#081613` | Primary text, dark editorial field | Do not turn the entire page into a dark theme |
| Muted ink | `#4B5563` | Secondary text | Must still meet text contrast at actual size/weight |
| Emerald primary | `#0E3B2E` | Primary actions, key navigation state, controlled dark panels | Pair with validated light foreground |
| Gold accent | `#C2A46B` | Fine rules, small decorative accents, selected non-text emphasis | Not body text or the sole state indicator |
| Copper focus/accent | `#A97142` | Warm accent and provisional focus role | Focus visibility must be revalidated on every surface |
| Border | `#E5E7EB` | Quiet structure and separators | Must remain perceivable without over-boxing the page |

Accessibility rules:

- Normal text must meet at least 4.5:1 contrast; large text at least 3:1.
- UI component boundaries, icons conveying meaning, and focus indicators must meet at least 3:1 against adjacent colors.
- Hover, focus, active, selected, disabled, error, success, and visited states require a tested state matrix. Color is never the only signal.
- Gold and copper are accents, not automatic indicators of luxury or interactive state.
- Any final palette change requires contrast checks in RTL components, over real imagery, at 200% zoom, in high-contrast/forced-color conditions where supported.

### 2.5 Spacing, Grid, and Composition

- Use a 4px base spacing scale. Preferred steps: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, and 128px.
- Default content maximum remains aligned with the current provisional `90rem` token until implementation measurement approves a narrower editorial width.
- Desktop: 12-column grid, 24–32px gutters, 64–96px outer margins subject to viewport.
- Tablet: 8-column grid, 20–24px gutters, 32–48px outer margins.
- Mobile: 4-column grid, 16px gutters, 16–24px outer margins.
- Section spacing should generally be 96–128px desktop, 72–96px tablet, and 56–72px mobile. Dense trust or utility strips may be smaller.
- Alternate full-bleed editorial imagery with contained product/content grids; do not place every section inside an identical card.
- Preserve logical source order across breakpoints. Visual reordering must never alter keyboard or screen-reader reading order.

### 2.6 Imagery and Art Direction

- Prioritize rights-cleared product detail, material texture, artisan/process, packaging, and gifting-context photography.
- Photography should use controlled natural/warm light, accurate material color, calm backgrounds, and enough negative space for art direction. Avoid generic stock luxury scenes.
- Hero media requires separate desktop and mobile focal-point/crop metadata; mobile must not be a blind center crop.
- Product listing images use a consistent approved ratio. Editorial/process content may use a distinct ratio to signal story rather than commerce.
- Every meaningful image requires approved alt text based on purpose and visible content. Decorative texture uses empty alt text or CSS and must not obscure content.
- Reserve aspect ratio before loading to prevent layout shift. Use responsive formats/sizes and do not preload below-the-fold media.
- Do not synthesize product appearance, provenance, packaging, artisan identity, or manufacturing scenes and present them as factual photography.

### 2.7 Iconography, Borders, Shadows, and Cards

- Use one coherent icon family with RTL-aware directional icons, 1.5–2px optical stroke, and clear filled/outlined state rules.
- Icons support labels; they do not replace essential Persian text unless universally understood and accessibly named.
- Prefer quiet 1px separators, whitespace, crop, and tonal surface changes over decorative frames.
- Small controls may use the current provisional small radius; product/editorial cards may use a controlled medium radius. Avoid mixed pill/rounded/square styles without semantic reason.
- Shadows are soft and sparse. Menus, sheets, and floating overlays may receive functional elevation. Most content cards use border/tonal separation.
- Product cards do not “float” aggressively on hover. A small image scale or tonal/border change is preferred, with no layout movement.
- Cards must expose a clear focus state, preserve one unambiguous interactive target, and avoid nested conflicting links/buttons.

### 2.8 Desktop, Tablet, and Mobile Behavior

| Viewport mode | Experience rule |
| --- | --- |
| Desktop | Editorial scale and whitespace may expand; search and primary navigation remain immediately available; product grids can reach four columns only when card content remains readable |
| Tablet | Navigation may transition to a hybrid disclosure model; two/three-column content is chosen by measured width, not device name; no hover-only information |
| Mobile | Primary action, search, category access, price/offer clarity, and consultation path remain reachable with comfortable touch targets; sections become single-column or horizontal lists only when scroll affordance is explicit |

Minimum rules across all widths:

- No horizontal page overflow at 320 CSS px.
- Touch targets should be at least 44×44 CSS px.
- Sticky UI must not hide focused elements or consume excessive viewport height.
- Support text zoom to 200%, reflow to 400%, safe-area insets, keyboard navigation, and screen-reader landmarks.

## 3. Homepage Information Architecture

### 3.1 Exact Order

The proposed page and shell order is:

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

`Hero → Features → Categories` is the immutable current homepage foundation. Items 5–11 are future additions after Categories. Header and footer stay in the shell. A section is rendered only when its capability is publishable and its required content/data passes validation; omission never causes later content to move inside the fixed foundation.

### 3.2 Section Contracts

#### 1. Header and Navigation

- **Business goal:** Make high-intent discovery immediate while expressing calm premium confidence.
- **User need:** Search, understand the offering, reach key categories, and locate cart/account or organizational-gifting paths.
- **Content/data dependency:** Capability-filtered navigation tree, implemented routes, category source, search capability, verified logo, account/cart state.
- **Primary CTA:** Search/open search; when search is unavailable, browse products.
- **Empty-state rule:** Hide unavailable branches/actions. Preserve identity, home, and the implemented catalog route; never expose dead links.
- **Mobile behavior:** Compact sticky bar, prominent search entry, accessible menu disclosure, nested category drill-down, cart/account as labelled actions.
- **Accessibility:** One labelled primary-nav landmark, semantic list hierarchy, visible focus, keyboard-operable submenus, current-page state, Escape/return-focus behavior.

#### 2. Hero

- **Business goal:** Establish the active Fardad narrative and direct users to the highest-value verified collection or discovery path.
- **User need:** Quickly understand what is being offered and what to do next.
- **Content/data dependency:** Approved campaign/story copy, rights-cleared art-directed media, alt text, active CTA route, scheduling and approval metadata.
- **Primary CTA:** View the active collection/product discovery path.
- **Empty-state rule:** Use a text-led approved hero with one valid catalog CTA. Do not show a blank image placeholder or invent campaign copy.
- **Mobile behavior:** Dedicated crop/focal point, shorter copy, one dominant full-width CTA; optional secondary action follows.
- **Accessibility:** Semantic heading, readable overlay contrast, no text in image, no auto-advancing carousel, decorative movement ignored by assistive tech.

#### 3. Features / Trust Strip

- **Business goal:** Reduce uncertainty with a small number of verified service or craft facts.
- **User need:** Know why the experience is credible before browsing deeply.
- **Content/data dependency:** Up to three approved items, each with evidence/owner/review date and optional icon.
- **Primary CTA:** Usually none; if required, one “learn more” link to the supporting page.
- **Empty-state rule:** Omit the strip if fewer than two verified items exist. Never substitute generic badges or unsupported promises.
- **Mobile behavior:** Stacked list or horizontally scrollable group with explicit affordance; no tiny three-column compression.
- **Accessibility:** Text carries meaning, icons are decorative or named correctly, list semantics, no claim conveyed by color alone.

#### 4. Visual Categories

- **Business goal:** Accelerate product discovery and communicate breadth without marketplace density.
- **User need:** Recognize a relevant craft, gift intent, occasion, or approved browse path.
- **Content/data dependency:** Active public category/collection records, stable routes, approved names, media, sort order, and optional editorial grouping.
- **Primary CTA:** Open a selected category; optional section-level CTA goes to all products.
- **Empty-state rule:** Render only valid categories. If none exist, omit the visual grid and retain the general catalog CTA.
- **Mobile behavior:** Two-column grid where labels remain legible; use horizontal scroll only with clear partial-card affordance and non-trapped keyboard access.
- **Accessibility:** List semantics, descriptive linked labels, alt text by image purpose, focus state independent of hover.

#### 5. New Arrivals

- **Business goal:** Encourage repeat discovery through genuinely recent publishable items.
- **User need:** See what has actually become available recently.
- **Content/data dependency:** Public products, publishability, authoritative date/eligibility rule, media, route, and optional price/availability fields.
- **Primary CTA:** View the product; section CTA may open all new arrivals.
- **Empty-state rule:** Omit when the minimum curated count is not met. Never reuse old products under a “new” label.
- **Mobile behavior:** Two-column grid or accessible snap list; show essential card information without hover dependence.
- **Accessibility:** Section heading and list, meaningful image alternatives, labels included in accessible name/context, predictable focus order.

#### 6. Verified Special Offers / Campaign Products

- **Business goal:** Surface a real, bounded commercial campaign transparently.
- **User need:** Understand the item, actual benefit, eligibility, price basis, and campaign validity.
- **Content/data dependency:** Authorized campaign ID/status, eligible public products, authoritative current/base price, currency, start/end time, audience, terms URL, and timezone.
- **Primary CTA:** View campaign or eligible product.
- **Empty-state rule:** Omit before start, after expiry, on invalid price/terms, or when no eligible product remains. Do not fall back to “special.”
- **Mobile behavior:** Concise terms disclosure, price relationship readable without horizontal clipping, no countdown.
- **Accessibility:** Programmatic price labels, struck price only when valid and explained, status not color-only, dates readable and locale-aware.

#### 7. Luxury and VIP Collections

- **Business goal:** Present the most elevated verified assortment through editorial curation.
- **User need:** Find high-value, exceptional, or executive-gift options without sorting through the full catalog.
- **Content/data dependency:** Approved public collection or supported product-level semantics, editorial owner, selection rationale, publishability, imagery, and route.
- **Primary CTA:** Explore the verified collection.
- **Empty-state rule:** Omit unless the label and membership are supported by product data or an authorized editorial record.
- **Mobile behavior:** One strong editorial lead followed by compact products; no oversized empty visual.
- **Accessibility:** “Luxury”/“VIP” is visible text, not a color cue; image treatment preserves contrast and zoom; links identify destination.

#### 8. Corporate Gifting Banner and Consultation CTA

- **Business goal:** Generate qualified organizational-gifting inquiries.
- **User need:** Understand that a consultation path exists, what information is needed, and what happens next.
- **Content/data dependency:** Implemented corporate-sales capability and route/form, verified service scope, catalogue asset if offered, consultation owner/SLA, privacy notice, contact method, and CRM/handling policy.
- **Primary CTA:** Request a consultation. Catalogue download is secondary and only when a current approved file exists.
- **Empty-state rule:** Hide the entire module if the inquiry workflow is not operational; do not route to a generic or dead contact page.
- **Mobile behavior:** Compact image/copy, full-width CTA, short expectation statement; any form opens a dedicated page or accessible sheet rather than a dense inline form.
- **Accessibility:** Clear form purpose, labels and errors, consent context, no prechecked marketing consent, keyboard and screen-reader completion.

#### 9. Authenticity / Story / Process

- **Business goal:** Build durable trust through verified origin, material, technique, artist, or process information.
- **User need:** Understand why the object is meaningful and how claims are substantiated.
- **Content/data dependency:** Approved editorial story, claim evidence, rights-cleared process imagery/video, named content owner, and review date.
- **Primary CTA:** Read the full verified story/process page.
- **Empty-state rule:** Omit unsupported assertions and personal/artisan attribution. A neutral craft introduction may render only if its wording is approved.
- **Mobile behavior:** Image and text stack in logical reading order; optional detail disclosure remains user-controlled.
- **Accessibility:** Transcript/captions for media, factual alt text, clear heading structure, no parallax required to understand content.

#### 10. New Articles and Buying Guides

- **Business goal:** Support informed discovery and organic content journeys.
- **User need:** Learn how to select, gift, care for, or understand relevant products.
- **Content/data dependency:** Implemented articles capability/route, published records, approved title/excerpt/image, date/author policy, and stable categories.
- **Primary CTA:** Read an article; section CTA may open all articles.
- **Empty-state rule:** Omit when fewer than the approved minimum current articles exist. Never show unpublished drafts or placeholder excerpts.
- **Mobile behavior:** Single-column cards or accessible horizontal list with full titles and generous targets.
- **Accessibility:** `<article>` semantics, descriptive links, visible publication metadata where used, no ambiguous repeated “more” labels.

#### 11. Final CTA

- **Business goal:** Give users who reached the page end one clear next action.
- **User need:** Decide between shopping and consultation without searching the page again.
- **Content/data dependency:** Approved destination, capability state, concise verified copy, and optional background media.
- **Primary CTA:** Browse products by default; consultation may become primary only when the corporate workflow is operational and the page context supports it.
- **Empty-state rule:** Use the implemented catalog path and neutral approved copy; omit the block if no distinct value beyond the footer exists.
- **Mobile behavior:** Short copy, one full-width primary action, secondary link below.
- **Accessibility:** Heading and action remain readable against background, no motion dependency, descriptive link text.

#### 12. Full Footer

- **Business goal:** Close discovery loops, expose verified operating/legal information, and provide stable secondary navigation.
- **User need:** Find category/content/service/legal/contact/social destinations and understand the public identity.
- **Content/data dependency:** Capability-filtered link groups and individually verified business, contact, legal, copyright, social, and newsletter values.
- **Primary CTA:** No promotional primary CTA; the strongest utility link follows user context. Newsletter appears only when operational/legal requirements are met.
- **Empty-state rule:** Omit each unverified group/value without placeholder labels, `#` links, generic trust marks, or empty headings.
- **Mobile behavior:** Identity first, then accessible disclosure groups or stacked headings; legal links remain visible and do not disappear inside a menu.
- **Accessibility:** Named footer landmark, semantic lists/headings, descriptive social names, visible focus, no icon-only unidentified links.

## 4. Header and Navigation Specification

### 4.1 Sticky Behavior

- The primary header becomes sticky only after measurement confirms it does not obscure content or focused controls.
- Resting and scrolled states use the same information architecture. The scrolled state may reduce vertical padding but must retain identity, search access, menu access, cart, and account when those actions are implemented.
- Use a quiet opaque/near-opaque surface and divider or soft functional elevation. Do not rely on blur over busy media for legibility.
- Provide an offset for anchored/focused content and avoid layout shift when the sticky state activates.
- On downward mobile scroll, optional compaction is allowed; essential actions cannot disappear without an obvious return behavior.

### 4.2 Prominent Search

- Desktop search is visually prominent in the first header row or an immediately adjacent search row.
- Mobile exposes a labelled search control in the sticky bar and a full-width search field when activated.
- Search must not render until an implemented, capability-approved search route/API exists.
- Future search behavior must specify Persian normalization, keyboard submission, loading, no-results, error, recent-query privacy, suggestion source, and analytics consent.
- Suggestions never fabricate availability or mix unpublished items. The field requires a persistent label or programmatic name, a visible focus indicator, and correct combobox semantics if autocomplete is introduced.

### 4.3 Multi-Level Category Navigation

- Desktop may use a two-level mega menu: primary browse groups, then active categories/collections. A third level is allowed only when usability testing proves it necessary.
- The menu is config/API-driven and capability-filtered. It cannot contain hard-coded category claims or links in a shared component.
- Open by explicit click/tap; hover may preview but is never the only mechanism.
- Keyboard: trigger enters submenu, arrow behavior follows the chosen documented menu/disclosure pattern, Escape closes, and focus returns to trigger.
- Pointer intent delay prevents accidental closure while crossing columns. Transitions remain short and do not delay navigation.
- Category imagery is optional and may appear only with approved media and a valid destination.

### 4.4 Required Direct Paths

The future header model must support direct paths for:

- corporate gifts;
- luxury products/collections;
- gifts by budget;
- articles/buying guides; and
- contact/consultation.

These are information-architecture targets, not approved routes. Each remains hidden until its route, capability, localized label, data source, empty/error states, and ownership are implemented. “Gifts by budget” additionally requires an authoritative pricing/currency model; static price bands are prohibited.

### 4.5 Cart and Account

- Cart appears only when the public cart capability is publishable. It uses a labelled icon/action and an authoritative item-count state; no fabricated count.
- Account appears only when the account route and authentication/customer flow are implemented. Signed-out and signed-in states must be explicit and privacy-safe.
- Cart/account cannot be represented as dead icons. Loading and errors must not expose internal identifiers or raw server codes.
- Icons preserve 44×44px targets, visible focus, accessible names, and locale-aware counts.

### 4.6 Mobile Navigation

- Use an accessible full-height drawer or bounded sheet with one level visible at a time; the final choice belongs to WO-043B interaction validation.
- Preserve a clear close control, Escape behavior, focus trap while modal, focus restoration, scroll lock, and browser Back behavior where appropriate.
- Nested categories provide a labelled Back action and retain parent context.
- Search appears before long navigation groups. Corporate/contact links may be placed in a distinct utility group only when operational.
- Do not hide core navigation behind gestures or rely on hover.

## 5. Product-Card and Campaign Rules

### 5.1 Card Content Priority

The card hierarchy is: media → category/context → product name → verified price/offer state when authorized → restrained metadata → action affordance. Cards should remain product-led, not badge-led. Entire-card links are acceptable when there are no nested controls; future save/compare/cart actions require a revised interaction contract.

### 5.2 Label Eligibility

| Label | Valid source | Required guard |
| --- | --- | --- |
| New | Authoritative publish/available date plus an approved rolling eligibility window | Automatically expires; cannot be manually left on indefinitely |
| Special | Active authorized campaign and valid price/benefit relationship | Start/end/audience/terms verified; disappears on invalid or expired state |
| Luxury / VIP | Approved public product-level/collection semantics or authorized editorial curation | Meaning and membership approved; internal enum alone does not authorize public copy |
| Manager recommendation | Authorized editorial decision with product, editor/role, reason, approval, and effective dates | Expires/reviews on schedule; never inferred from sales or hidden scoring |

Label rules:

- Maximum one dominant and one secondary label per card; define deterministic priority before implementation.
- Labels must be visible text and included in useful assistive context.
- Never infer a discount from missing/zero base price, present an arbitrary crossed-out price, or round a percentage deceptively.
- Never show false countdowns, false scarcity, stock-pressure copy, fabricated popularity, fake reviews, unverified awards, fake social proof, or generic authenticity badges.
- “Only N left” is excluded unless a future work order proves an authoritative inventory contract, reservation semantics, update latency, and ethical wording.

### 5.3 Campaign Governance

Every public campaign requires an ID, status, owner, approved copy/media, audience, eligible destinations/items, timezone, start/end instants, terms reference, price/benefit source, fallback/expiry behavior, and approval record. Server-authoritative eligibility controls rendering; client time alone cannot make a campaign valid.

Expired or invalid campaigns fail closed: remove the label, pricing treatment, section, banner, and popup. Do not silently redirect an expired campaign CTA to unrelated content.

## 6. Popup Framework Specification

### 6.1 Allowed Purposes

Only these purposes are eligible:

1. current corporate catalogue;
2. real active campaign;
3. verified discount with authoritative eligibility/terms; or
4. consultation request through an operational workflow.

No generic newsletter popup, spin-to-win, fake reward, immediate interruption, or urgency overlay is approved.

### 6.2 Eligibility and Triggering

- Default delay: 18 seconds, configurable only within 15–20 seconds.
- Desktop may use exit intent as an alternate trigger; whichever eligible trigger occurs first wins.
- Mobile has no exit-intent assumption and uses the approved delay only.
- Maximum one popup impression per browser session across all purposes. Priority is explicit in configuration; simultaneous campaigns do not queue.
- Persist impression and dismissal for the session using a privacy-reviewed session mechanism. Do not use fingerprinting.
- Never trigger during an open menu/cart/dialog, form interaction, checkout-like flow, reduced-attention error state, or before consent where applicable.

### 6.3 Configuration Contract

Each popup needs:

- stable ID/version and allowed purpose;
- approval/status and content owner;
- localized title/body/action/close label;
- verified destination or form workflow;
- start/end timestamps and timezone;
- page include/exclude rules;
- device targeting;
- audience/eligibility rule;
- delay or desktop exit-intent permission;
- priority and one-per-session frequency policy;
- approved media/alt behavior;
- analytics event mapping and consent classification;
- explicit expired/invalid fallback of “do not render.”

### 6.4 Desktop and Mobile Presentation

- Desktop uses a bounded modal/dialog with restrained width and one primary action.
- Mobile uses an accessible bottom sheet, never a cramped centered modal. It respects safe-area insets and leaves context visible where possible.
- The close control is visible, labelled, reachable first or immediately after the title, and at least 44×44px.
- Dismissal is never hidden, delayed, low-contrast, or blocked by animation.

### 6.5 Accessibility and Motion

- Use native dialog semantics or a proven accessible dialog primitive with an accessible name and description.
- Move focus into the popup, trap it while open, close on Escape, restore focus to the logical trigger/context, and prevent background interaction.
- Announce validation errors without moving users unexpectedly.
- Reduced-motion mode removes sheet travel/scale and uses an immediate or short opacity change.
- Popup operation cannot depend on hover, fine pointer, or animation.

### 6.6 Analytics Events

Eligible events are `popup_eligible`, `popup_impression`, `popup_dismiss`, `popup_primary_action`, `popup_form_start`, `popup_form_submit_success`, and `popup_form_submit_error`. Event payloads use IDs and controlled enums only; they contain no free-text form input, contact details, or sensitive customer data.

## 7. Motion and Interaction Specification

### 7.1 Motion Language

- Reveal-on-scroll: subtle opacity/translate for editorial blocks, once per view; content remains present and readable if JavaScript fails.
- Product image hover: maximum small scale/crop change without moving card geometry; focus receives an equivalent non-motion cue.
- Menus: soft opacity/position transition with immediate interactivity and no delayed navigation.
- Hero: optional low-amplitude texture/light movement only when asset rights, contrast, performance, and reduced-motion behavior pass review.
- Pressed, loading, success, and error states are clear but restrained.

Prohibited motion includes auto-advancing carousels, scroll hijacking, parallax required for comprehension, continuous ornamental loops near reading content, cursor trails, bouncing CTAs, confetti for routine actions, and large page-transition choreography.

### 7.2 Timing and Reduced Motion

- Micro-interactions: approximately 120–180ms.
- Menus/sheets: approximately 180–240ms.
- Editorial reveal: approximately 250–400ms.
- Use standard easing and transform/opacity where practical. Never delay action completion to finish animation.
- Under `prefers-reduced-motion: reduce`, remove non-essential movement, disable ambient hero motion and smooth scrolling, avoid scale/translate, and preserve state changes through immediate visual cues.

### 7.3 Performance Budget

These are project acceptance budgets for the future implementation, measured on agreed representative mobile hardware/network and real content:

- LCP at or below 2.5s at the 75th percentile.
- INP at or below 200ms at the 75th percentile.
- CLS at or below 0.1 at the 75th percentile.
- No homepage interaction or reveal requires a heavy animation library.
- Visual-enhancement JavaScript target: at most 50KB compressed beyond essential application behavior, subject to bundle evidence.
- The initial hero uses a responsive still image; no autoplay video is approved. The selected mobile hero derivative target is at most 250KB unless measured visual QA documents an exception.
- Below-the-fold images lazy-load; dimensions/aspect ratios are reserved; animation uses compositor-friendly properties where possible.

Performance budgets must be tested, not assumed from source size. A visual flourish that breaks a budget is removed or simplified.

## 8. Footer Specification

### 8.1 Structure

The full footer may contain:

1. approved identity and concise brand description;
2. product/category links;
3. corporate gifting/service links;
4. article/guide links;
5. verified contact/business information;
6. legal/privacy/terms/returns links;
7. verified social profiles;
8. newsletter only when consent, delivery, ownership, and privacy requirements are operational; and
9. verified legal name/copyright.

### 8.2 Verification Rules

- Every destination must resolve to an implemented route; no `#`, placeholder, or “coming soon” links.
- Phone, email, address, operating hours, registration data, copyright owner, and legal name are individually optional until verified.
- Social icons render only for verified official accounts with descriptive accessible names.
- Trust marks, licenses, certifications, association logos, guarantees, and payment/shipping claims require evidence and approved usage rights.
- Newsletter requires a real subscription service, double-opt-in/consent policy where required, success/error states, unsubscribe process, privacy notice, and operating owner.
- Legal links cannot be invented from generic templates and cannot be hidden on mobile.

## 9. International UX and Conversion Principles

### 9.1 Cognitive Load Reduction

- One primary purpose per section and one dominant CTA.
- Limit visible top-level choices; group deeper categories behind progressive disclosure.
- Use stable patterns for cards, prices, labels, and actions.
- Remove inactive sections instead of showing empty promotional shells.

### 9.2 Visual Hierarchy and Choice Architecture

- Order content from orientation to trust, discovery, merchandising, corporate intent, evidence, learning, and final action.
- Default recommendations must be explainable and editorially authorized, not disguised paid placement.
- Give users a clear path to all products alongside curated paths.
- Preserve choice: consultation CTAs do not block self-service product discovery.

### 9.3 Trust Before Conversion

- Present verified identity, process, service terms, price/offer basis, and privacy context before requesting commitment.
- Explain consultation expectations before collecting contact information.
- Never imply certification, authenticity, availability, delivery, return rights, or international service without approved operational evidence.

### 9.4 Transparent Price and Offer Information

- Format currency and numerals through approved locale-aware utilities.
- Show current price, previous/reference price, discount, eligibility, and terms only from authoritative data.
- Avoid “from” prices unless the selectable configuration and minimum purchasable price are clear.
- Preserve bidirectional isolation for numeric/currency content in Persian text.

### 9.5 Mobile-First Usability

- Search, category discovery, readable product information, and primary actions are usable with one-column flow and touch targets.
- No important information appears only on hover.
- Sticky controls remain compact and do not cover form errors or browser UI.
- Forms use correct input types, labels, autocomplete policy, error summaries, and logical keyboard order.

### 9.6 Deliberate Exclusions

- **Multiple sliders:** increase cognitive load, hide content, complicate keyboard/gesture use, and add media/JavaScript cost. The hero is static; product groups use grids or clearly signposted lists.
- **Immediate popups:** interrupt orientation, damage trust, and compete with navigation. Eligible popups wait 15–20 seconds or desktop exit intent and appear once per session.
- **Excessive banners:** create competing priorities and banner blindness. Only one active campaign narrative may dominate a page state.
- **Excessive colors:** weaken hierarchy and cheapen the luxury expression. Ivory, emerald, dark ink, and restrained gold/copper roles remain bounded.
- **Fake urgency:** misleads users and creates legal/reputational risk. No false countdown, scarcity, discount, popularity, review, or testimonial mechanism is permitted.

International readiness also requires locale-aware dates/numbers/currency, bidi-safe mixed content, translatable layouts, culturally reviewed language, and no assumption that an untranslated LTR route can be mirrored into Persian.

## 10. Implementation Handoff

### 10.1 Proposed Future Component Boundaries

These are design proposals, not authorization to create files or expand shared contracts:

| Boundary | Responsibility | Ownership rule |
| --- | --- | --- |
| `StorefrontHeader` / `DesktopNavigation` / `MobileNavigation` / `StorefrontSearchTrigger` | Shell composition and approved navigation/search variants | Storefront composes; neutral behavior may live in shared UI only if customer-free |
| `HomeSectionRenderer` | Exhaustive allowlisted section rendering in configured order | Storefront; unknown/duplicate/unsupported IDs rejected |
| `HomeHero` | One approved narrative, media art direction, CTA set | Storefront content/profile driven |
| `TrustStrip` | Small verified fact list | Storefront; evidence-backed content only |
| `VisualCategoryGrid` | API/config-driven active discovery destinations | Storefront domain component |
| `ProductRailOrGrid` | Shared presentation for new/campaign/luxury product datasets | Storefront; eligibility remains server/domain-owned |
| `CampaignSection` | Campaign context, terms, verified prices/products | Storefront; no campaign truth in UI code |
| `CorporateGiftingBanner` | Approved corporate CTA/content | Storefront and capability-gated |
| `StoryProcessSection` | Verified editorial/process content | Storefront/CMS boundary |
| `ArticlePreviewList` | Published article previews | Storefront/content API boundary |
| `FinalCta` | One contextual destination | Storefront content/profile driven |
| `StorefrontFooter` | Capability-filtered groups and verified optional facts | Storefront composition |
| `CampaignPopupHost` / accessible `Dialog` or `BottomSheet` | Eligibility orchestration and accessible overlay behavior | Storefront host; neutral primitive may be shared |
| `ProductCard` | Product media/name/context/authorized labels and commerce facts | Storefront catalog component; no raw persistence model |

### 10.2 Proposed Configuration and Content Data

| Contract | Minimum fields |
| --- | --- |
| Home section descriptor | `id`, `kind`, `enabled`, `requiresCapabilities`, `contentKey`, `dataSourceKey`, `variantId`, `analyticsId` |
| Localized section content | locale, eyebrow/title/body, CTA labels/destinations, media descriptor, approval/provisional field list |
| Media descriptor | asset ID, rights/approval state, alt, decorative flag, aspect ratio, focal point per breakpoint, responsive derivatives |
| Navigation | ID, localized label, destination, children, target, capability requirements, visibility/order |
| Product list request | source kind, eligibility/filter key, sort, bounded item count, empty behavior; no arbitrary query strings from content |
| Product label | controlled type, source/decision ID, effective dates, public wording, approval |
| Campaign | ID/version/status, purpose, audience, eligibility, products/destination, copy/media, benefit/price source, terms, start/end/timezone, owner, approval |
| Popup | campaign reference, allowed trigger, 15–20s delay, page/device rules, priority, one-per-session, presentation, event mapping |
| Corporate CTA | capability, route/form ID, service copy, consultation owner/SLA, privacy reference, catalogue asset/version |
| Verified public fact | value, category, source, owner, approved by/date, review/expiry date, locale |
| Analytics metadata | controlled event name, placement ID, section/campaign/content IDs, consent class; no free-text PII |

Configuration is validated server-side/build-time against allowlists. It never accepts raw JSX, HTML, CSS, classes, code, arbitrary remote URLs, capability activation, or database queries.

### 10.3 Suggested Analytics Events

| Area | Events | Minimum safe context |
| --- | --- | --- |
| Navigation/search | `nav_open`, `nav_select`, `search_open`, `search_submit`, `search_no_results` | placement, item/category ID, query length or normalized privacy-approved value—not raw sensitive text |
| Homepage sections | `home_section_view`, `home_cta_select` | section ID, content/campaign version, placement |
| Product discovery | `product_list_view`, `product_select`, `product_label_view` | list/source ID, product public ID/slug, position, authorized label type |
| Corporate gifting | `corporate_cta_select`, `consultation_start`, `consultation_submit_success`, `consultation_submit_error`, `catalogue_download` | CTA/form/catalogue version; never contact details |
| Content | `article_select`, `story_select` | public content ID, placement |
| Popup | events defined in Section 6.6 | popup/campaign ID, purpose, trigger, page/device class |

Analytics must avoid duplicate impressions during hydration/re-render, document viewability rules, respect consent/legal policy, and be testable without transmitting personal data.

### 10.4 Acceptance Criteria by Future Work Order

#### WO-043B — Visual Foundation and Storefront Shell

- Approved/provisional token status is explicit; final palette state matrix passes required contrast.
- Licensed Persian fonts or the approved fallback pass Persian/Latin/numeral rendering and loading tests.
- Header, search affordance, capability-filtered multi-level navigation, mobile menu, and footer meet keyboard, focus, zoom, RTL, and responsive criteria.
- Fardad values remain app-owned; shared packages remain neutral.
- No dead routes or unimplemented capabilities become visible.
- Logo/contact/legal/social/newsletter content is omitted unless verified.
- Measured shell performance and layout-shift budgets pass.

#### WO-043C — Fixed Homepage Foundation

- The exact configured order remains `hero → features → categories`.
- Hero, trust/features, and visual categories consume validated configuration/data and approved media.
- Hero has dedicated mobile art direction and no carousel.
- Features render only verified facts; categories render only valid destinations.
- Empty/error/loading behavior is intentional and accessible.
- Section landmarks/headings, focus order, 320px reflow, 200% zoom, and reduced-motion behavior pass.

#### WO-043D — Merchandising, Corporate, Story, Content, and Final CTA

- New, campaign, luxury/VIP, corporate, story/process, articles, and final CTA sections appear only after Categories and only with publishable capabilities/data.
- Product labels and campaign prices pass source/effective-date/expiry validation.
- Corporate consultation and catalogue paths are operational, privacy-reviewed, and capability-gated.
- Story/claim content has evidence and approved rights.
- Articles are published records with valid routes.
- Missing datasets omit their sections without breaking hierarchy or creating empty promotional shells.

#### WO-043E — Popup, Motion, Analytics, Performance, and Experience QA

- Popup supports only the four approved purposes, 15–20s/desktop-exit triggers, one-per-session persistence, targeting, dates, priority, and fail-closed expiry.
- Desktop dialog and mobile bottom sheet pass keyboard, focus trap/return, Escape, close-target, screen-reader, zoom, and reduced-motion tests.
- Motion stays within approved patterns and performance budgets; the experience remains complete with motion/JavaScript unavailable.
- Analytics match the controlled taxonomy, respect consent, avoid PII, and prevent duplicate events.
- Representative mobile/desktop performance meets Section 7.3 budgets with production-like content.
- Cross-browser RTL, bidi, touch, keyboard, screen-reader, forced-color, and responsive regression evidence is recorded.

### 10.5 Required Fardad Assets and Decisions Before Final Production Styling

Fardad must provide or approve:

1. Final logo files/variants, usage rights, clear space, minimum size, monochrome/reversed behavior, and favicon/app-icon set.
2. Brand palette and complete accessible state matrix, including decision on the provisional ivory/emerald/gold/copper direction.
3. Licensed Persian and Latin font families/files, permitted weights, web redistribution rights, fallback, numerals, and performance policy.
4. Rights-cleared hero, product, category, collection, packaging, process, and corporate-gifting imagery with masters, crops/focal points, alt-text ownership, and expiry restrictions.
5. Final Persian brand voice, homepage copy, CTA labels, category naming, corporate copy, article excerpts, and SEO copy.
6. Verified legal name, public business/contact information, canonical domain, copyright owner, privacy/terms/returns content, and contact operating ownership.
7. Verified official social accounts and newsletter decision, consent/legal basis, provider, and operating owner.
8. Product/category/collection data ownership, “new” window, luxury/VIP semantics, manager-recommendation governance, sort/curation rules, and minimum viable section counts.
9. Campaign/offer governance: price authority, currency, terms, audience, timezone, approval roles, expiry, and prohibited claims.
10. Corporate gifting service scope, implemented route/form, consultation owner and response expectation, privacy handling, CRM destination, and approved current catalogue.
11. Evidence and exact approved wording for authenticity, craft, material, provenance, service, warranty, delivery, or other public claims.
12. Popup purpose priorities, page/device targeting, session policy confirmation, approved campaigns, consent classification, and analytics owner.
13. Analytics taxonomy/consent/retention approval and performance-test devices/network/content fixtures.
14. Owner approval of the exact homepage order, component direction, responsive behavior, and WO-043B–WO-043E sequencing.

## 11. Approval Gate

WO-043A is complete as a specification when its two documentation files pass Markdown/Git hygiene checks. It does not approve implementation.

Before WO-043B begins, the owner/CTO must approve:

- the provisional visual direction and which values may advance to implementation;
- the fixed/future homepage order;
- the app-owned versus neutral shared ownership model;
- the proposed work-order split;
- the verified-content fail-closed policy;
- the assets/decisions available for WO-043B; and
- any route, capability, analytics, popup, or public-data contract separately required by that scope.

