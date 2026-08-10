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
            // react runtime은 항상 함께 로드·버전업되는 단일 단위 → 하나로 묶어 장기 캐시
            if (/[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return "vendor-react";

            // react-router 생태계는 하나로 묶음: react-router-dom(재export)·set-cookie-parser
            // (react-router 의존성)가 개별 청크로 잡히면 빈 청크가 생성되므로 통합
            if (/[\\/](react-router|react-router-dom|set-cookie-parser)[\\/]/.test(id))
              return "vendor-router";

            // 그 외 라이브러리는 패키지 단위로 자동 분리:
            // 특정 라이브러리를 업데이트해도 해당 청크만 무효화되고 나머지는 캐시 유지
            const parts = id.split("node_modules/");
            const pkgPath = parts[parts.length - 1].split("/");
            const pkg = pkgPath[0].startsWith("@")
              ? `${pkgPath[0]}/${pkgPath[1]}`
              : pkgPath[0];
            return `vendor-${pkg.replace("@", "").replace("/", "-")}`;
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
