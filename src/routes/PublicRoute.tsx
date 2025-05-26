// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore.ts";
import FullScreenLoading from "../components/common/FullScreenLoading.tsx";

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);

  if (isLoading) return <FullScreenLoading />;

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
