// src/pages/signup/Signup.tsx
import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";

const Signup = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<"사장님" | "알바생" | null>(null);

  // Step1에서 회원 유형 선택 시 호출
  const handleSelectType = (type: "사장님" | "알바생") => {
    setUserType(type);
    setStep(2);
  };

  // Step2에서 이전 버튼 눌렀을 때
  const handleBackToStep1 = () => {
    setStep(1);
  };

  return (
    <>
      {step === 1 && <SignupStep1 onSelectType={handleSelectType} />}
      {step === 2 && (
        <SignupStep2 userType={userType} onBack={handleBackToStep1} />
      )}
    </>
  );
};

export default Signup;
