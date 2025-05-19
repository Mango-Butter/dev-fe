// src/apis/contract.ts
import axiosAuth from "../common/axiosAuth.ts";
import {
  BossContractSummary,
  ContractCreateRequest,
  ContractCreateResponse,
  ContractDetailResponse,
  ContractPdfDownloadResponse,
  ContractPdfViewResponse,
} from "../../types/contract.ts";

/**
 * 서명 이미지를 암호화한 문자열을 서버에 업로드하여 signatureKey 반환
 * @param storeId 매장 ID
 * @param encryptedBase64 암호화된 서명 base64 (IV + CipherText)
 * @returns signatureKey (string)
 */
export const uploadBossSignature = async (
  storeId: number,
  encryptedBase64: string,
): Promise<string> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/contracts/signature-upload`,
    {
      signatureData: encryptedBase64,
    },
  );
  return response.data.signatureKey;
};

// 계약서 생성 (사장 서명 포함)
export const createContract = async (
  storeId: number,
  payload: ContractCreateRequest,
): Promise<ContractCreateResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/contracts`,
    payload,
  );
  return response.data;
};

/**
 * 계약서 상세 조회
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @returns 계약서 상세 데이터
 */
export const fetchContractDetail = async (
  storeId: number,
  contractId: number,
): Promise<ContractDetailResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/contracts/${contractId}`,
  );
  return response.data;
};

/**
 * 근로계약서 리스트 조회 (사장용)
 * @param storeId 매장 ID
 * @returns 근로계약서 요약 목록
 */
export const fetchBossContractList = async (
  storeId: number,
): Promise<BossContractSummary[]> => {
  const response = await axiosAuth.get(`/api/boss/stores/${storeId}/contracts`);
  return response.data.result;
};

/**
 * 계약서 PDF 파일 보기용 URL 조회
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @returns PDF 파일의 S3 URL과 만료일시
 */
export const fetchContractPdfViewUrl = async (
  storeId: number,
  contractId: number,
): Promise<ContractPdfViewResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/contracts/${contractId}/view-url`,
  );
  return response.data;
};

/**
 * 계약서 PDF 파일 다운로드용 URL 조회
 * @param storeId 매장 ID
 * @param contractId 계약서 ID
 * @returns S3 다운로드 URL 및 만료일시
 */
export const fetchContractPdfDownloadUrl = async (
  storeId: number,
  contractId: number,
): Promise<ContractPdfDownloadResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/contracts/${contractId}/download-url`,
  );
  return response.data;
};
