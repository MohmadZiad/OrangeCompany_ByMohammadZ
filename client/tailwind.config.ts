import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./styles/**/*.{css}"],
  theme: {
    extend: {
      colors: {
        orange: {
          50: "var(--orange-50)",
          100: "var(--orange-100)",
          200: "var(--orange-200)",
          300: "var(--orange-300)",
          400: "var(--orange-400)",
          500: "var(--orange-500)",
          600: "var(--orange-600)",
        },
        background: "var(--bg-light)",
        foreground: "var(--text-1)",
      },
      borderRadius: {
        "3xl": "2rem",
      },
      boxShadow: {
        glow: "0 30px 90px -45px rgba(255,122,26,0.65)",
      },
      transitionTimingFunction: {
        soft: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
