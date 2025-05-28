// src/pages/LandingDocSection.tsx
import BriefCaseIcon from "../../components/icons/BriefCaseIcon.tsx";
import LandingDoc from "../../components/icons/LandingDoc.tsx";
import LandingSign from "../../components/icons/LandingSign.tsx";

const LandingDocSection = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="py-12 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 bg-primary-100 rounded-xl flex justify-center items-center">
            <BriefCaseIcon />
          </div>
          <div className="text-center">
            <span className="text-grayscale-900 text-3xl font-bold">
              복잡한 서류는
            </span>
            <br />
            <span className="text-primary-900 text-3xl font-bold">간단</span>
            <span className="text-grayscale-900 text-3xl font-bold">하게</span>
          </div>
        </div>
        <div className="text-center text-grayscale-600 body-1">
          손쉬운 서류 파악과 <br />
          서명까지 확인
        </div>
      </div>
      <div className="w-full py-8 bg-primary-100 flex justify-center items-center gap-4">
        <LandingDoc className="w-48 h-96" />
        <LandingSign className="w-48 h-96" />
      </div>
    </div>
  );
};

export default LandingDocSection;
