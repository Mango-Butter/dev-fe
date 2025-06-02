import axiosAuth from "../common/axiosAuth.ts";
import {
  StaffSubstitutionRequest,
  SubstituteCandidate,
} from "../../types/schedule.ts";

/**
 * 알바생 대타 근무 요청
 * @param storeId 매장 ID
 * @param scheduleId 요청 대상 스케줄 ID
 * @param body 대타 요청 정보
 */
export const requestSubstitution = async (
  storeId: number,
  scheduleId: number,
  body: StaffSubstitutionRequest,
): Promise<void> => {
  await axiosAuth.post(
    `/api/staff/stores/${storeId}/schedules/${scheduleId}/substitutions`,
    body,
  );
};

/**
 * 대타 근무 요청 후보 알바생 목록 조회
 * @param storeId 매장 ID
 * @param scheduleId 스케줄 ID
 * @returns 대타 근무 가능 여부와 알바생 정보 목록
 */
export const fetchSubstituteCandidates = async (
  storeId: number,
  scheduleId: number,
): Promise<SubstituteCandidate[]> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/schedules/${scheduleId}/substitute-candidates`,
  );
  return response.data.result;
};
