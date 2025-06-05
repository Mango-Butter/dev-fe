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

      // 전체 필터 클릭 시
      if (filter === "all") {
        if (newFilters.size === 1 && newFilters.has("all")) {
          // ✅ 이미 all만 켜져 있으면 무시
          return state;
        } else {
          // ✅ 다른 필터 선택 중이면 모두 초기화하고 all만 켜기
          newFilters.clear();
          newFilters.add("all");
          return { filters: newFilters };
        }
      }

      // 나머지 필터 토글
      newFilters.delete("all"); // all 비활성화

      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }

      // ✅ 모든 필터를 다 눌렀으면 all로 대체
      const allStates = ["state:COMPLETED", "state:IN_PROGRESS"];
      const allTypes = ["type:PHOTO", "type:CHECK"];

      const allStateSelected = allStates.every((f) => newFilters.has(f));
      const allTypeSelected = allTypes.every((f) => newFilters.has(f));

      if (allStateSelected && allTypeSelected) {
        newFilters.clear();
        newFilters.add("all");
      }

      // ✅ 아무것도 없으면 all 켜기
      if (newFilters.size === 0) {
        newFilters.add("all");
      }

      return { filters: newFilters };
    }),
}));

export { useTaskFilters };
