import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B2A5B",
          navy2: "#081D40",
          accent: "#F6C400",
          mist: "#F5F7FB"
        }
      },
      boxShadow: {
        soft: "0 14px 45px rgba(2, 6, 23, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
