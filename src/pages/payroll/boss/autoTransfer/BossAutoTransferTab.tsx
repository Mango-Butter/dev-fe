// src/pages/payroll/BossWithhodingTab.tsx
import { useEffect, useState } from "react";
import useStoreStore from "../../../../stores/storeStore.ts";
import Button from "../../../../components/common/Button.tsx";
import { useNavigate } from "react-router-dom";
import {
  fetchConfirmedTransfers,
  fetchPayrollSummary,
} from "../../../../api/boss/payroll.ts";
import {
  ConfirmedTransferItem,
  PayrollSummary,
} from "../../../../types/payroll.ts";
import BossPayrollCard from "../BossPayrollCard.tsx";
import ResetIcon from "../../../../components/icons/ResetIcon.tsx";
import { getKSTDate } from "../../../../libs/date.ts";
import { toast } from "react-toastify";

const BossAutoTransferTab = () => {
  const { selectedStore } = useStoreStore();
  const [autoTransferInfo, setAutoTransferInfo] = useState<
    ConfirmedTransferItem[]
  >([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getNowMonth = () => {
    const now = getKSTDate();
    return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
  };
  const getMonthLabel = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    return `${year}년 ${parseInt(month)}월분 급여`;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      try {
        const [confirmResult, summaryResult] = await Promise.all([
          fetchConfirmedTransfers(selectedStore.storeId),
          fetchPayrollSummary(selectedStore.storeId),
        ]);
        setAutoTransferInfo(confirmResult);
        setSummary(summaryResult);
        console.log(summaryResult);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStore]);

  const handleAutoTransferEdit = () => {
    const allPending = autoTransferInfo.every(
      (item) => item.info.transferState === "PENDING",
    );

    if (allPending) {
      navigate("/boss/payroll/edit");
    } else {
      toast.info("자동송금이 이미 시작되었습니다.");
    }
  };

  const renderTransferStatusMessage = () => {
    if (!summary) return null;

    const label = getMonthLabel(getNowMonth());
    const now = getKSTDate();
    const transferDate = new Date(summary.transferDate);
    const diffTime = transferDate.getTime() - now.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (summary.isTransferred) {
      case "COMPLETED":
        return (
          <section className="w-full flex flex-col gap-2">
            <span className="body-2">{label}</span>
            <p className="heading-1">
              지난달 급여가
              <br />
              자동송금되었습니다.
            </p>
            <p className="body-2 text-grayscale-500">
              급여명세서 및 자동송금 내역은
              <br />
              급여 내역 탭에서 확인할 수 있어요.
            </p>
          </section>
        );

      case "PENDING":
        return (
          <section className="w-full flex flex-col gap-2">
            <span className="body-2">{label}</span>
            {remainingDays === 0 ? (
              <p className="heading-1">
                급여지급일
                <br />
                <span className="text-warning">D-Day</span>
              </p>
            ) : (
              <p className="heading-1">
                급여지급일까지
                <br />
                <span className="text-warning">
                  D-{remainingDays}일 남았습니다
                </span>
              </p>
            )}
            <p className="body-2 text-grayscale-500">
              자동송금 설정이 완료되었어요.
              <br />
              설정된 정보로 송금이 진행됩니다.
            </p>
          </section>
        );

      case "NOT_YET":
        return (
          <section className="w-full flex flex-col gap-2">
            <span className="body-2">{label}</span>
            {remainingDays === 0 ? (
              <p className="heading-1">
                급여지급일
                <br />
                <span className="text-warning">D-Day</span>
              </p>
            ) : (
              <p className="heading-1">
                급여지급일까지
                <br />
                <span className="text-warning">
                  D-{remainingDays}일 남았습니다
                </span>
              </p>
            )}
            <p className="body-2 text-grayscale-500">
              급여지급일까지 자동송금 인원을 확정해주세요.
              <br />
              송금 이후에는 수정이 불가능합니다.
            </p>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 상단 급여일 안내 */}
      {renderTransferStatusMessage()}

      <div className="flex w-full justify-end">
        <Button
          size="sm"
          theme="outline"
          icon={<ResetIcon className="w-4 h-4" />}
          onClick={handleAutoTransferEdit}
          className="text-grayscale-600 body-3"
        >
          송금정보 갱신
        </Button>
      </div>

      {/* 목록 */}
      <section>
        {loading ? (
          <div className="text-center py-10 text-grayscale-500">
            불러오는 중...
          </div>
        ) : autoTransferInfo.length === 0 ? (
          <div className="text-center py-10 text-grayscale-500">
            급여 정보가 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {autoTransferInfo.map((item) => (
              <BossPayrollCard key={item.staff.staffId} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BossAutoTransferTab;
