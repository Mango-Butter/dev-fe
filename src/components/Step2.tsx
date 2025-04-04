// 📝 Step2.tsx
import { useContractStore } from "../store/contractStore";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";

export default function Step2() {
  const {
    contractTemplate,
    formData,
    updateForm,
    isEditing,
    toggleEdit,
    setStep,
    saveToStore,
  } = useContractStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const content = isEditing ? (
    <textarea
      className="w-full h-[500px] border p-2"
      defaultValue={formData.fullText || contractTemplate}
      onBlur={(e) => updateForm({ fullText: e.target.value })}
    />
  ) : (
    <div
      ref={previewRef}
      className="whitespace-pre-wrap p-4 border bg-white text-black text-sm"
    >
      {formData.fullText || contractTemplate}
    </div>
  );

  const handleCapture = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current);
      setPreviewUrl(canvas.toDataURL("image/png"));
    }
  };

  useEffect(() => {
    if (!isEditing) handleCapture();
  }, [isEditing, formData]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">
        계약서 전체 내용 {isEditing ? "수정" : "미리보기"}
      </h2>
      <div className="flex flex-col gap-4">
        <div>
          {content}
          <div className="space-x-2 mt-4">
            <button className="btn" onClick={toggleEdit}>
              {isEditing ? "수정완료" : "내용 수정하기"}
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">계약서 이미지 미리보기</h3>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="계약서 이미지 미리보기"
              className="border w-full"
            />
          ) : (
            <p className="text-gray-500">미리보기를 생성 중입니다...</p>
          )}
        </div>
      </div>
      <button
        className="btn"
        onClick={() => {
          saveToStore();
          setStep(3);
        }}
      >
        다음
      </button>
      <button className="btn" onClick={() => setStep(1)}>
        이전
      </button>
    </div>
  );
}
