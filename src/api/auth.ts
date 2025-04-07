// src/api/auth.ts
import axiosInstance from "./axiosInstance";
import { LoginResponse } from "../types/auth";

export const loginWithKakaoCode = async (
  code: string,
): Promise<LoginResponse> => {
  const res = await axiosInstance.post("/auth/kakao", { code });
  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  };
};
