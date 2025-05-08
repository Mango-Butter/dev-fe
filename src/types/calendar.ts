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
