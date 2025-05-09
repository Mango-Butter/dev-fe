// 알바생 매장 합류 (초대코드 입력 후 매장 등록)
import axiosAuth from "../axiosAuth.ts";

/** 초대코드로 매장 합류 요청 */
export const joinStoreAsStaff = async (
  inviteCode: string,
): Promise<{ storeId: number }> => {
  const response = await axiosAuth.post("/api/staff/stores", {
    inviteCode,
  });
  return response.data;
};
