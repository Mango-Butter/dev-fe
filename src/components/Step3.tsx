// Step3.tsx
import SignatureCanvas from "react-signature-canvas";
import { useRef } from "react";
import { useContractStore } from "../store/contractStore";

export default function Step3() {
  const { setSignature, setStep, saveToStore } = useContractStore();
  const sigRef = useRef<SignatureCanvas>(null);

  const handleSave = () => {
    if (!sigRef.current) return;
    const dataURL = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    setSignature(dataURL);
    saveToStore();
    setStep(4);
  };

  return (
    <div>
      <h2 className="font-bold text-lg mb-2">전자서명</h2>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: "border" }}
      />
      <div className="space-x-2 mt-4">
        <button className="btn" onClick={() => sigRef.current?.clear()}>
          초기화
        </button>
        <button className="btn" onClick={handleSave}>
          다음
        </button>
      </div>
    </div>
  );
}
