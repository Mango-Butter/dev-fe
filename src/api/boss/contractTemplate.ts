import axiosAuth from "../common/axiosAuth";
import {
  CreateContractTemplateRequest,
  FetchContractTemplateDetailResponse,
  FetchContractTemplateListResponse,
  UpdateContractTemplateResponse,
} from "../../types/contractTemplate.ts";

/**
 * 근로계약 템플릿 생성
 * @param storeId 매장 ID
 * @param payload 템플릿 제목 및 내용
 * @returns 성공 시 void 반환 (200 OK)
 */
export const createContractTemplate = async (
  storeId: number,
  payload: CreateContractTemplateRequest,
): Promise<void> => {
  await axiosAuth.post(
    `/api/boss/stores/${storeId}/contracts/templates`,
    payload,
  );
};

/**
 * 근로계약서 템플릿 목록 조회
 * @param storeId 매장 ID
 * @returns 템플릿 목록 배열
 */
export const fetchContractTemplateList = async (
  storeId: number,
): Promise<FetchContractTemplateListResponse> => {
  const response = await axiosAuth.get(`/api/boss/stores/${storeId}/templates`);
  return response.data;
};

/**
 * 근로계약서 템플릿 수정
 * @param storeId 매장 ID
 * @param templateId 템플릿 ID
 * @param payload 수정할 데이터
 * @returns 수정된 템플릿 정보
 */
export const updateContractTemplate = async (
  storeId: number,
  templateId: number,
  payload: CreateContractTemplateRequest,
): Promise<UpdateContractTemplateResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/templates/${templateId}`,
    payload,
  );
  return response.data;
};

/**
 * 근로계약서 템플릿 단일 조회
 * @param storeId 매장 ID
 * @param templateId 템플릿 ID
 * @returns 템플릿 제목과 상세 데이터
 */
export const fetchContractTemplateDetail = async (
  storeId: number,
  templateId: number,
): Promise<FetchContractTemplateDetailResponse> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/templates/${templateId}`,
  );
  return response.data;
};

/**
 * 근로계약서 템플릿 삭제
 * @param storeId 매장 ID
 * @param templateId 템플릿 ID
 * @returns 성공 시 아무 값도 반환하지 않음 (200 OK)
 */
export const deleteContractTemplate = async (
  storeId: number,
  templateId: number,
): Promise<void> => {
  await axiosAuth.delete(`/api/boss/stores/${storeId}/templates/${templateId}`);
};
