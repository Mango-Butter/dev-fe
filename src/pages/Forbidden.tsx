// src/pages/Forbidden.tsx
import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // 2초 후 사용자 홈으로 이동
    const timer = setTimeout(() => {
      if (user?.role === "BOSS") navigate("/boss", { replace: true });
      else if (user?.role === "STAFF") navigate("/staff", { replace: true });
      else navigate("/", { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-2xl font-semibold mb-2">⚠️ 접근 권한이 없습니다.</h1>
      <p className="text-gray-600">홈으로 이동 중입니다...</p>
    </div>
  );
};

export default Forbidden;
