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

          // 앱 코드(페이지)는 manualChunks로 묶지 않는다.
          // 디렉터리 단위로 묶으면 Rollup이 여러 라우트가 공유하는 모듈을 특정
          // 페이지 청크에 몰아넣고, 그 청크를 entry가 정적 import하게 되어
          // (예: index → chunk-landing → chunk-home/contract) 모든 페이지 청크가
          // 랜딩 초기 로드에 강제 편입되는 누수가 발생한다.
          // React.lazy가 이미 라우트별 async 청크를 자동 생성하므로,
          // Rollup 기본 분할에 맡겨 공유 모듈이 올바른 공용 청크로 빠지게 한다.
          return undefined;
        },
      },
    },
  },
});
