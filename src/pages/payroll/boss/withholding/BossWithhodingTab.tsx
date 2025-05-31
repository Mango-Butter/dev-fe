import { useEffect, useState } from "react";
import useStoreStore from "../../../../stores/storeStore.ts";
import { getStaffWithholdingList } from "../../../../api/boss/payroll.ts";
import { StaffWithholdingItem } from "../../../../types/payroll.ts";
import StaffWithholdingCard from "./StaffWithholdingCard.tsx";

const BossWithhodingTab = () => {
  const { selectedStore } = useStoreStore();
  const [staffTaxInfo, setStaffTaxInfo] = useState<StaffWithholdingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!selectedStore) return;

      setLoading(true);
      try {
        const response = await getStaffWithholdingList(selectedStore.storeId);
        setStaffTaxInfo(response);
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
          알바생별 공제항목을
          <br />
          설정합니다
        </p>
        <p className="body-2 text-grayscale-500">
          원천징수: 3.3%
          <br />
          4대보험: 9.4%
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
        ) : staffTaxInfo.length === 0 ? (
          <div className="text-center py-10 text-grayscale-500">
            알바생의 공제 항목 정보가 없습니다.
          </div>
        ) : (
          <ul className="space-y-4">
            {staffTaxInfo.map((item) => (
              <li key={item.staff.staffId}>
                <StaffWithholdingCard
                  storeId={selectedStore.storeId}
                  staff={item.staff}
                  initialType={item.withholdingType}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default BossWithhodingTab;
