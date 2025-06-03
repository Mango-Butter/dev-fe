// src/pages/payroll/BossAutoTransferTab.tsx
import { useEffect, useState } from "react";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { getKSTDate } from "../../../libs/date.ts";
import {
  getPayrollSettings,
  getStaffPayroll,
} from "../../../api/staff/payroll.ts";
import {
  StaffPayrollResponse,
  StaffPayrollSettingsResponse,
} from "../../../types/payroll.ts";
import StaffAttendanceRecordContainer from "./StaffAttendanceRecordContainer.tsx";
import StaffPayrollCard from "./StaffPayrollCard.tsx";
import { useNavigate } from "react-router-dom";
import { getRemainingDays } from "../../../utils/date.ts";
import MonthPicker from "../../../components/common/MonthPicker.tsx";

const getCurrentMonth = (): string => {
  const now = getKSTDate();
  return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
};

const StaffPayrollPage = () => {
  const { selectedStore } = useStaffStoreStore();
  const navigate = useNavigate();
  const [staffPayroll, setStaffPayroll] = useState<StaffPayrollResponse | null>(
    null,
  );
  const [settings, setSettings] = useState<StaffPayrollSettingsResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const currentMonth = getCurrentMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
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

  // 조건 계산
  const isCurrentMonth = selectedMonth === currentMonth;
  const isDday = isCurrentMonth && remainingDays === 0;
  const isBeforeDue =
    isCurrentMonth && remainingDays !== null && remainingDays > 0;
  const isAfterDue =
    isCurrentMonth && remainingDays !== null && remainingDays < 0;
  const isPastMonth =
    !isCurrentMonth ||
    (isCurrentMonth && remainingDays !== null && remainingDays > 0); // 수정 불가한 이전달

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedStore) return;

      try {
        const [payrollResult, settingsResult] = await Promise.all([
          getStaffPayroll(selectedStore.storeId, selectedMonth),
          getPayrollSettings(selectedStore.storeId),
        ]);
        setStaffPayroll(payrollResult);
        setSettings(settingsResult);
      } catch (error) {
        console.error("급여 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedStore, selectedMonth]);

  const handleClickPayslip = () => {
    navigate(`/staff/payroll/payslip?month=${selectedMonth}`);
  };

  if (!settings || loading) return null;

  return (
    <div className="w-full flex flex-col gap-5 p-6">
      {/* 상단 급여일 안내 */}

      <section className="w-full flex flex-col gap-2">
        {isDday && (
          <>
            <p className="heading-1">
              급여지급일
              <br />
              <span className={remainingDaysStyle}>D-Day</span>
            </p>
            <p className="body-2 text-grayscale-500">
              예상 급여를 확인해 보세요.
              <br />
              근태 기록 수정은 불가능합니다.
            </p>
          </>
        )}

        {isBeforeDue && (
          <>
            <p className="heading-1">
              급여지급일까지
              <br />
              <span className={remainingDaysStyle}>
                D{remainingDays}일 남았습니다
              </span>
            </p>
            <p className="body-2 text-grayscale-500">
              급여지급일 하루 전까지 자신의 근태기록을
              <br />
              확인하세요. 이후 요청은 반영되지 않습니다.
            </p>
          </>
        )}

        {(isAfterDue || isPastMonth) && (
          <>
            <p className="heading-1">
              이전 급여를
              <br />
              급여명세서로 확인하세요.
            </p>
            <p className="body-2 text-grayscale-500">
              지급된 급여명세서에서
              <br />
              근태 수정 반영은 불가능합니다.
            </p>
          </>
        )}
      </section>

      {/* 급여 카드 */}
      {staffPayroll && (
        <section className="flex flex-col gap-2 w-full">
          <div className="flex justify-between w-full">
            <MonthPicker
              value={selectedMonth}
              max={currentMonth}
              onChange={(val) => setSelectedMonth(val)}
            />
            <button
              className="text-sm font-semibold text-right text-primary underline"
              onClick={handleClickPayslip}
            >
              급여명세서 확인하기
            </button>
          </div>
          <StaffPayrollCard data={staffPayroll} />
        </section>
      )}

      {selectedStore && (
        <section>
          <StaffAttendanceRecordContainer
            storeId={selectedStore.storeId}
            currentMonth={selectedMonth}
          />
        </section>
      )}
    </div>
  );
};

export default StaffPayrollPage;
