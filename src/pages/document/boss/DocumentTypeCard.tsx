import { useState } from "react";
import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import Button from "../../../components/common/Button.tsx";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import useStoreStore from "../../../stores/storeStore.ts";
import {
  getDocumentDownloadUrl,
  getDocumentViewUrl,
} from "../../../api/boss/document.ts";
import {
  BossRequiredDocumentType,
  documentTypeLabelMap,
  StaffDocumentStatus,
} from "../../../types/document.ts";

interface Props {
  documentType: BossRequiredDocumentType;
  isExpanded: boolean;
  loading: boolean;
  onToggle: () => void;
  staffList: StaffDocumentStatus[];
}

const DocumentTypeCard = ({
  documentType,
  isExpanded,
  onToggle,
  loading,
  staffList,
}: Props) => {
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const [clicked, setClicked] = useState<number | null>(null); // 버튼 중복 클릭 방지용

  const handleView = async (documentId: number) => {
    if (!storeId) return;
    try {
      setClicked(documentId);
      const { url } = await getDocumentViewUrl(storeId, documentId);
      window.open(url, "_blank");
    } catch (e) {
      console.error("문서 보기 실패", e);
    } finally {
      setClicked(null);
    }
  };

  const handleDownload = async (documentId: number) => {
    if (!storeId) return;
    try {
      setClicked(documentId);
      const { url } = await getDocumentDownloadUrl(storeId, documentId);
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("문서 다운로드 실패", e);
    } finally {
      setClicked(null);
    }
  };

  return (
    <div className="bg-white border border-grayscale-200 rounded-xl shadow-sm overflow-hidden">
      {/* 상단 */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-3"
      >
        <div className="flex gap-2 items-center">
          <span className="text-base">
            {documentTypeLabelMap[documentType]}
          </span>
        </div>
        <ArrowIcon direction={isExpanded ? "up" : "down"} className="w-4 h-4" />
      </button>

      {/* 내용 */}
      {isExpanded && (
        <div className="px-4 pb-3">
          {loading ? (
            <span className="text-sm text-gray-400">불러오는 중...</span>
          ) : staffList.length === 0 ? (
            <span className="text-sm text-gray-400">알바생 없음</span>
          ) : (
            <ul className="divide-y divide-grayscale-200">
              {staffList.map((staff) => (
                <li
                  key={staff.staffId}
                  className="flex justify-between items-center py-3"
                >
                  <span className="text-sm">{staff.staffName}</span>
                  {staff.isSubmitted && staff.documentId ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        theme="ghost2"
                        onClick={() => handleView(staff.documentId!)}
                        disabled={clicked === staff.documentId}
                      >
                        보기
                      </Button>
                      <Button
                        size="sm"
                        theme="ghost2"
                        onClick={() => handleDownload(staff.documentId!)}
                        disabled={clicked === staff.documentId}
                      >
                        다운로드
                      </Button>
                    </div>
                  ) : (
                    <ErrorIcon className="w-4 h-4 text-red-500" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentTypeCard;
