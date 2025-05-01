import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ArrowIcon from "../../components/icons/ArrowIcon";
import { formatFullDate } from "../../utils/date";
import useBottomSheetStore from "../../stores/useBottomSheetStore";
import SingleScheduleAddForm from "./SingleScheduleAddForm.tsx";
import useScheduleStore from "../../stores/useScheduleStore";
import "../../styles/schedulePageCalendar.css";
import Button from "../../components/common/Button.tsx";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { scheduleMap, fetchDailySchedule } = useScheduleStore();
  const { setBottomSheetContent } = useBottomSheetStore();
  const storeId = 1;
  const dateKey = formatFullDate(selectedDate); // ✅ YYYY-MM-DD 형식

  useEffect(() => {
    fetchDailySchedule(storeId, dateKey);
  }, [dateKey, storeId, fetchDailySchedule]);

  const openAddSingleScheduleSheet = () => {
    setBottomSheetContent(<SingleScheduleAddForm />, {
      title: "스케줄 추가",
      closeOnClickOutside: true,
    });
  };

  const isTodayOrFuture =
    selectedDate >= new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="flex flex-col w-full h-full">
      <Calendar
        className="schedule-page-calendar"
        onChange={(value) => setSelectedDate(value as Date)}
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
          const isTodayOrFuture =
            date >= new Date(new Date().setHours(0, 0, 0, 0));
          const hasSchedule =
            isTodayOrFuture && (scheduleMap[dateStr]?.length ?? 0) > 0;

          return (
            <div className="calendar-dot-layer">
              {hasSchedule && (
                <span className="calendar-dot calendar-dot--schedule" />
              )}
            </div>
          );
        }}
      />

      <div className="flex w-full h-full flex-col bg-grayscale-100 px-5 py-4">
        <div className="flex w-full justify-between items-center">
          <h2 className="heading-2 mb-2">{dateKey}</h2>
          <Button
            size="sm"
            onClick={openAddSingleScheduleSheet}
            theme="outline"
            disabled={!isTodayOrFuture}
            state={isTodayOrFuture ? "default" : "disabled"}
          >
            스케줄 추가
          </Button>
        </div>

        <div className="mt-8 text-center">
          <ul className="space-y-2">
            {scheduleMap[dateKey]?.length > 0 ? (
              scheduleMap[dateKey].map(({ staff, schedule }, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between border rounded p-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={staff.profileImageUrl}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold">{staff.name}</p>
                      <p className="text-xs text-gray-500">
                        {schedule.startTime} ~ {schedule.endTime}
                      </p>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">등록된 일정이 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
