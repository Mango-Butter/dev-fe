// src/components/staff/StaffAttendanceCard.tsx
import { format, differenceInSeconds, isBefore, parseISO } from "date-fns";
import Button from "../../../components/common/Button.tsx";
import { TodayScheduleWithAttendance } from "../../../types/attendance.ts";
import {
  getClockInStyle,
  getClockOutStyle,
} from "../../../utils/attendance.ts";

interface Props {
  storeName: string;
  data: TodayScheduleWithAttendance;
  onClickClockIn: (scheduleId: number) => void;
  onClickClockOut: (scheduleId: number) => void;
}

const StaffAttendanceCard = ({
  storeName,
  data,
  onClickClockIn,
  onClickClockOut,
}: Props) => {
  const now = new Date();
  const { schedule, attendance } = data;
  const startTime = parseISO(schedule.startTime);
  const endTime = parseISO(schedule.endTime);
  const clockInTime = attendance?.clockInTime
    ? parseISO(attendance.clockInTime)
    : null;
  const clockOutTime = attendance?.clockOutTime
    ? parseISO(attendance.clockOutTime)
    : null;

  const canClockIn =
    !clockInTime &&
    differenceInSeconds(startTime, now) <= 600 && // 10분 전부터 가능
    isBefore(now, endTime);

  const canClockOut =
    clockInTime &&
    !clockOutTime &&
    isBefore(startTime, now) &&
    isBefore(now, endTime);

  const remainingSeconds = clockOutTime
    ? 0
    : Math.max(0, differenceInSeconds(endTime, now));

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}시간 ${m}분 ${s}초`;
  };

  return (
    <div className="flex p-4 bg-white flex-col border-y justify-center items-start gap-3 self-stretch">
      <div className="w-full flex flex-col gap-2">
        <span className="title-1">{storeName}</span>
        <div className="flex gap-2 items-center">
          <span className="body-3">스케줄 시간</span>
          <span className="body-3 text-grayscale-500">
            {format(startTime, "HH:mm")}
          </span>
          <span className="body-3 text-grayscale-500">~</span>
          <span className="body-3 text-grayscale-500">
            {format(endTime, "HH:mm")}
          </span>
        </div>
      </div>

      {clockInTime && (
        <div className="flex w-full gap-2 items-center">
          <span className="w-fit body-3 text-grayscale-900">출근 시간</span>
          <span className="body-3 text-grayscale-600">
            {format(clockInTime, "HH:mm")}
          </span>

          {attendance?.clockInStatus && (
            <div className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${getClockInStyle(attendance.clockInStatus, !!clockOutTime).dotClassName}`}
              />
              <span
                className={`body-3 ${getClockInStyle(attendance.clockInStatus, !!clockOutTime).className}`}
              >
                {
                  getClockInStyle(attendance.clockInStatus, !!clockOutTime)
                    .label
                }
              </span>
            </div>
          )}
        </div>
      )}

      {clockOutTime ? (
        <div className="flex w-full gap-2 items-center">
          <span className="w-fit body-3 text-grayscale-900">퇴근 시간</span>
          <span className="body-3 text-grayscale-600">
            {format(clockOutTime, "HH:mm")}
          </span>
          {attendance?.clockOutStatus && (
            <div className="flex items-center gap-1">
              <span
                className={`w-2 h-2 rounded-full ${getClockOutStyle(attendance.clockOutStatus).dotClassName}`}
              />
              <span
                className={`body-3 ${getClockOutStyle(attendance.clockOutStatus).className}`}
              >
                {getClockOutStyle(attendance.clockOutStatus).label}
              </span>
            </div>
          )}
        </div>
      ) : (
        clockInTime &&
        remainingSeconds > 0 && (
          <div className="flex w-full gap-2">
            <span className="w-fit body-3 text-grayscale-900">
              퇴근시간까지 {formatDuration(remainingSeconds)} 남았습니다!
            </span>
          </div>
        )
      )}

      {canClockIn && (
        <Button
          className="w-full body-3"
          theme="secondary"
          size="sm"
          onClick={() => onClickClockIn(schedule.scheduleId)}
        >
          출근하기
        </Button>
      )}

      {canClockOut && (
        <Button
          className="w-full body-3"
          theme="secondary"
          size="sm"
          onClick={() => onClickClockOut(schedule.scheduleId)}
        >
          퇴근하기
        </Button>
      )}
    </div>
  );
};

export default StaffAttendanceCard;
