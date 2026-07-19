"use client";

import Link from "next/link";
import { navigation } from "@fardad/config/navigation";

export default function Navbar() {
  return (
    <nav>
      <ul className="flex items-center gap-8">
        {navigation.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="text-sm font-medium transition hover:text-primary"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
