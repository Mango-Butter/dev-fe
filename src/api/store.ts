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
