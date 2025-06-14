export interface AccountVerificationRequest {
  bankName: "농협은행"; // 고정
  accountNumber: string;
  birthdate: string; // YYYYMMDD
  password: string; // 숫자 4자리
}
export interface AccountVerificationResponse {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

export type DeductionUnit = "ZERO_MIN" | "FIVE_MIN" | "TEN_MIN" | "THIRTY_MIN";

export interface PayrollSettingsRequest {
  autoTransferEnabled: boolean;
  transferDate: number | null;
  deductionUnit: DeductionUnit;
  commutingAllowance: number;
}

export interface BossPayrollSettingsResponse {
  account: {
    bankName: string;
    accountNumber: string;
  } | null;
  autoTransferEnabled: boolean;
  transferDate: number | null;
  deductionUnit: DeductionUnit;
  commutingAllowance: number;
}

export type TransferState = "COMPLETED" | "FAILED" | "PENDING";

export interface ConfirmedTransferItem {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  data: {
    bankCode: string | null;
    account: string | null;
    month: string; // ISO date string, e.g. "2025-04-01"
    totalTime: number;
    netAmount: number;
  };
  info: {
    payrollId: number;
    transferState: TransferState;
    payslipId: number | null;
  };
}

export type WithholdingType = "INCOME_TAX" | "SOCIAL_INSURANCE" | "NONE";

export interface EstimatedPayrollItem {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  payroll: {
    key: string | null;
    data: {
      staffName: string;
      bankCode: string | null;
      account: string | null;
      month: string; // ISO 형식 "YYYY-MM-DD"
      withholdingType: WithholdingType;
      totalTime: number;
      baseAmount: number;
      weeklyAllowance: number;
      totalCommutingAllowance: number;
      totalAmount: number;
      withholdingTax: number;
      netAmount: number;
    };
  };
}
export interface ConfirmPayrollTargetsRequest {
  payrollKeys: string[];
}

export interface PayslipDownloadLink {
  url: string;
  expiresAt: string; // ISO datetime string
}

export interface MonthlyPayrollItem {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  data: {
    bankCode: string | null;
    account: string | null;
    month: string; // ISO date string e.g. "2025-04-01"
    totalTime: number;
    netAmount: number;
  };
  info: {
    payrollId: number;
    transferState: TransferState;
    payslipId: number | null;
  } | null;
}

export interface PayrollDetailResponse {
  data: {
    staffName: string;
    bankCode: string;
    account: string;
    month: string;
    withholdingType: WithholdingType;
    totalTime: number;
    baseAmount: number;
    weeklyAllowance: number;
    totalCommutingAllowance: number;
    totalAmount: number;
    withholdingTax: number;
    netAmount: number;
  };
  info: {
    payrollId: number;
    transferState: TransferState;
    payslipId: number;
  } | null;
}

export interface StaffWithholdingItem {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  withholdingType: WithholdingType;
}

export interface UpdateWithholdingRequest {
  withholdingType: WithholdingType;
}

export interface StaffHourlyWage {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  hourlyWage: number;
}

export interface UpdateHourlyWageRequest {
  hourlyWage: number;
}

/* staff */

export interface StaffPayrollData {
  staffName: string;
  bankCode: string;
  account: string;
  month: string; // YYYY-MM-DD 형식
  withholdingType: WithholdingType;
  totalTime: number;
  baseAmount: number;
  weeklyAllowance: number;
  totalCommutingAllowance: number;
  totalAmount: number;
  withholdingTax: number;
  netAmount: number;
}

export interface StaffPayrollInfo {
  payrollId: number;
  transferState: TransferState;
  payslipId: number;
}

export interface StaffPayrollResponse {
  data: StaffPayrollData;
  info: StaffPayrollInfo | null;
}

export interface PayslipDownloadResponse {
  url: string;
  expiresAt: string; // ISO datetime 문자열
}

export interface StaffPayrollSettingsResponse {
  autoTransferEnabled: boolean;
  transferDate: number | null;
  deductionUnit: DeductionUnit;
  commutingAllowance: number;
}

export interface VerifyAccountRequest {
  bankName: string;
  accountNumber: string;
}

export interface VerifyAccountResponse {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

export interface StaffAccountInfo {
  bankName: string | null;
  accountHolder: string | null;
  accountNumber: string | null;
}

export interface StaffPayrollBriefInfo {
  hourlyWage: number;
  withholdingType: WithholdingType;
}

export interface PayrollSummary {
  transferDate: string; // YYYY-MM-DD 형식의 날짜
  isTransferred: "PENDING" | "COMPLETED" | "NOT_YET";
}
