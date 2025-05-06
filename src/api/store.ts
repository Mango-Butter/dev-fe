// 사업자등록번호 중복 검사
import axiosAuth from "./axiosAuth.ts";

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
}) => {
  return await axiosAuth.post("/api/boss/stores", store);
};

//특정 매장 정보 가져오기
export interface StoreInfo {
  storeName: string;
  businessNumber: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  address: string;
  inviteCode: string;
}

export const getStoreInfo = async (storeId: number): Promise<StoreInfo> => {
  const response = await axiosAuth.get(
    `/api/boss/stores/${storeId}/store-info`,
  );
  return response.data;
};

//매장 정보 업데이트
export interface UpdateStoreInfoRequest {
  address: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
}

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
export interface StoreSummary {
  storeId: number;
  storeName: string;
  businessNumber: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  address: string;
  inviteCode: string;
}

export const getStoreList = async (): Promise<StoreSummary[]> => {
  const response = await axiosAuth.get("/api/boss/stores");
  return response.data.result;
};

// 매장 초대코드 재발급
export interface ReissueInviteCodeResponse {
  inviteCode: string;
}

export const reissueInviteCode = async (
  storeId: number,
): Promise<ReissueInviteCodeResponse> => {
  const response = await axiosAuth.post(
    `/api/boss/stores/${storeId}/reissue-invite-code`,
  );
  return response.data;
};

//매장 출퇴근 방식 조회
export type AttendanceMethod = "QR" | "GPS" | "BOTH";

export interface AttendanceSettings {
  attendanceMethod: AttendanceMethod;
  qrCode: string;
  gpsRangeMeters: number;
  gpsLatitude: number;
  gpsLongitude: number;
}

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
export interface QrCodeSettings {
  storeId: number;
  qrCode: string;
}

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
export interface GpsSettings {
  address: string;
  gpsRangeMeters: number;
  gpsLatitude: number;
  gpsLongitude: number;
}

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
