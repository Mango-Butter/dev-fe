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

export interface StaffDocumentSummary {
  documentType:
    | "RESIDENT_REGISTRATION"
    | "HEALTH_CERTIFICATE"
    | "BANK_ACCOUNT"
    | "ID_CARD";
  isSubmitted: boolean;
  isRequired: boolean;
  expiresAt: string | null;
  documentId: number | null;
}

export interface UploadDocumentRequest {
  documentType: BossRequiredDocumentType;
  documentData: string; // base64 string
}

export interface UploadDocumentResponse {
  documentData: string;
  documentType:
    | "HEALTH_CERTIFICATE"
    | "ENUMRESIDENT_REGISTRATION"
    | "BANK_ACCOUNT"
    | "IDENTIFICATION";
  expiresAt: string | null;
}

export interface StaffContractSummary {
  contractId: number;
  modifiedAt: string; // ISO datetime
  status: "PENDING_STAFF_SIGNATURE" | "COMPLETED" | "NOT_CREATED";
}

export const documentLabelMap: Record<
  StaffDocumentSummary["documentType"],
  string
> = {
  RESIDENT_REGISTRATION: "주민등록등본",
  HEALTH_CERTIFICATE: "보건증",
  BANK_ACCOUNT: "통장사본",
  ID_CARD: "신분증",
};
