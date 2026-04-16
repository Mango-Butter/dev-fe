// src/pages/LandingPaySection.tsx
import { lazy, Suspense } from "react";

const MoneyIcon = lazy(() => import("../../components/icons/MoneyIcon.tsx"));
const LandingCoin = lazy(
  () => import("../../components/icons/LandingCoin.tsx"),
);

const LandingPaySection = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="py-12 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-primary-100 rounded-xl flex justify-center items-center">
            <Suspense
              fallback={
                <div className="w-10 h-10 bg-primary-200 animate-pulse rounded" />
              }
            >
              <MoneyIcon />
            </Suspense>
          </div>
          <div className="text-center">
            <span className="text-grayscale-900 text-3xl font-bold">
              급여는 한번에
            </span>
            <br />
            <span className="text-primary-900 text-3xl font-bold">자동</span>
            <span className="text-grayscale-900 text-3xl font-bold">으로</span>
          </div>
        </div>
        <div className="text-center text-grayscale-600 body-1">
          급여지급일 설정에 따른 <br />
          알바생 근태 기록 기반 자동 송금
        </div>
      </div>
      <div className="w-full py-8 bg-primary-100 flex justify-center items-center gap-6">
        <Suspense
          fallback={
            <div className="w-48 h-96 bg-primary-200 animate-pulse rounded-xl" />
          }
        >
          <LandingCoin className="w-48 h-96" />
        </Suspense>
      </div>
    </div>
  );
};

export default LandingPaySection;
