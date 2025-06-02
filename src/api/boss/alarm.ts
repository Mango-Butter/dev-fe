import {
  AttendanceEditRequest,
  SubstituteRequest,
} from "../../types/notification";
import axiosAuth from "../common/axiosAuth.ts";

/**
 * 대타 근무 요청 목록 조회 (사장님용)
 * @param storeId 매장 ID
 * @returns 대타 요청 리스트
 */
export const fetchSubstituteRequests = async (
  storeId: number,
): Promise<SubstituteRequest[]> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/schedules/substitutions`,
  );
  return res.data.result;
};

/**
 * 대타 근무 요청 승인 (사장님용)
 * @param storeId 매장 ID
 * @param substitutionId 대타 요청 ID
 * @returns 성공 여부
 */
export const approveSubstituteRequest = async (
  storeId: number,
  substitutionId: number,
): Promise<void> => {
  await axiosAuth.post(
    `/api/boss/stores/${storeId}/schedules/substitutions/${substitutionId}/approve`,
  );
};

/**
 * 대타 근무 요청 거절 (사장님용)
 * @param storeId 매장 ID
 * @param substitutionId 대타 요청 ID
 * @returns 성공 여부
 */
export const rejectSubstituteRequest = async (
  storeId: number,
  substitutionId: number,
): Promise<void> => {
  await axiosAuth.post(
    `/api/boss/stores/${storeId}/schedules/substitutions/${substitutionId}/reject`,
  );
};

/**
 * 근태 수정 요청 목록 조회 (사장님용)
 * @param storeId 매장 ID
 * @returns 근태 수정 요청 리스트
 */
export const fetchAttendanceEditRequests = async (
  storeId: number,
): Promise<AttendanceEditRequest[]> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/schedules/attendance-edits`,
  );
  return res.data.result;
};

/**
 * 근태 수정 요청 승인 (사장님용)
 * @param storeId 매장 ID
 * @param editId 근태 수정 요청 ID
 * @returns 성공 여부
 */
export const approveAttendanceEditRequest = async (
  storeId: number,
  editId: number,
): Promise<void> => {
  await axiosAuth.post(
    `/api/boss/stores/${storeId}/schedules/attendance-edits/${editId}/approve`,
  );
};

/**
 * 근태 수정 요청 거절 (사장님용)
 * @param storeId 매장 ID
 * @param editId 근태 수정 요청 ID
 * @returns 성공 여부
 */
export const rejectAttendanceEditRequest = async (
  storeId: number,
  editId: number,
): Promise<void> => {
  await axiosAuth.post(
    `/api/boss/stores/${storeId}/schedules/attendance-edits/${editId}/reject`,
  );
};
