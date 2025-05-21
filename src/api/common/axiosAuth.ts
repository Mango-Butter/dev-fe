import axios from "axios";
import { refreshAccessToken } from "./refreshAccessToken.ts";

const axiosAuth = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// ✅ 요청 인터셉터: accessToken 자동 부착
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 인터셉터: 토큰 재발급 + 공통 에러 메시지 처리
axiosAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ accessToken 만료 → 재발급 → 재요청
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosAuth(originalRequest);
      } catch (refreshError) {
        // 토큰 재발급도 실패한 경우: 따로 처리할 수 있음
        // 예: logout() 호출 등
        return Promise.reject(refreshError);
      }
    }

    // ✅ 공통 에러 메시지 alert 처리
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      if (message) {
        alert(message);
      } else {
        alert("예상치 못한 오류가 발생했습니다.");
      }
    } else {
      alert("네트워크 오류 또는 알 수 없는 에러입니다.");
    }

    return Promise.reject(error); // catch 블록에서 사용 가능하도록 reject 유지
  },
);

export default axiosAuth;
