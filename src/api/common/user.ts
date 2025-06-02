// src/api/user.ts
import axiosAuth from "./axiosAuth.ts";
import { User } from "../../types/user.ts";

export const fetchUserProfile = async (): Promise<User> => {
  const res = await axiosAuth.get<User>("/api/users/me");
  return res.data;
};

/**
 * FCM 토큰 등록 (알림 허용 후)
 * @param fcmToken FCM 디바이스 토큰
 * @returns 성공 여부
 */
export const registerFcmToken = async (fcmToken: string): Promise<void> => {
  await axiosAuth.post("/api/users/device-token", {
    fcmToken,
  });
};
