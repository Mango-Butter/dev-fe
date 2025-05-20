import SignatureCanvas from "react-signature-canvas";
import { useRef, useState } from "react";
import Button from "../../../components/common/Button";
import useStoreStore from "../../../stores/storeStore";
import { encryptSignatureBase64 } from "../../../libs/encryption";
import { uploadStaffSignature } from "../../../api/staff/constract.ts";

interface Props {
  onComplete: (data: { base64: string; signatureKey: string }) => void;
}

const SignaturePadSheetStaff = ({ onComplete }: Props) => {
  const sigRef = useRef<SignatureCanvas>(null);
  const { selectedStore } = useStoreStore();
  const [loading, setLoading] = useState(false);

  const handleClear = () => {
    sigRef.current?.clear();
  };

  const handleComplete = async () => {
    if (sigRef.current?.isEmpty()) {
      alert("서명을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const base64 = sigRef.current!.getCanvas().toDataURL("image/png");
      const encrypted = encryptSignatureBase64(base64);

      if (!selectedStore) throw new Error("매장이 선택되지 않았습니다.");

      const signatureKey = await uploadStaffSignature(
        selectedStore.storeId,
        encrypted,
      );

      onComplete({ base64, signatureKey }); // 부모로 전달
    } catch (err) {
      console.error("알바생 서명 업로드 실패", err);
      alert("서명 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <div className="w-full h-60 border border-gray-300 rounded-xl overflow-hidden">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ className: "w-full h-full bg-white" }}
        />
      </div>
      <div className="flex w-full gap-3">
        <Button
          theme="outline"
          className="flex-1"
          onClick={handleClear}
          disabled={loading}
        >
          초기화
        </Button>
        <Button
          theme="secondary"
          className="flex-1"
          onClick={handleComplete}
          disabled={loading}
        >
          {loading ? "업로드 중..." : "완료"}
        </Button>
      </div>
    </div>
  );
};

export default SignaturePadSheetStaff;
