// src/types/naver.d.ts

export {};

declare global {
  interface Window {
    naver: any; // ✅ 그냥 any로 선언
  }
}
