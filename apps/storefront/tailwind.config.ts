import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--ui-color-background)",
        surface: "var(--ui-color-surface)",
        foreground: "var(--ui-color-text)",
        muted: "var(--ui-color-muted-text)",
        primary: "var(--ui-color-primary)",
        secondary: "var(--ui-color-secondary)",
        focus: "var(--ui-color-focus)",
      },
      fontFamily: {
        display: ["var(--ui-font-display)", "sans-serif"],
        sans: ["var(--ui-font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
