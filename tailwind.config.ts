import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1rem",
        md: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem"
      }
    },

    extend: {
      colors: {
        primary: "#0E3B2E",
        secondary: "#C2A46B",
        accent: "#A97142",
        copper: "#B87333",
        ivory: "#F8F4EC",
        marble: "#ECE7DD",
        dark: "#071310",
        light: "#FFFFFF",

        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626"
      },

      fontFamily: {
        sans: ["IRANYekanX", "sans-serif"],
        display: ["IRANYekanX", "sans-serif"]
      },

      borderRadius: {
        luxury: "24px"
      },

      boxShadow: {
        luxury: "0 20px 60px rgba(0,0,0,.18)",
        glass: "0 8px 30px rgba(0,0,0,.10)"
      },

      backgroundImage: {
        hero:
          "linear-gradient(135deg,#071310 0%,#0E3B2E 45%,#16473A 100%)",

        gold:
          "linear-gradient(135deg,#C2A46B 0%,#E4C889 100%)"
      },

      transitionTimingFunction: {
        luxury: "cubic-bezier(.22,1,.36,1)"
      }
    }
  },

  plugins: []
};

export default config;