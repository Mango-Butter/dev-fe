import { create } from "zustand";

interface TaskFiltersStore {
  filters: Set<string>;
  toggleFilter: (filter: string) => void;
}

const useTaskFilters = create<TaskFiltersStore>((set) => ({
  filters: new Set(["all"]),
  toggleFilter: (filter) =>
    set((state) => {
      const newFilters = new Set(state.filters);

      if (filter === "all") {
        if (newFilters.has("all")) {
          newFilters.delete("all");
        } else {
          newFilters.clear();
          newFilters.add("all");
        }
      } else {
        if (newFilters.has(filter)) {
          newFilters.delete(filter);
          if (newFilters.size === 0) {
            newFilters.add("all");
          }
        } else {
          newFilters.delete("all");
          newFilters.add(filter);
        }
      }

      return { filters: newFilters };
    }),
}));

export { useTaskFilters };
