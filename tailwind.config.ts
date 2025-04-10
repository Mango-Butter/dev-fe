import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "spin-one-time": "spin 1s linear",
      },
      screens: {
        mobile: "320px",
        tablet: "600px",
        notebook: "1024px",
        desktop: "1440px",
      },
      colors: {
        black: "#131313",
        white: "#FFFFFF",
        positive: "#2BC566",
        warning: "#F33F3F",
        delay: "#FBC42E",
        primary: {
          100: "#FEF3D5",
          200: "#FEEEC1",
          300: "#FDE7AB",
          400: "#FCE196",
          500: "#FCDC82",
          600: "#FDD66D",
          700: "#FCD058",
          800: "#FCCB43",
          900: "#FBC42E",
        },
        secondary: {
          100: "#CCDEF1",
          200: "#B3CEEB",
          300: "#99BDE4",
          400: "#80ADDD",
          500: "#669DD6",
          600: "#4D8DD0",
          700: "#337CC9",
          800: "#1A6CC2",
          900: "#005BBB",
        },
        grayscale: {
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
      sans: ["Pretendard Variable", "Pretendard", "sans-serif"],
    },
  },
  plugins: [],
};

export default config;
