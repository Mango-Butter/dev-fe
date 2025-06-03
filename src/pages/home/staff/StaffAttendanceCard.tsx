// src/components/staff/StaffAttendanceCard.tsx
import Button from "../../../components/common/Button.tsx";
import { TodayScheduleWithAttendance } from "../../../types/attendance.ts";
import {
  getClockInStyle,
  getClockOutStyle,
} from "../../../utils/attendance.ts";
// 추가
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { showConfirm } from "../../../libs/showConfirm.ts";
dayjs.extend(utc);
dayjs.extend(timezone);

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
  const { schedule, attendance } = data;
  const now = dayjs().tz("Asia/Seoul");

  const startTime = dayjs(schedule.startTime).tz("Asia/Seoul");
  const endTime = dayjs(schedule.endTime).tz("Asia/Seoul");
  const clockInTime = attendance?.clockInTime
    ? dayjs(attendance.clockInTime).tz("Asia/Seoul")
    : null;
  const clockOutTime = attendance?.clockOutTime
    ? dayjs(attendance.clockOutTime).tz("Asia/Seoul")
    : null;

  const canClockIn =
    !clockInTime &&
    startTime.diff(now, "second") <= 600 &&
    now.isBefore(endTime);

  const canClockOut =
    clockInTime &&
    !clockOutTime &&
    now.isAfter(startTime) &&
    now.isBefore(endTime);

  const remainingSeconds = clockOutTime
    ? 0
    : Math.max(0, endTime.diff(now, "second"));

  const formatDuration = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h}시간 ${m}분 ${s}초`;
  };

  const handleClickClockOut = async () => {
    if (remainingSeconds > 0) {
      const confirmed = await showConfirm({
        title: "조퇴하실래요?",
        text: `지금 퇴근하면 ${formatDuration(remainingSeconds)} 조퇴입니다.\n퇴근하시겠어요?`,
        confirmText: "확인",
        cancelText: "취소",
        icon: "warning",
      });

      if (!confirmed) return;
    }

    onClickClockOut(schedule.scheduleId);
  };

  return (
    <div className="flex p-4 bg-white flex-col border-y justify-center items-start gap-3 self-stretch">
      <div className="w-full flex flex-col gap-2">
        <span className="title-1">{storeName}</span>
        <div className="flex gap-2 items-center">
          <span className="body-3">스케줄 시간</span>
          <span className="body-3 text-grayscale-500">
            {startTime.format("HH:mm")}
          </span>
          <span className="body-3 text-grayscale-500">~</span>
          <span className="body-3 text-grayscale-500">
            {endTime.format("HH:mm")}
          </span>
        </div>
      </div>

      {clockInTime && (
        <div className="flex w-full gap-2 items-center">
          <span className="w-fit body-3 text-grayscale-900">출근 시간</span>
          <span className="body-3 text-grayscale-600">
            {clockInTime.format("HH:mm")}
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
            {clockOutTime.format("HH:mm")}
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
          onClick={handleClickClockOut}
        >
          퇴근하기
        </Button>
      )}
    </div>
  );
};

export default StaffAttendanceCard;
