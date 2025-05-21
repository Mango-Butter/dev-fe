import axiosAuth from "../common/axiosAuth.ts";
import {
  ConfirmPayrollTransfersResponse,
  PayrollSettingsResponse,
  StaffPayroll,
} from "../../types/payroll.ts";

/**
 * 전체 알바생 예상 월급 목록 조회 (사장님용)
 * @param storeId 매장 ID
 * @returns 알바생들의 급여 정보 목록
 */
export const fetchStaffPayrolls = async (
  storeId: number,
): Promise<StaffPayroll[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/staffs`,
  );
  return response.data.result;
};

/**
 * 급여 설정 정보 조회 (사장님용)
 * @param storeId 매장 ID
 * @returns 급여 설정 데이터
 */
export const getPayrollSettings = async (
  storeId: number,
): Promise<PayrollSettingsResponse> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/settings`,
  );
  return res.data;
};

/**
 * 알바생 송금 확정 요청
 * @param storeId 매장 ID
 * @param payrollKeys 확정할 급여 key 리스트
 * @returns 확정된 알바생 급여 목록
 */
export const confirmPayrollTransfers = async (
  storeId: number,
  payrollKeys: string[],
): Promise<ConfirmPayrollTransfersResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/payrolls/staffs`,
    { payrollKeys },
  );
  return response.data;
};

/**
 * 확정된 알바생 송금 목록 조회
 * @param storeId 매장 ID
 * @returns 확정된 급여 정보 배열
 */
export const fetchConfirmedPayrolls = async (
  storeId: number,
): Promise<StaffPayroll[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/staffs/confirm`,
  );
  return response.data.result;
};
