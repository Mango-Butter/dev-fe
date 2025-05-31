import { useEffect, useState } from "react";
import useStoreStore from "../../../../stores/storeStore.ts";
import { getKSTDate } from "../../../../libs/date.ts";
import { MonthlyPayrollItem } from "../../../../types/payroll.ts";
import BossPayrollCard from "../BossPayrollCard.tsx";
import { fetchMonthlyPayrolls } from "../../../../api/boss/payroll.ts";

const BossPayrollHistoryTab = () => {
  const { selectedStore } = useStoreStore();
  const [loading, setLoading] = useState(true);
  const [payrollItems, setPayrollItems] = useState<MonthlyPayrollItem[]>([]);

  const getMaxMonth = () => {
    const now = getKSTDate();
    now.setMonth(now.getMonth());
    return `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;
  };

  const [selectedYearMonth, setSelectedYearMonth] = useState(getMaxMonth);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      setLoading(true);
      try {
        const result = await fetchMonthlyPayrolls(
          selectedStore.storeId,
          selectedYearMonth,
        );
        setPayrollItems(result);

        // setPayrollItems(dummyPayrollItems);
      } catch (err) {
        console.error("급여 내역 조회 실패:", err);
        setPayrollItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStore, selectedYearMonth]);

  return (
    <div className="w-full flex flex-col gap-2">
      {/* 상단 급여일 안내 */}
      <div className="flex items-center">
        <input
          type="month"
          value={selectedYearMonth}
          max={getMaxMonth()}
          onChange={(e) => setSelectedYearMonth(e.target.value)}
          className="title-1 pb-2"
        />
      </div>
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
