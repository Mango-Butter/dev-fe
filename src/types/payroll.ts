export interface PayrollStaff {
  staffId: number;
  name: string;
  profileImageUrl: string;
}

export interface PayrollDetail {
  key: string;
  bankCode: string;
  account: string;
  month: string;
  withholdingType: string;
  totalTime: number;
  baseAmount: number;
  weeklyAllowance: number;
  totalAmount: number;
  withholdingTax: number;
  netAmount: number;
}

export interface StaffPayroll {
  staff: PayrollStaff;
  payroll: PayrollDetail;
}

export type DeductionUnit = "ZERO_MIN" | "FIVE_MIN" | "TEN_MIN" | "THIRTY_MIN";

export interface PayrollAccount {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface PayrollSettingsResponse {
  account: PayrollAccount | null;
  autoTransferEnabled: boolean;
  transferDate: number | null;
  overtimeLimit: number;
  deductionUnit: DeductionUnit;
}

export interface ConfirmPayrollTransfersRequest {
  payrollKeys: string[];
}

export interface ConfirmPayrollTransfersResponse {
  result: StaffPayroll[];
}
