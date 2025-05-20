import { create } from "zustand";
import { getCalendarRange } from "../../utils/date.ts";
import {
  DailyAttendanceRecord,
  DailyCalendarSummary,
} from "../../types/calendar.ts";
import {
  fetchCalendarSummary,
  fetchDailyAttendance,
} from "../../api/staff/calendar.ts";

interface StaffScheduleStore {
  scheduleMap: Record<string, DailyAttendanceRecord[]>;
  fetchDailySchedule: (storeId: number, date: string) => Promise<void>;
  clearScheduleMap: () => void;

  dotMap: Record<string, DailyCalendarSummary>;
  fetchDotRange: (storeId: number, viewDate: Date) => Promise<void>;
  clearDotMap: () => void;

  syncScheduleAndDot: (storeId: number, date: string) => Promise<void>;
}

const useStaffScheduleStore = create<StaffScheduleStore>((set, get) => ({
  // --- 스케줄 관련 ---
  scheduleMap: {},

  fetchDailySchedule: async (storeId, date) => {
    try {
      const { result } = await fetchDailyAttendance(storeId, date);
      set((state) => ({
        scheduleMap: {
          ...state.scheduleMap,
          [date]: result,
        },
      }));
    } catch (error) {
      console.error("스케줄 조회 실패:", error);
    }
  },

  clearScheduleMap: () => set({ scheduleMap: {} }),

  // --- Dot 관련 ---
  dotMap: {},

  fetchDotRange: async (storeId, viewDate) => {
    try {
      const { start, end } = getCalendarRange(viewDate);
      const { result } = await fetchCalendarSummary(storeId, start, end);
      const newMap: Record<string, DailyCalendarSummary> = {};
      result.forEach((entry) => {
        newMap[entry.date] = entry;
      });

      set({ dotMap: newMap });
    } catch (err) {
      console.error("캘린더 dot 정보 조회 실패:", err);
    }
  },

  clearDotMap: () => set({ dotMap: {} }),

  // --- 전체 동기화 ---
  syncScheduleAndDot: async (storeId, date) => {
    const parsed = new Date(date);
    await Promise.all([
      get().fetchDailySchedule(storeId, date),
      get().fetchDotRange(storeId, parsed),
    ]);
  },
}));

export default useStaffScheduleStore;
