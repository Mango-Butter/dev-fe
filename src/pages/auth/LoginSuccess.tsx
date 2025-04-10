// src/pages/auth/LoginSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithKakaoCode } from "../../api/auth";
import { useAuthStore } from "../../store/authStore.ts";

const LoginSuccess = () => {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    const fetchJWT = async () => {
      try {
        const res = await loginWithKakaoCode(code);
        // ✅ 백엔드에서 refreshToken도 함께 반환해야 함
        setTokens(res.accessToken, res.refreshToken);
        navigate("/");
      } catch (err) {
        alert("로그인 실패");
        navigate("/login");
      }
    };

    fetchJWT();
  }, [navigate, setTokens]);

  return <div className="p-4 text-center">로그인 처리 중...</div>;
};

export default LoginSuccess;
