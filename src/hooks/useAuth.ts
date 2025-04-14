// src/hooks/useAuth.ts
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);

  const isLoggedIn = !!accessToken && !!user;
  const isLoading = accessToken !== null && user === null;

  return {
    isLoggedIn,
    isLoading,
  };
};
