import Label from "../../components/common/Label";
import { useScheduleFilters } from "../../hooks/useScheduleFilters";

export const scheduleFilterItems = [
  { key: "all", label: "전체" },
  { key: "clockIn:NORMAL", label: "출근" },
  { key: "clockIn:LATE", label: "지각" },
  { key: "clockIn:ABSENT", label: "결근" },
  { key: "clockIn:null", label: "출근 전" },
  { key: "clockOut:OVERTIME", label: "추가 근무" },
  { key: "clockOut:EARLY_LEAVE", label: "조기 퇴근" },
];

const ScheduleFilter = () => {
  const { filters, toggleFilter } = useScheduleFilters();

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {scheduleFilterItems.map(({ key, label }) => (
        <Label
          key={key}
          theme={filters.has(key) ? "indigo" : "graysolid"}
          size="lg"
          className={
            filters.has(key)
              ? ""
              : "bg-white border border-grayscale-300 cursor-pointer"
          }
          onClick={() => toggleFilter(key)}
        >
          {label}
        </Label>
      ))}
    </div>
  );
};

export default ScheduleFilter;
