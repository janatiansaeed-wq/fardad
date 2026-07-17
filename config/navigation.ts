export interface NavigationItem {
  id: number;
  title: string;
  href: string;
  children?: NavigationItem[];
}

export const navigation: NavigationItem[] = [
  {
    id: 1,
    title: "خانه",
    href: "/"
  },
  {
    id: 2,
    title: "محصولات",
    href: "/products",
    children: [
      {
        id: 21,
        title: "پک‌های هدیه",
        href: "/products/gift-pack"
      },
      {
        id: 22,
        title: "فیروزه کوبی",
        href: "/products/turquoise"
      },
      {
        id: 23,
        title: "میناکاری",
        href: "/products/enamel"
      },
      {
        id: 24,
        title: "قلمزنی",
        href: "/products/engraving"
      },
      {
        id: 25,
        title: "خاتم کاری",
        href: "/products/khatam"
      }
    ]
  },
  {
    id: 3,
    title: "هدایای سازمانی",
    href: "/corporate-gifts"
  },
  {
    id: 4,
    title: "درباره ما",
    href: "/about"
  },
  {
    id: 5,
    title: "وبلاگ",
    href: "/blog"
  },
  {
    id: 6,
    title: "تماس با ما",
    href: "/contact"
  }
];

export default navigation;