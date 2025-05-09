// src/routes/BossRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore";

const BossRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);

  if (isLoading) return <div>로딩 중...</div>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "BOSS") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default BossRoute;
