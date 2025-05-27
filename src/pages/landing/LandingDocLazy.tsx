// src/pages/landing/LandingDocLazy.tsx
import { useInView } from "react-intersection-observer";
import { lazy, Suspense } from "react";

const LandingDocSection = lazy(() => import("./LandingDocSection"));

const LandingDocLazy = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="w-full">
      {inView && (
        <Suspense
          fallback={
            <div className="py-10 text-gray-400">문서 정보 불러오는 중...</div>
          }
        >
          <LandingDocSection />
        </Suspense>
      )}
    </div>
  );
};

export default LandingDocLazy;
