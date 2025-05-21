// src/pages/payroll/BossPayrollTab.tsx
import { useEffect, useState } from "react";
import {
  fetchConfirmedPayrolls,
  getPayrollSettings,
} from "../../../api/boss/payroll";
import useStoreStore from "../../../stores/storeStore";
import {
  StaffPayroll,
  PayrollSettingsResponse,
} from "../../../types/payroll.ts";
import BossPayrollCard from "./BossPayrollCard.tsx";
import Button from "../../../components/common/Button.tsx";
import EditIcon from "../../../components/icons/EditIcon.tsx";
import { getRemainingDays } from "../../../utils/date.ts";
import { useNavigate } from "react-router-dom";

const BossPayrollTab = () => {
  const { selectedStore } = useStoreStore();
  const [payrolls, setPayrolls] = useState<StaffPayroll[]>([]);
  const [settings, setSettings] = useState<PayrollSettingsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      try {
        const [payrollResult, settingsResult] = await Promise.all([
          fetchConfirmedPayrolls(selectedStore.storeId),
          getPayrollSettings(selectedStore.storeId),
        ]);

        setPayrolls(payrollResult);
        setSettings(settingsResult);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
        alert("급여 정보 또는 설정을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStore]);

  const handlePayrollEdit = () => {
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
          {remainingDays === 0 ? (
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
          icon={<EditIcon />}
          onClick={handlePayrollEdit}
        >
          송금인원 수정
        </Button>
      </div>

      {/* 목록 */}
      <section>
        {loading ? (
          <div className="text-center py-10 text-grayscale-500">
            불러오는 중...
          </div>
        ) : payrolls.length === 0 ? (
          <div className="text-center py-10 text-grayscale-500">
            급여 정보가 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {payrolls.map((item) => (
              <BossPayrollCard
                key={item.payroll.key}
                data={item}
                editable={false}
                checked={true}
                onToggle={() => {}}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BossPayrollTab;
