// src/routes/RoleRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore";

interface RoleRouteProps {
  allowedRole: "BOSS" | "STAFF";
}

const RoleRoute = ({ allowedRole }: RoleRouteProps) => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (isLoading) return <div>로딩 중...</div>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (user?.role !== allowedRole) {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
