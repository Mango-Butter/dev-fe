import { useState, useRef, useEffect } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { formatFullDate } from "../../utils/date";
import ArrowIcon from "../icons/ArrowIcon";
import TextField from "./TextField.tsx";
import CalendarIcon from "../icons/CalendarIcon.tsx";

interface RangeDatePickerProps {
  value: [Date | null, Date | null];
  onChange: (range: [Date | null, Date | null]) => void;
  mode?: "past" | "future" | "full";
}

export default function RangeDatePicker({
  value,
  onChange,
  mode = "future",
}: RangeDatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isDateDisabled = (date: Date, view: string) => {
    if (view !== "month") return false;
    const base = new Date(today.setHours(0, 0, 0, 0));
    if (mode === "past") return date >= base;
    if (mode === "future") return date < base;
    return false;
  };

  const handleChange: CalendarProps["onChange"] = (picked, _) => {
    if (Array.isArray(picked)) {
      const [start, end] = picked;
      onChange([start, end]);
      if (start && end) {
        setOpen(false);
      }
    }
  };

  const [startDate, endDate] = value;

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex gap-2">
        <TextField
          readOnly
          value={startDate ? formatFullDate(startDate) : ""}
          placeholder="시작일"
          theme="basic"
          onClick={() => setOpen(true)}
          handleIconClick={() => setOpen(true)}
        />
        <span className="self-center text-gray-400">~</span>
        <TextField
          readOnly
          value={endDate ? formatFullDate(endDate) : ""}
          placeholder="종료일"
          theme="icon"
          icon={<CalendarIcon />}
          onClick={() => setOpen(true)}
          handleIconClick={() => setOpen(true)}
        />
      </div>

      {open && (
        <div className="absolute z-10 mt-2 w-fit">
          <Calendar
            calendarType="gregory"
            value={value}
            onChange={handleChange}
            selectRange={true}
            minDate={mode === "future" ? today : undefined}
            maxDate={mode === "past" ? today : undefined}
            prevLabel={<ArrowIcon direction="left" className="w-4 h-4" />}
            nextLabel={<ArrowIcon direction="right" className="w-4 h-4" />}
            prev2Label={null}
            next2Label={null}
            formatDay={(_, date) => date.getDate().toString()}
            showNeighboringMonth={false}
            tileDisabled={({ date, view }) => isDateDisabled(date, view)}
            tileClassName={({ date, view }) => {
              if (view !== "month") return undefined;
              if (isDateDisabled(date, view)) return undefined;
              const day = date.getDay();
              if (day === 0) return "sunday";
              if (day === 6) return "saturday";
              return undefined;
            }}
          />
        </div>
      )}
    </div>
  );
}
