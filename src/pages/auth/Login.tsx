// src/pages/auth/Login.tsx
import KakaoLoginButton from "../../components/common/KakaoLoginButton.tsx";
import Footer from "../../components/layouts/Footer.tsx";
import LogoIcon from "../../components/icons/LogoIcon.tsx";
import { useLayout } from "../../hooks/useLayout.ts";

const Login = () => {
  useLayout({
    headerVisible: false,
    bottomNavVisible: false,
  });

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-start min-h-screen gap-4 py-[3.75rem] px-5">
        <div className="w-full flex flex-col gap-5 mb-20">
          <LogoIcon theme="text" className="w-[162px] h-[31px]" />
          <div className="heading-2">
            소상공인 사장님들을 위한
            <br />
            <span className="text-primary-900">알바생 관리</span>의 새로운 혁신
          </div>
          <div className="body-2 text-grayscale-500">
            <span className="text-primary-900">1분</span>이면 간편하게 서비스를
            이용해 보세요!
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full justify-center items-center">
          <LogoIcon theme="icon" className="w-[104px] h-[115px]" />
          <KakaoLoginButton className="w-full" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
