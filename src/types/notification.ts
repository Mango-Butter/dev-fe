import { ClockInStatus } from "./calendar.ts";

export interface SubstituteRequest {
  substituteRequestId: number;
  requesterName: string;
  targetName: string;
  reason: string;
  substituteRequestState: "PENDING" | "APPROVED" | "REJECTED";
  workDate: string; // YYYY-MM-DD
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
  createdAt: string; // ISO datetime
}

export interface AttendanceEditRequest {
  attendanceEditId: number;
  staffName: string;
  reason: string;
  attendanceEditState: "PENDING" | "APPROVED" | "REJECTED";
  workDate: string; // YYYY-MM-DD
  originalAttendance: AttendanceRecord;
  requestedAttendance: AttendanceRecord;
  createdAt: string; // ISO datetime
}

export interface AttendanceRecord {
  clockInTime: string | null;
  clockOutTime: string | null;
  clockInStatus: ClockInStatus;
}
