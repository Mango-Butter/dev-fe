// src/hooks/useAuth.ts
import { useAuthStore } from "../stores/authStore";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [isLoading, setIsLoading] = useState(true);

  // 간단한 예: 비동기 로그인 검사 흉내 (예: refresh 요청이 필요한 경우 대비)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // 실제 비동기 로직이 있다면 여기서 처리

    return () => clearTimeout(timer);
  }, []);

  const isLoggedIn = !!accessToken;

  return {
    accessToken,
    isLoggedIn,
    isLoading,
  };
};
