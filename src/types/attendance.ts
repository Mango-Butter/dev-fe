// src/types/attendance.ts

import { ClockInStatus, ClockOutStatus } from "./calendar.ts";

export interface StaffAttendanceRecord {
  scheduleId: number;
  workDate: string; // YYYY-MM-DD
  startTime: string; // ISO string (or HH:mm)
  endTime: string; // ISO string
  clockInTime: string | null; // ISO string or null
  clockOutTime: string | null; // ISO string or null
  clockInStatus: ClockInStatus;
  clockOutStatus: ClockOutStatus;
}

export interface UpdateAttendanceRequest {
  clockInTime: string; // "HH:mm:ss" 또는 ISO
  clockOutTime: string; // "HH:mm:ss" 또는 ISO
  clockInStatus: ClockInStatus;
}
