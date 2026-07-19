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
        accent: "#A97142",
        copper: "#B87333",
        dark: "#071310",
        ivory: "#F8F4EC",
        marble: "#ECE7DD",
        primary: "#0E3B2E",
        secondary: "#C2A46B",
      },
      fontFamily: {
        display: ["IRANYekanX", "sans-serif"],
        sans: ["IRANYekanX", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
