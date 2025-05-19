import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true, // 개발 환경에서도 서비스 워커와 매니페스트 생성
      },
      // service worker
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // service worker 캐싱
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      // pwa
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
});
