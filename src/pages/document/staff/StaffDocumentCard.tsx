import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../libs";
import useClickOutside from "../../../hooks/useClickOutside";
import MoreIcon from "../../../components/common/MoreIcon.tsx";
import PaperAirplaneIcon from "../../../components/icons/PaperAirplainIcon.tsx";
import { formatFullDateWithTime } from "../../../utils/date.ts";
import {
  documentLabelMap,
  StaffDocumentSummary,
} from "../../../types/document.ts";
import DocumentSubmitBottomSheetContent from "./DocumentSubmitBottomSheetContent.tsx";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { useDocumentStore } from "../../../stores/staff/documentStore.ts";
import {
  deleteStaffDocument,
  getStaffDocumentDownloadUrl,
  getStaffDocumentViewUrl,
} from "../../../api/staff/document.ts";
import { parseDateStringToKST } from "../../../libs/date.ts";

interface Props {
  document: StaffDocumentSummary;
}

const statusStyleMap = {
  true: "text-green-500 border border-green-200 bg-green-50", // 제출 완료
  false: "text-grayscale-400 border border-grayscale-200 bg-grayscale-100", // 미제출
};

const StaffDocumentCard = ({ document: doc }: Props) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  useClickOutside(popupRef, () => setPopupOpen(false));

  const { documentType, isSubmitted, expiresAt, documentId } = doc;
  const { setBottomSheetContent } = useBottomSheetStore();
  const { selectedStore } = useStaffStoreStore();
  const { fetchDocuments } = useDocumentStore();

  const handleSendButtonClick = () => {
    setBottomSheetContent(<DocumentSubmitBottomSheetContent document={doc} />, {
      title: documentLabelMap[doc.documentType],
      leftButtonIcon: null,
      rightButtonIcon: null,
      closeOnClickOutside: true,
    });
  };

  const handleViewPdf = async () => {
    setPopupOpen(false);
    try {
      if (!selectedStore || !documentId) throw new Error("정보 부족");

      const { url } = await getStaffDocumentViewUrl(
        selectedStore.storeId,
        documentId,
      );
      window.open(url, "_blank");
    } catch (e) {
      console.error("PDF 보기 오류", e);
    }
  };

  const handleDownloadPdf = async () => {
    setPopupOpen(false);
    try {
      if (!selectedStore || !documentId) throw new Error("정보 부족");

      const { url } = await getStaffDocumentDownloadUrl(
        selectedStore.storeId,
        documentId,
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentLabelMap[doc.documentType]}.pdf`;
      a.click();
    } catch (e) {
      console.error("다운로드 오류", e);
    }
  };

  const handleDeleteDocument = async () => {
    setPopupOpen(false);
    try {
      if (!selectedStore || !documentId) throw new Error("정보 부족");

      const confirmDelete = confirm(
        `${documentLabelMap[doc.documentType]} 제출 파일을 삭제하시겠습니까?`,
      );
      if (!confirmDelete) return;

      await deleteStaffDocument(selectedStore.storeId, documentId);
      await fetchDocuments();
      alert("삭제되었습니다.");
    } catch (err) {}
  };

  return (
    <div
      className={cn(
        "relative flex justify-between items-center rounded-xl bg-white px-4 py-3 cursor-default",
      )}
    >
      <div className="flex flex-col">
        <span
          className={cn(
            "body-4 px-2 py-0.5 rounded-full mb-2 max-w-fit",
            statusStyleMap[String(isSubmitted) as "true" | "false"],
          )}
        >
          {isSubmitted ? "제출 완료" : "미제출"}
        </span>
        <div className="flex flex-col pl-1">
          <span className="title-2">{documentLabelMap[documentType]}</span>
          {expiresAt && (
            <span className="body-4 text-grayscale-500">
              유효기간:{" "}
              {formatFullDateWithTime(parseDateStringToKST(expiresAt))}
            </span>
          )}
        </div>
      </div>

      {isSubmitted ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPopupOpen((prev) => !prev);
          }}
          className="p-1"
        >
          <MoreIcon className="w-5 h-5 text-grayscale-500" />
        </button>
      ) : (
        <button type="button" onClick={handleSendButtonClick} className="p-1">
          <PaperAirplaneIcon className="w-5 h-5 text-grayscale-500" />
        </button>
      )}

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-3 top-12 z-50 w-32 rounded-md border bg-white shadow-lg border-grayscale-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full px-4 py-2 text-center text-sm hover:bg-grayscale-100"
              onClick={handleViewPdf}
            >
              문서 보기
            </button>
            <button
              className="w-full px-4 py-2 text-center text-sm hover:bg-grayscale-100"
              onClick={handleDownloadPdf}
            >
              다운로드
            </button>
            <button
              className="w-full px-4 py-2 text-center text-sm hover:bg-grayscale-100 text-warning"
              onClick={handleDeleteDocument}
            >
              삭제
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffDocumentCard;
