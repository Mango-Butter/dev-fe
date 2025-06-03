import { useEffect, useState } from "react";
import { StaffAttendanceRecord } from "../../../types/attendance";
import { cn } from "../../../libs";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import { getStartAndEndDates } from "../../../utils/date.ts";
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx";
import { toast } from "react-toastify";
import { getStaffAttendanceRecords } from "../../../api/staff/attendance.ts";
import StaffAttendanceEditForm from "../../schedule/staff/StaffAttendanceEditForm.tsx";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";

interface Props {
  storeId: number;
  currentMonth: string; // YYYY-MM 형식
}

const AttendanceRecordContainer = ({ storeId, currentMonth }: Props) => {
  const { setBottomSheetContent } = useBottomSheetStore();
  const { selectedStore } = useStaffStoreStore();
  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const handleClickRecord = (record: StaffAttendanceRecord) => {
    if (!selectedStore) return;
    setBottomSheetContent(
      <StaffAttendanceEditForm
        schedule={{
          scheduleId: record.scheduleId,
          workDate: record.workDate,
          startTime: record.startTime,
          endTime: record.endTime,
        }}
        attendance={{
          clockInTime: record.clockInTime,
          clockOutTime: record.clockOutTime,
          clockInStatus: record.clockInStatus,
          clockOutStatus: record.clockOutStatus,
        }}
        staff={{
          staffId: selectedStore.staff.staffId,
          name: selectedStore.staff.name,
          profileImageUrl: selectedStore.staff.profileImageUrl,
        }}
      />,
      {
        title: "근태 상세",
        closeOnClickOutside: true,
      },
    );
  };

  useEffect(() => {
    if (!storeId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const [startDate, endDate] = getStartAndEndDates(currentMonth);
        const data = await getStaffAttendanceRecords(
          storeId,
          startDate,
          endDate,
        );
        setRecords(data);
      } catch (err) {
        toast.error("근태 기록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [storeId, currentMonth]);

  return (
    <div>
      <p className="title-1 mb-3">근태 기록 관리</p>

      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold px-4 py-3 text-gray-500">
          <span>날짜</span>
          <span>시간</span>
          <span className="text-center">상태</span>
        </div>

        {loading ? (
          <FullScreenLoading />
        ) : records.length === 0 ? (
          <div className="text-center p-4 text-sm text-gray-400">
            근무 기록이 없습니다.
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.scheduleId}
              className="grid grid-cols-3 px-4 py-3 border-t border-gray-100 items-center text-sm cursor-pointer hover:bg-gray-50 transition"
              onClick={() => handleClickRecord(record)}
            >
              <span>{record.workDate}</span>
              <span>
                {record.startTime.slice(11, 16)}~{record.endTime.slice(11, 16)}
              </span>
              <span
                className={cn("text-center", {
                  "text-positive": record.clockInStatus === "NORMAL",
                  "text-delay": record.clockInStatus === "LATE",
                  "text-warning":
                    record.clockInStatus !== "NORMAL" &&
                    record.clockInStatus !== "LATE",
                })}
              >
                {record.clockInStatus === "NORMAL"
                  ? "출근"
                  : record.clockInStatus === "LATE"
                    ? "지각"
                    : "결근"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AttendanceRecordContainer;
