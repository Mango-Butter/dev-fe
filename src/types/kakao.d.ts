// src/types/kakao.d.ts

interface KakaoAuth {
  authorize(options: { redirectUri: string }): void;
}

interface KakaoStatic {
  init(key: string): void;
  isInitialized(): boolean;
  Auth: KakaoAuth;
}

interface Window {
  Kakao: KakaoStatic;
}
