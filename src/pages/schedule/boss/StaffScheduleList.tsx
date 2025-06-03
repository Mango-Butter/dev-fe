import {
  getClockInStyle,
  getClockOutStyle,
} from "../../../utils/attendance.ts";
import { DailyAttendanceRecord } from "../../../types/calendar.ts";
import { getMinutesDiff } from "../../../utils/date.ts";
import { formatTimeRange } from "../../../utils/time.ts";
import { cn } from "../../../libs";

interface Props {
  records: DailyAttendanceRecord[];
  onClick: (
    schedule: DailyAttendanceRecord["schedule"],
    staff: DailyAttendanceRecord["staff"],
    attendance: DailyAttendanceRecord["attendance"],
  ) => void;
  emptyMessage?: string;
}

const StaffScheduleList = ({ records, onClick, emptyMessage }: Props) => {
  if (!records || records.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center m-3">
        {emptyMessage || "데이터가 없습니다."}
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {records.map(({ staff, schedule, attendance }) => {
        const hasClockOut = attendance?.clockOutStatus !== null;

        const {
          label: clockInLabel,
          className: clockInClass,
          dotClassName: clockInDot,
        } = getClockInStyle(attendance?.clockInStatus, hasClockOut);

        const {
          label: clockOutLabel,
          className: clockOutClass,
          dotClassName: clockOutDot,
        } = getClockOutStyle(attendance?.clockOutStatus);

        let extraLabel = "";
        if (
          attendance?.clockOutStatus === "EARLY_LEAVE" &&
          attendance.clockOutTime
        ) {
          const early = getMinutesDiff(
            schedule.endTime,
            attendance.clockOutTime,
          );
          extraLabel = `(${early}분 조퇴)`;
        } else if (
          attendance?.clockOutStatus === "OVERTIME" &&
          attendance.clockOutTime
        ) {
          const overtime = getMinutesDiff(
            attendance.clockOutTime,
            schedule.endTime,
          );
          extraLabel = `(${overtime}분 연장)`;
        }

        return (
          <li
            key={schedule.scheduleId}
            className="flex items-center justify-between rounded-xl bg-white p-4 cursor-pointer"
            onClick={() => onClick(schedule, staff, attendance)}
          >
            <div className="flex items-center gap-3">
              <img
                src={staff.profileImageUrl}
                alt={staff.name}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div>
                <div className="flex gap-2 items-center self-stretch">
                  <p className="title-1 text-grayscale-900">{staff.name}</p>
                  <p className="body-3 text-gray-700">
                    {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </p>
                </div>
                <div className="flex self-stretch gap-3 mt-1">
                  {/* 출근 상태 */}
                  <span
                    className={cn("body-3 flex items-center", clockInClass)}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full mr-1",
                        clockInDot,
                      )}
                    />
                    {clockInLabel}
                  </span>

                  {/* 퇴근 상태 */}
                  {attendance?.clockInStatus &&
                    attendance?.clockOutStatus !== "NORMAL" && (
                      <span
                        className={cn(
                          "body-3 flex items-center",
                          clockOutClass,
                        )}
                      >
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full mr-1",
                            clockOutDot,
                          )}
                        />
                        {clockOutLabel} {extraLabel}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default StaffScheduleList;
