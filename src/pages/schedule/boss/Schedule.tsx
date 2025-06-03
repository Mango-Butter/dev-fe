import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ArrowIcon from "../../../components/icons/ArrowIcon.tsx";
import { formatFullDate, formatKRDate } from "../../../utils/date.ts";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import useStoreStore from "../../../stores/storeStore.ts";
import SingleScheduleAddForm from "./SingleScheduleAddForm.tsx";
import "../../../styles/schedulePageCalendar.css";
import Button from "../../../components/common/Button.tsx";
import useScheduleStore from "../../../stores/useScheduleStore.ts";
import { getClockInStyle } from "../../../utils/attendance.ts";
import { cn } from "../../../libs";
import SingleScheduleEditForm from "./SingleScheduleEditForm.tsx";
import AttendanceAddForm from "./AttendanceAddForm.tsx";
import AttendanceEditForm from "./AttendanceEditForm.tsx";
import { DailyAttendanceRecord } from "../../../types/calendar.ts";
import ScheduleFilter from "./ScheduleFilter.tsx";
import { useScheduleFilters } from "../../../hooks/useScheduleFilters.ts";
import StaffScheduleList from "./StaffScheduleList.tsx";
import dayjs from "dayjs";
import { getKSTDate } from "../../../libs/date.ts";
import { isValidStoreId } from "../../../utils/store.ts";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(getKSTDate());
  const [calendarViewDate, setCalendarViewDate] = useState<Date>(getKSTDate());
  const dateKey = formatFullDate(selectedDate);
  const displayDate = formatKRDate(selectedDate);

  const { scheduleMap, dotMap, fetchDailySchedule, fetchDotRange } =
    useScheduleStore();

  const { selectedStore } = useStoreStore();
  const storeId = selectedStore?.storeId;
  const { setBottomSheetContent } = useBottomSheetStore();

  const isPast = dayjs(selectedDate).isBefore(
    dayjs(getKSTDate()).startOf("day"),
  );

  const { filters } = useScheduleFilters();

  const filteredRecords = scheduleMap[dateKey]?.filter(({ attendance }) => {
    if (filters.has("all")) return true;

    return Array.from(filters).some((key) => {
      const [type, value] = key.split(":");

      if (type === "clockIn") {
        if (value === "null") return attendance?.clockInStatus == null;
        return attendance?.clockInStatus === value;
      }

      if (type === "clockOut") {
        if (value === "null") return attendance?.clockOutStatus == null;
        return attendance?.clockOutStatus === value;
      }

      return false;
    });
  });

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
    if (isValidStoreId(storeId) && calendarViewDate) {
      fetchDotRange(storeId, calendarViewDate);
    }
  }, [storeId, calendarViewDate, fetchDotRange]);

  useEffect(() => {
    if (isValidStoreId(storeId)) {
      fetchDailySchedule(storeId, dateKey);
    }
  }, [storeId, dateKey, fetchDailySchedule]);

  return (
    <div className="flex flex-col w-full h-full">
      <Calendar
        className="schedule-page-calendar"
        onChange={(value) =>
          setSelectedDate(
            dayjs(value as Date)
              .tz("Asia/Seoul")
              .toDate(),
          )
        }
        onActiveStartDateChange={({ activeStartDate }) => {
          if (activeStartDate)
            setCalendarViewDate(
              dayjs(activeStartDate).tz("Asia/Seoul").toDate(),
            );
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

      <div className="flex w-full h-full flex-col bg-grayscale-100 pb-4 border-t border-grayscale-200">
        <div className="flex w-full justify-between bg-white itmes-center px-4 py-1 shadow-basic">
          <div className="title-1 py-2.5 px-3">{displayDate}</div>
          {isPast ? (
            <Button size="sm" theme="text" onClick={openAddAttendanceSheet}>
              + 근태 추가
            </Button>
          ) : (
            <Button size="sm" theme="text" onClick={openAddSingleScheduleSheet}>
              + 스케줄 추가
            </Button>
          )}
        </div>

        <div className="px-5 mt-4">
          <ScheduleFilter />
        </div>

        <div className="px-5 mt-8 text-center">
          <StaffScheduleList
            records={filteredRecords}
            onClick={(schedule, staff, attendance) => {
              if (attendance === null) {
                handleOpenScheduleDetail(schedule, staff, attendance);
              } else {
                handleOpenAttendanceDetail(schedule, staff, attendance);
              }
            }}
            emptyMessage={
              isPast ? "근태 기록이 없습니다." : "등록된 스케줄이 없습니다."
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
