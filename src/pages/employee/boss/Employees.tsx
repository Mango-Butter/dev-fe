import { useEffect, useState } from "react";
import StaffCard from "./StaffCard";
import { getStaffAttendancesList } from "../../../api/boss/staff.ts";
import { StaffAttendance } from "../../../types/staff.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import { useSearchParams } from "react-router-dom";
import { getStartAndEndDates } from "../../../utils/date.ts";
import { getKSTDate } from "../../../libs/date.ts";

const Employees = () => {
  const { selectedStore } = useStoreStore();
  const [staffAttendanceList, setStaffAttendanceList] = useState<
    StaffAttendance[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get("type") || "attendance";
  const [selectedYearMonth, setSelectedYearMonth] = useState(() => {
    const koreaNow = getKSTDate();
    return `${koreaNow.getFullYear()}-${String(koreaNow.getMonth() + 1).padStart(2, "0")}`;
  });
  useEffect(() => {
    if (!selectedStore || currentTab !== "attendance") return;

    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const [startDate, endDate] = getStartAndEndDates(selectedYearMonth);
        const data = await getStaffAttendancesList(
          selectedStore.storeId,
          startDate,
          endDate,
        );
        setStaffAttendanceList(data);
      } catch (error) {
        console.error("출결 데이터 불러오기 실패:", error);
        setStaffAttendanceList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [selectedStore, selectedYearMonth]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-5 px-5 py-4 flex-1 self-stretch">
        <div className="flex items-center">
          <input
            type="month"
            value={selectedYearMonth}
            onChange={(e) => setSelectedYearMonth(e.target.value)}
            className="text-sm border px-2 py-1 rounded-md"
          />
        </div>
        {!selectedStore ? (
          <p className="text-center text-gray-400 mt-10">
            선택된 매장이 없습니다.
          </p>
        ) : isLoading ? (
          <p className="text-center text-gray-400 mt-10">
            근무 정보를 불러오는 중...
          </p>
        ) : staffAttendanceList.length === 0 ? (
          <p className="text-center text-gray-400 mt-10">
            등록된 직원이 없습니다.
          </p>
        ) : (
          staffAttendanceList.map((staffAttendance) => (
            <StaffCard
              key={staffAttendance.staff.staffId}
              staff={staffAttendance.staff}
              workDays={staffAttendance.workDays}
              attendanceCount={staffAttendance.attendanceCount}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Employees;
