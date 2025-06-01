import axiosAuth from "../common/axiosAuth.ts";
import {
  PayrollSettingsResponse,
  PayslipDownloadResponse,
  StaffPayrollResponse,
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
): Promise<PayrollSettingsResponse> => {
  const response = await axiosAuth.get<PayrollSettingsResponse>(
    `/api/staff/stores/${storeId}/payrolls/settings`,
  );
  return response.data;
};
