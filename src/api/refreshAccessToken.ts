// src/api/refreshAccessToken.ts
import { useAuthStore } from "../store/authStore";
import axiosBare from "./axiosBare.ts";

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;

  if (!refreshToken) {
    handleLogout("세션이 만료되었습니다.");
    throw new Error("Refresh token 없음");
  }

  try {
    const res = await axiosBare.patch("/api/auth/reissue-token", {
      refreshToken,
    });

    const newAccessToken = res.data.accessToken;
    useAuthStore.getState().setAccessToken(newAccessToken);
    return newAccessToken;
  } catch (error) {
    handleLogout("로그인이 만료되었습니다.");
    throw error;
  }
}

function handleLogout(message: string) {
  useAuthStore.getState().logout();
  alert(message);
  window.location.href = "/login";
}
