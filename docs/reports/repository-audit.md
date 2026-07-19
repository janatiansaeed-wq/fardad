# Repository Audit

## Repository summary

- Repository root: `/workspace/fardad`
- Scan scope: entire working tree excluding `.git/`; `node_modules/` is included in primary totals because it is present in the repository directory.
- Total folders: 710
- Total source files: 3038
- Total Markdown files: 311
- Normalized counts excluding `node_modules/`: 51 folders, 126 source files, 43 Markdown files
- Total files scanned: 3731

## Folder tree (top 3 levels)

```text
.
├── .husky/
│   └── _/
│       ├── .gitignore
│       ├── applypatch-msg
│       ├── commit-msg
│       ├── h
│       ├── husky.sh
│       ├── post-applypatch
│       ├── post-checkout
│       ├── post-commit
│       ├── post-merge
│       ├── post-rewrite
│       ├── pre-applypatch
│       ├── pre-auto-gc
│       ├── pre-commit
│       ├── pre-merge-commit
│       ├── pre-push
│       ├── pre-rebase
│       └── prepare-commit-msg
├── app/
│   ├── admin/
│   │   └── .gitkeep
│   ├── api/
│   │   ├── categories/
│   │   └── products/
│   ├── backend/
│   │   ├── prisma/
│   │   ├── src/
│   │   ├── .gitkeep
│   │   ├── nest-cli.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── corporate/
│   │   └── .gitkeep
│   ├── dashboard/
│   │   ├── error.tsx
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── frontend/
│   │   └── .gitkeep
│   ├── .gitkeep
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── layout/
│   │   ├── widgets/
│   │   ├── Breadcrumb.tsx
│   │   ├── Header.tsx
│   │   ├── Menu.tsx
│   │   ├── Sidebar.tsx
│   │   └── UserMenu.tsx
│   ├── home/
│   │   ├── Categories.tsx
│   │   ├── Features.tsx
│   │   └── Hero.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   └── Navbar.tsx
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Container.tsx
│       ├── Heading.tsx
│       ├── Image.tsx
│       └── Section.tsx
├── config/
│   ├── company.ts
│   ├── navigation.ts
│   ├── seo.ts
│   ├── site.ts
│   └── theme.ts
├── database/
│   ├── README.md
│   ├── schema.prisma
│   └── seed.ts
├── docs/
│   ├── api/
│   │   ├── products-delete-route.ts
│   │   ├── products-post-route.ts
│   │   ├── products-put-route.ts
│   │   └── upload-route.ts
│   ├── blueprint/
│   │   ├── blue print.zip
│   │   ├── Chapter_001.md
│   │   ├── Chapter_002.md
│   │   ├── Chapter_003.md
│   │   ├── Chapter_004.md
│   │   ├── Chapter_005.md
│   │   ├── Chapter_006.md
│   │   ├── Chapter_007.md
│   │   ├── Chapter_008.md
│   │   ├── Chapter_009.md
│   │   ├── Chapter_010.md
│   │   ├── Chapter_011.md
│   │   ├── Chapter_012.md
│   │   ├── Chapter_013.md
│   │   ├── Chapter_014.md
│   │   ├── Chapter_015.md
│   │   ├── Chapter_016.md
│   │   ├── Chapter_017.md
│   │   ├── Chapter_018.md
│   │   ├── Chapter_019.md
│   │   ├── Chapter_020.md
│   │   ├── Chapter_021.md
│   │   ├── Chapter_022.md
│   │   ├── Chapter_023.md
│   │   ├── Chapter_024.md
│   │   ├── Chapter_025.md
│   │   ├── Chapter_026.md
│   │   ├── Chapter_027.md
│   │   ├── Chapter_028.md
│   │   ├── Chapter_029.md
│   │   ├── Chapter_030.md
│   │   ├── Chapter_031.md
│   │   ├── Chapter_032.md
│   │   ├── Chapter_033.md
│   │   ├── Chapter_034.md
│   │   ├── Chapter_035.md
│   │   ├── Chapter_036.md
│   │   ├── Chapter_037.md
│   │   ├── Chapter_038.md
│   │   ├── Chapter_039.md
│   │   └── Chapter_040.md
│   └── reports/
│       └── repository-audit.md
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── constants.ts
│   ├── env.ts
│   ├── media.ts
│   ├── prisma.ts
│   ├── storage.ts
│   ├── upload.ts
│   └── utils.ts
├── modules/
│   └── product/
│       ├── constants/
│       ├── repositories/
│       ├── services/
│       ├── types/
│       ├── utils/
│       ├── validations/
│       └── index.ts
├── node_modules/ …
├── packages/
│   └── .gitkeep
├── types/
│   ├── cms.ts
│   ├── index.ts
│   ├── order.ts
│   ├── product.ts
│   └── user.ts
├── .dockerignore
├── .editorconfig
├── .env.example
├── .gitattributes
├── .gitignore
├── .npmrc
├── .nvmrc
├── .prettierignore
├── .prettierrc
├── .prettierrc.json
├── eslint.config.mjs
├── LICENSE
├── middleware.ts
├── next.config.ts
├── package.json
├── pnpm-workspace.yaml
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.base.json
├── tsconfig.json
└── turbo.json
```

## Blueprint documentation

- Detected location: `docs/blueprint/`
- Blueprint chapter Markdown files found: 40
- Chapter number range found: 001-040

## Blueprint chapters found

| Chapter | File | Size bytes | First readable heading/content |
|---:|---|---:|---|
| 001 | `docs/blueprint/Chapter_001.md` | 5015 | \# MASTER BLUEPRINT |
| 002 | `docs/blueprint/Chapter_002.md` | 7323 | \# MASTER BLUEPRINT |
| 003 | `docs/blueprint/Chapter_003.md` | 7746 | \# MASTER BLUEPRINT |
| 004 | `docs/blueprint/Chapter_004.md` | 335 | MASTER BLUEPRINT |
| 005 | `docs/blueprint/Chapter_005.md` | 297 | MASTER BLUEPRINT |
| 006 | `docs/blueprint/Chapter_006.md` | 270 | MASTER BLUEPRINT |
| 007 | `docs/blueprint/Chapter_007.md` | 7259 | \# MASTER BLUEPRINT |
| 008 | `docs/blueprint/Chapter_008.md` | 6996 | \# MASTER BLUEPRINT |
| 009 | `docs/blueprint/Chapter_009.md` | 6643 | \# MASTER BLUEPRINT |
| 010 | `docs/blueprint/Chapter_010.md` | 7110 | \# MASTER BLUEPRINT |
| 011 | `docs/blueprint/Chapter_011.md` | 6361 | \# MASTER BLUEPRINT |
| 012 | `docs/blueprint/Chapter_012.md` | 5909 | \# MASTER BLUEPRINT |
| 013 | `docs/blueprint/Chapter_013.md` | 6896 | \# MASTER BLUEPRINT |
| 014 | `docs/blueprint/Chapter_014.md` | 6715 | \# MASTER BLUEPRINT |
| 015 | `docs/blueprint/Chapter_015.md` | 7010 | \# MASTER BLUEPRINT |
| 016 | `docs/blueprint/Chapter_016.md` | 5067 | \# MASTER BLUEPRINT |
| 017 | `docs/blueprint/Chapter_017.md` | 6282 | \# MASTER BLUEPRINT |
| 018 | `docs/blueprint/Chapter_018.md` | 5996 | \# MASTER BLUEPRINT |
| 019 | `docs/blueprint/Chapter_019.md` | 6878 | \# MASTER BLUEPRINT |
| 020 | `docs/blueprint/Chapter_020.md` | 6404 | \# MASTER BLUEPRINT |
| 021 | `docs/blueprint/Chapter_021.md` | 6803 | \# MASTER BLUEPRINT |
| 022 | `docs/blueprint/Chapter_022.md` | 6302 | \# MASTER BLUEPRINT |
| 023 | `docs/blueprint/Chapter_023.md` | 7320 | \# MASTER BLUEPRINT |
| 024 | `docs/blueprint/Chapter_024.md` | 6061 | \# MASTER BLUEPRINT |
| 025 | `docs/blueprint/Chapter_025.md` | 7081 | \# MASTER BLUEPRINT |
| 026 | `docs/blueprint/Chapter_026.md` | 6044 | \# MASTER BLUEPRINT |
| 027 | `docs/blueprint/Chapter_027.md` | 5542 | \# MASTER BLUEPRINT |
| 028 | `docs/blueprint/Chapter_028.md` | 6899 | \# MASTER BLUEPRINT |
| 029 | `docs/blueprint/Chapter_029.md` | 6140 | \# MASTER BLUEPRINT |
| 030 | `docs/blueprint/Chapter_030.md` | 177 | MASTER BLUEPRINT |
| 031 | `docs/blueprint/Chapter_031.md` | 194 | MASTER BLUEPRINT |
| 032 | `docs/blueprint/Chapter_032.md` | 88 | MASTER BLUEPRINT |
| 033 | `docs/blueprint/Chapter_033.md` | 87 | MASTER BLUEPRINT |
| 034 | `docs/blueprint/Chapter_034.md` | 85 | MASTER BLUEPRINT |
| 035 | `docs/blueprint/Chapter_035.md` | 94 | MASTER BLUEPRINT |
| 036 | `docs/blueprint/Chapter_036.md` | 97 | MASTER BLUEPRINT |
| 037 | `docs/blueprint/Chapter_037.md` | 97 | MASTER BLUEPRINT |
| 038 | `docs/blueprint/Chapter_038.md` | 80 | MASTER BLUEPRINT |
| 039 | `docs/blueprint/Chapter_039.md` | 96 | MASTER BLUEPRINT |
| 040 | `docs/blueprint/Chapter_040.md` | 101 | MASTER BLUEPRINT |

## Missing chapter numbers

- None

## Duplicate chapter numbers

- None

## Documents that cannot be read

- None; all detected Blueprint Markdown chapters were readable as UTF-8 text.

## Potential structural issues

- `node_modules/` is present in the working tree; repository-wide counts include it, and normalized counts excluding it are shown for review clarity.
- Potential duplicate/accidental filename detected: `app/backend/src/config/index (1).ts`.
- Both `.prettierrc` and `.prettierrc.json` are present; verify intended formatter precedence.
- Blueprint directory contains archive `docs/blueprint/blue print.zip` alongside extracted chapter Markdown files.

## Verification commands used

- `find /workspace/fardad -name AGENTS.md -print`
- `find . -path ./.git -prune -o -type d -print | wc -l`
- `find . -path ./.git -prune -o -type f \( -iname '*.md' -o -iname '*.markdown' \) -print | wc -l`
- Python repository audit script using `pathlib.Path.rglob`, excluding `.git/`, reading `docs/blueprint/Chapter_*.md` as UTF-8
