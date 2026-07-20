import { createStaticNavigationSource } from "@fardad/config/navigation";
import type { StorefrontProfile } from "@fardad/types";
import { fardadCapabilityAvailability } from "./fardad-features";
import { fardadNavigation } from "./fardad-navigation";

export const fardadProfile: StorefrontProfile = {
  identity: {
    name: "فرداد",
    legalName: "Fardad",
    locale: "fa-IR",
    language: "fa",
    direction: "rtl",
    url: "https://fardad.ir",
    timezone: "Asia/Tehran",
    currency: "IRT",
  },
  brand: {
    displayName: "فرداد",
    slogan: "هنر اصیل ایرانی، هدیه‌ای ماندگار",
    description:
      "تولیدکننده محصولات لوکس صنایع دستی ایرانی و ویژه هدایای مدیریتی، سازمانی و صادراتی.",
    contact: {
      email: "info@fardad.ir",
      phone: "+98 21 00000000",
      mobile: "+98 912 0000000",
      address: "تهران، ایران",
    },
    social: {},
    copyright: `© ${new Date().getFullYear()} Fardad. All Rights Reserved.`,
  },
  design: {
    colors: {
      background: "#F8F4EC",
      surface: "#FFFFFF",
      text: "#081613",
      mutedText: "#4B5563",
      primary: "#0E3B2E",
      primaryContrast: "#FFFFFF",
      secondary: "#C2A46B",
      secondaryContrast: "#081613",
      border: "#E5E7EB",
      focus: "#A97142",
    },
    radius: {
      small: "0.5rem",
      medium: "1.5rem",
    },
    contentMaxWidth: "90rem",
  },
  seo: {
    defaultTitle: "فرداد | صنایع دستی لوکس ایران",
    titleTemplate: "%s | فرداد",
    description:
      "فرداد تولید کننده صنایع دستی لوکس، هدایای مدیریتی، هدایای سازمانی و محصولات هنری اصیل ایرانی.",
    keywords: [
      "صنایع دستی",
      "هدیه مدیریتی",
      "هدیه سازمانی",
      "فیروزه کوبی",
      "میناکاری",
      "خاتم کاری",
      "قلمزنی",
      "مس",
      "صادرات صنایع دستی",
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      locale: "fa_IR",
      siteName: "Fardad",
    },
  },
  navigation: createStaticNavigationSource(fardadNavigation),
  capabilities: fardadCapabilityAvailability,
};
