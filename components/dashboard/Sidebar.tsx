"use client";

import Link from "next/link";

const menu = [
  { title: "داشبورد", href: "/dashboard" },
  { title: "محصولات", href: "/dashboard/products" },
  { title: "دسته‌بندی‌ها", href: "/dashboard/categories" },
  { title: "سفارش‌ها", href: "/dashboard/orders" },
  { title: "مشتریان", href: "/dashboard/customers" },
  { title: "رسانه", href: "/dashboard/media" },
  { title: "مقالات", href: "/dashboard/articles" },
  { title: "صفحات", href: "/dashboard/pages" },
  { title: "سئو", href: "/dashboard/seo" },
  { title: "تنظیمات", href: "/dashboard/settings" },
];

export default function Sidebar() {
  return (
    <aside>

      <h2>FARDAD</h2>

      <nav>

        {menu.map((item) => (

          <Link
            key={item.href}
            href={item.href}
          >
            {item.title}
          </Link>

        ))}

      </nav>

    </aside>
  );
}