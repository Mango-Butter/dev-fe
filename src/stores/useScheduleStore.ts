import { create } from "zustand";
import isEqual from "lodash.isequal";
import { DailySingleSchedule } from "../types/schedule.ts";
import { getDailySingleSchedules } from "../api/schedule.ts";

interface ScheduleStore {
  scheduleMap: Record<string, DailySingleSchedule[]>;
  fetchDailySchedule: (storeId: number, date: string) => Promise<void>;
}

const useScheduleStore = create<ScheduleStore>((set, get) => ({
  scheduleMap: {},
  fetchDailySchedule: async (storeId, date) => {
    const currentData = get().scheduleMap[date];
    try {
      const result = await getDailySingleSchedules(storeId, date);
      if (!isEqual(currentData, result)) {
        set((state) => ({
          scheduleMap: { ...state.scheduleMap, [date]: result },
        }));
      }
    } catch (err) {
      console.error("스케줄 조회 실패:", err);
    }
  },
}));

export default useScheduleStore;
