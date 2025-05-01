// src/types/kakao.d.ts

// Kakao OAuth 타입
interface KakaoAuth {
  authorize(options: { redirectUri: string }): void;
}

interface KakaoStatic {
  init(key: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
}

// 지도 SDK 타입
interface Window {
  Kakao: KakaoStatic;
  kakao: any; // 지도 SDK용 네임스페이스 (지도/지오코더 등)
}
