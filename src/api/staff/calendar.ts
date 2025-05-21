// src/apis/calendar.ts
import axiosAuth from "../common/axiosAuth.ts";
import {
  AttendanceDetail,
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
    `/api/staff/stores/${storeId}/calender`,
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
    `/api/staff/stores/${storeId}/calender/daily`,
    {
      params: { date },
    },
  );
  return response.data;
};

// 특정 근태 기록 상세 조회
export const fetchAttendanceDetail = async (
  storeId: number,
  scheduleId: number,
): Promise<AttendanceDetail> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/schedules/${scheduleId}/attendance`,
  );
  return response.data;
};
