import {
  AttendanceEditRequest,
  NotificationItem,
  SubstituteRequest,
} from "../../types/notification.ts";
import axiosAuth from "../common/axiosAuth.ts";

/**
 * 알바생 알림 조회
 * @param storeId 매장 ID
 * @returns 알림 리스트
 */
export const fetchStaffNotifications = async (
  storeId: number,
): Promise<NotificationItem[]> => {
  const res = await axiosAuth.get(`/api/staff/stores/${storeId}/notifications`);
  return res.data.result;
};

/**
 * 본인의 근태 수정 요청 목록 조회 (알바생용)
 * @param storeId 매장 ID
 * @returns 근태 수정 요청 리스트
 */
export const fetchOwnAttendanceEditRequests = async (
  storeId: number,
): Promise<AttendanceEditRequest[]> => {
  const res = await axiosAuth.get(
    `/api/staff/stores/${storeId}/schedules/attendance-edits`,
  );
  return res.data.result;
};

/**
 * 알바생 대타 근무 요청 목록 조회 (내가 요청한 + 받은 요청 모두)
 * @param storeId 매장 ID
 * @returns 대타 요청 리스트
 */
export const fetchOwnSubstituteRequests = async (
  storeId: number,
): Promise<SubstituteRequest[]> => {
  const res = await axiosAuth.get(
    `/api/staff/stores/${storeId}/schedules/substitutions`,
  );
  return res.data.result;
};
