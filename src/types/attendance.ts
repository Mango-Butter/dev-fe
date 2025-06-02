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

export type ClockInMethod = "QR" | "GPS" | "BOTH";

export interface ClockInQrRequest {
  attendanceMethod: "QR";
  scheduleId: number;
  qrCode: string;
}

export interface ClockInGpsRequest {
  attendanceMethod: "GPS";
  scheduleId: number;
  latitude: number;
  longitude: number;
  locationFetchedAt: string; // ISO datetime
}

export interface ClockInBothRequest {
  attendanceMethod: "BOTH";
  scheduleId: number;
  qrCode: string;
  latitude: number;
  longitude: number;
  locationFetchedAt: string; // ISO datetime
}

export type ClockInRequest =
  | ClockInQrRequest
  | ClockInGpsRequest
  | ClockInBothRequest;

export interface TodaySchedule {
  scheduleId: number;
  workDate: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
}

export interface TodayAttendance {
  clockInTime: string;
  clockOutTime: string | null;
  clockInStatus: "NORMAL" | "LATE" | "ABSENT";
  clockOutStatus: "NORMAL" | "EARLY_LEAVE" | "OVERTIME" | null;
}

export interface TodayScheduleWithAttendance {
  schedule: TodaySchedule;
  attendance: TodayAttendance | null;
}

export const clockInStatusLabelMap: Record<
  "NORMAL" | "LATE" | "ABSENT",
  string
> = {
  NORMAL: "정상 출근",
  LATE: "지각",
  ABSENT: "결근",
};

export const clockOutStatusLabelMap: Record<
  "NORMAL" | "EARLY_LEAVE" | "OVERTIME",
  string
> = {
  NORMAL: "정상 퇴근",
  EARLY_LEAVE: "조기 퇴근",
  OVERTIME: "연장 근무",
};

export interface StaffAttendanceEditRequest {
  reason: string;
  requestedClockInTime: string; // "HH:mm" 형식
  requestedClockOutTime: string; // "HH:mm" 형식
  requestedClockInStatus: "NORMAL" | "LATE" | "ABSENT";
}
