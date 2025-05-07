// src/apis/schedule.ts
import axiosAuth from "./axiosAuth.ts";

export interface CreateSingleScheduleRequest {
  staffId: number;
  workDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// 단건 스케줄 생성
export const createSingleSchedule = async (
  storeId: number,
  body: CreateSingleScheduleRequest,
): Promise<unknown> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/schedules`,
    body,
  );
  return response.data;
};

// 수정용 요청 타입
export interface UpdateSingleScheduleRequest {
  workDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// 단건 스케줄 수정
export const updateSingleSchedule = async (
  storeId: number,
  scheduleId: number,
  body: UpdateSingleScheduleRequest,
): Promise<unknown> => {
  const response = await axiosAuth.put(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}`,
    body,
  );
  return response.data;
};

// 단건 스케줄 삭제
export const deleteSingleSchedule = async (
  storeId: number,
  scheduleId: number,
): Promise<unknown> => {
  const response = await axiosAuth.delete(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}`,
  );
  return response.data;
};

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

/**
 * 근태 강제 추가 API
 */
export const createAttendance = async (
  storeId: number,
  payload: CreateAttendanceRequest,
): Promise<CreateAttendanceResponse> => {
  const { data } = await axiosAuth.post<CreateAttendanceResponse>(
    `/api/boss/stores/${storeId}/schedules/attendance`,
    payload,
  );
  return data;
};

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

/**
 * 근태 수정 API
 */
export const updateAttendance = async (
  storeId: number,
  scheduleId: number,
  payload: UpdateAttendanceRequest,
): Promise<UpdateAttendanceResponse> => {
  const { data } = await axiosAuth.put<UpdateAttendanceResponse>(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}/attendance`,
    payload,
  );
  return data;
};

/**
 * 근태 삭제 API
 */
export const deleteAttendance = async (
  storeId: number,
  scheduleId: number,
): Promise<void> => {
  await axiosAuth.delete(
    `/api/boss/stores/${storeId}/schedules/${scheduleId}/attendance`,
  );
};
