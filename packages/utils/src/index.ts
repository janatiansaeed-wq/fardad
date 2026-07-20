import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./capabilities";
export * from "./locale";
export * from "./navigation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale = "en"): string {
  return new Intl.NumberFormat(locale).format(price);
}

export function generateSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}
