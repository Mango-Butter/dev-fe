// src/pages/boss/staff/AttendanceRecordContainer.tsx
import { useEffect, useState } from "react";
import { getStaffAttendanceRecords } from "../../../api/boss/attendance";
import { StaffAttendanceRecord } from "../../../types/attendance";
import { cn } from "../../../libs";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import AttendanceEditForm from "../../schedule/boss/AttendanceEditForm.tsx";
import { getStartAndEndDates } from "../../../utils/date.ts";
import { getKSTDate } from "../../../libs/date.ts";
import FullScreenLoading from "../../../components/common/FullScreenLoading.tsx";
import { toast } from "react-toastify";
import MonthPicker from "../../../components/common/MonthPicker.tsx";

interface Props {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  storeId: number;
}

const AttendanceRecordContainer = ({ staff, storeId }: Props) => {
  const { staffId } = staff;
  const { setBottomSheetContent } = useBottomSheetStore();

  const [selectedYearMonth, setSelectedYearMonth] = useState(() => {
    const koreaNow = getKSTDate();
    return `${koreaNow.getFullYear()}-${String(koreaNow.getMonth() + 1).padStart(2, "0")}`;
  });

  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const handleClickRecord = (record: StaffAttendanceRecord) => {
    setBottomSheetContent(
      <AttendanceEditForm
        schedule={{
          scheduleId: record.scheduleId,
          workDate: record.workDate,
          startTime: record.startTime,
          endTime: record.endTime,
        }}
        staff={staff}
        attendance={{
          clockInTime: record.clockInTime,
          clockOutTime: record.clockOutTime,
          clockInStatus: record.clockInStatus,
          clockOutStatus: record.clockOutStatus,
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
        const [startDate, endDate] = getStartAndEndDates(selectedYearMonth);
        const data = await getStaffAttendanceRecords(
          storeId,
          staffId,
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
  }, [storeId, staffId, selectedYearMonth]);

  return (
    <div>
      <p className="title-1 mb-3">근태 기록 관리</p>

      <div className="flex gap-1 items-center mb-2">
        <MonthPicker
          value={selectedYearMonth}
          onChange={(val) => setSelectedYearMonth(val)}
          max={selectedYearMonth}
        />
      </div>

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
