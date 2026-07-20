import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
});

const nextConfigs = compat.extends("next/core-web-vitals").map((config) => ({
  ...config,
  files: ["apps/admin/**/*.{js,jsx,ts,tsx}", "apps/storefront/**/*.{js,jsx,ts,tsx}"],
}));

export default [
  {
    ignores: ["**/.next/**", "**/dist/**", "**/next-env.d.ts", "**/node_modules/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextConfigs,
];
