import { useEffect, useState } from "react";
import useStoreStore from "../../../../stores/storeStore.ts";
import { fetchHourlyWageList } from "../../../../api/boss/payroll.ts";
import { StaffHourlyWage } from "../../../../types/payroll.ts";
import StaffWageCard from "./StaffWageCard.tsx";

const BossWageTab = () => {
  const { selectedStore } = useStoreStore();
  const [staffWageInfo, setStaffWageInfo] = useState<StaffHourlyWage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      setLoading(true);
      try {
        const response = await fetchHourlyWageList(selectedStore.storeId);
        setStaffWageInfo(response);
      } catch (err) {
        console.error("공제 항목 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedStore]);

  return (
    <div className="w-full flex flex-col gap-5">
      <section className="w-full flex flex-col gap-2">
        <p className="heading-1">
          알바생별 시급을
          <br />
          설정합니다
        </p>
        <p className="body-2 text-grayscale-500">
          현재 최저시급은 10,030원 입니다.
        </p>
      </section>

      {/* 목록 */}
      <section>
        {!selectedStore ? (
          <div className="text-center py-10 text-grayscale-500">
            선택된 매장이 없습니다.
          </div>
        ) : loading ? (
          <div className="text-center py-10 text-grayscale-500">
            불러오는 중...
          </div>
        ) : staffWageInfo.length === 0 ? (
          <div className="text-center py-10 text-grayscale-500">
            알바생의 시급 정보가 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {staffWageInfo.map((item) => (
              <li key={item.staff.staffId}>
                <StaffWageCard
                  storeId={selectedStore.storeId}
                  staff={item.staff}
                  initialWage={item.hourlyWage}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BossWageTab;
