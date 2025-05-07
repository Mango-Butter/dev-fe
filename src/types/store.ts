export interface StoreInfo {
  storeName: string;
  businessNumber: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  address: string;
  inviteCode: string;
}

export interface UpdateStoreInfoRequest {
  address: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  gps: {
    latitude: number;
    longitude: number;
  };
}

export interface StoreSummary {
  storeId: number;
  storeName: string;
  businessNumber: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  address: string;
  inviteCode: string;
}

export interface ReissueInviteCodeResponse {
  inviteCode: string;
}

export type AttendanceMethod = "QR" | "GPS" | "BOTH";

export interface AttendanceSettings {
  attendanceMethod: AttendanceMethod;
}

export interface QrCodeSettings {
  storeId: number;
  qrCode: string;
}

export interface GpsSettings {
  address: string;
  gpsRangeMeters: number;
  gpsLatitude: number;
  gpsLongitude: number;
}
