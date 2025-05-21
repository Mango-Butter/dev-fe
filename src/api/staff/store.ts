// 알바생 매장 합류 (초대코드 입력 후 매장 등록)
import axiosAuth from "../common/axiosAuth.ts";
import { StaffStore } from "../../types/store.ts";

/** 초대코드로 매장 합류 요청 */
export const joinStoreAsStaff = async (
  inviteCode: string,
): Promise<{ storeId: number }> => {
  const response = await axiosAuth.post("/api/staff/stores", {
    inviteCode,
  });
  return response.data;
};

/** 알바생이 속한 매장 목록 조회 */
export const fetchStaffStores = async (): Promise<StaffStore[]> => {
  const response = await axiosAuth.get<{ result: StaffStore[] }>(
    "/api/staff/stores",
  );
  return response.data.result;
};

/**
 * 알바생 - 특정 매장의 정보 조회
 * @param storeId 매장 ID
 * @returns StaffStore (storeId, storeName, address, storeType, attendanceMethod)
 */
export const getStaffStoreInfo = async (
  storeId: number,
): Promise<StaffStore> => {
  const res = await axiosAuth.get(`/api/staff/stores/${storeId}/store-info`);
  return res.data;
};
