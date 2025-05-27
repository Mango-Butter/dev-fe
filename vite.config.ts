import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        start_url: "/",
        name: "MangoBoss",
        short_name: "MangoBoss",
        description: "MangoBoss : Part-time Worker Management WebApp",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            if (id.includes("zustand")) return "vendor-zustand";
            if (id.includes("react-router-dom")) return "vendor-router";
            if (id.includes("react-hook-form")) return "vendor-form";
            if (id.includes("zod")) return "vendor-zod";
            if (id.includes("axios")) return "vendor-axios";
            return "vendor-others";
          }

          if (id.includes("/pages/landing/")) return "chunk-landing";
          if (id.includes("/pages/home/")) return "chunk-home";
          if (id.includes("/pages/schedule/")) return "chunk-schedule";
          if (id.includes("/pages/contract/")) return "chunk-contract";
          if (id.includes("/pages/store/")) return "chunk-store";
          if (id.includes("/pages/employee/")) return "chunk-employee";
          if (id.includes("/pages/payroll/")) return "chunk-payroll";
          if (id.includes("/pages/document/")) return "chunk-document";
        },
      },
    },
  },
});
