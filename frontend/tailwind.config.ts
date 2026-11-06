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
        findback: {
          bg: "#F4F7FB",
          text: "#17202A",
          primary: "#234E70",
          "primary-hover": "#1B3E59",
          accent: "#3A8D7A",
          "accent-hover": "#2F7363",
          surface: "#FFFFFF",
          sand: "#E8EEF5",
          border: "#E2E8F0",
          muted: "#6B7280",
          "muted-light": "#9CA3AF",
          "hero-sky": "#6BA5E7",
          "hero-light": "#E0F2FE",
          "hero-wash": "#EDF5FD",
        },
        status: {
          lost: "#E07A5F",
          "lost-bg": "#FFF5F2",
          matched: "#D97706",
          "matched-bg": "#FEF3C7",
          verified: "#2563EB",
          "verified-bg": "#EFF6FF",
          returned: "#3A8D7A",
          "returned-bg": "#ECFDF5",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(23, 32, 42, 0.05), 0 1px 2px 0 rgba(23, 32, 42, 0.03)",
        card: "0 2px 8px -2px rgba(23, 32, 42, 0.06), 0 1px 4px -1px rgba(23, 32, 42, 0.04)",
        lift: "0 6px 16px -4px rgba(23, 32, 42, 0.08), 0 2px 6px -2px rgba(23, 32, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
