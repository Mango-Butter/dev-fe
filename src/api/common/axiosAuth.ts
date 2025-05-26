import axios from "axios";
import { refreshAccessToken } from "./refreshAccessToken.ts";
import { toast } from "react-toastify"; // 추가

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // accessToken 만료 시 재발급 로직
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosAuth(originalRequest);
      } catch (refreshError) {
        toast.error("세션이 만료되었습니다. 다시 로그인해주세요.");
        return Promise.reject(refreshError);
      }
    }

    // 공통 에러 처리
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message) {
        toast.error(message);
      } else {
        toast.error("예상치 못한 오류가 발생했습니다.");
      }
    } else {
      toast.error("네트워크 오류 또는 알 수 없는 에러입니다.");
    }

    return Promise.reject(error);
  },
);

export default axiosAuth;
