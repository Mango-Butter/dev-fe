import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import { TodayScheduleWithAttendance } from "../../../types/attendance.ts";
import { getTodayScheduleAndAttendance } from "../../../api/staff/attendance.ts";
import StaffAttendanceCard from "./StaffAttendanceCard.tsx";
import { parseDateStringToKST } from "../../../libs/date.ts";
import { isValidStoreId } from "../../../utils/store.ts";

const StaffAttendanceContainer = () => {
  const navigate = useNavigate();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;

  const [schedules, setSchedules] = useState<TodayScheduleWithAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isValidStoreId(storeId)) {
      setLoading(false);
      return;
    }

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
      <div className="text-center text-grayscale-400 body-3 py-4 shadow-basic rounded-lg h-[50px]">
        오늘 스케줄이 없습니다.
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col p-4 pt-0 shadow-basic rounded-lg overflow-y-auto ${
        schedules.length <= 2
          ? `h-[${48 + 32 + 44 + schedules.length * 82}px]`
          : "h-[288px]" // 48(기본) + 32(제목) + 126*2
      }`}
    >
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
