// src/pages/LandingIntroSection.tsx
import { lazy, Suspense } from "react";

const LandingProblem = lazy(
  () => import("../../components/icons/LandingProblem.tsx"),
);
const LandingArrow = lazy(
  () => import("../../components/icons/LandingArrow.tsx"),
);
const LandingGroup = lazy(
  () => import("../../components/icons/LandingGroup.tsx"),
);

const IconSkeleton = ({ height = "h-48" }: { height?: string }) => (
  <div className={`w-full ${height} bg-gray-100 animate-pulse rounded-xl`} />
);

const LandingIntroSection = () => {
  return (
    <div className="px-5 py-12 bg-white flex flex-col justify-start items-center gap-12">
      <div className="text-center text-grayscale-900 text-3xl font-bold">
        망고보스는 <br />
        이렇게 만들어졌어요!
      </div>
      <Suspense fallback={<IconSkeleton height="h-64" />}>
        <LandingProblem />
      </Suspense>
      <Suspense fallback={<IconSkeleton height="h-12" />}>
        <LandingArrow />
      </Suspense>
      <Suspense fallback={<IconSkeleton height="h-64" />}>
        <LandingGroup />
      </Suspense>
    </div>
  );
};

export default LandingIntroSection;
