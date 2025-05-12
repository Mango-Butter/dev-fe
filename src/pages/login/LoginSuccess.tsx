// src/pages/login/LoginSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithKakaoCode } from "../../api/common/auth.ts";
import { useLayout } from "../../hooks/useLayout.ts";
import { useAuthStore } from "../../stores/authStore";
import { useUserStore } from "../../stores/userStore";
import { fetchUserProfile } from "../../api/common/user.ts";

const LoginSuccess = () => {
  useLayout({
    headerVisible: false,
    bottomNavVisible: false,
  });

  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;

    const handleLogin = async () => {
      try {
        const { accessToken, refreshToken } = await loginWithKakaoCode(code);
        setTokens(accessToken, refreshToken);

        const user = await fetchUserProfile();
        setUser(user);

        if (user.role === "BOSS") {
          navigate("/boss");
        } else if (user.role === "STAFF") {
          navigate("/staff");
        } else {
          navigate("/signup");
        }
      } catch (err) {
        alert("로그인 실패");
        navigate("/login");
      }
    };

    handleLogin();
  }, [navigate, setTokens, setUser]);

  return <div className="text-center">로그인 처리 중...</div>;
};

export default LoginSuccess;
