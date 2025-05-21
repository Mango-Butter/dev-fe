// utils/loadKakaoMapScript.ts

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_JS_KEY;

export const loadKakaoMapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(resolve);
    };
    script.onerror = reject;

    document.head.appendChild(script);
  });
};
