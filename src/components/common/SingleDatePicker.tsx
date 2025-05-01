import { useState, useRef, useEffect } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { formatFullDate } from "../../utils/date";
import ArrowIcon from "../icons/ArrowIcon";
import TextField from "./TextField.tsx";
import CalendarIcon from "../icons/CalendarIcon.tsx";
import "../../styles/datePickerCalendar.css";

interface SingleDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  mode?: "past" | "future" | "full";
  placeholder?: string;
}

export default function SingleDatePicker({
  value,
  onChange,
  mode = "future",
  placeholder = "날짜를 선택해 주세요",
}: SingleDatePickerProps) {
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

  const handleChange: CalendarProps["onChange"] = (selectedDate, _) => {
    if (selectedDate instanceof Date || selectedDate === null) {
      onChange(selectedDate);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative w-full">
      <TextField
        value={value ? formatFullDate(value) : ""}
        readOnly
        placeholder={placeholder}
        onClick={() => setOpen((prev) => !prev)}
        theme="icon"
        icon={<CalendarIcon />}
        handleIconClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="date-picker-calendar absolute z-10 mt-2 w-fit">
          <Calendar
            calendarType="gregory"
            value={value}
            onChange={handleChange}
            selectRange={false}
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
