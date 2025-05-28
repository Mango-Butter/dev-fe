// src/pages/landing/LandingPayLazy.tsx
import { useInView } from "react-intersection-observer";
import { lazy, Suspense } from "react";

const LandingPaySection = lazy(() => import("./LandingPaySection"));

const LandingPayLazy = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <div ref={ref} className="w-full">
      {inView && (
        <Suspense
          fallback={
            <div className="py-10 text-gray-400">급여 정보 불러오는 중...</div>
          }
        >
          <LandingPaySection />
        </Suspense>
      )}
    </div>
  );
};

export default LandingPayLazy;
