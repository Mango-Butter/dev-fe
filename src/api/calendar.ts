// src/apis/calendar.ts
import axiosAuth from "./axiosAuth.ts";

// 날짜별 근무 요약 응답 타입
export interface DailyCalendarSummary {
  date: string; // YYYY-MM-DD
  normalCount: number;
  lateCount: number;
  absentCount: number;
  preScheduleCount: number;
}

export interface CalendarSummaryResponse {
  result: DailyCalendarSummary[];
}

// 알바생 근태/근무 간단 조회 (캘린더 점 표시용)
export const fetchCalendarSummary = async (
  storeId: number,
  start: string, // YYYY-MM-DD
  end: string, // YYYY-MM-DD
): Promise<CalendarSummaryResponse> => {
  const response = await axiosAuth.get(`/api/boss/stores/${storeId}/calender`, {
    params: { start, end },
  });
  return response.data;
};

export type ClockInStatus = "NORMAL" | "LATE" | "ABSENT";
export type ClockOutStatus = "NORMAL" | "EARLY_LEAVE" | "OVERTIME";

export interface DailyAttendanceRecord {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  schedule: {
    scheduleId: number;
    workDate: string; // YYYY-MM-DD
    startTime: string; // ISO datetime
    endTime: string; // ISO datetime
  };
  attendance: {
    clockInTime: string | null;
    clockOutTime: string | null;
    clockInStatus: ClockInStatus | null;
    clockOutStatus: ClockOutStatus | null;
  };
}

export interface DailyAttendanceResponse {
  result: DailyAttendanceRecord[];
}

// 알바생 근태/근무 일별 상세 조회
export const fetchDailyAttendance = async (
  storeId: number,
  date: string, // YYYY-MM-DD
): Promise<DailyAttendanceResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/calender/daily`,
    {
      params: { date },
    },
  );
  return response.data;
};

export interface AttendanceDetail {
  scheduleId: number;
  workDate: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  clockInTime: string | null;
  clockOutTime: string | null;
  clockInStatus: ClockInStatus | null;
  clockOutStatus: ClockOutStatus | null;
}

// 특정 근태 기록 상세 조회
export const fetchAttendanceDetail = async (
  storeId: number,
  scheduleId: number,
): Promise<AttendanceDetail> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}/attendance`,
  );
  return response.data;
};
