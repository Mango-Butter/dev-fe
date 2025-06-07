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
  overtimeLimit: number;
}

export interface StoreSummaryBoss {
  storeId: number;
  storeName: string;
  businessNumber: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  address: string;
  inviteCode: string;
  overtimeLimit: number;
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

export interface StaffStore {
  storeId: number;
  storeName: string;
  address: string;
  storeType: "CAFE" | "RESTAURANT" | "CONVENIENCE_STORE";
  attendanceMethod: string;
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
}
