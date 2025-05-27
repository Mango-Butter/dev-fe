import axios from "axios";
import { toast } from "react-toastify";

const axiosBare = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

// ✅ 공통 에러 처리 인터셉터
axiosBare.interceptors.response.use(
  (response) => response,
  (error) => {
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

export default axiosBare;
