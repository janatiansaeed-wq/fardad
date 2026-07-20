# Fardad Enterprise Commerce Platform

## Technology Stack

- Node.js 22
- PNPM
- Turborepo
- NestJS
- Next.js
- React
- Prisma
- PostgreSQL
- Redis
- Docker
- MinIO
- Elasticsearch

---

## Applications

- `apps/storefront` — Next.js storefront shell
- `apps/admin` — Next.js administration shell
- `apps/api` — canonical NestJS API and Prisma owner

---

## Project Structure

```text
apps/
  storefront/
  admin/
  api/
packages/
  ui/
  types/
  config/
  utils/
docs/
```

---

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
```

Business features are implemented only through approved work orders.
