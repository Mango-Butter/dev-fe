import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside.ts";

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const getMonthLabel = (yearMonth: string) => {
  const [year, month] = yearMonth.split("-");
  return `${year}년 ${parseInt(month)}월`;
};

const generateMonths = (min: string, max: string): string[] => {
  const [minY, minM] = min.split("-").map(Number);
  const [maxY, maxM] = max.split("-").map(Number);
  const months: string[] = [];

  for (let y = minY; y <= maxY; y++) {
    const startM = y === minY ? minM : 1;
    const endM = y === maxY ? maxM : 12;
    for (let m = startM; m <= endM; m++) {
      months.push(`${y}-${String(m).padStart(2, "0")}`);
    }
  }

  return months.reverse(); // 최신 월이 위에
};

const MonthPicker = ({
  value,
  onChange,
  min = "2000-01",
  max,
  disabled = false,
}: MonthPickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const monthOptions = generateMonths(min, max ?? value);

  return (
    <div className="relative w-full max-w-[140px]" ref={ref}>
      <button
        type="button"
        className={`w-full flex justify-between items-center border rounded-lg px-4 py-3 shadow-sm transition-colors ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white hover:bg-gray-50 text-gray-800 border-gray-300"
        }`}
        onClick={() => {
          if (!disabled) setOpen((prev) => !prev);
        }}
        disabled={disabled}
      >
        <span className="body-2">{getMonthLabel(value)}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && !disabled && (
        <div className="absolute top-full left-0 z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
          {monthOptions.map((month) => (
            <div
              key={month}
              onClick={() => {
                onChange(month);
                setOpen(false);
              }}
              className={`px-4 py-3 cursor-pointer text-sm text-gray-800 hover:bg-gray-100 ${
                month === value ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              {getMonthLabel(month)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthPicker;
