// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore.ts";

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);

  if (isLoading) return <div>로딩 중...</div>;

  return isLoggedIn ? (
    user?.role === "BOSS" ? (
      <Navigate to="/boss" replace />
    ) : (
      <Navigate to="/staff" replace />
    )
  ) : (
    <Outlet />
  );
};

export default PublicRoute;
