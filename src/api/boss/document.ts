import {
  DocumentDownloadUrlResponse,
  DocumentViewUrlResponse,
  RequiredDocumentResponse,
  RequiredDocumentSetting,
  StaffDocumentStatusResponse,
  StaffDocumentSummary,
} from "../../types/document.ts";
import axiosAuth from "../common/axiosAuth.ts";

/**
 * 필수 제출 서류 설정 (사장님용)
 * @param storeId 매장 ID
 * @param payload 설정할 서류 배열
 * @returns 설정된 서류 리스트
 */
export const setRequiredDocuments = async (
  storeId: number,
  payload: RequiredDocumentSetting[],
): Promise<RequiredDocumentResponse> => {
  const res = await axiosAuth.post(
    `/api/boss/stores/${storeId}/documents/required`,
    payload,
  );
  return res.data;
};

/**
 * 필수 제출 서류 조회 (사장님용)
 * @param storeId 매장 ID
 * @returns 현재 설정된 필수 서류 목록
 */
export const getRequiredDocuments = async (
  storeId: number,
): Promise<RequiredDocumentResponse> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/documents/required`,
  );
  return res.data;
};

/**
 * 특정 서류에 대한 알바생 제출 현황 조회
 * @param storeId 매장 ID
 * @param documentType 서류 타입 (e.g. "ID_CARD")
 * @returns 해당 서류의 제출 여부 리스트
 */
export const getStaffDocumentStatuses = async (
  storeId: number,
  documentType: string,
): Promise<StaffDocumentStatusResponse> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/documents/types/${documentType}/staffs`,
  );
  return res.data;
};

/**
 * 특정 문서의 view URL 발급
 * @param storeId 매장 ID
 * @param documentId 문서 ID
 * @returns 문서 미리보기용 URL과 만료시간
 */
export const getDocumentViewUrl = async (
  storeId: number,
  documentId: number,
): Promise<DocumentViewUrlResponse> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/documents/${documentId}/view-url`,
  );
  return res.data;
};

/**
 * 특정 문서의 다운로드 URL 발급
 * @param storeId 매장 ID
 * @param documentId 문서 ID
 * @returns 다운로드 가능한 URL과 만료시간
 */
export const getDocumentDownloadUrl = async (
  storeId: number,
  documentId: number,
): Promise<DocumentDownloadUrlResponse> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/documents/${documentId}/download-url`,
  );
  return res.data;
};

/**
 * 특정 문서 삭제 (사장님 권한)
 * @param storeId 매장 ID
 * @param documentId 문서 ID
 */
export const deleteDocument = async (
  storeId: number,
  documentId: number,
): Promise<void> => {
  await axiosAuth.delete(`/api/boss/stores/${storeId}/documents/${documentId}`);
};

/**
 * 특정 알바생의 제출 서류 현황 조회
 * @param storeId 매장 ID
 * @param staffId 알바생 ID
 * @returns 각 서류 타입별 제출 여부 및 문서 정보
 */
export const getStaffDocumentSummary = async (
  storeId: number,
  staffId: number,
): Promise<StaffDocumentSummary[]> => {
  const res = await axiosAuth.get(
    `/api/boss/stores/${storeId}/documents/staffs/${staffId}`,
  );
  return res.data.result;
};
