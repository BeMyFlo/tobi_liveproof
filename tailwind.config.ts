import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#f8fafc",
        },
        background: "#0f172a",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "#1e293b",
          foreground: "#f8fafc",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
export default config;
