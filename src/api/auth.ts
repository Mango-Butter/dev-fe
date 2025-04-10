// src/api/auth.ts
import axiosInstance from "./axiosInstance";
import { LoginResponse } from "../types/auth";

export const loginWithKakaoCode = async (
  authorizationCode: string,
): Promise<LoginResponse> => {
  const res = await axiosInstance.post("/api/auth/login/kakao", { authorizationCode });
  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  };
};
