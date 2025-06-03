import axiosAuth from "../common/axiosAuth";
import {
  AccountVerificationRequest,
  AccountVerificationResponse,
  ConfirmedTransferItem,
  ConfirmPayrollTargetsRequest,
  EstimatedPayrollItem,
  MonthlyPayrollItem,
  PayrollDetailResponse,
  PayrollSettingsRequest,
  BossPayrollSettingsResponse,
  PayslipDownloadLink,
  StaffHourlyWage,
  StaffWithholdingItem,
  UpdateHourlyWageRequest,
  UpdateWithholdingRequest,
} from "../../types/payroll";

/**
 * 계좌 정보 본인 인증 (등록)
 * POST /api/boss/stores/{storeId}/payrolls/account-verification
 */
export const verifyAccountInfo = async (
  storeId: number,
  payload: AccountVerificationRequest,
): Promise<AccountVerificationResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/payrolls/account-verification`,
    payload,
  );
  return response.data;
};

/**
 * 계좌 정보 삭제
 * DELETE /api/boss/stores/{storeId}/payrolls/account
 */
export const deleteAccountInfo = async (storeId: number): Promise<void> => {
  await axiosAuth.delete(`/api/boss/stores/${storeId}/payrolls/account`);
};

/**
 * 매장의 급여 정보 설정
 * POST /api/boss/stores/{storeId}/payrolls/settings
 */
export const updatePayrollSettings = async (
  storeId: number,
  payload: PayrollSettingsRequest,
): Promise<void> => {
  await axiosAuth.post(
    `/api/boss/stores/${storeId}/payrolls/settings`,
    payload,
  );
};

/**
 * 급여 설정 정보 조회
 * GET /api/boss/stores/{storeId}/payrolls/settings
 */
export const fetchPayrollSettings = async (
  storeId: number,
): Promise<BossPayrollSettingsResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/settings`,
  );
  return response.data;
};

// 자동송금 페이지
/**
 * 전체 알바생 예상월급 목록 조회
 * GET /api/boss/stores/{storeId}/payrolls/staffs
 */
export const fetchEstimatedPayrolls = async (
  storeId: number,
): Promise<EstimatedPayrollItem[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/staffs`,
  );
  return response.data.result;
};

/**
 * 지급 대상 확정
 * POST /api/boss/stores/{storeId}/payrolls/staffs
 */
export const confirmPayrollTargets = async (
  storeId: number,
  payload: ConfirmPayrollTargetsRequest,
): Promise<void> => {
  await axiosAuth.post(`/api/boss/stores/${storeId}/payrolls/staffs`, payload);
};

/**
 * 확정된 송금 목록 조회
 * GET /api/boss/stores/{storeId}/payrolls/confirm
 */
export const fetchConfirmedTransfers = async (
  storeId: number,
): Promise<ConfirmedTransferItem[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/confirm`,
  );
  return response.data.result;
};

/**
 * 급여내역 목록 조회 (월별)
 * GET /api/boss/stores/{storeId}/payrolls?month=YYYY-MM
 */
export const fetchMonthlyPayrolls = async (
  storeId: number,
  month: string, // 예: "2025-03"
): Promise<MonthlyPayrollItem[]> => {
  const response = await axiosAuth.get(`/api/boss/stores/${storeId}/payrolls`, {
    params: { month },
  });
  return response.data.result;
};

// 확정된 급여명세서 조회
export const fetchPayrollDetail = async (
  storeId: number,
  payrollId: number,
): Promise<PayrollDetailResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/${payrollId}`,
  );
  return response.data;
};

// 비송금 대상 급여명세서 조회
export const fetchUnconfirmedPayrollDetail = async (
  storeId: number,
  staffId: number,
  month: string,
): Promise<PayrollDetailResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/staffs/${staffId}`,
    { params: { month } },
  );
  return response.data;
};

/**
 * 급여명세서 다운로드 링크 조회
 * GET /api/boss/stores/{storeId}/payrolls/payslip/{payslipId}
 */
export const fetchPayslipDownloadLink = async (
  storeId: number,
  payslipId: number,
): Promise<PayslipDownloadLink> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/payrolls/payslip/${payslipId}`,
  );
  return response.data;
};

/**
 * 알바생 공제항목 목록 조회
 * GET /api/boss/stores/{storeId}/staffs/withholding
 */
export const getStaffWithholdingList = async (
  storeId: number,
): Promise<StaffWithholdingItem[]> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/withholding`,
  );
  return res.data.result;
};

/**
 * 알바생 공제항목 수정
 * PUT /api/boss/stores/{storeId}/staffs/{staffId}/withholding
 */
export const updateStaffWithholding = async (
  storeId: number,
  staffId: number,
  payload: UpdateWithholdingRequest,
): Promise<void> => {
  await axiosAuth.put(
    `/api/boss/stores/${storeId}/staffs/${staffId}/withholding`,
    payload,
  );
};

/**
 * 알바생 시급 목록 조회
 * GET /api/boss/stores/{storeId}/staffs/hourly-wage
 */
export const fetchHourlyWageList = async (
  storeId: number,
): Promise<StaffHourlyWage[]> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/staffs/hourly-wage`,
  );
  return response.data.result;
};

/**
 * 알바생 시급 설정
 * PUT /api/boss/stores/{storeId}/staffs/{staffId}/hourly-wage
 */
export const updateStaffHourlyWage = async (
  storeId: number,
  staffId: number,
  payload: UpdateHourlyWageRequest,
): Promise<void> => {
  await axiosAuth.put(
    `/api/boss/stores/${storeId}/staffs/${staffId}/hourly-wage`,
    payload,
  );
};
