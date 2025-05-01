// src/api/auth.ts
import axiosBare from "./axiosBare";
import axiosAuth from "./axiosAuth";
import { LoginResponse, SignupResponse } from "../types/auth";

// 카카오 로그인
export const loginWithKakaoCode = async (
  authorizationCode: string,
): Promise<LoginResponse> => {
  const res = await axiosBare.post<LoginResponse>("/api/auth/login/kakao", {
    authorizationCode,
  });

  return res.data;
};

// 회원가입(역할 등록)
export const signup = async (
  role: "BOSS" | "STAFF",
): Promise<SignupResponse> => {
  const res = await axiosAuth.post<SignupResponse>("/api/users/sign-up", {
    role,
  });
  return res.data;
};
