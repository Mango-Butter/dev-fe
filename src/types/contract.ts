// src/types/contract.ts

export interface WorkSchedule {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface ContractDataInput {
  contractName: string;
  contractStart: string; // YYYY-MM-DD
  contractEnd: string; // YYYY-MM-DD
  duty: string;
  workSchedules: WorkSchedule[];
  hourlyWage: number;
}

export interface ContractCreateRequest {
  staffId: number;
  bossSignatureKey: string;
  contractDataInput: ContractDataInput;
}

export interface ContractCreateResponse {
  contractId: number;
}

export interface ContractData {
  contractName: string;
  storeName: string;
  staffName: string;
  contractStart: string; // ISO datetime
  contractEnd: string; // ISO datetime
  bossName: string;
  storeAddress: string;
  duty: string;
  workSchedules: WorkSchedule[];
  hourlyWage: number;
  businessNumber: string;
  staffPhone: string;
}

export interface ContractDetailResponse {
  contractData: ContractData;
  bossSignature: SignatureInfo;
  staffSignature: SignatureInfo | null;
}

export interface WorkSchedule {
  dayOfWeek:
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY"
    | "SUNDAY";
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export interface SignatureInfo {
  url: string;
  expiresAt: string; // ISO datetime
}

export interface ContractPdfViewResponse {
  url: string;
  expiresAt: string; // ISO datetime
}

export interface ContractPdfDownloadResponse {
  url: string;
  expiresAt: string; // ISO datetime
}

export interface StaffContractSummary {
  contractId: number;
  modifiedAt: string; // ISO datetime string
  isSigned: boolean;
}

export interface BossContractSummary {
  contractId?: number;
  modifiedAt?: string;
  status: "PENDING_STAFF_SIGNATURE" | "NOT_CREATED" | "COMPLETED";
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
}

export const statusLabelMap: Record<BossContractSummary["status"], string> = {
  COMPLETED: "서명 완료",
  PENDING_STAFF_SIGNATURE: "서명 대기",
  NOT_CREATED: "미작성",
};

export interface BossStaffContractSummary {
  contractId: number;
  createdAt: string; // ISO datetime
  bossSignedAt: string;
  staffSignedAt: string | null;
  status: "PENDING_STAFF_SIGNATURE" | "COMPLETED" | "NOT_CREATED";
}
