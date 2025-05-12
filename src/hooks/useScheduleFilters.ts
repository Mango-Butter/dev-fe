import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const useScheduleFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtersParam = searchParams.get("filters") || "all";
  const filters = useMemo(
    () => new Set(filtersParam.split(",")),
    [filtersParam],
  );

  const updateFilters = (nextFilters: Set<string>) => {
    const updated = Array.from(nextFilters).join(",");
    const newParams = new URLSearchParams(searchParams);
    newParams.set("filters", updated);
    setSearchParams(newParams);
  };

  const toggleFilter = (key: string) => {
    const next = new Set(filters);
    if (key === "all") {
      next.clear();
      next.add("all");
    } else {
      next.has(key) ? next.delete(key) : next.add(key);
      next.delete("all");
      if (next.size === 0) next.add("all");
    }
    updateFilters(next);
  };

  return { filters, toggleFilter };
};
