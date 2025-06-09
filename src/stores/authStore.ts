// src/stores/authStore.ts
import { create } from "zustand";
import { useUserStore } from "./userStore";
import { logoutFromServer } from "../api/common/auth.ts";
import useStoreStore from "./storeStore.ts";
import useStaffStoreStore from "./useStaffStoreStore.ts";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    set({ accessToken, refreshToken });
  },

  setAccessToken: (accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ accessToken });
  },

  logout: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    try {
      if (refreshToken) {
        await logoutFromServer(refreshToken);
      }
    } catch (err) {
      console.error("서버 로그아웃 실패:", err);
    }

    useUserStore.getState().clearUser();
    useStoreStore.getState().clearSelectedStore();
    useStaffStoreStore.getState().clearSelectedStore();

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("fcmToken");
    localStorage.removeItem("pwaInstallDismissed");
    localStorage.removeItem("selected-store");
    localStorage.removeItem("selected-staff-store");

    set({ accessToken: null, refreshToken: null });
  },
}));
