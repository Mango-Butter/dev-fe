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
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx";

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
  const [isPageLoading, setIsPageLoading] = useState(true);

  const storeId = selectedStore?.storeId;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!isValidStoreId(storeId)) return;

      try {
        setIsPageLoading(true);
        const requiredRes = await getRequiredDocuments(storeId);
        const required = requiredRes.result;
        setRequiredDocs(required);

        const docTypes = required
          .filter((d) => d.isRequired)
          .map((d) => d.documentType);

        const staffResults: Record<string, StaffDocumentStatus[]> = {};
        for (const docType of docTypes) {
          const res = await getStaffDocumentStatuses(storeId, docType);
          staffResults[docType] = res.result;
        }
        setStaffDocs(staffResults);
      } catch (e) {
        console.error("문서 초기 데이터 로딩 실패", e);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchInitialData();
  }, [storeId]);

  const handleToggle = (documentType: string) => {
    setExpanded((prev) => ({ ...prev, [documentType]: !prev[documentType] }));
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

  if (isPageLoading) return <FullScreenLoading />;

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
            />
          ))}
      </div>
    </div>
  );
};

export default BossDocumentEtcPage;
