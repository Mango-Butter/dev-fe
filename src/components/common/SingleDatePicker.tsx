import { useState, useRef, useEffect } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { formatFullDate } from "../../utils/date";
import { getKSTDate } from "../../libs/date"; // ✅ KST 기준 유틸
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

import ArrowIcon from "../icons/ArrowIcon";
import TextField from "./TextField.tsx";
import "../../styles/datePickerCalendar.css";
import { CalendarOff } from "../icons/CalendarIcon.tsx";

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

  const today = getKSTDate();

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
    const base = dayjs(today).startOf("day");
    const target = dayjs(date).tz("Asia/Seoul").startOf("day");

    if (mode === "past") return !target.isBefore(base);
    if (mode === "future") return target.isBefore(base);
    return false;
  };

  const handleChange: CalendarProps["onChange"] = (selectedDate, _) => {
    if (selectedDate instanceof Date || selectedDate === null) {
      const kstDate = selectedDate
        ? dayjs(selectedDate).tz("Asia/Seoul").toDate()
        : null;
      onChange(kstDate);
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
        icon={<CalendarOff />}
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
