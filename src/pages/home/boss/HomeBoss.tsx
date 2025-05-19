import { formatFullDate } from "../../../utils/date.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { useEffect } from "react";
import BossStoreCard from "../../store/boss/BossStoreCard.tsx";
import StaffScheduleList from "../../schedule/boss/StaffScheduleList.tsx";
import { useNavigate } from "react-router-dom";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";
import MailIcon from "../../../components/icons/MailIcon.tsx";

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
        <p className="title-1 mb-3">오늘 근무자</p>
        <div className="pb-7 border border-grayscale-300 bg-white shadow-basic rounded-xl">
          <StaffScheduleList
            records={todayRecords}
            onClick={() => {}}
            emptyMessage="오늘 출근 예정인 알바생이 없습니다."
          />
        </div>
      </div>
      <div className="flex flex-col w-full">
        <p className="title-1 mb-3">문서함</p>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
            onClick={() => navigate("/boss/document?type=contract")}
          >
            <BusinessOff />
            <p>근로계약서</p>
            <span className="text-center body-4 text-grayscale-500 mt-1">
              알바생 별 근로계약서를 <br />한 눈에 확인해 보세요
            </span>
          </div>
          <div
            className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
            onClick={() => navigate("/boss/document?type=etc")}
          >
            <MailIcon />
            <p>기타 문서</p>
            <span className="body-4 text-center text-grayscale-500 mt-1">
              필수 문서들을 <br />
              관리 해 보세요
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBoss;
