import React from "react";
import { useTaskFilters } from "../../../../hooks/useTaskFilters.ts";

const filterButtons = [
  { key: "all", label: "전체" },
  { key: "state:COMPLETED", label: "완료됨" },
  { key: "state:IN_PROGRESS", label: "미완료" },
  { key: "type:PHOTO", label: "인증샷" },
  { key: "type:CHECK", label: "체크" },
];

const TaskFilterBar: React.FC = () => {
  const { filters, toggleFilter } = useTaskFilters();

  const isActive = (key: string) => filters.has(key);

  return (
    <div className="w-full flex pb-4 gap-2">
      {filterButtons.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => toggleFilter(key)}
          className={`px-2 py-1 text-sm rounded-full border whitespace-nowrap
            ${
              isActive(key)
                ? "bg-primary-100 text-primary-900 border-primary-900"
                : "bg-white text-gray-600 border-gray-300"
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilterBar;
