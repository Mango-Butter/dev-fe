// src/types/login.ts
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface SignupResponse {
  grantType: string;
  accessToken: string;
  refreshToken: string;
}
