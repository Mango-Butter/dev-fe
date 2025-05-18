// src/apis/staff/contract.ts
import {
  ContractDetailResponse,
  ContractPdfDownloadResponse,
  ContractPdfViewResponse,
  StaffContractSummary,
} from "../../types/contract.ts";
import axiosAuth from "../common/axiosAuth.ts";

/**
 * 근로계약서 서명 이미지를 암호화된 base64 문자열로 업로드하여 signatureKey를 반환
 * @param storeId 매장 ID
 * @param encryptedBase64 암호화된 서명 base64 (IV + CipherText)
 * @returns signatureKey (string)
 */
export const uploadStaffSignature = async (
  storeId: number,
  encryptedBase64: string,
): Promise<string> => {
  const response = await axiosAuth.post(
    `/api/staff/stores/${storeId}/contracts/signature-upload`,
    {
      signatureData: encryptedBase64,
    },
  );
  return response.data.signatureKey;
};

/**
 * 알바생이 서명한 계약서를 제출
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @param staffSignatureKey 암호화된 서명 키
 * @returns contractId (number)
 */
export const submitStaffContractSignature = async (
  storeId: number,
  contractId: number,
  staffSignatureKey: string,
): Promise<number> => {
  const response = await axiosAuth.post(
    `/api/staff/stores/${storeId}/contracts/${contractId}/sign`,
    {
      staffSignatureKey,
    },
  );
  return response.data.contractId;
};

/**
 * 알바생 계약서 상세 조회
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @returns ContractDetailResponse
 */
export const getStaffContractDetail = async (
  storeId: number,
  contractId: number,
): Promise<ContractDetailResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/contracts/${contractId}`,
  );
  return response.data;
};

/**
 * 알바생 계약서 PDF 보기용 URL 조회
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @returns PDF URL 및 만료일시
 */
export const fetchStaffContractPdfViewUrl = async (
  storeId: number,
  contractId: number,
): Promise<ContractPdfViewResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/contracts/${contractId}/view-url`,
  );
  return response.data;
};

/**
 * 알바생 계약서 PDF 다운로드용 URL 조회
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @returns PDF 다운로드 URL 및 만료일시
 */
export const fetchStaffContractPdfDownloadUrl = async (
  storeId: number,
  contractId: number,
): Promise<ContractPdfDownloadResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/contracts/${contractId}/download-url`,
  );
  return response.data;
};

/**
 * 알바생 근로계약서 요청 조회
 */
export const fetchStaffContracts = async (
  storeId: number,
): Promise<StaffContractSummary[]> => {
  const response = await axiosAuth.get<{ result: StaffContractSummary[] }>(
    `/api/staff/stores/${storeId}/contracts`,
  );
  return response.data.result;
};
