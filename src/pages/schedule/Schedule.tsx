import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ArrowIcon from "../../components/icons/ArrowIcon";
import { formatFullDate, getMinutesDiff } from "../../utils/date";
import useBottomSheetStore from "../../stores/useBottomSheetStore";
import useStoreStore from "../../stores/storeStore";
import SingleScheduleAddForm from "./SingleScheduleAddForm.tsx";
import "../../styles/schedulePageCalendar.css";
import Button from "../../components/common/Button.tsx";
import useScheduleStore from "../../stores/useScheduleStore.ts";
import { formatTimeRange } from "../../utils/time.ts";
import { getClockInStyle } from "../../utils/attendance.ts";
import { cn } from "../../libs";
import SingleScheduleEditForm from "./SingleScheduleEditForm.tsx";
import AttendanceAddForm from "./AttendanceAddForm.tsx";
import AttendanceEditForm from "./AttendanceEditForm.tsx";
import { DailyAttendanceRecord } from "../../types/calendar.ts";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(new Date());
  const dateKey = formatFullDate(selectedDate);

  const { scheduleMap, dotMap, fetchDailySchedule, fetchDotRange } =
    useScheduleStore();

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const { setBottomSheetContent } = useBottomSheetStore();

  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  // 스케줄 추가
  const openAddSingleScheduleSheet = () => {
    if (isPast) return;
    setBottomSheetContent(
      <SingleScheduleAddForm defaultDate={selectedDate} />,
      {
        title: "스케줄 추가",
        closeOnClickOutside: true,
      },
    );
  };

  // 스케줄 상세 보기 바텀시트 오픈 함수
  const handleOpenScheduleDetail = (
    schedule: DailyAttendanceRecord["schedule"],
    staff: DailyAttendanceRecord["staff"],
    attendance: DailyAttendanceRecord["attendance"],
  ) => {
    setBottomSheetContent(
      <SingleScheduleEditForm
        schedule={schedule}
        staff={staff}
        attendance={attendance}
      />,
      {
        title: "스케줄 상세",
        closeOnClickOutside: true,
      },
    );
  };

  // 근태 추가
  const openAddAttendanceSheet = () => {
    if (!isPast) return;
    setBottomSheetContent(<AttendanceAddForm defaultDate={selectedDate} />, {
      title: "근태 추가",
      closeOnClickOutside: true,
    });
  };

  // 근태 상세 보기 바텀시트 오픈 함수
  const handleOpenAttendanceDetail = (
    schedule: DailyAttendanceRecord["schedule"],
    staff: DailyAttendanceRecord["staff"],
    attendance: DailyAttendanceRecord["attendance"],
  ) => {
    setBottomSheetContent(
      <AttendanceEditForm
        schedule={schedule}
        staff={staff}
        attendance={attendance}
      />,
      {
        title: "근태 상세",
        closeOnClickOutside: true,
      },
    );
  };

  useEffect(() => {
    if (storeId && calendarViewDate) {
      fetchDotRange(storeId, calendarViewDate);
    }
  }, [storeId, calendarViewDate, fetchDotRange]);

  useEffect(() => {
    if (storeId) {
      fetchDailySchedule(storeId, dateKey);
    }
  }, [storeId, dateKey, fetchDailySchedule]);

  return (
    <div className="flex flex-col w-full h-full">
      <Calendar
        className="schedule-page-calendar"
        onChange={(value) => setSelectedDate(value as Date)}
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate) setCalendarViewDate(activeStartDate);
        }}
        value={selectedDate}
        calendarType="gregory"
        prevLabel={<ArrowIcon direction="left" className="w-4 h-4" />}
        nextLabel={<ArrowIcon direction="right" className="w-4 h-4" />}
        prev2Label={null}
        next2Label={null}
        formatDay={(_, date) => date.getDate().toString()}
        showNeighboringMonth={false}
        tileClassName={({ date, view }) => {
          if (view !== "month") return undefined;

          const dateStr = formatFullDate(date);
          const isSelected = dateStr === dateKey;
          const day = date.getDay();

          let base = "react-calendar__tile";

          if (isSelected) base += " selected-day";
          if (day === 0) base += " sunday";
          if (day === 6) base += " saturday";

          return base;
        }}
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const dateStr = formatFullDate(date);
          const summary = dotMap[dateStr];

          if (!summary) return null;

          const dots: string[] = [];

          if (summary.normalCount > 0) dots.push("NORMAL");
          if (summary.lateCount > 0) dots.push("LATE");
          if (summary.absentCount > 0) dots.push("ABSENT");
          if (summary.preScheduleCount > 0) dots.push("");

          return (
            <div className="calendar-dot-layer flex gap-[2px] justify-center mt-[2px]">
              {dots.slice(0, 4).map((status, idx) => {
                const { dotClassName } = getClockInStyle(status as any, false);
                return (
                  <span
                    key={idx}
                    className={cn("w-1.5 h-1.5 rounded-full", dotClassName)}
                  />
                );
              })}
            </div>
          );
        }}
      />

      <div className="flex w-full h-full flex-col bg-grayscale-100 px-5 py-4">
        <div className="flex w-full justify-between items-center">
          <h2 className="heading-2 mb-2">{dateKey}</h2>
          {isPast ? (
            <Button size="sm" theme="outline" onClick={openAddAttendanceSheet}>
              근태 추가
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={openAddSingleScheduleSheet}
              theme="outline"
            >
              스케줄 추가
            </Button>
          )}
        </div>

        <div className="mt-8 text-center">
          <ul className="space-y-2">
            {scheduleMap[dateKey]?.length > 0 ? (
              scheduleMap[dateKey].map(({ staff, schedule, attendance }) => {
                const hasClockOut = attendance?.clockOutStatus !== null;

                const {
                  label: clockInLabel,
                  className: clockInClass,
                  dotClassName,
                } = getClockInStyle(attendance?.clockInStatus, hasClockOut);

                let clockOutLabel = "";
                if (
                  attendance?.clockOutStatus === "EARLY_LEAVE" &&
                  attendance.clockOutTime
                ) {
                  const early = getMinutesDiff(
                    schedule.endTime,
                    attendance.clockOutTime,
                  );
                  clockOutLabel = `조퇴 ${early}분`;
                } else if (
                  attendance?.clockOutStatus === "OVERTIME" &&
                  attendance.clockOutTime
                ) {
                  const overtime = getMinutesDiff(
                    attendance.clockOutTime,
                    schedule.endTime,
                  );
                  clockOutLabel = `추가근무 ${overtime}분`;
                }

                return (
                  <li
                    key={schedule.scheduleId}
                    className="flex items-center justify-between rounded-xl bg-white p-4 cursor-pointer"
                    onClick={() => {
                      if (attendance === null) {
                        handleOpenScheduleDetail(schedule, staff, attendance);
                      } else {
                        handleOpenAttendanceDetail(schedule, staff, attendance);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={staff.profileImageUrl}
                        alt={staff.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex gap-2 items-center self-stretch">
                          <p className="title-1 text-grayscale-900">
                            {staff.name}
                          </p>
                          <p className="body-3 text-gray-700">
                            {formatTimeRange(
                              schedule.startTime,
                              schedule.endTime,
                            )}
                          </p>
                        </div>

                        <div className="flex self-stretch gap-2 mt-1">
                          <span
                            className={cn(
                              "body-3 flex items-center",
                              clockInClass,
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full mr-1 align-middle",
                                dotClassName,
                              )}
                            />
                            {clockInLabel}
                          </span>
                          {clockOutLabel && (
                            <span className="body-3 text-purple-500">
                              {clockOutLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : isPast ? (
              <li className="text-sm text-gray-500">근태 기록이 없습니다.</li>
            ) : (
              <li className="text-sm text-gray-500">
                등록된 스케줄이 없습니다.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
