import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: "#f0f7fa",
          100: "#dceef4",
          200: "#b8dde9",
          500: "#2b7a9b",
          600: "#236580",
          700: "#1d5368",
          800: "#184352",
          900: "#133744",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          600: "#d97706",
          800: "#92400e",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          600: "#dc2626",
          800: "#991b1b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
