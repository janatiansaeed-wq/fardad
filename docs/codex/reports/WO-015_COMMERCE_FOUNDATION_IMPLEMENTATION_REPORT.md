# WO-015 Multi-Store Money, Offer, Availability, and Guest Cart Foundation Implementation Report

- Date: 2026-07-20
- Branch: `architecture-refactor`
- Entry commit: `332564c` (`Add commerce foundation architecture review`)
- Status: **READY FOR HUMAN REVIEW AND SCOPED COMMIT**; the direct Cart mutation security correction and repeated live PostgreSQL/HTTP matrix passed

## Implementation Summary

WO-015 is implemented within the approved WO-014 boundary:

- persisted `Store` is the first commerce/security partition;
- `COMMERCE_STORE_KEY` is server-derived and active-Store resolution fails closed;
- shared Money uses canonical decimal integer strings with literal `IRR`;
- API arithmetic uses native BigInt with strict IRR parsing, exact Toman conversion, and overflow rejection;
- store-scoped, versioned, effective-dated `ProductOffer` supports `ONLINE`, `PRICE_HIDDEN`, and `INQUIRY_ONLY`, with only positive-price online/available offers cartable;
- guest Cart uses a 256-bit opaque token, SHA-256 digest at rest, bounded expiry, exact quote snapshots, line equivalence, optimistic revision, idempotent mutations, serializable transactions, and append-only audit events;
- the approved purchasing-option and guest-Cart API endpoint families are present;
- Storefront access is server-only, uses a Secure/HttpOnly/SameSite Lax host-only cookie, validates mutation origin, and keeps the API origin out of browser code;
- every Cart mutation now requires a short-lived, replay-protected Commerce BFF HMAC proof in addition to the existing Storefront same-origin check;
- no commerce UI, checkout, Order, Payment, inventory, or capability publication was added.

The implementation does not modify `PublicProductCard` or `PublicProductDetail`. It exports the exact existing public lifecycle predicate for reuse and leaves `ProductDataQualityService` unchanged.

## Entry Gate and Repository State

The mandatory gate passed before implementation:

| Check            | Result                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Active branch    | `architecture-refactor`                                                                                             |
| HEAD             | `332564c (HEAD -> architecture-refactor, origin/architecture-refactor) Add commerce foundation architecture review` |
| Initial worktree | clean                                                                                                               |
| WO-014 report    | tracked and committed at `332564c`                                                                                  |

The binding WO-014 and WO-013 reviews, current Prisma schema, public catalog lifecycle/readiness boundary, feature profile, Storefront server-only client pattern, environment validation, and project test/build conventions were inspected before source changes.

The final runtime-validation continuation began from the same branch and commit with exactly the expected uncommitted WO-015 tree: 49 paths, comprising 10 modified tracked paths and 39 untracked paths. No staged, deleted, renamed, or unrelated path was present. Those paths were recorded before Docker or database access.

## Runtime Host Repair

The installed and locked Nest runtime resolved `@nestjs/common` and `@nestjs/core` to `11.1.28`; `@nestjs/jwt` resolved to `11.0.2` and `@nestjs/passport` to `11.0.5`. The missing adapter was added as exact `@nestjs/platform-express` version `11.1.28`, matching both core runtime packages at the complete major/minor/patch version. No other package was added or deliberately upgraded.

The dependency was added through Corepack-verified pnpm `10.0.0`, the version pinned by the workspace. Corepack used a generated temporary directory outside the repository, which was removed in a `finally` block. The package manager updated `apps/api/package.json`, `pnpm-lock.yaml`, and ignored `node_modules`; lockfile content was not manually fabricated. The lockfile now records the platform adapter and its Express runtime dependency graph, and the installed `common`, `core`, and `platform-express` versions all report `11.1.28`.

## Direct Cart Mutation Threat and Fix

The prior live matrix proved that a caller possessing a Cart token could send Cart mutations directly to the API and that forged `Origin` or Host values did not stop the mutation. Origin and Host are request metadata, not authentication credentials: a non-browser caller can choose them. They therefore remain useful contextual checks but cannot be the sole authorization proof.

The correction adds one narrowly scoped server-to-server proof shared only by the API runtime and Storefront server runtime:

- `COMMERCE_BFF_SHARED_SECRET` is required by API environment validation at a minimum of 32 characters/bytes and is checked by the Storefront server helper at a minimum of 32 UTF-8 bytes;
- both `.env.example` files document generation of a unique deployment value; no value is prefixed with `NEXT_PUBLIC_`;
- the exact internal headers are `x-fardad-commerce-bff-timestamp`, `x-fardad-commerce-bff-nonce`, and `x-fardad-commerce-bff-signature`; they are generated by the Storefront server client and never accepted from browser intent;
- the secret is never placed in a public contract, browser module, cookie, response, log, report value, or client bundle;
- no dependency was added for this correction; Node's built-in cryptography is used.

For each mutation, the Storefront server-only client creates a versioned HMAC-SHA-256 signature over the uppercase HTTP method, exact route-relative path, actual API target Host, SHA-256 Cart-token digest, exact `If-Match`, exact idempotency key, SHA-256 request-body digest, issued-at timestamp, and a random 128-bit nonce. The API requires the timestamp, nonce, and signature headers, accepts only a 60-second clock window, compares the decoded HMAC using `timingSafeEqual`, and rejects nonce replay within that window. The in-memory nonce cache is bounded by the same short lifetime; like the existing rate limiter, a horizontally scaled deployment still requires an approved shared edge/distributed control.

The proof is verified before Cart token/header parsing, rate limiting, repository access, or `CartService` mutation. The API also rejects any browser `Origin` header before mutation, while the actual Host header is cryptographically bound to the proof, so changing Host invalidates the signature. Storefront Server Actions retain their existing same-origin Origin/Host/protocol check and forward only server-generated proof headers. Reads remain on the existing safe token-only boundary because they do not mutate state. All proof failures return the same generic HTTP 403 `Commerce request forbidden` response.

## Exact Files Changed and Rationale

### Workspace and package wiring

- `.gitignore` — ignores generated `.test-dist` output from dependency-free TypeScript unit tests.
- `apps/api/package.json` — adds built-in Node test execution, the compiled Store bootstrap operator command, and exact `@nestjs/platform-express@11.1.28` for the Nest HTTP runtime.
- `apps/storefront/package.json` — adds the built-in Node structural-boundary test command; no dependency change.
- `pnpm-lock.yaml` — package-manager-generated lock entries for the exact Nest Express adapter and its required runtime dependency graph.
- `packages/types/src/index.ts` — exports the new framework-independent commerce contracts.
- `packages/types/src/commerce.ts` — adds Money, purchasing-option, Cart, mutation-intent, and safe public error-code contracts.

### Environment and application composition

- `apps/api/.env.example` — documents server-only `COMMERCE_STORE_KEY=fardad` and the minimum-32-byte Commerce BFF secret.
- `apps/storefront/.env.example` — documents the matching server-only Storefront binding and non-public Commerce BFF secret.
- `apps/api/src/config/env.validation.ts` — requires a normalized, bounded commerce Store key and a minimum-32-character Commerce BFF secret.
- `apps/api/src/app.module.ts` — mounts the dedicated Commerce module.
- `apps/api/src/public-catalog/public-catalog.repository.ts` — exports the existing lifecycle predicate without changing its logic so commerce can reuse it exactly.

### Prisma and migration

- `apps/api/prisma/schema.prisma` — adds ten commerce enums; `Store`, `ProductOffer`, `Cart`, `CartLine`, `CartMutationRecord`, and `CommerceAuditEvent`; and relation-only Product fields.
- `apps/api/prisma/migrations/20260720020000_add_store_offer_guest_cart_foundation/migration.sql` — additive SQL migration with named checks, composite Store foreign keys, exact BigInt bounds, digest-length constraints, and the partial unique active-Offer index.

### API commerce implementation

- `apps/api/src/commerce/commerce.module.ts` — dedicated module ownership.
- `apps/api/src/commerce/index.ts` — controlled module exports.
- `apps/api/src/commerce/money.ts` — strict canonical IRR parser, Toman conversion, mapper, and overflow-safe arithmetic.
- `apps/api/src/commerce/cart-token.ts` — 256-bit token/reference generation, grammar validation, SHA-256 digests, and safe digest formatting.
- `apps/api/src/commerce/cart-policy.ts` — quote/expiry/totals/equivalence/fingerprint/idempotency/revision policies.
- `apps/api/src/commerce/commerce-errors.ts` — generic public error boundary and approved safe codes.
- `apps/api/src/commerce/commerce-rate-limit.service.ts` — bounded per-process Store/token/IP rate buckets using Nest HTTP semantics.
- `apps/api/src/commerce/commerce-bff-proof.service.ts` — verifies method/path/Host/token/header/body-bound HMAC proofs with a 60-second timestamp window, timing-safe comparison, Origin rejection, and nonce replay protection.
- `apps/api/src/commerce/commerce.repository.ts` — Store-scoped active Store and effective Offer queries using the exact public Product lifecycle predicate.
- `apps/api/src/commerce/store-context.service.ts` — startup active-IRR Store resolution from server environment; missing/inactive/mismatched state fails closed.
- `apps/api/src/commerce/commerce.service.ts` — Product readiness reuse, safe purchasing-option mapping, and cartability checks.
- `apps/api/src/commerce/offer-management.service.ts` — internal version allocation, validation, serializable activation, predecessor deactivation, and audit insertion; no public write route.
- `apps/api/src/commerce/cart.repository.ts` — token-digest ownership reads, Store-scoped mutation lookup, and audited lazy expiry.
- `apps/api/src/commerce/cart.service.ts` — create/resolve, safe reads, exact quote mutation, re-quote, expiry, revision guard, idempotency, Store-scoped serializable transaction, audit, and non-disclosing availability behavior.
- `apps/api/src/commerce/public-commerce.controller.ts` — approved purchasing-option endpoint.
- `apps/api/src/commerce/public-cart.controller.ts` — approved Cart endpoints, pre-mutation BFF proof enforcement, header validation, private/no-store responses, rate limits, and server-derived request IDs.
- `apps/api/src/commerce/bootstrap-store.ts` — fixed idempotent operator bootstrap for `fardad` / `fardad-production`; it refuses to overwrite drifted existing Store state.
- `apps/api/src/commerce/dto/add-cart-line.dto.ts` — allowlisted Product slug and quantity intent.
- `apps/api/src/commerce/dto/set-cart-line-quantity.dto.ts` — allowlisted quantity intent.
- `apps/api/src/commerce/dto/cart-line.params.dto.ts` — opaque 128-bit line-reference grammar.
- `apps/api/src/commerce/dto/purchasing-option.params.dto.ts` — normalized public Product slug grammar.

### API tests

- `apps/api/tsconfig.test.json` — isolated dependency-free TypeScript test compilation.
- `apps/api/test/setup-env.cjs` — non-secret test-only environment required by existing eager API environment validation.
- `apps/api/test/commerce-migration-structure.test.cjs` — additive migration, constraint, composite Store scoping, concurrency/audit, and bootstrap structural assertions.
- `apps/api/test/unit/money.spec.ts` — canonical parsing, Toman conversion, mapping, and overflow.
- `apps/api/test/unit/cart-policy.spec.ts` — token/digest, expiry, exact totals, equivalence, fingerprint, revision, and request digest.
- `apps/api/test/unit/commerce.service.spec.ts` — public Offer mapping, hidden/inquiry behavior, readiness non-disclosure, and cartability.
- `apps/api/test/unit/offer-policy.spec.ts` — price, window, quantity, and non-cartable mode validation.
- `apps/api/test/unit/store-context.spec.ts` — configured Store resolution and fail-closed missing/inactive/non-IRR cases.
- `apps/api/test/unit/cart.service.spec.ts` — opaque ownership, safe response shape, expiry, revision conflict, and idempotent replay/conflict.
- `apps/api/test/unit/rate-limit.spec.ts` — scoped limiting and reset behavior.
- `apps/api/test/unit/commerce-bff-proof.service.spec.ts` — valid, absent, invalid, stale, future, replayed, Origin-bearing, and Host-mismatched proof behavior.
- `apps/api/test/unit/public-cart.controller.spec.ts` — proves rejected proof stops rate limiting and Cart service mutation.
- `apps/api/test/commerce-bff-structure.test.cjs` — proves all five mutation routes enforce the proof and that no proof field enters public contracts.

### Storefront server boundary and tests

- `apps/storefront/src/lib/api/public-commerce.ts` — server-only purchasing-option and Cart HTTP client, safe typed failures, `no-store`, canonical mutation bodies, revision/idempotency headers, and per-request BFF proof forwarding.
- `apps/storefront/src/lib/commerce/commerce-config.ts` — fail-closed Fardad deployment binding and server-only secret-length validation.
- `apps/storefront/src/lib/commerce/commerce-bff-proof.ts` — generates short-lived HMAC proofs with a random 128-bit nonce using only server-side Node APIs.
- `apps/storefront/src/lib/commerce/cart-cookie.ts` — exact `__Host-fardad-cart` policy and 256-bit token creation.
- `apps/storefront/src/lib/commerce/cart-actions.ts` — same-origin Server Actions, opaque cookie lifecycle, server-generated mutation idempotency, and no UI.
- `apps/storefront/src/lib/commerce/cart-session.ts` — server-only current-Cart reader from the HttpOnly cookie.
- `apps/storefront/test/commerce-boundary.test.mjs` — API-origin/proof secrecy, server-only HMAC structure, cookie controls, no public internal fields, unchanged catalog contracts, unchanged capability publication, and absent visible Cart route.

The only new declared dependency is `@nestjs/platform-express@11.1.28`; no unrelated package manifest was changed and no unrelated package was added.

## Migration and Schema Rationale

### Store boundary

`Store` owns Store policy and is directly referenced by every new commerce aggregate/audit record. Tenant and Merchant are not present. Store identity never appears in public DTOs or route/query parameters. `Product` stays Store-neutral and receives only Prisma relation fields.

### Money

All persisted amounts use PostgreSQL `BIGINT` / Prisma `BigInt`. `CommerceCurrency` contains only `IRR`. Public Money serializes amount as a canonical base-10 integer string. The application ceiling is `9_000_000_000_000_000_000` IRR. Toman is converted by multiplication with exactly `10n`; it is not stored.

### Offer

Offer version uniqueness is `(store_id, product_id, version)`. A PostgreSQL partial unique index permits one `ACTIVE` Offer per Store/Product. Activation deactivates the predecessor first inside a serializable transaction. Effective windows are half-open: start inclusive, end exclusive. Only `ONLINE + AVAILABLE_TO_ORDER + positive IRR price` is cartable.

### Cart

Cart and Offer are joined through composite `(id, store_id)` references. Token, equivalence, quote, idempotency, and request digests have fixed 32-byte checks. Monetary checks use exact integers and a numeric cast for line multiplication so the constraint cannot overflow during comparison. Mutation state, line changes, aggregate quote, audit insertion, and idempotency record commit atomically.

### Additive posture

The migration creates empty enums/tables/indexes/constraints only. It does not alter an existing Product column, rewrite existing rows, derive offers from Product Experience prices, drop data, or backfill commerce state.

## Safe Rollout and Rollback Posture

Recommended rollout order:

1. Back up and validate the target environment under the normal operator procedure.
2. Apply the reviewed additive migration in an approved non-production environment.
3. Build/deploy the API with `COMMERCE_STORE_KEY=fardad` only after Store bootstrap can run.
4. Run the idempotent Store bootstrap.
5. Load controlled ProductOffer data through an approved operator/internal procedure.
6. Validate purchasing-option and Cart endpoints, rate limiting, audit, expiry, concurrency, and Store isolation.
7. Deploy with commerce UI still unpublished.

Application rollback disables/unroutes the Commerce module/deployment while leaving additive tables intact. Existing public catalog behavior is independent. Destructive table/enum removal is not a routine rollback and requires a separately approved data-retention migration.

## Store Bootstrap Procedure

The command is intentionally fixed to Store key `fardad`, profile key `fardad-production`, active IRR status, 15-minute quote TTL, 30-day idle Cart TTL, 90-day absolute TTL, 50 lines, and 99 units per line.

After the migration has been applied to an explicitly approved database:

```powershell
$env:COMMERCE_STORE_KEY = "fardad"
$env:DATABASE_URL = "<approved database URL>"
pnpm.cmd --filter @fardad/api build
pnpm.cmd --filter @fardad/api commerce:bootstrap-store
```

First execution creates the Store and a Store-scoped `STORE_CREATED` audit event. Repeated execution is a no-op only when the record exactly matches the approved profile. Drift causes a failure instead of silently overwriting Store policy.

The approved disposable PostgreSQL continuation ran the fixed compiled command twice. Before the first run, the `fardad` Store count was `0`. After the first run, the database contained exactly one `fardad | fardad-production | Fardad | ACTIVE | IRR` Store with quote/idle/absolute TTLs `900 | 2592000 | 7776000`, limits `50 | 99`, and exactly one `STORE_CREATED` audit. After the second run, Store count, audit count, and Store version remained `1 | 1 | 1`; no policy field was overwritten.

## Public Contracts and Security Confirmation

- Existing `PublicProductCard` and `PublicProductDetail` shapes remain unchanged and informational.
- Separate commerce contracts expose only Product slug/presentation, lowercase safe modes/availability, Money, quantity limits, opaque line reference, revision, expiry, quote status, and safe Cart line snapshots.
- Responses do not contain Store ID/key, Product ID, Offer ID/version, token, token hash, equivalence key, quote fingerprint, request hash, audit event, Product readiness, Prisma enum, raw media/storage field, stock, inventory, or diagnostic lifecycle reason.
- Missing or non-ready Product behavior uses generic `Product not found`; Cart ownership uses generic `Cart not found`.
- `ProductDataQualityService.evaluate(product.id)` is reused unchanged.
- The exact existing public lifecycle/category predicate is reused by import; its logic was not duplicated or weakened.
- Guest token is 32 CSPRNG bytes encoded base64url; only its SHA-256 digest is persisted.
- Storefront cookie is `__Host-fardad-cart`, Secure, HttpOnly, SameSite Lax, Path `/`, no Domain, and 30-day sliding maximum age bounded by server expiry.
- Mutation request hashes include Store, token digest, operation, path reference, and normalized intent. Same key/different intent returns `IDEMPOTENCY_CONFLICT`.
- Cart queries and writes are Store-scoped, with composite database foreign keys preventing cross-Store line attachment.
- Cart responses are `private, no-store`; Storefront fetches are `cache: "no-store"`.
- Server Actions validate browser Origin/Host/protocol before calling the server-only API client.
- Every Cart mutation requires a valid server-only Commerce BFF HMAC proof; direct token possession and forged Origin/Host headers are insufficient.
- Proof material binds method, path, API Host, Cart-token digest, mutation headers, body digest, timestamp, and nonce; it is not accepted outside its 60-second window or on nonce replay.
- The built Storefront browser-static assets contain no Commerce BFF environment name, header name, proof helper, or secret value.
- Rate limits are Store plus IP for creation/purchasing and Store plus token digest plus IP for Cart operations. Buckets are bounded and per API process.
- No raw token/hash or internal identifiers are logged by the implementation.

## API Endpoints Implemented

| Method and path                                                | Result                                        |
| -------------------------------------------------------------- | --------------------------------------------- |
| `GET /api/v1/public/commerce/products/:slug/purchasing-option` | safe `PublicPurchasingOption` or generic 404  |
| `POST /api/v1/public/cart`                                     | create/resolve using BFF-generated token; 204 |
| `GET /api/v1/public/cart`                                      | safe `PublicCart`; private/no-store           |
| `POST /api/v1/public/cart/lines`                               | add Product slug/quantity intent; 204         |
| `PATCH /api/v1/public/cart/lines/:lineReference`               | set quantity; 204                             |
| `DELETE /api/v1/public/cart/lines/:lineReference`              | remove line; 204                              |
| `POST /api/v1/public/cart/quote/refresh`                       | safe full re-quote; 204                       |

No Store selection, Offer selection, price, currency, total, owner, or internal identifier is accepted from browser intent.

## Tests and Validation Results

### Disposable Docker/PostgreSQL environment

| Property             | Runtime evidence                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Docker Desktop       | Engine `29.6.1`                                                                                                    |
| Image                | `postgres:16-alpine`, digest `sha256:57c72fd2a128e416c7fcc499958864df5301e940bca0a56f58fddf30ffc07777`             |
| PostgreSQL           | `16.14`                                                                                                            |
| Container            | Exactly `fardad-wo015-postgres`                                                                                    |
| Network exposure     | Exactly `127.0.0.1:54329 -> 5432/tcp`; port was bind-tested free before creation                                   |
| Data storage         | `/var/lib/postgresql/data` mounted as `tmpfs`; no named or persistent volume                                       |
| Database/credentials | Random one-use database, user, and password held only in process/container environment; no value written or logged |
| External resources   | No other container, image, volume, network, database, or Docker resource was inspected, stopped, or modified       |

No production, remote, shared, repository, `.env`, or user-provided database credential was used. The image did not exist locally; the specifically approved PostgreSQL 16 Alpine image was pulled. One Docker Hub TLS timeout occurred before the successful pull.

### Migration deployment and status

- Prisma migration status/deploy connected only to the loopback disposable database.
- All six reviewed repository migrations were applied in order. `_prisma_migrations` contained `20260720020000_add_store_offer_guest_cart_foundation` with `finished_at` set and no `rolled_back_at` value.
- A repeated `prisma migrate deploy` reported `No pending migrations to apply`.
- Final `prisma migrate status` reported `Database schema is up to date!` with six migrations found.
- No migration file or Prisma schema was edited during this continuation.

### Actual schema, constraint, and isolation results

The live PostgreSQL catalog contained all expected WO-015 structures: six tables, ten enums, 33 named check constraints, 22 explicit indexes, and eight foreign keys. The partial unique index was exactly on `(store_id, product_id) WHERE status = 'ACTIVE'`. PostgreSQL stored the two identifiers longer than 63 bytes using its standard truncation, while preserving their complete intended definitions.

| Runtime case                                                              | Result                                                        |
| ------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Negative online price                                                     | Rejected                                                      |
| Zero online price                                                         | Rejected                                                      |
| Offer minimum `0`, maximum below minimum, and maximum `1001`              | Rejected                                                      |
| Offer end equal to start                                                  | Rejected                                                      |
| Store absolute Cart TTL below idle TTL                                    | Rejected                                                      |
| Cart sliding expiry after absolute expiry                                 | Rejected                                                      |
| 31-byte Cart token, quote, line-equivalence, mutation-key/request digests | Rejected                                                      |
| CartLine quantity `0` and incorrect line subtotal                         | Rejected                                                      |
| Mutation expiry equal to creation                                         | Rejected                                                      |
| Second active Offer for the same Store/Product                            | Rejected; maximum active count per Store/Product remained `1` |
| Same Product active in a second Store                                     | Accepted, proving uniqueness is Store-scoped                  |
| CartLine attached to a Cart from another Store                            | Rejected by composite Cart foreign key                        |
| CartLine attached to an Offer from another Store                          | Rejected by composite Offer foreign key                       |
| Same token digest assigned across Stores                                  | Rejected                                                      |
| Same opaque line reference assigned across Stores                         | Rejected                                                      |
| Persisted cross-Store CartLine rows after all attempts                    | `0`                                                           |
| Configured Store resolving a token owned by another Store                 | Generic 404 through the compiled `CartService`                |
| Configured Store mutating another Store's opaque line reference           | Generic 404, with Cart revision and audit count unchanged     |

### Actual Offer, concurrency, idempotency, and audit results

The runtime harness was supplied in memory through `node -`; it created no repository or temporary script file and instantiated the compiled Prisma repositories/services unchanged.

| Runtime case                                          | Result                                                                                       |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Current effective online/available Offer              | Resolved with exact `125000 IRR` Money and approved quantity bounds                          |
| Future Offer start                                    | Purchasing option generic 404; Cart resolution `PRODUCT_UNAVAILABLE`                         |
| Expired Offer end                                     | Purchasing option generic 404; Cart resolution `PRODUCT_UNAVAILABLE`                         |
| Effective but `UNAVAILABLE` Offer                     | Safely mapped as unavailable and rejected for Cart                                           |
| Create/resolve same guest Cart token twice            | One Cart and one `CART_CREATED` audit                                                        |
| Same idempotency key and same request replay          | One logical effect; quantity stayed `1`, revision stayed `2`, one mutation and one audit     |
| Same idempotency key with different request           | `409 IDEMPOTENCY_CONFLICT`; no state change                                                  |
| Two concurrent quantity writes at expected revision 2 | Exactly one fulfilled and one `409 CART_REVISION_CONFLICT`; final revision `3`, quantity `2` |
| Lost-update check                                     | Passed; total matched exactly `125000 * 2`                                                   |
| Atomic audit/mutation correlation                     | Audit revisions exactly `1,2,3`; mutation revisions exactly `2,3`; no failed-mutation record |

### Actual compiled API startup and HTTP matrix

`node apps/api/dist/main.js` started with temporary process-only environment values and the disposable loopback database. Nest logged `Nest application successfully started`, TCP/HTTP readiness passed, and the real controller/service/repository stack handled the matrix. The process was stopped by exact PID in a `finally` block, both temporary stdout/stderr files were removed, and the temporary HTTP harness outside the repository was deleted.

| Live HTTP case                                           | Result                                                                  |
| -------------------------------------------------------- | ----------------------------------------------------------------------- |
| Missing Product purchasing option                        | PASS — generic HTTP 404                                                 |
| Cart create with absent proof                            | PASS — generic HTTP 403                                                 |
| Cart create with invalid signature                       | PASS — generic HTTP 403                                                 |
| Forged Origin and Host without proof                     | PASS — generic HTTP 403                                                 |
| Valid Storefront-equivalent BFF Cart create              | PASS — HTTP 204                                                         |
| Cart read                                                | PASS — HTTP 200 with `Cache-Control: private, no-store`                 |
| Malformed token read                                     | PASS — generic HTTP 400                                                 |
| Valid proof plus mismatched `Origin`                     | PASS — generic HTTP 403                                                 |
| Proof signed for API Host plus mismatched actual `Host`  | PASS — generic HTTP 403                                                 |
| Missing `If-Match` with otherwise valid proof            | PASS — generic HTTP 400                                                 |
| Invalid `If-Match` with otherwise valid proof            | PASS — generic HTTP 400                                                 |
| Missing idempotency key with otherwise valid proof       | PASS — generic HTTP 400                                                 |
| Valid proof, token, revision, and quote-refresh mutation | PASS — HTTP 204; revision advanced exactly once                         |
| Same idempotency key/request with fresh proof nonce      | PASS — HTTP 204 replay with one logical effect                          |
| Authenticated missing-Product add-line intent            | PASS — generic HTTP 422 `PRODUCT_UNAVAILABLE`; no state change          |
| Response and API-log non-disclosure scan                 | PASS — no secret/proof/internal ownership/audit/diagnostic data exposed |

The live database ended with exactly one Cart at revision `2`, zero Cart lines, one mutation record, and three audit events: one each for `STORE_CREATED`, `CART_CREATED`, and `CART_QUOTE_REFRESHED`. These exact counts prove the rejected proof, Origin, Host, malformed-header, and missing-Product requests produced no Cart line, revision, idempotency-record, or audit change. The valid refresh and its same-key/same-request replay produced one logical effect.

The Storefront boundary tests confirm that all five Server Actions retain `assertSameOriginMutation`, the API client and proof helper remain `server-only`, the Cart token remains in the Secure/HttpOnly host-only cookie, and the API origin/proof configuration does not enter browser code. The built `.next/static` tree contained no `COMMERCE_BFF`, `x-fardad-commerce-bff`, or `Commerce BFF` match.

### Commands and results

| Command/check                                                            | Result                                                                                         |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Docker name/port/image safety gate                                       | PASS                                                                                           |
| `docker pull postgres:16-alpine`                                         | PASS after one TLS-timeout retry                                                               |
| Restricted `docker run` with loopback port and tmpfs                     | PASS; health `healthy`                                                                         |
| Prisma `migrate status`, `migrate deploy`, repeated deploy, final status | PASS; six migrations current                                                                   |
| Fixed `commerce:bootstrap-store` twice                                   | PASS; first created Store/audit, second was exact no-op                                        |
| Live `pg_catalog` and negative SQL assertions                            | PASS                                                                                           |
| Compiled-service `node -` PostgreSQL harness                             | PASS for Offer, isolation, concurrency, idempotency, and audit matrix                          |
| API local `tsc --noEmit` / ESLint / Nest build                           | PASS                                                                                           |
| API test compilation and Node tests                                      | PASS, 32/32 including proof and controller short-circuit tests                                 |
| Storefront local typecheck / ESLint / Next production build / Node tests | PASS, 4/4 tests                                                                                |
| Admin local typecheck / ESLint / Next production build                   | PASS                                                                                           |
| `config`, `types`, `ui`, and `utils` local typechecks                    | PASS                                                                                           |
| Workspace Turbo aggregate invocation                                     | Environment-only failure: Turbo selected global pnpm `11.13.0`, which rejected pinned `10.0.0` |
| Pinned pnpm 10 recursive workspace typecheck / lint / build              | PASS across all seven active workspace packages                                                |
| Full-repository `prettier --check .`                                     | Baseline failure: 185 pre-existing non-WO-015 paths; no write performed                        |
| Changed security code/tests Prettier check                               | PASS; `.env.example` has no registered Prettier parser and passed `git diff --check`           |
| Generated `pnpm-lock.yaml` Prettier check                                | Baseline: both committed and current lockfiles differ from general Prettier output             |
| `git diff --check`                                                       | PASS                                                                                           |
| Corepack pnpm `10.0.0` dependency/lockfile update                        | PASS; only exact `@nestjs/platform-express@11.1.28` declared                                   |
| Frozen lockfile-only pnpm validation with lifecycle scripts disabled     | PASS across all eight workspace projects                                                       |
| API process launch (`node dist/main.js`)                                 | PASS; real HTTP server started and logged Nest startup success                                 |
| Live HTTP functional/non-disclosure matrix                               | PASS                                                                                           |
| Live absent/invalid/stale/replay proof behavior                          | PASS through focused unit/structural checks and live absent/invalid cases                      |
| Live mismatched-Origin/mismatched-Host mutation rejection                | PASS; both returned generic HTTP 403 before state change                                       |
| Browser-static proof/secret scan                                         | PASS; no proof configuration or headers in `.next/static`                                      |

The runtime host defect and the direct mutation authorization defect are both corrected. The compiled API starts with the aligned Nest Express adapter, all functional/non-disclosure cases pass, and direct Cart mutations now fail closed without valid server proof or when Origin/Host context is mismatched.

### Existing warnings and baseline conditions

- Next builds retain the existing warning that the Next.js ESLint plugin was not detected.
- The root Turbo wrapper selected global pnpm `11.13.0` for child tasks and was rejected by the workspace's pinned pnpm `10.0.0`. Corepack pnpm `10.0.0` recursive execution completed every equivalent API, Storefront, Admin, and shared-package check.
- Full-repository Prettier still reports 185 pre-existing formatting failures outside WO-015. No unrelated file was rewritten.

## Database Validation and Readiness Status

The requested PostgreSQL migration, bootstrap, schema, constraint, Store-isolation, Offer-window/availability, concurrent Cart mutation, idempotency, and atomic-audit checks all passed against the disposable local server. The repaired Nest host also started successfully, and the functional/non-disclosure HTTP matrix passed.

Overall WO-015 is **READY FOR HUMAN REVIEW AND SCOPED COMMIT**. The repeated actual HTTP matrix rejected mismatched-Origin and mismatched-Host mutations with generic HTTP 403 before state change, while valid BFF mutations, idempotency, no-store reads, Store isolation, rate-limit structure, migration/bootstrap behavior, and atomic audit behavior remained intact.

### Cleanup confirmation

- The only created container, `fardad-wo015-postgres`, was removed with its tmpfs-backed database.
- A post-cleanup exact-name query confirmed the container is absent.
- Port `127.0.0.1:54329` was bind-tested free after removal.
- API port `127.0.0.1:4015` was bind-tested free after the API process stopped.
- Both temporary API stdout/stderr files were removed.
- Both temporary validation scripts were created only in the operating-system temporary directory and removed after use; neither entered the repository.
- The pulled `postgres:16-alpine` image was not removed or modified after use; no pre-existing Docker image was touched.

## Explicit Scope Confirmation

- No visible Storefront Cart UI, add-to-cart button, Cart page, header badge, or client-side API fetch was created.
- `catalog.shop` remains not implemented/publishable; only `catalog.products` remains implemented.
- No checkout, Order, Payment, gateway, invoice/document, shipping, tax, discount, stock, inventory, reservation, warehouse, customer-panel, Admin UI, Product Experience pricing, chat, ticketing, loyalty, referral, social, AI, or PWA capability was implemented.
- No Tenant or Merchant model was added.
- `GiftBox.price` and `AddonService.price` are not used as Product sale prices.
- The only dependency correction was exact `@nestjs/platform-express@11.1.28`; `pnpm-lock.yaml` was regenerated by pnpm `10.0.0`. No other dependency was added.
- No production, remote, shared, repository-configured, or user-provided database was changed. The only database was random, local, disposable, tmpfs-backed, and destroyed with the named container.
- No commit or push was performed.

## Known Next Dependencies

1. Provision the same independently generated `COMMERCE_BFF_SHARED_SECRET` through the approved secret managers for the API and Storefront server runtimes; rotate it through a coordinated deployment procedure.
2. Controlled Store bootstrap and ProductOffer loading procedure for each deployment.
3. A shared edge/distributed nonce/rate-limit control before horizontally scaling the public Commerce API; current nonce and rate enforcement is bounded per process.
4. Operational dashboards/alerts and an approved retention cleanup job for expired Carts and idempotency records.
5. A separate UI/publishability work order before exposing purchasing or Cart controls.
6. Separate approved work orders for checkout/Order, buyer/recipient data, shipping/tax, one ordinary payment gateway, and branded commercial documents.

## Final Git Status and Commit Recommendation

Final `git status --short -uall` contains 55 intentional WO-015 paths: 11 modified and 44 untracked, with zero staged, deleted, or renamed paths. The five additional untracked paths are the API proof service, Storefront proof helper, two focused API unit tests, and one API structural test. No unrelated path appeared.

```text
 M .gitignore
 M apps/api/.env.example
 M apps/api/package.json
 M apps/api/prisma/schema.prisma
 M apps/api/src/app.module.ts
 M apps/api/src/config/env.validation.ts
 M apps/api/src/public-catalog/public-catalog.repository.ts
 M apps/storefront/.env.example
 M apps/storefront/package.json
 M packages/types/src/index.ts
 M pnpm-lock.yaml
?? apps/api/prisma/migrations/20260720020000_add_store_offer_guest_cart_foundation/migration.sql
?? apps/api/src/commerce/bootstrap-store.ts
?? apps/api/src/commerce/cart-policy.ts
?? apps/api/src/commerce/cart-token.ts
?? apps/api/src/commerce/cart.repository.ts
?? apps/api/src/commerce/cart.service.ts
?? apps/api/src/commerce/commerce-bff-proof.service.ts
?? apps/api/src/commerce/commerce-errors.ts
?? apps/api/src/commerce/commerce-rate-limit.service.ts
?? apps/api/src/commerce/commerce.module.ts
?? apps/api/src/commerce/commerce.repository.ts
?? apps/api/src/commerce/commerce.service.ts
?? apps/api/src/commerce/dto/add-cart-line.dto.ts
?? apps/api/src/commerce/dto/cart-line.params.dto.ts
?? apps/api/src/commerce/dto/purchasing-option.params.dto.ts
?? apps/api/src/commerce/dto/set-cart-line-quantity.dto.ts
?? apps/api/src/commerce/index.ts
?? apps/api/src/commerce/money.ts
?? apps/api/src/commerce/offer-management.service.ts
?? apps/api/src/commerce/public-cart.controller.ts
?? apps/api/src/commerce/public-commerce.controller.ts
?? apps/api/src/commerce/store-context.service.ts
?? apps/api/test/commerce-bff-structure.test.cjs
?? apps/api/test/commerce-migration-structure.test.cjs
?? apps/api/test/setup-env.cjs
?? apps/api/test/unit/cart-policy.spec.ts
?? apps/api/test/unit/cart.service.spec.ts
?? apps/api/test/unit/commerce-bff-proof.service.spec.ts
?? apps/api/test/unit/commerce.service.spec.ts
?? apps/api/test/unit/money.spec.ts
?? apps/api/test/unit/offer-policy.spec.ts
?? apps/api/test/unit/public-cart.controller.spec.ts
?? apps/api/test/unit/rate-limit.spec.ts
?? apps/api/test/unit/store-context.spec.ts
?? apps/api/tsconfig.test.json
?? apps/storefront/src/lib/api/public-commerce.ts
?? apps/storefront/src/lib/commerce/cart-actions.ts
?? apps/storefront/src/lib/commerce/cart-cookie.ts
?? apps/storefront/src/lib/commerce/cart-session.ts
?? apps/storefront/src/lib/commerce/commerce-bff-proof.ts
?? apps/storefront/src/lib/commerce/commerce-config.ts
?? apps/storefront/test/commerce-boundary.test.mjs
?? docs/codex/reports/WO-015_COMMERCE_FOUNDATION_IMPLEMENTATION_REPORT.md
?? packages/types/src/commerce.ts
```

One scoped commit recommendation after human review:

```text
feat(commerce): add multi-store offer and guest cart foundation
```

The implementation is ready for human review and the one scoped commit above. No commit or push was performed by Codex.
