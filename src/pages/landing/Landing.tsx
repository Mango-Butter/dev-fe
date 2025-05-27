import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../hooks/useLayout.ts";
import Button from "../../components/common/Button.tsx";
import { FeatureCard } from "./FeatureCard.tsx";
import LandingIntroLazy from "./LandingIntroLazy.tsx";
import LandingPayLazy from "./LandingPayLazy.tsx";
import LandingDocLazy from "./LandingDocLazy.tsx";

// 아이콘 최소화: 큰 사이즈 / 하단 렌더링만 lazy import
const LogoIcon = lazy(() => import("../../components/icons/LogoIcon.tsx"));
const PartyIcon = lazy(() => import("../../components/icons/PartyIcon.tsx"));
const Footer = lazy(() => import("../../components/layouts/Footer.tsx"));

const Landing = () => {
  useLayout({
    theme: "default",
    rightIcon: false,
    headerVisible: true,
    bottomNavVisible: false,
  });

  const navigate = useNavigate();

  return (
    <div className="w-full h-full">
      <div className="w-full bg-white inline-flex flex-col justify-center items-center overflow-hidden">
        <div className="w-full px-9 py-12 bg-primary-100 inline-flex justify-center items-center">
          <div className="inline-flex flex-col justify-center items-center gap-12">
            <Suspense fallback={null}>
              <LogoIcon
                className="w-50 h-auto object-contain overflow-visible"
                theme="full"
              />
            </Suspense>
            <div className="text-center text-grayscale-900 text-3xl font-bold leading-tight">
              사장님의 부담을 줄여주는 <br />
              <span className="text-primary-900">알바생 관리</span>의 새로운
              기준
            </div>
            <div className="text-grayscale-600 heading-2">
              편리하게, 정확하게, 여유롭게
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FeatureCard
                title="출퇴근 관리"
                description="QR, GPS 기반 출퇴근 인증"
                icon="ClockIcon"
              />
              <FeatureCard
                title="자동 송금"
                description="알바생 급여지급일에 맞춰 한 번에 처리"
                icon="WingMoneyIcon"
              />
              <FeatureCard
                title="서류 관리"
                description="근로계약서, 보건증 등 통합 관리"
                icon="FolderIcon"
              />
              <FeatureCard
                title="스케줄 관리"
                description="달력 기반 스케줄 확인"
                icon="DateIcon"
              />
            </div>
          </div>
        </div>

        <LandingIntroLazy />
        <LandingPayLazy />
        <LandingDocLazy />

        <div className="w-full flex flex-col justify-start items-center py-14 bg-secondary-900 gap-14">
          <div className="w-full flex flex-col justify-start items-center gap-6">
            <Suspense fallback={null}>
              <PartyIcon />
            </Suspense>
            <div className="text-center text-white text-3xl font-bold">
              사장님이 더 쉬워지는 순간
              <br />
              망고보스의 시작입니다.
            </div>
          </div>
          <Button
            size="xl"
            theme="primary"
            type="button"
            state="default"
            className="text-black rounded-full"
            onClick={() => navigate("/login")}
          >
            망고보스 로그인하기
          </Button>
        </div>

        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
};

export default Landing;
