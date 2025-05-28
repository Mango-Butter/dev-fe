// src/pages/LandingIntroSection.tsx
import LandingProblem from "../../components/icons/LandingProblem.tsx";
import LandingArrow from "../../components/icons/LandingArrow.tsx";
import LandingGroup from "../../components/icons/LandingGroup.tsx";

const LandingIntroSection = () => {
  return (
    <div className="px-5 py-12 bg-white flex flex-col justify-start items-center gap-12">
      <div className="text-center text-grayscale-900 text-3xl font-bold">
        망고보스는 <br />
        이렇게 만들어졌어요!
      </div>
      <LandingProblem />
      <LandingArrow />
      <LandingGroup />
    </div>
  );
};

export default LandingIntroSection;
