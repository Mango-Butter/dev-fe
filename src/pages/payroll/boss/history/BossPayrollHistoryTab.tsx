import { useEffect, useState } from "react";
import useStoreStore from "../../../../stores/storeStore.ts";
import { getKSTDate } from "../../../../libs/date.ts";
import { MonthlyPayrollItem } from "../../../../types/payroll.ts";
import BossPayrollCard from "../BossPayrollCard.tsx";
import {
  fetchMonthlyPayrolls,
  fetchPayrollSettings,
} from "../../../../api/boss/payroll.ts";
import { getRemainingDays } from "../../../../utils/date.ts";
import MonthPicker from "../../../../components/common/MonthPicker.tsx";

const BossPayrollHistoryTab = () => {
  const { selectedStore } = useStoreStore();
  const [loading, setLoading] = useState(true);
  const [payrollItems, setPayrollItems] = useState<MonthlyPayrollItem[]>([]);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string | null>(
    null,
  );
  const [maxMonth, setMaxMonth] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettingsAndInit = async () => {
      if (!selectedStore) return;

      try {
        const settingsResult = await fetchPayrollSettings(
          selectedStore.storeId,
        );

        const now = getKSTDate();
        const year = now.getFullYear();
        let month = now.getMonth(); // 0-indexed

        if (settingsResult.transferDate != null) {
          const remaining = getRemainingDays(settingsResult.transferDate);
          if (remaining < 0) {
            month += 1; // 급여일 지났으면 이번달까지
          }
        }

        const computedMonth = `${year}-${String(month - 1).padStart(2, "0")}`;
        setSelectedYearMonth(computedMonth);
        setMaxMonth(computedMonth);
      } catch (err) {
        console.error("급여 설정 불러오기 실패:", err);
      }
    };

    fetchSettingsAndInit();
  }, [selectedStore]);

  // 급여 내역 불러오기
  useEffect(() => {
    const loadPayrolls = async () => {
      if (!selectedStore || !selectedYearMonth) return;
      setLoading(true);
      try {
        const result = await fetchMonthlyPayrolls(
          selectedStore.storeId,
          selectedYearMonth,
        );
        setPayrollItems(result);
      } catch (err) {
        console.error("급여 내역 조회 실패:", err);
        setPayrollItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadPayrolls();
  }, [selectedStore, selectedYearMonth]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 상단 급여일 안내 */}
      {selectedYearMonth && maxMonth && (
        <div className="flex items-center">
          <MonthPicker
            value={selectedYearMonth}
            onChange={(val) => setSelectedYearMonth(val)}
            max={maxMonth}
          />
        </div>
      )}

      {/* 목록 */}
      <section>
        {loading ? (
          <div className="text-center py-10 text-grayscale-500">
            불러오는 중...
          </div>
        ) : payrollItems.length === 0 ? (
          <div className="text-center py-10 text-grayscale-500">
            급여 내역이 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {payrollItems.map((item) => (
              <BossPayrollCard key={item.staff.staffId} item={item} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BossPayrollHistoryTab;
