// src/pages/signup/Signup.tsx
import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import { useUserStore } from "../../stores/userStore.ts";
import { Navigate } from "react-router-dom";

const Signup = () => {
  const user = useUserStore((state) => state.user);

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<"BOSS" | "STAFF">("BOSS");

  if (user?.role !== "UNASSIGNED") {
    return <Navigate to="/" replace />;
  }

  // Step1에서 회원 유형 선택 시 호출
  const handleSelectRole = (role: "BOSS" | "STAFF") => {
    setRole(role);
    setStep(2);
  };

  // Step2에서 이전 버튼 눌렀을 때
  const handleBackToStep1 = () => {
    setStep(1);
  };

  return (
    <>
      {step === 1 && <SignupStep1 onSelectRole={handleSelectRole} />}
      {step === 2 && <SignupStep2 role={role} onBack={handleBackToStep1} />}
    </>
  );
};

export default Signup;
