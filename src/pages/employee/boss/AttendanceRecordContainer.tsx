// src/pages/boss/staff/AttendanceRecordContainer.tsx

import { useEffect, useState } from "react";
import { getStaffAttendanceRecords } from "../../../api/boss/attendance";
import { StaffAttendanceRecord } from "../../../types/attendance";
import useStoreStore from "../../../stores/storeStore";

interface Props {
  staffId: number;
}

const AttendanceRecordContainer = ({ staffId }: Props) => {
  const { selectedStore } = useStoreStore();
  const [selectedYearMonth, setSelectedYearMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
  });

  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const getStartAndEndDates = (ym: string) => {
    const [year, month] = ym.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0); // 마지막 날짜
    const format = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
    return [format(start), format(end)];
  };

  useEffect(() => {
    if (!selectedStore) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const [startDate, endDate] = getStartAndEndDates(selectedYearMonth);
        const data = await getStaffAttendanceRecords(
          selectedStore.storeId,
          staffId,
          startDate,
          endDate,
        );
        setRecords(data);
      } catch (err) {
        console.error("근태 기록 조회 실패", err);
        alert("근태 기록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedStore, staffId, selectedYearMonth]);

  return (
    <div>
      <p className="title-1 mb-3">근태 기록 관리</p>

      {/* 월 선택 */}
      <div className="flex gap-1 items-center mb-2">
        <input
          type="month"
          value={selectedYearMonth}
          onChange={(e) => setSelectedYearMonth(e.target.value)}
          className="text-sm border px-2 py-1 rounded-md"
        />
      </div>

      {/* 표 */}
      <div className="rounded-xl overflow-hidden border border-gray-200">
        <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold px-4 py-3 text-gray-500">
          <span>날짜</span>
          <span>시간</span>
          <span className="text-center">상태</span>
        </div>

        {loading ? (
          <div className="text-center p-4 text-sm text-gray-400">
            불러오는 중...
          </div>
        ) : records.length === 0 ? (
          <div className="text-center p-4 text-sm text-gray-400">
            근무 기록이 없습니다.
          </div>
        ) : (
          records.map((record) => (
            <div
              key={record.scheduleId}
              className="grid grid-cols-3 px-4 py-3 border-t border-gray-100 items-center text-sm"
            >
              <span>{record.workDate}</span>
              <span>
                {record.startTime.slice(11, 16)}~{record.endTime.slice(11, 16)}
              </span>
              <span className="text-center text-green-600">
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
