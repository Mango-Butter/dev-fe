// 사업자등록번호 중복 검사
import axiosAuth from "../common/axiosAuth.ts";
import {
  AttendanceMethod,
  AttendanceSettings,
  GpsSettings,
  QrCodeSettings,
  ReissueInviteCodeResponse,
  StoreSummaryBoss,
  UpdateStoreInfoRequest,
} from "../../types/store.ts";

export const validateBusinessNumber = async (businessNumber: string) => {
  return await axiosAuth.post("/api/boss/stores/validations/business-number", {
    businessNumber,
  });
};

// 매장 등록
export const registerStore = async (store: {
  storeName: string;
  businessNumber: string;
  address: string;
  storeType: string;
  gps: {
    latitude: number;
    longitude: number;
  };
}): Promise<{ storeId: number }> => {
  const response = await axiosAuth.post("/api/boss/stores", store);
  return response.data;
};

// 매장 삭제
export const deleteStore = async (storeId: number): Promise<void> => {
  const response = await axiosAuth.delete(`/api/boss/stores/${storeId}`);
  return response.data;
};

//특정 매장 정보 가져오기
export const getStoreInfo = async (
  storeId: number,
): Promise<StoreSummaryBoss> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/store-info`,
  );
  return response.data;
};

//매장 정보 업데이트
export const updateStoreInfo = async (
  storeId: number,
  body: UpdateStoreInfoRequest,
): Promise<void> => {
  const response = await axiosAuth.put(
    `/api/boss/stores/${storeId}/store-info`,
    body,
  );
  return response.data;
};

// 사장 보유 매장 간단정보 리스트 가져오기
export const getStoreList = async (): Promise<StoreSummaryBoss[]> => {
  const response = await axiosAuth.get("/api/boss/stores");
  return response.data.result;
};

// 매장 초대코드 재발급
export const reissueInviteCode = async (
  storeId: number,
): Promise<ReissueInviteCodeResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/reissue-invite-code`,
  );
  return response.data;
};

//매장 출퇴근 방식 조회
export const getAttendanceSettings = async (
  storeId: number,
): Promise<AttendanceSettings> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/attendance-settings`,
  );
  return response.data;
};

//매장 출퇴근 방식 업데이트
export interface UpdateAttendanceSettingsResponse {
  attendanceMethod: AttendanceMethod;
}

export const updateAttendanceSettings = async (
  storeId: number,
  body: AttendanceSettings,
): Promise<UpdateAttendanceSettingsResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/attendance-settings`,
    body,
  );
  return response.data;
};

//매장 qr 방식 조회
export const getQrCodeSettings = async (
  storeId: number,
): Promise<QrCodeSettings> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/attendance-settings/qr`,
  );
  return response.data;
};

export const reissueQrCode = async (
  storeId: number,
): Promise<QrCodeSettings> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/attendance-settings/qr`,
  );
  return response.data;
};

//GPS설정 조회

export const getGpsSettings = async (storeId: number): Promise<GpsSettings> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/attendance-settings/gps`,
  );
  return response.data;
};

export const updateGpsSettings = async (
  storeId: number,
  body: GpsSettings,
): Promise<GpsSettings> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/attendance-settings/gps`,
    body,
  );
  return response.data;
};

import { StoreRequestSummary } from "../../types/store.ts";

// 매장 요청수 및 알바 프로필 이미지 일부 조회
export const getStoreRequestSummary = async (
  storeId: number,
): Promise<StoreRequestSummary> => {
  const response = await axiosAuth.get(`/api/boss/stores/${storeId}/requests`);
  return response.data;
};
