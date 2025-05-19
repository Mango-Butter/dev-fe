import { useEffect, useState } from "react";
import {
  BossRequiredDocumentType,
  RequiredDocumentSetting,
  documentTypeLabelMap,
} from "../../../types/document.ts";
import { setRequiredDocuments } from "../../../api/boss/document.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import Button from "../../../components/common/Button.tsx";
import {
  CheckboxFilled,
  CheckboxOff,
} from "../../../components/icons/CheckboxIcon.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";

interface Props {
  initialSettings: RequiredDocumentSetting[];
  onSaveSuccess: () => void;
}

const ALL_DOCUMENT_TYPES: BossRequiredDocumentType[] = [
  "RESIDENT_REGISTRATION",
  "BANK_ACCOUNT",
  "ID_CARD",
  "HEALTH_CERTIFICATE",
];

const RequiredDocumentSheet = ({ initialSettings, onSaveSuccess }: Props) => {
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const { setBottomSheetOpen } = useBottomSheetStore();
  const [settings, setSettings] = useState<
    Record<BossRequiredDocumentType, boolean>
  >({} as Record<BossRequiredDocumentType, boolean>);

  useEffect(() => {
    const initialMap = Object.fromEntries(
      initialSettings.map((doc) => [doc.documentType, doc.isRequired]),
    ) as Record<BossRequiredDocumentType, boolean>;

    const filledWithDefaults = Object.fromEntries(
      ALL_DOCUMENT_TYPES.map((type) => [type, initialMap[type] ?? false]),
    ) as Record<BossRequiredDocumentType, boolean>;

    setSettings(filledWithDefaults);
  }, [initialSettings]);

  const toggle = (type: BossRequiredDocumentType) => {
    setSettings((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleSave = async () => {
    if (!storeId) return;

    const payload: RequiredDocumentSetting[] = ALL_DOCUMENT_TYPES.map(
      (type) => ({
        documentType: type,
        isRequired: settings[type],
      }),
    );

    try {
      await setRequiredDocuments(storeId, payload);
      onSaveSuccess();
      setBottomSheetOpen(false);
    } catch (e) {
      console.error("필수 서류 설정 저장 실패", e);
      alert("저장에 실패했습니다.");
      setBottomSheetOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {ALL_DOCUMENT_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => toggle(type)}
          className="flex justify-between items-center border border-grayscale-200 rounded-lg px-4 py-4 bg-white"
        >
          <span className="body-2 text-grayscale-800">
            {documentTypeLabelMap[type]}
          </span>
          {settings[type] ? <CheckboxFilled /> : <CheckboxOff />}
        </button>
      ))}

      <Button
        theme="primary"
        size="md"
        onClick={handleSave}
        className="w-full my-4"
      >
        저장하기
      </Button>
    </div>
  );
};

export default RequiredDocumentSheet;
