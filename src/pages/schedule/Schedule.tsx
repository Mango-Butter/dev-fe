import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { formatFullDate } from "../../utils/date";
import useBottomSheetStore from "../../stores/useBottomSheetStore";
import ScheduleAddForm from "./ScheduleAddForm";
import ArrowIcon from "../../components/icons/ArrowIcon";
import "../../styles/schedulePageCalendar.css";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [scheduleMap] = useState<{ [dateStr: string]: string[] }>({});

  const { setBottomSheetContent } = useBottomSheetStore();

  const openAddScheduleSheet = () => {
    setBottomSheetContent(<ScheduleAddForm />, {
      title: "스케줄 추가",
      closeOnClickOutside: true,
      onClose: () => console.log("스케줄 추가 시트 닫힘"),
    });
  };

  const dateKey = formatFullDate(selectedDate);

  const getDotColorClass = (status: string) => {
    switch (status) {
      case "출근":
        return "dot-green";
      case "지각":
        return "dot-yellow";
      case "결근":
        return "dot-red";
      case "추가근무":
        return "dot-blue";
      case "출근전":
        return "dot-gray";
      default:
        return "dot-gray";
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="schedule-page-calendar">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          calendarType="gregory"
          tileContent={({ date }) => {
            const key = formatFullDate(date);
            const statuses = scheduleMap[key];
            if (statuses) {
              return (
                <div className="dot-container">
                  {statuses.slice(0, 5).map((status, i) => (
                    <div
                      key={i}
                      className={`dot ${getDotColorClass(status)}`}
                    />
                  ))}
                </div>
              );
            }
            return null;
          }}
          prevLabel={<ArrowIcon direction="left" className="w-4 h-4" />}
          nextLabel={<ArrowIcon direction="right" className="w-4 h-4" />}
          prev2Label={null}
          next2Label={null}
          formatDay={(_, date) => date.getDate().toString()}
          showNeighboringMonth={false}
          tileClassName={({ date, view }) => {
            if (view !== "month") return undefined;
            const isSelected =
              formatFullDate(date) === formatFullDate(selectedDate);
            const day = date.getDay();
            const base = isSelected ? "selected-day" : "";
            if (day === 0) return `${base} sunday`;
            if (day === 6) return `${base} saturday`;
            return base;
          }}
        />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">
          {formatFullDate(selectedDate)} 스케줄
        </h2>
        <ul className="text-gray-700 space-y-1">
          {(scheduleMap[dateKey] || ["등록된 일정이 없습니다."]).map(
            (item, idx) => (
              <li key={idx}>• {item}</li>
            ),
          )}
        </ul>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={openAddScheduleSheet}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow"
        >
          스케줄 추가
        </button>
      </div>
    </div>
  );
};

export default Schedule;
