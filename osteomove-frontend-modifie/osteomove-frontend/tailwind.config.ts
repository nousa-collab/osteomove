import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#239B8B", dark: "#1B7A6D" },
        secondary: "#DFF3EC",
        page: "#F8FAF9",
        ink: "#20333D",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(32, 51, 61, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
