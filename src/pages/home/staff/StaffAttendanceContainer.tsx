import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { TodayScheduleWithAttendance } from "../../../types/attendance.ts";
import { getTodayScheduleAndAttendance } from "../../../api/staff/attendance.ts";
import StaffAttendanceCard from "./StaffAttendanceCard.tsx";
import { parseDateStringToKST } from "../../../libs/date.ts";

const StaffAttendanceContainer = () => {
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;

  const [schedules, setSchedules] = useState<TodayScheduleWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof storeId !== "number") return;

    const fetch = async () => {
      setLoading(true);
      try {
        const result = await getTodayScheduleAndAttendance(storeId);
        result.sort(
          (a, b) =>
            parseDateStringToKST(a.schedule.startTime).getTime() -
            parseDateStringToKST(b.schedule.startTime).getTime(),
        );
        setSchedules(result);
      } catch (error) {
        console.error("스케줄 로딩 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [storeId]);

  if (!selectedStore) return null;

  if (loading) {
    return (
      <div className="text-center text-grayscale-500 py-4 shadow-basic rounded-lg">
        로딩 중...
      </div>
    );
  }

  if (schedules.length === 0) {
    return (
      <div className="text-center text-grayscale-400 body-3 py-4 shadow-basic rounded-lg">
        오늘 스케줄이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 pt-0 shadow-basic rounded-lg h-[260px] overflow-y-auto">
      <div className="w-full title-1 p-4 pb-2 border-b sticky top-0 bg-white z-10">
        오늘의 스케줄
      </div>
      {schedules.map((item) => (
        <StaffAttendanceCard
          key={item.schedule.scheduleId}
          storeName={selectedStore.storeName}
          data={item}
          onClickClockIn={(id) =>
            navigate(`/staff/attendance?mode=clock-in&scheduleId=${id}`)
          }
          onClickClockOut={(id) =>
            navigate(`/staff/attendance?mode=clock-out&scheduleId=${id}`)
          }
        />
      ))}
    </div>
  );
};

export default StaffAttendanceContainer;
