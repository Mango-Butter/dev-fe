import { formatFullDate } from "../../../utils/date.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { useEffect } from "react";
import BossStoreCard from "../../store/boss/BossStoreCard.tsx";
import StaffScheduleList from "../../schedule/boss/StaffScheduleList.tsx";
import DocumentContainer from "./DocumentContainer.tsx";

const HomeBoss = () => {
  const today = new Date();
  const dateKey = formatFullDate(today);

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const { scheduleMap, fetchDailySchedule } = useScheduleStore();
  const todayRecords = scheduleMap[dateKey] || [];

  useEffect(() => {
    if (storeId) {
      fetchDailySchedule(storeId, dateKey);
    }
  }, [storeId, dateKey, fetchDailySchedule]);

  return (
    <div className="flex flex-col items-center justify-start h-full py-4 px-5 gap-6">
      <BossStoreCard />
      {selectedStore && (
        <>
          <div className="w-full">
            <p className="title-1 mb-3">오늘 근무자</p>
            <div className="p-2 border border-grayscale-300 bg-white shadow-basic rounded-xl">
              <StaffScheduleList
                records={todayRecords}
                onClick={() => {}}
                emptyMessage="오늘 출근 예정인 알바생이 없습니다."
              />
            </div>
          </div>
          <DocumentContainer />
        </>
      )}
    </div>
  );
};

export default HomeBoss;
