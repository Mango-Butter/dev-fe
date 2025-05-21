import axiosAuth from "../common/axiosAuth.ts";
import {
  DocumentDownloadUrlResponse,
  DocumentViewUrlResponse,
  StaffDocumentSummary,
  UploadDocumentRequest,
  UploadDocumentResponse,
} from "../../types/document.ts";

/**
 * 알바생 서류 업로드
 * @param storeId 매장 ID
 * @param body 업로드할 문서 데이터
 * @returns 업로드된 문서 정보
 */
export const uploadStaffDocument = async (
  storeId: number,
  body: UploadDocumentRequest,
): Promise<UploadDocumentResponse> => {
  const response = await axiosAuth.post(
    `/api/staff/stores/${storeId}/documents/upload`,
    body,
  );
  return response.data;
};

/**
 * 알바생 제출 서류 목록 조회
 * @param storeId 매장 ID
 * @returns 제출 서류 요약 목록
 */
export const getStaffDocumentSummary = async (
  storeId: number,
): Promise<StaffDocumentSummary[]> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/documents`,
  );
  return response.data.result;
};

/**
 * 알바생 서류 파일 조회 URL 요청
 * @param storeId 매장 ID
 * @param documentId 문서 ID
 * @returns 서류 뷰어용 URL (일정 시간 후 만료됨)
 */
export const getStaffDocumentViewUrl = async (
  storeId: number,
  documentId: number,
): Promise<DocumentViewUrlResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/documents/${documentId}/view-url`,
  );
  return response.data;
};

/**
 * 알바생 서류 파일 다운로드 URL 요청
 * @param storeId 매장 ID
 * @param documentId 문서 ID
 * @returns 서류 다운로드용 URL (일정 시간 후 만료됨)
 */
export const getStaffDocumentDownloadUrl = async (
  storeId: number,
  documentId: number,
): Promise<DocumentDownloadUrlResponse> => {
  const response = await axiosAuth.get(
    `/api/staff/stores/${storeId}/documents/${documentId}/download-url`,
  );
  return response.data;
};

/**
 * 알바생 제출 서류 삭제
 * @param storeId 매장 ID
 * @param documentId 문서 ID
 * @returns void
 */
export const deleteStaffDocument = async (
  storeId: number,
  documentId: number,
): Promise<void> => {
  await axiosAuth.delete(
    `/api/staff/stores/${storeId}/documents/${documentId}`,
  );
};
