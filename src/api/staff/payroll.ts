import axiosAuth from "../common/axiosAuth.ts";
import {
  PayslipDownloadResponse,
  StaffAccountInfo,
  StaffPayrollBriefInfo,
  StaffPayrollResponse,
  StaffPayrollSettingsResponse,
  VerifyAccountRequest,
  VerifyAccountResponse,
} from "../../types/payroll.ts";

/**
 * 알바생 본인의 해당 월 급여 내역 조회
 * GET /api/staff/stores/{storeId}/payrolls?month=YYYY-MM
 */
export const getStaffPayroll = async (
  storeId: number,
  month: string,
): Promise<StaffPayrollResponse> => {
  const response = await axiosAuth.get<StaffPayrollResponse>(
    `/api/staff/stores/${storeId}/payrolls`,
    {
      params: { month },
    },
  );
  return response.data;
};

/**
 * 알바생 본인의 급여명세서 PDF 다운로드 URL 조회
 * GET /api/staff/stores/{storeId}/payrolls/payslip/{payslipId}
 */
export const fetchPayslipDownloadLink = async (
  storeId: number,
  payslipId: number,
): Promise<PayslipDownloadResponse> => {
  const response = await axiosAuth.get<PayslipDownloadResponse>(
    `/api/staff/stores/${storeId}/payrolls/payslip/${payslipId}`,
  );
  return response.data;
};

/**
 * 가게 급여 설정 정보 조회
 * GET /api/staff/stores/{storeId}/payrolls/settings
 */
export const getPayrollSettings = async (
  storeId: number,
): Promise<StaffPayrollSettingsResponse> => {
  const response = await axiosAuth.get<StaffPayrollSettingsResponse>(
    `/api/staff/stores/${storeId}/payrolls/settings`,
  );
  return response.data;
};

/**
 * 알바생 계좌 등록 (실명 인증)
 * POST /api/staff/stores/{storeId}/staffs/account-verification
 */
export const verifyStaffAccount = async (
  storeId: number,
  payload: VerifyAccountRequest,
): Promise<VerifyAccountResponse> => {
  const response = await axiosAuth.post<VerifyAccountResponse>(
    `/api/staff/stores/${storeId}/staffs/account-verification`,
    payload,
  );
  return response.data;
};

/**
 * 알바생 계좌 정보 조회
 * GET /api/staff/stores/{storeId}/staffs/account
 */
export const getStaffAccount = async (
  storeId: number,
): Promise<StaffAccountInfo> => {
  const response = await axiosAuth.get<StaffAccountInfo>(
    `/api/staff/stores/${storeId}/staffs/account`,
  );
  return response.data;
};

/**
 * 알바생의 시급 및 세금유형 조회
 * GET /api/staff/stores/{storeId}/staffs/me
 */
export const getStaffPayrollInfo = async (
  storeId: number,
): Promise<StaffPayrollBriefInfo> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/staffs/my`,
  );
  return response.data;
};

/**
 * 알바생 계좌 정보 삭제
 * DELETE /api/staff/stores/{storeId}/staffs/account
 */
export const deleteStaffAccountInfo = async (
  storeId: number,
): Promise<void> => {
  await axiosAuth.delete(`/api/staff/stores/${storeId}/staffs/account`);
};
