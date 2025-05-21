import axiosAuth from "../common/axiosAuth.ts";
import {
  ClockInRequest,
  TodayScheduleWithAttendance,
} from "../../types/attendance.ts";

/**
 * 알바생 출근 인증
 * @param storeId 매장 ID
 * @param body 출근 요청 정보 (QR, GPS, BOTH)
 */
export const clockIn = async (
  storeId: number,
  body: ClockInRequest,
): Promise<void> => {
  await axiosAuth.post(
    `/api/staff/stores/${storeId}/schedules/attendance/clock-in`,
    body,
  );
};

/**
 * 알바생 퇴근 인증
 * @param storeId 매장 ID
 * @param body 퇴근 요청 정보 (QR, GPS, BOTH 방식)
 */
export const clockOut = async (
  storeId: number,
  body: ClockInRequest,
): Promise<void> => {
  await axiosAuth.post(
    `/api/staff/stores/${storeId}/schedules/attendance/clock-out`,
    body,
  );
};

/**
 * 알바생 오늘 스케줄 및 근태 기록 조회
 * @param storeId 매장 ID
 * @returns 오늘의 스케줄과 출퇴근 정보 리스트
 */
export const getTodayScheduleAndAttendance = async (
  storeId: number,
): Promise<TodayScheduleWithAttendance[]> => {
  const res = await axiosAuth.get(
    `/api/staff/stores/${storeId}/schedules/today`,
  );
  return res.data.result;
};
