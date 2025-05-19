import { formatFullDate } from "../../../utils/date.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { useEffect } from "react";
import BossStoreCard from "../../store/boss/BossStoreCard.tsx";
import StaffScheduleList from "../../schedule/boss/StaffScheduleList.tsx";
import { useNavigate } from "react-router-dom";

const HomeBoss = () => {
  const today = new Date();
  const dateKey = formatFullDate(today);

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;

  const { scheduleMap, fetchDailySchedule } = useScheduleStore();
  const todayRecords = scheduleMap[dateKey] || [];

  const navigate = useNavigate();

  useEffect(() => {
    if (storeId) {
      fetchDailySchedule(storeId, dateKey);
    }
  }, [storeId, dateKey, fetchDailySchedule]);

  return (
    <div className="flex flex-col items-center justify-start h-full py-4 px-5 gap-6">
      <BossStoreCard />

      <div className="w-full">
        <h2 className="heading-2 mb-3">오늘 근무자</h2>
        <div className="pb-7 border border-grayscale-300 bg-white shadow-basic rounded-xl">
          <StaffScheduleList
            records={todayRecords}
            onClick={() => {}}
            emptyMessage="오늘 출근 예정인 알바생이 없습니다."
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="w-full justify-start items-center heading-2">
          문서함
        </div>
        <div className="flex gap-2 w-full">
          <div
            onClick={() => navigate("/boss/document?type=payroll")}
            className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
          >
            <span className="title-2">급여명세서</span>
            <span className="body-3 text-gray-500">확인 요청 {"0"}</span>
          </div>
          <div
            onClick={() => navigate("/boss/document?type=contract")}
            className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
          >
            <span className="title-2">근로계약서</span>
            <span className="body-3 text-gray-500">서명 요청 {"1"}</span>
          </div>
          <div
            onClick={() => navigate("boss/document?type=etc")}
            className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
          >
            <span className="title-2">기타 문서</span>
            <span className="body-3 text-gray-500">제출 요청 {"0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBoss;
