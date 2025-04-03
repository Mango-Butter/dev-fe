import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "spin-one-time": "spin 1s linear",
      },
      fontFamily: {
        pretendard: ["Pretendard", "sans-serif"],
      },
      screens: {
        mobile: "320px",
        tablet: "600px",
        notebook: "1024px",
        desktop: "1440px",
      },
      colors: {
        black: "#191919",
        tertiary: "#c4d625",
        positive: "#2E8B3C",
        warning: "#db1919",
        delay: "#db7619",
        primary: {
          default: "#1884ef",
          50: "#e3f2ff",
          100: "#baddff",
          200: "#8ec4ff",
          300: "#5fb2fe",
          400: "#3aa2ff",
          500: "#1292fe",
          600: "#1884ef",
          700: "#1971db",
          800: "#1960c9",
          900: "#1841aa",
        },
        secondary: {
          default: "#204776",
          50: "#e5e9ee",
          100: "#bdc7d7",
          200: "#9ea3bc",
          300: "#6a80a0",
          400: "#4a668f",
          500: "#274e7f",
          600: "#204776",
          700: "#173d6b",
          800: "#11345f",
          900: "#0b2447",
        },
        grayscale: {
          50: "#f8f8f8",
          100: "#f1f1f1",
          200: "#e7e7e7",
          300: "#d7d7d7",
          400: "#b3b3b3",
          500: "#939393",
          600: "#6b6b6b",
          700: "#575757",
          800: "#393939",
          900: "#191919",
        },
      },
      backgroundImage: {
        "gradient-01": "linear-gradient(180deg, #ffffff 0%, #E2F1FF 100%);",
        "gradient-02":
          "linear-gradient(135deg, #267DFF 0%, rgba(55, 38, 255, 0.60) 100%)",
        "gradient-gradient":
          "linear-gradient(135deg, #267DFF 0%, rgba(55, 38, 255, 0.60) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
        "gradient-indigo":
          "linear-gradient(0deg, #0B2447 0%, #0B2447 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
        "gradient-tertiary":
          "linear-gradient(0deg, #C4D625 0%, #C4D625 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%)",
      },

      boxShadow: {
        "input-box": "2px 2px 8px 0px rgba(0, 0, 0, 0.25)",
        "layout-box": "0px 8px 36px 0px rgba(0, 0, 0, 0.15)",
      },
    },
    fontFamily: {
      sans: ["Pretendard", "sans-serif"], // 전역 기본 폰트 설정
    },
  },
  plugins: [],
};

export default config;
