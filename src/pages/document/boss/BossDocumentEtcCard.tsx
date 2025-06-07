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
import { isValidStoreId } from "../../../utils/store.ts";
import Spinner from "../../../components/common/Spinner.tsx";

interface Props {
  documentType: BossRequiredDocumentType;
  isExpanded: boolean;
  loading: boolean;
  onToggle: () => void;
  staffList: StaffDocumentStatus[];
}

const BossDocumentEtcCard = ({
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
    if (!isValidStoreId(storeId)) {
      setClicked(null);
      return;
    }

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
    if (!isValidStoreId(storeId)) {
      setClicked(null);
      return;
    }

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
    <div className="w-full bg-white border border-grayscale-200 rounded-xl shadow-sm overflow-hidden">
      {/* 상단 */}
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center px-4 py-5"
      >
        <span className="body-2">{documentTypeLabelMap[documentType]}</span>
        <ArrowIcon direction={isExpanded ? "up" : "down"} className="w-4 h-4" />
      </button>

      {/* 내용 */}
      {isExpanded && (
        <div className="w-full flex justify-center px-4 pb-1">
          {loading ? (
            <Spinner />
          ) : staffList.length === 0 ? (
            <span className="text-sm text-gray-400 text-center py-2">
              알바생 없음
            </span>
          ) : (
            <ul className="w-full divide-y divide-grayscale-200">
              {staffList.map((staff) => (
                <li
                  key={staff.staffId}
                  className="flex w-full justify-between items-center py-3"
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
                    <ErrorIcon className="w-4 h-4" fill="#f33f3f" />
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

export default BossDocumentEtcCard;
