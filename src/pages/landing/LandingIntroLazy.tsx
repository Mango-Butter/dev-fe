// src/pages/landing/LandingIntroLazy.tsx
import { useInView } from "react-intersection-observer";
import { lazy, Suspense } from "react";

const LandingIntroSection = lazy(() => import("./LandingIntroSection"));

const LandingIntroLazy = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="w-full min-h-[400px]">
      {inView ? (
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center text-gray-400">소개 섹션 불러오는 중...</div>
          }
        >
          <LandingIntroSection />
        </Suspense>
      ) : null}
    </div>
  );
};

export default LandingIntroLazy;
