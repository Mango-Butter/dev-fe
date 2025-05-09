// src/pages/signup/SignupStep1.tsx
import Footer from "../../../components/layouts/Footer.tsx";
import LogoIcon from "../../../components/icons/LogoIcon.tsx";
import { useLayout } from "../../../hooks/useLayout.ts";
import Button from "../../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";

const StoreRegisterIntro = () => {
  useLayout({
    headerVisible: true,
    bottomNavVisible: false,
  });
  const navigate = useNavigate();

  const handleStoreRegister = () => {
    navigate("/staff/store/register");
  };

  return (
    <div className="w-full h-full">
      <div className="flex w-full flex-col items-center justify-start min-h-screen gap-8 py-[3.75rem] px-5">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <div className="heading-2">
            간편한 알바 근무를
            <br />
            경험해보세요.
          </div>
          <div className="body-2 text-grayscale-500">
            근무하시는 매장을 등록하고 스케줄과 급여를 한 눈에 확인할 수 있어요!
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full justify-center items-center">
          <LogoIcon theme="icon" className="w-[104px] h-[115px]" />
          <Button
            size="sm"
            state="default"
            theme="primary"
            className="text-grayscale-800 w-full bg-primary-900"
            onClick={handleStoreRegister}
          >
            근무매장 등록하기
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoreRegisterIntro;
