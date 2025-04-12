// src/api/auth.ts
import axiosBare from "./axiosBare";
import { LoginResponse } from "../types/auth";

export const loginWithKakaoCode = async (
  authorizationCode: string,
): Promise<LoginResponse> => {
  const res = await axiosBare.post("/api/auth/login/kakao", {
    authorizationCode,
  });

  return {
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken,
  };
};
