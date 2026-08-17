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
        background: "#020617", // slate-950
        surface: "#0f172a", // slate-900
        surfaceHover: "#1e293b", // slate-800
        accent: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          purple: "#8b5cf6",
          amber: "#f59e0b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
