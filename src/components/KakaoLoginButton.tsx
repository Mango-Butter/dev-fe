import { useEffect } from "react";

const KakaoLoginButton = () => {
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const handleLogin = () => {
    window.Kakao.Auth.authorize({
      redirectUri: import.meta.env.VITE_KAKAO_REDIRECT_URI,
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-yellow-300 px-4 py-2 rounded-lg font-bold text-black"
    >
      카카오로 로그인
    </button>
  );
};

export default KakaoLoginButton;
