import type { NavigationItem } from "@fardad/types";

export const fardadNavigation: readonly NavigationItem[] = [
  { id: "home", label: "خانه", href: "/" },
  {
    id: "products",
    label: "محصولات",
    href: "/products",
    requiresAllCapabilities: ["catalog.products"],
  },
  {
    id: "cart",
    label: "سبد خرید",
    href: "/cart",
    requiresAllCapabilities: ["catalog.shop"],
  },
  {
    id: "corporate-gifts",
    label: "هدایای سازمانی",
    href: "/corporate-gifts",
    requiresAllCapabilities: ["corporate.sales"],
  },
  {
    id: "about",
    label: "درباره ما",
    href: "/about",
    requiresAllCapabilities: ["pages.about"],
  },
  {
    id: "articles",
    label: "وبلاگ",
    href: "/blog",
    requiresAllCapabilities: ["content.articles"],
  },
  {
    id: "contact",
    label: "تماس با ما",
    href: "/contact",
    requiresAllCapabilities: ["pages.contact"],
  },
];
