import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../libs";

interface TimeInputProps {
  value: string; // "09:00"
  onChange: (val: string) => void;
  disabled?: boolean;
  step?: number;
  error?: boolean;
}

const TimeInput = ({
  value,
  onChange,
  disabled = false,
  step = 10,
  error = false,
}: TimeInputProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [tempHour, tempMinute] = value.split(":");

  const [selectedHour, setSelectedHour] = useState(tempHour || "00");
  const [selectedMinute, setSelectedMinute] = useState(tempMinute || "00");

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setTimeout(() => setOpen(false), 100); // 살짝 딜레이 주면 선택 실수 방지
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 / step }, (_, i) =>
    String(i * step).padStart(2, "0"),
  );

  const handleSelectHour = (h: string) => {
    setSelectedHour(h);
    if (selectedMinute) {
      onChange(`${h}:${selectedMinute}`);
      setOpen(false);
    }
  };

  const handleSelectMinute = (m: string) => {
    setSelectedMinute(m);
    if (selectedHour) {
      onChange(`${selectedHour}:${m}`);
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={cn(
          "w-full px-5 py-3 border rounded-lg flex justify-between items-center body-2",
          error ? "border-red-500" : "border-gray-300",
          disabled ? "bg-gray-50 text-gray-500 cursor-not-allowed" : "bg-white",
        )}
      >
        {value || "00:00"}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute w-full left-0 top-full mt-2 z-20 bg-white border rounded-xl shadow-lg flex overflow-hidden">
          <div className="flex-1 max-h-48 overflow-y-auto">
            {hours.map((h) => (
              <div
                key={h}
                className={cn(
                  "w-full text-center px-5 py-2 cursor-pointer text-sm hover:bg-gray-100",
                  h === selectedHour ? "bg-gray-100 font-semibold" : "",
                )}
                onClick={() => handleSelectHour(h)}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="flex-1 border-l max-h-48 overflow-y-auto">
            {minutes.map((m) => (
              <div
                key={m}
                className={cn(
                  "w-full text-center px-6 py-2 cursor-pointer text-sm hover:bg-gray-100",
                  m === selectedMinute ? "bg-gray-100 font-semibold" : "",
                )}
                onClick={() => handleSelectMinute(m)}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeInput;
