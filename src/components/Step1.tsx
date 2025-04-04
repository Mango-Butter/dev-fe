// 📝 Step1.tsx
import { useContractStore } from "../store/contractStore";

const standardTemplate = `표준근로계약서\n(이하 “사업주”라 함)과(와) (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.\n...기타 조항들`;
const partTimeTemplate = `단시간근로자 표준근로계약서\n(이하 “사업주”라 함)과(와) (이하 “근로자”라 함)은 다음과 같이 근로계약을 체결한다.\n...기타 조항들`;

export default function Step1() {
  const { setContractType, setStep, setTemplate, loadFromStore } =
    useContractStore();

  const handleSelect = (type: "standard" | "partTime") => {
    setContractType(type);
    setTemplate(type === "standard" ? standardTemplate : partTimeTemplate);
    loadFromStore();
    setStep(2);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">근로계약서 종류 선택</h1>
      <div className="space-x-4">
        <button className="btn" onClick={() => handleSelect("standard")}>
          표준근로계약서
        </button>
        <button className="btn" onClick={() => handleSelect("partTime")}>
          단시간근로계약서
        </button>
      </div>
    </div>
  );
}
