// src/stores/userStore.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  // 필요한 필드 추가
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
