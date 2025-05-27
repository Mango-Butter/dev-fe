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
  status: ContractStatus;
}

export type ContractStatus =
  | "PENDING_STAFF_SIGNATURE"
  | "COMPLETED"
  | "NOT_CREATED";

export interface ContractSimple {
  contractId: number;
  modifiedAt: string;
  bossSignedAt: string;
  staffSignedAt: string | null;
  status: ContractStatus;
}

export interface StaffSimple {
  staffId: number;
  name: string;
  profileImageUrl: string;
}

export interface BossContractSummary {
  staffSimpleResponse: StaffSimple;
  contractSimpleResponses: ContractSimple[];
}

export const statusLabelMap: Record<ContractSimple["status"], string> = {
  COMPLETED: "서명 완료",
  PENDING_STAFF_SIGNATURE: "서명 대기",
  NOT_CREATED: "미작성",
};

export interface BossStaffContractSummary {
  contractId: number;
  modifiedAt: string; // ISO datetime
  bossSignedAt: string;
  staffSignedAt: string | null;
  status: "PENDING_STAFF_SIGNATURE" | "COMPLETED" | "NOT_CREATED";
}
