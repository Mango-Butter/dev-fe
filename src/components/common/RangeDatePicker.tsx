import { useState, useRef, useEffect } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import { formatFullDate } from "../../utils/date";
import { getKSTDate } from "../../libs/date"; // KST 기준 today
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

import ArrowIcon from "../icons/ArrowIcon";
import TextField from "./TextField.tsx";
import { CalendarOff } from "../icons/CalendarIcon.tsx";
import "../../styles/datePickerCalendar.css";

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

  const handleChange: CalendarProps["onChange"] = (picked, _) => {
    if (Array.isArray(picked)) {
      const [start, end] = picked.map((d) =>
        d ? dayjs(d).tz("Asia/Seoul").toDate() : null,
      ) as [Date | null, Date | null];

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
          icon={<CalendarOff />}
          onClick={() => setOpen(true)}
          handleIconClick={() => setOpen(true)}
        />
      </div>

      {open && (
        <div className="date-picker-calendar absolute z-10 mt-2 w-fit">
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
