// src/apis/calendar.ts
import axiosAuth from "../common/axiosAuth.ts";
import {
  CalendarSummaryResponse,
  DailyAttendanceResponse,
} from "../../types/calendar.ts";

// 알바생 근태/근무 간단 조회 (캘린더 점 표시용)
export const fetchCalendarSummary = async (
  storeId: number,
  start: string, // YYYY-MM-DD
  end: string, // YYYY-MM-DD
): Promise<CalendarSummaryResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/calendar`,
    {
      params: { start, end },
    },
  );
  return response.data;
};

// 알바생 근태/근무 일별 상세 조회
export const fetchDailyAttendance = async (
  storeId: number,
  date: string, // YYYY-MM-DD
): Promise<DailyAttendanceResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/calendar/daily`,
    {
      params: { date },
    },
  );
  return response.data;
};
