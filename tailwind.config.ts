import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B0B0B",
          navy2: "#1A1A1A",
          accent: "#F6C400",
          mist: "#F7F4E8"
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
