// src/pages/signup/SignupStep1.tsx
import Footer from "../../components/layouts/Footer.tsx";
import LogoIcon from "../../components/icons/LogoIcon.tsx";
import Button from "../../components/common/Button.tsx";
import { useLayout } from "../../hooks/useLayout.ts";
import SignUpStaff from "../../components/icons/SignUpStaff.tsx";
import SignUpBoss from "../../components/icons/SignUpBoss.tsx";

interface SignupStep1Props {
  onSelectRole: (role: "BOSS" | "STAFF") => void;
}

const SignupStep1 = ({ onSelectRole }: SignupStep1Props) => {
  useLayout({
    headerVisible: false,
    bottomNavVisible: false,
  });

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-center justify-start min-h-screen gap-4 py-[3.75rem] px-5">
        <div className="w-full flex flex-col gap-5 mb-20">
          <LogoIcon theme="text" className="w-[162px] h-[31px]" />
          <div className="heading-1">
            소상공인 사장님들을 위한
            <br />
            <span className="text-primary-900">알바생 관리</span>의 새로운 혁신
          </div>
          <div className="body-1 text-grayscale-500">
            <span className="text-primary-900">1분</span>이면 간편하게 서비스를
            이용해 보세요!
          </div>
        </div>
        <div className="flex flex-col gap-8 w-full justify-center items-center">
          <div className="w-full flex gap-5">
            <div className="w-full flex flex-col gap-4 justify-between items-center">
              <SignUpBoss className="w-full h-auto" />
              <Button
                theme="primary"
                size="lg"
                className="w-full text-grayscale-900"
                onClick={() => onSelectRole("BOSS")}
              >
                사장님 회원가입
              </Button>
            </div>
            <div className="w-full flex flex-col gap-4">
              <SignUpStaff className="w-full h-auto" />
              <Button
                theme="secondary"
                size="lg"
                className="w-full text-white"
                onClick={() => onSelectRole("STAFF")}
              >
                알바생 회원가입
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignupStep1;
