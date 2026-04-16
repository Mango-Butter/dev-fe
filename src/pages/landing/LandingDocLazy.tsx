// src/pages/landing/LandingDocLazy.tsx
import { useInView } from "react-intersection-observer";
import { lazy, Suspense } from "react";

const LandingDocSection = lazy(() => import("./LandingDocSection"));

const LandingDocLazy = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="w-full min-h-[400px]">
      {inView ? (
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center text-gray-400">문서 정보 불러오는 중...</div>
          }
        >
          <LandingDocSection />
        </Suspense>
      ) : null}
    </div>
  );
};

export default LandingDocLazy;
