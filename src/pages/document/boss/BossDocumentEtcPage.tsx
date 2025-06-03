import { useEffect, useState } from "react";
import Button from "../../../components/common/Button";
import {
  RequiredDocumentSetting,
  StaffDocumentStatus,
} from "../../../types/document";
import useStoreStore from "../../../stores/storeStore";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import {
  getRequiredDocuments,
  getStaffDocumentStatuses,
} from "../../../api/boss/document.ts";
import BossDocumentEtcCard from "./BossDocumentEtcCard.tsx";
import RequiredDocumentSheet from "./RequiredDocumentSheet.tsx";
import { isValidStoreId } from "../../../utils/store.ts";

const BossDocumentEtcPage = () => {
  const { selectedStore } = useStoreStore();
  const { setBottomSheetContent } = useBottomSheetStore();

  const [requiredDocs, setRequiredDocs] = useState<RequiredDocumentSetting[]>(
    [],
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [staffDocs, setStaffDocs] = useState<
    Record<string, StaffDocumentStatus[]>
  >({});
  const [loadingDocType, setLoadingDocType] = useState<string | null>(null);

  const storeId = selectedStore?.storeId;

  useEffect(() => {
    if (!isValidStoreId(storeId)) return;

    getRequiredDocuments(storeId).then((res) => {
      setRequiredDocs(res.result);
    });
  }, [storeId]);

  const handleToggle = async (documentType: string) => {
    if (!isValidStoreId(storeId)) return;

    const isOpen = expanded[documentType];
    setExpanded((prev) => ({ ...prev, [documentType]: !isOpen }));

    if (!isOpen && !staffDocs[documentType]) {
      setLoadingDocType(documentType);
      const res = await getStaffDocumentStatuses(storeId, documentType);
      setStaffDocs((prev) => ({ ...prev, [documentType]: res.result }));
      setLoadingDocType(null);
    }
  };

  const openBottomSheet = () => {
    setBottomSheetContent(
      <RequiredDocumentSheet
        initialSettings={requiredDocs}
        onSaveSuccess={() => {
          setBottomSheetContent(null);
          if (isValidStoreId(storeId)) {
            getRequiredDocuments(storeId).then((res) => {
              setRequiredDocs(res.result);
            });
          }
        }}
      />,
      {
        title: "필수 서류 설정",
        closeOnClickOutside: true,
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="w-full flex justify-center items-center">
        <Button
          size="sm"
          theme="outline"
          onClick={openBottomSheet}
          className="w-full"
        >
          필수 서류 설정
        </Button>
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-2">
        {requiredDocs
          .filter((doc) => doc.isRequired) // ← 필수 서류만 추림
          .map((doc) => (
            <BossDocumentEtcCard
              key={doc.documentType}
              documentType={doc.documentType}
              isExpanded={expanded[doc.documentType]}
              onToggle={() => handleToggle(doc.documentType)}
              staffList={staffDocs[doc.documentType] || []}
              loading={loadingDocType === doc.documentType}
            />
          ))}
      </div>
    </div>
  );
};

export default BossDocumentEtcPage;
