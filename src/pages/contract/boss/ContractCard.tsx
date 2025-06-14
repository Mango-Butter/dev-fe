import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../libs";
import {
  ContractSimple,
  StaffSimple,
  statusLabelMap,
} from "../../../types/contract";
import useClickOutside from "../../../hooks/useClickOutside";
import MoreIcon from "../../../components/common/MoreIcon.tsx";
import PaperAirplaneIcon from "../../../components/icons/PaperAirplainIcon.tsx";
import useStoreStore from "../../../stores/storeStore.ts";
import {
  deleteContract,
  fetchContractPdfDownloadUrl,
  fetchContractPdfViewUrl,
} from "../../../api/boss/contract.ts";
import { formatFullDateWithTime } from "../../../utils/date.ts";
import useSelectedStaffStore from "../../../stores/selectedStaffStore.ts";
import { parseDateStringToKST } from "../../../libs/date.ts";
import { toast } from "react-toastify";
import { showConfirm } from "../../../libs/showConfirm.ts";
import { isValidStoreId } from "../../../utils/store.ts";

interface Props {
  contract: ContractSimple & { staff: StaffSimple };
  onDelete: () => void;
}

const statusStyleMap: Record<ContractSimple["status"], string> = {
  COMPLETED: "text-green-500 border border-green-200 bg-green-50",
  PENDING_STAFF_SIGNATURE:
    "text-yellow-600 border border-yellow-200 bg-yellow-50",
  NOT_CREATED:
    "text-grayscale-400 border border-grayscale-200 bg-grayscale-100",
};

const ContractCard = ({ contract, onDelete }: Props) => {
  const navigate = useNavigate();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const { setSelectedStaffId } = useSelectedStaffStore();
  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  useClickOutside(popupRef, () => setPopupOpen(false));

  const handleClick = () => {
    if (contract.status !== "NOT_CREATED" && contract.contractId) {
      navigate(`/boss/contract/${contract.contractId}`);
    }
  };

  // PDF 보기
  const handleViewPdf = async () => {
    if (!isValidStoreId(storeId) || !contract.contractId) {
      setPopupOpen(false);
      return;
    }
    try {
      const { url } = await fetchContractPdfViewUrl(
        storeId,
        contract.contractId,
      );
      navigate(`/pdf-viewer?url=${encodeURIComponent(url)}`);
    } catch (err) {
      console.error("PDF 보기 오류:", err);
    } finally {
      setPopupOpen(false);
    }
  };

  // PDF 다운로드
  const handleDownloadPdf = async () => {
    if (!isValidStoreId(storeId) || !contract.contractId) {
      setPopupOpen(false);
      return;
    }
    try {
      const { url } = await fetchContractPdfDownloadUrl(
        storeId,
        contract.contractId,
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("PDF 다운로드 오류:", err);
    } finally {
      setPopupOpen(false);
    }
  };

  const handleDeleteContract = async () => {
    if (!isValidStoreId(storeId) || !contract.contractId) {
      setPopupOpen(false);
      return;
    }

    const confirmed = await showConfirm({
      title: "근로계약서를 삭제하시겠습니까?",
      text: "삭제된 계약서는 복구할 수 없습니다.",
      confirmText: "삭제",
      cancelText: "취소",
      icon: "warning",
    });

    if (!confirmed) return;

    try {
      await deleteContract(storeId, contract.contractId);
      toast.success("근로계약서가 삭제되었습니다.");
      onDelete();
    } catch (error) {
      console.error("계약서 삭제 오류:", error);
      toast.error("계약서 삭제에 실패했습니다.");
    } finally {
      setPopupOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "relative flex justify-between items-center rounded-xl bg-white px-4 py-3",
        contract.status === "NOT_CREATED" ? "cursor-default" : "cursor-pointer",
      )}
      onClick={handleClick}
    >
      <div className="flex flex-col">
        <span
          className={cn(
            "body-4 px-2 py-0.5 rounded-full mb-2 max-w-fit",
            statusStyleMap[contract.status],
          )}
        >
          {statusLabelMap[contract.status]}
        </span>
        <div className="flex flex-col pl-1">
          <span className="title-2">{contract.staff.name} 근로계약서</span>

          {contract.modifiedAt && (
            <span className="body-4 text-grayscale-500">
              {formatFullDateWithTime(
                parseDateStringToKST(contract.modifiedAt),
              )}
            </span>
          )}
        </div>
      </div>

      {contract.status !== "NOT_CREATED" ? (
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
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedStaffId(String(contract.contractId));
            navigate("/boss/contract/register");
          }}
          className="p-1"
        >
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
              PDF로 보기
            </button>
            <button
              className="w-full px-4 py-2 text-center text-sm hover:bg-grayscale-100"
              onClick={handleDownloadPdf}
            >
              다운로드
            </button>
            <button
              className="w-full px-4 py-2 text-center text-sm hover:bg-grayscale-100 text-warning"
              onClick={handleDeleteContract}
            >
              삭제
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContractCard;
