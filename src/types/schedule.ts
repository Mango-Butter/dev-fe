export interface CreateSingleScheduleRequest {
  staffId: number;
  workDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// 수정용 요청 타입
export interface UpdateSingleScheduleRequest {
  workDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface CreateAttendanceRequest {
  staffId: number;
  workDate: string; // "YYYY-MM-DD"
  clockInTime: string; // "HH:mm"
  clockOutTime: string; // "HH:mm"
}

export interface CreateAttendanceResponse {
  scheduleId: number;
  workDate: string;
  startTime: string; // "YYYY-MM-DDTHH:mm:ss"
  endTime: string; // "YYYY-MM-DDTHH:mm:ss"
  clockInTime: string; // "HH:mm"
  clockOutTime: string; // "HH:mm"
  clockInStatus: "NORMAL" | "LATE" | "ABSENT";
  clockOutStatus: "NORMAL" | "EARLY_LEAVE" | "OVERTIME";
}

export interface UpdateAttendanceRequest {
  clockInTime: string | null; // "HH:mm"
  clockOutTime: string | null; // "HH:mm"
  clockInStatus: "NORMAL" | "LATE" | "ABSENT";
}

export interface UpdateAttendanceResponse {
  scheduleId: number;
  workDate: string;
  startTime: string;
  endTime: string;
  clockInTime: string | null;
  clockOutTime: string | null;
  clockInStatus: "NORMAL" | "LATE" | "ABSENT";
  clockOutStatus: "NORMAL" | "EARLY_LEAVE" | "OVERTIME";
}

export interface StaffSubstitutionRequest {
  targetStaffId: number;
  reason: string;
}

export interface SubstituteCandidate {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  valid: boolean;
}
