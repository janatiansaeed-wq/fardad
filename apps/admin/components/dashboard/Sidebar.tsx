"use client";

import Link from "next/link";

const menu = [{ title: "داشبورد", href: "/dashboard" }] as const;

export default function Sidebar() {
  return (
    <aside aria-label="ناوبری مدیریت">
      <h2>FARDAD</h2>
      <nav>
        {menu.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
