import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside.ts";
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
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [hour, minute] = value.split(":");

  useClickOutside(ref, () => setOpen(false));

  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutes = Array.from({ length: 60 / step }, (_, i) =>
    String(i * step).padStart(2, "0"),
  );

  const updateTime = (h: string, m: string) => {
    onChange(`${h}:${m}`);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-[130px]">
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
        {value}
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-10 bg-white border rounded-xl shadow-lg flex overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {hours.map((h) => (
              <div
                key={h}
                className={`px-5 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                  h === hour ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => updateTime(h, minute)}
              >
                {h}
              </div>
            ))}
          </div>
          <div className="border-l max-h-48 overflow-y-auto">
            {minutes.map((m) => (
              <div
                key={m}
                className={`px-6 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                  m === minute ? "bg-gray-100 font-semibold" : ""
                }`}
                onClick={() => updateTime(hour, m)}
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
