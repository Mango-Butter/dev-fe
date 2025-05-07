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
