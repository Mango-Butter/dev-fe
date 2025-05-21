import { getKoreaISOString, formatFullDate } from "../../../utils/date.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { useEffect } from "react";
import BossStoreCard from "../../store/boss/BossStoreCard.tsx";
import StaffScheduleList from "../../schedule/boss/StaffScheduleList.tsx";
import DocumentContainer from "./DocumentContainer.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const HomeBoss = () => {
  const koreaNow = new Date(getKoreaISOString());
  const dateKey = formatFullDate(koreaNow);
  const todayText = format(koreaNow, "yyyy.MM.dd EEEE", { locale: ko });

  const { user } = useUserStore();
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
    <div className="flex flex-col items-start justify-start h-full py-4 px-5 gap-6">
      <div className="flex flex-col gap-1">
        <p className="title-1">{todayText}</p> {/* ✅ 한국 시간 기준 텍스트 */}
        <p className="body-3 text-grayscale-500">
          {user?.name}님, 오늘 근무도 힘내세요!
        </p>
      </div>
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
