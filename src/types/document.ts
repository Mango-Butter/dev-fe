export type BossRequiredDocumentType =
  | "RESIDENT_REGISTRATION"
  | "BANK_ACCOUNT"
  | "ID_CARD"
  | "HEALTH_CERTIFICATE";

export interface RequiredDocumentSetting {
  documentType: BossRequiredDocumentType;
  isRequired: boolean;
}

export interface RequiredDocumentResponse {
  result: RequiredDocumentSetting[];
}

export interface StaffDocumentStatus {
  staffId: number;
  staffName: string;
  isSubmitted: boolean;
  documentId: number | null;
}

export interface StaffDocumentStatusResponse {
  result: StaffDocumentStatus[];
}

export interface DocumentViewUrlResponse {
  url: string;
  expiresAt: string; // ISO datetime
}

export interface DocumentDownloadUrlResponse {
  url: string;
  expiresAt: string;
}

export const documentTypeLabelMap: Record<BossRequiredDocumentType, string> = {
  RESIDENT_REGISTRATION: "주민등록등본",
  BANK_ACCOUNT: "통장 사본",
  ID_CARD: "신분증 사본",
  HEALTH_CERTIFICATE: "보건증",
};
