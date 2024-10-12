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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      padding: {
        primaryX: "1rem", // equivalent to px-4
        primaryY: "0.5rem", // equivalent to py-2
      },
      height: {
        hCard: "10vh",
      },
      width: {
        wCard: "100%",
        wmdCard: "45%",
      },
    },
  },
  plugins: [],
};
export default config;
