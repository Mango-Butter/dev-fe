// src/pages/task/WeekCalendar.tsx
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import ArrowIcon from "../../components/icons/ArrowIcon.tsx";
import { cn } from "../../libs";

interface WeekCalendarProps {
  currentDate: Date;
  onChange: (date: Date) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const WeekCalendar = ({
  currentDate,
  onChange,
  onPrevWeek,
  onNextWeek,
}: WeekCalendarProps) => {
  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentDate),
    end: endOfWeek(currentDate),
  });

  return (
    <div className="flex w-full justify-between items-center h-15 shadow-[2px_2px_8px_0px_rgba(0,0,0,0.04)]">
      <button onClick={onPrevWeek} className="p-2">
        <ArrowIcon direction="left" className="w-4 h-4" />
      </button>
      <div className="calendar-grid">
        {weekDays.map((day, index) => (
          <div
            key={day.toString()}
            className={cn(
              "calendar-day",
              index === 0 && "sunday",
              index === 6 && "saturday",
            )}
            onClick={() => onChange(day)}
          >
            <span
              className={cn(
                format(day, "yyyy-MM-dd") ===
                  format(currentDate, "yyyy-MM-dd") && "selected",
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        ))}
      </div>
      <button onClick={onNextWeek} className="p-2">
        <ArrowIcon direction="right" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default WeekCalendar;
