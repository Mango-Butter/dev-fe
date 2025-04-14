// src/api/auth.ts
import axiosBare from "./axiosBare";
import { LoginResponse } from "../types/auth";

export const loginWithKakaoCode = async (
  authorizationCode: string,
): Promise<LoginResponse> => {
  const res = await axiosBare.post<LoginResponse>("/api/auth/login/kakao", {
    authorizationCode,
  });

  return res.data;
};
