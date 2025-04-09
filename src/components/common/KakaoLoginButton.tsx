import { useEffect } from "react";
import KakaoLogoIcon from "../icons/KaKaoLogoIcon.tsx";

interface KakaoLoginButtonProps {
  className?: string;
}

const KakaoLoginButton = ({ className = "" }: KakaoLoginButtonProps) => {
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
      className={`flex h-12 bg-[#FEE500] py-[0.44rem] px-[1.25rem] justify-between items-center gap-2.5 rounded-[0.75rem] ${className}`}
    >
      <KakaoLogoIcon theme="black" className="w-6 h-6" />
      <div className="flex flex-1 items-center justify-center title-2">
        카카오로 로그인
      </div>
    </button>
  );
};

export default KakaoLoginButton;
