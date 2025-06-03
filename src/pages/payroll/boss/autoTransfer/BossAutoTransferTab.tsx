// src/pages/payroll/BossWithhodingTab.tsx
import { useEffect, useState } from "react";
import useStoreStore from "../../../../stores/storeStore.ts";
import Button from "../../../../components/common/Button.tsx";
import { getRemainingDays } from "../../../../utils/date.ts";
import { useNavigate } from "react-router-dom";
import {
  fetchConfirmedTransfers,
  fetchPayrollSettings,
} from "../../../../api/boss/payroll.ts";
import {
  ConfirmedTransferItem,
  BossPayrollSettingsResponse,
} from "../../../../types/payroll.ts";
import BossPayrollCard from "../BossPayrollCard.tsx";
import ResetIcon from "../../../../components/icons/ResetIcon.tsx";
import { getKSTDate } from "../../../../libs/date.ts";

const BossAutoTransferTab = () => {
  const { selectedStore } = useStoreStore();
  const [autoTransferInfo, setAutoTransferInfo] = useState<
    ConfirmedTransferItem[]
  >([]);
  const [settings, setSettings] = useState<BossPayrollSettingsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getNowMonth = () => {
    const now = getKSTDate();
    return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
  };

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      try {
        const [confirmResult, settingsResult] = await Promise.all([
          fetchConfirmedTransfers(selectedStore.storeId),
          fetchPayrollSettings(selectedStore.storeId),
        ]);
        setAutoTransferInfo(confirmResult);
        setSettings(settingsResult);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStore]);

  const handleAutoTransferEdit = () => {
    navigate("/boss/payroll/edit");
  };

  const getRemainingDaysStyle = (remaining: number): string => {
    if (remaining > 7) return "text-black";
    if (remaining > 3) return "text-delay";
    return "text-warning";
  };

  const remainingDays =
    settings && settings.transferDate !== null
      ? getRemainingDays(settings.transferDate)
      : null;

  const remainingDaysStyle =
    remainingDays !== null ? getRemainingDaysStyle(remainingDays) : "";

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 상단 급여일 안내 */}
      {settings && remainingDays !== null && (
        <section className="w-full flex flex-col gap-2">
          <input
            type="month"
            value={getNowMonth()}
            disabled={true}
            className="title-1 bg-white"
          />
          {remainingDays > 0 ? (
            <>
              <p className="heading-1">
                이번달 급여지급일이
                <br />
                지났습니다.
              </p>
              <p className="body-2 text-grayscale-500">
                이전 자동송금내역 및 급여명세서는 <br />
                급여 내역 탭에서 확인해 주세요.
              </p>
            </>
          ) : remainingDays === 0 ? (
            <>
              <p className="heading-1">
                급여지급일
                <br />
                <span className={remainingDaysStyle}>D-Day</span>
              </p>
              <p className="body-2 text-grayscale-500">
                급여지급일까지 자동송금 인원을 확정해주세요. <br />
                송금 이후 수정은 반영되지 않습니다.
              </p>
            </>
          ) : (
            <>
              <p className="heading-1">
                급여지급일까지
                <br />
                <span className={remainingDaysStyle}>
                  D{remainingDays}일 남았습니다
                </span>
              </p>
              <p className="body-2 text-grayscale-500">
                급여지급일까지 자동송금 인원을 확정해주세요. <br />
                송금 이후 수정은 반영되지 않습니다.
              </p>
            </>
          )}
        </section>
      )}
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
