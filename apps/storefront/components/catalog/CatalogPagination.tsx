import Link from "next/link";
import type { CatalogPagination as CatalogPaginationData } from "@fardad/types";

type CatalogPaginationProps = {
  basePath: string;
  pagination: CatalogPaginationData;
};

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export default function CatalogPagination({ basePath, pagination }: CatalogPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const firstPage = Math.max(1, pagination.page - 2);
  const lastPage = Math.min(pagination.totalPages, pagination.page + 2);
  const pages = Array.from({ length: lastPage - firstPage + 1 }, (_, index) => firstPage + index);

  return (
    <nav aria-label="صفحه‌بندی محصولات" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {pagination.page > 1 ? (
          <li>
            <Link
              href={pageHref(basePath, pagination.page - 1)}
              className="inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              صفحه قبل
            </Link>
          </li>
        ) : null}
        {firstPage > 1 ? (
          <li>
            <Link
              href={pageHref(basePath, 1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              1
            </Link>
          </li>
        ) : null}
        {pages.map((page) => (
          <li key={page}>
            <Link
              href={pageHref(basePath, page)}
              aria-current={page === pagination.page ? "page" : undefined}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              {page}
            </Link>
          </li>
        ))}
        {lastPage < pagination.totalPages ? (
          <li>
            <Link
              href={pageHref(basePath, pagination.totalPages)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              {pagination.totalPages}
            </Link>
          </li>
        ) : null}
        {pagination.page < pagination.totalPages ? (
          <li>
            <Link
              href={pageHref(basePath, pagination.page + 1)}
              className="inline-flex min-h-11 items-center rounded-[var(--ui-radius-small,0.375rem)] border border-[var(--ui-color-border,#d1d5db)] px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
            >
              صفحه بعد
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}
