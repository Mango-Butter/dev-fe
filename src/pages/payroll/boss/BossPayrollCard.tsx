// src/components/payroll/BossAutoTransferStaticCard.tsx
import {
  ConfirmedTransferItem,
  MonthlyPayrollItem,
} from "../../../types/payroll.ts";
import MoreIcon from "../../../components/common/MoreIcon.tsx";
import useClickOutside from "../../../hooks/useClickOutside.ts";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { fetchPayslipDownloadLink } from "../../../api/boss/payroll.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import { cn } from "../../../libs";

interface Props {
  item: ConfirmedTransferItem | MonthlyPayrollItem;
}

const stateStyleMap = {
  COMPLETED: {
    label: "송금 완료",
    text: "text-green-700",
  },
  PENDING: {
    label: "송금 대기 중",
    text: "text-yellow-700",
  },
  FAILED: {
    label: "송금 실패",
    text: "text-red-700",
  },
} as const;

const BossPayrollCard = ({ item }: Props) => {
  const { staff, data, info } = item;
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  useClickOutside(popupRef, () => setPopupOpen(false));

  const transferStateUi = info?.transferState
    ? stateStyleMap[info.transferState]
    : null;

  const handlePreviewPayroll = () => {
    setPopupOpen(false);

    if (info?.payrollId) {
      navigate(`/boss/payroll/payslip?payrollId=${info.payrollId}`);
      return;
    }

    if (staff?.staffId && data?.month) {
      navigate(
        `/boss/payroll/payslip?staffId=${staff.staffId}&month=${data.month}`,
      );
      return;
    }

    toast.error("급여명세서 정보를 확인할 수 없습니다.");
  };

  const handleDownloadPdf = async () => {
    setPopupOpen(false);
    if (!selectedStore) {
      toast.error("매장 정보가 확인되지 않았습니다.");
      return;
    }
    if (!info || !info.payslipId) {
      toast.error("급여명세서 정보가 없습니다.");
      return;
    }
    try {
      const { url } = await fetchPayslipDownloadLink(
        selectedStore.storeId,
        info.payslipId,
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = `${staff.name + data.month + " 월 급여명세서"}.pdf`;
      a.click();
    } catch (e) {
      console.error("다운로드 오류", e);
    }
  };
  return (
    <div className="flex w-full flex-col items-start gap-3 relative justify-between p-4 border border-grayscale-200 rounded-xl shadow-sm bg-white">
      <div className="flex w-full justify-between items-start">
        <div className="flex items-start justify-between w-full">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-grayscale-200 overflow-hidden">
              {staff.profileImageUrl && (
                <img
                  src={staff.profileImageUrl}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="title-1 mb-1">{staff.name}</p>
              {data.bankCode && data.account && (
                <p className="body-4 text-grayscale-500">
                  {data.bankCode} {data.account}
                </p>
              )}
            </div>
          </div>
        </div>
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
      </div>
      <div className="w-full text-xs text-grayscale-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="body-3 w-14">총 근무시간</span>
          <span className="body-3">{data.totalTime}시간</span>
        </div>
        <div className="w-full flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className="body-3 w-14">실 지급액</span>
            <span className="body-3 text-black">
              {data.netAmount.toLocaleString()}원
            </span>
          </div>
          {transferStateUi ? (
            <span className={cn("body-4", transferStateUi.text)}>
              {transferStateUi.label}
            </span>
          ) : (
            <span className="body-4 text-grayscale-500">자동송금 미사용</span>
          )}
        </div>
      </div>
      <AnimatePresence>
        {popupOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-3 top-12 z-50 w-[9rem] rounded-md border bg-white shadow-lg border-grayscale-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="w-full px-4 py-2 text-center body-3 text-grayscale-600 hover:bg-grayscale-100"
              onClick={handlePreviewPayroll}
            >
              자세히 보기
            </button>
            {info && info.payslipId && (
              <button
                className="w-full px-4 py-2 text-center body-3 text-grayscale-600 hover:bg-grayscale-100"
                onClick={handleDownloadPdf}
              >
                급여명세서 다운로드
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BossPayrollCard;
