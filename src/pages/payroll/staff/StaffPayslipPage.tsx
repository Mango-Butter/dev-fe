import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { useLayout } from "../../../hooks/useLayout.ts";
import { StaffPayrollResponse } from "../../../types/payroll.ts";
import {
  fetchPayslipDownloadLink,
  getStaffPayroll,
} from "../../../api/staff/payroll.ts";
import DownloadIcon from "../../../components/icons/DownloadIcon.tsx";
import ErrorIcon from "../../../components/icons/ErrorIcon.tsx";
import useClickOutside from "../../../hooks/useClickOutside.ts";

const StaffPayslipPage = () => {
  const { selectedStore } = useStaffStoreStore();
  const [searchParams] = useSearchParams();
  const [payslip, setPayslip] = useState<StaffPayrollResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useClickOutside(tooltipRef, () => setShowTooltip(false));

  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const handleDownload = async () => {
    if (!selectedStore || !info?.payslipId) return;

    try {
      const { url } = await fetchPayslipDownloadLink(
        selectedStore.storeId,
        info.payslipId,
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = `payslip_${staffName}_${dayjs(month).format("YYYYMM")}.pdf`;
      a.click();
    } catch (err) {
      console.error("급여명세서 다운로드 실패", err);
    }
  };

  const downloadButton =
    payslip?.info?.payslipId && selectedStore ? (
      <button onClick={handleDownload}>
        <DownloadIcon />
      </button>
    ) : (
      <div className="relative" ref={tooltipRef}>
        <button onClick={() => setShowTooltip((prev) => !prev)}>
          <ErrorIcon />
        </button>
        {showTooltip && (
          <div
            className={`
            absolute right-0 mt-2 w-max
            flex items-center justify-center text-center
            bg-black text-white text-xs rounded px-3 py-2 shadow-md z-10
            transition-all duration-500 ease-out
            opacity-100 translate-y-0
            animate-slide-down
          `}
          >
            급여명세서가 <br /> 생성되지 않았습니다.
          </div>
        )}
      </div>
    );

  useLayout({
    title: "급여명세서 미리보기",
    theme: "plain",
    headerVisible: true,
    bottomNavVisible: false,
    onBack: () => history.back(),
    rightIcon: downloadButton,
  });

  useEffect(() => {
    const load = async () => {
      if (!selectedStore) return;

      const month = searchParams.get("month");

      setLoading(true);
      try {
        let result: StaffPayrollResponse;

        if (month) {
          const formattedMonth = dayjs(month).format("YYYY-MM");
          result = await getStaffPayroll(selectedStore.storeId, formattedMonth);
        } else {
          toast.error("잘못된 접근입니다.");
          return;
        }
        console.log(result);
        setPayslip(result);
      } catch (e) {
        console.error("명세서 조회 실패", e);
        toast.error("급여명세서 조회 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchParams, selectedStore]);

  if (loading) {
    return (
      <div className="text-center py-20 text-grayscale-500">불러오는 중...</div>
    );
  }
  if (!payslip) {
    return (
      <div className="text-center py-20 text-grayscale-500">
        급여명세서를 찾을 수 없습니다.
      </div>
    );
  }

  const { data, info } = payslip;
  const {
    staffName,
    bankCode,
    account,
    month,
    baseAmount,
    weeklyAllowance,
    totalCommutingAllowance,
    totalAmount,
    withholdingTax,
    netAmount,
    withholdingType,
  } = data;

  return (
    <div className="w-full px-5 py-6 flex flex-col gap-4 pb-10 bg-primary-100 h-full">
      {/* 상단 프로필 */}
      <div className="flex justify-between items-start bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-base">{staffName}</p>
            <div className="flex gap-3">
              <span className="body-3 text-gray-500">{bankCode}</span>
              <span className="body-3 text-gray-500">{account}</span>
            </div>
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {dayjs(month).format("YYYY년 M월")}
        </span>
      </div>

      {/* 지급 영역 */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-2">
        <p className="font-semibold text-sm text-gray-800">
          총 급여
          <span className="text-green-600 float-right">
            {totalAmount.toLocaleString()}원
          </span>
        </p>
        <div className="text-sm text-gray-700 space-y-1">
          <div className="flex justify-between">
            <span>기본급</span>
            <span>{baseAmount.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>주휴수당</span>
            <span>{weeklyAllowance.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between">
            <span>교통비</span>
            <span>{totalCommutingAllowance.toLocaleString()}원</span>
          </div>
        </div>
      </section>

      {/* 공제 영역 */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-2">
        <p className="font-semibold text-sm text-gray-800">
          공제 총액
          <span className="text-red-500 float-right">
            -{withholdingTax.toLocaleString()}원
          </span>
        </p>
        {withholdingType !== "NONE" && (
          <div className="text-sm text-gray-700 space-y-1">
            <div className="flex justify-between">
              <span>
                {withholdingType === "INCOME_TAX" ? "원천징수" : "4대보험"}
              </span>
              <span>{withholdingTax.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </section>

      {/* 최종 금액 영역 */}
      <section className="bg-white rounded-xl p-4 shadow-sm text-sm text-gray-700 space-y-2">
        <div className="flex justify-end gap-3 text-grayscale-500">
          <span>총 급여</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </div>
        <div className="flex justify-end gap-3 text-grayscale-500">
          <span>공제 총액</span>
          <span>-{withholdingTax.toLocaleString()}원</span>
        </div>
        <div className="flex justify-end gap-3 pt-2 heading-2 border-t border-gray-100">
          실 지급액
          <span className="text-xl font-bold ml-1">
            {netAmount.toLocaleString()}원
          </span>
        </div>
      </section>
    </div>
  );
};

export default StaffPayslipPage;
